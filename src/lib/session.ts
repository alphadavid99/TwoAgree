// Session service — create/join and the answer/guess/done writes.
// The account graft (CLAUDE.md §6): a signed-in user's uid + profile name are
// written into the host/guest member slot so the host/guest scoring layer is
// untouched. Every write is a scalar leaf (never {}) so RTDB auto-creates
// intermediates — the hard-won gotcha in §6.
import { ref, update } from "firebase/database";
import { db } from "../firebase";
import type { Role, AnswerValue } from "./scoring";

const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++)
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

// Host creates a session. Rules allow a write only to a brand-new code (or by a
// member), and deny reads of codes we're not in — so we can't pre-check. We
// just attempt the write and, on the rare collision with a live session (write
// denied), retry with a fresh code.
export async function createSession(
  uid: string,
  name: string,
): Promise<string> {
  for (let tries = 0; tries < 6; tries++) {
    const code = randCode();
    try {
      await update(ref(db, `sessions/${code}`), {
        created: Date.now(),
        "members/host/name": name,
        "members/host/uid": uid,
        [`uids/${uid}`]: true,
      });
      return code;
    } catch {
      // code already taken by someone else's session — try another
    }
  }
  throw new Error("Couldn’t start a session — please try again.");
}

// Guest join is server-side now (joinByCode / redeemInvite callables) so the
// sessions write rule can stay locked to members. See src/lib/functions.ts.

export function writeAnswer(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  value: AnswerValue,
): Promise<void> {
  return update(ref(db, `sessions/${code}/decks/${slug}/answers/${qid}`), {
    [role]: value,
  });
}

export function writeGuess(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  value: AnswerValue,
): Promise<void> {
  return update(ref(db, `sessions/${code}/decks/${slug}/guesses/${qid}`), {
    [role]: value,
  });
}

export function markLevelDone(
  code: string,
  slug: string,
  lvl: number,
  role: Role,
): Promise<void> {
  return update(ref(db, `sessions/${code}/decks/${slug}/done/${lvl}`), {
    [role]: true,
  });
}
