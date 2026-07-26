// The celebration ladder — "Gold on Claret" (Dave-approved, Jul 2026).
//
// A celebrated reveal pulls the whole screen into the Path's claret world, and
// the higher the score the more of the room the celebration takes:
//
//   0  under 60 — no celebration. That reveal's job is to route the couple into
//                 the conversation, not to cheer; cheering there would ring
//                 false, and the CTA changes to "See where to start talking".
//   1  60+   the room turns claret: gold ripples, rising motes, a shimmer pass
//   2  75+   + a thick fall of petals
//   3  90+   + wheeling gold rays, a pulsing wash, a burst of sparks
//   4  100   + the two of them settle together above the ring, under the verse
//
// Driven by whichever axis is higher, so a couple who read each other almost
// perfectly is celebrated even when they agree on less — Known was never
// celebrated before, despite being the axis the share card leads with.
export type CelebrationTier = 0 | 1 | 2 | 3 | 4;

export function celebrationTier(
  agreed: number,
  known: number | null,
): CelebrationTier {
  const best = Math.max(agreed, known ?? 0);
  if (best >= 100) return 4;
  if (best >= 90) return 3;
  if (best >= 75) return 2;
  if (best >= 60) return 1;
  return 0;
}

// How thick the fall gets per tier. Tier 1 celebrates with the room itself —
// ripples, motes and the shimmer pass — so no petals fall there.
export const PETAL_COUNT: Record<CelebrationTier, number> = {
  0: 0,
  1: 0,
  2: 90,
  3: 150,
  4: 180,
};
