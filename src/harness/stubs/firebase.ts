// Harness stub for ../firebase — inert app/auth/db so nothing touches the
// network. Real firebase/database & firebase/auth are also stubbed (see the
// resolveId plugin in vite.harness.config.ts), so these objects are never
// actually dereferenced by the SDK.
export const app = { __stub: true };
export const auth = { __stub: true, currentUser: null };
export const db = { __stub: true };
export const googleProvider = { __stub: true };
