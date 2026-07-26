/**
 * Narrowing the GDPR export to the person asking for it.
 *
 * exportMyData used to return whole `sessions/{code}` nodes. Those nodes are
 * shared: `decks/{slug}/answers/{qid}` holds BOTH partners under `host` and
 * `guest`. So a subject access request handed back the other person's answers
 * about faith, sex, money and health — Article 9 data about a third party who
 * never asked for it and was never told.
 *
 * Article 20 covers data "concerning him or her". The partner's answers are the
 * partner's. Over-disclosing special-category data about someone else is the
 * worse failure by a distance, so the export is narrowed to the caller's own
 * role, plus the session metadata they're plainly a party to (the code, when it
 * started, who they were doing it with).
 *
 * Pure so it can be tested without the admin SDK.
 */

export type Role = "host" | "guest";

type RoleKeyed = Record<string, unknown>;

export interface RawDeck {
  answers?: Record<string, RoleKeyed>;
  guesses?: Record<string, RoleKeyed>;
  importance?: Record<string, RoleKeyed>;
  done?: Record<string, RoleKeyed>;
  talks?: Record<string, { pinned?: RoleKeyed; talked?: RoleKeyed }>;
}

export interface RawSession {
  created?: number;
  stage?: string;
  members?: Partial<Record<Role, { name?: string; uid?: string }>>;
  uids?: Record<string, boolean>;
  decks?: Record<string, RawDeck>;
  path?: unknown;
  pathLamps?: Record<string, boolean>;
}

export interface RedactedSession {
  created?: number;
  stage?: string;
  yourRole: Role | null;
  /** The partner's display name only — they chose to show you that. */
  partnerName?: string;
  /** Per deck, only this person's own entries. */
  decks: Record<
    string,
    {
      answers?: Record<string, unknown>;
      guesses?: Record<string, unknown>;
      importance?: Record<string, unknown>;
      done?: Record<string, unknown>;
      talks?: Record<string, { pinned?: boolean; talked?: boolean }>;
    }
  >;
  /** Shared couple state, not personal data of either partner alone. */
  pathLamps?: Record<string, boolean>;
  note: string;
}

const NOTE =
  "Only your own answers are included. Your partner's answers are their " +
  "personal data, not yours, so they are not part of your export — they can " +
  "request their own copy from their account.";

/** Pull just `role`'s value out of a `{ qid: { host, guest } }` map. */
function mine(
  src: Record<string, RoleKeyed> | undefined,
  role: Role,
): Record<string, unknown> | undefined {
  if (!src) return undefined;
  const out: Record<string, unknown> = {};
  for (const [id, byRole] of Object.entries(src)) {
    if (byRole && byRole[role] !== undefined) out[id] = byRole[role];
  }
  return Object.keys(out).length ? out : undefined;
}

export function redactSessionForSubject(s: RawSession, uid: string): RedactedSession {
  const role: Role | null =
    s.members?.host?.uid === uid ? "host" : s.members?.guest?.uid === uid ? "guest" : null;

  const decks: RedactedSession["decks"] = {};
  if (role) {
    for (const [slug, deck] of Object.entries(s.decks ?? {})) {
      const entry: RedactedSession["decks"][string] = {};
      const a = mine(deck.answers, role);
      const g = mine(deck.guesses, role);
      const i = mine(deck.importance, role);
      const d = mine(deck.done, role);
      if (a) entry.answers = a;
      if (g) entry.guesses = g;
      if (i) entry.importance = i;
      if (d) entry.done = d;

      // Talks are two flags per question per partner; keep only this person's.
      const talks: Record<string, { pinned?: boolean; talked?: boolean }> = {};
      for (const [qid, node] of Object.entries(deck.talks ?? {})) {
        const t: { pinned?: boolean; talked?: boolean } = {};
        if (node?.pinned?.[role] !== undefined) t.pinned = !!node.pinned[role];
        if (node?.talked?.[role] !== undefined) t.talked = !!node.talked[role];
        if (Object.keys(t).length) talks[qid] = t;
      }
      if (Object.keys(talks).length) entry.talks = talks;

      if (Object.keys(entry).length) decks[slug] = entry;
    }
  }

  const otherRole: Role = role === "host" ? "guest" : "host";
  const partnerName = role ? s.members?.[otherRole]?.name : undefined;

  return {
    created: s.created,
    stage: s.stage,
    yourRole: role,
    ...(partnerName ? { partnerName } : {}),
    decks,
    // The path STRUCTURE is derived from both intakes, so it is not returned;
    // the caller's own intake travels separately in the export. Lamps are a
    // shared milestone with no personal content.
    ...(s.pathLamps ? { pathLamps: s.pathLamps } : {}),
    note: NOTE,
  };
}
