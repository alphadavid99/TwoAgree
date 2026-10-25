/**
 * One-off fresh start for the Oct 2026 question bank. The overhaul gave most
 * questions new IDs and re-cut every conversation's parts, so answers saved
 * against the old bank can't be read against the new one. Only testers use the
 * app, so everyone starts again (Dave, Oct 2026).
 *
 * Per session it clears everything keyed to questions or parts: every deck's
 * answers, guesses, ratings, progress, published stamps and talk notes, the
 * laid Path and its progress, and both partners' private spaces for the
 * session. It keeps the couple: members, names, uids, the join code, the date
 * they set to meet, and each partner's Path intake answers, so the Path is
 * laid again from the new bank without asking those again.
 *
 * Pure plan + runner, like migratePrivate. Safe to run twice: a cleared
 * session plans no writes.
 */
import type { Role, PrivateSpace } from "./publish.js";

export interface FreshSession {
  members?: Partial<Record<Role, { uid?: string }>>;
  decks?: Record<string, unknown>;
  path?: unknown;
  pathDone?: unknown;
  pathPublished?: unknown;
  pathLamps?: unknown;
}

/** Shared session children that hold question- or part-keyed data. */
export const CLEARED = ["decks", "path", "pathDone", "pathPublished", "pathLamps"] as const;

export function planFreshStart(
  code: string,
  s: FreshSession,
  spaces: Partial<Record<Role, PrivateSpace | null>>,
): { updates: Record<string, null>; cleared: string[] } {
  const updates: Record<string, null> = {};
  const cleared: string[] = [];
  for (const key of CLEARED) {
    if (s[key] != null) {
      updates[`sessions/${code}/${key}`] = null;
      cleared.push(key);
    }
  }
  for (const role of ["host", "guest"] as Role[]) {
    const uid = s.members?.[role]?.uid;
    if (uid && spaces[role] != null) {
      updates[`private/${uid}/${code}`] = null;
      cleared.push(`private:${role}`);
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

export async function migrateFreshAll(
  db: AdminDb,
  { apply }: { apply: boolean },
): Promise<{ code: string; cleared: string[]; writes: number }[]> {
  const all = ((await db.ref("sessions").once("value")).val() ?? {}) as Record<string, FreshSession>;
  const out = [];
  for (const [code, s] of Object.entries(all)) {
    const spaces: Partial<Record<Role, PrivateSpace | null>> = {};
    for (const role of ["host", "guest"] as Role[]) {
      const uid = s.members?.[role]?.uid;
      if (uid) spaces[role] = (await db.ref(`private/${uid}/${code}`).once("value")).val() as PrivateSpace | null;
    }
    const plan = planFreshStart(code, s, spaces);
    const writes = Object.keys(plan.updates).length;
    if (apply && writes) await db.ref().update(plan.updates);
    out.push({ code, cleared: plan.cleared, writes });
  }
  return out;
}
