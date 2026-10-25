// "Your answers stay private until you've both finished a part" — proven
// end to end against the RTDB emulator (design refresh, recommendation 5).
//
// Two partners and an outsider. Clients go through database.rules.json exactly
// as the app does; publishing runs the REAL publishPart Cloud Function code
// (functions/src/index.ts) with the admin SDK pointed at the same emulator, so
// what's proven is the code that ships, not a re-implementation of it.
//
// Requires the emulator on :9000 — `npm run test:rules` starts one.
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { ref, get, set, update } from "firebase/database";
import { lvlQs } from "./leveling";
import { overall, knowScore, jointQuestions, type DeckData } from "./scoring";

const PROJECT = "twoagree-privacy-test";
const HOST = "sarah-uid";
const GUEST = "judah-uid";
const OUTSIDER = "outsider-uid";
const CODE = "PRIV";
// The onboarding starter deck: its first part is the five starter questions.
const SLUG = "fun-icebreakers";

// Point the admin SDK (used by the function code) at the emulator BEFORE the
// functions module initialises its app.
process.env.FIREBASE_DATABASE_EMULATOR_HOST = "127.0.0.1:9000";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.GCLOUD_PROJECT = PROJECT;
process.env.FIREBASE_CONFIG = JSON.stringify({
  projectId: PROJECT,
  databaseURL: `http://127.0.0.1:9000/?ns=${PROJECT}`,
});

type Callable = { run: (req: unknown) => Promise<unknown> };
let publishPart: Callable;
let generatePath: Callable;
let exportMyData: Callable;
let deleteMyAccount: Callable;
let env: RulesTestEnvironment;

const asUser = (uid: string) => env.authenticatedContext(uid).database();
const call = (uid: string, data: Record<string, unknown>) =>
  publishPart.run({ auth: { uid }, data, rawRequest: {} });

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: PROJECT,
    database: {
      host: "127.0.0.1",
      port: 9000,
      rules: readFileSync("database.rules.json", "utf8"),
    },
  });
  const fns = await import("../../functions/src/index");
  publishPart = fns.publishPart as unknown as Callable;
  generatePath = fns.generatePath as unknown as Callable;
  exportMyData = fns.exportMyData as unknown as Callable;
  deleteMyAccount = fns.deleteMyAccount as unknown as Callable;
});

afterAll(async () => await env.cleanup());

beforeEach(async () => {
  await env.clearDatabase();
  await env.withSecurityRulesDisabled(async (ctx) => {
    await set(ref(ctx.database(), `sessions/${CODE}`), {
      created: 1,
      members: {
        host: { name: "Sarah", uid: HOST },
        guest: { name: "Judah", uid: GUEST },
      },
      uids: { [HOST]: true, [GUEST]: true },
    });
  });
});

const part0 = lvlQs(SLUG, 0);
const part1 = lvlQs(SLUG, 1);
// What each of them answers, guesses and rates. Values differ on purpose so a
// mix-up between roles would show.
const answerOf = (role: "host" | "guest", i: number) =>
  role === "host" ? i % 2 : (i + 1) % 2;

/** Everything one partner does in a part, through the client rules. */
async function playPart(uid: string, role: "host" | "guest", level: number, finish: boolean) {
  const db = asUser(uid);
  const qs = lvlQs(SLUG, level);
  for (const [i, q] of qs.entries()) {
    const value = q.type === "open" ? `Written by ${role} ${i}` : answerOf(role, i);
    await assertSucceeds(
      update(ref(db), {
        [`private/${uid}/${CODE}/decks/${SLUG}/answers/${q.id}`]: value,
        [`sessions/${CODE}/decks/${SLUG}/started/${level}/${role}`]: true,
      }),
    );
    if (q.guessable) {
      await assertSucceeds(
        set(ref(db, `private/${uid}/${CODE}/decks/${SLUG}/guesses/${q.id}`), answerOf(role, i + 1)),
      );
    }
    await assertSucceeds(
      set(ref(db, `private/${uid}/${CODE}/decks/${SLUG}/importance/${q.id}`), 3),
    );
  }
  if (finish) {
    await assertSucceeds(set(ref(db, `sessions/${CODE}/decks/${SLUG}/done/${level}/${role}`), true));
  }
}

