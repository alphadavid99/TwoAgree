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
export type Invite = { kind: "token" | "code"; value: string };

function fromUrl(): Invite | null {
  const p = new URLSearchParams(window.location.search);
  const t = p.get("t")?.trim();
  if (t) return { kind: "token", value: t };
  const c = p.get("c")?.trim().toUpperCase();
  if (c) return { kind: "code", value: c };
  return null;
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
