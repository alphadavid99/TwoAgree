/**
 * One-off migration for recommendation 5: sessions written before answers
 * were private hold BOTH partners' answers in the shared session, including
 * parts that haven't opened. This plans, per session:
 *
 *  - a part both partners finished (or a Path step both walked): stays shared,
 *    stamped published, exactly as the server would have left it;
 *  - anything else: each answer, guess and importance rating moves to its
 *    author's private space and leaves the shared session;
 *  - the shared partner-status flags the new client reads (started/{level},
 *    pathDone/{step}) are set from what each person had answered.
 *
 * Pure: returns one multi-path update per session. Run it with
 * scripts/migrate-private-answers.mjs — against the emulator first. It is safe
 * to run twice: a migrated session has nothing left to move.
 */
import { BANK, LEVELS } from "./questionBank.generated.js";
import { AT_TABLE_SLUG, KINDS, stepSlots, type Role } from "./publish.js";

type RoleMap = Partial<Record<Role, unknown>>;
interface Deck {
  answers?: Record<string, RoleMap>;
  guesses?: Record<string, RoleMap>;
  importance?: Record<string, RoleMap>;
  done?: Record<string, RoleMap>;
  started?: Record<string, RoleMap>;
  published?: Record<string, unknown>;
}
export interface LegacySession {
  members?: Partial<Record<Role, { uid?: string }>>;
  decks?: Record<string, Deck>;
  path?: { steps?: Record<string, { key?: string; qids?: string[] }> };
  pathDone?: Record<string, RoleMap>;
  pathPublished?: Record<string, unknown>;
}

export interface MigrationPlan {
  updates: Record<string, unknown>;
  moved: number;
  published: number;
  /** Entries left in place because their author has left the session. */
  orphaned: number;
}

const ROLES: Role[] = ["host", "guest"];
const both = (f: RoleMap | undefined) => f?.host === true && f?.guest === true;

export function planMigration(code: string, s: LegacySession): MigrationPlan {
  const updates: Record<string, unknown> = {};
  let moved = 0;
  let published = 0;
  let orphaned = 0;
  const decks = s.decks ?? {};
  const answered = (slug: string, qid: string, role: Role) =>
    decks[slug]?.answers?.[qid]?.[role] != null;

  // Every slot that is open to both, by deck part or by Path step.
  const open = new Set<string>();
  const key = (slug: string, qid: string) => `${slug}\u0000${qid}`;

  for (const [slug, parts] of Object.entries(LEVELS)) {
    const deck = decks[slug];
    if (!deck) continue;
    parts.forEach((qids, level) => {
      if (both(deck.done?.[level])) {
        qids.forEach((qid) => open.add(key(slug, qid)));
        if (deck.published?.[level] !== true) {
          updates[`sessions/${code}/decks/${slug}/published/${level}`] = true;
          published++;
        }
      }
      for (const role of ROLES) {
        if (qids.some((qid) => answered(slug, qid, role)) && deck.started?.[level]?.[role] !== true) {
          updates[`sessions/${code}/decks/${slug}/started/${level}/${role}`] = true;
        }
      }
    });
  }

  for (const [idx, step] of Object.entries(s.path?.steps ?? {})) {
    const slots = stepSlots(step);
    const walked = (role: Role) => slots.length > 0 && slots.every(({ slug, qid }) => answered(slug, qid, role));
    for (const role of ROLES) {
      if (walked(role) && s.pathDone?.[idx]?.[role] !== true) {
        updates[`sessions/${code}/pathDone/${idx}/${role}`] = true;
      }
    }
    if (walked("host") && walked("guest")) {
      slots.forEach(({ slug, qid }) => open.add(key(slug, qid)));
      if (s.pathPublished?.[idx] !== true) {
        updates[`sessions/${code}/pathPublished/${idx}`] = true;
        published++;
      }
    }
  }

  // Everything not open moves to its author's private space.
  for (const [slug, deck] of Object.entries(decks)) {
    if (slug !== AT_TABLE_SLUG && !LEVELS[slug]) continue;
    for (const kind of KINDS) {
      for (const [qid, byRole] of Object.entries(deck[kind] ?? {})) {
        if (open.has(key(slug, qid))) continue;
        if (slug !== AT_TABLE_SLUG && BANK[qid]?.deck !== slug) continue;
        for (const role of ROLES) {
          const v = byRole?.[role];
          if (v == null) continue;
          const uid = s.members?.[role]?.uid;
          if (!uid) {
            orphaned++;
            continue;
          }
          updates[`private/${uid}/${code}/decks/${slug}/${kind}/${qid}`] = v;
          updates[`sessions/${code}/decks/${slug}/${kind}/${qid}/${role}`] = null;
          moved++;
        }
      }
    }
  }

  return { updates, moved, published, orphaned };
}

/** The admin database surface migrateAll needs (firebase-admin's Database). */
interface AdminDb {
  ref(path?: string): {
    once(event: "value"): Promise<{ val(): unknown }>;
    update(values: Record<string, unknown>): Promise<void>;
  };
}

/**
 * Plan every session and, with apply, write each session's update atomically.
 * Returns per-session counts so the runner can print what it did (or would do).
 */
export async function migrateAll(
  db: AdminDb,
  { apply }: { apply: boolean },
): Promise<{ code: string; moved: number; published: number; orphaned: number; writes: number }[]> {
  const all = ((await db.ref("sessions").once("value")).val() ?? {}) as Record<string, LegacySession>;
  const out = [];
  for (const [code, s] of Object.entries(all)) {
    const plan = planMigration(code, s);
    const writes = Object.keys(plan.updates).length;
    if (apply && writes) await db.ref().update(plan.updates);
    out.push({ code, moved: plan.moved, published: plan.published, orphaned: plan.orphaned, writes });
  }
  return out;
}