/** Every route a client has to someone else's answers. */
async function assertCannotSee(readerUid: string, authorUid: string, authorRole: "host" | "guest", level: number) {
  const db = asUser(readerUid);
  await assertFails(get(ref(db, `private/${authorUid}`)));
  await assertFails(get(ref(db, `private/${authorUid}/${CODE}`)));
  await assertFails(get(ref(db, `private/${authorUid}/${CODE}/decks/${SLUG}`)));
  for (const q of lvlQs(SLUG, level)) {
    await assertFails(get(ref(db, `private/${authorUid}/${CODE}/decks/${SLUG}/answers/${q.id}`)));
    await assertFails(get(ref(db, `private/${authorUid}/${CODE}/decks/${SLUG}/guesses/${q.id}`)));
    await assertFails(get(ref(db, `private/${authorUid}/${CODE}/decks/${SLUG}/importance/${q.id}`)));
  }
  // The shared session is readable to a member, and holds nothing of the
  // author's for this part.
  const shared = await get(ref(db, `sessions/${CODE}/decks/${SLUG}`)).catch(() => null);
  const deck = (shared?.val() ?? {}) as DeckData;
  for (const q of lvlQs(SLUG, level)) {
    expect(deck.answers?.[q.id]?.[authorRole]).toBeUndefined();
    expect(deck.guesses?.[q.id]?.[authorRole]).toBeUndefined();
    expect(deck.importance?.[q.id]?.[authorRole]).toBeUndefined();
  }
}

