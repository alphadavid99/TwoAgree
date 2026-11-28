// The reveal ceremony's rules (docs/split/DECISIONS.md, "Design"), kept pure so
// they can be tested without a screen. The range is set by the Agree score
// alone. Every score counts up from zero and gets its own motion, all of it
// drawn behind the card: a low score gets a quiet, warm moment, never silence.
//
//   1  0–40    lanterns: a slow count under a quiet sky, lanterns rising
//   2  41–60   embers: sparks drift up, a ripple of light when it lands
//   3  61–80   daybreak: stars begin to stream, rays open, confetti, fireworks
//   4  81–99   lift-off: hyperspeed stars, flash, shockwaves, cannons
//   5  100     glory: all of it, longer and brighter, and the room turns to dawn
export type CeremonyLevel = 1 | 2 | 3 | 4 | 5;

export function ceremonyLevel(agreePct: number): CeremonyLevel {
  if (agreePct >= 100) return 5;
  if (agreePct >= 81) return 4;
  if (agreePct >= 61) return 3;
  if (agreePct >= 41) return 2;
  return 1;
}

// How the card arrives. It always comes face down and turns over; from 90% the
// face-down card rockets up from the bottom first. At 60 and under it rises
// and turns more slowly, to match the calmer room.
export type Arrival = "soft" | "flip" | "rocket";

export function arrivalFor(agreePct: number): Arrival {
  if (agreePct >= 90) return "rocket";
  return ceremonyLevel(agreePct) >= 3 ? "flip" : "soft";
}

// The card's finish. Bright milk frost under 100; at 100 the gold-line card,
// with two more to choose from when sharing.
export type CardFinish = "milk" | "goldline" | "gilded" | "claret";

export const defaultFinish = (agreePct: number): CardFinish => (agreePct >= 100 ? "goldline" : "milk");

export const shareFinishes = (agreePct: number): CardFinish[] =>
  agreePct >= 100 ? ["goldline", "gilded", "claret"] : [];

/** Per-level tuning for the canvas (seconds to count up, star speed, light). */
export interface LevelConfig {
  /** Seconds the number takes to count up from zero. */
  count: number;
  /** How fast the stars stream (0 = a still sky). */
  warp: number;
  /** Strength of the rays turning behind the card, 0–1. */
  rays: number;
  /** Strength of the glow behind the card, 0–1. */
  glow: number;
  stars: number;
}

export const LEVELS: Record<CeremonyLevel, LevelConfig> = {
  1: { count: 2.4, warp: 0, rays: 0, glow: 0.35, stars: 60 },
  2: { count: 2.1, warp: 0.12, rays: 0.15, glow: 0.5, stars: 80 },
  3: { count: 2.2, warp: 0.55, rays: 0.5, glow: 0.7, stars: 110 },
  4: { count: 2.5, warp: 1.05, rays: 0.8, glow: 0.9, stars: 150 },
  5: { count: 3.1, warp: 1.45, rays: 1, glow: 1, stars: 190 },
};

/** Seconds between the card starting to arrive and the count starting. */
export const ARRIVAL_LEAD: Record<Arrival, number> = { soft: 2.15, flip: 1.6, rocket: 1.7 };

/** The number shown `t` seconds into a count of `secs`: ease-out, always 0 → pct. */
export function countAt(pct: number, t: number, secs: number): number {
  const k = Math.max(0, Math.min(1, t / secs));
  return Math.round(pct * (1 - Math.pow(1 - k, 3)));
}
