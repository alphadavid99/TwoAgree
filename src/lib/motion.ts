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
