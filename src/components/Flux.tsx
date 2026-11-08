// The flowing top of every screen (Dave, Nov 2026): four soft silk waves
// (rose, peach, lilac, cream) over a light wash, each drifting sideways at its
// own slow pace and gently rising and falling, so the colours flow through
// each other. It sits behind the page, about halfway down, and melts into the
// calm ground (index.css, "Flux"). Still for anyone who has turned motion down.
// Decorative only.

const PERIOD = 420;
// A wave three periods wide, so sliding it one period left loops seamlessly
// across any phone width.
function wave(amp: number): string {
  let d = "M0 0";
  let x = 0;
  for (let n = 0; n < 6; n++) {
    const y = n % 2 === 0 ? -amp : amp;
    d += ` C ${x + PERIOD / 4} ${y}, ${x + PERIOD / 4} ${y}, ${x + PERIOD / 2} 0`;
    x += PERIOD / 2;
  }
  return `${d} L ${x} 520 L 0 520 Z`;
}

const LAYERS = [
  { fill: "var(--flux-rose)", top: 50, amp: 70, secs: 20, tilt: -7, fade: 0.85 },
  { fill: "var(--flux-peach)", top: 120, amp: 80, secs: 28, tilt: 5, fade: 0.8 },
  { fill: "var(--flux-lilac)", top: 190, amp: 65, secs: 36, tilt: -4, fade: 0.75 },
  { fill: "var(--flux-cream)", top: 260, amp: 55, secs: 24, tilt: 6, fade: 0.7 },
];

export function Flux() {
  return (
    <div className="flux" aria-hidden="true">
      <div className="flux-wash" />
      {LAYERS.map((l, i) => (
        <div
          key={i}
          className="flux-wave"
          style={
            {
              top: l.top,
              opacity: l.fade,
              animationDuration: `${l.secs}s, ${Math.round(l.secs / 2)}s`,
              animationDirection: i % 2 ? "reverse, alternate" : "normal, alternate",
              "--tilt": `${l.tilt}deg`,
            } as React.CSSProperties
          }
        >
          <svg width={PERIOD * 3} height="610" viewBox={`0 -90 ${PERIOD * 3} 610`}>
            <path d={wave(l.amp)} fill={l.fill} />
          </svg>
        </div>
      ))}
      <div className="flux-sheen" />
      <div className="flux-fade" />
    </div>
  );
}
