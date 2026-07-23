// Harness stub for "firebase/auth". AuthScreen/Onboarding import several auth
// helpers and call them on user action; here they're inert no-ops so the screen
// renders without a real Firebase Auth backend.
export const onAuthStateChanged = (
  _auth: unknown,
  cb: (u: unknown) => void,
) => {
  cb(null);
  return () => {};
};
export const signOut = async (..._args: unknown[]) => {};
export const signInWithEmailAndPassword = async (..._args: unknown[]) => ({});
export const createUserWithEmailAndPassword = async (..._args: unknown[]) => ({});
export const signInWithPopup = async (..._args: unknown[]) => ({});
export const signInAnonymously = async (..._args: unknown[]) => ({});
export const sendPasswordResetEmail = async (..._args: unknown[]) => {};
export const linkWithCredential = async (..._args: unknown[]) => ({});
export const linkWithPopup = async (..._args: unknown[]) => ({});
export const signInWithCredential = async (..._args: unknown[]) => ({});
export const updateProfile = async (..._args: unknown[]) => {};
export class OAuthProvider {
  constructor(_id?: string) {}
  credential(..._args: unknown[]) {
    return { __cred: true };
  }
  addScope() {}
  setCustomParameters() {}
}
export const EmailAuthProvider = {
  credential: (..._args: unknown[]) => ({ __cred: true }),
};
export class GoogleAuthProvider {
  addScope() {}
  setCustomParameters() {}
}
export const getAuth = (..._args: unknown[]) => ({ __stub: true, currentUser: null });
export const initializeAuth = (..._args: unknown[]) => ({
  __stub: true,
  currentUser: null,
});
export const connectAuthEmulator = (..._args: unknown[]) => {};
export const indexedDBLocalPersistence = { __persistence: true };
export const browserLocalPersistence = { __persistence: true };
