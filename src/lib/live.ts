// "Do this part together, now" (feedback 23). One partner asks the other to
// start the same part at the same time; the other gets an in-app request and
// says Start now or Not right now. Nothing else is synced: each answers at
// their own pace, privately, and the reveal works as before.
//
// One request lives on the session at a time (sessions/{code}/live). A new
// request replaces the old one; replies keep the request's own fields, and
// the database rules hold both to that (database.rules.json, "live").
import { ref, set, serverTimestamp } from "firebase/database";
import { db } from "../firebase";
import type { Role } from "./scoring";

export type LiveStatus = "asked" | "accepted" | "declined" | "cancelled";

export interface LiveRequest {
  from: Role;
  slug: string;
  level: number;
  status: LiveStatus;
  /** Server time it was asked, ms. */
  at: number;
}

/** A request stays open this long, so it never hangs about. */
export const LIVE_OPEN_MS = 10 * 60 * 1000;

export const isOpen = (r: LiveRequest | null | undefined, now: number): r is LiveRequest =>
  !!r && r.status === "asked" && now - r.at < LIVE_OPEN_MS;

/** A request from your partner that you haven't answered yet. */
export const incoming = (r: LiveRequest | null | undefined, role: Role, now: number): r is LiveRequest =>
  isOpen(r, now) && r.from !== role;

const node = (code: string) => ref(db, `sessions/${code}/live`);

export function askLive(code: string, from: Role, slug: string, level: number): Promise<void> {
  return set(node(code), { from, slug, level, status: "asked", at: serverTimestamp() });
}

/** Say yes or not now (the partner), or take it back (the asker). */
export function replyLive(code: string, r: LiveRequest, status: Exclude<LiveStatus, "asked">): Promise<void> {
  return set(node(code), { from: r.from, slug: r.slug, level: r.level, status, at: r.at });
}
