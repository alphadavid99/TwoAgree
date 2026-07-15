// The TwoAgree question bank — the app's stable import surface.
//
// The bank is NOT authored here. The single source of truth is the repo-owned
// JSON in `data/questions.json` (+ `data/decks.json` for deck metadata); the
// typed data below is regenerated from it by `npm run build:questions`, which
// validates the bank and writes `src/data/questions.generated.ts`. Import from
// this module as before — it simply re-exports the generated bank so every
// consumer is unaffected by where the data lives. See CLAUDE.md §9.
export type { QuestionType, Question, Deck } from "../data/questions.generated";
export { ORDER, DECKS } from "../data/questions.generated";