describe("an unopened part: nobody reads the other's answers", () => {
  it("hides Sarah's finished part from Judah while he is still answering", async () => {
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, false);
    await assertCannotSee(GUEST, HOST, "host", 0);
    await assertCannotSee(HOST, GUEST, "guest", 0);
  });

  it("partner status still works: started and done flags are shared", async () => {
    await playPart(HOST, "host", 0, true);
    const snap = await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}`));
    expect(snap.val().started[0].host).toBe(true);
    expect(snap.val().done[0].host).toBe(true);
  });

  it("asking the server to publish early does nothing", async () => {
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, false);
    // Either partner can ask; the server refuses until both are done.
    expect(await call(GUEST, { code: CODE, slug: SLUG, level: 0 })).toEqual({
      status: "waiting",
      reason: "not-both-done",
    });
    expect(await call(HOST, { code: CODE, slug: SLUG, level: 0 })).toMatchObject({ status: "waiting" });
    await assertCannotSee(GUEST, HOST, "host", 0);
  });

  it("Judah can't forge Sarah's done flag, or his own way into the shared answers", async () => {
    await playPart(HOST, "host", 0, false);
    const db = asUser(GUEST);
    const q = part0[0].id;
    await assertFails(set(ref(db, `sessions/${CODE}/decks/${SLUG}/done/0/host`), true));
    await assertFails(set(ref(db, `sessions/${CODE}/decks/${SLUG}/started/0/host`), true));
    await assertFails(set(ref(db, `sessions/${CODE}/decks/${SLUG}/answers/${q}/guest`), 1));
    await assertFails(set(ref(db, `sessions/${CODE}/decks/${SLUG}/answers/${q}/host`), 1));
    await assertFails(set(ref(db, `sessions/${CODE}/decks/${SLUG}/published/0`), true));
    await assertFails(set(ref(db, `sessions/${CODE}/pathPublished/0`), true));
    // Nor write into Sarah's private space.
    await assertFails(set(ref(db, `private/${HOST}/${CODE}/decks/${SLUG}/answers/${part0[1].id}`), 1));
  });

  it("you can revise your own answer until the part opens, only in a session you're in, only as a value", async () => {
    // The guess screen's "change" (item 12): before the part opens, your
    // private answer is yours to correct.
    await playPart(HOST, "host", 0, false);
    const db = asUser(HOST);
    const q = part0[0].id;
    await assertSucceeds(set(ref(db, `private/${HOST}/${CODE}/decks/${SLUG}/answers/${q}`), 4));
    await assertFails(set(ref(db, `private/${HOST}/ELSE/decks/${SLUG}/answers/${q}`), 1));
    await assertFails(set(ref(db, `private/${HOST}/${CODE}/decks/${SLUG}/notes/${q}`), 1));
    await assertFails(set(ref(db, `private/${HOST}/${CODE}/decks/${SLUG}/answers/${part1[0].id}`), { x: 1 }));
    // Still nobody else's to read.
    await assertCannotSee(GUEST, HOST, "host", 0);
  });

  it("once a part opens, a shared answer never changes, whatever the private copy says", async () => {
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, true);
    await call(GUEST, { code: CODE, slug: SLUG, level: 0 });
    const q = part0.find((x) => x.type !== "open")!.id;
    const before = (await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}/answers/${q}`))).val();
    // Sarah revises her private copy after the reveal and asks to publish again.
    await assertSucceeds(set(ref(asUser(HOST), `private/${HOST}/${CODE}/decks/${SLUG}/answers/${q}`), 4));
    expect(await call(HOST, { code: CODE, slug: SLUG, level: 0 })).toEqual({ status: "published" });
    const after = (await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}/answers/${q}`))).val();
    expect(after).toEqual(before);
    // And no client can write the shared copy directly.
    await assertFails(set(ref(asUser(HOST), `sessions/${CODE}/decks/${SLUG}/answers/${q}/host`), 4));
  });

  it("a new session can't be created with answers, flags or a guest already in it", async () => {
    const db = asUser(HOST);
    const base = { created: 1, "members/host/name": "Sarah", "members/host/uid": HOST, [`uids/${HOST}`]: true };
    await assertSucceeds(update(ref(db, "sessions/NEW1"), base));
    await assertFails(update(ref(db, "sessions/NEW2"), { ...base, [`decks/${SLUG}/answers/${part0[0].id}/guest`]: 1 }));
    await assertFails(update(ref(db, "sessions/NEW3"), { ...base, [`decks/${SLUG}/done/0/guest`]: true }));
    await assertFails(update(ref(db, "sessions/NEW4"), { ...base, "members/guest/uid": GUEST }));
    await assertFails(update(ref(db, "sessions/NEW5"), { ...base, "pathDone/0/guest": true }));
    await assertFails(update(ref(db, "sessions/NEW6"), { ...base, "members/host/uid": GUEST }));
  });
});

describe("a published part: both read it, the outsider reads nothing", () => {
  it("opens the part to both once the second 'done' lands, and only that part", async () => {
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, true);
    // Sarah has started part 2 as well; that must stay hers.
    await playPart(HOST, "host", 1, false);

    expect(await call(GUEST, { code: CODE, slug: SLUG, level: 0 })).toEqual({ status: "published" });

    for (const uid of [HOST, GUEST]) {
      const deck = (await get(ref(asUser(uid), `sessions/${CODE}/decks/${SLUG}`))).val() as DeckData & {
        published?: Record<string, boolean>;
      };
      expect(deck.published?.[0]).toBe(true);
      for (const [i, q] of part0.entries()) {
        const want = (role: "host" | "guest") =>
          q.type === "open" ? `Written by ${role} ${i}` : answerOf(role, i);
        expect(deck.answers?.[q.id]).toEqual({ host: want("host"), guest: want("guest") });
        expect(deck.importance?.[q.id]).toEqual({ host: 3, guest: 3 });
        if (q.guessable) {
          expect(deck.guesses?.[q.id]).toEqual({ host: answerOf("host", i + 1), guest: answerOf("guest", i + 1) });
        }
      }
    }
    // Part 2 is still unopened: Judah can't see Sarah's answers there.
    await assertCannotSee(GUEST, HOST, "host", 1);
  });

  it("the outsider reads nothing, before or after, and can't ask to publish", async () => {
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, true);
    const out = asUser(OUTSIDER);
    const routes = [
      `sessions/${CODE}`,
      `sessions/${CODE}/decks`,
      `sessions/${CODE}/decks/${SLUG}/answers`,
      `private/${HOST}`,
      `private/${GUEST}`,
      `private/${HOST}/${CODE}`,
      `private/${GUEST}/${CODE}`,
    ];
    for (const p of routes) await assertFails(get(ref(out, p)));
    await expect(call(OUTSIDER, { code: CODE, slug: SLUG, level: 0 })).rejects.toThrow(/not in this session/);
    await call(HOST, { code: CODE, slug: SLUG, level: 0 });
    for (const p of routes) await assertFails(get(ref(out, p)));
    // A signed-out visitor too.
    const anon = env.unauthenticatedContext().database();
    for (const p of routes) await assertFails(get(ref(anon, p)));
  });

  it("publishing is idempotent and the reveal's scores come out exactly as before", async () => {
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, true);
    await call(HOST, { code: CODE, slug: SLUG, level: 0 });
    await call(GUEST, { code: CODE, slug: SLUG, level: 0 });

    // The same answers laid out the way the shared session always held them.
    const expected: DeckData = { answers: {}, guesses: {}, importance: {}, done: { 0: { host: true, guest: true } } };
    for (const [i, q] of part0.entries()) {
      const val = (r: "host" | "guest") => (q.type === "open" ? `Written by ${r} ${i}` : answerOf(r, i));
      expected.answers![q.id] = { host: val("host"), guest: val("guest") };
      expected.importance![q.id] = { host: 3, guest: 3 };
      if (q.guessable) expected.guesses![q.id] = { host: answerOf("host", i + 1), guest: answerOf("guest", i + 1) };
    }
    const deck = (await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}`))).val() as DeckData;
    for (const role of ["host", "guest"] as const) {
      const qs = jointQuestions(part0, deck);
      expect(qs.length).toBe(jointQuestions(part0, expected).length);
      expect(overall(qs, deck, role)).toBe(overall(jointQuestions(part0, expected), expected, role));
      expect(knowScore(part0, deck, role)).toEqual(knowScore(part0, expected, role));
    }
  });
});

