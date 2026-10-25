// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source of truth: data/questions.json + data/decks.json.
// Regenerate with: npm run build:questions   (see CLAUDE.md §9)

// Compact question metadata for the Path generation Cloud Function.
export type QuestionType = "scale" | "mc" | "rank" | "open";
export interface BankEntry {
  deck: string;
  type: QuestionType;
  depth: number;
  guessable?: boolean;
  complement?: boolean;
  who?: boolean;
}

/** Every question's selection metadata, keyed by id. */
export const BANK: Record<string, BankEntry> = {
  "HOME-012": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "HOME-013": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-014": {
    "deck": "in-the-home",
    "type": "rank",
    "depth": 1
  },
  "HOME-008": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "HOME-006": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HOME-010": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-011": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HOME-015": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-016": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HOME-007": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "HOME-017": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "HOME-009": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "HOME-018": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HOME-019": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "HOME-020": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FIN-018": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FIN-019": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-020": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-021": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true,
    "who": true
  },
  "FIN-022": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-023": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-004": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-024": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-011": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-025": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3
  },
  "FIN-026": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-027": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-028": {
    "deck": "finances-money",
    "type": "rank",
    "depth": 3
  },
  "FIN-029": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-030": {
    "deck": "finances-money",
    "type": "rank",
    "depth": 3
  },
  "FIN-031": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3
  },
  "FIN-032": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-033": {
    "deck": "finances-money",
    "type": "open",
    "depth": 3
  },
  "FIN-034": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-035": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-036": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-037": {
    "deck": "finances-money",
    "type": "rank",
    "depth": 3
  },
  "FIN-038": {
    "deck": "finances-money",
    "type": "open",
    "depth": 3
  },
  "FIN-039": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAITH-007": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FAITH-010": {
    "deck": "faith-worship-practice",
    "type": "open",
    "depth": 1
  },
  "FAITH-036": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FAITH-031": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-026": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-003": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-033": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-001": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FAITH-004": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-017": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-021": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-037": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAITH-038": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAITH-039": {
    "deck": "faith-worship-practice",
    "type": "rank",
    "depth": 2
  },
  "FAITH-020": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FAITH-015": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-040": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-028": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-041": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-042": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-043": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-012": {
    "deck": "faith-worship-practice",
    "type": "open",
    "depth": 1
  },
  "FAITH-044": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FAITH-045": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-025": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-030": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAITH-024": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-046": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-018": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "FAITH-047": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "FAITH-022": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-048": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-016": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-049": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-050": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-051": {
    "deck": "faith-worship-practice",
    "type": "rank",
    "depth": 2
  },
  "ROLE-011": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "ROLE-013": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "ROLE-014": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "ROLE-015": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "ROLE-016": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-017": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-018": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-019": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "ROLE-020": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "ROLE-021": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-022": {
    "deck": "roles-responsibilities",
    "type": "rank",
    "depth": 3
  },
  "ROLE-023": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "ROLE-024": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "ROLE-025": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-026": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "ROLE-027": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "THEO-011": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "THEO-012": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "THEO-013": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "THEO-014": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 3
  },
  "THEO-015": {
    "deck": "theology-beliefs",
    "type": "rank",
    "depth": 3
  },
  "THEO-016": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "THEO-017": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-018": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "THEO-019": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "THEO-020": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-021": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-022": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "THEO-023": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "THEO-024": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-025": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-026": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-027": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-028": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-029": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-030": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-031": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "DREAM-006": {
    "deck": "dreams-future",
    "type": "open",
    "depth": 1
  },
  "DREAM-013": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "DREAM-014": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "DREAM-015": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "DREAM-016": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "DREAM-008": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "DREAM-003": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "DREAM-017": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "DREAM-001": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "DREAM-004": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "DREAM-018": {
    "deck": "dreams-future",
    "type": "rank",
    "depth": 2
  },
  "DREAM-019": {
    "deck": "dreams-future",
    "type": "rank",
    "depth": 2
  },
  "DREAM-020": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "DREAM-010": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "DREAM-011": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "DREAM-021": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FAM-011": {
    "deck": "family-children",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FAM-012": {
    "deck": "family-children",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FAM-013": {
    "deck": "family-children",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "FAM-001": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAM-014": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAM-015": {
    "deck": "family-children",
    "type": "rank",
    "depth": 2
  },
  "FAM-016": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-017": {
    "deck": "family-children",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAM-018": {
    "deck": "family-children",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAM-019": {
    "deck": "family-children",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAM-020": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-021": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAM-004": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-022": {
    "deck": "family-children",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAM-023": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAM-024": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-025": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAM-026": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-008": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "PAR-010": {
    "deck": "parenting-style",
    "type": "rank",
    "depth": 2
  },
  "PAR-011": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-012": {
    "deck": "parenting-style",
    "type": "open",
    "depth": 2
  },
  "PAR-013": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-014": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-015": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-016": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-017": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-018": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-019": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-020": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-021": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-022": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-023": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAR-024": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAR-025": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAR-026": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAR-027": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "PAR-028": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-012": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "INT-023": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "INT-024": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "INT-025": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "INT-016": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "INT-019": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "INT-018": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-017": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-026": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-027": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-028": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-029": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-030": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-031": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INT-032": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INT-033": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INT-034": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-035": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-008": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-036": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-037": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5
  },
  "INT-038": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-013": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-014": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-001": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-039": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-040": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-041": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-042": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-020": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-021": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "CONF-038": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "CONF-039": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "CONF-040": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "CONF-041": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-042": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-043": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 2
  },
  "CONF-044": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-037": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-045": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 2
  },
  "CONF-046": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 2
  },
  "CONF-047": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-048": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-021": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-049": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-036": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "CONF-016": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-002": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-050": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-051": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-052": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-053": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-054": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-055": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-056": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2
  },
  "CONF-029": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 3
  },
  "CONF-012": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-033": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-034": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-057": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-030": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-031": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-032": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-058": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-059": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-060": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-061": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-013": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "INLAW-014": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "INLAW-015": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INLAW-016": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-011": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "INLAW-010": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "INLAW-012": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "INLAW-017": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-018": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-009": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INLAW-019": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "INLAW-020": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INLAW-021": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "INLAW-022": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "INLAW-023": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INLAW-024": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-006": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INLAW-025": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-026": {
    "deck": "in-laws-extended-family",
    "type": "rank",
    "depth": 2
  },
  "INLAW-027": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INLAW-028": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "INLAW-029": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "FUN-024": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-025": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-026": {
    "deck": "fun-icebreakers",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FUN-027": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-028": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-029": {
    "deck": "fun-icebreakers",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FUN-030": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-031": {
    "deck": "fun-icebreakers",
    "type": "rank",
    "depth": 1
  },
  "FUN-008": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "FUN-009": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "FUN-010": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "FUN-011": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "FUN-012": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true,
    "who": true
  },
  "FUN-013": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true,
    "who": true
  },
  "FUN-014": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true,
    "who": true
  },
  "FUN-015": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true,
    "who": true
  },
  "FUN-032": {
    "deck": "fun-icebreakers",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FUN-033": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-034": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-035": {
    "deck": "fun-icebreakers",
    "type": "rank",
    "depth": 1
  },
  "FUN-036": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-037": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1
  },
  "FUN-038": {
    "deck": "fun-icebreakers",
    "type": "open",
    "depth": 1
  },
  "FUN-007": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-016": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "FUN-020": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-023": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "FUN-018": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-019": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-021": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-039": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "DEAL-022": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "DEAL-023": {
    "deck": "deal-breakers",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "DEAL-003": {
    "deck": "deal-breakers",
    "type": "open",
    "depth": 2
  },
  "DEAL-024": {
    "deck": "deal-breakers",
    "type": "rank",
    "depth": 5
  },
  "DEAL-025": {
    "deck": "deal-breakers",
    "type": "rank",
    "depth": 5
  },
  "DEAL-020": {
    "deck": "deal-breakers",
    "type": "rank",
    "depth": 5
  },
  "DEAL-004": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-007": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-006": {
    "deck": "deal-breakers",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "DEAL-008": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-026": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-027": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-012": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-010": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-017": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-019": {
    "deck": "deal-breakers",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "DEAL-014": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-013": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "DEAL-021": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "HEALTH-011": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-012": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-013": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-014": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-009": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-015": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-016": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-017": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-018": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-019": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HEALTH-020": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 2
  },
  "HEALTH-021": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HEALTH-022": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HEALTH-005": {
    "deck": "health-lifestyle",
    "type": "open",
    "depth": 4
  },
  "HEALTH-006": {
    "deck": "health-lifestyle",
    "type": "open",
    "depth": 4
  },
  "PAST-012": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-013": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-014": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-015": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-016": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-017": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-018": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 3
  },
  "PAST-019": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-020": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 3
  },
  "PAST-021": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAST-022": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 4
  },
  "PAST-023": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAST-024": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAST-025": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "PAST-026": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAST-027": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAST-009": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-028": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAST-029": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-030": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-031": {
    "deck": "past-baggage",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "PAST-001": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-032": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAST-033": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAST-034": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 5
  },
  "PAST-035": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 5
  },
  "CAREER-001": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-011": {
    "deck": "career-ambition",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CAREER-006": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-008": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-003": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-010": {
    "deck": "career-ambition",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "CAREER-005": {
    "deck": "career-ambition",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CAREER-007": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-009": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-004": {
    "deck": "career-ambition",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "CAREER-012": {
    "deck": "career-ambition",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "CAREER-013": {
    "deck": "career-ambition",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "SELF-013": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "SELF-001": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-004": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-028": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "SELF-030": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-031": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-032": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-011": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-008": {
    "deck": "character-self-awareness",
    "type": "rank",
    "depth": 2
  },
  "SELF-033": {
    "deck": "character-self-awareness",
    "type": "rank",
    "depth": 2
  },
  "SELF-023": {
    "deck": "character-self-awareness",
    "type": "rank",
    "depth": 2
  },
  "SELF-024": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-029": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-016": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-020": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-015": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-034": {
    "deck": "character-self-awareness",
    "type": "rank",
    "depth": 2
  },
  "SELF-035": {
    "deck": "character-self-awareness",
    "type": "rank",
    "depth": 2
  },
  "SELF-036": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-022": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-018": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-037": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-021": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-038": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-025": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-026": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-039": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-040": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-041": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "SELF-042": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 4
  },
  "SELF-006": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "SELF-007": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 4
  },
  "SELF-043": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "SELF-012": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "US-051": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "US-008": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 1
  },
  "US-052": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-053": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-050": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "US-016": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-035": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-054": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-048": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-055": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-056": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-057": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-058": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-059": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-060": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-049": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-029": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-061": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-062": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-063": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-034": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "US-064": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "US-065": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-066": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "US-067": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-068": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-069": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-070": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-071": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-072": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-073": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-074": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "US-010": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 1
  },
  "US-075": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "US-076": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-077": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-078": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-079": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-080": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-030": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-081": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-082": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-083": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-084": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-085": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-086": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-087": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-088": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-089": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-090": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-091": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-092": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-002": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-093": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-004": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-094": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-095": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-096": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-097": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-098": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-099": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-006": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-100": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-101": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-102": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-103": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-104": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-105": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-106": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-107": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-108": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-109": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-110": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-111": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-040": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-041": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 4
  },
  "US-112": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-113": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-114": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "US-115": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 4
  },
  "US-038": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-116": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-117": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-118": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-119": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-011": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 5
  },
  "US-120": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "US-121": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 5
  },
  "VAL-013": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "VAL-014": {
    "deck": "values-convictions",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "VAL-015": {
    "deck": "values-convictions",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "VAL-016": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-017": {
    "deck": "values-convictions",
    "type": "rank",
    "depth": 5
  },
  "VAL-018": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-019": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-020": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-021": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-022": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-023": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-024": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-025": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-026": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-027": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-028": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-029": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-030": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-031": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-032": {
    "deck": "values-convictions",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "VAL-033": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-034": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-035": {
    "deck": "values-convictions",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "VAL-036": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-037": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-038": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-039": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-040": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "LOYAL-009": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "LOYAL-016": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "LOYAL-005": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-018": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-019": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "LOYAL-020": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "LOYAL-021": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-010": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 1,
    "guessable": true,
    "who": true
  },
  "LOYAL-022": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-012": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "LOYAL-013": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "LOYAL-015": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "LOYAL-011": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "LOYAL-017": {
    "deck": "faithfulness-loyalty",
    "type": "rank",
    "depth": 4
  },
  "LOYAL-023": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "LOYAL-024": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "LOYAL-025": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5
  },
  "LOYAL-026": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "LOYAL-027": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "LOYAL-028": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "LOYAL-029": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "NOW-025": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "NOW-026": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "NOW-027": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "NOW-022": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-002": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-001": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-019": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-003": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "NOW-005": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "NOW-028": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "NOW-029": {
    "deck": "where-we-are-now",
    "type": "open",
    "depth": 4
  },
  "NOW-009": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-013": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "NOW-012": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-021": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-030": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "NOW-031": {
    "deck": "where-we-are-now",
    "type": "rank",
    "depth": 4
  },
  "NOW-032": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-033": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-034": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-010": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-011": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-006": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-007": {
    "deck": "where-we-are-now",
    "type": "rank",
    "depth": 4
  },
  "NOW-015": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-017": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-023": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-020": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "NOW-024": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 5,
    "guessable": true
  }
};

