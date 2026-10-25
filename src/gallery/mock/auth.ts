// Fake firebase/auth. Resolves instantly with the frame's fictional user, or
// fails/hangs on demand so error and busy states can be shown.
import type { User } from 'firebase/auth'
import { GalleryFirebaseError, activeFrame, requireFrame, type FrameRuntime } from './runtime'

const authObject = {
  __gallery: true,
  get currentUser(): User | null {
    return activeFrame()?.user ?? null
  },
}

export const getAuth = (_app?: unknown) => authObject
export const initializeAuth = getAuth
export const indexedDBLocalPersistence = { type: 'gallery-fake' }
export const connectAuthEmulator = (..._a: unknown[]) => {}

export function onAuthStateChanged(_auth: unknown, cb: (u: User | null) => void) {
  const frame = requireFrame('onAuthStateChanged')
  let live = true
  if (!frame.authPending) setTimeout(() => live && cb(frame.user), 0)
  return () => {
    live = false
  }
}

async function credentialCall(what: string): Promise<{ user: User }> {
  const frame: FrameRuntime = requireFrame(what)
  if (frame.authHang) return new Promise<never>(() => {})
  if (frame.authError) {
    throw Object.assign(new Error(`Firebase: Error (${frame.authError}).`), {
      code: frame.authError,
    })
  }
  if (!frame.user) throw new GalleryFirebaseError(`${what} succeeded with no fixture user`)
  return { user: frame.user }
}

export const signInAnonymously = (_a: unknown) => credentialCall('signInAnonymously')
export const signInWithEmailAndPassword = (..._a: unknown[]) =>
  credentialCall('signInWithEmailAndPassword')
export const createUserWithEmailAndPassword = (..._a: unknown[]) =>
  credentialCall('createUserWithEmailAndPassword')
export const signInWithPopup = (..._a: unknown[]) => credentialCall('signInWithPopup')
export const linkWithPopup = (..._a: unknown[]) => credentialCall('linkWithPopup')
export const signInWithCredential = (..._a: unknown[]) => credentialCall('signInWithCredential')
export const linkWithCredential = (..._a: unknown[]) => credentialCall('linkWithCredential')
export async function sendPasswordResetEmail(..._a: unknown[]): Promise<void> {
  const frame = requireFrame('sendPasswordResetEmail')
  if (frame.authHang) return new Promise<never>(() => {})
  if (frame.authError) throw Object.assign(new Error(frame.authError), { code: frame.authError })
}
export async function signOut(_a: unknown): Promise<void> {
  requireFrame('signOut') // a no-op: frames are static screens
}

export class GoogleAuthProvider {
  static credential(idToken?: string, accessToken?: string) {
    return { providerId: 'google.com', idToken, accessToken }
  }
}
export class OAuthProvider {
  providerId: string
  constructor(providerId: string) {
    this.providerId = providerId
  }
  credential(_o: unknown) {
    return { providerId: this.providerId }
  }
}
export const EmailAuthProvider = {
  credential: (email: string, _pw: string) => ({ providerId: 'password', email }),
}
