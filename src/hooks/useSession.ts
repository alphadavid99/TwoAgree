import { useEffect, useMemo, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import type { Session } from "../types";
import type { Role } from "../lib/scoring";
import { mergePrivate, unpublished, type PrivateSpace } from "../lib/privacy";
import { markStepDone, requestPublish } from "../lib/session";
import { orderedSteps, stepDoneBy } from "../lib/path";

// Live subscription to sessions/{code}. Replaces the legacy 1.5s REST polling.
// `role` is derived from which member slot holds the current uid.
//
// Your own answers live in private/{uid}/{code} until the part opens for both
// of you (src/lib/privacy.ts), so this listens to both and merges them: every
// screen sees your answers under your role, your partner's once published.
export function useSession(code: string | null, uid: string | undefined) {
  const [shared, setShared] = useState<Session | null>(null);
  const [mine, setMine] = useState<PrivateSpace | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!code) {
      setShared(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setDenied(false);
    return onValue(
      ref(db, `sessions/${code}`),
      (snap) => {
        setShared((snap.val() as Session | null) ?? null);
        setLoading(false);
      },
      () => {
        // Permission denied (not a member) or network error.
        setDenied(true);
        setLoading(false);
      },
    );
  }, [code]);

  useEffect(() => {
    setMine(null);
    if (!code || !uid) return;
    return onValue(
      ref(db, `private/${uid}/${code}`),
      (snap) => setMine((snap.val() as PrivateSpace | null) ?? null),
      () => setMine(null),
    );
  }, [code, uid]);

  let role: Role | null = null;
  if (shared?.members && uid) {
    if (shared.members.host?.uid === uid) role = "host";
    else if (shared.members.guest?.uid === uid) role = "guest";
  }

  const session = useMemo(() => mergePrivate(shared, mine, role), [shared, mine, role]);

  // A part you've both finished that the server hasn't published (the second
  // phone went offline before it could ask): ask once per part per visit.
  const asked = useRef(new Set<string>());
  useEffect(() => {
    if (!code || !role) return;
    for (const part of unpublished(shared)) {
      const key = `${code}|${JSON.stringify(part)}`;
      if (asked.current.has(key)) continue;
      asked.current.add(key);
      void requestPublish(code, part);
    }
  }, [code, role, shared]);

  // A Path step you've answered every question of gets your "walked" flag —
  // the step's equivalent of finishing a part, and what lets it publish.
  // Here rather than in the step screen so leaving early can't skip it.
  const marked = useRef(new Set<string>());
  useEffect(() => {
    if (!code || !role || !session) return;
    for (const { index, data } of orderedSteps(session)) {
      if (session.pathDone?.[String(index)]?.[role] === true) continue;
      if (!stepDoneBy(session, data, role)) continue;
      const key = `${code}|${index}`;
      if (marked.current.has(key)) continue;
      marked.current.add(key);
      void markStepDone(code, index, role).catch(() => marked.current.delete(key));
    }
  }, [code, role, session]);

  return { session, role, loading, denied };
}
