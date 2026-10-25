// Answers in words, never as numbers (design refresh, item 13: no "4 / 5"
// anywhere). A 1–5 scale reads as a strength plus the end it leans toward:
// "Leaning: spender at heart", "Right in the middle".
import type { Question } from "./questions";
import type { AnswerValue } from "./scoring";

type T = (en: string, fr: string) => string;

export const SCALE_WORDS: [string, string][] = [
  ["Strongly", "Fortement"],
  ["Leaning", "Plutôt"],
  ["Right in the middle", "Pile au milieu"],
  ["Leaning", "Plutôt"],
  ["Strongly", "Fortement"],
];

/** "Strongly" / "Leaning" / "Right in the middle" for a 1–5 value. */
export function scaleWord(v: AnswerValue | null | undefined, t: T): string {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 5) return "—";
  const [en, fr] = SCALE_WORDS[n - 1];
  return t(en, fr);
}

// Lowercase an end label after a colon, unless it opens with "I" (a person
// speaking: "I'd rather keep my past private").
const tail = (s: string) => (/^I\b|^I['’]/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

/** "Leaning: spender at heart" (or "Right in the middle"). */
export function scaleText(q: Question, v: AnswerValue | null | undefined, t: T): string {
  const n = Number(v);
  if (n === 3) return scaleWord(n, t);
  const end = n >= 4 ? q.hi : n <= 2 ? q.lo : undefined;
  return end ? `${scaleWord(n, t)}: ${tail(end)}` : scaleWord(n, t);
}
