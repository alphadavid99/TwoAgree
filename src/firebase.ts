// Firebase modular SDK bootstrap.
// Config comes from Vite env (VITE_FIREBASE_*), loaded from .env.local locally
// and from the build environment in CI. These values are public by design.
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  connectAuthEmulator,
  GoogleAuthProvider,
} from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { isNativePlatform } from "./lib/device/platform";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

// Auth storage differs by platform. getAuth() picks browser defaults that
// assume an http(s) origin; inside the native shell the page is served from
// capacitor://localhost, where that probe never settles and
// onAuthStateChanged's first callback never fires — the app sits on
// "Checking your account…" forever. IndexedDB persistence works under the
// custom scheme and keeps the session across launches. Web is unchanged.
export const auth = isNativePlatform()
  ? initializeAuth(app, { persistence: indexedDBLocalPersistence })
  : getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

// Local dev talks to the Emulator Suite. Gated on import.meta.env.DEV so a
// production build (where DEV is false) can never point at localhost, no matter
// what .env.local says. Set VITE_USE_EMULATORS=false to dev against live data.
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS !== "false") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectDatabaseEmulator(db, "127.0.0.1", 9000);
}
