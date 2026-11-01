// Doing a part together (feedback 23, reworked in 28). One partner invites the
// other to start the same part; the other gets a pop-up while it's fresh, and
// the invite then waits in "For you" until they start it, the sender takes it
// back, or it's a fortnight old. "Not right now" keeps it (status "later") and
// tells the sender so, rather than throwing it away.
//
// One invite per part (sessions/{code}/invites/{slug~level}); asking again for
// the same part replaces it. Replies keep the invite's own fields, and the
// database rules hold both partners to that (database.rules.json, "invites").
import { ref, set, serverTimestamp } from "firebase/database";
import { db } from "../firebase";
import type { Role } from "./scoring";
import type { Session } from "../types";

export type InviteStatus = "asked" | "later" | "accepted" | "cancelled";

export interface Invite {
  from: Role;
  slug: string;
  level: number;
  status: InviteStatus;
  /** Server time it was sent, ms. */
  at: number;
}

/** The pop-up only greets an invite this fresh. */
export const POPUP_MS = 10 * 60 * 1000;
/** An unanswered invite waits this long in For you. */
export const KEEP_MS = 14 * 24 * 60 * 60 * 1000;

export const inviteKey = (slug: string, level: number) => `${slug}~${level}`;

export const invitesOf = (s: Session | null | undefined): Invite[] =>
  Object.values(s?.invites ?? {}).filter((i): i is Invite => !!i && typeof i.slug === "string");

export const inviteFor = (s: Session | null | undefined, slug: string, level: number): Invite | undefined =>
  s?.invites?.[inviteKey(slug, level)];

/** Still open: not yet started, not taken back, not too old. */
export const isWaiting = (i: Invite | null | undefined, now: number): i is Invite =>
  !!i && (i.status === "asked" || i.status === "later") && now - i.at < KEEP_MS;

/** Just sent to you: the pop-up. */
export const isFresh = (i: Invite | null | undefined, role: Role, now: number): i is Invite =>
  !!i && i.status === "asked" && i.from !== role && now - i.at < POPUP_MS;

export function sendInvite(code: string, from: Role, slug: string, level: number): Promise<void> {
  return set(ref(db, `sessions/${code}/invites/${inviteKey(slug, level)}`), {
    from,
    slug,
    level,
    status: "asked",
    at: serverTimestamp(),
  });
}

/** Start it or keep it for later (the partner), or take it back (the sender). */
export function replyInvite(code: string, i: Invite, status: Exclude<InviteStatus, "asked">): Promise<void> {
  return set(ref(db, `sessions/${code}/invites/${inviteKey(i.slug, i.level)}`), {
    from: i.from,
    slug: i.slug,
    level: i.level,
    status,
    at: i.at,
  });
}
