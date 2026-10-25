/**
 * One-off migration for "names instead of Him / Her" (design refresh, item
 * 12). The 18 "which of you" questions used to offer Him / Her, stored as the
 * option's position (0 / 1). They now offer your two names, stored as who was
 * picked ("host" / "guest"). An old 0 or 1 can't be mapped to a person, so it
 * is cleared — answers and guesses, in the shared session and in private
 * spaces — and the question is asked again once. Other options (Both equally,
 * Neither of us…) kept their wording and position, so those answers stay.
 *
 * A part whose answer was cleared reopens for that person (their "done" and the
 * part's published stamp are removed), so the question is actually asked; the
 * same for a Path step. Their other answers are kept.
 *
 * Pure: one multi-path update per session. Safe to run twice: new answers are
 * never 0 or 1 on these questions.
 */
import { BANK, LEVELS } from "./questionBank.generated.js";
import type { Role, PrivateSpace } from "./publish.js";

type RoleMap = Partial<Record<Role, unknown>>;
interface Deck {
  answers?: Record<string, RoleMap>;
  guesses?: Record<string, RoleMap>;
  done?: Record<string, RoleMap>;
  published?: Record<string, unknown>;
}
export interface WhoSession {
  members?: Partial<Record<Role, { uid?: string }>>;
  decks?: Record<string, Deck>;
  path?: { steps?: Record<string, { qids?: string[] }> };
  pathDone?: Record<string, RoleMap>;
  pathPublished?: Record<string, unknown>;
}

const WHO = Object.entries(BANK)
  .filter(([, e]) => e.who)
  .map(([id, e]) => ({ id, deck: e.deck }));
export const WHO_IDS = WHO.map((w) => w.id);

const legacy = (v: unknown) => v === 0 || v === 1;
const levelOf = (slug: string, qid: string) =>
  (LEVELS[slug] ?? []).findIndex((ids) => ids.includes(qid));

export function planWhoReask(
  code: string,
  s: WhoSession,
  spaces: Partial<Record<Role, PrivateSpace | null>>,
): { updates: Record<string, unknown>; cleared: number } {
  const updates: Record<string, unknown> = {};
  let cleared = 0;
  const reopen = (role: Role, slug: string, qid: string) => {
    const lvl = levelOf(slug, qid);
    if (lvl >= 0 && s.decks?.[slug]?.done?.[lvl]?.[role] != null) {
      updates[`sessions/${code}/decks/${slug}/done/${lvl}/${role}`] = null;
      updates[`sessions/${code}/decks/${slug}/published/${lvl}`] = null;
    }
    for (const [idx, step] of Object.entries(s.path?.steps ?? {})) {
      if (step.qids?.includes(qid) && s.pathDone?.[idx]?.[role] != null) {
        updates[`sessions/${code}/pathDone/${idx}/${role}`] = null;
        updates[`sessions/${code}/pathPublished/${idx}`] = null;
      }
    }
  };

  for (const { id, deck: slug } of WHO) {
    for (const role of ["host", "guest"] as Role[]) {
      for (const kind of ["answers", "guesses"] as const) {
        let hit = false;
        if (legacy(s.decks?.[slug]?.[kind]?.[id]?.[role])) {
          updates[`sessions/${code}/decks/${slug}/${kind}/${id}/${role}`] = null;
          hit = true;
        }
        const uid = s.members?.[role]?.uid;
        if (uid && legacy(spaces[role]?.decks?.[slug]?.[kind]?.[id])) {
          updates[`private/${uid}/${code}/decks/${slug}/${kind}/${id}`] = null;
          hit = true;
        }
        if (hit) {
          cleared++;
          if (kind === "answers") reopen(role, slug, id);
        }
      }
    }
  }
  return { updates, cleared };
}

interface AdminDb {
  ref(path?: string): {
    once(event: "value"): Promise<{ val(): unknown }>;
    update(values: Record<string, unknown>): Promise<void>;
  };
}

export async function migrateWhoAll(
  db: AdminDb,
  { apply }: { apply: boolean },
): Promise<{ code: string; cleared: number; writes: number }[]> {
  const all = ((await db.ref("sessions").once("value")).val() ?? {}) as Record<string, WhoSession>;
  const out = [];
  for (const [code, s] of Object.entries(all)) {
    const spaces: Partial<Record<Role, PrivateSpace | null>> = {};
    for (const role of ["host", "guest"] as Role[]) {
      const uid = s.members?.[role]?.uid;
      if (uid) spaces[role] = (await db.ref(`private/${uid}/${code}`).once("value")).val() as PrivateSpace | null;
    }
    const plan = planWhoReask(code, s, spaces);
    const writes = Object.keys(plan.updates).length;
    if (apply && writes) await db.ref().update(plan.updates);
    out.push({ code, cleared: plan.cleared, writes });
  }
  return out;
}