/** Each deck's parts, in order, as question ids (what one publish releases). */
export const LEVELS: Record<string, string[][]> = {
  "in-the-home": [
    [
      "HOME-012",
      "HOME-013",
      "HOME-014",
      "HOME-008",
      "HOME-006",
      "HOME-010",
      "HOME-011"
    ],
    [
      "HOME-015",
      "HOME-016",
      "HOME-007",
      "HOME-017",
      "HOME-009",
      "HOME-018",
      "HOME-019",
      "HOME-020"
    ]
  ],
  "finances-money": [
    [
      "FIN-018",
      "FIN-019",
      "FIN-020",
      "FIN-021",
      "FIN-022",
      "FIN-023",
      "FIN-004",
      "FIN-024"
    ],
    [
      "FIN-011",
      "FIN-025",
      "FIN-026",
      "FIN-027",
      "FIN-028",
      "FIN-029",
      "FIN-030",
      "FIN-031"
    ],
    [
      "FIN-032",
      "FIN-033",
      "FIN-034",
      "FIN-035",
      "FIN-036",
      "FIN-037",
      "FIN-038",
      "FIN-039"
    ]
  ],
  "faith-worship-practice": [
    [
      "FAITH-007",
      "FAITH-010",
      "FAITH-036",
      "FAITH-031",
      "FAITH-026",
      "FAITH-003",
      "FAITH-033"
    ],
    [
      "FAITH-001",
      "FAITH-004",
      "FAITH-017",
      "FAITH-021",
      "FAITH-037",
      "FAITH-038",
      "FAITH-039"
    ],
    [
      "FAITH-020",
      "FAITH-015",
      "FAITH-040",
      "FAITH-028",
      "FAITH-041",
      "FAITH-042",
      "FAITH-043"
    ],
    [
      "FAITH-012",
      "FAITH-044",
      "FAITH-045",
      "FAITH-025",
      "FAITH-030",
      "FAITH-024",
      "FAITH-046"
    ],
    [
      "FAITH-018",
      "FAITH-047",
      "FAITH-022",
      "FAITH-048",
      "FAITH-016",
      "FAITH-049",
      "FAITH-050",
      "FAITH-051"
    ]
  ],
  "roles-responsibilities": [
    [
      "ROLE-011",
      "ROLE-013",
      "ROLE-014",
      "ROLE-015",
      "ROLE-016",
      "ROLE-017",
      "ROLE-018",
      "ROLE-019"
    ],
    [
      "ROLE-020",
      "ROLE-021",
      "ROLE-022",
      "ROLE-023",
      "ROLE-024",
      "ROLE-025",
      "ROLE-026",
      "ROLE-027"
    ]
  ],
  "theology-beliefs": [
    [
      "THEO-011",
      "THEO-012",
      "THEO-013",
      "THEO-014",
      "THEO-015",
      "THEO-016",
      "THEO-017"
    ],
    [
      "THEO-018",
      "THEO-019",
      "THEO-020",
      "THEO-021",
      "THEO-022",
      "THEO-023"
    ],
    [
      "THEO-024",
      "THEO-025",
      "THEO-026",
      "THEO-027",
      "THEO-028",
      "THEO-029",
      "THEO-030",
      "THEO-031"
    ]
  ],
  "dreams-future": [
    [
      "DREAM-006",
      "DREAM-013",
      "DREAM-014",
      "DREAM-015",
      "DREAM-016",
      "DREAM-008",
      "DREAM-003",
      "DREAM-017"
    ],
    [
      "DREAM-001",
      "DREAM-004",
      "DREAM-018",
      "DREAM-019",
      "DREAM-020",
      "DREAM-010",
      "DREAM-011",
      "DREAM-021"
    ]
  ],
  "family-children": [
    [
      "FAM-011",
      "FAM-012",
      "FAM-013",
      "FAM-001",
      "FAM-014",
      "FAM-015"
    ],
    [
      "FAM-016",
      "FAM-017",
      "FAM-018",
      "FAM-019",
      "FAM-020",
      "FAM-021"
    ],
    [
      "FAM-004",
      "FAM-022",
      "FAM-023",
      "FAM-024",
      "FAM-025",
      "FAM-026"
    ]
  ],
  "parenting-style": [
    [
      "PAR-008",
      "PAR-010",
      "PAR-011",
      "PAR-012",
      "PAR-013",
      "PAR-014"
    ],
    [
      "PAR-015",
      "PAR-016",
      "PAR-017",
      "PAR-018",
      "PAR-019",
      "PAR-020",
      "PAR-021",
      "PAR-022"
    ],
    [
      "PAR-023",
      "PAR-024",
      "PAR-025",
      "PAR-026",
      "PAR-027",
      "PAR-028"
    ]
  ],
  "intimacy-physical": [
    [
      "INT-012",
      "INT-023",
      "INT-024",
      "INT-025",
      "INT-016",
      "INT-019",
      "INT-018",
      "INT-017"
    ],
    [
      "INT-026",
      "INT-027",
      "INT-028",
      "INT-029",
      "INT-030",
      "INT-031",
      "INT-032",
      "INT-033"
    ],
    [
      "INT-034",
      "INT-035",
      "INT-008",
      "INT-036",
      "INT-037",
      "INT-038",
      "INT-013",
      "INT-014"
    ],
    [
      "INT-001",
      "INT-039",
      "INT-040",
      "INT-041",
      "INT-042",
      "INT-020",
      "INT-021"
    ]
  ],
  "conflict-communication": [
    [
      "CONF-038",
      "CONF-039",
      "CONF-040",
      "CONF-041",
      "CONF-042",
      "CONF-043",
      "CONF-044",
      "CONF-037"
    ],
    [
      "CONF-045",
      "CONF-046",
      "CONF-047",
      "CONF-048",
      "CONF-021",
      "CONF-049",
      "CONF-036"
    ],
    [
      "CONF-016",
      "CONF-002",
      "CONF-050",
      "CONF-051",
      "CONF-052",
      "CONF-053",
      "CONF-054"
    ],
    [
      "CONF-055",
      "CONF-056",
      "CONF-029",
      "CONF-012",
      "CONF-033",
      "CONF-034",
      "CONF-057"
    ],
    [
      "CONF-030",
      "CONF-031",
      "CONF-032",
      "CONF-058",
      "CONF-059",
      "CONF-060",
      "CONF-061"
    ]
  ],
  "in-laws-extended-family": [
    [
      "INLAW-013",
      "INLAW-014",
      "INLAW-015",
      "INLAW-016",
      "INLAW-011",
      "INLAW-010",
      "INLAW-012"
    ],
    [
      "INLAW-017",
      "INLAW-018",
      "INLAW-009",
      "INLAW-019",
      "INLAW-020",
      "INLAW-021",
      "INLAW-022"
    ],
    [
      "INLAW-023",
      "INLAW-024",
      "INLAW-006",
      "INLAW-025",
      "INLAW-026",
      "INLAW-027",
      "INLAW-028",
      "INLAW-029"
    ]
  ],
  "fun-icebreakers": [
    [
      "FUN-024",
      "FUN-025",
      "FUN-026",
      "FUN-027",
      "FUN-028",
      "FUN-029",
      "FUN-030",
      "FUN-031"
    ],
    [
      "FUN-008",
      "FUN-009",
      "FUN-010",
      "FUN-011",
      "FUN-012",
      "FUN-013",
      "FUN-014",
      "FUN-015"
    ],
    [
      "FUN-032",
      "FUN-033",
      "FUN-034",
      "FUN-035",
      "FUN-036",
      "FUN-037",
      "FUN-038"
    ],
    [
      "FUN-007",
      "FUN-016",
      "FUN-020",
      "FUN-023",
      "FUN-018",
      "FUN-019",
      "FUN-021",
      "FUN-039"
    ]
  ],
  "deal-breakers": [
    [
      "DEAL-022",
      "DEAL-023",
      "DEAL-003",
      "DEAL-024",
      "DEAL-025",
      "DEAL-020"
    ],
    [
      "DEAL-004",
      "DEAL-007",
      "DEAL-006",
      "DEAL-008",
      "DEAL-026",
      "DEAL-027",
      "DEAL-012"
    ],
    [
      "DEAL-010",
      "DEAL-017",
      "DEAL-019",
      "DEAL-014",
      "DEAL-013",
      "DEAL-021"
    ]
  ],
  "health-lifestyle": [
    [
      "HEALTH-011",
      "HEALTH-012",
      "HEALTH-013",
      "HEALTH-014",
      "HEALTH-009",
      "HEALTH-015",
      "HEALTH-016"
    ],
    [
      "HEALTH-017",
      "HEALTH-018",
      "HEALTH-019",
      "HEALTH-020",
      "HEALTH-021",
      "HEALTH-022",
      "HEALTH-005",
      "HEALTH-006"
    ]
  ],
  "past-baggage": [
    [
      "PAST-012",
      "PAST-013",
      "PAST-014",
      "PAST-015",
      "PAST-016",
      "PAST-017",
      "PAST-018"
    ],
    [
      "PAST-019",
      "PAST-020",
      "PAST-021",
      "PAST-022",
      "PAST-023",
      "PAST-024",
      "PAST-025"
    ],
    [
      "PAST-026",
      "PAST-027",
      "PAST-009",
      "PAST-028",
      "PAST-029",
      "PAST-030"
    ],
    [
      "PAST-031",
      "PAST-001",
      "PAST-032",
      "PAST-033",
      "PAST-034",
      "PAST-035"
    ]
  ],
  "career-ambition": [
    [
      "CAREER-001",
      "CAREER-011",
      "CAREER-006",
      "CAREER-008",
      "CAREER-003",
      "CAREER-010"
    ],
    [
      "CAREER-005",
      "CAREER-007",
      "CAREER-009",
      "CAREER-004",
      "CAREER-012",
      "CAREER-013"
    ]
  ],
  "character-self-awareness": [
    [
      "SELF-013",
      "SELF-001",
      "SELF-004",
      "SELF-028",
      "SELF-030",
      "SELF-031",
      "SELF-032"
    ],
    [
      "SELF-011",
      "SELF-008",
      "SELF-033",
      "SELF-023",
      "SELF-024",
      "SELF-029",
      "SELF-016"
    ],
    [
      "SELF-020",
      "SELF-015",
      "SELF-034",
      "SELF-035",
      "SELF-036",
      "SELF-022",
      "SELF-018"
    ],
    [
      "SELF-037",
      "SELF-021",
      "SELF-038",
      "SELF-025",
      "SELF-026",
      "SELF-039",
      "SELF-040"
    ],
    [
      "SELF-041",
      "SELF-042",
      "SELF-006",
      "SELF-007",
      "SELF-043",
      "SELF-012"
    ]
  ],
  "us-compatibility": [
    [
      "US-051",
      "US-008",
      "US-052",
      "US-053",
      "US-050",
      "US-016",
      "US-035",
      "US-054"
    ],
    [
      "US-048",
      "US-055",
      "US-056",
      "US-057",
      "US-058",
      "US-059",
      "US-060",
      "US-049"
    ],
    [
      "US-029",
      "US-061",
      "US-062",
      "US-063",
      "US-034",
      "US-064",
      "US-065",
      "US-066"
    ],
    [
      "US-067",
      "US-068",
      "US-069",
      "US-070",
      "US-071",
      "US-072",
      "US-073"
    ],
    [
      "US-074",
      "US-010",
      "US-075",
      "US-076",
      "US-077",
      "US-078",
      "US-079",
      "US-080"
    ],
    [
      "US-030",
      "US-081",
      "US-082",
      "US-083",
      "US-084",
      "US-085",
      "US-086"
    ],
    [
      "US-087",
      "US-088",
      "US-089",
      "US-090",
      "US-091",
      "US-092"
    ],
    [
      "US-002",
      "US-093",
      "US-004",
      "US-094",
      "US-095",
      "US-096",
      "US-097"
    ],
    [
      "US-098",
      "US-099",
      "US-006",
      "US-100",
      "US-101",
      "US-102",
      "US-103"
    ],
    [
      "US-104",
      "US-105",
      "US-106",
      "US-107",
      "US-108",
      "US-109",
      "US-110"
    ],
    [
      "US-111",
      "US-040",
      "US-041",
      "US-112",
      "US-113",
      "US-114",
      "US-115"
    ],
    [
      "US-038",
      "US-116",
      "US-117",
      "US-118",
      "US-119",
      "US-011",
      "US-120",
      "US-121"
    ]
  ],
  "values-convictions": [
    [
      "VAL-013",
      "VAL-014",
      "VAL-015",
      "VAL-016",
      "VAL-017",
      "VAL-018"
    ],
    [
      "VAL-019",
      "VAL-020",
      "VAL-021",
      "VAL-022",
      "VAL-023",
      "VAL-024",
      "VAL-025"
    ],
    [
      "VAL-026",
      "VAL-027",
      "VAL-028",
      "VAL-029",
      "VAL-030",
      "VAL-031",
      "VAL-032"
    ],
    [
      "VAL-033",
      "VAL-034",
      "VAL-035",
      "VAL-036",
      "VAL-037",
      "VAL-038",
      "VAL-039",
      "VAL-040"
    ]
  ],
  "faithfulness-loyalty": [
    [
      "LOYAL-009",
      "LOYAL-016",
      "LOYAL-005",
      "LOYAL-018",
      "LOYAL-019",
      "LOYAL-020",
      "LOYAL-021"
    ],
    [
      "LOYAL-010",
      "LOYAL-022",
      "LOYAL-012",
      "LOYAL-013",
      "LOYAL-015",
      "LOYAL-011",
      "LOYAL-017"
    ],
    [
      "LOYAL-023",
      "LOYAL-024",
      "LOYAL-025",
      "LOYAL-026",
      "LOYAL-027",
      "LOYAL-028",
      "LOYAL-029"
    ]
  ],
  "where-we-are-now": [
    [
      "NOW-025",
      "NOW-026",
      "NOW-027",
      "NOW-022",
      "NOW-002",
      "NOW-001",
      "NOW-019"
    ],
    [
      "NOW-003",
      "NOW-005",
      "NOW-028",
      "NOW-029",
      "NOW-009",
      "NOW-013",
      "NOW-012",
      "NOW-021"
    ],
    [
      "NOW-030",
      "NOW-031",
      "NOW-032",
      "NOW-033",
      "NOW-034",
      "NOW-010",
      "NOW-011"
    ],
    [
      "NOW-006",
      "NOW-007",
      "NOW-015",
      "NOW-017",
      "NOW-023",
      "NOW-020",
      "NOW-024"
    ]
  ]
};
