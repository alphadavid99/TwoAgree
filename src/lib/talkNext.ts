// "Talk about next" and "Talked about together" (design refresh, items 3 and
// 13). Pure: from the session's decks, the one conversation to have now, the
// rest of the list, and the ones you've had, with when and what you'll try.
import { DECKS, ORDER, type Question } from "./questions";
import { revealedQs } from "./progress";
import { scoreQ, other, type Role, type ScoreResult } from "./scoring";
import { talkList, type TalkState } from "./talks";
import type { Session } from "../types";

export type NextTalk = TalkState & {
  r: ScoreResult;
  /** Not on your list: the question where your answers were furthest apart. */
  suggested: boolean;
};

export type TalkedTalk = TalkState & {
  /** When the second of you ticked it (ms), if known. */
  at: number | null;
  /** "One thing we'll try": each of your notes, yours first. */
  notes: string[];
};

// Who needs to act first: a question your partner has ticked (they're waiting
// on you), then ones neither has ticked, then ones only you've ticked.
const urgency = (s: TalkState) => (s.talkedByThem && !s.talkedByMe ? 0 : !s.talkedByMe ? 1 : 2);

export function talkNext(
  decks: Session["decks"],
  role: Role,
): { next: NextTalk[]; talked: TalkedTalk[] } {
  const { open, closed } = talkList(decks, role);
  const scored = (s: TalkState) => scoreQ(s.q, decks?.[s.slug] ?? {}, role);
  const next: NextTalk[] = open
    .map((s) => ({ ...s, r: scored(s), suggested: false }))
    .sort((a, b) => urgency(a) - urgency(b));

  if (!next.length) {
    // Nothing on the list yet: suggest where you were furthest apart (lowest
    // score among the revealed differences), never one you've talked about.
    const done = new Set(closed.map((s) => s.q.id));
    let best: { slug: string; q: Question; r: ScoreResult } | null = null;
    for (const slug of ORDER) {
      const deck = decks?.[slug];
      if (!deck || !DECKS[slug]) continue;
      for (const q of revealedQs(slug, deck, role)) {
        if (q.type === "open" || done.has(q.id)) continue;
        const r = scoreQ(q, deck, role);
        if (r.verdict !== "Worth a chat" || r.score == null) continue;
        if (!best || r.score < (best.r.score ?? 1)) best = { slug, q, r };
      }
    }
    if (best) {
      const node = decks?.[best.slug]?.talks?.[best.q.id];
      next.push({
        slug: best.slug,
        q: best.q,
        r: best.r,
        pinnedByMe: false,
        pinnedByThem: false,
        talkedByMe: !!node?.talked?.[role],
        talkedByThem: !!node?.talked?.[other(role)],
        closed: false,
        suggested: true,
      });
    }
  }

  const talked: TalkedTalk[] = closed
    .map((s) => {
      const node = decks?.[s.slug]?.talks?.[s.q.id];
      const ats = [node?.at?.host, node?.at?.guest].filter((x): x is number => typeof x === "number");
      const notes = [node?.note?.[role], node?.note?.[other(role)]].filter(
        (x): x is string => typeof x === "string" && x.trim() !== "",
      );
      return { ...s, at: ats.length === 2 ? Math.max(...ats) : null, notes };
    })
    // Most recent first; undated (ticked before dates were kept) last.
    .sort((a, b) => (b.at ?? 0) - (a.at ?? 0));

  return { next, talked };
}
