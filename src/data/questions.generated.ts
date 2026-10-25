// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source of truth: data/questions.json + data/decks.json.
// Regenerate with: npm run build:questions   (see CLAUDE.md §9)

export type QuestionType = "scale" | "mc" | "rank" | "open";

export interface Question {
  id: string;
  q: string;
  type: QuestionType;
  /** 1–5 internal sort key + weight. Never rendered as a number (brief 2 §A3). */
  depth: number;
  ref?: string;
  note?: string;
  /** Supports the predict-your-partner scoring layer. */
  guessable?: boolean;
  /** Scores as fully aligned even when answers differ (purple "Complementary"). */
  complement?: boolean;
  /** A scale about the two of you ("I give more" … "you give more"): one partner's answer is flipped before comparing. */
  mirror?: boolean;
  /** "Which of you": opts[0]/[1] are {A} (host) and {B} (guest); answered as "host"/"guest". */
  who?: boolean;
  /** Offers a first-class, unscored "Not yet" answer (brief §7). */
  notYet?: boolean;
  /** Part of the fixed Core scoring instrument (brief 2 §C). */
  core?: boolean;
  /** Reserved: conditional display (brief 2 §A3). */
  showIf?: string;
  /** Reserved: id of a complementary question (brief 2 §A3). */
  complementary?: string;
  /** Options for mc / rank questions. */
  opts?: string[];
  /** Scale endpoint labels (type === "scale"). */
  lo?: string;
  hi?: string;
  /** Scale only: what each of the five points means, lo to hi (English). */
  steps?: string[];
}

export interface Deck {
  name: string;
  color: string;
  icon: string;
  /** A7 onboarding hook — a real question from inside, resolved at build time. */
  hook?: { id: string; q: string };
  /** The deck's fixed parts, in order: a name and its question ids. */
  parts: { name: string; qids: string[] }[];
  questions: Question[];
}

/** Category slugs in display order. */
export const ORDER: string[] = [
  "in-the-home",
  "finances-money",
  "faith-worship-practice",
  "roles-responsibilities",
  "theology-beliefs",
  "dreams-future",
  "family-children",
  "parenting-style",
  "intimacy-physical",
  "conflict-communication",
  "in-laws-extended-family",
  "fun-icebreakers",
  "deal-breakers",
  "health-lifestyle",
  "past-baggage",
  "career-ambition",
  "character-self-awareness",
  "us-compatibility",
  "values-convictions",
  "faithfulness-loyalty",
  "where-we-are-now"
];

