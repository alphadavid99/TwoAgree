// Deck leveling (levelsOf / nLevels / lvlQs / stageOf, first ported from
// legacy/index.html). A deck's parts ("levels" in code) used to be cut on the
// fly into ~7-question slices, so adding one question shifted every later part.
// They are now fixed in the bank: each part is a name plus its question ids in
// data/decks.json (design refresh, item 11), cut exactly where the old split
// fell, so nobody's progress moved. Pure + cached.
import { DECKS, type Question } from "./questions";

const cache: Record<string, Question[][]> = {};

export function levelsOf(slug: string): Question[][] {
  if (cache[slug]) return cache[slug];
  const byId = new Map(DECKS[slug].questions.map((q) => [q.id, q]));
  const out = DECKS[slug].parts.map((p) => p.qids.map((id) => byId.get(id)!));
  cache[slug] = out;
  return out;
}

/** A part's approved name ("Who does what"), never "Part 2". */
export const partName = (slug: string, lvl: number): string =>
  DECKS[slug]?.parts[lvl]?.name ?? "";

export const nLevels = (slug: string): number => levelsOf(slug).length;

export const lvlQs = (slug: string, lvl: number): Question[] =>
  levelsOf(slug)[lvl] ?? [];

// Derived 1/2/3 tier from depth, for display grouping only (brief 2 §A3):
// depth 1 → 1, depth 2–3 → 2, depth 4–5 → 3.
const tierOf = (depth: number): number => (depth <= 1 ? 1 : depth <= 3 ? 2 : 3);

// Difficulty stage 0/1/2 from the deck's average derived tier (Warm-up / Core /
// Deep). Thresholds unchanged from the old tier-based version.
export function stageOf(slug: string): number {
  const qs = DECKS[slug].questions;
  let s = 0;
  qs.forEach((q) => {
    s += tierOf(Number(q.depth) || 3);
  });
  const a = s / qs.length;
  return a < 1.7 ? 0 : a < 2.35 ? 1 : 2;
}

export const STAGES: [string, string][] = [
  ["Warm-up", "Light, easy openers"],
  ["Core", "The everyday substance"],
  ["Deep & honest", "Convictions and harder truths"],
];

// Depth as words, never numbers (brief 2 §A7c). Dave's own labels; "Hot-button"
// renamed to "Hardest". Index 1–5; [en, fr] so call sites can localise.
const DEPTH_EN = ["", "Warm-up", "Everyday", "Deeper", "Vulnerable", "Hardest"];
const DEPTH_FR = ["", "Échauffement", "Quotidien", "Plus profond", "Vulnérable", "Le plus dur"];
const clampDepth = (d: number): number => Math.min(5, Math.max(1, Math.round(d)));
export const depthWord = (d: number): [string, string] => {
  const i = clampDepth(d);
  return [DEPTH_EN[i], DEPTH_FR[i]];
};

// Deck card label = "what this is like" = word for the MEDIAN depth.
export function deckDepthWord(slug: string): [string, string] {
  const ds = DECKS[slug].questions.map((q) => q.depth).sort((a, b) => a - b);
  if (!ds.length) return depthWord(3);
  const mid = Math.floor(ds.length / 2);
  const median = ds.length % 2 ? ds[mid] : (ds[mid - 1] + ds[mid]) / 2;
  return depthWord(median);
}

// Part label = "what you're agreeing to" = word for the MAX depth in the part.
// Max, not median: one hardest question takes the whole part there (§A7c).
export function partDepthWord(slug: string, lvl: number): [string, string] {
  const qs = lvlQs(slug, lvl);
  if (!qs.length) return depthWord(1);
  return depthWord(Math.max(...qs.map((q) => q.depth)));
}
