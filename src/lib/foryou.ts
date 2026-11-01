// "For you" (feedback 28): what's waiting between the two of you, worked out
// from the shared session alone (invites, and the started/done flags), never
// from anyone's answers. Shown behind the bell and at the top of Talk.
import { DECKS } from "./questions";
import { nLevels } from "./leveling";
import { levelDone } from "./progress";
import { startedLevel } from "./privacy";
import { other, type Role } from "./scoring";
import { invitesOf, isWaiting, inviteKey, type Invite } from "./invites";
import type { Session } from "../types";

export type ForYouItem =
  /** Your partner invited you to do this part together. */
  | { kind: "invite"; id: string; slug: string; level: number; invite: Invite }
  /** Your partner has finished a part you haven't. */
  | { kind: "theyFinished"; id: string; slug: string; level: number }
  /** Your partner is part way through a part. */
  | { kind: "theyStarted"; id: string; slug: string; level: number }
  /** You invited your partner, and they haven't started it yet. */
  | { kind: "sent"; id: string; slug: string; level: number; invite: Invite };

export function forYou(session: Session | null | undefined, role: Role, now: number): ForYouItem[] {
  const them = other(role);
  const decks = session?.decks ?? {};
  const invites: ForYouItem[] = [];
  const sent: ForYouItem[] = [];
  const covered = new Set<string>();

  for (const i of invitesOf(session)) {
    if (!DECKS[i.slug] || !isWaiting(i, now)) continue;
    const key = inviteKey(i.slug, i.level);
    const deck = decks[i.slug];
    if (i.from === them) {
      // Moot once you've begun it yourself.
      if (startedLevel(deck, i.level, role)) continue;
      invites.push({ kind: "invite", id: `invite:${key}:${i.at}`, slug: i.slug, level: i.level, invite: i });
      covered.add(key);
    } else if (!startedLevel(deck, i.level, them)) {
      sent.push({ kind: "sent", id: `sent:${key}:${i.status}`, slug: i.slug, level: i.level, invite: i });
      covered.add(key);
    }
  }

  const finished: ForYouItem[] = [];
  const started: ForYouItem[] = [];
  for (const slug of Object.keys(decks)) {
    if (!DECKS[slug]) continue;
    const deck = decks[slug];
    for (let level = 0; level < nLevels(slug); level++) {
      const key = inviteKey(slug, level);
      if (covered.has(key)) continue;
      if (levelDone(deck, level, them)) {
        if (!levelDone(deck, level, role)) finished.push({ kind: "theyFinished", id: `done:${key}`, slug, level });
      } else if (startedLevel(deck, level, them)) {
        started.push({ kind: "theyStarted", id: `started:${key}`, slug, level });
      }
    }
  }

  return [...invites, ...finished, ...started, ...sent];
}
