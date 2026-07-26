// Discoveries — every wrong guess, re-read as the thing it actually is.
//
// The Known score counts a missed prediction as a miss, which is exactly
// backwards: a guess you got wrong is the moment you learned something about
// the person you may marry. That's the product's actual yield, and it was
// only ever expressed as a percentage going down. Nothing new is stored — this
// is a re-projection of guesses already in RTDB.
import { DECKS, type Question } from "./questions";
import { revealedQs } from "./progress";
import { scoreQ, type AnswerValue, type Role } from "./scoring";
import type { Session } from "../types";

export type Discovery = {
  slug: string;
  q: Question;
  /** What they actually said — the thing you learned. */
  theirAnswer: AnswerValue;
  /** What you'd assumed. */
  yourGuess: AnswerValue;
};

/**
 * What you learned about them, newest deck order last. Only counts guesses YOU
 * made and got wrong: a partner's wrong guess about you is their discovery to
 * read, not yours.
 */
export function discoveries(decks: Session["decks"], role: Role): Discovery[] {
  const out: Discovery[] = [];
  for (const slug in decks ?? {}) {
    if (!DECKS[slug]) continue;
    const deck = decks![slug];
    for (const q of revealedQs(slug, deck, role)) {
      if (q.type === "open" || !q.guessable) continue;
      const r = scoreQ(q, deck ?? {}, role);
      if (!r.guessed || r.guessRight) continue;
      if (r.th == null || r.guess == null) continue;
      // A guess that doesn't map to a real option is malformed (a sentinel, or
      // an option removed from the bank). Rendering it would print a bare index
      // as though it were an answer — drop the row instead.
      if (!renderable(q, r.th) || !renderable(q, r.guess)) continue;
      out.push({ slug, q, theirAnswer: r.th, yourGuess: r.guess });
    }
  }
  return out;
}

/** Can this value be shown as words rather than a raw index? */
function renderable(q: Question, v: AnswerValue): boolean {
  if (q.type === "scale") {
    const n = Number(v);
    return Number.isFinite(n) && n >= 1 && n <= 5;
  }
  return q.opts?.[Number(v)] != null;
}

/** Human text for an answer value, matching how the reveal renders it. */
export function answerText(q: Question, v: AnswerValue): string {
  if (q.type === "scale") {
    // A bare "4 / 5" tells the reader nothing — name the end it leans toward.
    const n = Number(v);
    if (n >= 4) return q.hi ?? String(v);
    if (n <= 2) return q.lo ?? String(v);
    return "somewhere in the middle";
  }
  return q.opts?.[Number(v)] ?? String(v);
}
