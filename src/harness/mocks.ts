// Mock data for the screenshot harness. Builds a realistic Session from the
// REAL question bank so scoring/reveal screens show authentic content and a
// spread of verdicts (Agreed / Close / Worth a chat) and flags (blindSpot,
// unevenStakes). Nothing here touches Firebase.
import type { User } from "firebase/auth";
import type { Profile, Session, PathStepData } from "../types";
import type { DeckData, AnswerValue, Role } from "../lib/scoring";
import { DECKS } from "../lib/questions";
import { levelsOf } from "../lib/leveling";

export const HOST_NAME = "Sarah";
export const GUEST_NAME = "Judah";
export const PRIMARY_SLUG = "in-the-home";
export const MY_ROLE: Role = "host";

const OPEN_HOST =
  "I want us to keep praying together on the hard days, not just the easy ones.";
const OPEN_GUEST =
  "Honestly I picture Sunday mornings unhurried — coffee, church, then nowhere to be.";

// Build one deck's answer/guess/importance/done data with a deliberate spread of
// outcomes so the reveal breakdown isn't monotone.
function buildDeck(slug: string, revealLevels: number): DeckData {
  const qs = DECKS[slug]?.questions ?? [];
  const answers: Record<string, Partial<Record<Role, AnswerValue>>> = {};
  const guesses: Record<string, Partial<Record<Role, AnswerValue>>> = {};
  const importance: Record<string, Partial<Record<Role, number>>> = {};

  qs.forEach((q, i) => {
    const pattern = i % 4; // 0 agree · 1 close · 2 differ · 3 differ+blindSpot
    let host: AnswerValue;
    let guest: AnswerValue;

    if (q.type === "scale") {
      host = 3;
      guest = pattern === 0 ? 3 : pattern === 1 ? 4 : 5;
    } else if (q.type === "mc") {
      const n = q.opts?.length ?? 2;
      host = 0;
      guest = pattern === 0 ? 0 : Math.min(1, n - 1);
    } else if (q.type === "rank") {
      const n = q.opts?.length ?? 3;
      const asc = Array.from({ length: n }, (_, k) => k).join(",");
      const desc = Array.from({ length: n }, (_, k) => n - 1 - k).join(",");
      host = asc;
      guest = pattern === 0 ? asc : desc;
    } else {
      host = OPEN_HOST;
      guest = OPEN_GUEST;
    }
    answers[q.id] = { host, guest };

    // Predict-your-partner layer on guessable, scoreable questions.
    if (q.guessable && q.type !== "open") {
      if (pattern === 3) {
        // Each guessed the other would match themselves — a mutual miss on a
        // real difference → blindSpot.
        guesses[q.id] = { host, guest };
      } else {
        guesses[q.id] = { host: guest, guest: host }; // both guessed right
      }
    }

    // A couple of sharply uneven-stakes questions (gap >= 3).
    if (i % 6 === 5) importance[q.id] = { host: 5, guest: 1 };
  });

  const done: Record<string, Partial<Record<Role, boolean>>> = {};
  const levels = levelsOf(slug);
  for (let l = 0; l < Math.min(revealLevels, levels.length); l++) {
    done[String(l)] = { host: true, guest: true };
  }

  return { answers, guesses, importance, done };
}

// A signed-in couple mid-journey: some decks revealed, some in progress, some
// untouched — so Decks/Together lists show a spread of states.
export const MOCK_SESSION: Session = {
  created: 1_720_000_000_000,
  stage: "engaged",
  members: {
    host: { name: HOST_NAME, uid: "host-uid" },
    guest: { name: GUEST_NAME, uid: "guest-uid" },
  },
  uids: { "host-uid": true, "guest-uid": true },
  decks: {
    "in-the-home": buildDeck("in-the-home", 2),
    "finances-money": buildDeck("finances-money", 1),
    "faith-worship-practice": buildDeck("faith-worship-practice", 1),
    "fun-icebreakers": buildDeck("fun-icebreakers", 1),
    "conflict-communication": buildDeck("conflict-communication", 1),
  },
  path: {
    generatedAt: 1_720_100_000_000,
    version: 1,
    questionCount: 24,
    steps: {
      "0": { key: "0", mechanic: "guess", qids: ["HOME-001", "HOME-006", "HOME-010"] },
      "1": { key: "1", mechanic: "noguess", qids: ["FIN-001", "FIN-009"] },
      "2": { key: "2", mechanic: "guess", qids: ["FAITH-001", "FAITH-019"] },
      "3": { key: "3", mechanic: "guess", qids: ["CONF-001", "CONF-021"] },
      "4": { key: "4", mechanic: "noguess", qids: ["DREAM-001", "DREAM-002"] },
      "5": { key: "5", mechanic: "guess", qids: ["INT-001", "INT-019"] },
    },
  },
  pathLamps: { "0": true, "1": true },
};

export const PATH_STEPS: PathStepData[] = Object.values(
  MOCK_SESSION.path!.steps!,
);

// A 256px square avatar (SVG data URL renders fine in <img>); stands in for the
// base64 JPEG the real photo picker produces.
const AVATAR = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
     <rect width="256" height="256" fill="#3E1A2E"/>
     <circle cx="128" cy="104" r="46" fill="#E5A93C"/>
     <path d="M40 236c0-52 40-84 88-84s88 32 88 84z" fill="#E5A93C"/>
   </svg>`,
)}`;

export const MOCK_PROFILE: Profile = {
  name: HOST_NAME,
  bio: "Trainee midwife, hopeless with houseplants, always up for a late-night theology debate.",
  email: "sarah@example.com",
  photo: AVATAR,
  created: 1_715_000_000_000,
  updated: 1_720_000_000_000,
};

export const MOCK_USER = {
  uid: "host-uid",
  email: "sarah@example.com",
  displayName: HOST_NAME,
  emailVerified: true,
  isAnonymous: false,
  photoURL: null,
  phoneNumber: null,
  providerId: "firebase",
  metadata: { creationTime: "Fri, 01 Mar 2024 10:00:00 GMT", lastSignInTime: "" },
  providerData: [],
} as unknown as User;
