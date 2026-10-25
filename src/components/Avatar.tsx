// A round avatar: the person's photo when we have it, otherwise their initial
// on a brand-tinted disc. Partner photos aren't reachable client-side (rules
// lock users/{uid} to its owner and the session only carries name + uid), so
// on shared screens this falls back to the initial — the app's real fallback.
type Tone = "berry" | "honey";

// Each person keeps their colour on both phones (Dave, 24 Oct): the host is
// always claret, the guest always honey — never "me" vs "them".
export const toneFor = (role: "host" | "guest"): Tone => (role === "host" ? "berry" : "honey");

const TONE_BG: Record<Tone, string> = {
  berry: "var(--berry)",
  honey: "var(--honeyD)",
};
// White on honey measured 2.5:1; the guest's initial is dark ink (5.8:1).
const TONE_INK: Record<Tone, string> = {
  berry: "var(--ta-white)",
  honey: "var(--app-honey-ink)",
};

export function Avatar({
  name,
  photo,
  size = 46,
  tone = "berry",
  ring = true,
  done = false,
  pending = false,
}: {
  name?: string;
  photo?: string | null;
  size?: number;
  tone?: Tone;
  ring?: boolean;
  /** A small tick: this person has finished. */
  done?: boolean;
  /** A dashed outline: this person hasn't finished yet. */
  pending?: boolean;
}) {
  const initial = (name ?? "?").trim().charAt(0).toUpperCase() || "?";
  if (pending) {
    return (
      <div
        className="avatar-disc avatar-wait"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.42), boxShadow: "none" }}
      >
        {initial}
      </div>
    );
  }
  const disc = (
    <div
      className="avatar-disc"
      style={{
        width: size,
        height: size,
        background: photo ? "var(--ta-white)" : TONE_BG[tone],
        // A custom property, not `color`, so a context can still recolour the
        // initial (the reveal's claret room turns both discs light).
        ["--av-ink" as string]: TONE_INK[tone],
        fontSize: Math.round(size * 0.42),
        borderWidth: ring ? Math.max(2, Math.round(size * 0.06)) : 0,
      }}
    >
      {photo ? <img src={photo} alt="" /> : initial}
    </div>
  );
  if (!done) return disc;
  // On a small avatar the tick shrinks too, so it never covers the initial.
  const tick = Math.max(15, Math.round(size * 0.46));
  return (
    <div className="avatar-done" style={{ width: size, height: size }}>
      {disc}
      <span className="avatar-tick" aria-hidden="true" style={size < 44 ? { width: tick, height: tick, right: -4, bottom: -4 } : undefined}>
        <svg viewBox="0 0 12 12" width={size < 44 ? 9 : 12} height={size < 44 ? 9 : 12}>
          <path d="M2.5 6.2 5 8.6l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
