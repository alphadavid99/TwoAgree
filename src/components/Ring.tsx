// Progress rings — ported from ringSVG / pctRing in legacy/index.html.
// The arc draws in and the number counts up on mount (a small, calm delight),
// unless the viewer prefers reduced motion. The two hooks that drive that live
// in lib/motion so screens can reuse them without importing this module.
import { useEffect, useState } from "react";
import { useDraw, useReducedMotion } from "../lib/motion";

export function ProgressRing({
  done,
  total,
  size = 116,
}: {
  done: number;
  total: number;
  size?: number;
}) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const frac = total ? done / total : 0;
  // The Decks list mounts one of these per deck — 21 rings, each previously
  // running its own RAF loop with a setState per frame, underneath the pane
  // animation. Draw the arc with a one-shot CSS transition instead: the browser
  // animates strokeDasharray off the main thread and React renders once.
  const [drawn, setDrawn] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const shown = drawn || reduced ? frac : 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${done} of ${total} answered`}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth="9" />
      {/* A round cap on a zero-length dash still paints a dot — so every
          untouched deck wore a phantom honey pip at 12 o'clock, 16 of them
          down the list, reading as "you've started this". */}
      {done > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--honey)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${(circ * shown).toFixed(1)} ${circ.toFixed(0)}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={
            reduced
              ? undefined
              : { transition: "stroke-dasharray var(--dur-ceremony) var(--ease-glide)" }
          }
        />
      )}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.round(size * 0.2)}
        fontWeight="700"
        fill="var(--berry)"
        fontFamily="var(--font-ui)"
      >
        {done}/{total}
      </text>
    </svg>
  );
}

export function PctRing({
  pct,
  size = 160,
  color = "var(--honey)",
  label = "agreed",
  drawMs,
  delayMs = 0,
}: {
  pct: number;
  size?: number;
  color?: string;
  label?: string;
  // The ceremony draws slower and staggers its second ring, so the couple
  // watches the number climb rather than meeting it already settled.
  drawMs?: number;
  delayMs?: number;
}) {
  const p = useDraw(drawMs ?? 900, delayMs);
  // The number is an animating <text> node inside an SVG — assistive tech got
  // either nothing or a changing fragment. Announce the settled value.
  const sw = 12;
  const r = size / 2 - sw;
  const circ = 2 * Math.PI * r;
  const dash = ((circ * pct) / 100) * p;
  const shown = Math.round(pct * p);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      // The FINAL value, not the animating one — otherwise a reader either gets
      // nothing or a number that changes under it mid-announcement.
      aria-label={`${pct}% ${label}`}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={sw} />
      {/* Same round-cap guard as ProgressRing: at 0% the cap alone paints a dot. */}
      {pct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(0)}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      <text
        x={size / 2}
        y={label ? size / 2 - size * 0.04 : size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.round(size * 0.3)}
        fontWeight="700"
        letterSpacing="-0.5"
        fill="var(--berry)"
        fontFamily="var(--font-ui)"
      >
        {shown}%
      </text>
      {label && (
        <text
          x={size / 2}
          y={size / 2 + size * 0.18}
          textAnchor="middle"
          fontSize={Math.round(size * 0.092)}
          fill="var(--sub)"
          fontFamily="var(--font-ui)"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
