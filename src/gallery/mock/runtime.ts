// Shared state for the fake Firebase providers.
//
// Every frame in the gallery gets its own FrameRuntime (its own copy of the
// fixture database, its own signed-in user, its own callable behaviour), so
// tapping through one phone never changes another. The mocks are module
// singletons that the real screens import, so "which frame is calling?" is a
// global that the gallery sets before mounting a frame and again whenever the
// person interacts with one (see Frame.tsx).
import type { User } from 'firebase/auth'

/** Grep target for scripts/check-no-gallery.mjs — must never reach dist/. */
export const GALLERY_MARKER = 'twoagree-gallery-build-marker-7f3a'

export class GalleryFirebaseError extends Error {
  constructor(what: string) {
    super(
      `[gallery] ${what}. The gallery has no network: Firebase is a fake provider here. ` +
        `Add a fixture or a per-frame override instead of reaching out.`,
    )
    this.name = 'GalleryFirebaseError'
    recordViolation(this.message) // constructing one at all is a violation
  }
}

type Json = unknown
export type CallableHandler = (data: never) => Json | Promise<Json>

export type FrameRuntime = {
  id: string
  user: User | null
  /** Root of this frame's private copy of the fixture database. */
  db: Record<string, Json>
  listeners: Set<() => void>
  /** Database path prefixes whose reads never resolve (loading states). */
  pending: string[]
  /** Database path prefixes whose reads are permission-denied. */
  denied: string[]
  /** Database path prefixes whose writes are permission-denied. */
  deniedWrites: string[]
  callables: Record<string, CallableHandler>
  /** Auth calls: reject with this error code / never settle / auth never reports. */
  authError?: string
  authHang?: boolean
  authPending?: boolean
}

let active: FrameRuntime | null = null
export const setActiveFrame = (f: FrameRuntime | null) => {
  active = f
}
export const activeFrame = (): FrameRuntime | null => active
export function requireFrame(what: string): FrameRuntime {
  if (!active) throw new GalleryFirebaseError(`${what} called with no active frame`)
  return active
}

// ---- Violations: anything that tried to leave the page ---------------------
export type Violation = { at: number; frame: string; message: string }
const violations: Violation[] = []
const subs = new Set<() => void>()
export const getViolations = () => violations
export const subscribeViolations = (fn: () => void) => {
  subs.add(fn)
  return () => void subs.delete(fn)
}
export function recordViolation(message: string): void {
  violations.push({ at: Date.now(), frame: active?.id ?? '(no frame)', message })
  console.error(`[gallery] network/Firebase violation in ${active?.id ?? '?'}: ${message}`)
  subs.forEach((fn) => fn())
}
