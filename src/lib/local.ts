// Tiny localStorage helpers for per-user client state (active session + deck).
// Keyed by uid so switching accounts on one device stays separate.

const activeKey = (uid: string) => `aligned_active_${uid}`;

export function getActiveCode(uid: string): string | null {
  return localStorage.getItem(activeKey(uid));
}

export function setActiveCode(uid: string, code: string): void {
  localStorage.setItem(activeKey(uid), code);
}

export function clearActiveCode(uid: string): void {
  localStorage.removeItem(activeKey(uid));
}

// The conversation this couple last opened, so Home can honour its own promise
// ("Where you left off, together") after a reload instead of resetting to the
// first deck in the bank. Keyed by uid + code: one person can hold sessions
// with different partners on one device.
const lastDeckKey = (uid: string, code: string) => `aligned_deck_${uid}_${code}`;

export function getLastDeck(uid: string, code: string): string | null {
  return localStorage.getItem(lastDeckKey(uid, code));
}

export function setLastDeck(uid: string, code: string, slug: string): void {
  localStorage.setItem(lastDeckKey(uid, code), slug);
}

// Which reveals this person has already opened, so Home can herald the ones
// they haven't. Per device: it's a "have you seen this yet" nicety, not shared
// couple state, and getting it wrong only costs a card that shouldn't show.
const seenKey = (uid: string, code: string) => `aligned_seen_${uid}_${code}`;

export function getSeenReveals(uid: string, code: string): string[] {
  try {
    const raw = localStorage.getItem(seenKey(uid, code));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markRevealSeen(uid: string, code: string, key: string): void {
  try {
    const seen = getSeenReveals(uid, code);
    if (seen.includes(key)) return;
    // Keep the list bounded — the bank has 21 decks, so 60 is generous.
    localStorage.setItem(seenKey(uid, code), JSON.stringify([...seen, key].slice(-60)));
  } catch {
    /* storage blocked — the herald just reappears, which is harmless */
  }
}

// ---- Onboarding checkpoint -------------------------------------------------
// Onboarding held its whole flow in component state, so any reload restarted it
// from zero. For the initiator that meant re-consenting and creating a DUPLICATE
// session, orphaning the answers already banked. For the invitee it was worse:
// redeemInvite burns the token, so a reload re-entered the flow and then failed
// with "this invite link is invalid or already used" — while they were in fact
// already seated. The checkpoint is written as each step completes and cleared
// when onboarding hands off.
export type OnbCheckpoint = {
  flow: "a" | "b";
  step: string;
  code?: string;
  role?: "host" | "guest";
  myName?: string;
  partnerName?: string;
  stage?: string;
  initiatorName?: string;
};

const onbKey = (uid: string) => `aligned_onb_${uid}`;

export function getOnbCheckpoint(uid: string): OnbCheckpoint | null {
  try {
    const raw = localStorage.getItem(onbKey(uid));
    return raw ? (JSON.parse(raw) as OnbCheckpoint) : null;
  } catch {
    return null; // corrupt entry — start clean rather than crash the front door
  }
}

export function setOnbCheckpoint(uid: string, cp: OnbCheckpoint): void {
  try {
    localStorage.setItem(onbKey(uid), JSON.stringify(cp));
  } catch {
    /* storage full or blocked — resuming is a nicety, never a blocker */
  }
}

export function clearOnbCheckpoint(uid: string): void {
  localStorage.removeItem(onbKey(uid));
}

// ---- Path lamps already witnessed ------------------------------------------
// The lamp is shared couple state, so the second partner to finish a waypoint
// arrived at a screen that was already lit and static — they never got the
// ceremony at all. The lighting moment is therefore gated per-person on this
// flag rather than on the shared lamp. Keyed by code + role (one device can
// hold both sides of a session during testing); losing it only costs a repeat
// of a moment the person liked.
const lampKey = (code: string, role: string) => `aligned_lamps_${code}_${role}`;

export function seenLamp(code: string, role: string, index: number): boolean {
  try {
    const raw = localStorage.getItem(lampKey(code, role));
    return raw ? (JSON.parse(raw) as number[]).includes(index) : false;
  } catch {
    return false;
  }
}

export function markLampSeen(code: string, role: string, index: number): void {
  try {
    const raw = localStorage.getItem(lampKey(code, role));
    const seen = raw ? (JSON.parse(raw) as number[]) : [];
    if (seen.includes(index)) return;
    localStorage.setItem(lampKey(code, role), JSON.stringify([...seen, index]));
  } catch {
    /* storage blocked — the ceremony simply replays, which is harmless */
  }
}

// ---- Path intake draft -----------------------------------------------------
// The intake renders below a `key={tab}` remount, so tapping Decks mid-way and
// coming back wiped all eight answers with no warning — private questions the
// person had already thought about, gone. sessionStorage (not local): the draft
// is a within-visit convenience, and intake answers are the most sensitive
// thing the app holds, so they should not outlive the tab.
export type IntakeDraft = { idx: number; ans: (number | number[] | null)[] };

const intakeKey = (uid: string) => `aligned_intake_${uid}`;

export function readIntakeDraft(uid: string): IntakeDraft | null {
  try {
    const raw = sessionStorage.getItem(intakeKey(uid));
    if (!raw) return null;
    const d = JSON.parse(raw) as IntakeDraft;
    return Array.isArray(d?.ans) && typeof d.idx === "number" ? d : null;
  } catch {
    return null;
  }
}

export function writeIntakeDraft(uid: string, d: IntakeDraft): void {
  try {
    sessionStorage.setItem(intakeKey(uid), JSON.stringify(d));
  } catch {
    /* storage blocked — resuming is a nicety, never a blocker */
  }
}

export function clearIntakeDraft(uid: string): void {
  try {
    sessionStorage.removeItem(intakeKey(uid));
  } catch {
    /* nothing to do — the draft is superseded by the submitted intake */
  }
}

// Device-level flag: has anyone ever signed in on this browser? Lets the auth
// screen default returning users to "Sign in" instead of "Create account".
const RETURNING_KEY = "aligned_returning";

export function markReturning(): void {
  localStorage.setItem(RETURNING_KEY, "1");
}

export function hasReturned(): boolean {
  return localStorage.getItem(RETURNING_KEY) === "1";
}
