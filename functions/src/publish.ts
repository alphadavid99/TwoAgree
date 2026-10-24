/**
 * Publishing a finished part — the server half of "your answers stay private
 * until you've both finished a part" (design refresh, recommendation 5).
 *
 * Each partner's answers, guesses and importance ratings are written to their
 * own private space, private/{uid}/{code}/decks/{slug}/{kind}/{qid}, which only
 * they can read. The shared session holds no answers until BOTH partners have
 * marked the part done; then this copies exactly that part's entries, for both
 * roles, into sessions/{code}/decks/{slug}/{kind}/{qid}/{role} — the shape the
 * reveal, scoring and Together have always read — and stamps it published.
 *
 * Pure: it turns what was read into one multi-path update. index.ts does the
 * reading, the both-done check and the write.
 */
import { BANK, LEVELS } from "./questionBank.generated.js";

export type Role = "host" | "guest";
export const KINDS = ["answers", "guesses", "importance"] as const;
export type Kind = (typeof KINDS)[number];

/** private/{uid}/{code} — one person's unpublished entries for one session. */
export interface PrivateSpace {
  decks?: Record<string, Partial<Record<Kind, Record<string, unknown>>>>;
}

/** One question's place: its deck slug and the key it is stored under. */
export interface Slot {
  slug: string;
  qid: string;
}

/** The synthetic deck holding the Path's "At the table" open answers, keyed by
 *  step key (mirrors src/lib/path.ts AT_TABLE_SLUG). */
export const AT_TABLE_SLUG = "at-table";

/** The questions of one deck part, or null when there is no such part. */
export function levelSlots(slug: string, level: number): Slot[] | null {
  const ids = LEVELS[slug]?.[level];
  if (!ids) return null;
  return ids.map((qid) => ({ slug, qid }));
}

/** The questions of one Path step: its bank questions, each in its real deck,
 *  plus its "At the table" prompt. Unknown ids are dropped, never guessed at. */
export function stepSlots(step: { key?: string; qids?: string[] }): Slot[] {
  const out: Slot[] = [];
  for (const qid of step.qids ?? []) {
    const deck = BANK[qid]?.deck;
    if (deck) out.push({ slug: deck, qid });
  }
  if (step.key) out.push({ slug: AT_TABLE_SLUG, qid: step.key });
  return out;
}

/**
 * The multi-path update that publishes `slots` for both partners. Only entries
 * that exist are copied (never a null or {} leaf, CLAUDE.md §6), and only for
 * the slots named — a private space holding answers to other parts keeps them.
 * Paths are relative to the database root.
 */
export function publishUpdates(
  code: string,
  slots: Slot[],
  spaces: Partial<Record<Role, PrivateSpace | null>>,
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  for (const role of ["host", "guest"] as Role[]) {
    const decks = spaces[role]?.decks;
    if (!decks) continue;
    for (const { slug, qid } of slots) {
      for (const kind of KINDS) {
        const v = decks[slug]?.[kind]?.[qid];
        if (v === undefined || v === null || typeof v === "object") continue;
        updates[`sessions/${code}/decks/${slug}/${kind}/${qid}/${role}`] = v;
      }
    }
  }
  return updates;
}
