// The talk loop — the app's last mile (UX review §6).
//
// TwoAgree exists to feed conversation, but the loop used to end at reading:
// "Worth a conversation." was a static note under a card, the flags walkthrough
// persisted nothing, and the same disagreements resurfaced identically forever.
// Nothing carried a couple from "worth a chat" to an actual chat, and nothing
// ever marked the one behaviour the product is for as having happened.
//
// So: either partner can PIN a question onto the couple's shared agenda, and
// retiring it takes BOTH of them confirming they've talked — one person
// deciding a conversation happened isn't the same as having had it.
import { DECKS, type Question } from "./questions";
import { other, type DeckData, type Role } from "./scoring";
import type { Session } from "../types";

export type TalkState = {
  slug: string;
  q: Question;
  pinnedByMe: boolean;
  pinnedByThem: boolean;
  talkedByMe: boolean;
  talkedByThem: boolean;
  /** Both have confirmed — retired from the agenda, worth a small moment. */
  closed: boolean;
};

function stateOf(
  slug: string,
  q: Question,
  deck: DeckData | undefined,
  role: Role,
): TalkState {
  const node = deck?.talks?.[q.id];
  const them = other(role);
  const talkedByMe = !!node?.talked?.[role];
  const talkedByThem = !!node?.talked?.[them];
  return {
    slug,
    q,
    pinnedByMe: !!node?.pinned?.[role],
    pinnedByThem: !!node?.pinned?.[them],
    talkedByMe,
    talkedByThem,
    closed: talkedByMe && talkedByThem,
  };
}

/** One question's talk state — for the pin control on a reveal card. */
export function talkStateOf(
  slug: string,
  q: Question,
  deck: DeckData | undefined,
  role: Role,
): TalkState {
  return stateOf(slug, q, deck, role);
}

export const isPinned = (s: TalkState) => s.pinnedByMe || s.pinnedByThem;

/**
 * The couple's agenda: every question either of them has pinned, open ones
 * first (a closed topic stays visible for a while as evidence they did the
 * thing, rather than vanishing as if it never happened).
 */
export function talkList(
  decks: Session["decks"],
  role: Role,
): { open: TalkState[]; closed: TalkState[] } {
  const open: TalkState[] = [];
  const closed: TalkState[] = [];
  for (const slug in decks ?? {}) {
    const deck = decks![slug];
    const byId = new Map(DECKS[slug]?.questions.map((q) => [q.id, q]) ?? []);
    for (const qid in deck?.talks ?? {}) {
      const q = byId.get(qid);
      if (!q) continue; // a question retired from the bank — skip, don't crash
      const s = stateOf(slug, q, deck, role);
      if (!isPinned(s) && !s.closed) continue; // un-pinned and never closed
      (s.closed ? closed : open).push(s);
    }
  }
  return { open, closed };
}
