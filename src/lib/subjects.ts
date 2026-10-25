// Conversations grouped by subject (design refresh, item 11), replacing the
// Warm-up / Core / Deep buckets, which put 13 of 21 topics in one middle group.
// Health moves to Life together. Order within a group is the display order.
export const SUBJECTS: { key: string; en: string; fr: string; tagEn: string; tagFr: string; slugs: string[] }[] = [
  {
    key: "light",
    en: "Light to start",
    fr: "Pour commencer en douceur",
    tagEn: "easy openers",
    tagFr: "pour se lancer",
    slugs: ["fun-icebreakers", "in-the-home"],
  },
  {
    key: "life",
    en: "Life together",
    fr: "La vie à deux",
    tagEn: "the everyday",
    tagFr: "le quotidien",
    slugs: [
      "finances-money",
      "roles-responsibilities",
      "career-ambition",
      "health-lifestyle",
      "family-children",
      "parenting-style",
      "in-laws-extended-family",
    ],
  },
  {
    key: "faith",
    en: "Faith",
    fr: "La foi",
    tagEn: "what you believe",
    tagFr: "ce que vous croyez",
    slugs: ["faith-worship-practice", "theology-beliefs", "values-convictions"],
  },
  {
    key: "you",
    en: "The two of you",
    fr: "Vous deux",
    tagEn: "who you are",
    tagFr: "qui vous êtes",
    slugs: [
      "us-compatibility",
      "character-self-awareness",
      "conflict-communication",
      "dreams-future",
      "past-baggage",
      "where-we-are-now",
    ],
  },
  {
    key: "deeper",
    en: "Deeper and honest",
    fr: "Plus profond et honnête",
    tagEn: "when you’re ready",
    tagFr: "quand vous serez prêts",
    slugs: ["intimacy-physical", "faithfulness-loyalty", "deal-breakers"],
  },
];