/** All decks keyed by slug. */
export const DECKS: Record<string, Deck> = {
  "in-the-home": {
    "name": "Home",
    "color": "#9C7A4A",
    "icon": "home",
    "hook": {
      "id": "HOME-006",
      "q": "How tidy do you need our home to be?"
    },
    "parts": [
      {
        "name": "Who does what",
        "qids": [
          "HOME-012",
          "HOME-013",
          "HOME-014",
          "HOME-008",
          "HOME-006",
          "HOME-010",
          "HOME-011"
        ]
      },
      {
        "name": "Putting down roots",
        "qids": [
          "HOME-015",
          "HOME-016",
          "HOME-007",
          "HOME-017",
          "HOME-009",
          "HOME-018",
          "HOME-019",
          "HOME-020"
        ]
      }
    ],
    "questions": [
      {
        "id": "HOME-012",
        "q": "How would you want us to divide the cooking at home?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "who": true,
        "opts": [
          "Mostly {A}",
          "Mostly {B}",
          "Split roughly equally",
          "Whoever enjoys it or is better at it",
          "Whoever has more time"
        ]
      },
      {
        "id": "HOME-013",
        "q": "How would you want us to divide household chores?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Split them roughly equally",
          "Divide them based on what each person prefers",
          "Divide them based on who is better at each task",
          "Whoever has more time does more",
          "Keep it flexible and adjust as life changes"
        ]
      },
      {
        "id": "HOME-014",
        "q": "Which household jobs would you least like to do? Put your least favourite first.",
        "type": "rank",
        "depth": 1,
        "opts": [
          "Cooking",
          "Cleaning",
          "Laundry",
          "Grocery shopping",
          "Household admin",
          "Repairs and maintenance"
        ]
      },
      {
        "id": "HOME-008",
        "q": "Who should handle home repairs and maintenance?",
        "type": "mc",
        "depth": 1,
        "note": "Division of labour for upkeep, distinct from cooking/chores.",
        "guessable": true,
        "who": true,
        "opts": [
          "Mostly {A}",
          "Mostly {B}",
          "Both of us",
          "We'd hire it out"
        ]
      },
      {
        "id": "HOME-006",
        "q": "How tidy do you need our home to be?",
        "type": "scale",
        "depth": 1,
        "note": "Cleanliness standards — a classic daily-friction gap.",
        "guessable": true,
        "lo": "Relaxed about mess",
        "hi": "Everything in its place"
      },
      {
        "id": "HOME-010",
        "q": "Should we go to bed at the same time?",
        "type": "mc",
        "depth": 1,
        "note": "A concrete togetherness ritual with real friction behind it. Pairs with HEALTH-009 (night owl vs early bird) — the gap between a lark and an owl who both want a shared bedtime is a nightly negotiation.",
        "guessable": true,
        "opts": [
          "Always, if we can",
          "Usually",
          "Whenever each of us is tired",
          "It really doesn't matter"
        ]
      },
      {
        "id": "HOME-011",
        "q": "Which of these should we do together, no matter how busy we get?",
        "type": "mc",
        "depth": 2,
        "ref": "Acts 2:46",
        "note": "Makes the togetherness norm concrete — which ritual is non-negotiable, rather than an abstract rating of how much time couples should share. HOME was a thin category.",
        "guessable": true,
        "opts": [
          "Evening meals",
          "Mornings",
          "Bedtime",
          "Church on Sunday",
          "None of these are essential"
        ]
      },
      {
        "id": "HOME-015",
        "q": "What would you ideally want when it comes to pets in our home?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "A dog",
          "A cat",
          "More than one type of pet",
          "No pets",
          "I'm flexible"
        ]
      },
      {
        "id": "HOME-016",
        "q": "Where would you most want us to build our life long-term?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "In a city",
          "In the suburbs",
          "In a small town",
          "Somewhere rural or quiet",
          "I'm open to wherever life takes us"
        ]
      },
      {
        "id": "HOME-007",
        "q": "How important is it to you to own a home rather than rent?",
        "type": "scale",
        "depth": 2,
        "note": "A practical housing value with real financial weight.",
        "guessable": true,
        "lo": "Renting is fine",
        "hi": "Owning matters a lot"
      },
      {
        "id": "HOME-017",
        "q": "How much would you want us to invest in making our home look and feel the way we want?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Very little",
        "hi": "A lot",
        "steps": [
          "Very little: as long as it's comfortable and functional",
          "A little",
          "A reasonable amount",
          "Quite a lot: our home environment would matter to me",
          "A lot: creating a beautiful home would be a real priority"
        ]
      },
      {
        "id": "HOME-009",
        "q": "How important is having some space at home that's just yours?",
        "type": "scale",
        "depth": 2,
        "note": "Personal-space needs within a shared home.",
        "guessable": true,
        "lo": "Sharing everything is fine",
        "hi": "I need my own space"
      },
      {
        "id": "HOME-018",
        "q": "What would personal space at home mean most to you?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Somewhere quiet to be alone",
          "A workspace or desk",
          "Space for hobbies",
          "My own storage or belongings",
          "I don't really need a separate space"
        ]
      },
      {
        "id": "HOME-019",
        "q": "How open would you want our home to be to friends, family and people from our community?",
        "type": "scale",
        "depth": 2,
        "ref": "Romans 12:13",
        "guessable": true,
        "lo": "Mostly private",
        "hi": "Very open",
        "steps": [
          "Mostly private: home would mainly be our space",
          "Occasionally welcoming people in",
          "A balance of privacy and hospitality",
          "Regularly having people over",
          "Very open: I'd love our home to be a place people regularly gather"
        ]
      },
      {
        "id": "HOME-020",
        "q": "How comfortable would you be with people dropping by without much notice?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Very uncomfortable",
        "hi": "Completely comfortable",
        "steps": [
          "Very uncomfortable",
          "Slightly uncomfortable",
          "It depends",
          "Mostly comfortable",
          "Completely comfortable"
        ]
      }
    ]
  },
  "finances-money": {
    "name": "Money",
    "color": "#5E7A4E",
    "icon": "coin",
    "hook": {
      "id": "FIN-018",
      "q": "Where do you naturally fall with money?"
    },
    "parts": [
      {
        "name": "Sharing money",
        "qids": [
          "FIN-018",
          "FIN-019",
          "FIN-020",
          "FIN-021",
          "FIN-022",
          "FIN-023",
          "FIN-004",
          "FIN-024"
        ]
      },
      {
        "name": "Spending and saving",
        "qids": [
          "FIN-011",
          "FIN-025",
          "FIN-026",
          "FIN-027",
          "FIN-028",
          "FIN-029",
          "FIN-030",
          "FIN-031"
        ]
      },
      {
        "name": "Debt, family and giving",
        "qids": [
          "FIN-032",
          "FIN-033",
          "FIN-034",
          "FIN-035",
          "FIN-036",
          "FIN-037",
          "FIN-038",
          "FIN-039"
        ]
      }
    ],
    "questions": [
      {
        "id": "FIN-018",
        "q": "Where do you naturally fall with money?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "core": true,
        "lo": "Strong spender",
        "hi": "Strong saver",
        "steps": [
          "Strong spender",
          "Mostly a spender",
          "A balance of saving and spending",
          "Mostly a saver",
          "Strong saver"
        ]
      },
      {
        "id": "FIN-019",
        "q": "How would you want us to organise our money in marriage?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "core": true,
        "opts": [
          "Everything combined",
          "Mostly combined, with some personal money",
          "Joint money for shared expenses, with separate personal money",
          "Mostly separate finances",
          "I’m not sure yet"
        ]
      },
      {
        "id": "FIN-020",
        "q": "How would you want us to manage our day-to-day finances?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Both of us actively manage everything together",
          "One person leads, but we regularly review things together",
          "We divide different financial responsibilities between us",
          "One person handles most of the finances",
          "Keep it flexible depending on our circumstances"
        ]
      },
      {
        "id": "FIN-021",
        "q": "Who would you naturally expect to take the lead on keeping track of our finances?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "who": true,
        "opts": [
          "Mainly {A}",
          "Mainly {B}",
          "Both of us equally",
          "Whoever is better at it",
          "I don't have a preference"
        ]
      },
      {
        "id": "FIN-022",
        "q": "How financially transparent should we be with each other?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "core": true,
        "opts": [
          "Some financial things can stay personal",
          "Most things should be shared",
          "We should know the important things",
          "We should be very open about our finances",
          "We should have complete transparency about income, debt, savings and spending"
        ]
      },
      {
        "id": "FIN-023",
        "q": "When should we check with each other before spending money?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "For most non-routine purchases",
          "Whenever something costs more than an amount we've agreed",
          "Only for major purchases",
          "Only when it affects our shared goals or budget",
          "No need if it comes from agreed personal spending money"
        ]
      },
      {
        "id": "FIN-004",
        "q": "How disciplined are you with a monthly budget?",
        "type": "scale",
        "depth": 3,
        "note": "Surfaces day-to-day money habits and rhythm.",
        "guessable": true,
        "lo": "Loose with budgeting",
        "hi": "Track every dollar"
      },
      {
        "id": "FIN-024",
        "q": "How structured would you want us to be with budgeting?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "lo": "Very flexible",
        "hi": "Very structured",
        "steps": [
          "Very flexible: I wouldn't want much of a budget",
          "Mostly flexible",
          "Some structure, with room to adapt",
          "Quite structured",
          "Very structured: I'd want us to plan and track our money closely"
        ]
      },
      {
        "id": "FIN-011",
        "q": "When you're stressed, how often do you spend or shop to feel better?",
        "type": "scale",
        "depth": 3,
        "note": "The 'retail therapy' flag in neutral, self-rated terms.",
        "guessable": true,
        "lo": "Never",
        "hi": "Very often"
      },
      {
        "id": "FIN-025",
        "q": "What are you most likely to spend extra money on?",
        "type": "mc",
        "depth": 3,
        "opts": [
          "Food and eating out",
          "Travel and experiences",
          "Clothes or appearance",
          "Hobbies, technology or entertainment",
          "Gifts or treating other people",
          "Home or lifestyle upgrades"
        ]
      },
      {
        "id": "FIN-026",
        "q": "How much would you want us to prioritise saving for the future over enjoying our money now?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "lo": "Enjoy it now",
        "hi": "Save for the future",
        "steps": [
          "Mostly enjoy it now",
          "Lean towards enjoying it now",
          "Balance both equally",
          "Lean towards saving for the future",
          "Strongly prioritise the future"
        ]
      },
      {
        "id": "FIN-027",
        "q": "As our income grows, how much would you want our lifestyle to grow with it?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "lo": "Very little",
        "hi": "A lot",
        "steps": [
          "Very little: I'd rather keep life simple and use the extra elsewhere",
          "A little",
          "A balance",
          "Quite a lot: I'd want us to enjoy more as we earn more",
          "A lot: I'd want our lifestyle to reflect what we can comfortably afford"
        ]
      },
      {
        "id": "FIN-028",
        "q": "If we had money left over each month, what would you most want us to do with it?",
        "type": "rank",
        "depth": 3,
        "opts": [
          "Give or help others",
          "Save or invest it",
          "Support family",
          "Spend it on experiences and travel",
          "Improve our lifestyle or buy things we enjoy"
        ]
      },
      {
        "id": "FIN-029",
        "q": "How important is it to you that we build emergency savings?",
        "type": "scale",
        "depth": 3,
        "ref": "Proverbs 21:20",
        "guessable": true,
        "lo": "Not very important",
        "hi": "Essential",
        "steps": [
          "Not very important: we can deal with problems as they come",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Essential: I'd want us to build a strong financial safety net"
        ]
      },
      {
        "id": "FIN-030",
        "q": "What would financial success mean most to you? Rank these from most important to least important.",
        "type": "rank",
        "depth": 3,
        "opts": [
          "Security and stability",
          "Freedom and flexibility",
          "Being able to give generously",
          "Enjoying life and experiences",
          "Building something for future generations"
        ]
      },
      {
        "id": "FIN-031",
        "q": "How important is it that we're aligned on money?",
        "type": "scale",
        "depth": 3,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important: we can differ freely on money",
          "Slightly important",
          "Moderately important: I'd want to agree on the big things",
          "Very important",
          "Essential: we need to agree on how we handle money"
        ]
      },
      {
        "id": "FIN-032",
        "q": "Which best describes your attitude towards taking on debt?",
        "type": "mc",
        "depth": 3,
        "ref": "Romans 13:8",
        "guessable": true,
        "core": true,
        "opts": [
          "I would avoid debt whenever possible",
          "I would only use debt for major needs, such as buying a home",
          "I’m comfortable with some debt if there is a clear plan to repay it",
          "I’m comfortable using debt when it makes financial sense",
          "It depends heavily on the type of debt"
        ]
      },
      {
        "id": "FIN-033",
        "q": "What debts, payments or money worries do you have right now that I should know about?",
        "type": "open",
        "depth": 3,
        "ref": "Proverbs 22:7"
      },
      {
        "id": "FIN-034",
        "q": "How would you rate your credit?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Excellent",
          "Good",
          "Fair",
          "Poor",
          "Not sure"
        ]
      },
      {
        "id": "FIN-035",
        "q": "How important would it be to you for us to have major debt under control before having children?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "core": true,
        "lo": "Not a deciding factor",
        "hi": "Essential to me",
        "steps": [
          "Not a deciding factor",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Essential to me"
        ]
      },
      {
        "id": "FIN-036",
        "q": "How much should we help our parents or close family with money when they are struggling?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Our own home comes first: we would rarely help",
          "Help now and then, when we easily can",
          "Help when there is a real need",
          "Helping family is an important duty",
          "Make big sacrifices to help family when needed"
        ]
      },
      {
        "id": "FIN-037",
        "q": "As Christians, which parts of handling money well matter most to you?",
        "type": "rank",
        "depth": 3,
        "ref": "1 Peter 4:10",
        "core": true,
        "opts": [
          "Giving generously",
          "Not spending more than we have",
          "Planning wisely for the future",
          "Being content, not always wanting more",
          "Enjoying what God gives us with thanks"
        ]
      },
      {
        "id": "FIN-038",
        "q": "What do you think God wants money to be for in our lives?",
        "type": "open",
        "depth": 3
      },
      {
        "id": "FIN-039",
        "q": "How would you feel about having a prenuptial agreement?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Strongly against it",
          "Uncomfortable with it, but willing to discuss it",
          "Neutral",
          "Open to it if there were good reasons",
          "I would actively want one"
        ]
      }
    ]
  },
  "faith-worship-practice": {
    "name": "Faith",
    "color": "#5C2E45",
    "icon": "faith",
    "hook": {
      "id": "FAITH-047",
      "q": "When time with your partner and time with God compete, which usually comes first for you?"
    },
    "parts": [
      {
        "name": "Church life",
        "qids": [
          "FAITH-007",
          "FAITH-010",
          "FAITH-036",
          "FAITH-031",
          "FAITH-026",
          "FAITH-003",
          "FAITH-033"
        ]
      },
      {
        "name": "Faith at home",
        "qids": [
          "FAITH-001",
          "FAITH-004",
          "FAITH-017",
          "FAITH-021",
          "FAITH-037",
          "FAITH-038",
          "FAITH-039"
        ]
      },
      {
        "name": "Your walk with God",
        "qids": [
          "FAITH-020",
          "FAITH-015",
          "FAITH-040",
          "FAITH-028",
          "FAITH-041",
          "FAITH-042",
          "FAITH-043"
        ]
      },
      {
        "name": "Honest about faith",
        "qids": [
          "FAITH-012",
          "FAITH-044",
          "FAITH-045",
          "FAITH-025",
          "FAITH-030",
          "FAITH-024",
          "FAITH-046"
        ]
      },
      {
        "name": "God first",
        "qids": [
          "FAITH-018",
          "FAITH-047",
          "FAITH-022",
          "FAITH-048",
          "FAITH-016",
          "FAITH-049",
          "FAITH-050",
          "FAITH-051"
        ]
      }
    ],
    "questions": [
      {
        "id": "FAITH-007",
        "q": "How involved do you want to be in church community and small groups?",
        "type": "scale",
        "depth": 1,
        "ref": "Hebrews 10:25",
        "note": "Surfaces expectations about church community and studying together.",
        "guessable": true,
        "lo": "Rarely involved",
        "hi": "Highly involved"
      },
      {
        "id": "FAITH-010",
        "q": "What's been your best or most difficult experience with church?",
        "type": "open",
        "depth": 1,
        "note": "Surfaces church hopes and hurts."
      },
      {
        "id": "FAITH-036",
        "q": "How would you most like to serve in church?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Teaching or leading: teaching, leading groups or helping others grow",
          "Caring for people: welcoming, supporting or helping others",
          "Behind the scenes: practical help, organising or technical roles",
          "Outreach: serving the community or sharing the faith with others",
          "Worship or creative ministry: music, media or other creative roles",
          "I'm not sure yet"
        ]
      },
      {
        "id": "FAITH-031",
        "q": "How important is it to you that we actively serve in a church, not just attend?",
        "type": "scale",
        "depth": 2,
        "ref": "Galatians 5:13",
        "note": "Distinct from involvement level (FAITH-007) — this is contributing vs consuming.",
        "guessable": true,
        "lo": "Attending is enough",
        "hi": "Serving really matters"
      },
      {
        "id": "FAITH-026",
        "q": "If we come from different churches, how should we decide where to attend together?",
        "type": "mc",
        "depth": 2,
        "note": "The 'where are we going to church' question as distinct positions.",
        "guessable": true,
        "opts": [
          "We go to mine",
          "We go to yours",
          "We find a new one together",
          "We're fine attending separately"
        ]
      },
      {
        "id": "FAITH-003",
        "q": "How committed are you to regular giving or tithing?",
        "type": "scale",
        "depth": 2,
        "ref": "2 Corinthians 9:7",
        "note": "Surfaces convictions about giving without turning it into a numbers test.",
        "guessable": true,
        "lo": "Not a priority",
        "hi": "A firm commitment"
      },
      {
        "id": "FAITH-033",
        "q": "How open are you to being mentored and corrected by mature believers?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 19:20",
        "note": "The mentorship/teachability axis, distinct from feedback style (SELF-009).",
        "guessable": true,
        "lo": "I'd rather figure things out myself",
        "hi": "I welcome it"
      },
      {
        "id": "FAITH-001",
        "q": "How essential is praying together as a couple to you?",
        "type": "scale",
        "depth": 1,
        "ref": "1 Thessalonians 5:17",
        "note": "Reveals expectations about a shared spiritual rhythm.",
        "guessable": true,
        "core": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-004",
        "q": "How often would you want us to pray together?",
        "type": "mc",
        "depth": 2,
        "ref": "Matthew 18:20",
        "note": "Explores what a shared prayer rhythm looks like day to day.",
        "guessable": true,
        "opts": [
          "Daily",
          "A few times a week",
          "Now and then",
          "I'd rather pray privately"
        ]
      },
      {
        "id": "FAITH-017",
        "q": "Should we pray together before making big decisions?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 3:5-6",
        "note": "Surfaces whether prayer is woven into how the couple decides things.",
        "guessable": true,
        "lo": "Rarely",
        "hi": "Always"
      },
      {
        "id": "FAITH-021",
        "q": "How important is regularly studying the Bible together as a couple?",
        "type": "scale",
        "depth": 2,
        "note": "Distinct from church involvement (FAITH-007) — this is the two of you.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-037",
        "q": "How do you think spiritual leadership should work in the home?",
        "type": "mc",
        "depth": 4,
        "ref": "Joshua 24:15",
        "guessable": true,
        "opts": [
          "The husband should take the lead",
          "The wife should take the lead",
          "Leadership should be shared equally",
          "It should depend on the situation",
          "We should lead together rather than one person taking the lead"
        ]
      },
      {
        "id": "FAITH-038",
        "q": "When you pray together, who would you usually expect to take the lead?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "The husband",
          "The wife",
          "Either of us",
          "We would usually pray together without one person leading",
          "It would depend on the situation"
        ]
      },
      {
        "id": "FAITH-039",
        "q": "What matters most to you in a home with faith at the centre?",
        "type": "rank",
        "depth": 2,
        "ref": "Psalm 127:1",
        "opts": [
          "Praying together",
          "Reading and talking about the Bible together",
          "Making decisions based on our faith",
          "Talking openly about God and our faith",
          "Serving and helping others together",
          "Making church an active part of family life"
        ]
      },
      {
        "id": "FAITH-020",
        "q": "What rhythm of personal Bible reading do you hope to keep?",
        "type": "mc",
        "depth": 1,
        "ref": "Psalm 1:2",
        "note": "A target rhythm both pick; the gap is an expectation mismatch, not an audit.",
        "guessable": true,
        "opts": [
          "Daily",
          "Most days",
          "Weekly",
          "Occasionally"
        ]
      },
      {
        "id": "FAITH-015",
        "q": "How important is having a personal prayer life to you?",
        "type": "scale",
        "depth": 2,
        "ref": "Matthew 6:6",
        "note": "Splits personal prayer from praying-together (FAITH-001) so each scores on its own.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-040",
        "q": "Which best describes your relationship with God at the moment?",
        "type": "mc",
        "depth": 2,
        "ref": "Philippians 3:12",
        "guessable": true,
        "opts": [
          "I'm in a dry season: I feel distant or spiritually disconnected",
          "I'm finding my way: I'm seeking God, but my faith feels unsettled",
          "I'm steady: my relationship with God feels consistent",
          "I'm growing: I feel like my faith is deepening",
          "I'm thriving: I feel especially close to God and engaged in my faith"
        ]
      },
      {
        "id": "FAITH-028",
        "q": "How much does Scripture shape your day-to-day decisions?",
        "type": "scale",
        "depth": 2,
        "ref": "Psalm 119:105",
        "note": "Converts 'does the Bible shape your decisions' into a scoreable measure.",
        "guessable": true,
        "lo": "Rarely a factor",
        "hi": "It guides my decisions"
      },
      {
        "id": "FAITH-041",
        "q": "When Scripture challenges something you currently believe or want, what are you most likely to do?",
        "type": "mc",
        "depth": 2,
        "ref": "James 1:22",
        "guessable": true,
        "core": true,
        "opts": [
          "Change my view to align with Scripture",
          "Work through it carefully before changing my view",
          "Question whether I've understood the passage correctly",
          "Hold my current position unless I'm convinced otherwise",
          "I'm unsure"
        ]
      },
      {
        "id": "FAITH-042",
        "q": "Which part of your faith most shapes your everyday life?",
        "type": "mc",
        "depth": 2,
        "ref": "1 Peter 3:15",
        "guessable": true,
        "core": true,
        "opts": [
          "Prayer: how I talk to and rely on God",
          "Scripture: how I understand and apply God's Word",
          "Worship: how I express my relationship with God",
          "Church and community: how I grow and live out my faith with others",
          "How I make decisions: how my faith guides my choices and priorities"
        ]
      },
      {
        "id": "FAITH-043",
        "q": "Would you follow your faith even when it goes against what most people do?",
        "type": "mc",
        "depth": 2,
        "ref": "Romans 12:2",
        "guessable": true,
        "opts": [
          "I would usually do what most people do",
          "I would think about my faith, but it wouldn't always decide",
          "It would depend on the situation",
          "I would usually follow my faith",
          "My faith would come first, every time"
        ]
      },
      {
        "id": "FAITH-012",
        "q": "If you could ask God one question and receive a clear answer, what would you ask Him?",
        "type": "open",
        "depth": 1,
        "note": "A gentle window into each person's faith wrestlings."
      },
      {
        "id": "FAITH-044",
        "q": "Which area of faith do you find yourself wrestling with or questioning most?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Why God allows suffering or difficult things to happen",
          "Hearing God's voice and knowing His guidance",
          "Unanswered prayer",
          "Understanding the Bible or difficult teachings",
          "Salvation, doubt or assurance",
          "God's plan or purpose for my life",
          "I don't currently have a major faith question"
        ]
      },
      {
        "id": "FAITH-045",
        "q": "When you've been through a difficult season, what has it most often done to your faith?",
        "type": "mc",
        "depth": 2,
        "ref": "Romans 5:3-4",
        "guessable": true,
        "opts": [
          "Strengthened it: I've come out trusting God more",
          "Deepened it: I've understood God and my faith differently",
          "Tested it: I've had doubts or questions, but kept believing",
          "Made me more dependent on God: I've learned to rely on Him more",
          "It's been difficult to see what God was doing: I still have unanswered questions"
        ]
      },
      {
        "id": "FAITH-025",
        "q": "How sure are you of your own salvation?",
        "type": "scale",
        "depth": 2,
        "ref": "1 John 5:13",
        "note": "Surfaces assurance of faith without an open-ended testimony.",
        "guessable": true,
        "lo": "Still questioning",
        "hi": "Fully assured"
      },
      {
        "id": "FAITH-030",
        "q": "When you sin, what's your instinct?",
        "type": "mc",
        "depth": 4,
        "ref": "1 John 1:9",
        "note": "The 'do you hide sin or live in repentance' question, made scoreable.",
        "guessable": true,
        "opts": [
          "Confess and seek accountability",
          "Tell God privately and move on",
          "Try to fix it on my own",
          "I tend to hide it"
        ]
      },
      {
        "id": "FAITH-024",
        "q": "How important is it to you that your partner is born again, with a personal conversion?",
        "type": "scale",
        "depth": 2,
        "ref": "John 3:3",
        "note": "Turns the 'are you born again' testimony question into a shared value both rate.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-046",
        "q": "How open would you want to be with your partner about your faith and spiritual life?",
        "type": "mc",
        "depth": 2,
        "ref": "James 5:16",
        "guessable": true,
        "opts": [
          "I would keep most of it private",
          "I would share some things",
          "I would share the main things",
          "I would be very open",
          "I would want complete openness and accountability"
        ]
      },
      {
        "id": "FAITH-018",
        "q": "How important is it that your partner puts God before you?",
        "type": "scale",
        "depth": 4,
        "ref": "Matthew 6:33",
        "note": "The core 'loves Christ first' value, asked as a shared expectation both rate.",
        "guessable": true,
        "core": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-047",
        "q": "When time with your partner and time with God compete, which usually comes first for you?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "My partner",
        "hi": "Time with God",
        "steps": [
          "My partner: I'd usually choose time with my partner",
          "Mostly my partner: I'd usually choose my partner, but it depends",
          "It depends: I'd decide each time",
          "Mostly time with God: I'd usually make space for God first",
          "Time with God: even when my relationship needs attention"
        ]
      },
      {
        "id": "FAITH-022",
        "q": "Our relationship should actively draw us both closer to God, not just leave our faith untouched.",
        "type": "scale",
        "depth": 2,
        "note": "The summing-up green flag, framed as a conviction both rate for agreement.",
        "guessable": true,
        "lo": "Strongly disagree",
        "hi": "Strongly agree"
      },
      {
        "id": "FAITH-048",
        "q": "How involved would you want your partner to be in helping you grow in your faith?",
        "type": "scale",
        "depth": 2,
        "ref": "1 Thessalonians 5:11",
        "guessable": true,
        "lo": "Not involved",
        "hi": "Highly involved",
        "steps": [
          "Not involved: my faith is mainly personal",
          "A little involved: support me when I need it",
          "Moderately involved: encourage and pray with me",
          "Very involved: regularly encourage and challenge me",
          "Highly involved: actively help me grow in my faith"
        ]
      },
      {
        "id": "FAITH-016",
        "q": "How important is it that your partner keeps a personal prayer life of their own, apart from you?",
        "type": "scale",
        "depth": 2,
        "note": "Measures the expectation that a partner owns their own spiritual disciplines.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-049",
        "q": "How important is it to you that you and your partner agree on matters of faith?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "core": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important: we can have quite different views",
          "Slightly important: some differences are fine",
          "Moderately important: I'd want to agree on the main things",
          "Very important: I'd want us to share most of our beliefs",
          "Essential: we need to share the same core beliefs"
        ]
      },
      {
        "id": "FAITH-050",
        "q": "If you and your partner disagreed about something related to faith, how would you want to handle it?",
        "type": "mc",
        "depth": 2,
        "ref": "Romans 14:1",
        "guessable": true,
        "opts": [
          "Talk it through: keep discussing it until we understand each other",
          "Study it together: look at Scripture and learn together",
          "Respect the difference: accept that we may not agree on everything",
          "Seek guidance: talk to a pastor or trusted Christian mentor",
          "Agree to disagree: leave the disagreement alone if it isn't something we need to resolve"
        ]
      },
      {
        "id": "FAITH-051",
        "q": "What do you see as the main purposes of marriage?",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Building a lifelong partnership",
          "Growing together as people",
          "Growing closer to God and serving Him together",
          "Building and raising a family",
          "Love, friendship and companionship"
        ]
      }
    ]
  },
  "roles-responsibilities": {
    "name": "Roles",
    "color": "#7C4B72",
    "icon": "compass",
    "hook": {
      "id": "ROLE-011",
      "q": "Bins, spiders and the car, whose job?"
    },
    "parts": [
      {
        "name": "Who does what",
        "qids": [
          "ROLE-011",
          "ROLE-013",
          "ROLE-014",
          "ROLE-015",
          "ROLE-016",
          "ROLE-017",
          "ROLE-018",
          "ROLE-019"
        ]
      },
      {
        "name": "Leading and headship",
        "qids": [
          "ROLE-020",
          "ROLE-021",
          "ROLE-022",
          "ROLE-023",
          "ROLE-024",
          "ROLE-025",
          "ROLE-026",
          "ROLE-027"
        ]
      }
    ],
    "questions": [
      {
        "id": "ROLE-011",
        "q": "Bins, spiders and the car, whose job?",
        "type": "mc",
        "depth": 1,
        "note": "Roles opens with headship theology. This opens it with spiders. Same deck, and the answers to both are more related than anyone admits.",
        "guessable": true,
        "who": true,
        "core": true,
        "opts": [
          "{A}",
          "{B}",
          "Whoever's nearest",
          "We'd argue about every one of them"
        ]
      },
      {
        "id": "ROLE-013",
        "q": "Who would you expect to organise most of family life, like appointments, school and birthdays?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Mostly the wife",
          "Mostly the husband",
          "Shared equally",
          "Divide different areas between us",
          "Whoever is naturally better organised"
        ]
      },
      {
        "id": "ROLE-014",
        "q": "If one of us works a lot more hours, how should we share the jobs at home?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "Share equally",
        "hi": "By free time",
        "steps": [
          "Still share them equally",
          "Mostly equal, with some changes",
          "The one with more time does a bit more",
          "The one with more time does a lot more",
          "Share them by how much free time each of us has"
        ]
      },
      {
        "id": "ROLE-015",
        "q": "Should earning more money give someone more say in family decisions?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "No",
        "hi": "Yes",
        "steps": [
          "No: income should never decide who has authority",
          "Very little",
          "Sometimes, especially on financial matters",
          "The main provider should usually have greater say financially",
          "Yes: providing financially should bring more say in decisions"
        ]
      },
      {
        "id": "ROLE-016",
        "q": "If the husband works and the wife stays home with the children, how do you value their roles?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "His income carries more responsibility",
          "His role carries slightly more weight",
          "Their roles are different but equally valuable",
          "Her role at home deserves special honour, because of what she gives up",
          "I'm not sure"
        ]
      },
      {
        "id": "ROLE-017",
        "q": "If we have young children, what would you ideally want the mother's role to look like?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Primarily stay at home: caring for the children and home would be her main role",
          "Mostly stay at home: perhaps working part-time or flexibly",
          "Work if she wants to: but motherhood and home should take priority",
          "Continue her career: childcare and home responsibilities should be shared",
          "It depends on our circumstances"
        ]
      },
      {
        "id": "ROLE-018",
        "q": "If his income was enough while our children were young, what would you want the wife to do?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Stay home full-time",
          "Mostly stay home, with some work if she wants",
          "Work part-time",
          "Keep working as normal",
          "Whatever she prefers"
        ]
      },
      {
        "id": "ROLE-019",
        "q": "How strongly do you believe a mother should be the primary caregiver while her children are young?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "Equally shared",
        "hi": "Mainly the mother",
        "steps": [
          "Not at all: parenting should be equally shared",
          "Slight preference for the mother taking more responsibility",
          "Ideally the mother would take the larger role if possible",
          "I strongly believe the mother should be the primary caregiver",
          "I believe caring for young children is primarily the mother's role"
        ]
      },
      {
        "id": "ROLE-020",
        "q": "How strongly do you believe husbands and wives have different God-given roles in marriage?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "Same roles",
        "hi": "Distinct roles",
        "steps": [
          "I don't believe their roles should differ because of gender",
          "Mostly the same roles, with a few differences",
          "Some distinct roles, but much is shared",
          "Husbands and wives have clearly different responsibilities",
          "I strongly believe God designed distinct roles for husbands and wives"
        ]
      },
      {
        "id": "ROLE-021",
        "q": "How do you believe leadership should work in our marriage?",
        "type": "mc",
        "depth": 3,
        "ref": "Ephesians 5:21-33",
        "guessable": true,
        "core": true,
        "opts": [
          "The husband should take primary leadership responsibility",
          "We should lead together as equal partners",
          "Leadership should depend on the area and who is best suited to it",
          "Neither of us should have a defined leadership role",
          "I'm still working out what I believe"
        ]
      },
      {
        "id": "ROLE-022",
        "q": "What matters most to you about leadership in marriage?",
        "type": "rank",
        "depth": 3,
        "opts": [
          "Serving and sacrificing for the family",
          "Making wise decisions",
          "Providing financially",
          "Protecting the family",
          "Leading spiritually",
          "Creating stability and direction"
        ]
      },
      {
        "id": "ROLE-023",
        "q": "What do you believe the husband's headship in marriage should mean in practice?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "He has final responsibility for leading the family",
          "He leads, while actively seeking and valuing his wife's input",
          "He leads mainly through service, sacrifice and protection rather than authority",
          "Husband and wife should share leadership equally",
          "I don't believe husbands have a distinct leadership role",
          "I'm still working this out"
        ]
      },
      {
        "id": "ROLE-024",
        "q": "How strongly do you believe a wife should submit to her husband's leadership in marriage?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "I don't believe a wife has a distinct duty to submit to her husband",
          "I see submission mainly as mutual between husband and wife",
          "I believe wives should respect their husband's leadership, but decisions remain shared",
          "I believe a wife should normally follow her husband's leadership",
          "I strongly believe biblical marriage includes a wife's submission to her husband"
        ]
      },
      {
        "id": "ROLE-025",
        "q": "If we prayed, got wise advice and still disagreed on a big decision, what should happen?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "core": true,
        "opts": [
          "The husband should make the final decision",
          "We should wait until we both agree",
          "Whoever knows most about it, or is responsible for it, should decide",
          "It depends on the decision",
          "I'm not sure"
        ]
      },
      {
        "id": "ROLE-026",
        "q": "How strongly do you believe providing and protecting should be the husband's primary responsibility?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "core": true,
        "lo": "Equally shared",
        "hi": "Mainly the husband",
        "steps": [
          "I don't: those responsibilities should be equally shared",
          "Slightly: I naturally see the husband doing somewhat more",
          "It depends on the couple and circumstances",
          "Strongly: I believe the husband should normally carry primary responsibility",
          "Very strongly: I see providing and protecting as central responsibilities of the husband"
        ]
      },
      {
        "id": "ROLE-027",
        "q": "How strongly do you believe the home and family should be a wife's primary responsibility?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "Equally shared",
        "hi": "Mainly the wife",
        "steps": [
          "I don't: responsibility should be shared without gender expectations",
          "Slightly: I naturally see the wife doing somewhat more",
          "It depends on the couple and circumstances",
          "Strongly: I believe the wife should normally take primary responsibility",
          "Very strongly: I see caring for the home and family as a central responsibility of the wife"
        ]
      }
    ]
  },
  "theology-beliefs": {
    "name": "Theology",
    "color": "#5C2E45",
    "icon": "book",
    "parts": [
      {
        "name": "Where you stand",
        "qids": [
          "THEO-011",
          "THEO-012",
          "THEO-013",
          "THEO-014",
          "THEO-015",
          "THEO-016",
          "THEO-017"
        ]
      },
      {
        "name": "Communion, baptism and leadership",
        "qids": [
          "THEO-018",
          "THEO-019",
          "THEO-020",
          "THEO-021",
          "THEO-022",
          "THEO-023"
        ]
      },
      {
        "name": "The debated questions",
        "qids": [
          "THEO-024",
          "THEO-025",
          "THEO-026",
          "THEO-027",
          "THEO-028",
          "THEO-029",
          "THEO-030",
          "THEO-031"
        ]
      }
    ],
    "questions": [
      {
        "id": "THEO-011",
        "q": "How much do you actually enjoy talking theology?",
        "type": "scale",
        "depth": 1,
        "note": "A perfect on-ramp: light to answer, and genuinely one of the more useful things in the deck. A couple where one loves it and one dreads it has found something before question two asks about women preaching.",
        "guessable": true,
        "core": true,
        "lo": "Really not my thing",
        "hi": "I could go all night"
      },
      {
        "id": "THEO-012",
        "q": "Where did your theology mostly come from?",
        "type": "mc",
        "depth": 1,
        "note": "Provenance before positions. Easy to answer and it reframes every disagreement further down the deck as inherited rather than personal.",
        "guessable": true,
        "opts": [
          "The church I grew up in",
          "A church I chose as an adult",
          "Books and study",
          "Podcasts and online",
          "Still working that out"
        ]
      },
      {
        "id": "THEO-013",
        "q": "Which best describes how you view the Bible?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "core": true,
        "opts": [
          "God's Word and completely trustworthy: what it teaches is true and should shape what I believe and how I live",
          "God's Word and trustworthy for faith and life: but some parts reflect the human authors and their time",
          "Inspired by God, but also shaped by human culture: so some teachings may not apply in the same way today",
          "An important guide to Christian faith: but I don't see it as the final authority on everything",
          "I'm still working out what I believe"
        ]
      },
      {
        "id": "THEO-014",
        "q": "When Christians disagree about what the Bible teaches, how would you decide what is true?",
        "type": "mc",
        "depth": 3,
        "opts": [
          "Study the passage and the rest of the Bible carefully",
          "Look at how Christians through history have understood it",
          "Listen to trusted pastors or church leaders",
          "Pray and follow my conscience before God",
          "A mix of these",
          "I'm not sure"
        ]
      },
      {
        "id": "THEO-015",
        "q": "Which beliefs would matter most for us to agree on?",
        "type": "rank",
        "depth": 3,
        "opts": [
          "The authority of the Bible",
          "Salvation",
          "Baptism",
          "Spiritual gifts",
          "Church leadership and women in ministry",
          "Marriage and gender roles",
          "Creation",
          "The end times"
        ]
      },
      {
        "id": "THEO-016",
        "q": "How important is it to you that we share the same denomination or church tradition?",
        "type": "scale",
        "depth": 5,
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important",
          "Slightly important",
          "I'd prefer some theological similarity",
          "Very important",
          "Essential: I'd want us firmly within the same tradition"
        ]
      },
      {
        "id": "THEO-017",
        "q": "If we became convinced of different church traditions, what would you ideally want us to do?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "One of us joins the other's church",
          "Find a new church we can both agree on",
          "Attend different churches if necessary",
          "Keep studying and discussing until we're aligned",
          "I'm not sure"
        ]
      },
      {
        "id": "THEO-018",
        "q": "How often do you think Christians should ideally take Communion?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Daily or almost daily",
          "Weekly",
          "A few times a month",
          "Monthly or occasionally",
          "Only at certain church services or special occasions",
          "I don't think there needs to be a set rhythm",
          "I'm not sure"
        ]
      },
      {
        "id": "THEO-019",
        "q": "What would you want Communion to look like in our life together?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Mainly take it together when our church offers it",
          "Attend church Communion regularly and sometimes take it together at home",
          "Make taking Communion together at home a regular part of our faith",
          "Take it together occasionally during meaningful spiritual moments",
          "I wouldn't feel a need for us to take Communion privately as a couple",
          "I'm not sure yet"
        ]
      },
      {
        "id": "THEO-020",
        "q": "When should someone normally be baptised?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "As an infant within a believing family",
          "Dedicated as an infant, then baptised when they personally believe",
          "Only after personally professing faith in Christ",
          "I don't have a firm view",
          "I'm still working it out"
        ]
      },
      {
        "id": "THEO-021",
        "q": "How would you want us to handle baptism if we disagreed about what to do with our children?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Baptise them as infants",
          "Dedicate them and let them choose baptism later",
          "Wait until we reach agreement",
          "Follow the teaching of the church we commit to",
          "I'm not sure"
        ]
      },
      {
        "id": "THEO-022",
        "q": "Do you believe women should serve as pastors or elders in a church?",
        "type": "mc",
        "depth": 3,
        "ref": "Galatians 3:28",
        "guessable": true,
        "opts": [
          "Yes",
          "No",
          "Women can lead in certain ministries, but pastor/elder should be reserved for a man",
          "It depends on how the church defines the role",
          "I'm still working it out"
        ]
      },
      {
        "id": "THEO-023",
        "q": "Do you believe a woman should preach or teach Scripture to a mixed congregation of men and women?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Yes, without restriction",
          "Yes, but not while holding pastoral/elder authority",
          "Only in certain settings",
          "No",
          "I'm still working it out"
        ]
      },
      {
        "id": "THEO-024",
        "q": "How do you understand predestination and free will in salvation?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "God sovereignly chooses who will be saved",
          "God offers salvation to everyone and people freely choose whether to respond",
          "God's sovereignty and human choice are both true, even if I can't fully explain how",
          "I don't think the distinction matters much",
          "I'm still working it out"
        ]
      },
      {
        "id": "THEO-025",
        "q": "Can someone who is genuinely saved later lose their salvation?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "No: someone truly saved cannot finally be lost; anyone who permanently walks away was never truly saved",
          "Yes: a believer can later reject the faith and lose their salvation",
          "I'm not sure"
        ]
      },
      {
        "id": "THEO-026",
        "q": "Do you believe miraculous gifts like tongues, prophecy and healing still happen today?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Yes: all the gifts in the New Testament continue today",
          "Yes: but they should be used carefully and tested",
          "Some may continue, but I'm careful about them",
          "No: these miraculous gifts ended with the apostles",
          "I'm still working it out"
        ]
      },
      {
        "id": "THEO-027",
        "q": "How comfortable would you be at a church where tongues or prophecy happen openly in services?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Very comfortable",
          "Comfortable if it is orderly and tested against the Bible",
          "Unsure or cautious",
          "Uncomfortable",
          "I wouldn't want us at that kind of church"
        ]
      },
      {
        "id": "THEO-028",
        "q": "What do you believe about speaking in tongues specifically?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "A gift some believers receive when filled with the Holy Spirit",
          "A gift available to all believers, though not everyone uses it",
          "A real gift, but widely misused in churches today",
          "It ceased with the apostolic era",
          "I'm unsure"
        ]
      },
      {
        "id": "THEO-029",
        "q": "How do you understand demonic influence on Christians?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Christians can be demonically possessed and need deliverance",
          "Christians can experience spiritual attack or oppression, but cannot be possessed",
          "Demonic influence cannot affect Christians",
          "I don't believe in demonic influences",
          "I'm not sure"
        ]
      },
      {
        "id": "THEO-030",
        "q": "Which view of the end times is closest to yours?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Christ removes believers before a future tribulation, then later returns to reign",
          "Christians go through the tribulation before Christ returns to reign",
          "The millennium is mainly symbolic, and Christ returns once at the end",
          "The gospel increasingly transforms the world before Christ returns",
          "I haven't settled my view"
        ]
      },
      {
        "id": "THEO-031",
        "q": "How important would it be to you that we agreed on the end times?",
        "type": "scale",
        "depth": 5,
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important",
          "Slightly important",
          "Nice to agree, but not necessary",
          "Very important",
          "Essential"
        ]
      }
    ]
  },
  "dreams-future": {
    "name": "The Future",
    "color": "#9C4A6E",
    "icon": "star",
    "parts": [
      {
        "name": "Dreaming together",
        "qids": [
          "DREAM-006",
          "DREAM-013",
          "DREAM-014",
          "DREAM-015",
          "DREAM-016",
          "DREAM-008",
          "DREAM-003",
          "DREAM-017"
        ]
      },
      {
        "name": "Building a life",
        "qids": [
          "DREAM-001",
          "DREAM-004",
          "DREAM-018",
          "DREAM-019",
          "DREAM-020",
          "DREAM-010",
          "DREAM-011",
          "DREAM-021"
        ]
      }
    ],
    "questions": [
      {
        "id": "DREAM-006",
        "q": "If we get married, what would you love us to experience, build or do together?",
        "type": "open",
        "depth": 1,
        "note": "A dreaming game that reveals hopes for married life."
      },
      {
        "id": "DREAM-013",
        "q": "If money and work weren't limiting us, what kind of life would you most want us to build?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "A peaceful, settled family life",
          "A life full of travel and new experiences",
          "A life focused on serving God and other people",
          "An ambitious life building businesses, careers or projects",
          "A simple life with plenty of time and freedom",
          "A mixture of several of these"
        ]
      },
      {
        "id": "DREAM-014",
        "q": "Which future milestone would excite you most?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Getting married",
          "Buying or creating our ideal home",
          "Having children",
          "Becoming financially free",
          "Travelling somewhere we've always dreamed of",
          "Building or achieving something significant together"
        ]
      },
      {
        "id": "DREAM-015",
        "q": "How much would you ideally want travel to be part of our life together?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Rarely: I'd mostly prefer life at home",
          "1–2 trips a year",
          "3–4 trips a year",
          "5+ trips a year",
          "As often as time and money allow"
        ]
      },
      {
        "id": "DREAM-016",
        "q": "How open would you be to us living in another country for a season of our lives?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "lo": "Not open at all",
        "hi": "I'd love it",
        "steps": [
          "Not open at all",
          "Possibly for a short period",
          "I'd seriously consider it",
          "Very open",
          "I'd actively love for us to live abroad"
        ]
      },
      {
        "id": "DREAM-008",
        "q": "Where do you want to be living in ten years?",
        "type": "mc",
        "depth": 3,
        "note": "HOME-004 asks city, suburbs or countryside. This is the bigger geography, and it decides things HOME-004 can't.",
        "guessable": true,
        "opts": [
          "Right where we are",
          "Same country, somewhere new",
          "Abroad",
          "Wherever life takes us"
        ]
      },
      {
        "id": "DREAM-003",
        "q": "What does retirement look like to you?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces the long-view picture of life together.",
        "guessable": true,
        "opts": [
          "Rest and simplicity",
          "Travel and adventure",
          "Keep working or serving",
          "No clear picture yet"
        ]
      },
      {
        "id": "DREAM-017",
        "q": "Ten years from now, which would you most want to have achieved?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "A strong family life: a close, loving home and family",
          "Financial freedom: enough money to have real choices about how I live",
          "Meaningful work: work that gives me purpose and satisfaction",
          "A deeper faith: a stronger relationship with God and a more mature faith",
          "More freedom and adventure: the time and freedom to travel, explore and enjoy life"
        ]
      },
      {
        "id": "DREAM-001",
        "q": "How clear is your sense of life purpose?",
        "type": "scale",
        "depth": 2,
        "ref": "Jeremiah 29:11",
        "note": "Surfaces each person's sense of calling and direction.",
        "guessable": true,
        "lo": "Still searching",
        "hi": "Very clear"
      },
      {
        "id": "DREAM-004",
        "q": "How much do you want our marriage to resemble your parents'?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces inherited marriage patterns to carry forward or leave behind.",
        "guessable": true,
        "lo": "Very different from my parents'",
        "hi": "Much like my parents'"
      },
      {
        "id": "DREAM-018",
        "q": "Which parts of married life would you most want us to get right?",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Our relationship with God",
          "Friendship and enjoying each other",
          "How we talk and handle conflict",
          "Raising a family",
          "Money being stable",
          "Supporting each other's personal goals"
        ]
      },
      {
        "id": "DREAM-019",
        "q": "What legacy would you most want us to leave?",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Children and family who know they were deeply loved",
          "A strong faith passed on to the next generation",
          "People whose lives are better because we helped",
          "Money or opportunities for future generations",
          "Meaningful work or something we built",
          "Memories of a happy life together"
        ]
      },
      {
        "id": "DREAM-020",
        "q": "How much would you want us to take big risks to pursue a dream together?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Very little",
        "hi": "A lot",
        "steps": [
          "Very little: I'd strongly prefer stability",
          "Only small, calculated risks",
          "A balance of security and risk",
          "I'd be willing to take significant risks for the right dream",
          "A lot: I'd rather take the chance than wonder what could have been"
        ]
      },
      {
        "id": "DREAM-010",
        "q": "How much risk do you want our life to have?",
        "type": "scale",
        "depth": 3,
        "note": "CAREER-008 covers career risk specifically. This is the whole life — money, moving, starting things — and it's the appetite underneath all of them.",
        "guessable": true,
        "lo": "Steady and predictable",
        "hi": "Adventurous, even when it's unstable"
      },
      {
        "id": "DREAM-011",
        "q": "How important is it that we build something together, rather than just alongside each other?",
        "type": "scale",
        "depth": 3,
        "note": "Joint purpose, distinct from US-039 (how involved in community we are) and DREAM-001 (personal sense of calling). Two people with clear separate callings can still have no shared one.",
        "guessable": true,
        "lo": "Our own paths are fine",
        "hi": "We need a shared purpose"
      },
      {
        "id": "DREAM-021",
        "q": "How much of your own dreams would you give up for the good of our marriage and family?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "lo": "Very little",
        "hi": "Whatever it takes",
        "steps": [
          "Very little: I don't want marriage to cost me my dreams",
          "Some, but I'd protect my main goals",
          "We'd need to find a balance",
          "Quite a lot, for the good of our family",
          "Whatever it takes: marriage and family come first"
        ]
      }
    ]
  },
  "family-children": {
    "name": "Children",
    "color": "#9C7A4A",
    "icon": "family",
    "parts": [
      {
        "name": "Hoping for children",
        "qids": [
          "FAM-011",
          "FAM-012",
          "FAM-013",
          "FAM-001",
          "FAM-014",
          "FAM-015"
        ]
      },
      {
        "name": "If it isn’t easy",
        "qids": [
          "FAM-016",
          "FAM-017",
          "FAM-018",
          "FAM-019",
          "FAM-020",
          "FAM-021"
        ]
      },
      {
        "name": "Faith and family around them",
        "qids": [
          "FAM-004",
          "FAM-022",
          "FAM-023",
          "FAM-024",
          "FAM-025",
          "FAM-026"
        ]
      }
    ],
    "questions": [
      {
        "id": "FAM-011",
        "q": "Be honest: how much do you actually like other people's kids?",
        "type": "scale",
        "depth": 1,
        "note": "A warm, low-stakes entry to a deck that currently opens with 'how many children would you hope for'. Also quietly predictive.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "lo": "Not really my thing",
        "hi": "I love them"
      },
      {
        "id": "FAM-012",
        "q": "Baby names: are you the one with a list already?",
        "type": "mc",
        "depth": 1,
        "note": "Playful, and it surfaces how concretely each person has actually imagined this.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "I've had a list for years",
          "A couple of ideas",
          "Never thought about it",
          "We would definitely argue about this"
        ]
      },
      {
        "id": "FAM-013",
        "q": "Who's more likely to spoil them?",
        "type": "mc",
        "depth": 1,
        "note": "HHB warm-up. Plays as a laugh, sits on the same axis as the discipline questions further down the deck.",
        "guessable": true,
        "who": true,
        "notYet": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, hopeless",
          "Neither of us"
        ]
      },
      {
        "id": "FAM-001",
        "q": "How many children would you hope for?",
        "type": "mc",
        "depth": 2,
        "ref": "Psalm 127:3-5",
        "note": "Aligns hopes for family size and timing early.",
        "guessable": true,
        "core": true,
        "opts": [
          "None",
          "1-2",
          "3-4",
          "5+",
          "Open / unsure"
        ]
      },
      {
        "id": "FAM-014",
        "q": "If we wanted children, when would you ideally want to start trying after marriage?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Within the first year",
          "After 1–2 years",
          "After 3–5 years",
          "More than 5 years later",
          "I'm not sure yet"
        ]
      },
      {
        "id": "FAM-015",
        "q": "What would most affect when you feel ready to have children?",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Our relationship feeling ready",
          "Money being stable",
          "Having the right home",
          "Career or work",
          "Age or fertility"
        ]
      },
      {
        "id": "FAM-016",
        "q": "How important is having biological children to you personally?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "notYet": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important: I'm equally open to other ways of building a family",
          "Slightly important",
          "I would prefer biological children, but I'm flexible",
          "Very important",
          "Essential to me"
        ]
      },
      {
        "id": "FAM-017",
        "q": "If we struggled to have children naturally, how open would you be to fertility treatment?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Very open: I would be comfortable exploring most treatment options",
          "Open, with limits: I would consider treatment, but some options may not be right for me",
          "Only as a last resort: I would want to try other approaches first",
          "Not very open: I would prefer not to use fertility treatment",
          "I'm unsure: I would need to understand the options before deciding"
        ]
      },
      {
        "id": "FAM-018",
        "q": "Would you be comfortable using donor sperm or donor eggs to have a child?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "No: I believe a child should be biologically connected to both spouses",
          "No personally, though I don't believe it is always morally wrong",
          "I would consider it only if no other route worked",
          "Yes: I would be comfortable with donor sperm or eggs",
          "I'm unsure"
        ]
      },
      {
        "id": "FAM-019",
        "q": "Would you be comfortable using a surrogate to have our child?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "No: I would be morally opposed",
          "No personally, though I don't believe all surrogacy is morally wrong",
          "Only in exceptional medical circumstances",
          "Yes, if the arrangement was ethical and carefully regulated",
          "Yes: I would be comfortable with surrogacy",
          "I'm unsure"
        ]
      },
      {
        "id": "FAM-020",
        "q": "How open would you be to adoption as a way of building a family?",
        "type": "scale",
        "depth": 2,
        "ref": "Ephesians 1:5",
        "guessable": true,
        "notYet": true,
        "lo": "Not open",
        "hi": "I'd want to adopt",
        "steps": [
          "Not open to it",
          "Slightly open",
          "I would consider it",
          "Very open",
          "I would actively want to adopt"
        ]
      },
      {
        "id": "FAM-021",
        "q": "Would you consider adoption even if we were able to have biological children?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Yes, I would still want to consider it",
          "Maybe, depending on our circumstances",
          "Mainly if biological children weren't possible",
          "No, adoption probably wouldn't be for me",
          "I'm unsure"
        ]
      },
      {
        "id": "FAM-004",
        "q": "How important is it that we agree on children and parenting?",
        "type": "scale",
        "depth": 2,
        "note": "Weights family/parenting gaps in the alignment score.",
        "guessable": true,
        "notYet": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "FAM-022",
        "q": "If one of us wanted another child and the other didn't, how should we handle it?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "We shouldn't have another child unless we both agree",
          "Keep talking until we reach a decision together",
          "Pause the decision and revisit it later",
          "Seek advice or counselling to help us decide",
          "I'm not sure how we should handle it"
        ]
      },
      {
        "id": "FAM-023",
        "q": "How actively should parents guide their children's faith?",
        "type": "mc",
        "depth": 2,
        "ref": "Proverbs 22:6",
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "Give them freedom: let them explore and decide what they believe",
          "Introduce them to the faith: but avoid strongly directing them",
          "Teach them the faith: while encouraging questions and personal choice",
          "Actively guide them: make faith an important part of their upbringing",
          "Make faith central: intentionally disciple them at home and through church"
        ]
      },
      {
        "id": "FAM-024",
        "q": "How important would it be to you for our children to grow up living near extended family?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "notYet": true,
        "lo": "Not important",
        "hi": "A major priority",
        "steps": [
          "Not important: we could live wherever works for us",
          "Slightly important",
          "Nice to have, but not a deciding factor",
          "Very important",
          "A major priority: I'd want family nearby"
        ]
      },
      {
        "id": "FAM-025",
        "q": "How involved would you want grandparents to be in the day-to-day raising of our children?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "notYet": true,
        "opts": [
          "Limited involvement: loving relationship, but we handle the parenting",
          "Occasional involvement: help or advice from time to time",
          "Regular support: involved often, but we make the parenting decisions",
          "Very involved: regularly helping with care and family life",
          "A major role: closely involved in helping us raise the children"
        ]
      },
      {
        "id": "FAM-026",
        "q": "When it comes to parenting decisions, how much say should grandparents have?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "None: decisions are ours",
          "They can offer advice when asked",
          "Their views should be considered",
          "They should have meaningful input",
          "They should be closely involved in major decisions"
        ]
      }
    ]
  },
  "parenting-style": {
    "name": "Parenting",
    "color": "#9C7A4A",
    "icon": "family",
    "parts": [
      {
        "name": "Raising them well",
        "qids": [
          "PAR-008",
          "PAR-010",
          "PAR-011",
          "PAR-012",
          "PAR-013",
          "PAR-014"
        ]
      },
      {
        "name": "Discipline, school and culture",
        "qids": [
          "PAR-015",
          "PAR-016",
          "PAR-017",
          "PAR-018",
          "PAR-019",
          "PAR-020",
          "PAR-021",
          "PAR-022"
        ]
      },
      {
        "name": "Teenagers, faith and identity",
        "qids": [
          "PAR-023",
          "PAR-024",
          "PAR-025",
          "PAR-026",
          "PAR-027",
          "PAR-028"
        ]
      }
    ],
    "questions": [
      {
        "id": "PAR-008",
        "q": "Be honest: would you be the fun parent or the strict one?",
        "type": "mc",
        "depth": 1,
        "note": "PAR-004 is the serious version of this on a scale. This is the version people answer honestly, and it opens a deck that currently starts with a six-item ranking.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "The fun one",
          "The strict one",
          "Somewhere in the middle",
          "Depends entirely on the day"
        ]
      },
      {
        "id": "PAR-010",
        "q": "What matters most to you in raising our children? Rank these from most important to least important.",
        "type": "rank",
        "depth": 2,
        "ref": "Proverbs 22:6",
        "notYet": true,
        "opts": [
          "Faith and knowing God",
          "Character and integrity",
          "Discipline and self-control",
          "Emotional security",
          "Independence and resilience",
          "Education and achievement"
        ]
      },
      {
        "id": "PAR-011",
        "q": "How much would you want us to parent our children the way you were raised?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "notYet": true,
        "lo": "Very differently",
        "hi": "Very similarly",
        "steps": [
          "Very differently",
          "Mostly differently",
          "Some things the same, some different",
          "Mostly the same",
          "Very similarly"
        ]
      },
      {
        "id": "PAR-012",
        "q": "What would you repeat from how you were raised, and what would you do differently?",
        "type": "open",
        "depth": 2
      },
      {
        "id": "PAR-013",
        "q": "When our child repeatedly disobeys, what should our normal approach to discipline be?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "notYet": true,
        "opts": [
          "Clear rules with consistent consequences",
          "Firm correction, explanation and restoration",
          "Natural or logical consequences wherever possible",
          "Mainly conversation and coaching, with punishment used rarely",
          "Adjust our approach depending on the child and situation"
        ]
      },
      {
        "id": "PAR-014",
        "q": "How important is it to you that our children obey us promptly when we give them a clear instruction?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Not very important",
        "hi": "Extremely important",
        "steps": [
          "Not very important: understanding and discussion matter more",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Extremely important: children should normally obey their parents promptly"
        ]
      },
      {
        "id": "PAR-015",
        "q": "Do you believe physical discipline, such as spanking, should ever be used with our children?",
        "type": "mc",
        "depth": 2,
        "ref": "Proverbs 13:24",
        "guessable": true,
        "core": true,
        "opts": [
          "Yes: it can be a normal part of discipline",
          "Yes: but only rarely or for serious/repeated disobedience",
          "Possibly: but I'd want us to be very cautious about it",
          "No: I wouldn't want us to use physical discipline",
          "I'm unsure"
        ]
      },
      {
        "id": "PAR-016",
        "q": "If you were against physical discipline, how comfortable would you be with your partner using it?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Not comfortable",
        "hi": "Comfortable",
        "steps": [
          "Not comfortable at all",
          "Mostly uncomfortable",
          "We'd need to agree clear limits first",
          "Mostly comfortable",
          "Comfortable trusting their judgement"
        ]
      },
      {
        "id": "PAR-017",
        "q": "How strict should we be about what our children watch, listen to and play?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Let them choose",
        "hi": "Very careful",
        "steps": [
          "Mostly let them choose for themselves",
          "Light boundaries",
          "Age-appropriate limits and some monitoring",
          "Strong boundaries around content",
          "Very careful: actively restrict content that conflicts with our faith and values"
        ]
      },
      {
        "id": "PAR-018",
        "q": "How would you ideally want us to educate our children?",
        "type": "mc",
        "depth": 2,
        "ref": "Deuteronomy 6:7",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Homeschool",
          "Christian or faith-based school",
          "Public/state school",
          "Private school without a particular faith basis",
          "Decide separately based on what suits each child"
        ]
      },
      {
        "id": "PAR-019",
        "q": "How important is it that our children's education actively reinforces our Christian beliefs?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important: faith can mainly be taught at home and church",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Essential: I'd want their education to actively support our faith"
        ]
      },
      {
        "id": "PAR-020",
        "q": "If our child's school kept teaching against the Bible on sex, gender or morality, what should we do?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Keep them there and teach our beliefs clearly at home",
          "Challenge it, or take them out of those lessons where we can",
          "Move them to another school",
          "Homeschool or choose a Christian school",
          "Decide based on the child's age and situation"
        ]
      },
      {
        "id": "PAR-021",
        "q": "How much should we protect our children from parts of mainstream culture that go against our faith?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "notYet": true,
        "lo": "Very little",
        "hi": "Very strongly",
        "steps": [
          "Very little: teach them to judge wisely, and let them see most things",
          "Some limits",
          "A balance of protection and freedom",
          "Strong limits on things that go against our faith",
          "Very strongly: keep them away from many mainstream influences"
        ]
      },
      {
        "id": "PAR-022",
        "q": "How would you want us to handle celebrations like Halloween?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Participate normally",
          "Participate, but avoid parts we believe conflict with our faith",
          "Choose Christian or alternative activities instead",
          "Avoid it completely",
          "I'm unsure"
        ]
      },
      {
        "id": "PAR-023",
        "q": "How would you want our teenagers to approach dating?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "No dating until they're older or ready for marriage",
          "Intentional courtship with strong parental involvement",
          "Dating is fine with clear Christian boundaries and our involvement",
          "Let them date normally while teaching them our values",
          "Decide based on the individual child"
        ]
      },
      {
        "id": "PAR-024",
        "q": "Who should take primary responsibility for teaching our children about sex and relationships?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Both parents together",
          "Primarily the parent of the same sex",
          "Parents should lead, with church teaching supporting us",
          "School education is fine, with us discussing it at home",
          "Use a mixture of parents, church and school"
        ]
      },
      {
        "id": "PAR-025",
        "q": "If our child seriously doubted or rejected the faith, how much should we keep guiding them?",
        "type": "mc",
        "depth": 4,
        "ref": "Deuteronomy 6:6-7",
        "guessable": true,
        "opts": [
          "Let them decide for themselves, without pressure",
          "Mostly give them space, but stay available",
          "Keep talking about faith and encouraging it, without forcing it",
          "Actively guide them and involve trusted Christian mentors",
          "Keep clear Christian rules at home and actively teach them the faith"
        ]
      },
      {
        "id": "PAR-026",
        "q": "If our teenage child said they no longer wanted to attend church, what should we do?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Require them to attend while they're living at home",
          "Expect attendance but make room for discussion and questions",
          "Strongly encourage them, but don't force them",
          "Let them decide whether they attend",
          "It would depend on their age and circumstances"
        ]
      },
      {
        "id": "PAR-027",
        "q": "If our teenage child told us they were in a same-sex relationship, how would you want us to respond?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Fully affirm and support the relationship",
          "Love and support our child, while being clear we don't believe the relationship is right",
          "Tell them we don't allow the relationship while they live in our home",
          "I'm not sure"
        ]
      },
      {
        "id": "PAR-028",
        "q": "If our child identified as another gender or as non-binary, how should we respond?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Fully affirm their gender identity, including their new name and pronouns",
          "Use their new name and pronouns while we take time to understand",
          "Love and support them, but keep affirming their biological sex",
          "Try to help them change their mind",
          "I'm not sure"
        ]
      }
    ]
  },
  "intimacy-physical": {
    "name": "Intimacy",
    "color": "#A8554E",
    "icon": "heart",
    "hook": {
      "id": "INT-019",
      "q": "How much does feeling emotionally close affect wanting to be physically close?"
    },
    "parts": [
      {
        "name": "Affection and attraction",
        "qids": [
          "INT-012",
          "INT-023",
          "INT-024",
          "INT-025",
          "INT-016",
          "INT-019",
          "INT-018",
          "INT-017"
        ]
      },
      {
        "name": "Before marriage",
        "qids": [
          "INT-026",
          "INT-027",
          "INT-028",
          "INT-029",
          "INT-030",
          "INT-031",
          "INT-032",
          "INT-033"
        ]
      },
      {
        "name": "Being honest about sex",
        "qids": [
          "INT-034",
          "INT-035",
          "INT-008",
          "INT-036",
          "INT-037",
          "INT-038",
          "INT-013",
          "INT-014"
        ]
      },
      {
        "name": "Intimacy in marriage",
        "qids": [
          "INT-001",
          "INT-039",
          "INT-040",
          "INT-041",
          "INT-042",
          "INT-020",
          "INT-021"
        ]
      }
    ],
    "questions": [
      {
        "id": "INT-012",
        "q": "How important is everyday affection and playfulness to you?",
        "type": "scale",
        "depth": 1,
        "ref": "Song of Solomon 2:4",
        "note": "The 'delight and enjoyment' theme as a non-sexual affection need.",
        "guessable": true,
        "core": true,
        "lo": "Not a big need",
        "hi": "Very important"
      },
      {
        "id": "INT-023",
        "q": "Which kind of everyday physical affection makes you feel most connected?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Hugging",
          "Kissing",
          "Cuddling",
          "Holding hands",
          "Casual touch throughout the day",
          "I don't need much physical affection"
        ]
      },
      {
        "id": "INT-024",
        "q": "How important is strong physical attraction to you in a marriage?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "core": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not particularly important",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Essential: I need strong physical attraction to my spouse"
        ]
      },
      {
        "id": "INT-025",
        "q": "How important is it that we both keep making an effort with how we look after marriage?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "lo": "Not important",
        "hi": "Extremely important",
        "steps": [
          "Not important",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Extremely important"
        ]
      },
      {
        "id": "INT-016",
        "q": "Which matters more to a marriage?",
        "type": "scale",
        "depth": 3,
        "note": "Relative priority, distinct from the dependency question (does closeness drive desire). Follows the THEO-002 pattern of a spectrum between two honest poles.",
        "guessable": true,
        "lo": "The physical connection",
        "hi": "The emotional connection"
      },
      {
        "id": "INT-019",
        "q": "How much does feeling emotionally close affect wanting to be physically close?",
        "type": "scale",
        "depth": 4,
        "note": "The classic marriage friction — one partner needs closeness to want intimacy, the other uses intimacy to get closeness. A gap here is real misalignment, not complementary.",
        "guessable": true,
        "core": true,
        "lo": "They're separate for me",
        "hi": "I need to feel close first"
      },
      {
        "id": "INT-018",
        "q": "Is it ever okay to hold back physical affection to make a point?",
        "type": "mc",
        "depth": 5,
        "ref": "1 Corinthians 7:5",
        "note": "Names withholding intimacy as leverage directly rather than hedging it. Distinct from INT-011 (temptation protocol) and INT-001 (importance).",
        "guessable": true,
        "opts": [
          "Never",
          "Only if I'm genuinely hurt",
          "Sometimes, yes",
          "It's a fair response"
        ]
      },
      {
        "id": "INT-017",
        "q": "In marriage, would you be comfortable being physically close when we're upset with each other?",
        "type": "mc",
        "depth": 5,
        "ref": "Ephesians 4:26",
        "note": "Sex-and-conflict interaction. The bank covers pre-marriage boundaries exhaustively but nothing about how intimacy behaves inside a marriage. A real and common split.",
        "guessable": true,
        "opts": [
          "Yes: it would help us reconnect",
          "No: I'd need it resolved first",
          "Depends how big the issue is",
          "I'm not sure"
        ]
      },
      {
        "id": "INT-026",
        "q": "Do you believe sex should only take place within marriage?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Yes: sex belongs only within marriage",
          "Yes as the Christian ideal, though I see more complexity around failure and past choices",
          "It depends on the commitment between the couple",
          "No: marriage isn't necessary for sex to be morally right",
          "I'm still working it out"
        ]
      },
      {
        "id": "INT-027",
        "q": "Do you believe sex before marriage is morally wrong?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Yes: sex should only take place within marriage",
          "Generally yes, but I believe there may be exceptional circumstances",
          "I believe sex can be appropriate within a committed relationship before marriage",
          "No: I don't believe marriage determines whether sex is morally right",
          "I'm still working out what I believe"
        ]
      },
      {
        "id": "INT-028",
        "q": "If we crossed our sexual boundary before marriage, how would you want us to respond?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Stop and reset clear boundaries",
          "Stop, pray about it and seek accountability",
          "Reconsider our boundaries together",
          "Continue as long as we were committed to marrying",
          "I don't believe we would need to change anything"
        ]
      },
      {
        "id": "INT-029",
        "q": "What is your conviction about kissing before marriage?",
        "type": "mc",
        "depth": 5,
        "ref": "1 Thessalonians 4:3-4",
        "guessable": true,
        "opts": [
          "I would prefer no kissing before marriage",
          "Brief kissing is fine",
          "Kissing is fine, but with clear limits",
          "I don't believe kissing itself needs a boundary",
          "I'm still working out my boundary"
        ]
      },
      {
        "id": "INT-030",
        "q": "What is your conviction about prolonged or passionate kissing before marriage?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "I believe we should avoid it completely",
          "I think it can be okay with strict limits",
          "I think it is fine as long as we stop before sexual touching",
          "I don't believe it is morally wrong before marriage",
          "I'm unsure"
        ]
      },
      {
        "id": "INT-031",
        "q": "What is your conviction about touching intimate parts of each other's bodies before marriage?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "It should be completely reserved for marriage",
          "We should avoid it, even over clothing",
          "Some touching is acceptable, but intimate sexual touching is not",
          "I don't believe it necessarily needs to wait until marriage",
          "I'm unsure"
        ]
      },
      {
        "id": "INT-032",
        "q": "Would you be comfortable with us lying in bed together or sleeping in the same bed before marriage?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "No, I would avoid it completely",
          "Only in exceptional circumstances, with clear boundaries",
          "Lying together is fine, but not sleeping overnight together",
          "Sleeping in the same bed is fine if we aren't having sex",
          "I have no issue with it"
        ]
      },
      {
        "id": "INT-033",
        "q": "What is your conviction about seeing each other naked before marriage?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "It should be completely reserved for marriage",
          "I would strongly prefer to avoid it",
          "It depends on the situation",
          "I don't believe nudity itself needs to wait until marriage",
          "I'm unsure"
        ]
      },
      {
        "id": "INT-034",
        "q": "How comfortable would you want us to be talking openly about sex with each other?",
        "type": "scale",
        "depth": 5,
        "guessable": true,
        "lo": "Very difficult",
        "hi": "Completely open",
        "steps": [
          "I'd find those conversations very difficult",
          "Somewhat uncomfortable",
          "Comfortable discussing the important things",
          "Very comfortable",
          "Completely open: nothing about our sex life should be difficult to discuss"
        ]
      },
      {
        "id": "INT-035",
        "q": "If something in our sex life wasn't working for you, how would you most likely handle it?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Tell me directly",
          "Wait for the right moment and talk about it gently",
          "Try to adjust without saying much",
          "Find it difficult to raise unless it became a serious problem",
          "Seek advice before talking to me"
        ]
      },
      {
        "id": "INT-008",
        "q": "How important is it to you that your partner saved, or is saving, sex for marriage?",
        "type": "scale",
        "depth": 5,
        "ref": "Hebrews 13:4",
        "note": "The 'body count' concern as a value both rate, not a number to extract.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "INT-036",
        "q": "Would you want to know how many previous sexual partners your partner has had?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Yes: I'd want to know the exact number",
          "I'd want a general idea, but not necessarily an exact number",
          "Only if there were important circumstances I needed to understand",
          "I'd rather not know",
          "It doesn't matter to me"
        ]
      },
      {
        "id": "INT-037",
        "q": "How much of our sexual history should we share with each other before marriage?",
        "type": "mc",
        "depth": 5,
        "opts": [
          "Full disclosure, including previous partners and significant experiences",
          "Honest disclosure of the important facts, without unnecessary detail",
          "Only disclose things that could affect our marriage, health or trust",
          "I believe some parts of the past can remain private",
          "I'm unsure"
        ]
      },
      {
        "id": "INT-038",
        "q": "How much detail about past sexual experiences would you actually want to hear?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "I would want to understand the significant details",
          "I would want the facts, but not graphic details",
          "Only what directly affects our relationship",
          "As little detail as possible",
          "I'd rather not discuss previous experiences unless necessary"
        ]
      },
      {
        "id": "INT-013",
        "q": "Can you fully know someone you've never slept with?",
        "type": "mc",
        "depth": 5,
        "ref": "Genesis 2:24",
        "note": "The secular premise this whole app is built against, named out loud. A couple who waits is marrying on incomplete information and usually isn't allowed to say so. Surfacing it is the point.",
        "guessable": true,
        "opts": [
          "Yes: sex tells you nothing you couldn't learn another way",
          "Mostly, but there'd be a gap",
          "No: it's a real unknown until then",
          "I'd rather not think about it that way"
        ]
      },
      {
        "id": "INT-014",
        "q": "How much of a risk is it to marry someone before knowing whether you're physically compatible?",
        "type": "scale",
        "depth": 5,
        "note": "The honest anxiety underneath the conviction. Someone can hold the conviction firmly and still rate this high — that combination is worth a conversation, not a score.",
        "guessable": true,
        "lo": "No risk",
        "hi": "A real risk",
        "steps": [
          "No risk: it works itself out",
          "A small risk",
          "Some risk",
          "A big risk",
          "A real risk I think about"
        ]
      },
      {
        "id": "INT-001",
        "q": "How important is physical intimacy to you in marriage?",
        "type": "scale",
        "depth": 5,
        "ref": "1 Corinthians 7:3-5",
        "note": "Opens honest conversation about physical intimacy and expectations.",
        "guessable": true,
        "core": true,
        "lo": "A low priority",
        "hi": "Very important"
      },
      {
        "id": "INT-039",
        "q": "Ideally, how often would you want us to have sex when married?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Several times a week or more",
          "Around 2–3 times a week",
          "Around once a week",
          "A few times a month",
          "Less often than that",
          "I don't think frequency can be decided in advance"
        ]
      },
      {
        "id": "INT-040",
        "q": "How would you ideally want sex to be initiated between us?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Either of us should initiate equally",
          "I'd naturally expect the husband to initiate more",
          "I'd naturally expect the wife to initiate more",
          "Whoever wants intimacy should feel free to initiate",
          "I haven't really thought about it"
        ]
      },
      {
        "id": "INT-041",
        "q": "If one of us wanted sex significantly more often than the other, how should we handle it?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Actively work together to find a rhythm that considers both people's needs",
          "The person with the lower desire should make a real effort to meet the other more often",
          "The person with the higher desire should mainly adjust their expectations",
          "Seek counselling or pastoral help if the difference becomes ongoing",
          "It would depend on why our levels of desire were different"
        ]
      },
      {
        "id": "INT-042",
        "q": "How do you understand our responsibility to each other sexually within marriage?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Sex should always be freely chosen, with no sense of marital obligation",
          "We should both intentionally prioritise each other's sexual needs, but never through pressure",
          "Spouses have a real mutual responsibility to maintain sexual intimacy, while still respecting when either person says no",
          "Regularly withholding sex without good reason would be a serious marital problem",
          "I'm still working out what I believe"
        ]
      },
      {
        "id": "INT-020",
        "q": "How much would our physical intimacy tell you about how our marriage is doing?",
        "type": "scale",
        "depth": 5,
        "note": "Sex as barometer, distinct from INT-001 (how important intimacy is). Someone can rate intimacy highly without reading the marriage through it.",
        "guessable": true,
        "notYet": true,
        "lo": "It wouldn't be a signal for me",
        "hi": "It'd be the clearest signal there is"
      },
      {
        "id": "INT-021",
        "q": "If our physical intimacy went through a dry season, what would your first thought be?",
        "type": "mc",
        "depth": 5,
        "note": "Surfaces the interpretation each brings to a low season before it happens — the interpretation is usually what does the damage, not the season.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Something's wrong between us",
          "It's just a busy season",
          "I'd feel rejected",
          "I'd want to talk about it straight away"
        ]
      }
    ]
  },
  "conflict-communication": {
    "name": "Conflict",
    "color": "#A8554E",
    "icon": "chat",
    "hook": {
      "id": "CONF-021",
      "q": "When someone interrupts you, how do you usually react?"
    },
    "parts": [
      {
        "name": "Love, time and respect",
        "qids": [
          "CONF-038",
          "CONF-039",
          "CONF-040",
          "CONF-041",
          "CONF-042",
          "CONF-043",
          "CONF-044",
          "CONF-037"
        ]
      },
      {
        "name": "Under stress",
        "qids": [
          "CONF-045",
          "CONF-046",
          "CONF-047",
          "CONF-048",
          "CONF-021",
          "CONF-049",
          "CONF-036"
        ]
      },
      {
        "name": "In the heat of it",
        "qids": [
          "CONF-016",
          "CONF-002",
          "CONF-050",
          "CONF-051",
          "CONF-052",
          "CONF-053",
          "CONF-054"
        ]
      },
      {
        "name": "Making it right",
        "qids": [
          "CONF-055",
          "CONF-056",
          "CONF-029",
          "CONF-012",
          "CONF-033",
          "CONF-034",
          "CONF-057"
        ]
      },
      {
        "name": "Saying what you feel",
        "qids": [
          "CONF-030",
          "CONF-031",
          "CONF-032",
          "CONF-058",
          "CONF-059",
          "CONF-060",
          "CONF-061"
        ]
      }
    ],
    "questions": [
      {
        "id": "CONF-038",
        "q": "How do you most naturally show someone you love them?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "core": true,
        "opts": [
          "Through words: I tell them and encourage them",
          "Through time: I make time to be with them",
          "Through actions: I help and do things for them",
          "Through gifts: I give thoughtful things",
          "Through affection: I show it physically"
        ]
      },
      {
        "id": "CONF-039",
        "q": "How do you most like to feel loved by your partner?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Through words: being told and encouraged",
          "Through time: having time made for me",
          "Through actions: being helped and things done for me",
          "Through gifts: being given thoughtful things",
          "Through affection: being shown physically"
        ]
      },
      {
        "id": "CONF-040",
        "q": "How much contact do you like to have with your partner during the day?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "I like to stay in contact throughout the day",
          "A few check-ins is enough",
          "One meaningful conversation is enough",
          "I don't need much contact during the day"
        ]
      },
      {
        "id": "CONF-041",
        "q": "How important is it to you that we regularly set aside time just for each other?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important: we'll spend time together naturally",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Essential: we should make time even when we're busy"
        ]
      },
      {
        "id": "CONF-042",
        "q": "What kind of one-on-one time would make you feel most connected to your partner?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Going out together",
          "Staying in and talking",
          "Doing an activity together",
          "Physical affection and intimacy",
          "Simply having uninterrupted time together"
        ]
      },
      {
        "id": "CONF-043",
        "q": "Rank what makes you feel most respected by your partner.",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Being listened to",
          "Honesty",
          "Loyalty and commitment",
          "Being supported in front of others",
          "Having independence and personal space"
        ]
      },
      {
        "id": "CONF-044",
        "q": "What kind of atmosphere would you want in our home?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Calm and quiet",
        "hi": "Lively and energetic",
        "steps": [
          "Calm and quiet",
          "Mostly calm",
          "A balance of calm and lively",
          "Mostly lively",
          "Lively and energetic"
        ]
      },
      {
        "id": "CONF-037",
        "q": "When I make plans with friends, should you be invited by default?",
        "type": "mc",
        "depth": 3,
        "note": "Everyday default inclusion, distinct from CONF-007 (solo trips, a big event) and US-030 (whether you get along with them).",
        "guessable": true,
        "opts": [
          "Yes, always",
          "Usually, unless there's a reason",
          "No: separate friendships are healthy",
          "Depends on the friends"
        ]
      },
      {
        "id": "CONF-045",
        "q": "Rank these communication styles from most to least like you.",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Direct and straightforward",
          "Talk things through in detail",
          "Quiet and prefer to think before speaking",
          "Expressive and talkative"
        ]
      },
      {
        "id": "CONF-046",
        "q": "When you're stressed, what are you most likely to do? Put the most likely first.",
        "type": "rank",
        "depth": 2,
        "ref": "Philippians 4:6-7",
        "opts": [
          "Pray or turn to God",
          "Talk it through with someone",
          "Take time alone",
          "Keep going and deal with it myself",
          "Get frustrated more easily"
        ]
      },
      {
        "id": "CONF-047",
        "q": "How easily do you become angry?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "core": true,
        "lo": "Almost never",
        "hi": "Very easily",
        "steps": [
          "Almost never",
          "Not very easily",
          "It depends on the situation",
          "Fairly easily",
          "Very easily"
        ]
      },
      {
        "id": "CONF-048",
        "q": "When you're frustrated, how would you describe the way you speak?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 15:1",
        "guessable": true,
        "lo": "Very gentle and careful",
        "hi": "Very direct and blunt",
        "steps": [
          "Very gentle and careful",
          "Usually gentle",
          "It depends on the situation",
          "Usually direct",
          "Very direct and blunt"
        ]
      },
      {
        "id": "CONF-021",
        "q": "When someone interrupts you, how do you usually react?",
        "type": "mc",
        "depth": 2,
        "ref": "James 1:19",
        "note": "A concrete tell for patience and listening, framed behaviourally.",
        "guessable": true,
        "opts": [
          "Let it go",
          "Wait, then carry on",
          "Get quietly annoyed",
          "Talk over them right back"
        ]
      },
      {
        "id": "CONF-049",
        "q": "How do you usually respond when your partner says no to something you want?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "I find it very difficult",
        "hi": "I accept it easily",
        "steps": [
          "I find it very difficult",
          "I find it somewhat difficult",
          "It depends on the situation",
          "I usually handle it well",
          "I accept it easily"
        ]
      },
      {
        "id": "CONF-036",
        "q": "How readily would you ask me for help?",
        "type": "scale",
        "depth": 3,
        "ref": "Galatians 6:2",
        "note": "SELF-023 lists prayer, Scripture, counsel and own judgment as what you lean on — but never the partner. This fills that gap.",
        "guessable": true,
        "lo": "I'd rather work it out myself",
        "hi": "I'd ask straight away"
      },
      {
        "id": "CONF-016",
        "q": "How much conflict feels normal and healthy in a relationship to you?",
        "type": "scale",
        "depth": 2,
        "note": "Catches the chaos-tolerance gap before it collides.",
        "guessable": true,
        "lo": "Almost none",
        "hi": "Frequent is normal"
      },
      {
        "id": "CONF-002",
        "q": "How soon do you like to resolve conflict?",
        "type": "scale",
        "depth": 2,
        "ref": "James 1:19",
        "note": "Surfaces conflict styles before they collide.",
        "guessable": true,
        "core": true,
        "lo": "I need space first",
        "hi": "Address it right away"
      },
      {
        "id": "CONF-050",
        "q": "When you are in a conflict, what are you most likely to do?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "core": true,
        "opts": [
          "Try to resolve it straight away",
          "Take some time and step away",
          "Focus on getting my way",
          "Give in to avoid making things worse",
          "Look for a compromise"
        ]
      },
      {
        "id": "CONF-051",
        "q": "In a disagreement, which matters more to you?",
        "type": "mc",
        "depth": 2,
        "ref": "Philippians 2:3",
        "guessable": true,
        "opts": [
          "Keeping the peace",
          "Finding a solution",
          "Being understood",
          "Being right",
          "It depends on the situation"
        ]
      },
      {
        "id": "CONF-052",
        "q": "In a disagreement, how important is it to you to be right?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Not important at all",
        "hi": "Extremely important",
        "steps": [
          "Not important at all",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Extremely important"
        ]
      },
      {
        "id": "CONF-053",
        "q": "When you realise mid-disagreement that you're the one in the wrong, what do you usually do?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Say so straight away and apologise",
          "Admit it, but only once things have calmed down",
          "Concede the point without really admitting I was wrong",
          "Keep arguing and deal with it privately afterwards",
          "I find it very hard to admit at all"
        ]
      },
      {
        "id": "CONF-054",
        "q": "When we argue, how should we handle mistakes from the past?",
        "type": "mc",
        "depth": 2,
        "ref": "1 Corinthians 13:5",
        "guessable": true,
        "opts": [
          "Keep them out of the current argument",
          "Bring them up only if they're directly relevant",
          "Bring them up if they show a pattern",
          "The past is fair to discuss"
        ]
      },
      {
        "id": "CONF-055",
        "q": "After a disagreement, how likely are you to recognise your own part in what happened?",
        "type": "scale",
        "depth": 2,
        "ref": "Matthew 7:5",
        "guessable": true,
        "core": true,
        "lo": "Very unlikely",
        "hi": "Very likely",
        "steps": [
          "Very unlikely",
          "Somewhat unlikely",
          "It depends on the situation",
          "Usually likely",
          "Very likely"
        ]
      },
      {
        "id": "CONF-056",
        "q": "After a disagreement, what do you usually do first?",
        "type": "mc",
        "depth": 2,
        "opts": [
          "Think about what my partner did wrong",
          "Think about what I could have done differently",
          "Try to understand both sides",
          "Wait for my partner to raise it",
          "Put it aside and move on"
        ]
      },
      {
        "id": "CONF-029",
        "q": "Rank what you most need after a fight.",
        "type": "rank",
        "depth": 3,
        "ref": "Ephesians 4:32",
        "note": "The bank covers conflict style, timing, reflex and ownership — and nothing at all about repair. What each person needs afterward is what actually decides whether arguments cost a marriage anything.",
        "core": true,
        "opts": [
          "Space",
          "Reassurance that we're okay",
          "To feel heard",
          "An apology",
          "To move on quickly",
          "To be physically close again"
        ]
      },
      {
        "id": "CONF-012",
        "q": "When you need to raise a problem, how do you prefer to do it?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces how concerns and complaints get raised.",
        "guessable": true,
        "opts": [
          "Address it right away",
          "Wait for the right moment",
          "Write or text it",
          "Avoid it until it builds up"
        ]
      },
      {
        "id": "CONF-033",
        "q": "How do hard conversations become safe for you?",
        "type": "mc",
        "depth": 3,
        "note": "A genuine chicken-and-egg about disclosure sequencing. Distinct from SELF-001 (how easily you open up) — this is what has to be true first.",
        "guessable": true,
        "opts": [
          "We get close first, then we can talk about hard things",
          "Talking about hard things is what makes us close",
          "A bit of both, in step",
          "Depends entirely on the topic"
        ]
      },
      {
        "id": "CONF-034",
        "q": "Does every problem between us need to be talked through?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 19:11",
        "note": "The inversion of the talk-it-out norm. CONF-002/012/013 all assume the conversation happens and ask about timing and style; this asks whether it should happen at all.",
        "guessable": true,
        "opts": [
          "Yes, always",
          "Most, but some can be let go",
          "Only the big ones",
          "Some things are better left alone"
        ]
      },
      {
        "id": "CONF-057",
        "q": "How confident do you feel about handling the challenges that marriage may bring?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Not confident at all",
        "hi": "Completely confident",
        "steps": [
          "Not confident at all",
          "Slightly confident",
          "Moderately confident",
          "Very confident",
          "Completely confident"
        ]
      },
      {
        "id": "CONF-030",
        "q": "Should partners tell each other everything they feel?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 29:11",
        "note": "Transparency of feelings, distinct from CONF-015 which is privacy of facts and life. Someone can want total factual openness and still think unfiltered feelings are corrosive.",
        "guessable": true,
        "opts": [
          "Yes: everything",
          "Most things, once I've made sense of them",
          "Only what affects us",
          "Some feelings are better kept to myself"
        ]
      },
      {
        "id": "CONF-031",
        "q": "Is it better to say a feeling as it comes, or work out what it means first?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 15:28",
        "note": "The norm half of a self/norm pair with the SELF latency question. The tell is when someone's belief about what partners should do contradicts what they actually need.",
        "guessable": true,
        "opts": [
          "Say it as it comes",
          "Work it out on my own first",
          "Say it as it comes and work it out together",
          "Depends on the feeling"
        ]
      },
      {
        "id": "CONF-032",
        "q": "When I go quiet to process something on my own, how does that land for you?",
        "type": "mc",
        "depth": 3,
        "note": "The reception side of a processing style. The bank asks how each person behaves (CONF-003, SELF-017) but never how their partner's behaviour lands on them.",
        "guessable": true,
        "core": true,
        "opts": [
          "Fine: I'd give you space",
          "I'd worry something was wrong",
          "I'd feel shut out",
          "I'd keep asking until you talked"
        ]
      },
      {
        "id": "CONF-058",
        "q": "How important is it that your partner points out things about you that you may not see?",
        "type": "scale",
        "depth": 2,
        "ref": "Ephesians 4:15",
        "guessable": true,
        "lo": "Not important",
        "hi": "Extremely important",
        "steps": [
          "Not important: I'd rather work things out myself",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Extremely important: I want my partner to challenge me when needed"
        ]
      },
      {
        "id": "CONF-059",
        "q": "When your partner notices something about you that you can't see, how should they tell you?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Tell me directly, even if it's uncomfortable",
          "Be gentle and choose the right moment",
          "Ask me questions so I can notice it myself",
          "Wait until I ask for feedback",
          "It depends on the situation"
        ]
      },
      {
        "id": "CONF-060",
        "q": "How comfortable are you with talking to other people about problems in your relationship?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 11:13",
        "guessable": true,
        "lo": "Not comfortable",
        "hi": "Completely comfortable",
        "steps": [
          "Not comfortable at all: I'd keep it between us",
          "Slightly comfortable: only with someone very close to us",
          "It depends on the situation",
          "Mostly comfortable: I'd talk to someone I trust",
          "Completely comfortable: I'd have no issue talking it through with others"
        ]
      },
      {
        "id": "CONF-061",
        "q": "If you needed advice about a relationship problem, who would you be most likely to talk to first?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "My partner: I'd try to work through it together",
          "A close friend",
          "A family member",
          "A pastor or Christian mentor",
          "A professional counsellor or therapist"
        ]
      }
    ]
  },
  "in-laws-extended-family": {
    "name": "In-Laws",
    "color": "#9C7A4A",
    "icon": "family",
    "hook": {
      "id": "INLAW-013",
      "q": "What do you call your partner's parents?"
    },
    "parts": [
      {
        "name": "Family at the door",
        "qids": [
          "INLAW-013",
          "INLAW-014",
          "INLAW-015",
          "INLAW-016",
          "INLAW-011",
          "INLAW-010",
          "INLAW-012"
        ]
      },
      {
        "name": "Holidays, help and care",
        "qids": [
          "INLAW-017",
          "INLAW-018",
          "INLAW-009",
          "INLAW-019",
          "INLAW-020",
          "INLAW-021",
          "INLAW-022"
        ]
      },
      {
        "name": "Leaving and cleaving",
        "qids": [
          "INLAW-023",
          "INLAW-024",
          "INLAW-006",
          "INLAW-025",
          "INLAW-026",
          "INLAW-027",
          "INLAW-028",
          "INLAW-029"
        ]
      }
    ],
    "questions": [
      {
        "id": "INLAW-013",
        "q": "What do you call your partner's parents?",
        "type": "mc",
        "depth": 1,
        "note": "The best warm-up in the batch. Funny, instant, and a genuinely accurate read on how close that relationship already is.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "First names",
          "Mr and Mrs",
          "Mum and Dad",
          "I avoid calling them anything at all"
        ]
      },
      {
        "id": "INLAW-014",
        "q": "How are you at family small talk?",
        "type": "scale",
        "depth": 1,
        "note": "Light entry to a deck that opens on boundary-setting. Predicts a lot of Christmases.",
        "guessable": true,
        "lo": "I'd rather hide in the kitchen",
        "hi": "I genuinely love it"
      },
      {
        "id": "INLAW-015",
        "q": "How involved would you want our extended families to be in our everyday married life?",
        "type": "scale",
        "depth": 2,
        "ref": "Genesis 2:24",
        "guessable": true,
        "core": true,
        "lo": "Quite separate",
        "hi": "Deeply involved",
        "steps": [
          "Quite separate: our married life would mainly be our own",
          "Some involvement, but with plenty of space",
          "A balance of family involvement and independence",
          "Very involved in our regular lives",
          "Deeply involved: I'd want family to be a major part of our everyday life"
        ]
      },
      {
        "id": "INLAW-016",
        "q": "How would you feel about our parents or close family visiting our home without asking first?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Very uncomfortable: I'd want visits planned",
          "Mostly uncomfortable",
          "It depends who it is",
          "Mostly comfortable",
          "Completely comfortable: close family are welcome anytime"
        ]
      },
      {
        "id": "INLAW-011",
        "q": "Should our parents have a key to our home?",
        "type": "mc",
        "depth": 3,
        "note": "A small, concrete, slightly funny question that settles the boundary argument faster than the abstract version ever will.",
        "guessable": true,
        "opts": [
          "Yes, of course",
          "Only for emergencies",
          "No",
          "We'd need to talk about that one"
        ]
      },
      {
        "id": "INLAW-010",
        "q": "How often should we see each set of parents?",
        "type": "mc",
        "depth": 3,
        "note": "INLAW-001 rates boundary firmness on a scale. This is the actual number, which is what people argue about.",
        "guessable": true,
        "opts": [
          "Weekly or more",
          "Monthly",
          "A few times a year",
          "As little as we can manage"
        ]
      },
      {
        "id": "INLAW-012",
        "q": "How close should we live to family?",
        "type": "mc",
        "depth": 3,
        "note": "FAM-007 rates how much it matters that children grow up near extended family. This is about the two of you, and it's a decision rather than a value.",
        "guessable": true,
        "opts": [
          "Same town",
          "Within an hour",
          "Same country is close enough",
          "Distance doesn't matter to me"
        ]
      },
      {
        "id": "INLAW-017",
        "q": "How would you ideally want us to divide major holidays between our families?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Alternate between families from year to year",
          "Split the holiday between both families where possible",
          "Bring both families together",
          "Build our own traditions and see family around them",
          "Decide separately each year depending on circumstances"
        ]
      },
      {
        "id": "INLAW-018",
        "q": "If both families expected us for the same big holiday, how should we decide?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Take turns fairly",
          "Choose the family we see less",
          "Choose the family for whom that tradition matters most",
          "Celebrate mainly as our own home, and see both families another time",
          "Decide together, case by case"
        ]
      },
      {
        "id": "INLAW-009",
        "q": "How much financial help from family is okay?",
        "type": "mc",
        "depth": 4,
        "note": "Completely missing from a bank with 17 finance questions. Family money carries family expectations, and couples discover the exchange rate afterwards.",
        "guessable": true,
        "opts": [
          "None: we stand on our own",
          "Gifts are fine",
          "Help in a genuine crisis",
          "Whatever they're willing to offer"
        ]
      },
      {
        "id": "INLAW-019",
        "q": "If our families have different traditions, how should we choose which ones to keep in our home?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Mainly follow the husband's family traditions",
          "Mainly follow the wife's family traditions",
          "Blend traditions from both families",
          "Create mostly new traditions of our own",
          "Decide one tradition at a time"
        ]
      },
      {
        "id": "INLAW-020",
        "q": "If one of our parents could no longer live independently, what would you ideally want us to do?",
        "type": "mc",
        "depth": 4,
        "ref": "1 Timothy 5:8",
        "guessable": true,
        "opts": [
          "Have them live with us",
          "Help them live independently nearby",
          "Arrange professional or supported care",
          "Share their care with siblings or wider family",
          "Not sure yet"
        ]
      },
      {
        "id": "INLAW-021",
        "q": "How willing would you be to have one of our parents live with us permanently if they needed care?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "Not willing",
        "hi": "Our responsibility",
        "steps": [
          "Not willing",
          "Reluctant, except in extreme circumstances",
          "Open to considering it",
          "Very willing",
          "I would see it as our responsibility if needed"
        ]
      },
      {
        "id": "INLAW-022",
        "q": "How much should we be willing to change our lifestyle to care for an ageing parent?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "Very little",
        "hi": "Whatever it takes",
        "steps": [
          "Very little: our household has to come first",
          "Some adjustment",
          "A meaningful amount where necessary",
          "Major sacrifices if genuinely needed",
          "Whatever is reasonably necessary to honour and care for them"
        ]
      },
      {
        "id": "INLAW-023",
        "q": "How important would it be to you for your spouse to have a close relationship with your family?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Not important",
        "hi": "Extremely important",
        "steps": [
          "Not important: respect is enough",
          "Slightly important",
          "I'd like them to get along",
          "Very important: I'd want genuine closeness",
          "Extremely important: I'd want my spouse to feel like part of my family"
        ]
      },
      {
        "id": "INLAW-024",
        "q": "If you loved your family but your spouse never became close to them, how would you feel?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Completely fine, as long as everyone is respectful",
          "A little disappointed, but I could accept it",
          "It would bother me a lot",
          "I would see it as a serious problem in our relationship",
          "It would depend on why"
        ]
      },
      {
        "id": "INLAW-006",
        "q": "How much do your parents influence your decisions?",
        "type": "scale",
        "depth": 2,
        "note": "Parental-influence level, distinct from leave-and-cleave (INLAW-004); thin category.",
        "guessable": true,
        "lo": "I decide independently",
        "hi": "I lean on them heavily"
      },
      {
        "id": "INLAW-025",
        "q": "After we're married, how much influence should our parents have over our major decisions?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Decisions should be ours; involve parents only if we choose",
          "Seek their advice, but make the decision ourselves",
          "Seek their advice and give it significant weight",
          "For major decisions, I'd want their blessing before we move forward",
          "It depends on the decision"
        ]
      },
      {
        "id": "INLAW-026",
        "q": "Which areas would you most value our parents' advice on? Rank them from most to least.",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Marriage and relationship issues",
          "Raising children",
          "Money and major financial decisions",
          "Career and where we live",
          "Faith and church decisions",
          "Caring for family members"
        ]
      },
      {
        "id": "INLAW-027",
        "q": "When your spouse and your parents want different things, whose wishes should usually come first?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "My spouse should usually come first",
          "My spouse, unless I believe they're clearly wrong",
          "Both should count about the same",
          "My duty to my parents may sometimes come first",
          "We should honour our parents' decisions, even if we don't agree",
          "I'm not sure"
        ]
      },
      {
        "id": "INLAW-028",
        "q": "If one of our families was crossing a boundary in our marriage, who should normally address it?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "The person whose family it is",
          "We should address it together",
          "Either of us should feel free to address it directly",
          "The husband should normally take the lead in protecting the marriage",
          "It depends on the situation"
        ]
      },
      {
        "id": "INLAW-029",
        "q": "If one of your parents kept disrespecting your spouse, how far would you go to protect our marriage?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "core": true,
        "opts": [
          "Speak to my parent privately and ask them to stop",
          "Set clear boundaries with my parent",
          "See them less if it continues",
          "Stop contact for a time if needed",
          "My spouse should accept it, because they're still my parent",
          "It depends on how serious it is"
        ]
      }
    ]
  },
  "fun-icebreakers": {
    "name": "Fun",
    "color": "#8F5A12",
    "icon": "star",
    "hook": {
      "id": "FUN-011",
      "q": "Who's more likely to fall asleep during the sermon?"
    },
    "parts": [
      {
        "name": "Date nights and laughs",
        "qids": [
          "FUN-024",
          "FUN-025",
          "FUN-026",
          "FUN-027",
          "FUN-028",
          "FUN-029",
          "FUN-030",
          "FUN-031"
        ]
      },
      {
        "name": "Who’s more likely…",
        "qids": [
          "FUN-008",
          "FUN-009",
          "FUN-010",
          "FUN-011",
          "FUN-012",
          "FUN-013",
          "FUN-014",
          "FUN-015"
        ]
      },
      {
        "name": "Lazy Sundays",
        "qids": [
          "FUN-032",
          "FUN-033",
          "FUN-034",
          "FUN-035",
          "FUN-036",
          "FUN-037",
          "FUN-038"
        ]
      },
      {
        "name": "The cheeky round",
        "qids": [
          "FUN-007",
          "FUN-016",
          "FUN-020",
          "FUN-023",
          "FUN-018",
          "FUN-019",
          "FUN-021",
          "FUN-039"
        ]
      }
    ],
    "questions": [
      {
        "id": "FUN-024",
        "q": "If we were planning a date night, what would you most enjoy?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Going somewhere for great food",
          "Doing an activity or adventure",
          "A cosy night in together",
          "Going to a show, concert or event",
          "Doing something spontaneous we haven't tried before"
        ]
      },
      {
        "id": "FUN-025",
        "q": "If we had a completely free day together, how would you most want to spend it?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Relaxing at home",
          "Exploring somewhere new",
          "Doing something active or outdoors",
          "Spending time with friends or family",
          "Working on a hobby or project together"
        ]
      },
      {
        "id": "FUN-026",
        "q": "How planned or spontaneous would you want our fun together to be?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "lo": "Planned ahead",
        "hi": "In the moment",
        "steps": [
          "I love having things planned well in advance",
          "Mostly planned",
          "A mixture of both",
          "Mostly spontaneous",
          "I love deciding what to do in the moment"
        ]
      },
      {
        "id": "FUN-027",
        "q": "If we had to choose something to watch together, what would you pick first?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Comedy",
          "Action or thriller",
          "Drama or romance",
          "Documentary or true story",
          "Fantasy, sci-fi or animation"
        ]
      },
      {
        "id": "FUN-028",
        "q": "How do you feel about surprises from me?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "I love being surprised",
          "I like small surprises, but not big ones",
          "I like surprises if you know it's something I'll enjoy",
          "I'd usually rather know what's happening",
          "It depends on the situation"
        ]
      },
      {
        "id": "FUN-029",
        "q": "How competitive do you get when we're playing a game or competing against each other?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "lo": "Don't care who wins",
        "hi": "I really want to win",
        "steps": [
          "I really don't care who wins",
          "I enjoy winning, but it's mostly just fun",
          "Somewhere in the middle",
          "I get pretty competitive",
          "I really want to win"
        ]
      },
      {
        "id": "FUN-030",
        "q": "What kind of humour makes you laugh the most?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Silly and playful",
          "Dry or deadpan",
          "Clever or witty",
          "Teasing and banter",
          "Funny stories and everyday observations"
        ]
      },
      {
        "id": "FUN-031",
        "q": "When we're having fun together, what matters most to you?",
        "type": "rank",
        "depth": 1,
        "opts": [
          "Laughing together",
          "Relaxing",
          "Trying something new",
          "Having quality time together",
          "Being active",
          "Being around other people"
        ]
      },
      {
        "id": "FUN-008",
        "q": "Who's more likely to cry at a film?",
        "type": "mc",
        "depth": 1,
        "note": "A pure warm-up. Costs nothing, wrong answers are charming, and it teaches the guess mechanic before anything is at stake.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-009",
        "q": "Who's more likely to apologise first after a row?",
        "type": "mc",
        "depth": 1,
        "note": "Plays as a laugh and lands as a finding. If both say the same name, that person is doing the repair work — and now they've both seen it.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-010",
        "q": "Who's more likely to be running late?",
        "type": "mc",
        "depth": 1,
        "note": "Light, concrete, and the source of more real friction than most couples admit before living together.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-011",
        "q": "Who's more likely to fall asleep during the sermon?",
        "type": "mc",
        "depth": 1,
        "note": "Faith-culture humour that only works inside the niche. This is the kind of question a secular competitor structurally cannot write.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-012",
        "q": "Who's more likely to pray out loud first?",
        "type": "mc",
        "depth": 2,
        "note": "Funny on the surface, and quietly the same axis as FAITH-023 (who leads spiritually) — asked in a way nobody gets defensive about.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-013",
        "q": "Who's more likely to spend a couple of hundred without mentioning it?",
        "type": "mc",
        "depth": 2,
        "note": "The money-secrecy question wearing a party hat. Pairs with FIN-003 (financial openness) and gets a more honest answer than it does.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-014",
        "q": "Who's more likely to hold a grudge?",
        "type": "mc",
        "depth": 2,
        "note": "Reads as banter, sits directly on SELF-012 (how easily do you forgive). If they disagree about the answer, that's the conversation.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-015",
        "q": "Who's more likely to start the argument?",
        "type": "mc",
        "depth": 2,
        "note": "The last of the light-but-loaded set. Both naming the same person is useful; naming each other is more useful.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-032",
        "q": "How much of our free time would you want us to spend on shared hobbies versus doing our own things?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "lo": "Most things together",
        "hi": "Lots of our own",
        "steps": [
          "I'd love us to do most things together",
          "Mostly together",
          "A balance of both",
          "Plenty of separate interests",
          "I'd want us both to have lots of our own hobbies"
        ]
      },
      {
        "id": "FUN-033",
        "q": "If we were choosing a trip purely for fun, which would you pick first?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Beach and relaxation",
          "City, food and culture",
          "Nature and adventure",
          "A road trip exploring different places",
          "Somewhere completely new and unfamiliar"
        ]
      },
      {
        "id": "FUN-034",
        "q": "If we were choosing somewhere to eat, what would excite you most?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Going back to a favourite place",
          "Trying a cuisine we've never had before",
          "Somewhere casual with really good food",
          "Dressing up for somewhere special",
          "Staying in and cooking something together"
        ]
      },
      {
        "id": "FUN-035",
        "q": "What kinds of memories would you most want us to make together?",
        "type": "rank",
        "depth": 1,
        "opts": [
          "Trips and adventures",
          "Celebrations and traditions",
          "Food and experiences",
          "Shared hobbies or projects",
          "Serving or helping others together",
          "Quiet everyday moments together"
        ]
      },
      {
        "id": "FUN-036",
        "q": "If we wanted to do different things with our free time, what would you usually prefer?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Take turns choosing",
          "Find something we both enjoy",
          "Let whoever cares more choose",
          "Do separate things and enjoy our own interests",
          "Decide depending on the situation"
        ]
      },
      {
        "id": "FUN-037",
        "q": "How would you most want us to celebrate something special like a birthday or anniversary?",
        "type": "mc",
        "depth": 1,
        "opts": [
          "A thoughtful meal together",
          "A trip or experience",
          "A big celebration with other people",
          "A meaningful gift or surprise",
          "Something simple and private together"
        ]
      },
      {
        "id": "FUN-038",
        "q": "What's something fun you'd love for us to try together that we haven't done yet?",
        "type": "open",
        "depth": 1
      },
      {
        "id": "FUN-007",
        "q": "You've got a free evening and I'm busy. What's your instinct?",
        "type": "mc",
        "depth": 1,
        "note": "A light, behavioural read on independence that lands the same construct as the solitude scales without asking anyone to rate themselves.",
        "guessable": true,
        "opts": [
          "Go do something on my own",
          "Save it for when we're both free",
          "Call a friend",
          "Stay in and rest"
        ]
      },
      {
        "id": "FUN-016",
        "q": "Who gets the remote?",
        "type": "mc",
        "depth": 1,
        "note": "Replaces the open-ended half of FUN-004 with something that actually plays.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-020",
        "q": "Be honest: how good a cook are you?",
        "type": "mc",
        "depth": 1,
        "note": "Pairs with HOME-001. Someone can say 'we'd share the cooking' and also admit they can't cook, and the collision of those two answers is the joke and the point.",
        "guessable": true,
        "opts": [
          "Genuinely good",
          "Perfectly fine",
          "Depends entirely on the recipe",
          "I'd be relying on you"
        ]
      },
      {
        "id": "FUN-023",
        "q": "Who's more likely to overthink a text?",
        "type": "mc",
        "depth": 1,
        "note": "Warm-up hook — modern and instantly relatable; universal options.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-018",
        "q": "What's the most annoying thing you could do that I'd have to live with?",
        "type": "mc",
        "depth": 2,
        "note": "Self-deprecating, funny, and genuinely predictive of daily friction. Asks for a flaw in a frame where naming one is the fun part.",
        "guessable": true,
        "opts": [
          "Leaving things everywhere",
          "Always running late",
          "Talking through films",
          "Snoring",
          "Being on my phone too much"
        ]
      },
      {
        "id": "FUN-019",
        "q": "Which is worse in a partner?",
        "type": "mc",
        "depth": 2,
        "note": "A forced choice with no safe option, which is what makes it play. Quietly ranks four real complaints.",
        "guessable": true,
        "opts": [
          "Never listening",
          "Never apologising",
          "Never planning anything",
          "Never relaxing"
        ]
      },
      {
        "id": "FUN-021",
        "q": "Which of these would you actually want at our wedding?",
        "type": "mc",
        "depth": 2,
        "note": "Fun on its face, a real logistical and family fault line underneath, and it sits naturally next to the In-Laws deck.",
        "guessable": true,
        "opts": [
          "Big church, everyone we know",
          "Small and intimate",
          "Abroad, just us",
          "I honestly have no idea"
        ]
      },
      {
        "id": "FUN-039",
        "q": "Who's quicker at making a decision?",
        "type": "mc",
        "depth": 1,
        "note": "Light HHB entry that sits directly upstream of the tiebreak question later in the deck.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "About the same",
          "Neither of us: it's painful"
        ]
      }
    ]
  },
  "deal-breakers": {
    "name": "Deal-breakers",
    "color": "#A8554E",
    "icon": "shield",
    "hook": {
      "id": "DEAL-021",
      "q": "Have you ever stayed in a relationship past a line you'd set for yourself?"
    },
    "parts": [
      {
        "name": "Your must-haves",
        "qids": [
          "DEAL-022",
          "DEAL-023",
          "DEAL-003",
          "DEAL-024",
          "DEAL-025",
          "DEAL-020"
        ]
      },
      {
        "name": "Lines you won’t cross",
        "qids": [
          "DEAL-004",
          "DEAL-007",
          "DEAL-006",
          "DEAL-008",
          "DEAL-026",
          "DEAL-027",
          "DEAL-012"
        ]
      },
      {
        "name": "When life changes",
        "qids": [
          "DEAL-010",
          "DEAL-017",
          "DEAL-019",
          "DEAL-014",
          "DEAL-013",
          "DEAL-021"
        ]
      }
    ],
    "questions": [
      {
        "id": "DEAL-022",
        "q": "Which of these could you honestly never live with?",
        "type": "mc",
        "depth": 1,
        "note": "Deal-breakers currently opens by asking you to rank what would end you. This is a door instead of a cliff — a joke deal-breaker that is still, truthfully, on topic.",
        "guessable": true,
        "opts": [
          "Bad breath",
          "Terrible taste in music",
          "Always running late",
          "Loud chewing",
          "None of these actually matter"
        ]
      },
      {
        "id": "DEAL-023",
        "q": "Be honest: how picky are you?",
        "type": "scale",
        "depth": 1,
        "note": "Self-rated fussiness as the on-ramp. Light, and it usefully frames every heavier question in the deck that follows.",
        "guessable": true,
        "core": true,
        "lo": "Pretty easy-going",
        "hi": "I've got a long list"
      },
      {
        "id": "DEAL-003",
        "q": "What's one thing you would never be willing to give up for a relationship?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces core, unchangeable values."
      },
      {
        "id": "DEAL-024",
        "q": "What matters most to you in a partner? Rank these from most important to least important.",
        "type": "rank",
        "depth": 5,
        "opts": [
          "Faith",
          "Kindness",
          "Loyalty",
          "honesty",
          "Attraction",
          "Shared goals",
          "Humour",
          "Ambition"
        ]
      },
      {
        "id": "DEAL-025",
        "q": "Which of these would be the biggest deal-breaker for you? Rank them from biggest to smallest.",
        "type": "rank",
        "depth": 5,
        "core": true,
        "opts": [
          "Dishonesty",
          "Disrespect",
          "Unfaithfulness",
          "Lack of effort",
          "Lack of responsibility",
          "Poor communication"
        ]
      },
      {
        "id": "DEAL-020",
        "q": "Rank these from easiest to hardest to recover from.",
        "type": "rank",
        "depth": 5,
        "note": "DEAL-001 ranks what would end things. This assumes you stay and ranks the cost of staying — a different question, and the order reveals what each person quietly thinks a marriage can absorb.",
        "opts": [
          "An affair",
          "A serious lie about money",
          "Losing their faith",
          "A long depression",
          "Their family turning on us",
          "Slowly growing apart"
        ]
      },
      {
        "id": "DEAL-004",
        "q": "Could you marry someone who doesn't share your faith?",
        "type": "mc",
        "depth": 5,
        "ref": "2 Corinthians 6:14",
        "note": "The interfaith deal-breaker as a direct position, not just a rank item.",
        "guessable": true,
        "opts": [
          "No, never",
          "Only if they were open to it",
          "Yes, if we respected each other",
          "Faith isn't essential to me"
        ]
      },
      {
        "id": "DEAL-007",
        "q": "Could you marry someone who never wants children, when you do?",
        "type": "mc",
        "depth": 5,
        "note": "The kids mismatch as a deal-breaker, distinct from family-size (FAM-001).",
        "guessable": true,
        "opts": [
          "No, it's a deal-breaker",
          "We'd have to find a compromise",
          "I could let it go",
          "I'm flexible on kids"
        ]
      },
      {
        "id": "DEAL-006",
        "q": "How much would a serious addiction be a deal-breaker for you?",
        "type": "scale",
        "depth": 5,
        "note": "Names the addiction line directly.",
        "guessable": true,
        "lo": "I could work through it",
        "hi": "An absolute deal-breaker"
      },
      {
        "id": "DEAL-008",
        "q": "Would a criminal record be a deal-breaker for you?",
        "type": "mc",
        "depth": 5,
        "note": "A concrete past-history deal-breaker.",
        "guessable": true,
        "opts": [
          "Yes, any kind",
          "It depends what it was",
          "Only violent crimes",
          "No, people can change"
        ]
      },
      {
        "id": "DEAL-026",
        "q": "If your family strongly disapproved of your partner, could you still marry them?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "No, I couldn't go against my family",
          "I'd have serious doubts",
          "Yes, if I was confident in the relationship",
          "Yes, my family's opinion wouldn't decide it"
        ]
      },
      {
        "id": "DEAL-027",
        "q": "If your partner was unfaithful, could you stay in the relationship?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "core": true,
        "opts": [
          "No, that would be the end of the relationship",
          "I would try to work through it",
          "It would depend on what happened",
          "I would forgive them and try to rebuild the relationship"
        ]
      },
      {
        "id": "DEAL-012",
        "q": "How would you know if a relationship had become controlling?",
        "type": "mc",
        "depth": 5,
        "note": "Coercive control is invisible from the inside, and 'I'm not sure I'd know' is an honest and protective answer. Distinct from SELF-006 (need for control) — that's a trait, this is recognition.",
        "guessable": true,
        "opts": [
          "If I felt afraid to disagree",
          "If I stopped seeing my friends",
          "If I had to explain every purchase",
          "If I was told it was all for my own good",
          "Honestly, I'm not sure I'd know"
        ]
      },
      {
        "id": "DEAL-010",
        "q": "If I walked away from my faith after we married, what would you do?",
        "type": "mc",
        "depth": 5,
        "ref": "1 Corinthians 7:12-14",
        "note": "The single biggest hole in the bank. DEAL-004 asks whether you'd marry an unbeliever; it never asks what happens if you marry a believer who stops being one. For this audience that is the most common catastrophe there is, and almost no couple discusses it because it feels like inviting it.",
        "guessable": true,
        "opts": [
          "It would change everything between us",
          "I'd stay, and pray you back",
          "We'd find a way to live with it",
          "It wouldn't change how I feel about us"
        ]
      },
      {
        "id": "DEAL-017",
        "q": "If you changed your mind about wanting children after we married, what would you expect of me?",
        "type": "mc",
        "depth": 5,
        "note": "DEAL-007 handles the mismatch you know about before the wedding. This is the one that appears afterwards, which is both more common and far more destructive.",
        "guessable": true,
        "opts": [
          "To grieve it with me and accept it",
          "To keep talking until we found a way",
          "To hold me to what we agreed",
          "I can't imagine changing my mind"
        ]
      },
      {
        "id": "DEAL-019",
        "q": "If I changed a lot physically over the years, how honest can you be about what that would do?",
        "type": "scale",
        "depth": 5,
        "note": "INT-003 rates how much attraction matters now. This asks whether it's durable, which is the uncomfortable half and the half that gets tested by every pregnancy, illness and decade.",
        "guessable": true,
        "lo": "It genuinely wouldn't change anything",
        "hi": "I'd struggle with it"
      },
      {
        "id": "DEAL-014",
        "q": "If something serious from my past surfaced years into our marriage, what would matter most to you?",
        "type": "mc",
        "depth": 5,
        "note": "Pairs directly with PAST-002, which asks people to disclose. This asks what the reaction would be — and the reaction is what determines whether the disclosure ever happens at all.",
        "guessable": true,
        "opts": [
          "That you told me yourself, even years late",
          "What it actually was",
          "Why you kept it from me",
          "Nothing: the hiding would be the end of it"
        ]
      },
      {
        "id": "DEAL-013",
        "q": "If you found out I'd hidden significant debt from you, what would that be?",
        "type": "mc",
        "depth": 4,
        "ref": "Ephesians 4:25",
        "note": "FIN-013 asks people to disclose their debt. This asks what happens if they didn't — and the framing puts the weight on the concealment rather than the number, which is where it belongs.",
        "guessable": true,
        "core": true,
        "opts": [
          "A deal-breaker: it's the hiding, not the money",
          "A serious problem, but we'd work through it",
          "Frustrating, but survivable",
          "Not really a big deal"
        ]
      },
      {
        "id": "DEAL-021",
        "q": "Have you ever stayed in a relationship past a line you'd set for yourself?",
        "type": "mc",
        "depth": 5,
        "note": "Replaces the 'would you actually leave' version, which had 'I'd try everything first' as an option — that is 'it depends' wearing a suit, and most people would pick it. Same intent (are your deal-breakers real?) asked about the past, where people are reliable, instead of the future, where they aren't. The last option pairs with NOW-001.",
        "guessable": true,
        "core": true,
        "opts": [
          "No: I've always held the line",
          "Yes, once",
          "Yes, more than once",
          "I've never had my lines tested"
        ]
      }
    ]
  },
  "health-lifestyle": {
    "name": "Health",
    "color": "#5E7A4E",
    "icon": "leaf",
    "parts": [
      {
        "name": "Habits and rhythms",
        "qids": [
          "HEALTH-011",
          "HEALTH-012",
          "HEALTH-013",
          "HEALTH-014",
          "HEALTH-009",
          "HEALTH-015",
          "HEALTH-016"
        ]
      },
      {
        "name": "Screens, drink and health",
        "qids": [
          "HEALTH-017",
          "HEALTH-018",
          "HEALTH-019",
          "HEALTH-020",
          "HEALTH-021",
          "HEALTH-022",
          "HEALTH-005",
          "HEALTH-006"
        ]
      }
    ],
    "questions": [
      {
        "id": "HEALTH-011",
        "q": "How health-conscious would you want us to be about what we eat day to day?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "lo": "Very relaxed",
        "hi": "Very health-conscious",
        "steps": [
          "Very relaxed: enjoyment and convenience matter most",
          "Mostly relaxed",
          "A balance of health and enjoyment",
          "Quite health-conscious",
          "Very health-conscious: nutrition would be a major priority"
        ]
      },
      {
        "id": "HEALTH-012",
        "q": "How active would you ideally want our lifestyle to be?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "lo": "Mostly relaxed",
        "hi": "Fitness is central",
        "steps": [
          "Mostly relaxed: exercise wouldn't be a big part of our lifestyle",
          "Lightly active",
          "A balance of activity and relaxation",
          "Very active",
          "Fitness and physical activity would be a major part of our lifestyle"
        ]
      },
      {
        "id": "HEALTH-013",
        "q": "How would you most enjoy staying active together?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Gym or structured workouts",
          "Walking or hiking",
          "Sports",
          "Outdoor activities and adventures",
          "I'd rather exercise separately",
          "Staying active together isn't important to me"
        ]
      },
      {
        "id": "HEALTH-014",
        "q": "How much would you want us to protect time for rest in our normal routine?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "lo": "Not much",
        "hi": "A lot",
        "steps": [
          "Not much: I like life busy and full",
          "A little",
          "A healthy balance",
          "Quite a lot",
          "A lot: regular rest should be a real priority"
        ]
      },
      {
        "id": "HEALTH-009",
        "q": "Are you a night owl or an early bird?",
        "type": "scale",
        "depth": 1,
        "note": "A light but real daily-rhythm compatibility check that was missing.",
        "guessable": true,
        "core": true,
        "lo": "Early bird",
        "hi": "Night owl"
      },
      {
        "id": "HEALTH-015",
        "q": "If our sleep schedules were different, what would matter most to you?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Going to bed together most nights",
          "Waking up together when possible",
          "Having some shared evening time",
          "Having some shared morning time",
          "We're fine keeping different schedules"
        ]
      },
      {
        "id": "HEALTH-016",
        "q": "How often would you ideally want us to make social plans with friends?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Rarely",
          "A few times a month",
          "About once a week",
          "Several times a week",
          "It would depend on the season of life"
        ]
      },
      {
        "id": "HEALTH-017",
        "q": "How important is it that we put our phones away when we spend time together?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Essential: I'd want regular time together without phones"
        ]
      },
      {
        "id": "HEALTH-018",
        "q": "When would you most want us to keep phones away?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "During meals",
          "On dates",
          "In bed at night",
          "During important conversations",
          "Whenever we're intentionally spending time together",
          "I wouldn't need specific phone-free times"
        ]
      },
      {
        "id": "HEALTH-019",
        "q": "What would you ideally want alcohol to look like in our life together?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "core": true,
        "opts": [
          "No alcohol",
          "Only occasionally or on special occasions",
          "Social drinking in moderation",
          "Regular drinking is fine in moderation",
          "I don't have a strong preference"
        ]
      },
      {
        "id": "HEALTH-020",
        "q": "How important is it to you that we have similar views on alcohol?",
        "type": "scale",
        "depth": 2,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Essential"
        ]
      },
      {
        "id": "HEALTH-021",
        "q": "When you're ill or feeling unwell, how would you most want me to care for you?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Give me space and let me rest",
          "Look after me and fuss over me",
          "Check on me occasionally, but don't overdo it",
          "Keep me company",
          "Ask me what I need at the time"
        ]
      },
      {
        "id": "HEALTH-022",
        "q": "If I'm ill, what do you think your natural instinct would be?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Take care of everything for me",
          "Check in and offer help",
          "Give me space unless I ask",
          "Stay close and keep me company",
          "I'd probably need you to tell me what you need"
        ]
      },
      {
        "id": "HEALTH-005",
        "q": "Is there anything about your physical or mental health, past or present, that I should know?",
        "type": "open",
        "depth": 4,
        "note": "A gentle prompt for important health disclosure."
      },
      {
        "id": "HEALTH-006",
        "q": "Is there anything about alcohol, drugs or addictive habits, past or present, that I should know?",
        "type": "open",
        "depth": 4,
        "note": "Surfaces substance history honestly and without shame."
      }
    ]
  },
  "past-baggage": {
    "name": "The Past",
    "color": "#7C4B72",
    "icon": "leaf",
    "parts": [
      {
        "name": "Where you’ve come from",
        "qids": [
          "PAST-012",
          "PAST-013",
          "PAST-014",
          "PAST-015",
          "PAST-016",
          "PAST-017",
          "PAST-018"
        ]
      },
      {
        "name": "Past relationships",
        "qids": [
          "PAST-019",
          "PAST-020",
          "PAST-021",
          "PAST-022",
          "PAST-023",
          "PAST-024",
          "PAST-025"
        ]
      },
      {
        "name": "Hard seasons and healing",
        "qids": [
          "PAST-026",
          "PAST-027",
          "PAST-009",
          "PAST-028",
          "PAST-029",
          "PAST-030"
        ]
      },
      {
        "name": "What I should know",
        "qids": [
          "PAST-031",
          "PAST-001",
          "PAST-032",
          "PAST-033",
          "PAST-034",
          "PAST-035"
        ]
      }
    ],
    "questions": [
      {
        "id": "PAST-012",
        "q": "Which best describes the home environment you grew up in?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Warm, secure and affectionate",
          "Loving but very strict or controlled",
          "Emotionally distant",
          "Often tense or conflict-heavy",
          "Unpredictable or chaotic",
          "Unsafe or abusive",
          "None of the above"
        ]
      },
      {
        "id": "PAST-013",
        "q": "When adults in your home strongly disagreed, what usually happened?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "They talked it through calmly",
          "One person normally had the final say",
          "There was arguing or shouting",
          "People became silent or withdrew",
          "The issue was usually avoided",
          "I rarely saw disagreement between them"
        ]
      },
      {
        "id": "PAST-014",
        "q": "Which best describes your relationship with your mother or maternal figure?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Very close and supportive",
          "Generally good, with some tension",
          "Complicated",
          "Distant",
          "Strained or conflictual",
          "No meaningful relationship / she wasn't present"
        ]
      },
      {
        "id": "PAST-015",
        "q": "Which best describes your relationship with your father or paternal figure?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Very close and supportive",
          "Generally good, with some tension",
          "Complicated",
          "Distant",
          "Strained or conflictual",
          "No meaningful relationship / he wasn't present"
        ]
      },
      {
        "id": "PAST-016",
        "q": "What role did you most often play in your family growing up?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "The responsible one",
          "The peacemaker",
          "The achiever",
          "The caregiver",
          "The rebel or challenger",
          "The quiet one who stayed out of the way",
          "The funny one who kept things light"
        ]
      },
      {
        "id": "PAST-017",
        "q": "When your family is under stress now, which role are you most likely to fall back into?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "The responsible one",
          "The peacemaker",
          "The achiever",
          "The caregiver",
          "The rebel or challenger",
          "The quiet one who stayed out of the way",
          "The funny one who kept things light"
        ]
      },
      {
        "id": "PAST-018",
        "q": "What would you most want me to understand about you and the people who raised you?",
        "type": "open",
        "depth": 3
      },
      {
        "id": "PAST-019",
        "q": "What has been the biggest recurring difficulty in your past romantic relationships?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Communication",
          "Conflict or arguments",
          "Trust or jealousy",
          "Emotional openness",
          "Commitment",
          "Boundaries or faithfulness",
          "Different values or life goals",
          "I haven't had a serious previous relationship"
        ]
      },
      {
        "id": "PAST-020",
        "q": "What did those experiences teach you that you'd want to do differently with me?",
        "type": "open",
        "depth": 3
      },
      {
        "id": "PAST-021",
        "q": "Which best describes how you feel emotionally about your previous romantic relationships?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "I've never had a serious previous relationship",
          "They're fully behind me and I feel at peace",
          "I'm over the people, but some experiences still affect me",
          "There are still some unresolved feelings or questions",
          "I'm still emotionally attached to someone from my past",
          "I'm still actively processing a previous relationship"
        ]
      },
      {
        "id": "PAST-022",
        "q": "Are you in contact with anyone you dated or had a sexual relationship with before?",
        "type": "mc",
        "depth": 4,
        "opts": [
          "No contact",
          "Only contact I can't avoid, like work, family or church",
          "Sometimes, as friends",
          "Regular contact or friendship",
          "A close friendship",
          "There is a situation my partner should understand"
        ]
      },
      {
        "id": "PAST-023",
        "q": "Once we're married, what contact with past partners do you think is OK?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "No contact unless it can't be avoided",
          "Only polite or necessary contact",
          "Some friendship is fine if we're fully open with each other",
          "Regular friendship is fine with clear boundaries",
          "Close friendship is fine as long as there is trust"
        ]
      },
      {
        "id": "PAST-024",
        "q": "What is the most serious commitment you've had before this relationship?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "I've never had a serious romantic relationship",
          "A serious long-term relationship",
          "We lived together",
          "We were engaged",
          "I was previously married and divorced/separated",
          "I was previously married and widowed"
        ]
      },
      {
        "id": "PAST-025",
        "q": "Have you ever been unfaithful in a previous relationship?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "No",
          "Yes: emotionally, but not physically",
          "Yes: physically, but not sexually",
          "Yes: sexually",
          "Yes: in more than one of these ways",
          "I've never had a previous relationship where this applies"
        ]
      },
      {
        "id": "PAST-026",
        "q": "If your parents or carers seriously hurt you in the past, where are you with it today?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "I don't carry serious hurt from them",
          "I've worked through it and mostly feel at peace",
          "I've forgiven them, but it still affects me",
          "I'm working through it now",
          "There is deep hurt I haven't resolved",
          "I'm not ready to talk about it yet"
        ]
      },
      {
        "id": "PAST-027",
        "q": "If a parent seriously wronged you and later apologised, what do you believe forgiveness should mean?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Forgive them and fully restore the relationship",
          "Forgive them, but rebuild trust gradually",
          "Forgive them, while keeping firm boundaries if necessary",
          "Reconciliation should only happen if there is real repentance and change",
          "I don't believe forgiveness always requires restoring the relationship"
        ]
      },
      {
        "id": "PAST-009",
        "q": "What's been one of the hardest or lowest seasons of your life, and what helped you get through it?",
        "type": "open",
        "depth": 4,
        "ref": "Psalm 34:18",
        "note": "Surfaces resilience and tender spots."
      },
      {
        "id": "PAST-028",
        "q": "When life becomes extremely difficult, who or what do you most naturally turn to first?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "God, prayer and Scripture",
          "My partner",
          "Family or close friends",
          "A pastor or Christian mentor",
          "A counsellor or therapist",
          "I mostly deal with things on my own"
        ]
      },
      {
        "id": "PAST-029",
        "q": "Have you ever intentionally worked through difficult parts of your past with someone?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Yes, with a counsellor or therapist",
          "Yes, with a pastor, Christian mentor or through discipleship",
          "Yes, mainly with trusted friends or family",
          "Mostly on my own through prayer, reflection or study",
          "No: I haven't felt I needed to",
          "No: but there are things I know I still need to work through"
        ]
      },
      {
        "id": "PAST-030",
        "q": "If your past began to seriously affect our marriage, who would you be most willing to ask for help?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "A pastor or church leader",
          "A Christian counsellor",
          "A counsellor or therapist",
          "A mature Christian couple or mentor",
          "Work through it privately, just us",
          "I'd strongly prefer not to involve anyone else"
        ]
      },
      {
        "id": "PAST-031",
        "q": "How much does your past still affect how you act in relationships today?",
        "type": "scale",
        "depth": 1,
        "guessable": true,
        "lo": "Very little",
        "hi": "A lot",
        "steps": [
          "Very little: most of it is behind me",
          "A little",
          "Some old patterns still affect me",
          "Quite a lot",
          "A lot: I know my past still shapes how I react"
        ]
      },
      {
        "id": "PAST-001",
        "q": "Does your past still affect your trust, communication, conflict, intimacy, family or faith?",
        "type": "open",
        "depth": 4,
        "ref": "Psalm 147:3",
        "note": "Invites gentle honesty about wounds still being worked through."
      },
      {
        "id": "PAST-032",
        "q": "Which part of relationships do you think your past affects most?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Trust",
          "Conflict and how I react",
          "Emotional openness",
          "Physical or sexual intimacy",
          "Family relationships",
          "My confidence or sense of worth",
          "My faith",
          "I don't think my past affects my relationships very much"
        ]
      },
      {
        "id": "PAST-033",
        "q": "Have you ever had serious legal or criminal issues that could affect our future together?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "No",
          "Yes, but they are completely resolved",
          "Yes, and there are still some consequences or restrictions",
          "Yes, and there is an ongoing legal issue",
          "There is something I need to explain properly"
        ]
      },
      {
        "id": "PAST-034",
        "q": "Is there anything in your past you fear would change how I see you, if I knew everything?",
        "type": "open",
        "depth": 5
      },
      {
        "id": "PAST-035",
        "q": "Is there any abuse, violence, serious addiction or major trauma in your past I should know about?",
        "type": "open",
        "depth": 5
      }
    ]
  },
  "career-ambition": {
    "name": "Work",
    "color": "#8F5A12",
    "icon": "star",
    "parts": [
      {
        "name": "Work and calling",
        "qids": [
          "CAREER-001",
          "CAREER-011",
          "CAREER-006",
          "CAREER-008",
          "CAREER-003",
          "CAREER-010"
        ]
      },
      {
        "name": "Work and family",
        "qids": [
          "CAREER-005",
          "CAREER-007",
          "CAREER-009",
          "CAREER-004",
          "CAREER-012",
          "CAREER-013"
        ]
      }
    ],
    "questions": [
      {
        "id": "CAREER-001",
        "q": "How central is career ambition to you?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 16:3",
        "note": "Surfaces ambitions and how careers fit the shared future.",
        "guessable": true,
        "lo": "A job is just for living",
        "hi": "Career is central to me"
      },
      {
        "id": "CAREER-011",
        "q": "Which best describes what you've wanted from your work so far?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Stability: security, consistency and a reliable income",
          "Progression: growing, achieving and moving up",
          "Purpose: doing work that feels meaningful",
          "Freedom: flexibility, independence and control over my time",
          "Variety: learning, changing things up and trying new challenges"
        ]
      },
      {
        "id": "CAREER-006",
        "q": "How important is it that your work feels meaningful, versus just paying well?",
        "type": "scale",
        "depth": 2,
        "note": "Money vs calling in how each picks work.",
        "guessable": true,
        "lo": "Paying well is enough",
        "hi": "It must feel meaningful"
      },
      {
        "id": "CAREER-008",
        "q": "How do you feel about one of us taking a big career risk, like starting a business?",
        "type": "scale",
        "depth": 2,
        "note": "Career risk appetite as a couple.",
        "guessable": true,
        "lo": "I prefer stability",
        "hi": "I'm all for bold risks"
      },
      {
        "id": "CAREER-003",
        "q": "How willing are you to relocate for a job opportunity?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces mobility vs rootedness, a common career-stage clash.",
        "guessable": true,
        "lo": "I want to put down roots",
        "hi": "Very willing to move"
      },
      {
        "id": "CAREER-010",
        "q": "At what age would you like to be able to retire or slow down?",
        "type": "mc",
        "depth": 1,
        "note": "Retirement timing, distinct from the retirement-vision question (DREAM-003).",
        "guessable": true,
        "opts": [
          "Mid-50s or earlier",
          "Around 60",
          "Mid-60s",
          "I'd work as long as I can"
        ]
      },
      {
        "id": "CAREER-005",
        "q": "How many hours a week is too many to spend on work?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces workaholism tolerance.",
        "guessable": true,
        "opts": [
          "Under 40",
          "40-50",
          "50-60",
          "Whatever the job needs"
        ]
      },
      {
        "id": "CAREER-007",
        "q": "Would you take a pay cut for a better lifestyle or more time together?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces the income-vs-time trade-off.",
        "guessable": true,
        "lo": "I'd hold out for the income",
        "hi": "Gladly, for a better life"
      },
      {
        "id": "CAREER-009",
        "q": "When work and family time conflict, which should usually win?",
        "type": "scale",
        "depth": 2,
        "note": "A specific work-life boundary, distinct from the priorities rank (US-032).",
        "guessable": true,
        "lo": "Family almost always wins",
        "hi": "Work has to come first sometimes"
      },
      {
        "id": "CAREER-004",
        "q": "If our careers ever conflict, whose should take priority?",
        "type": "mc",
        "depth": 4,
        "note": "A pointed career + gender-roles question; distinct positions.",
        "guessable": true,
        "opts": [
          "The husband's",
          "The wife's",
          "Whoever earns more",
          "Whoever is more passionate about theirs",
          "We'd decide case by case"
        ]
      },
      {
        "id": "CAREER-012",
        "q": "If we had children and one career had to slow down, whose would you expect it to be?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "The wife's",
          "The husband's",
          "Whoever earns less",
          "Whoever has the more flexible job",
          "Whoever most wants to focus on the children",
          "Decide when the time comes"
        ]
      },
      {
        "id": "CAREER-013",
        "q": "If the wife earned significantly more, how would that sit with you?",
        "type": "mc",
        "depth": 4,
        "ref": "1 Timothy 5:8",
        "note": "ROLE-004 rates the provider ideal in the abstract. This makes it concrete and refuses to hedge — 'fine, but I'd notice' is the honest middle most people actually occupy.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Completely fine",
          "Fine, though I'd notice it",
          "It would be uncomfortable",
          "It would be a real problem for me"
        ]
      }
    ]
  },
  "character-self-awareness": {
    "name": "Character",
    "color": "#5E7A4E",
    "icon": "star",
    "hook": {
      "id": "SELF-038",
      "q": "How comfortable are you with telling a small lie to avoid hurting someone's feelings?"
    },
    "parts": [
      {
        "name": "Who you really are",
        "qids": [
          "SELF-013",
          "SELF-001",
          "SELF-004",
          "SELF-028",
          "SELF-030",
          "SELF-031",
          "SELF-032"
        ]
      },
      {
        "name": "What shaped you",
        "qids": [
          "SELF-011",
          "SELF-008",
          "SELF-033",
          "SELF-023",
          "SELF-024",
          "SELF-029",
          "SELF-016"
        ]
      },
      {
        "name": "Growing on purpose",
        "qids": [
          "SELF-020",
          "SELF-015",
          "SELF-034",
          "SELF-035",
          "SELF-036",
          "SELF-022",
          "SELF-018"
        ]
      },
      {
        "name": "Integrity and honesty",
        "qids": [
          "SELF-037",
          "SELF-021",
          "SELF-038",
          "SELF-025",
          "SELF-026",
          "SELF-039",
          "SELF-040"
        ]
      },
      {
        "name": "Fears and forgiveness",
        "qids": [
          "SELF-041",
          "SELF-042",
          "SELF-006",
          "SELF-007",
          "SELF-043",
          "SELF-012"
        ]
      }
    ],
    "questions": [
      {
        "id": "SELF-013",
        "q": "How much alone time do you need to feel like yourself again?",
        "type": "scale",
        "depth": 1,
        "note": "Surfaces introvert/extrovert rhythm.",
        "guessable": true,
        "core": true,
        "lo": "I recharge around people",
        "hi": "I need lots of solitude"
      },
      {
        "id": "SELF-001",
        "q": "How easily do you open up to someone?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces how safe each feels being truly known.",
        "guessable": true,
        "lo": "Guarded",
        "hi": "Very open"
      },
      {
        "id": "SELF-004",
        "q": "How easily do you express your emotions?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces emotional vocabulary and openness.",
        "guessable": true,
        "lo": "They stay locked inside",
        "hi": "I express them easily"
      },
      {
        "id": "SELF-028",
        "q": "How much do you need to be alone with a feeling before you can talk about it?",
        "type": "scale",
        "depth": 3,
        "note": "Latency, not ease. SELF-004 measures how easily emotions come out; someone can be expressive and still need two days first. The gap between partners here causes the 'why won't you just talk to me' fight.",
        "guessable": true,
        "lo": "I can talk about it as it happens",
        "hi": "I need time alone first"
      },
      {
        "id": "SELF-030",
        "q": "What kind of people do you feel most comfortable around?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Warm and expressive: open, friendly and emotionally open",
          "Quiet and reserved: calm, private and comfortable with silence",
          "Fun and outgoing: energetic, social and spontaneous",
          "Direct and straightforward: honest, blunt and to the point",
          "Calm and practical: realistic, steady and focused on solutions",
          "Driven and ambitious: focused, motivated and goal-oriented"
        ]
      },
      {
        "id": "SELF-031",
        "q": "Which best describes how you see yourself?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Steady: dependable, grounded and consistent",
          "Driven: ambitious, motivated and always pushing forward",
          "Caring: people-focused, supportive and empathetic",
          "Independent: self-reliant, private and comfortable doing my own thing",
          "Adventurous: curious, spontaneous and always up for something new"
        ]
      },
      {
        "id": "SELF-032",
        "q": "What matters most to you when you think about the person you're becoming?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Growing in character",
          "Deepening my faith",
          "Building a good family life",
          "Achieving something meaningful",
          "Living freely and authentically"
        ]
      },
      {
        "id": "SELF-011",
        "q": "Who has influenced you most in becoming the person you are today?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces formative influences."
      },
      {
        "id": "SELF-008",
        "q": "Rank what gives your life the most meaning.",
        "type": "rank",
        "depth": 2,
        "note": "Surfaces what truly fulfills each person.",
        "opts": [
          "Faith",
          "Family",
          "Work",
          "Friends",
          "Personal growth",
          "Serving others"
        ]
      },
      {
        "id": "SELF-033",
        "q": "Rank these areas of your life from most to least important to you.",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Health",
          "Family",
          "Wealth",
          "Faith",
          "Personal growth"
        ]
      },
      {
        "id": "SELF-023",
        "q": "When making a big decision, what do you lean on most?",
        "type": "rank",
        "depth": 2,
        "ref": "James 1:5",
        "note": "Turns 'how do you decide' into a compare-your-lists ranking.",
        "opts": [
          "Prayer",
          "Scripture",
          "Wise counsel",
          "My own judgment",
          "Research and logic"
        ]
      },
      {
        "id": "SELF-024",
        "q": "How much do your friends influence your choices and direction?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 13:20",
        "note": "Surfaces susceptibility to peer influence as a self-aware measure.",
        "guessable": true,
        "lo": "Very little",
        "hi": "A great deal"
      },
      {
        "id": "SELF-029",
        "q": "When an everyday problem hits, who do you go to first?",
        "type": "mc",
        "depth": 2,
        "ref": "Proverbs 15:22",
        "note": "SELF-023 covers big decisions and omits the partner entirely. This is the daily instinct, and includes them.",
        "guessable": true,
        "opts": [
          "I work it out myself",
          "My partner",
          "A parent",
          "A friend or mentor",
          "I pray about it first"
        ]
      },
      {
        "id": "SELF-016",
        "q": "What would the people who know you best say I should know about you?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces self-awareness through others' eyes."
      },
      {
        "id": "SELF-020",
        "q": "How actively are you working on your own growth and character right now?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces present-tense sanctification effort the hosts press on.",
        "guessable": true,
        "lo": "Not focused on it",
        "hi": "Actively working on myself"
      },
      {
        "id": "SELF-015",
        "q": "What's one part of yourself you'd most like to grow or change?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces self-awareness and desire to grow."
      },
      {
        "id": "SELF-034",
        "q": "Which character traits come most naturally to you? Rank these from strongest to weakest.",
        "type": "rank",
        "depth": 2,
        "ref": "Galatians 5:22-23",
        "opts": [
          "Patience",
          "Kindness",
          "Self-control",
          "Gentleness",
          "Honesty",
          "Humility"
        ]
      },
      {
        "id": "SELF-035",
        "q": "Which of these do you most want to grow in?",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Patience",
          "Kindness",
          "Self-control",
          "Gentleness",
          "Honesty",
          "Humility"
        ]
      },
      {
        "id": "SELF-036",
        "q": "Which area of your life are you most intentional about staying disciplined in?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Health: exercise, food, sleep",
          "family time - quality time spent with family",
          "Time: planning, routines, getting things done",
          "Money: spending, saving, budgeting",
          "Faith: prayer, Scripture, spiritual disciplines",
          "Personal growth: learning, reflection, working on myself"
        ]
      },
      {
        "id": "SELF-022",
        "q": "How well do you manage your time and responsibilities?",
        "type": "scale",
        "depth": 2,
        "ref": "Ephesians 5:16",
        "note": "Stewardship of time, distinct from money discipline (FIN-004).",
        "guessable": true,
        "lo": "Often disorganized",
        "hi": "Very organized and on top of it"
      },
      {
        "id": "SELF-018",
        "q": "How much do you take initiative rather than waiting to be led?",
        "type": "scale",
        "depth": 2,
        "note": "The passivity red flag as a self-awareness measure.",
        "guessable": true,
        "lo": "I tend to wait and follow",
        "hi": "I take charge and initiate"
      },
      {
        "id": "SELF-037",
        "q": "When someone gives you honest feedback, how do you usually respond?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "core": true,
        "opts": [
          "I welcome it: I appreciate being challenged",
          "I listen, even when it's difficult",
          "I find it difficult to accept",
          "It depends on who it's from"
        ]
      },
      {
        "id": "SELF-021",
        "q": "How comfortable are you being held accountable for your weaknesses?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 28:13",
        "note": "The 'live confessionally' trait as a scoreable comfort level.",
        "guessable": true,
        "lo": "I'd rather handle them privately",
        "hi": "I want people holding me accountable"
      },
      {
        "id": "SELF-038",
        "q": "How comfortable are you with telling a small lie to avoid hurting someone's feelings?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "core": true,
        "opts": [
          "Not comfortable at all",
          "Only in rare situations",
          "Sometimes, if it seems kinder",
          "Quite comfortable with it"
        ]
      },
      {
        "id": "SELF-025",
        "q": "How do you handle gossip in everyday conversation?",
        "type": "mc",
        "depth": 2,
        "ref": "Proverbs 16:28",
        "note": "Surfaces speech integrity directly as distinct positions.",
        "guessable": true,
        "opts": [
          "I steer away from it",
          "I listen but don't spread it",
          "I join in sometimes",
          "I enjoy a good bit of gossip"
        ]
      },
      {
        "id": "SELF-026",
        "q": "Do you act the same around everyone, or differently depending on who's watching?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 10:9",
        "note": "Consistency of character in public vs private — a real character tell.",
        "guessable": true,
        "core": true,
        "lo": "I'm the same with everyone",
        "hi": "I adapt a lot to who I'm with"
      },
      {
        "id": "SELF-039",
        "q": "When your feelings and your values point in different directions, which do you usually follow?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 3:5",
        "guessable": true,
        "lo": "My feelings almost always",
        "hi": "My values almost always",
        "steps": [
          "My feelings almost always",
          "My feelings more often",
          "It depends",
          "My values more often",
          "My values almost always"
        ]
      },
      {
        "id": "SELF-040",
        "q": "When life gets hard, how do you most often cope?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Turn to prayer or Scripture",
          "Talk it through with someone",
          "Keep busy or stay active",
          "Take time to think and process it on my own",
          "Distract myself with something enjoyable"
        ]
      },
      {
        "id": "SELF-041",
        "q": "Which quality do you think you'd bring most to a marriage?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Steadiness: I'm dependable and consistent",
          "Encouragement: I naturally build people up",
          "Care: I notice needs and look after people",
          "Fun: I bring energy, humour and adventure",
          "Commitment: I stick with people through difficult seasons"
        ]
      },
      {
        "id": "SELF-042",
        "q": "What's one thing about you that could be difficult to live with?",
        "type": "open",
        "depth": 4
      },
      {
        "id": "SELF-006",
        "q": "How much do you need to feel in control?",
        "type": "scale",
        "depth": 4,
        "note": "Surfaces control and flexibility.",
        "guessable": true,
        "lo": "Easygoing, happy to go with the flow",
        "hi": "I need to be in control"
      },
      {
        "id": "SELF-007",
        "q": "What are you most afraid of in this season of your life?",
        "type": "open",
        "depth": 4,
        "note": "Surfaces fears beyond the relationship itself."
      },
      {
        "id": "SELF-043",
        "q": "How much do worries about the future occupy your thoughts?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "Hardly ever",
        "hi": "Almost constantly"
      },
      {
        "id": "SELF-012",
        "q": "How easily do you forgive?",
        "type": "scale",
        "depth": 4,
        "ref": "Colossians 3:13",
        "note": "Surfaces whether grudges linger or release.",
        "guessable": true,
        "core": true,
        "lo": "I hold on a long time",
        "hi": "I forgive quickly"
      }
    ]
  },
  "us-compatibility": {
    "name": "Us",
    "color": "#9C4A6E",
    "icon": "heart",
    "hook": {
      "id": "US-120",
      "q": "How much would you need me to change from who I am today for you to be happy marrying me as I am?"
    },
    "parts": [
      {
        "name": "Why us",
        "qids": [
          "US-051",
          "US-008",
          "US-052",
          "US-053",
          "US-050",
          "US-016",
          "US-035",
          "US-054"
        ]
      },
      {
        "name": "Choosing each other",
        "qids": [
          "US-048",
          "US-055",
          "US-056",
          "US-057",
          "US-058",
          "US-059",
          "US-060",
          "US-049"
        ]
      },
      {
        "name": "The pace we’re going",
        "qids": [
          "US-029",
          "US-061",
          "US-062",
          "US-063",
          "US-034",
          "US-064",
          "US-065",
          "US-066"
        ]
      },
      {
        "name": "Towards engagement",
        "qids": [
          "US-067",
          "US-068",
          "US-069",
          "US-070",
          "US-071",
          "US-072",
          "US-073"
        ]
      },
      {
        "name": "Getting ready for marriage",
        "qids": [
          "US-074",
          "US-010",
          "US-075",
          "US-076",
          "US-077",
          "US-078",
          "US-079",
          "US-080"
        ]
      },
      {
        "name": "Friends and our own lives",
        "qids": [
          "US-030",
          "US-081",
          "US-082",
          "US-083",
          "US-084",
          "US-085",
          "US-086"
        ]
      },
      {
        "name": "Counsel and blessing",
        "qids": [
          "US-087",
          "US-088",
          "US-089",
          "US-090",
          "US-091",
          "US-092"
        ]
      },
      {
        "name": "Love, not just feelings",
        "qids": [
          "US-002",
          "US-093",
          "US-004",
          "US-094",
          "US-095",
          "US-096",
          "US-097"
        ]
      },
      {
        "name": "What makes it last",
        "qids": [
          "US-098",
          "US-099",
          "US-006",
          "US-100",
          "US-101",
          "US-102",
          "US-103"
        ]
      },
      {
        "name": "Through hard seasons",
        "qids": [
          "US-104",
          "US-105",
          "US-106",
          "US-107",
          "US-108",
          "US-109",
          "US-110"
        ]
      },
      {
        "name": "Covenant and cost",
        "qids": [
          "US-111",
          "US-040",
          "US-041",
          "US-112",
          "US-113",
          "US-114",
          "US-115"
        ]
      },
      {
        "name": "Honest about us",
        "qids": [
          "US-038",
          "US-116",
          "US-117",
          "US-118",
          "US-119",
          "US-011",
          "US-120",
          "US-121"
        ]
      }
    ],
    "questions": [
      {
        "id": "US-051",
        "q": "Which version of “us” do you enjoy most?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "Us on a proper date",
          "Us travelling or exploring somewhere",
          "Us at home doing absolutely nothing",
          "Us laughing and being silly",
          "Us having a deep conversation",
          "Us worshipping, praying or serving together",
          "Us working towards a goal together"
        ]
      },
      {
        "id": "US-008",
        "q": "What about me makes you proud?",
        "type": "open",
        "depth": 1,
        "note": "An affirming prompt that builds each other up."
      },
      {
        "id": "US-052",
        "q": "When do you feel closest to me?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "When we're having a deep conversation",
          "When we're laughing and having fun",
          "When we're physically affectionate",
          "When we're praying, worshipping or talking about God",
          "When we're doing something or going somewhere together",
          "When you support me through something difficult",
          "When we're simply relaxing together"
        ]
      },
      {
        "id": "US-053",
        "q": "What makes you feel most emotionally chosen by me?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "When you prioritise time with me",
          "When you defend or stand up for me",
          "When you ask what I'm thinking or feeling",
          "When you show affection without me asking",
          "When you include me in your plans and decisions",
          "When you speak positively about me to other people",
          "When you make sacrifices for me"
        ]
      },
      {
        "id": "US-050",
        "q": "How much of your enjoyment of something comes from having someone to share it with?",
        "type": "scale",
        "depth": 1,
        "note": "Enjoyment amplification, distinct from FUN-006 (how free time gets allocated) and SELF-013 (solitude to recharge). This is whether company is what makes it good.",
        "guessable": true,
        "lo": "I enjoy things just as much alone",
        "hi": "Everything's better shared"
      },
      {
        "id": "US-016",
        "q": "What's something you've always wanted to ask me but never have?",
        "type": "open",
        "depth": 3,
        "note": "A trust-builder that opens hidden doors."
      },
      {
        "id": "US-035",
        "q": "How important is it that your spouse is also your best friend?",
        "type": "scale",
        "depth": 2,
        "ref": "Song of Solomon 5:16",
        "note": "The friendship-vs-romance value behind 'enjoy time together in non-romantic settings'.",
        "guessable": true,
        "core": true,
        "lo": "Romance matters more to me",
        "hi": "Best friends first"
      },
      {
        "id": "US-054",
        "q": "Which parts of our connection would you most want to stay strong through our marriage?",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Deep friendship",
          "Romance",
          "Physical and sexual attraction",
          "Emotional closeness",
          "Shared faith",
          "Fun and laughter",
          "Shared purpose and goals"
        ]
      },
      {
        "id": "US-048",
        "q": "How clear are you on what you're looking for in a spouse?",
        "type": "scale",
        "depth": 2,
        "note": "Confidence rather than content. DEAL-002 asks what the must-haves are; this asks whether the person actually knows.",
        "guessable": true,
        "lo": "Still working it out",
        "hi": "I know exactly"
      },
      {
        "id": "US-055",
        "q": "What matters most to you for two people to be truly compatible?",
        "type": "rank",
        "depth": 2,
        "opts": [
          "How we talk day to day",
          "Our energy levels and how much time alone we need",
          "Our sense of humour",
          "The pace of life and routines we like",
          "How we each handle money day to day",
          "How we like to spend free time",
          "How tidy and organised we are"
        ]
      },
      {
        "id": "US-056",
        "q": "Where do you think we are strongest as a couple/friends right now?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Our faith and convictions",
          "Our friendship",
          "Our attraction and chemistry",
          "Our communication",
          "Our personalities complementing each other",
          "Our shared goals and direction",
          "The way we enjoy everyday life together"
        ]
      },
      {
        "id": "US-057",
        "q": "Where do you think we're most alike? Rank these from most similar to least similar.",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Faith and values",
          "Personality",
          "Sense of humour",
          "Lifestyle and habits",
          "Interests and hobbies",
          "Ambition and goals",
          "How we relate to other people"
        ]
      },
      {
        "id": "US-058",
        "q": "What is one difference between us that you love, and one that could be hard for us?",
        "type": "open",
        "depth": 2
      },
      {
        "id": "US-059",
        "q": "When deciding whether someone is the right person to marry, what should matter most? Rank these.",
        "type": "rank",
        "depth": 3,
        "ref": "Amos 3:3",
        "core": true,
        "opts": [
          "Shared faith and convictions",
          "Character",
          "Commitment and loyalty",
          "Attraction and chemistry",
          "Friendship and emotional connection",
          "Shared goals and direction",
          "How well we handle conflict and difficult seasons"
        ]
      },
      {
        "id": "US-060",
        "q": "If romantic feelings faded for a while but the rest was strong, how would it affect your commitment?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "It would not change my commitment",
          "I'd be concerned, but I'd work to rebuild it",
          "I'd wonder whether something important was missing",
          "I'd seriously rethink the relationship",
          "I believe strong romantic feelings are needed for a marriage to continue"
        ]
      },
      {
        "id": "US-049",
        "q": "Has what you're looking for in a partner changed since we met?",
        "type": "mc",
        "depth": 4,
        "note": "Surfaces whether the list bent to fit the person in front of them — which can be growth or self-deception. The conversation is the point.",
        "guessable": true,
        "opts": [
          "Not at all",
          "A little",
          "A lot: you changed it",
          "I've let go of things that didn't matter"
        ]
      },
      {
        "id": "US-029",
        "q": "How do you feel about the pace our relationship is moving?",
        "type": "scale",
        "depth": 2,
        "ref": "Ecclesiastes 3:1",
        "note": "Surfaces a pace mismatch directly; gap between answers is the signal.",
        "guessable": true,
        "lo": "Too slow",
        "hi": "Too fast",
        "steps": [
          "Too slow for me",
          "A little slow",
          "Just right",
          "A little fast",
          "Too fast for me"
        ]
      },
      {
        "id": "US-061",
        "q": "What would you ideally want our next major relationship step to be?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Spend more time simply dating and getting to know each other",
          "Become more intentional about discussing marriage",
          "Involve family, pastors or mentors more seriously",
          "Move towards engagement",
          "Begin actively planning marriage",
          "I'm happy with where we are for now"
        ]
      },
      {
        "id": "US-062",
        "q": "What is your intention for our relationship at this stage?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "I'm intentionally pursuing marriage with you",
          "I'm seriously discerning whether we should marry",
          "I'm committed to the relationship but not ready to think about marriage yet",
          "I'm mainly enjoying our relationship and seeing where it goes",
          "I'm unsure what I want our relationship to become"
        ]
      },
      {
        "id": "US-063",
        "q": "How certain do you currently feel that you want this relationship to lead to marriage?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Very uncertain",
          "I have significant questions",
          "I'm genuinely considering it",
          "Very likely",
          "I'm already confident that I want to marry you"
        ]
      },
      {
        "id": "US-034",
        "q": "Should this season be more about having fun or seriously evaluating our future?",
        "type": "scale",
        "depth": 1,
        "note": "Surfaces approach to dating; catches the over-spiritualizing-it trap.",
        "guessable": true,
        "lo": "Mostly enjoy it",
        "hi": "Seriously evaluate it"
      },
      {
        "id": "US-064",
        "q": "Do you believe Christians should date someone they already know they could not realistically marry?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "No: dating should only be pursued where marriage is realistically possible",
          "Generally no, because dating should be intentional towards marriage",
          "Possibly, if you're still genuinely discerning compatibility",
          "Yes: dating can be worthwhile even if marriage isn't currently the goal",
          "Yes: dating does not need to be connected to marriage at all"
        ]
      },
      {
        "id": "US-065",
        "q": "How soon into dating do you think a relationship should become exclusive?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "From the beginning: if we're dating, we shouldn't date other people",
          "After a few dates once there's clear mutual interest",
          "Once we've had an explicit conversation about exclusivity",
          "Only once the relationship becomes serious",
          "Dating multiple people is fine until there's a formal commitment"
        ]
      },
      {
        "id": "US-066",
        "q": "How comfortable would you be ending a good relationship that still wasn't heading towards marriage?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "Very uncomfortable",
        "hi": "Very comfortable",
        "steps": [
          "Very uncomfortable: I'd keep giving it time",
          "I'd find it hard to walk away",
          "It would depend on how much hope I still saw",
          "I'd be ready to end it rather than wait forever",
          "Very comfortable: if we're not moving towards marriage, I wouldn't want to waste our time"
        ]
      },
      {
        "id": "US-067",
        "q": "If you were sure you wanted to marry me, how long would you want to wait before getting engaged?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Less than 6 months",
          "Around 6–12 months",
          "Around 1–2 years",
          "More than 2 years",
          "I wouldn't want a set timeframe"
        ]
      },
      {
        "id": "US-068",
        "q": "Once engaged, how long would you ideally want the engagement to last?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Less than 6 months",
          "Around 6–12 months",
          "Around 1–2 years",
          "More than 2 years",
          "However long was practically necessary"
        ]
      },
      {
        "id": "US-069",
        "q": "How long do you think a couple should ideally know each other before getting engaged?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Less than 6 months can be enough",
          "Around 6–12 months",
          "At least 1–2 years",
          "More than 2 years",
          "Time matters less than what the couple has actually worked through together"
        ]
      },
      {
        "id": "US-070",
        "q": "What would you most want us to experience together before getting engaged? Rank these",
        "type": "rank",
        "depth": 3,
        "opts": [
          "A serious disagreement or difficult conversation",
          "Spending significant time with each other's families",
          "Seeing each other under stress",
          "Travelling or spending extended time together",
          "Working through money and future plans",
          "Serving or being involved in church together",
          "Going through premarital counselling or mentoring"
        ]
      },
      {
        "id": "US-071",
        "q": "When should we start having serious conversations about marriage?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Very early: if marriage is the goal of dating, we should talk about it from the beginning",
          "Once we know there is strong mutual interest",
          "Once we're exclusive",
          "Once the relationship has become clearly serious",
          "Only when one of us is seriously thinking about engagement",
          "I prefer relationships to develop naturally without much marriage talk early on"
        ]
      },
      {
        "id": "US-072",
        "q": "Before engagement, how emotionally invested do you think a couple should become?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 4:23",
        "guessable": true,
        "opts": [
          "Keep strong emotional boundaries until there is a formal commitment",
          "Grow emotionally close gradually while still guarding against acting married before marriage",
          "Become deeply emotionally invested once the relationship is exclusive and serious",
          "Become fully emotionally invested once both people are intentionally pursuing marriage",
          "I don't think engagement should determine how emotionally close a couple becomes"
        ]
      },
      {
        "id": "US-073",
        "q": "When is it right to start talking about each other as part of your future?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Only after engagement",
          "Once we've clearly agreed we're dating towards marriage",
          "Once we're exclusive",
          "Whenever we both feel serious",
          "Very early: talking about the future helps us see if we're compatible"
        ]
      },
      {
        "id": "US-074",
        "q": "What has shaped your understanding of marriage the most?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "core": true,
        "opts": [
          "The Bible and my Christian beliefs",
          "My parents or the marriage I grew up watching",
          "Church teaching, pastors or Christian mentors",
          "Other marriages I've seen around me",
          "Books, films, social media or wider culture",
          "My own relationship experiences and conclusions"
        ]
      },
      {
        "id": "US-010",
        "q": "Whose marriage do you admire, and what do they do that you'd want for us?",
        "type": "open",
        "depth": 1,
        "note": "Surfaces role models for a healthy marriage."
      },
      {
        "id": "US-075",
        "q": "What do you notice first when you see a marriage you admire?",
        "type": "mc",
        "depth": 1,
        "guessable": true,
        "opts": [
          "They genuinely enjoy each other",
          "Their faith clearly shapes their marriage",
          "They communicate and handle conflict well",
          "They are loyal and committed to each other",
          "They work well as a team",
          "They have a strong family life",
          "They still show affection and romance"
        ]
      },
      {
        "id": "US-076",
        "q": "Before getting married, how much intentional marriage preparation would you want us to do?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Formal premarital counselling with a pastor or counsellor",
          "A structured Christian marriage course or counselling",
          "Several intentional conversations with a pastor or mentor",
          "Mainly work through important topics ourselves",
          "I don't think formal preparation is necessary"
        ]
      },
      {
        "id": "US-077",
        "q": "Who would you most want involved in preparing us for marriage?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Our pastor or church leaders",
          "A Christian counsellor",
          "A mature married couple we trust",
          "Our parents",
          "A marriage course or programme",
          "Mainly just the two of us"
        ]
      },
      {
        "id": "US-078",
        "q": "What matters most for being ready for marriage? Rank these from most important to least important.",
        "type": "rank",
        "depth": 2,
        "ref": "Luke 14:28",
        "opts": [
          "Spiritual maturity",
          "Strong character and emotional maturity",
          "Shared convictions about marriage and family",
          "Ability to communicate and resolve conflict",
          "Financial responsibility",
          "Practical stability and ability to build a household",
          "Genuine certainty about choosing the person"
        ]
      },
      {
        "id": "US-079",
        "q": "Which of these do you think we personally still need to strengthen most before marriage?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Spiritual maturity",
          "Strong character and emotional maturity",
          "Shared convictions about marriage and family",
          "Ability to communicate and resolve conflict",
          "Financial responsibility",
          "Practical stability and ability to build a household",
          "Genuine certainty about choosing the person"
        ]
      },
      {
        "id": "US-080",
        "q": "What would you want us to do about surnames if we married?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Both use the husband's surname",
          "Each keep our own surname",
          "Use a double-barrelled or combined surname",
          "Be open to either person's surname",
          "I don't have a strong preference"
        ]
      },
      {
        "id": "US-030",
        "q": "How important is it to you that I get along with your closest friends?",
        "type": "scale",
        "depth": 2,
        "note": "A practical compatibility check the friendship section raises.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "US-081",
        "q": "How involved would you want your partner to be with your closest friends?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "I would want us to become one close social circle",
          "I'd want my partner to be genuinely close with them",
          "I'd want everyone to get along, but separate friendships are fine",
          "Respectful but fairly separate is enough",
          "My friendships and relationship can remain largely separate"
        ]
      },
      {
        "id": "US-082",
        "q": "If your closest friend and your partner really didn't like each other, what would you expect?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "My partner should come first, and I would distance myself from the friendship if necessary",
          "I would expect my friend to respect my relationship even if they disliked my partner",
          "I would try hard to preserve both relationships",
          "I would keep the friendship separate from my relationship",
          "If my friend had serious concerns, I would give their view significant weight"
        ]
      },
      {
        "id": "US-083",
        "q": "How much would you want close friends and Christian community to be part of our married life?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Mostly just us",
        "hi": "Very connected",
        "steps": [
          "Mostly just us",
          "A small circle, with plenty of privacy",
          "A balance of time as a couple and with others",
          "Often with close friends and our church",
          "Very connected: community would be a big part of our life"
        ]
      },
      {
        "id": "US-084",
        "q": "After marriage, how important is it to you that we build friendships with other couples?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Very important: I'd want close couple friendships",
          "Important, but not essential",
          "Nice to have, but individual friendships matter more",
          "I don't particularly need couple friends",
          "I'd prefer most of our social life to stay separate rather than shared"
        ]
      },
      {
        "id": "US-085",
        "q": "Once we're married, how do you think we should view our individual lives and our life as a couple?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Marriage becomes the main priority: our individual plans should normally come second to what is best for us as a couple",
          "Marriage comes first, but we should still strongly protect each person's individual goals and identity",
          "Our shared life and individual lives should carry roughly equal weight",
          "Marriage should support our individual lives rather than significantly reshape them",
          "We should remain highly independent while choosing to share life together"
        ]
      },
      {
        "id": "US-086",
        "q": "Which best describes what you believe marriage should become over time?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Two people becoming increasingly united in almost every part of life",
          "A deeply united couple while still keeping strong individual identities",
          "A partnership where we share the important things but keep plenty separate",
          "Two independent people who love each other without needing to merge much of their lives",
          "I haven't really thought about it"
        ]
      },
      {
        "id": "US-087",
        "q": "Whose opinion about our relationship would matter most to you?",
        "type": "rank",
        "depth": 3,
        "ref": "Proverbs 15:22",
        "opts": [
          "My parents",
          "Your parents",
          "Our pastor or church leaders",
          "A mature Christian couple or mentor",
          "My closest friends",
          "Our wider church community"
        ]
      },
      {
        "id": "US-088",
        "q": "If your parents strongly believed you should not marry me, what would you do?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "I would not marry without their blessing",
          "I would pause the relationship until their concerns were resolved",
          "I would take their concerns very seriously but could still marry if I believed they were wrong",
          "I would listen respectfully, but the decision would ultimately be mine before God",
          "My parents' objection would not significantly affect my decision"
        ]
      },
      {
        "id": "US-089",
        "q": "If several people we trusted raised serious concerns about our relationship, what should we do?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 11:14",
        "guessable": true,
        "opts": [
          "Stop moving towards marriage unless those concerns were resolved",
          "Pause and seriously investigate what they were seeing",
          "Listen carefully, but continue if we still believed the relationship was right",
          "Consider their advice, but make the decision mainly between us",
          "Our relationship is ultimately between us and God, so outside concerns should have little influence"
        ]
      },
      {
        "id": "US-090",
        "q": "If our pastor strongly advised us not to marry, how much weight should that carry?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "I would not marry against that advice",
          "I would pause until we understood and resolved the concern",
          "It would carry major weight, but wouldn't automatically decide for me",
          "I would consider it like any other advice",
          "I would not believe a pastor should have that level of authority over the decision"
        ]
      },
      {
        "id": "US-091",
        "q": "How comfortable are you with trusted people challenging things they see in our relationship?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 27:6",
        "guessable": true,
        "opts": [
          "Very comfortable: I want people close to us to speak up even when it's uncomfortable",
          "Comfortable if they know us well and have a genuine concern",
          "I'd rather they raise only serious concerns",
          "I'd prefer people to support us rather than question the relationship",
          "I believe relationship problems should mainly stay between the couple"
        ]
      },
      {
        "id": "US-092",
        "q": "If someone close to you raised a concern about me or our relationship privately, would you tell me?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Yes, straight away",
          "Yes, once I'd thought through whether the concern had merit",
          "Only if I thought the concern was serious",
          "Probably not: private conversations should remain private",
          "No: I would deal with their concern separately from our relationship"
        ]
      },
      {
        "id": "US-002",
        "q": "What tells you that what we have is really love and not just strong feelings?",
        "type": "open",
        "depth": 3,
        "note": "Surfaces how each distinguishes love from infatuation."
      },
      {
        "id": "US-093",
        "q": "What makes you feel most confident that a relationship is built on real love? Rank these.",
        "type": "rank",
        "depth": 3,
        "opts": [
          "Choosing each other even when feelings fluctuate",
          "Sacrificing for each other",
          "Trust and honesty",
          "Deep friendship",
          "Strong attraction and affection",
          "Helping each other grow",
          "Shared faith and commitment to God"
        ]
      },
      {
        "id": "US-004",
        "q": "What do you hope marriage would let us build that we couldn't build the same way while single?",
        "type": "open",
        "depth": 3,
        "note": "Surfaces the 'why marriage' for each."
      },
      {
        "id": "US-094",
        "q": "How much do you expect marriage to change the way you live your life?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Very little",
        "hi": "Completely",
        "steps": [
          "Very little: I expect most of my life to stay much the same",
          "Some adjustments",
          "A meaningful balance of continuity and change",
          "A lot: marriage should reshape many of my priorities",
          "Completely: becoming one household should fundamentally change how I make decisions and live"
        ]
      },
      {
        "id": "US-095",
        "q": "How much would you want us to rely on each other in married life?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "lo": "Very independent",
        "hi": "Fully one team",
        "steps": [
          "Very independent: I think each person should handle most of their own needs and responsibilities",
          "Mostly independent: support each other, but keep plenty separate",
          "Balanced: rely on each other for major things while still handling plenty individually",
          "Highly interdependent: I would want us involved in most important parts of each other's lives",
          "Deeply interdependent: I would want us to function as one team across almost every area of life"
        ]
      },
      {
        "id": "US-096",
        "q": "How much do you believe marriage itself changes a person's character and habits?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "core": true,
        "lo": "Very little",
        "hi": "Significantly",
        "steps": [
          "Very little: we should assume the person we marry is largely the person we'll live with",
          "Some small changes",
          "People can mature gradually",
          "Marriage can lead to major personal growth",
          "I expect marriage to change people significantly"
        ]
      },
      {
        "id": "US-097",
        "q": "If your partner had a habit you really disliked before marriage, what would you expect?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "It may never change, so I'd decide if I can live with it",
          "Hope it changes, but not make marriage depend on it",
          "Expect them to work hard on changing it",
          "Expect marriage and responsibility to change it",
          "I'd struggle to marry them unless it changed first"
        ]
      },
      {
        "id": "US-098",
        "q": "What would make you feel we had built a really great marriage?",
        "type": "rank",
        "depth": 2,
        "opts": [
          "A strong relationship with God at the centre",
          "Deep friendship and emotional closeness",
          "Trust, loyalty and commitment",
          "A peaceful and loving home",
          "A strong sex life and physical connection",
          "Raising a strong family",
          "Growing, achieving and building things together",
          "Having fun and really enjoying life together"
        ]
      },
      {
        "id": "US-099",
        "q": "If our marriage was strong in most areas but weak in one of these, which would worry you most?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "A strong relationship with God at the centre",
          "Deep friendship and emotional closeness",
          "Trust, loyalty and commitment",
          "A peaceful and loving home",
          "A strong sex life and physical connection",
          "Raising a strong family",
          "Growing, achieving and building things together",
          "Having fun and really enjoying life together"
        ]
      },
      {
        "id": "US-006",
        "q": "Rank what makes a marriage last, most important first.",
        "type": "rank",
        "depth": 2,
        "note": "Surfaces priorities; compare the two rankings.",
        "core": true,
        "opts": [
          "Communication",
          "Commitment",
          "Shared faith",
          "Trust",
          "Friendship",
          "Intimacy",
          "Shared goals"
        ]
      },
      {
        "id": "US-100",
        "q": "If one of these became weak for a long season, which would worry you most about our marriage?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Shared faith",
          "Trust",
          "Commitment",
          "Communication",
          "Friendship",
          "Physical and sexual intimacy",
          "Shared direction and goals"
        ]
      },
      {
        "id": "US-101",
        "q": "What would make you feel we're still dating, years into marriage?",
        "type": "rank",
        "depth": 2,
        "opts": [
          "Regular dates just for us",
          "Flirting and playful affection",
          "Physical and sexual intimacy",
          "Thoughtful surprises or gestures",
          "Trying new things and having adventures",
          "Making time for deep conversation",
          "Dressing up or making an effort for each other"
        ]
      },
      {
        "id": "US-102",
        "q": "If life became really busy, which part of our romantic connection would you protect first?",
        "type": "mc",
        "depth": 2,
        "guessable": true,
        "opts": [
          "Date nights",
          "Sex and physical intimacy",
          "Time talking properly",
          "Affection and flirting",
          "Trips or experiences together",
          "Small everyday gestures"
        ]
      },
      {
        "id": "US-103",
        "q": "Which things would you most want people to say about our marriage one day? Rank them.",
        "type": "rank",
        "depth": 2,
        "opts": [
          "They really love God",
          "They genuinely love and enjoy each other",
          "They are completely loyal to one another",
          "They built a strong family",
          "They are generous and serve other people",
          "They work as an incredible team",
          "They built a meaningful and successful life together"
        ]
      },
      {
        "id": "US-104",
        "q": "When hard seasons hit, how do you expect we'll get through them?",
        "type": "rank",
        "depth": 3,
        "ref": "James 1:2-4",
        "opts": [
          "Lean on God together",
          "Lean mainly on each other",
          "Push through practically",
          "Seek outside help and counsel"
        ]
      },
      {
        "id": "US-105",
        "q": "Would a happy, loving marriage be a success if we never reached our career, money or life goals?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Yes: a faithful, loving marriage matters far more than outward success",
          "Yes, but I'd still feel let down about what we didn't achieve",
          "Partly: I need both a strong marriage and real progress in life",
          "I'd struggle to feel successful if we hadn't built the life we planned",
          "No: reaching our wider goals is an important part of a successful marriage to me"
        ]
      },
      {
        "id": "US-106",
        "q": "If caring for our children kept pushing our marriage into the background, what should we do?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Make our marriage the priority again, under God",
          "Keep the children as the main priority while they're young",
          "Accept that marriage comes second in some parenting seasons",
          "Protect both equally, even if other parts of life suffer",
          "I haven't thought about it"
        ]
      },
      {
        "id": "US-107",
        "q": "If you were unhappy in our marriage for a long time, what would commitment mean to you?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Stay and keep working on it, however long it lasts",
          "Stay unless there is a biblical reason to end the marriage",
          "Stay while we are both really trying to improve things",
          "Try hard for a set time, but leave if nothing changes",
          "Being happy matters enough that a long unhappy marriage may need to end"
        ]
      },
      {
        "id": "US-108",
        "q": "If your spouse changed a lot after marriage, what would commitment mean to you?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Stay committed: marriage is a lifelong promise before God, however much they change",
          "Stay committed, unless they break our vows in a way the Bible treats as serious",
          "Work hard to adapt and rebuild, but accept there may be a limit",
          "Stay only if the new relationship is still healthy",
          "If we became deeply incompatible, ending the marriage could be right"
        ]
      },
      {
        "id": "US-109",
        "q": "If one of us became seriously ill or disabled for the long term, what would marriage require of you?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Stay fully committed and carry whatever care is needed myself",
          "Stay committed, and bring in as much family or professional help as needed",
          "Stay married, but accept that others may need to do most of the caring",
          "I don't know how much caring I could realistically do",
          "Some situations could change what can fairly be expected of the marriage"
        ]
      },
      {
        "id": "US-110",
        "q": "If one of us wanted counselling for a big problem and the other refused, what should happen?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "The one refusing should still be expected to go, for the marriage",
          "Keep asking, and involve trusted church leaders or mentors",
          "The willing one should get help alone first",
          "Counselling should never be forced; we both have to choose it",
          "Refusing all help for a serious problem would make me question the marriage"
        ]
      },
      {
        "id": "US-111",
        "q": "Rank these by the priority you believe they should normally have in our life together.",
        "type": "rank",
        "depth": 3,
        "ref": "Matthew 6:33",
        "core": true,
        "opts": [
          "God and our relationship with Him",
          "Our marriage",
          "Our children",
          "Work and career",
          "Extended family",
          "Church, ministry and serving others"
        ]
      },
      {
        "id": "US-040",
        "q": "How readily would you give up a hobby or commitment if it was hurting our relationship?",
        "type": "scale",
        "depth": 3,
        "ref": "Philippians 2:4",
        "note": "Willingness to sacrifice outside commitments, distinct from ranking priorities (US-032).",
        "guessable": true,
        "lo": "I'd be reluctant",
        "hi": "Readily"
      },
      {
        "id": "US-041",
        "q": "Rank what you'd find hardest to give up for a marriage.",
        "type": "rank",
        "depth": 4,
        "note": "US-040 asks how readily you'd drop a hobby that was hurting us. This ranks everything that's actually on the table, and the order is far more revealing than any single willingness rating.",
        "opts": [
          "Time on my own",
          "My friendships",
          "My career plans",
          "My hobbies",
          "Making decisions on my own",
          "My money being mine"
        ]
      },
      {
        "id": "US-112",
        "q": "What do you believe makes our marriage commitment binding?",
        "type": "mc",
        "depth": 4,
        "ref": "Malachi 2:14",
        "guessable": true,
        "core": true,
        "opts": [
          "Our covenant before God: marriage remains binding even when feelings or circumstances change",
          "Our vows to God and each other: we are committed for life except where Scripture permits the marriage to end",
          "Our lifelong promise to each other: even without seeing it primarily as a religious covenant",
          "Our commitment remains while the marriage is healthy and both people continue choosing it",
          "Marriage is a partnership that either person should be able to end if it no longer works",
          "I'm still working out what I believe"
        ]
      },
      {
        "id": "US-113",
        "q": "If you no longer felt in love, and there was no abuse, adultery or abandonment, what should you do?",
        "type": "mc",
        "depth": 4,
        "guessable": true,
        "opts": [
          "Stay married and work to rebuild love",
          "Stay married, because our vows don't depend on feelings",
          "Get counselling and try everything before thinking of separating",
          "Separate if the relationship stayed emotionally dead long enough",
          "Divorce should be an option if love is really gone"
        ]
      },
      {
        "id": "US-114",
        "q": "How sure are you right now that you'd want to marry me and stay committed for life?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "lo": "Serious doubts",
        "hi": "Completely sure",
        "steps": [
          "I have serious doubts",
          "I have some real doubts",
          "I'm hopeful, but still deciding",
          "I'm very sure",
          "I'm completely sure: I'd choose you for life"
        ]
      },
      {
        "id": "US-115",
        "q": "What, if anything, still gives you hesitation about choosing me for life?",
        "type": "open",
        "depth": 4
      },
      {
        "id": "US-038",
        "q": "How much should partners push each other to grow, versus accept each other as they are?",
        "type": "scale",
        "depth": 3,
        "ref": "Proverbs 27:17",
        "note": "The growth-pushing tension behind 'support each other's growth without pressure'; broader than the spiritual version (FAITH-008).",
        "guessable": true,
        "lo": "Accept each other as we are",
        "hi": "Actively push each other to grow"
      },
      {
        "id": "US-116",
        "q": "If we found a big disagreement before marriage that neither of us would change, what should we do?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Don't marry until we really agree",
          "Decide whether it's serious enough to stop us marrying",
          "Marry if our faith and commitment are strong, and keep working on it",
          "Accept that spouses can disagree on big things, and go ahead",
          "Expect one of us to give way in the end, for the sake of unity"
        ]
      },
      {
        "id": "US-117",
        "q": "Which areas would you least want us to enter marriage seriously divided on? Rank them.",
        "type": "rank",
        "depth": 3,
        "opts": [
          "Faith and theology",
          "Children and parenting",
          "Marriage roles",
          "Sex and intimacy",
          "Money",
          "Family and in-laws",
          "Career and lifestyle",
          "Political or moral convictions"
        ]
      },
      {
        "id": "US-118",
        "q": "If we had a serious recurring problem before marriage, what would you expect marriage to do to it?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Probably make it harder unless we dealt with it first",
          "Mostly leave it unchanged",
          "Give us more opportunity to work through it together",
          "Marriage itself would likely make the issue easier",
          "It would depend entirely on the problem"
        ]
      },
      {
        "id": "US-119",
        "q": "How serious would an ongoing problem need to be before you'd delay or rethink marriage?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Any big ongoing problem should be fixed first",
          "If it affected trust, faithfulness, safety or core values",
          "Only if it made me seriously doubt the relationship",
          "I'd usually rather marry and work through problems together",
          "I'd be very unwilling to delay marriage once committed"
        ]
      },
      {
        "id": "US-011",
        "q": "What about me gives you pause or concern right now?",
        "type": "open",
        "depth": 5,
        "note": "Invites honest concerns while there's still time."
      },
      {
        "id": "US-120",
        "q": "How much would you need me to change from who I am today for you to be happy marrying me as I am?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Hardly at all: I can genuinely accept you as you are",
          "A few smaller things",
          "There are some meaningful areas I'd want to improve",
          "There are several significant things I'd need to change",
          "I would be relying on major changes for the marriage to work"
        ]
      },
      {
        "id": "US-121",
        "q": "What's the main thing about me that you would hope changes over time?",
        "type": "open",
        "depth": 5
      }
    ]
  },
  "values-convictions": {
    "name": "Convictions",
    "color": "#5C2E45",
    "icon": "compass",
    "parts": [
      {
        "name": "Politics and culture",
        "qids": [
          "VAL-013",
          "VAL-014",
          "VAL-015",
          "VAL-016",
          "VAL-017",
          "VAL-018"
        ]
      },
      {
        "name": "Life, death and medicine",
        "qids": [
          "VAL-019",
          "VAL-020",
          "VAL-021",
          "VAL-022",
          "VAL-023",
          "VAL-024",
          "VAL-025"
        ]
      },
      {
        "name": "Sex, gender and marriage",
        "qids": [
          "VAL-026",
          "VAL-027",
          "VAL-028",
          "VAL-029",
          "VAL-030",
          "VAL-031",
          "VAL-032"
        ]
      },
      {
        "name": "Marriage, divorce and living together",
        "qids": [
          "VAL-033",
          "VAL-034",
          "VAL-035",
          "VAL-036",
          "VAL-037",
          "VAL-038",
          "VAL-039",
          "VAL-040"
        ]
      }
    ],
    "questions": [
      {
        "id": "VAL-013",
        "q": "How often do you talk politics?",
        "type": "mc",
        "depth": 1,
        "note": "Values & Convictions currently opens on abortion. This opens it gently — and the last option is a real echo-chamber tell.",
        "guessable": true,
        "core": true,
        "opts": [
          "Constantly",
          "Now and then",
          "I avoid it",
          "Only with people who already agree with me"
        ]
      },
      {
        "id": "VAL-014",
        "q": "How much do you enjoy a good debate?",
        "type": "scale",
        "depth": 1,
        "note": "Sets the temperature before the deck turns the heat up. Two people who differ here will experience this deck very differently.",
        "guessable": true,
        "lo": "I avoid them",
        "hi": "I love one"
      },
      {
        "id": "VAL-015",
        "q": "Politically, where do you land?",
        "type": "scale",
        "depth": 5,
        "note": "Surfaces political alignment without taking sides.",
        "guessable": true,
        "lo": "Conservative",
        "hi": "Progressive"
      },
      {
        "id": "VAL-016",
        "q": "If we regularly voted for different political parties or candidates, how would that affect you?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "It wouldn't bother me",
          "I'd prefer political agreement, but could comfortably accept the difference",
          "It would create real tension for me",
          "I would find it very difficult to marry someone whose politics were very different from mine",
          "Shared political convictions are important enough that major disagreement could be a deal-breaker"
        ]
      },
      {
        "id": "VAL-017",
        "q": "Which public issues would matter most for us to broadly agree on?",
        "type": "rank",
        "depth": 5,
        "opts": [
          "Abortion",
          "Sexuality and gender",
          "Religious freedom",
          "Immigration",
          "Poverty and welfare",
          "Crime and justice",
          "Environment and climate",
          "Role and size of government"
        ]
      },
      {
        "id": "VAL-018",
        "q": "Would you be comfortable with us legally keeping a firearm in our home?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Yes: I would actively want one for protection or sport",
          "Yes: if it were securely stored and responsibly handled",
          "I would tolerate one if it mattered strongly to my partner",
          "No: I would not want a firearm in our home",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-019",
        "q": "What is your conviction about the death penalty?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "I support it for the most serious crimes",
          "I believe it can be morally justified, but should be used very rarely",
          "I oppose it because life imprisonment is sufficient",
          "I oppose it in principle because the state should not take life as punishment",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-020",
        "q": "When, if ever, do you believe abortion can be morally acceptable?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "core": true,
        "opts": [
          "Never, except where treatment is necessary to save the mother's life and the baby's death cannot be avoided",
          "Only when the mother's life is seriously at risk",
          "In cases such as rape, incest or severe medical circumstances",
          "I believe abortion can be morally acceptable in some other circumstances, especially early in pregnancy",
          "I believe the decision should ultimately belong to the pregnant woman",
          "I'm still working out what I believe"
        ]
      },
      {
        "id": "VAL-021",
        "q": "If we had an unexpected pregnancy at a very difficult time, what would you believe we should do?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Continue the pregnancy regardless of the difficulty",
          "Continue the pregnancy unless there was a serious threat to the mother's life",
          "Consider abortion only in exceptional circumstances",
          "Consider all options together",
          "I believe the pregnant partner should ultimately decide"
        ]
      },
      {
        "id": "VAL-022",
        "q": "When, if ever, do you believe assisted suicide or euthanasia is morally acceptable?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Never: intentionally ending an innocent human life is morally wrong",
          "I oppose it generally, including in terminal illness",
          "Only in exceptional cases involving terminal illness and extreme suffering",
          "Competent adults should have the right to choose it under strict safeguards",
          "Adults should generally have the right to choose the timing of their death",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-023",
        "q": "If one of us was terminally ill and wanted medically assisted death, what should the other do?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Strongly oppose it",
          "Encourage other care and pain relief, but in the end respect their legal choice",
          "Support their choice if suffering was severe and death was near",
          "Fully support their right to decide",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-024",
        "q": "What best describes your approach to vaccinations for yourself and our future children?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Generally follow the recommended vaccination schedule",
          "Generally vaccinate, but consider some vaccines individually",
          "Decide each vaccine case by case after doing our own research",
          "Prefer to avoid most vaccinations unless clearly necessary",
          "Opposed to routine vaccination",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-025",
        "q": "If we strongly disagreed about giving our child a vaccine, how should we decide?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "Follow our child's doctor's advice",
          "Get several medical opinions first",
          "The more cautious parent can say no",
          "We both must agree before the child has it",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-026",
        "q": "Do you believe marriage, as God designed it, is only between a man and a woman?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Yes",
          "Yes as a Christian definition of marriage, while civil marriage can be broader",
          "I believe Christian marriage can include same-sex couples",
          "I'm still working it out"
        ]
      },
      {
        "id": "VAL-027",
        "q": "If a close friend or relative invited us to their same-sex wedding, what would you want us to do?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Say no, because going would feel like approving of something we believe is wrong",
          "Go, because loving the person doesn't mean agreeing with the marriage",
          "Go and fully celebrate the marriage",
          "Each decide for ourselves, rather than both making the same choice",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-028",
        "q": "Do you believe same-sex sexual relationships can be consistent with Christian faith?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "No: Scripture reserves sex for marriage between a man and a woman",
          "I believe the traditional teaching, but I'm still working through how it should be applied",
          "Some committed same-sex relationships can be compatible with Christian faith",
          "Yes: same-sex relationships can be fully affirmed",
          "I'm still working it out"
        ]
      },
      {
        "id": "VAL-029",
        "q": "Should a Christian affirm someone who identifies as a different gender from their biological sex?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "No: Christians should affirm biological sex as given by God",
          "Treat them with love and respect, but don't affirm the new identity",
          "It depends on the situation",
          "Yes: affirming their gender identity fits with Christian faith",
          "I'm still working it out"
        ]
      },
      {
        "id": "VAL-030",
        "q": "If someone close to us transitioned and asked us to use a new name or pronouns, what would you do?",
        "type": "mc",
        "depth": 3,
        "guessable": true,
        "opts": [
          "I would not use words I believe affirm a false gender identity",
          "I would use their new name, but not words I believe deny their biological sex",
          "I would use their new name and pronouns out of respect, even if I disagreed",
          "I would fully affirm their gender identity",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-031",
        "q": "Do you believe God created us ONLY as man and woman?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Yes: male and female are God-given realities",
          "Yes biologically, though someone may experience their gender differently",
          "I believe gender identity can differ from biological sex",
          "I believe anyone can identify as whatever they identify with",
          "I'm still working out what I believe"
        ]
      },
      {
        "id": "VAL-032",
        "q": "How important is modesty in how you believe we should dress and present ourselves after marriage?",
        "type": "scale",
        "depth": 3,
        "guessable": true,
        "lo": "Not important",
        "hi": "Extremely important",
        "steps": [
          "Not particularly important",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Extremely important: I believe Christians should have clear standards of modesty"
        ]
      },
      {
        "id": "VAL-033",
        "q": "What is your overall conviction about using birth control in marriage?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "I believe we should avoid artificial contraception and remain open to children",
          "I would prefer natural family planning or fertility-awareness methods only",
          "I am comfortable with contraception, but would have moral concerns about some methods",
          "I am comfortable with most forms of contraception",
          "I believe the choice is entirely personal and don't have a moral concern about contraception",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-034",
        "q": "How should we decide how many children to have or whether to delay pregnancy?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Remain open to however many children God gives us",
          "Use natural family planning to space pregnancies",
          "Intentionally plan our family using contraception",
          "Make the decision mainly around health, finances and family circumstances",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-035",
        "q": "How important is it that we agree on the exact method of contraception or family planning we use?",
        "type": "scale",
        "depth": 5,
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important",
          "Slightly important",
          "Moderately important",
          "Very important",
          "Essential: I couldn't comfortably use a method that goes against my beliefs"
        ]
      },
      {
        "id": "VAL-036",
        "q": "When, if ever, do you believe divorce can be morally or biblically acceptable?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "core": true,
        "opts": [
          "Never while both spouses are alive",
          "Only because of sexual unfaithfulness",
          "Sexual unfaithfulness or abandonment",
          "Sexual unfaithfulness, abandonment, or serious abuse or danger",
          "When a marriage has irretrievably broken down",
          "I'm still working out what I believe"
        ]
      },
      {
        "id": "VAL-037",
        "q": "If a spouse was abusive, what do you believe the other spouse should be free to do?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "core": true,
        "opts": [
          "Separate immediately for safety, but I would not see divorce as biblically permitted",
          "Separate and pursue repentance, accountability and possible reconciliation",
          "Divorce is morally justified in serious abuse",
          "Divorce and eventual remarriage can both be justified",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-038",
        "q": "After divorce, when do you believe remarriage is morally or biblically acceptable?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Never while the former spouse is alive",
          "Only if the divorce happened on biblically permitted grounds",
          "If the former spouse has remarried or permanently moved on",
          "After genuine healing and repentance, regardless of why the marriage ended",
          "Remarriage is generally acceptable after divorce",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-039",
        "q": "Do you believe an unmarried Christian couple should live together before marriage?",
        "type": "mc",
        "depth": 5,
        "ref": "1 Corinthians 6:18",
        "guessable": true,
        "opts": [
          "No: I believe living together should wait until marriage",
          "Generally no, even if engaged",
          "I would be comfortable once formally engaged and preparing to marry",
          "I would be comfortable if the relationship was serious and committed",
          "Yes: I don't see living together before marriage as morally wrong",
          "I'm unsure"
        ]
      },
      {
        "id": "VAL-040",
        "q": "Before marriage, is it OK for us to often stay overnight at each other's place, sleeping separately?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "No: I would avoid overnight stays",
          "Only now and then, for a practical reason",
          "Yes, if we slept separately and kept physical boundaries",
          "Yes: I don't see overnight stays as a problem in themselves",
          "I'm unsure"
        ]
      }
    ]
  },
  "faithfulness-loyalty": {
    "name": "Faithfulness",
    "color": "#7C4B72",
    "icon": "shield",
    "parts": [
      {
        "name": "Phones, privacy and trust",
        "qids": [
          "LOYAL-009",
          "LOYAL-016",
          "LOYAL-005",
          "LOYAL-018",
          "LOYAL-019",
          "LOYAL-020",
          "LOYAL-021"
        ]
      },
      {
        "name": "Attention from others",
        "qids": [
          "LOYAL-010",
          "LOYAL-022",
          "LOYAL-012",
          "LOYAL-013",
          "LOYAL-015",
          "LOYAL-011",
          "LOYAL-017"
        ]
      },
      {
        "name": "Guarding the line",
        "qids": [
          "LOYAL-023",
          "LOYAL-024",
          "LOYAL-025",
          "LOYAL-026",
          "LOYAL-027",
          "LOYAL-028",
          "LOYAL-029"
        ]
      }
    ],
    "questions": [
      {
        "id": "LOYAL-009",
        "q": "Are you the jealous type?",
        "type": "scale",
        "depth": 1,
        "note": "The warm-up. Self-rated, disarming, and it sets up everything else in the deck.",
        "guessable": true,
        "core": true,
        "lo": "Not at all",
        "hi": "Very"
      },
      {
        "id": "LOYAL-016",
        "q": "How much reassurance do you need to feel secure?",
        "type": "scale",
        "depth": 3,
        "note": "The security axis, entirely missing from the bank. A high-reassurance partner and a low-reassurance partner is a workable marriage — but only if they both know.",
        "guessable": true,
        "lo": "Very little",
        "hi": "Quite a lot"
      },
      {
        "id": "LOYAL-005",
        "q": "How open should our phones be to each other?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces expectations about privacy and openness with devices.",
        "guessable": true,
        "core": true,
        "lo": "Phones stay private",
        "hi": "Full access to each other"
      },
      {
        "id": "LOYAL-018",
        "q": "How open should our social media be to each other?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Keep our profiles private",
        "hi": "Fully open to each other"
      },
      {
        "id": "LOYAL-019",
        "q": "How much privacy is healthy in a marriage?",
        "type": "scale",
        "depth": 4,
        "note": "Surfaces transparency vs privacy expectations.",
        "guessable": true,
        "lo": "Total transparency",
        "hi": "Plenty can stay private"
      },
      {
        "id": "LOYAL-020",
        "q": "Which of these feels most okay to keep to yourself in marriage?",
        "type": "mc",
        "depth": 4,
        "note": "Makes CONF-015's abstract privacy scale concrete. The reveal is which specific thing each names — far more useful than a number.",
        "guessable": true,
        "core": true,
        "opts": [
          "Nothing: full openness",
          "My private thoughts and prayers",
          "My past",
          "My friendships and conversations",
          "My money"
        ]
      },
      {
        "id": "LOYAL-021",
        "q": "How comfortable are you with your partner taking a trip with friends without you?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "lo": "Not comfortable at all",
        "hi": "Completely comfortable",
        "steps": [
          "Not comfortable at all",
          "Slightly uncomfortable",
          "It depends on the trip",
          "Mostly comfortable",
          "Completely comfortable"
        ]
      },
      {
        "id": "LOYAL-010",
        "q": "Who'd get more attention in a room full of strangers?",
        "type": "mc",
        "depth": 1,
        "note": "HHB warm-up with a real edge under it — this is the deck about attention, after all.",
        "guessable": true,
        "who": true,
        "opts": [
          "{A}",
          "{B}",
          "About the same",
          "Neither of us, thankfully"
        ]
      },
      {
        "id": "LOYAL-022",
        "q": "How comfortable are you with your partner having close friendships with people of the opposite sex?",
        "type": "scale",
        "depth": 2,
        "guessable": true,
        "core": true,
        "lo": "Not comfortable at all",
        "hi": "Completely comfortable",
        "steps": [
          "Not comfortable at all",
          "Slightly uncomfortable",
          "It depends on the friendship",
          "Mostly comfortable",
          "Completely comfortable"
        ]
      },
      {
        "id": "LOYAL-012",
        "q": "If someone at work was clearly flirting with you, what would you do?",
        "type": "mc",
        "depth": 4,
        "note": "Behavioural rather than principled. INT-004 asks where the line is; this asks what you'd actually do standing on it.",
        "guessable": true,
        "core": true,
        "opts": [
          "Shut it down immediately",
          "Keep it professional and say nothing",
          "Tell you about it that evening",
          "Enjoy it a bit, honestly"
        ]
      },
      {
        "id": "LOYAL-013",
        "q": "Would you tell me if you found someone else attractive?",
        "type": "mc",
        "depth": 4,
        "note": "The honesty-versus-kindness trade-off, made concrete. Both answers are defensible, which is what makes the gap worth talking about.",
        "guessable": true,
        "opts": [
          "Always",
          "Only if it was becoming a problem",
          "No: it would only hurt you",
          "There'd be nothing to tell"
        ]
      },
      {
        "id": "LOYAL-015",
        "q": "What would you do if you saw me being a bit too friendly with someone?",
        "type": "mc",
        "depth": 4,
        "note": "The other side of the deck: not what you'd do, but what you'd do about me. 'Say nothing but feel it' is the answer that predicts trouble.",
        "guessable": true,
        "opts": [
          "Say something to you that night",
          "Wait and see if it carried on",
          "Say nothing, but feel it",
          "Say something to them"
        ]
      },
      {
        "id": "LOYAL-011",
        "q": "Is an emotional affair as bad as a physical one?",
        "type": "scale",
        "depth": 3,
        "note": "A genuine divider that the bank never asks. Couples routinely assume they agree here and routinely don't.",
        "guessable": true,
        "core": true,
        "lo": "Physical is far worse",
        "hi": "Emotional is far worse"
      },
      {
        "id": "LOYAL-017",
        "q": "Rank what would feel most like a betrayal.",
        "type": "rank",
        "depth": 4,
        "note": "The best question in the deck. Forces a comparison nobody makes voluntarily — is porn worse than confiding in someone else, is hidden money worse than a kiss. Two very different lists is the conversation.",
        "core": true,
        "opts": [
          "A physical affair",
          "An emotional affair",
          "Hiding money from me",
          "Confiding in someone else instead of me",
          "Looking at porn",
          "Repeatedly lying about small things"
        ]
      },
      {
        "id": "LOYAL-023",
        "q": "Where would you first consider someone to have crossed a line of faithfulness in marriage?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Deliberately flirting with someone else",
          "Building a private emotional closeness that is hidden from their spouse",
          "Sending romantic or sexual messages",
          "Kissing someone else",
          "Sexual touching or sexual activity",
          "Only having sex with someone else"
        ]
      },
      {
        "id": "LOYAL-024",
        "q": "Is a secret emotional relationship with someone else cheating, even if nothing physical happens?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Yes, definitely",
          "Usually yes",
          "It would depend on the relationship",
          "No, not unless it became physical",
          "I'm unsure"
        ]
      },
      {
        "id": "LOYAL-025",
        "q": "What is your conviction about pornography within marriage?",
        "type": "mc",
        "depth": 5,
        "core": true,
        "opts": [
          "It is sinful and should have no place in marriage",
          "It is wrong and damaging to a marriage",
          "I dislike it, but wouldn't treat all use as a serious moral issue",
          "I think it can be acceptable if both spouses agree",
          "I'm unsure what I believe"
        ]
      },
      {
        "id": "LOYAL-026",
        "q": "Would you personally consider pornography use to be a form of sexual unfaithfulness?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Yes, definitely",
          "In most circumstances",
          "It depends on the situation or frequency",
          "No, although it could still damage the marriage",
          "No, I don't see it as a major issue"
        ]
      },
      {
        "id": "LOYAL-027",
        "q": "If one of us used pornography or was struggling with it, how much would you want disclosed?",
        "type": "mc",
        "depth": 5,
        "guessable": true,
        "opts": [
          "Tell each other immediately, even after one incident",
          "Tell each other if it becomes a repeated struggle",
          "Tell the partner and also seek accountability",
          "Deal with it first through a pastor, mentor or accountability partner",
          "I wouldn't expect every struggle to be disclosed",
          "I'm unsure"
        ]
      },
      {
        "id": "LOYAL-028",
        "q": "If one of us was repeatedly struggling with sexual temptation, what should our first response be?",
        "type": "mc",
        "depth": 5,
        "ref": "Galatians 6:1-2",
        "guessable": true,
        "opts": [
          "Tell each other honestly and work through it together",
          "Tell each other and also involve a trusted Christian mentor or accountability partner",
          "Seek outside accountability first, then tell the partner if the struggle continues",
          "Handle it privately unless it starts affecting the relationship",
          "I'm unsure"
        ]
      },
      {
        "id": "LOYAL-029",
        "q": "How important is it that we each have someone outside the marriage to keep us accountable sexually?",
        "type": "scale",
        "depth": 5,
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential",
        "steps": [
          "Not important",
          "Slightly important",
          "Helpful but not necessary",
          "Very important",
          "Essential"
        ]
      }
    ]
  },
  "where-we-are-now": {
    "name": "Where We Are Now",
    "color": "#9C4A6E",
    "icon": "compass",
    "hook": {
      "id": "NOW-025",
      "q": "When did we last properly laugh together?"
    },
    "parts": [
      {
        "name": "How we’re doing",
        "qids": [
          "NOW-025",
          "NOW-026",
          "NOW-027",
          "NOW-022",
          "NOW-002",
          "NOW-001",
          "NOW-019"
        ]
      },
      {
        "name": "Seen and understood",
        "qids": [
          "NOW-003",
          "NOW-005",
          "NOW-028",
          "NOW-029",
          "NOW-009",
          "NOW-013",
          "NOW-012",
          "NOW-021"
        ]
      },
      {
        "name": "Making room for us",
        "qids": [
          "NOW-030",
          "NOW-031",
          "NOW-032",
          "NOW-033",
          "NOW-034",
          "NOW-010",
          "NOW-011"
        ]
      },
      {
        "name": "The honest questions",
        "qids": [
          "NOW-006",
          "NOW-007",
          "NOW-015",
          "NOW-017",
          "NOW-023",
          "NOW-020",
          "NOW-024"
        ]
      }
    ],
    "questions": [
      {
        "id": "NOW-025",
        "q": "When did we last properly laugh together?",
        "type": "mc",
        "depth": 1,
        "note": "The warm-up this deck badly needed, and quietly one of its best questions. Light to answer, and 'it's been a while' is a real finding sitting inside a soft question.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Today or yesterday",
          "Sometime this week",
          "I'd have to think about it",
          "It's been a while"
        ]
      },
      {
        "id": "NOW-026",
        "q": "What's been the best bit of the last month for us?",
        "type": "mc",
        "depth": 1,
        "note": "Warm, affirming, and the last option gives permission to be honest without having to make a speech about it.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Something we did together",
          "A conversation we had",
          "Just being around each other",
          "Honestly, it's been a bit of a slog"
        ]
      },
      {
        "id": "NOW-027",
        "q": "How often do we try something new together?",
        "type": "mc",
        "depth": 1,
        "note": "Novelty as an observable fact. Light, and it pairs with the momentum question deeper in the deck.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "All the time",
          "Now and then",
          "Rarely",
          "We're deep in a routine"
        ]
      },
      {
        "id": "NOW-022",
        "q": "Compared to six months ago, where are we?",
        "type": "mc",
        "depth": 3,
        "note": "Momentum rather than state. This is the question that makes the category worth re-taking — the answer is meaningless once and meaningful four times.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Much closer",
          "A bit closer",
          "About the same",
          "Drifting, if I'm honest"
        ]
      },
      {
        "id": "NOW-002",
        "q": "Right now, what is this?",
        "type": "mc",
        "depth": 3,
        "note": "A present-tense read on the thing itself. US-033 asks intent for the season; this asks what the relationship actually is at this moment, which is a different and often uncomfortable answer.",
        "guessable": true,
        "opts": [
          "Solid: it knows what it is",
          "Something real that's still finding its shape",
          "In transition: changing in ways neither of us controls",
          "Still deciding what we want it to be"
        ]
      },
      {
        "id": "NOW-001",
        "q": "How much has this relationship actually been tested?",
        "type": "mc",
        "depth": 3,
        "ref": "James 1:2-4",
        "note": "The most important question in the bank. Everything else assumes each person has evidence about the other; this asks whether that evidence exists. Two people answering 'not tested yet' is not alignment — it's the finding.",
        "guessable": true,
        "opts": [
          "We've been through something genuinely hard together",
          "We've had real arguments and come through them",
          "Some friction, nothing serious",
          "It's been smooth: we haven't been tested yet"
        ]
      },
      {
        "id": "NOW-019",
        "q": "After a disagreement, how long does it take us to be okay again?",
        "type": "mc",
        "depth": 3,
        "note": "Observed repair speed. CONF-002 asks how soon you like to resolve conflict — the preference. This is what actually happens between the two of you.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Minutes",
          "A few hours",
          "A day or two",
          "We don't really close things, they fade"
        ]
      },
      {
        "id": "NOW-003",
        "q": "How well do you feel understood by me?",
        "type": "scale",
        "depth": 4,
        "note": "Being known, rated by the one being known. A gap here — one feels deeply understood, the other doesn't — is one of the most useful reveals the app can produce.",
        "guessable": true,
        "notYet": true,
        "lo": "You see the surface",
        "hi": "You get the parts most people miss"
      },
      {
        "id": "NOW-005",
        "q": "Does the support between us flow both ways?",
        "type": "scale",
        "depth": 4,
        "ref": "Galatians 6:2",
        "note": "Deliberately not phrased as 'who gives more' — that version scores two people who both feel over-giving as perfectly aligned, which inverts the meaning.",
        "guessable": true,
        "notYet": true,
        "lo": "Mostly in one direction",
        "hi": "Evenly, both ways"
      },
      {
        "id": "NOW-028",
        "q": "How balanced does the give-and-take in our relationship feel to you right now?",
        "type": "scale",
        "depth": 4,
        "guessable": true,
        "mirror": true,
        "lo": "I give more",
        "hi": "You give more",
        "steps": [
          "I feel like I give significantly more",
          "I feel like I give somewhat more",
          "It feels fairly balanced",
          "I feel like you give somewhat more",
          "I feel like you give significantly more"
        ]
      },
      {
        "id": "NOW-029",
        "q": "Is there any area where the give-and-take between us currently feels uneven to you?",
        "type": "open",
        "depth": 4
      },
      {
        "id": "NOW-009",
        "q": "What does this relationship bring out in you?",
        "type": "mc",
        "depth": 3,
        "note": "Who you become in it, rather than what you believe about it. Generative rather than wounding — every option is a conversation, none is a verdict.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "More tender than I expected",
          "More guarded than I admit",
          "More demanding than I show",
          "More patient than I usually am",
          "More loyal than people realise"
        ]
      },
      {
        "id": "NOW-013",
        "q": "Does this relationship bring out more in you, or less?",
        "type": "scale",
        "depth": 5,
        "ref": "Proverbs 27:17",
        "note": "The heaviest question in the category and correctly placed last. A low answer from either side is the whole point of an app called Aligned.",
        "guessable": true,
        "notYet": true,
        "lo": "Less",
        "hi": "More",
        "steps": [
          "Less: I'm somehow smaller in it",
          "A little less",
          "About the same",
          "A little more",
          "More: I'm most myself in it"
        ]
      },
      {
        "id": "NOW-012",
        "q": "When something's clearly bothering me but I won't say what, you:",
        "type": "mc",
        "depth": 3,
        "note": "The pursue-or-withdraw move, as behaviour. Pairs with the CONF question about how my going quiet lands on you — that one is the feeling, this is what you actually do about it.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Ask directly",
          "Create space and wait for me",
          "Feel frustrated but don't push",
          "Assume it'll surface when I'm ready"
        ]
      },
      {
        "id": "NOW-021",
        "q": "Are we the same together in private as we are in front of other people?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 10:9",
        "note": "SELF-026 asks whether an individual is consistent across audiences. This asks it of the couple, which is a different and more uncomfortable question.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Exactly the same",
          "A bit more relaxed on our own",
          "Quite different",
          "We perform a bit when others are around"
        ]
      },
      {
        "id": "NOW-030",
        "q": "How much room does your life have right now for this to grow?",
        "type": "scale",
        "depth": 3,
        "note": "Present-tense capacity. US-033 asks intent; nothing in the bank asks whether the person actually has the bandwidth to act on it.",
        "guessable": true,
        "lo": "I'm stretched thin",
        "hi": "Plenty of room"
      },
      {
        "id": "NOW-031",
        "q": "Rank where your emotional energy actually goes right now.",
        "type": "rank",
        "depth": 4,
        "note": "US-032 ranks what should come first — the ideal. This ranks what is. The gap between a person's two answers is the honest conversation, and 'just keeping myself going' is the option that makes it possible to admit.",
        "opts": [
          "Work",
          "Family",
          "Friends",
          "Church or ministry",
          "This relationship",
          "Just keeping myself going"
        ]
      },
      {
        "id": "NOW-032",
        "q": "If your life is too full right now, what would you actually cut to make room for us?",
        "type": "mc",
        "depth": 4,
        "ref": "Philippians 2:4",
        "note": "Turns a vague 'I'd prioritise you' into a real trade-off. Naming ministry as a competing good is deliberate — it's the hardest option to pick and the most revealing.",
        "guessable": true,
        "opts": [
          "Work hours",
          "Time with friends",
          "Ministry or serving",
          "Hobbies and downtime",
          "Nothing: I'd find the time somewhere"
        ]
      },
      {
        "id": "NOW-033",
        "q": "Which is harder for you to give right now?",
        "type": "mc",
        "depth": 4,
        "note": "Time and energy are different scarcities and the bank conflates them. Someone with a free diary and nothing left in the tank is the harder case, and the one nobody names.",
        "guessable": true,
        "opts": [
          "Time",
          "Emotional energy",
          "Neither: I have both",
          "Both are stretched"
        ]
      },
      {
        "id": "NOW-034",
        "q": "Wanting to invest in us, and being able to right now, which is truer for you?",
        "type": "mc",
        "depth": 4,
        "note": "The desire-versus-capacity gap named directly. Option three is the one that surfaces a conversation nothing else in the bank reaches.",
        "guessable": true,
        "opts": [
          "I want to and I can",
          "I want to but life is full",
          "I have the time but I'm holding back",
          "Neither, right now"
        ]
      },
      {
        "id": "NOW-010",
        "q": "How steady is your emotional availability here?",
        "type": "mc",
        "depth": 4,
        "note": "'Restrained by habit' names something people recognise instantly and would never say out loud. That recognition is the value.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "High: I show up fully when you need me",
          "Conditional: it depends where I am mentally",
          "Restrained: I keep some distance by habit",
          "Variable: it shifts more than I'd like"
        ]
      },
      {
        "id": "NOW-011",
        "q": "When you sense I'm not fully present with you, what do you do?",
        "type": "mc",
        "depth": 4,
        "note": "Protest behaviour. The last two options are the start of a withdrawal spiral, and a couple who both pick them has found something no belief question would ever surface.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Say something: I'd rather name it",
          "Give you space, you might need it",
          "Feel it but stay quiet, I don't want to be demanding",
          "Pull back too"
        ]
      },
      {
        "id": "NOW-006",
        "q": "When things are hardest between us, what is usually at the root of it?",
        "type": "mc",
        "depth": 4,
        "note": "Root cause rather than conflict style. The last option is a deliberate honesty valve and pairs with NOW-001.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Expectations neither of us has said out loud",
          "Timing: we want different things at different moments",
          "Things get lost between what's meant and what's heard",
          "It hasn't been genuinely hard yet"
        ]
      },
      {
        "id": "NOW-007",
        "q": "Rank what would most seriously threaten us.",
        "type": "rank",
        "depth": 4,
        "note": "A threat model both build separately. DEAL-001 ranks deal-breakers in a partner; this ranks what could break the two of you. The faith option is the localisation the source didn't have.",
        "notYet": true,
        "opts": [
          "A breach of trust",
          "Slowly growing in different directions",
          "One of us needing more than the other can give",
          "Outside pressure: money, family, work",
          "Drifting apart in our faith"
        ]
      },
      {
        "id": "NOW-015",
        "q": "What is trust between us currently built on?",
        "type": "mc",
        "depth": 4,
        "note": "Trust as a present-tense structure rather than a value. 'Hope more than evidence' is where a lot of engaged couples honestly are, and no question in the bank lets them say it.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Track record: you've proven it",
          "What I believe about your character",
          "Hope and faith more than evidence",
          "It isn't fully there yet"
        ]
      },
      {
        "id": "NOW-017",
        "q": "What have we avoided talking about?",
        "type": "mc",
        "depth": 4,
        "note": "An avoidance map. If both name the same thing, that's the next conversation handed to them. If they name different things, that's two.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Nothing I can think of",
          "Money",
          "Family",
          "The physical side",
          "The future",
          "Something one of us did"
        ]
      },
      {
        "id": "NOW-023",
        "q": "When did you last feel far from me?",
        "type": "mc",
        "depth": 4,
        "note": "Distance as an event with a date, not a rating. 'Recently, and it hasn't passed' is a live issue the app just found.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "I can't remember feeling far from you",
          "Recently, but it passed",
          "Recently, and it hasn't passed",
          "Often, honestly"
        ]
      },
      {
        "id": "NOW-020",
        "q": "How often do you have doubts about us?",
        "type": "scale",
        "depth": 5,
        "note": "US-007 measures confidence you'd go the distance. This measures frequency of doubt, which is a different thing — people can be confident overall and still wobble weekly.",
        "guessable": true,
        "notYet": true,
        "lo": "Almost never",
        "hi": "Often"
      },
      {
        "id": "NOW-024",
        "q": "If this ended tomorrow, your honest first feeling would be:",
        "type": "mc",
        "depth": 5,
        "note": "The hardest question in the bank and the one the tagline exists for. Sad relief is a real answer that thousands of people carry into weddings because nobody ever asked.",
        "guessable": true,
        "opts": [
          "Devastated",
          "Grief, but I'd be okay",
          "Sad, with some relief",
          "I genuinely don't know"
        ]
      }
    ]
  }
};
