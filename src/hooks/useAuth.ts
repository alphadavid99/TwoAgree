import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";
import { markReturning } from "../lib/local";

// Wraps onAuthStateChanged. `loading` is true until Firebase reports the first
// auth state, so callers can show a boot spinner instead of flashing the
// sign-in screen for already-signed-in users.
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u) markReturning(); // this device has signed in before
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