describe("the Path: steps and their written 'At the table' answers use the same route", () => {
  const qids = [part1[0].id, part1[1].id];
  const seedPath = () =>
    env.withSecurityRulesDisabled(async (ctx) => {
      await update(ref(ctx.database(), `sessions/${CODE}`), {
        "path/steps/0/key": "table",
        "path/steps/0/mechanic": "guess",
        "path/steps/0/qids": qids,
      });
    });
  const walk = async (uid: string, role: "host" | "guest", finish: boolean) => {
    const db = asUser(uid);
    for (const [i, qid] of qids.entries()) {
      await assertSucceeds(set(ref(db, `private/${uid}/${CODE}/decks/${SLUG}/answers/${qid}`), answerOf(role, i)));
    }
    await assertSucceeds(set(ref(db, `private/${uid}/${CODE}/decks/at-table/answers/table`), `${role} at the table`));
    if (finish) await assertSucceeds(set(ref(db, `sessions/${CODE}/pathDone/0/${role}`), true));
  };

  it("keeps a step private until both have walked it, then opens it to both", async () => {
    await seedPath();
    await walk(HOST, "host", true);
    await walk(GUEST, "guest", false);

    expect(await call(HOST, { code: CODE, step: 0 })).toMatchObject({ status: "waiting" });
    await assertFails(get(ref(asUser(GUEST), `private/${HOST}/${CODE}/decks/at-table`)));
    const before = (await get(ref(asUser(GUEST), `sessions/${CODE}/decks`))).val();
    expect(before).toBeNull();
    await assertFails(set(ref(asUser(GUEST), `sessions/${CODE}/pathDone/0/host`), true));

    await assertSucceeds(set(ref(asUser(GUEST), `sessions/${CODE}/pathDone/0/guest`), true));
    expect(await call(GUEST, { code: CODE, step: 0 })).toEqual({ status: "published" });

    for (const uid of [HOST, GUEST]) {
      const s = (await get(ref(asUser(uid), `sessions/${CODE}`))).val();
      expect(s.pathPublished[0]).toBe(true);
      expect(s.decks["at-table"].answers.table).toEqual({ host: "host at the table", guest: "guest at the table" });
      for (const [i, qid] of qids.entries()) {
        expect(s.decks[SLUG].answers[qid]).toEqual({ host: answerOf("host", i), guest: answerOf("guest", i) });
      }
    }
    for (const p of [`sessions/${CODE}`, `private/${HOST}`, `private/${GUEST}`]) {
      await assertFails(get(ref(asUser(OUTSIDER), p)));
    }
  });
});

describe("export and delete cover the private space", () => {
  it("your export includes your unpublished answers and never your partner's", async () => {
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, false);
    const out = (await exportMyData.run({ auth: { uid: GUEST }, data: null, rawRequest: {} })) as {
      sessions: Record<string, { decks: Record<string, { answers?: Record<string, unknown> }> }>;
    };
    const answers = out.sessions[CODE].decks[SLUG].answers!;
    for (const [i, q] of part0.entries()) {
      const want = q.type === "open" ? `Written by guest ${i}` : answerOf("guest", i);
      expect(answers[q.id]).toEqual(want);
    }
    expect(JSON.stringify(out)).not.toContain("Written by host");
  });

  it("deleting your account removes your private space, and your partner's stays", async () => {
    const { getAuth } = await import("../../functions/node_modules/firebase-admin/lib/auth/index.js");
    await getAuth().createUser({ uid: GUEST }).catch(() => {});
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, false);
    await deleteMyAccount.run({ auth: { uid: GUEST }, data: null, rawRequest: {} });
    await env.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.database();
      expect((await get(ref(db, `private/${GUEST}`))).val()).toBeNull();
      expect((await get(ref(db, `private/${HOST}/${CODE}`))).val()).not.toBeNull();
      const s = (await get(ref(db, `sessions/${CODE}`))).val();
      expect(s.uids[GUEST]).toBeUndefined();
      expect(s.decks[SLUG].started[0].guest).toBeUndefined();
    });
  });
});

