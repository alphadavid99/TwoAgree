// What a 1–5 scale says at the point you picked.
//
// The ends of a scale carry short labels ("My partner" … "Time with God").
// Picking a point shows one plain line saying what that point means: the
// question's own wording for it where the bank has one (`steps`), otherwise
// how strongly, towards which end ("Leaning: too fast for me").
import type { Question } from "./questions";

// Intensity words for the 1–5 scale. Direction comes from the end it leans to.
export const SCALE_WORDS = ["Strongly", "Leaning", "Right in the middle", "Leaning", "Strongly"];
export const SCALE_WORDS_FR = ["Fortement", "Plutôt", "Pile au milieu", "Plutôt", "Fortement"];

// "Too fast for me" reads on from "Leaning:" in lower case; "I'd …" and
// "God …" keep their capital.
const onward = (s: string) => (/^(I\b|I'|God\b)/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

/** The line shown for point `i` (1–5). Steps are English only. */
export function scaleSay(q: Question, i: number, lang: string): string {
  if (lang === "en" && q.steps?.length === 5) return q.steps[i - 1];
  const word = (lang === "fr" ? SCALE_WORDS_FR : SCALE_WORDS)[i - 1];
  const end = i < 3 ? q.lo : i > 3 ? q.hi : undefined;
  if (!end) return word;
  return lang === "fr" ? `${word} : ${onward(end)}` : `${word}: ${onward(end)}`;
}
