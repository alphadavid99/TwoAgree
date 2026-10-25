// Session service — create/join and the answer/guess/done writes.
// The account graft (CLAUDE.md §6): a signed-in user's uid + profile name are
// written into the host/guest member slot so the host/guest scoring layer is
// untouched. Every write is a scalar leaf (never {}) so RTDB auto-creates
// intermediates — the hard-won gotcha in §6.
import { ref, update } from "firebase/database";
import { auth, db } from "../firebase";
import type { Role, AnswerValue } from "./scoring";
import type { Stage } from "../types";
import { track } from "./observability";
import { DECKS } from "./questions";
import { levelsOf } from "./leveling";
import type { PrivateKind } from "./privacy";
import { publishPart } from "./functions";

const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++)
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

// Host creates a session. Rules allow a write only to a brand-new code (or by a
// member), and deny reads of codes we're not in — so we can't pre-check. We
// just attempt the write and, on the rare collision with a live session (write
// denied), retry with a fresh code.
export async function createSession(
  uid: string,
  name: string,
  stage?: Stage,
): Promise<string> {
  for (let tries = 0; tries < 6; tries++) {
    const code = randCode();
    try {
      await update(ref(db, `sessions/${code}`), {
        created: Date.now(),
        // Only write stage when chosen — never a nullish leaf (RTDB gotcha §6).
        ...(stage ? { stage } : {}),
        "members/host/name": name,
        "members/host/uid": uid,
        [`uids/${uid}`]: true,
      });
      track("session created");
      return code;
    } catch {
      // code already taken by someone else's session — try another
    }
  }
  throw new Error("Couldn’t start a session: please try again.");
}

// Guest join is server-side now (joinByCode / redeemInvite callables) so the
// sessions write rule can stay locked to members. See src/lib/functions.ts.

// Article 9 consent (onboarding spec v2 §2). Its OWN node — never nested with
// anything else, so the faith-data consent is an unbundled, demonstrable record.
// Bump the version whenever the wording the person ticks changes.
export const CONSENT_VERSION = "2026-07-15";
export function recordConsent(uid: string): Promise<void> {
  return update(ref(db, `consents/${uid}`), {
    "article9/granted": true,
    "article9/version": CONSENT_VERSION,
    "article9/timestampMs": Date.now(),
  });
}

// Profile write — name at consent/sign-up; email + photo when the account is
// created at the invite gate (spec v2 §2, §7.4). Only scalar leaves, never {}.
export function writeProfile(
  uid: string,
  data: { name?: string; email?: string; photo?: string },
): Promise<void> {
  const patch: Record<string, string | number> = {};
  if (data.name != null) patch.name = data.name;
  if (data.email != null) patch.email = data.email;
  if (data.photo != null) patch.photo = data.photo;
  patch.updated = Date.now();
  return update(ref(db, `users/${uid}`), patch);
}

// Implementation intention (spec v2 §A6) — when the couple will sit down.
// Stored on the session (the couple), skippable, never nagged.
export function writeMeetAt(code: string, whenMs: number): Promise<void> {
  return update(ref(db, `sessions/${code}`), { meetAt: whenMs });
}

// ---- Answers, guesses, importance: private until the part opens ----------
// Each goes to the author's own private space (private/{uid}/{code}), which
// only they can read — not into the shared session, where the partner could
// read it early by going around the app. The server publishes a part into the
// shared session once both have finished it (see publishPart below and
// src/lib/privacy.ts). The "started" flag is shared so partner status
// ("Judah hasn't started this part yet") keeps working without any answers.

// qid → the part it belongs to, per deck (the Path's at-table deck has none).
const LEVEL_OF: Record<string, Record<string, number>> = {};
function levelOfQid(slug: string, qid: string): number | null {
  if (!DECKS[slug]) return null;
  if (!LEVEL_OF[slug]) {
    LEVEL_OF[slug] = {};
    levelsOf(slug).forEach((qs, l) => qs.forEach((q) => (LEVEL_OF[slug][q.id] = l)));
  }
  return LEVEL_OF[slug][qid] ?? null;
}

function myUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("You're signed out: sign in again to save your answer.");
  return uid;
}

