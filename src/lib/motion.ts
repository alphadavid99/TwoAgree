// Motion helpers shared by anything that animates a number or an arc.
// Lives outside the components so a screen can count a headline up without
// importing Ring (and so Ring stays a components-only module).
//
// The durations and curves these are driven at are tokens — see the motion
// block in src/brand/tokens.css for the three rules that govern them.
import { useEffect, useRef, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

// Drives a 0→1 value over `dur` ms with an ease-out curve, once on mount.
// `delay` holds the value at 0 first, so a caller can stagger two numbers into
// two separate beats instead of one simultaneous blur.
export function useDraw(dur = 900, delay = 0): number {
  const reduced = useReducedMotion();
  const [p, setP] = useState(reduced ? 1 : 0);
  const raf = useRef(0);
  useEffect(() => {
    if (reduced) {
      setP(1);
      return;
    }
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, Math.max(0, now - start - delay) / dur);
      setP(1 - Math.pow(1 - t, 3)); // easeOutCubic
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced, dur, delay]);
  return p;
}

/** Reduce Motion, read once at the moment of an animation (not a hook). */
export function prefersStill(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Point at a field that needs fixing (motion rule 3): move focus to it and,
 * unless motion is off, shake it once. Colour alone is easy to miss with the
 * keyboard up; the red edge comes from `.input[aria-invalid]`. `target` is what
 * shakes (a field, or the consent row); `focusOn` is what takes focus.
 */
export function flagField(target: Element | null, focusOn: Element | null = target): void {
  (focusOn as HTMLElement | null)?.focus?.({ preventScroll: false });
  if (!target || prefersStill() || typeof (target as HTMLElement).animate !== "function") return;
  (target as HTMLElement).animate(
    [
      { transform: "none" },
      { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "none" },
    ],
    { duration: 360, easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)" },
  );
}

/**
 * A damped spring from `from` to `to`, starting at `v0` (px/s), calling `frame`
 * each animation frame (motion rule 9). Stiffness 300 / damping 30 is just under
 * critical: it settles in about a quarter of a second with no visible bounce.
 * Returns a cancel, so a finger can catch the thing mid-flight.
 */
export function spring(
  from: number,
  to: number,
  v0: number,
  frame: (x: number) => void,
  done?: () => void,
  k = 300,
  c = 30,
): () => void {
  let x = from;
  let v = v0;
  let last = performance.now();
  let id = 0;
  const step = (now: number) => {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    v += (-k * (x - to) - c * v) * dt;
    x += v * dt;
    if (Math.abs(v) < 20 && Math.abs(x - to) < 0.5) {
      frame(to);
      done?.();
      return;
    }
    frame(x);
    id = requestAnimationFrame(step);
  };
  id = requestAnimationFrame(step);
  return () => cancelAnimationFrame(id);
}

/**
 * Release speed of a drag, in px/s, from the last ~80ms of pointer samples.
 * Push a sample on every move; read it on release.
 */
export class Velocity {
  private s: { p: number; t: number }[] = [];
  push(p: number, t = performance.now()) {
    this.s.push({ p, t });
    while (this.s.length > 2 && t - this.s[0].t > 80) this.s.shift();
  }
  reset(p: number) {
    this.s = [];
    this.push(p);
  }
  get(): number {
    const a = this.s[0];
    const b = this.s[this.s.length - 1];
    if (!a || !b || b.t <= a.t) return 0;
    return ((b.p - a.p) / (b.t - a.t)) * 1000;
  }
}
