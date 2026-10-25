// The pending invitation — the ONE place the app looks for "someone sent me a
// link". Two shapes arrive:
//
//   /?t=TOKEN  a single-use invite minted by createInvite (the normal path)
//   /?c=CODE   the bare session code, which InviteStep falls back to sharing
//              when createInvite fails (offline, cold start). This used to be
//              a dead URL: nothing in the app read `c`, so the partner landed
//              on the generic front door and — if they pushed on — created a
//              SEPARATE session, while the host believed the invite had been
//              sent. Both shapes now seat the guest (joinByCode / redeemInvite).
//
// Inside the native shell there's no querystring — the local bundle loads from
// capacitor://localhost — so the invitation arrives later via a universal link
// (see device/deeplinks.ts), which calls setInviteToken(). Components read it
// through a tiny subscription so one that lands AFTER mount still routes.
//
// Either link may carry `n`, the inviter's first name, so the invitation can
// say who it's from ("Sarah invited you") before the guest has joined and can
// read the session. It's only a display hint the inviter chose to send.
export type Invite = { kind: "token" | "code"; value: string; from?: string };

// A first name only, letters and simple punctuation, at most 20 characters.
export function cleanFirstName(raw: string | null | undefined): string | undefined {
  const first = (raw ?? "").trim().split(/\s+/)[0] ?? "";
  const clean = first.replace(/[^\p{L}\p{M}'’-]/gu, "").slice(0, 20);
  return clean || undefined;
}

export function parseInvite(search: string): Invite | null {
  const p = new URLSearchParams(search);
  const from = cleanFirstName(p.get("n"));
  const t = p.get("t")?.trim();
  if (t) return { kind: "token", value: t, ...(from ? { from } : {}) };
  const c = p.get("c")?.trim().toUpperCase();
  if (c) return { kind: "code", value: c, ...(from ? { from } : {}) };
  return null;
}

/** The link the inviter shares: a token (or the bare-code fallback) plus their first name. */
export function inviteLink(
  origin: string,
  key: { token: string } | { code: string },
  fromName?: string,
): string {
  const p = new URLSearchParams("token" in key ? { t: key.token } : { c: key.code });
  const from = cleanFirstName(fromName);
  if (from) p.set("n", from);
  return `${origin}/?${p.toString()}`;
}

function fromUrl(): Invite | null {
  return typeof window === "undefined" ? null : parseInvite(window.location.search);
}

let current: Invite | null = fromUrl();

const subs = new Set<(i: Invite | null) => void>();

export function currentInvite(): Invite | null {
  return current;
}

export function setInvite(invite: Invite): void {
  current = invite;
  subs.forEach((f) => f(current));
}

export function setInviteToken(token: string): void {
  setInvite({ kind: "token", value: token });
}

export function onInvite(cb: (i: Invite | null) => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

// The join-code box (UX laws: Postel, Tesler): accept messy input and tidy it.
// Any case, spaces or dashes ("ab-cd", " abcd "), or a whole pasted invite
// link — a ?c= link carries the code itself; a ?t= link is a single-use invite
// and is redeemed as one.
export type CodeInput =
  | { kind: "code"; code: string; how: "as-typed" | "tidied" | "from-link" }
  | { kind: "token"; token: string; from?: string }
  | { kind: "empty" };

export function parseCodeInput(raw: string): CodeInput {
  const text = raw.trim();
  if (!text) return { kind: "empty" };
  const q = text.indexOf("?");
  if (q >= 0 && /[?&](t|c)=/.test(text)) {
    const inv = parseInvite(text.slice(q));
    if (inv?.kind === "token") return { kind: "token", token: inv.value, from: inv.from };
    if (inv?.kind === "code") {
      const code = inv.value.replace(/[^A-Z0-9]/g, "");
      return { kind: "code", code, how: "from-link" };
    }
  }
  const code = text.toUpperCase().replace(/[\s\-–—_.]/g, "");
  return { kind: "code", code, how: code === text ? "as-typed" : "tidied" };
}