describe("the one-off migration of existing sessions", () => {
  it("moves unopened answers into private spaces, keeps opened parts shared, and the app carries on", async () => {
    const { migrateAll } = await import("../../functions/src/migratePrivate");
    const { getDatabase } = await import("../../functions/node_modules/firebase-admin/lib/database/index.js");
    // A session written by the old client: everything in the shared node.
    const legacy: Record<string, unknown> = {};
    part0.forEach((q, i) => {
      legacy[`decks/${SLUG}/answers/${q.id}`] = { host: answerOf("host", i), guest: answerOf("guest", i) };
    });
    part1.forEach((q, i) => {
      legacy[`decks/${SLUG}/answers/${q.id}/host`] = answerOf("host", i);
    });
    legacy[`decks/${SLUG}/done/0`] = { host: true, guest: true };
    legacy[`decks/${SLUG}/done/1`] = { host: true };
    await env.withSecurityRulesDisabled(async (ctx) => {
      await update(ref(ctx.database(), `sessions/${CODE}`), legacy);
    });

    const dry = await migrateAll(getDatabase() as never, { apply: false });
    expect(dry.find((r) => r.code === CODE)!.moved).toBe(part1.length);
    // A dry run writes nothing.
    await assertSucceeds(get(ref(asUser(GUEST), `sessions/${CODE}`)));
    expect((await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}/answers/${part1[0].id}`))).val()).not.toBeNull();

    await migrateAll(getDatabase() as never, { apply: true });

    // Part 2 (unopened) is now Sarah's alone; part 1 (opened) is shared and published.
    await assertCannotSee(GUEST, HOST, "host", 1);
    const mine = (await get(ref(asUser(HOST), `private/${HOST}/${CODE}/decks/${SLUG}/answers`))).val();
    expect(Object.keys(mine).sort()).toEqual(part1.map((q) => q.id).sort());
    const shared = (await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}`))).val();
    expect(shared.published[0]).toBe(true);
    expect(shared.started[1].host).toBe(true);
    expect(shared.answers[part0[0].id]).toEqual({ host: answerOf("host", 0), guest: answerOf("guest", 0) });

    // Running it again changes nothing.
    const again = await migrateAll(getDatabase() as never, { apply: true });
    expect(again.find((r) => r.code === CODE)!.writes).toBe(0);

    // Judah finishes part 2 in the new app; it opens with Sarah's moved answers.
    await playPart(GUEST, "guest", 1, true);
    expect(await call(GUEST, { code: CODE, slug: SLUG, level: 1 })).toEqual({ status: "published" });
    const after = (await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}/answers`))).val();
    part1.forEach((q, i) => expect(after[q.id].host).toBe(answerOf("host", i)));
  });
});

describe("the one-off fresh start for the Oct 2026 bank", () => {
  it("clears every answer, the Path and both private spaces, keeps the couple, and they start again", async () => {
    const { migrateFreshAll } = await import("../../functions/src/migrateFresh");
    const { getDatabase } = await import("../../functions/node_modules/firebase-admin/lib/database/index.js");
    // Mid-way through the old bank: part 1 published, Sarah half-way through
    // part 2 in her private space, a Path laid, and a date set to meet.
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, true);
    expect(await call(GUEST, { code: CODE, slug: SLUG, level: 0 })).toEqual({ status: "published" });
    await playPart(HOST, "host", 1, false);
    await env.withSecurityRulesDisabled(async (ctx) => {
      await update(ref(ctx.database(), `sessions/${CODE}`), {
        path: { generatedAt: 1, steps: { 0: { key: "trailhead", qids: [part0[0].id] } } },
        "pathDone/0": { host: true },
        "pathLamps/0": true,
        meetAt: 1234,
      });
      await set(ref(ctx.database(), `intake/${HOST}/stage`), 1);
    });

    const dry = await migrateFreshAll(getDatabase() as never, { apply: false });
    expect(dry.find((r) => r.code === CODE)!.writes).toBeGreaterThan(0);
    // A dry run writes nothing.
    expect((await get(ref(asUser(HOST), `private/${HOST}/${CODE}`))).val()).not.toBeNull();

    await migrateFreshAll(getDatabase() as never, { apply: true });

    const s = (await get(ref(asUser(GUEST), `sessions/${CODE}`))).val();
    expect(s.decks).toBeUndefined();
    expect(s.path).toBeUndefined();
    expect(s.pathDone).toBeUndefined();
    expect(s.pathLamps).toBeUndefined();
    expect(s.members.host).toEqual({ name: "Sarah", uid: HOST });
    expect(s.uids).toEqual({ [HOST]: true, [GUEST]: true });
    expect(s.meetAt).toBe(1234);
    expect((await get(ref(asUser(HOST), `private/${HOST}/${CODE}`))).val()).toBeNull();
    expect((await get(ref(asUser(GUEST), `private/${GUEST}/${CODE}`))).val()).toBeNull();
    expect((await get(ref(asUser(HOST), `intake/${HOST}/stage`))).val()).toBe(1);

    // Running it again changes nothing.
    const again = await migrateFreshAll(getDatabase() as never, { apply: true });
    expect(again.find((r) => r.code === CODE)!.writes).toBe(0);

    // They start the new bank from part 1, and it opens as normal.
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, true);
    expect(await call(HOST, { code: CODE, slug: SLUG, level: 0 })).toEqual({ status: "published" });
    const after = (await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}/answers`))).val();
    part0.forEach((q, i) => expect(after[q.id].host).toBe(q.type === "open" ? `Written by host ${i}` : answerOf("host", i)));
  });
});

