// The celebration ladder — "Gold on Claret" (Dave-approved, Jul 2026), revised
// in the design refresh (item 2): the claret room is for everyone, and the
// range is set by Agree alone.
//
//   1  0–60    the room turns claret: gold ripples, rising motes, a shimmer
//   2  61–90   + a fall of petals
//   3  91–99   + wheeling gold rays, a pulsing wash, a burst of sparks
//   4  100     + fireworks, the gold medallion, the two of them meeting
//
// No score feels like failure: every range has its own honest line and verse
// (lib/reveal.ts). Motion respects reduce-motion (RevealScreen).
export type CelebrationTier = 1 | 2 | 3 | 4;

export function celebrationTier(agreed: number): CelebrationTier {
  if (agreed >= 100) return 4;
  if (agreed >= 91) return 3;
  if (agreed >= 61) return 2;
  return 1;
}

// How thick the fall gets per tier. Tier 1 celebrates with the room itself —
// ripples, motes and the shimmer pass — so no petals fall there.
export const PETAL_COUNT: Record<CelebrationTier, number> = {
  1: 0,
  2: 90,
  3: 150,
  4: 180,
};