function writePrivate(
  code: string,
  slug: string,
  kind: PrivateKind,
  qid: string,
  role: Role,
  value: AnswerValue,
): Promise<void> {
  const patch: Record<string, AnswerValue | boolean> = {
    [`private/${myUid()}/${code}/decks/${slug}/${kind}/${qid}`]: value,
  };
  const lvl = kind === "answers" ? levelOfQid(slug, qid) : null;
  if (lvl != null) patch[`sessions/${code}/decks/${slug}/started/${lvl}/${role}`] = true;
  return update(ref(db), patch);
}

export function writeAnswer(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  value: AnswerValue,
): Promise<void> {
  return writePrivate(code, slug, "answers", qid, role, value);
}

export function writeGuess(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  value: AnswerValue,
): Promise<void> {
  return writePrivate(code, slug, "guesses", qid, role, value);
}

// Importance rating (1..5) for the weighting layer. Asked only on tier-3 and
// DEAL-* questions (brief §2b); mirrors the answers/guesses write shape.
export function writeImportance(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  value: number,
): Promise<void> {
  return writePrivate(code, slug, "importance", qid, role, value);
}

// Ask the server to publish a part (or Path step) both of you have finished.
// Safe to call any time: it publishes only when both "done" flags are in, and
// re-publishing is a no-op. Never throws — a failure leaves the part
// unpublished, and the app asks again next time it sees it (useSession).
export async function requestPublish(
  code: string,
  part: { slug: string; level: number } | { step: number },
): Promise<boolean> {
  try {
    const res = await publishPart({ code, ...part });
    return res.data.status === "published";
  } catch {
    return false;
  }
}

// The talk loop (UX review §6). Pinning is per-partner but the LIST is shared:
// either of them flagging a question puts it on the couple's agenda. Closure
// needs both — one person deciding a conversation happened isn't the same as
// having had it. Scalar leaves only, per the RTDB gotcha in §6.
export function writeTalkPin(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  on: boolean,
): Promise<void> {
  return update(ref(db, `sessions/${code}/decks/${slug}/talks/${qid}/pinned`), {
    [role]: on,
  });
}

export function writeTalked(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  on: boolean,
): Promise<void> {
  return update(ref(db, `sessions/${code}/decks/${slug}/talks/${qid}/talked`), {
    [role]: on,
  });
}

// Finishing a part is when you agree to share it (recommendation 6). If your
// partner has already finished, this is the second "done": the part opens.
// `wait: false` returns once the flag is saved and publishes in the background
// (the question flow moves on at once; useSession re-asks if it didn't land).
export async function markLevelDone(
  code: string,
  slug: string,
  lvl: number,
  role: Role,
  { wait = true }: { wait?: boolean } = {},
): Promise<void> {
  track("part finished", { deck: slug, part: lvl + 1 });
  await update(ref(db, `sessions/${code}/decks/${slug}/done/${lvl}`), {
    [role]: true,
  });
  const published = requestPublish(code, { slug, level: lvl });
  if (wait) await published;
}

// The Path's equivalent: you've walked every question of step `index`.
export async function markStepDone(
  code: string,
  index: number,
  role: Role,
): Promise<void> {
  await update(ref(db, `sessions/${code}/pathDone/${index}`), { [role]: true });
  await requestPublish(code, { step: index });
}

// ---- The Path -------------------------------------------------------------
// Each partner's intake is private (intake/{uid}, author-only rules). Scalar
// leaves only, never {} (RTDB gotcha §6). `answers` is keyed by intake question
// id; single-select is a number, multi-select a number[] of option indices.
export function writeIntake(
  uid: string,
  answers: Record<string, number | number[]>,
): Promise<void> {
  // The event, never the answers — the intake is the most private thing here.
  track("path intake done");
  return update(ref(db, `intake/${uid}`), {
    updated: Date.now(),
    ...Object.fromEntries(
      Object.entries(answers).map(([k, v]) => [`answers/${k}`, v]),
    ),
  });
}

// Light a step's lamp — a shared couple milestone, writable by either member.
export function lightLamp(code: string, stepIndex: number): Promise<void> {
  track("lamp lit", { step: stepIndex + 1 });
  return update(ref(db, `sessions/${code}/pathLamps`), { [stepIndex]: true });
}