describe("the reveal's line and verse", () => {
  it("is picked once when a part opens, the same for both, and never the couple's last pick", async () => {
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, true);
    await call(GUEST, { code: CODE, slug: SLUG, level: 0 });
    const a = (await get(ref(asUser(HOST), `sessions/${CODE}/decks/${SLUG}/pick/0`))).val();
    const b = (await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}/pick/0`))).val();
    expect(a).toEqual(b);
    expect(a.line).toBeGreaterThanOrEqual(0);
    // Publishing again never re-picks.
    await call(HOST, { code: CODE, slug: SLUG, level: 0 });
    expect((await get(ref(asUser(HOST), `sessions/${CODE}/decks/${SLUG}/pick/0`))).val()).toEqual(a);
    // The next part to open avoids the previous line and verse.
    await playPart(HOST, "host", 1, true);
    await playPart(GUEST, "guest", 1, true);
    await call(HOST, { code: CODE, slug: SLUG, level: 1 });
    const next = (await get(ref(asUser(GUEST), `sessions/${CODE}/decks/${SLUG}/pick/1`))).val();
    expect(next.line).not.toBe(a.line);
    expect(next.verse).not.toBe(a.verse);
    // Nobody can choose their own.
    await assertFails(set(ref(asUser(HOST), `sessions/${CODE}/decks/${SLUG}/pick/1`), { line: 0, verse: 0 }));
    await assertFails(set(ref(asUser(HOST), `sessions/${CODE}/lastPick`), { line: 0, verse: 0 }));
  });
});

describe("Talk it through: the shared note and the date you talked", () => {
  const QID = part0[0].id;
  const base = `sessions/${CODE}/decks/${SLUG}/talks/${QID}`;
  const tick = (uid: string, role: "host" | "guest", note?: string) =>
    update(ref(asUser(uid)), {
      [`${base}/talked/${role}`]: true,
      [`${base}/at/${role}`]: { ".sv": "timestamp" },
      ...(note ? { [`${base}/note/${role}`]: note } : {}),
    });

  it("each of you writes your own tick and note; both read them; nobody writes the other's", async () => {
    await assertSucceeds(tick(HOST, "host", "One joint account for bills"));
    await assertSucceeds(tick(GUEST, "guest"));
    const seen = (await get(ref(asUser(GUEST), base))).val();
    expect(seen.note.host).toBe("One joint account for bills");
    expect(seen.talked).toEqual({ host: true, guest: true });
    expect(typeof seen.at.host).toBe("number");
    await assertFails(set(ref(asUser(GUEST), `${base}/note/host`), "Not what Sarah wrote"));
    await assertFails(set(ref(asUser(HOST), `${base}/at/guest`), 1));
  });

  it("the outsider can neither read nor write it; a long note or a future date is refused", async () => {
    await assertSucceeds(tick(HOST, "host", "Ours"));
    await assertFails(get(ref(asUser(OUTSIDER), base)));
    await assertFails(set(ref(asUser(OUTSIDER), `${base}/note/host`), "x"));
    await assertFails(set(ref(asUser(HOST), `${base}/note/host`), "x".repeat(281)));
    await assertFails(set(ref(asUser(HOST), `${base}/note/host`), ""));
    await assertFails(set(ref(asUser(HOST), `${base}/at/host`), Date.now() + 86_400_000));
    await assertFails(set(ref(asUser(HOST), `${base}/other/host`), true));
  });

  it("your export includes your note and not your partner's; delete removes yours and keeps theirs", async () => {
    const { getAuth } = await import("../../functions/node_modules/firebase-admin/lib/auth/index.js");
    await getAuth().createUser({ uid: GUEST }).catch(() => {});
    await assertSucceeds(tick(HOST, "host", "Sarah's idea"));
    await assertSucceeds(tick(GUEST, "guest", "Judah's idea"));
    await assertSucceeds(set(ref(asUser(GUEST), `${base}/pinned/guest`), true));

    const out = (await exportMyData.run({ auth: { uid: GUEST }, data: null, rawRequest: {} })) as {
      sessions: Record<string, { decks: Record<string, { talks?: Record<string, { note?: string; at?: number }> }> }>;
    };
    const mine = out.sessions[CODE].decks[SLUG].talks![QID];
    expect(mine.note).toBe("Judah's idea");
    expect(typeof mine.at).toBe("number");
    expect(JSON.stringify(out)).not.toContain("Sarah's idea");

    await deleteMyAccount.run({ auth: { uid: GUEST }, data: null, rawRequest: {} });
    await env.withSecurityRulesDisabled(async (ctx) => {
      const node = (await get(ref(ctx.database(), base))).val();
      expect(node.note).toEqual({ host: "Sarah's idea" });
      expect(node.talked).toEqual({ host: true });
      expect(Object.keys(node.at)).toEqual(["host"]);
      expect(node.pinned).toBeUndefined();
    });
  });
});

describe("the Path: the Trailhead opens before you've both answered the path questions", () => {
  const intake = (uid: string, depth: number) =>
    set(ref(asUser(uid), `intake/${uid}`), { updated: 1, answers: { depth, talk: [1], avoided: [] } });
  const path = async () => {
    let v: { partial?: boolean; steps: Record<string, unknown> } | null = null;
    await env.withSecurityRulesDisabled(async (ctx) => {
      v = (await get(ref(ctx.database(), `sessions/${CODE}/path`))).val();
    });
    return v as unknown as { partial?: boolean; steps: Record<string, unknown> } | null;
  };

  it("lays only the Trailhead for the first to answer, then the whole route keeping it", async () => {
    // Nothing until your own path questions are in.
    await generatePath.run({ auth: { uid: HOST }, data: { code: CODE }, rawRequest: {} });
    expect(await path()).toBeNull();

    await assertSucceeds(intake(HOST, 2));
    const first = (await generatePath.run({ auth: { uid: HOST }, data: { code: CODE }, rawRequest: {} })) as { status: string };
    expect(first.status).toBe("waiting");
    const early = (await path())!;
    expect(early.partial).toBe(true);
    expect(Object.keys(early.steps)).toEqual(["0"]);
    // Both of you can see it; the outsider can't.
    expect((await get(ref(asUser(GUEST), `sessions/${CODE}/path/steps/0`))).val().key).toBe("trailhead");
    await assertFails(get(ref(asUser(OUTSIDER), `sessions/${CODE}/path`)));
    // Nobody can lay or change it from the client.
    await assertFails(set(ref(asUser(HOST), `sessions/${CODE}/path/partial`), false));

    await assertSucceeds(intake(GUEST, 2));
    const second = (await generatePath.run({ auth: { uid: GUEST }, data: { code: CODE }, rawRequest: {} })) as { status: string };
    expect(second.status).toBe("ready");
    const full = (await path())!;
    expect(full.partial).toBeUndefined();
    expect(Object.keys(full.steps)).toHaveLength(9);
    expect(full.steps[0]).toEqual(early.steps[0]);
    // Your partner's path questions are never readable by you.
    await assertFails(get(ref(asUser(HOST), `intake/${GUEST}`)));
  });
});

describe("the You screen's Download and Delete do exactly what they say (item 15)", () => {
  it("Download: profile, every answer, guess and note you gave, path questions and consent; never your partner's", async () => {
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, true);
    await call(GUEST, { code: CODE, slug: SLUG, level: 0 });
    await assertSucceeds(set(ref(asUser(GUEST), `users/${GUEST}`), { name: "Judah", bio: "Judah's line" }));
    await assertSucceeds(set(ref(asUser(GUEST), `intake/${GUEST}`), { updated: 1, answers: { depth: 1 } }));
    await assertSucceeds(set(ref(asUser(GUEST), `consents/${GUEST}`), { at: 1, version: "v1" }));
    await assertSucceeds(
      update(ref(asUser(GUEST)), {
        [`sessions/${CODE}/decks/${SLUG}/talks/${part0[0].id}/talked/guest`]: true,
        [`sessions/${CODE}/decks/${SLUG}/talks/${part0[0].id}/note/guest`]: "Judah's note",
      }),
    );
    const out = (await exportMyData.run({ auth: { uid: GUEST }, data: null, rawRequest: {} })) as {
      profile: { bio: string };
      intake: unknown;
      consent: unknown;
      sessions: Record<string, { decks: Record<string, { answers?: object; guesses?: object; talks?: Record<string, { note?: string }> }> }>;
    };
    expect(out.profile.bio).toBe("Judah's line");
    expect(out.intake).not.toBeNull();
    expect(out.consent).not.toBeNull();
    const deck = out.sessions[CODE].decks[SLUG];
    expect(Object.keys(deck.answers ?? {})).toHaveLength(part0.length);
    expect(Object.keys(deck.guesses ?? {}).length).toBeGreaterThan(0);
    expect(deck.talks?.[part0[0].id]?.note).toBe("Judah's note");
    expect(JSON.stringify(out)).not.toContain("Written by host");
  });

  it("Delete: every promise on the screen, and the consent record kept", async () => {
    const { getAuth } = await import("../../functions/node_modules/firebase-admin/lib/auth/index.js");
    await getAuth().createUser({ uid: GUEST }).catch(() => {});
    await playPart(HOST, "host", 0, true);
    await playPart(GUEST, "guest", 0, true);
    await call(GUEST, { code: CODE, slug: SLUG, level: 0 });
    // A second session Judah is in on their own.
    await env.withSecurityRulesDisabled(async (ctx) => {
      await set(ref(ctx.database(), "sessions/SOLO"), {
        created: 1,
        members: { host: { name: "Judah", uid: GUEST } },
        uids: { [GUEST]: true },
      });
      await set(ref(ctx.database(), `users/${GUEST}`), { name: "Judah", photo: "data:image/jpeg;base64,x" });
      await set(ref(ctx.database(), `intake/${GUEST}`), { updated: 1 });
      await set(ref(ctx.database(), `consents/${GUEST}`), { at: 1 });
    });

    await deleteMyAccount.run({ auth: { uid: GUEST }, data: null, rawRequest: {} });

    await env.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.database();
      // "Your profile, photo and path questions are deleted."
      expect((await get(ref(db, `users/${GUEST}`))).val()).toBeNull();
      expect((await get(ref(db, `intake/${GUEST}`))).val()).toBeNull();
      // "Every answer, guess and rating you gave is removed from every session."
      const deck = (await get(ref(db, `sessions/${CODE}/decks/${SLUG}`))).val() as DeckData;
      for (const q of part0) {
        expect(deck.answers?.[q.id]?.guest).toBeUndefined();
        expect(deck.guesses?.[q.id]?.guest).toBeUndefined();
        expect(deck.importance?.[q.id]?.guest).toBeUndefined();
        // "Your partner keeps their own answers."
        expect(deck.answers?.[q.id]?.host).toBeDefined();
      }
      // "A session with no one else in it is removed entirely."
      expect((await get(ref(db, "sessions/SOLO"))).val()).toBeNull();
      // "What we keep: your consent record."
      expect((await get(ref(db, `consents/${GUEST}`))).val()).not.toBeNull();
    });
  });
});
