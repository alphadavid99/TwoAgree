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
}

/** Every question's selection metadata, keyed by id. */
export const BANK: Record<string, BankEntry> = {
  "HOME-001": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-002": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-003": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-004": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HOME-005": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "HOME-006": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HOME-007": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "HOME-008": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-009": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FIN-001": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-002": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-003": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-004": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-005": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-006": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-007": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FIN-008": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-009": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FIN-010": {
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
  "FIN-012": {
    "deck": "finances-money",
    "type": "rank",
    "depth": 3
  },
  "FIN-013": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-014": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-015": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-016": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-017": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FAITH-001": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FAITH-002": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-003": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-004": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-005": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-006": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-007": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FAITH-008": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-009": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-010": {
    "deck": "faith-worship-practice",
    "type": "open",
    "depth": 1
  },
  "FAITH-011": {
    "deck": "faith-worship-practice",
    "type": "open",
    "depth": 2
  },
  "FAITH-012": {
    "deck": "faith-worship-practice",
    "type": "open",
    "depth": 1
  },
  "FAITH-013": {
    "deck": "faith-worship-practice",
    "type": "rank",
    "depth": 2
  },
  "FAITH-014": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-015": {
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
  "FAITH-017": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-018": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "FAITH-019": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "FAITH-020": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FAITH-021": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-022": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-023": {
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
  "FAITH-025": {
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
  "FAITH-027": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-028": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-029": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-030": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAITH-031": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-032": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FAITH-033": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-034": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-035": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "ROLE-001": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-002": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-003": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "ROLE-004": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "ROLE-005": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "THEO-001": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "THEO-002": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "THEO-003": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-004": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-005": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-006": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-007": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "THEO-008": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "THEO-009": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-010": {
    "deck": "theology-beliefs",
    "type": "rank",
    "depth": 3
  },
  "DREAM-001": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "DREAM-002": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "DREAM-003": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "DREAM-004": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "DREAM-005": {
    "deck": "dreams-future",
    "type": "open",
    "depth": 2
  },
  "DREAM-006": {
    "deck": "dreams-future",
    "type": "open",
    "depth": 1
  },
  "FAM-001": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAM-002": {
    "deck": "family-children",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAM-003": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-004": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-005": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAM-006": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-007": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-008": {
    "deck": "family-children",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAM-009": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-010": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-001": {
    "deck": "parenting-style",
    "type": "rank",
    "depth": 2
  },
  "PAR-002": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-003": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAR-004": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-005": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-006": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-007": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INT-001": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-002": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-003": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "LOYAL-001": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-005": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "LOYAL-002": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5
  },
  "INT-007": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-008": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-009": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-010": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5
  },
  "LOYAL-003": {
    "deck": "faithfulness-loyalty",
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
  "CONF-001": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "CONF-002": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-003": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 2
  },
  "CONF-004": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-004": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-005": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-006": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-008": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 2
  },
  "CONF-009": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 1
  },
  "LOYAL-007": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-011": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 2
  },
  "CONF-012": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-013": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-014": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-015": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "CONF-016": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-017": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-018": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-019": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-020": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "CONF-021": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-022": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-023": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-024": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-025": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-026": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-027": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-028": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-001": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INLAW-002": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-003": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INLAW-004": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "INLAW-005": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INLAW-006": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INLAW-007": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FUN-010": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-008": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-023": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-009": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-011": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-002": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "DEAL-001": {
    "deck": "deal-breakers",
    "type": "rank",
    "depth": 5
  },
  "DEAL-002": {
    "deck": "deal-breakers",
    "type": "rank",
    "depth": 5
  },
  "DEAL-003": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "DEAL-004": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-005": {
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
  "DEAL-007": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-008": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-009": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "HEALTH-001": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-002": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-003": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-004": {
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
  "HEALTH-007": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HEALTH-008": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-009": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-010": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "PAST-001": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-002": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-003": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 3
  },
  "PAST-004": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "LOYAL-008": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "PAST-006": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 3
  },
  "PAST-007": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-008": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-009": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-010": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 3
  },
  "PAST-011": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CAREER-001": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-002": {
    "deck": "career-ambition",
    "type": "open",
    "depth": 2
  },
  "CAREER-003": {
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
  "CAREER-005": {
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
  "CAREER-007": {
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
  "CAREER-009": {
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
  "SELF-001": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-002": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-003": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 4
  },
  "SELF-004": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-005": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
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
  "SELF-008": {
    "deck": "character-self-awareness",
    "type": "rank",
    "depth": 2
  },
  "SELF-009": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-010": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-011": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-012": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "SELF-013": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "SELF-014": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-015": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-016": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-017": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-018": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-019": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-020": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-021": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-022": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
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
  "SELF-027": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-001": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-002": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-003": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-004": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-005": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-006": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-007": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "US-008": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 1
  },
  "US-009": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-010": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 1
  },
  "US-011": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 5
  },
  "US-012": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 4
  },
  "US-013": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-014": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "US-015": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-016": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-017": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-018": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "US-019": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-020": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-021": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-022": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-023": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-024": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "US-025": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-026": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-027": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-028": {
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
  "US-030": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-031": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-032": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-033": {
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
  "US-035": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-036": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-037": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-038": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-039": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-040": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "VAL-001": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-002": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-003": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-004": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-005": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-006": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-007": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-008": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-009": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-010": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-011": {
    "deck": "values-convictions",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "VAL-012": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "FUN-003": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "NOW-001": {
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
  "NOW-003": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "NOW-004": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-005": {
    "deck": "where-we-are-now",
    "type": "scale",
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
  "NOW-008": {
    "deck": "where-we-are-now",
    "type": "rank",
    "depth": 2
  },
  "NOW-009": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
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
  "NOW-012": {
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
  "NOW-014": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "CONF-029": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 3
  },
  "US-041": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 4
  },
  "US-042": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 4
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
  "INT-015": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-016": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "INT-017": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-018": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-019": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 4,
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
  "INT-022": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 3,
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
  "CONF-035": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "CONF-036": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "CONF-037": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-043": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-044": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-045": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-046": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-047": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-048": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-049": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-050": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "SELF-028": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "SELF-029": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
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
  "FUN-004": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "NOW-015": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-016": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "NOW-017": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-018": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "NOW-019": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-020": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "NOW-021": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-022": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-023": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-024": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "FUN-005": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-006": {
    "deck": "fun-icebreakers",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FUN-001": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-007": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-012": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-013": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-014": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-015": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-016": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-017": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
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
  "FUN-020": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-021": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-022": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "ROLE-006": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "ROLE-007": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "ROLE-008": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "ROLE-009": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-010": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "DREAM-007": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "DREAM-008": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "DREAM-009": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 4,
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
  "DREAM-012": {
    "deck": "dreams-future",
    "type": "rank",
    "depth": 3
  },
  "INLAW-008": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INLAW-009": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INLAW-010": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "INLAW-011": {
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
  "DEAL-010": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-011": {
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
  "DEAL-013": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "DEAL-014": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-015": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-016": {
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
  "DEAL-018": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "DEAL-019": {
    "deck": "deal-breakers",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "DEAL-020": {
    "deck": "deal-breakers",
    "type": "rank",
    "depth": 5
  },
  "DEAL-021": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
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
  "PAR-008": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "PAR-009": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "ROLE-011": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "ROLE-012": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 1,
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
  "LOYAL-009": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "LOYAL-010": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "LOYAL-011": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 3,
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
  "LOYAL-014": {
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
  "LOYAL-016": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "LOYAL-017": {
    "deck": "faithfulness-loyalty",
    "type": "rank",
    "depth": 4
  }
};

/** Each deck's parts, in order, as question ids (what one publish releases). */
export const LEVELS: Record<string, string[][]> = {
  "in-the-home": [
    [
      "HOME-001",
      "HOME-002",
      "HOME-003",
      "HOME-006",
      "HOME-008",
      "HOME-010"
    ],
    [
      "HOME-004",
      "HOME-005",
      "HOME-007",
      "HOME-009",
      "HOME-011"
    ]
  ],
  "finances-money": [
    [
      "FIN-009",
      "FIN-001",
      "FIN-002",
      "FIN-003",
      "FIN-004",
      "FIN-005",
      "FIN-006",
      "FIN-008",
      "FIN-010"
    ],
    [
      "FIN-011",
      "FIN-012",
      "FIN-013",
      "FIN-014",
      "FIN-015",
      "FIN-016",
      "FIN-017",
      "FIN-007"
    ]
  ],
  "faith-worship-practice": [
    [
      "FAITH-001",
      "FAITH-007",
      "FAITH-010",
      "FAITH-012",
      "FAITH-020",
      "FAITH-032",
      "FAITH-002"
    ],
    [
      "FAITH-003",
      "FAITH-004",
      "FAITH-005",
      "FAITH-006",
      "FAITH-008",
      "FAITH-009",
      "FAITH-011"
    ],
    [
      "FAITH-013",
      "FAITH-014",
      "FAITH-015",
      "FAITH-016",
      "FAITH-017",
      "FAITH-021",
      "FAITH-022"
    ],
    [
      "FAITH-024",
      "FAITH-025",
      "FAITH-026",
      "FAITH-027",
      "FAITH-028",
      "FAITH-029",
      "FAITH-031"
    ],
    [
      "FAITH-033",
      "FAITH-034",
      "FAITH-035",
      "FAITH-018",
      "FAITH-019",
      "FAITH-023",
      "FAITH-030"
    ]
  ],
  "roles-responsibilities": [
    [
      "ROLE-011",
      "ROLE-012",
      "ROLE-001",
      "ROLE-002",
      "ROLE-003",
      "ROLE-004"
    ],
    [
      "ROLE-009",
      "ROLE-010",
      "ROLE-005",
      "ROLE-006",
      "ROLE-007",
      "ROLE-008"
    ]
  ],
  "theology-beliefs": [
    [
      "THEO-011",
      "THEO-012",
      "THEO-001",
      "THEO-002",
      "THEO-008",
      "THEO-010"
    ],
    [
      "THEO-003",
      "THEO-004",
      "THEO-005",
      "THEO-006",
      "THEO-007",
      "THEO-009"
    ]
  ],
  "dreams-future": [
    [
      "DREAM-002",
      "DREAM-006",
      "DREAM-001",
      "DREAM-003",
      "DREAM-004",
      "DREAM-005"
    ],
    [
      "DREAM-007",
      "DREAM-008",
      "DREAM-010",
      "DREAM-011",
      "DREAM-012",
      "DREAM-009"
    ]
  ],
  "family-children": [
    [
      "FAM-011",
      "FAM-012",
      "FAM-001",
      "FAM-003",
      "FAM-004",
      "FAM-005"
    ],
    [
      "FAM-006",
      "FAM-007",
      "FAM-009",
      "FAM-010",
      "FAM-002",
      "FAM-008"
    ]
  ],
  "parenting-style": [
    [
      "PAR-008",
      "PAR-009",
      "PAR-001",
      "PAR-002",
      "PAR-004",
      "PAR-005",
      "PAR-006",
      "PAR-007",
      "PAR-003"
    ]
  ],
  "intimacy-physical": [
    [
      "INT-012",
      "INT-003",
      "INT-016",
      "INT-022",
      "INT-019",
      "INT-001",
      "INT-002"
    ],
    [
      "INT-005",
      "INT-007",
      "INT-008",
      "INT-009",
      "INT-010",
      "INT-013"
    ],
    [
      "INT-014",
      "INT-015",
      "INT-017",
      "INT-018",
      "INT-020",
      "INT-021"
    ]
  ],
  "conflict-communication": [
    [
      "CONF-001",
      "CONF-009",
      "CONF-020",
      "CONF-002",
      "CONF-003",
      "CONF-004",
      "CONF-008"
    ],
    [
      "CONF-011",
      "CONF-012",
      "CONF-013",
      "CONF-014",
      "CONF-016",
      "CONF-017",
      "CONF-018"
    ],
    [
      "CONF-019",
      "CONF-021",
      "CONF-022",
      "CONF-023",
      "CONF-024",
      "CONF-025",
      "CONF-026"
    ],
    [
      "CONF-027",
      "CONF-028",
      "CONF-029",
      "CONF-030",
      "CONF-031",
      "CONF-032"
    ],
    [
      "CONF-033",
      "CONF-034",
      "CONF-036",
      "CONF-037",
      "CONF-015",
      "CONF-035"
    ]
  ],
  "in-laws-extended-family": [
    [
      "INLAW-013",
      "INLAW-014",
      "INLAW-001",
      "INLAW-002",
      "INLAW-005",
      "INLAW-006",
      "INLAW-007"
    ],
    [
      "INLAW-010",
      "INLAW-011",
      "INLAW-012",
      "INLAW-003",
      "INLAW-004",
      "INLAW-008",
      "INLAW-009"
    ]
  ],
  "fun-icebreakers": [
    [
      "FUN-010",
      "FUN-008",
      "FUN-023",
      "FUN-009",
      "FUN-011",
      "FUN-002",
      "FUN-003",
      "FUN-004"
    ],
    [
      "FUN-005",
      "FUN-006",
      "FUN-001",
      "FUN-007",
      "FUN-016",
      "FUN-017",
      "FUN-020",
      "FUN-022"
    ],
    [
      "FUN-012",
      "FUN-013",
      "FUN-014",
      "FUN-015",
      "FUN-018",
      "FUN-019",
      "FUN-021"
    ]
  ],
  "deal-breakers": [
    [
      "DEAL-022",
      "DEAL-023",
      "DEAL-003",
      "DEAL-013",
      "DEAL-018",
      "DEAL-001",
      "DEAL-002",
      "DEAL-004"
    ],
    [
      "DEAL-005",
      "DEAL-006",
      "DEAL-007",
      "DEAL-008",
      "DEAL-009",
      "DEAL-010",
      "DEAL-011",
      "DEAL-012"
    ],
    [
      "DEAL-014",
      "DEAL-015",
      "DEAL-016",
      "DEAL-017",
      "DEAL-019",
      "DEAL-020",
      "DEAL-021"
    ]
  ],
  "health-lifestyle": [
    [
      "HEALTH-001",
      "HEALTH-002",
      "HEALTH-003",
      "HEALTH-008",
      "HEALTH-009",
      "HEALTH-010",
      "HEALTH-004",
      "HEALTH-007",
      "HEALTH-005",
      "HEALTH-006"
    ]
  ],
  "past-baggage": [
    [
      "PAST-004",
      "PAST-003",
      "PAST-006",
      "PAST-008",
      "PAST-010",
      "PAST-011",
      "PAST-001",
      "PAST-002",
      "PAST-007",
      "PAST-009"
    ]
  ],
  "career-ambition": [
    [
      "CAREER-010",
      "CAREER-001",
      "CAREER-002",
      "CAREER-003",
      "CAREER-005",
      "CAREER-006",
      "CAREER-007",
      "CAREER-008",
      "CAREER-009",
      "CAREER-004"
    ]
  ],
  "character-self-awareness": [
    [
      "SELF-013",
      "SELF-001",
      "SELF-002",
      "SELF-004",
      "SELF-005",
      "SELF-008",
      "SELF-009",
      "SELF-010"
    ],
    [
      "SELF-011",
      "SELF-014",
      "SELF-015",
      "SELF-016",
      "SELF-017",
      "SELF-018",
      "SELF-019"
    ],
    [
      "SELF-020",
      "SELF-021",
      "SELF-022",
      "SELF-023",
      "SELF-024",
      "SELF-025",
      "SELF-026"
    ],
    [
      "SELF-027",
      "SELF-029",
      "SELF-028",
      "SELF-003",
      "SELF-006",
      "SELF-007",
      "SELF-012"
    ]
  ],
  "us-compatibility": [
    [
      "US-008",
      "US-010",
      "US-014",
      "US-034",
      "US-050",
      "US-001",
      "US-003",
      "US-005"
    ],
    [
      "US-006",
      "US-009",
      "US-013",
      "US-017",
      "US-027",
      "US-029",
      "US-030"
    ],
    [
      "US-031",
      "US-033",
      "US-035",
      "US-039",
      "US-048",
      "US-002",
      "US-004"
    ],
    [
      "US-015",
      "US-016",
      "US-019",
      "US-020",
      "US-021",
      "US-022",
      "US-023"
    ],
    [
      "US-025",
      "US-026",
      "US-032",
      "US-036",
      "US-037",
      "US-038",
      "US-040"
    ],
    [
      "US-043",
      "US-047",
      "US-007",
      "US-012",
      "US-018",
      "US-028",
      "US-041"
    ],
    [
      "US-042",
      "US-044",
      "US-045",
      "US-046",
      "US-049",
      "US-011",
      "US-024"
    ]
  ],
  "values-convictions": [
    [
      "VAL-013",
      "VAL-014",
      "VAL-005",
      "VAL-006",
      "VAL-007",
      "VAL-009",
      "VAL-010"
    ],
    [
      "VAL-001",
      "VAL-002",
      "VAL-003",
      "VAL-004",
      "VAL-008",
      "VAL-011",
      "VAL-012"
    ]
  ],
  "faithfulness-loyalty": [
    [
      "LOYAL-009",
      "LOYAL-010",
      "LOYAL-004",
      "LOYAL-005",
      "LOYAL-006",
      "LOYAL-007",
      "LOYAL-011",
      "LOYAL-016",
      "LOYAL-008"
    ],
    [
      "LOYAL-012",
      "LOYAL-013",
      "LOYAL-014",
      "LOYAL-015",
      "LOYAL-017",
      "LOYAL-001",
      "LOYAL-002",
      "LOYAL-003"
    ]
  ],
  "where-we-are-now": [
    [
      "NOW-025",
      "NOW-026",
      "NOW-027",
      "NOW-008",
      "NOW-001",
      "NOW-002",
      "NOW-009"
    ],
    [
      "NOW-012",
      "NOW-019",
      "NOW-021",
      "NOW-022",
      "NOW-003",
      "NOW-004",
      "NOW-005"
    ],
    [
      "NOW-006",
      "NOW-007",
      "NOW-010",
      "NOW-011",
      "NOW-014",
      "NOW-015",
      "NOW-017"
    ],
    [
      "NOW-023",
      "NOW-013",
      "NOW-016",
      "NOW-018",
      "NOW-020",
      "NOW-024"
    ]
  ]
};
