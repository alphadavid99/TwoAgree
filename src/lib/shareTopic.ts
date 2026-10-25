// What a shared image may say about the topic (design refresh, item 2).
// Intimacy, the past and deal-breakers are nobody else's business: a card
// from one of those reads "A TwoAgree conversation" instead. The same goes for
// the Path steps that walk through them.
import { DECKS } from "./questions";
import { deckName } from "./questions.fr";
import { stepMeta } from "./path";
import type { Lang } from "./i18n";

export const SENSITIVE_DECKS: ReadonlySet<string> = new Set([
  "intimacy-physical",
  "past-baggage",
  "deal-breakers",
]);
export const SENSITIVE_STEPS: ReadonlySet<string> = new Set(["garden", "valley", "summit"]);

const GENERIC: Record<Lang, string> = {
  en: "A TwoAgree conversation",
  fr: "Une conversation TwoAgree",
};

/** The topic label for a shared card: a deck slug or a Path step key. */
export function shareTopic(slugOrStep: string, lang: Lang, part?: number): string {
  if (SENSITIVE_DECKS.has(slugOrStep) || SENSITIVE_STEPS.has(slugOrStep)) return GENERIC[lang];
  if (DECKS[slugOrStep]) {
    const name = deckName(slugOrStep, lang);
    if (part == null || DECKS[slugOrStep].parts.length < 2) return name;
    return lang === "fr" ? `${name} · Partie ${part + 1}` : `${name} · Part ${part + 1}`;
  }
  return stepMeta(slugOrStep)?.name ?? GENERIC[lang];
}
