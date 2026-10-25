// What a 1–5 scale says at its ends and at the point you picked.
//
// Many end labels carry their own explanation after a colon ("My relationship:
// I'd usually prioritise time with my partner"). Printed in full at both ends
// they took six lines before the question could even be answered. The ends
// now show the short half; the whole sentence appears once you pick a point,
// along with what that point means, so nothing is lost and nothing is
// reworded.
import type { Question } from "./questions";

// Intensity words for the 1–5 scale, used where a question has no wording of
// its own for each point. Direction is carried by which end it sits nearer.
export const SCALE_WORDS = ["Strongly", "Leaning", "Right in the middle", "Leaning", "Strongly"];
export const SCALE_WORDS_FR = ["Fortement", "Plutôt", "Pile au milieu", "Plutôt", "Fortement"];

const SPLIT = /^([^:]{2,40}): (.+)$/;

/** The short form of an end label: the part before its colon, if it has one. */
export const shortEnd = (text = ""): string => SPLIT.exec(text)?.[1] ?? text;

/**
 * What picking point `i` (1–5) says. The question's own wording for that point
 * when it has one (English only: the steps aren't translated), split at its
 * colon; otherwise the intensity word, followed by the end's full sentence
 * when the end label was shortened.
 */
export function scalePoint(q: Question, i: number, lang: string): { word: string; detail?: string } {
  if (lang === "en" && q.steps?.length === 5) {
    const m = SPLIT.exec(q.steps[i - 1]);
    return m ? { word: m[1], detail: m[2] } : { word: q.steps[i - 1] };
  }
  const word = (lang === "fr" ? SCALE_WORDS_FR : SCALE_WORDS)[i - 1];
  const end = i < 3 ? q.lo : i > 3 ? q.hi : undefined;
  return end && shortEnd(end) !== end ? { word, detail: end } : { word };
}
