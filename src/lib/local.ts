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

// Device-level flag: has anyone ever signed in on this browser? Lets the auth
// screen default returning users to "Sign in" instead of "Create account".
const RETURNING_KEY = "aligned_returning";

export function markReturning(): void {
  localStorage.setItem(RETURNING_KEY, "1");
}

export function hasReturned(): boolean {
  return localStorage.getItem(RETURNING_KEY) === "1";
}
