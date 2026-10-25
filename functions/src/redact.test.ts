import { describe, it, expect } from "vitest";
import { redactSessionForSubject, type RawSession } from "./redact.js";

const HOST = "uid-sarah";
const GUEST = "uid-judah";

const session: RawSession = {
  created: 1,
  stage: "engaged",
  members: { host: { name: "Sarah", uid: HOST }, guest: { name: "Judah", uid: GUEST } },
  uids: { [HOST]: true, [GUEST]: true },
  decks: {
    "intimacy-physical": {
      answers: { "INT-019": { host: 5, guest: 4 } },
      guesses: { "INT-019": { host: 2, guest: 1 } },
      importance: { "INT-019": { host: 5, guest: 3 } },
      done: { "0": { host: true, guest: true } },
      talks: {
        "INT-019": {
          pinned: { host: true },
          talked: { host: true, guest: true },
          at: { host: 1700, guest: 1800 },
          note: { host: "Sarah's note", guest: "Judah's note" },
        },
      },
    },
    "finances-money": {
      // Only the partner has answered here.
      answers: { "FIN-009": { guest: 3 } },
    },
  },
  pathLamps: { 0: true },
};

describe("redactSessionForSubject", () => {
  const forHost = redactSessionForSubject(session, HOST);
  const forGuest = redactSessionForSubject(session, GUEST);

  it("returns the subject's own answer, guess and importance", () => {
    const d = forHost.decks["intimacy-physical"];
    expect(d.answers).toEqual({ "INT-019": 5 });
    expect(d.guesses).toEqual({ "INT-019": 2 });
    expect(d.importance).toEqual({ "INT-019": 5 });
    expect(d.done).toEqual({ "0": true });
  });

  it("never returns the partner's answers — the whole point", () => {
    // Every value is distinct per role, so a leak is detectable: the guest
    // answered 4, guessed 1 and rated it 3. None may appear in the host's copy.
    const d = forHost.decks["intimacy-physical"];
    expect(Object.values(d.answers!)).not.toContain(4);
    expect(Object.values(d.guesses!)).not.toContain(1);
    expect(Object.values(d.importance!)).not.toContain(3);
    expect(d.answers).not.toHaveProperty("guest");
    // A deck only the partner has touched contributes nothing at all.
    expect(forHost.decks["finances-money"]).toBeUndefined();
  });

  it("gives each partner a mirror-image copy of their own side", () => {
    expect(forGuest.decks["intimacy-physical"].answers).toEqual({ "INT-019": 4 });
    expect(forGuest.decks["intimacy-physical"].guesses).toEqual({ "INT-019": 1 });
    expect(forGuest.decks["finances-money"].answers).toEqual({ "FIN-009": 3 });
  });

  it("keeps only the subject's own talk flags, date and note", () => {
    expect(forHost.decks["intimacy-physical"].talks).toEqual({
      "INT-019": { pinned: true, talked: true, at: 1700, note: "Sarah's note" },
    });
    // The guest never pinned it, so their copy carries no `pinned`.
    expect(forGuest.decks["intimacy-physical"].talks).toEqual({
      "INT-019": { talked: true, at: 1800, note: "Judah's note" },
    });
  });

  it("keeps the session facts the subject is plainly a party to", () => {
    expect(forHost.created).toBe(1);
    expect(forHost.stage).toBe("engaged");
    expect(forHost.yourRole).toBe("host");
    // The partner's display name is something they chose to show you.
    expect(forHost.partnerName).toBe("Judah");
    expect(forHost.pathLamps).toEqual({ 0: true });
  });

  it("never leaks the partner's uid", () => {
    expect(JSON.stringify(forHost)).not.toContain(GUEST);
    expect(JSON.stringify(forGuest)).not.toContain(HOST);
  });

  it("explains the omission rather than silently truncating", () => {
    expect(forHost.note).toMatch(/your partner's answers are their/i);
  });

  it("returns nothing but metadata for a uid that isn't a member", () => {
    const stranger = redactSessionForSubject(session, "uid-nobody");
    expect(stranger.yourRole).toBeNull();
    expect(stranger.decks).toEqual({});
    expect(stranger.partnerName).toBeUndefined();
  });

  it("survives a session with no decks at all", () => {
    const bare = redactSessionForSubject(
      { members: { host: { uid: HOST } } } as RawSession,
      HOST,
    );
    expect(bare.decks).toEqual({});
    expect(bare.yourRole).toBe("host");
  });
});

describe("withUnpublished — answers still private go in your export", () => {
  it("adds your private answers to the deck lists without touching published ones", async () => {
    const { withUnpublished } = await import("./redact.js");
    const base = {
      yourRole: "host" as const,
      decks: { faith: { answers: { "FAITH-001": 2 } } },
      note: "",
    };
    const out = withUnpublished(base, {
      decks: { faith: { answers: { "FAITH-009": 4 }, importance: { "FAITH-009": 5 } }, money: { guesses: { "MON-001": 1 } } },
    });
    expect(out.decks.faith.answers).toEqual({ "FAITH-001": 2, "FAITH-009": 4 });
    expect(out.decks.faith.importance).toEqual({ "FAITH-009": 5 });
    expect(out.decks.money.guesses).toEqual({ "MON-001": 1 });
    expect(withUnpublished(base, null)).toEqual(base);
  });
});
