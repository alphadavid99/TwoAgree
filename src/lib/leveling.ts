// Deck leveling — PORTED VERBATIM from legacy/index.html (levelsOf / nLevels /
// lvlQs / stageOf). Splits a deck into ~7-question levels. Pure + cached.
import { DECKS, type Question } from "./questions";

const cache: Record<string, Question[][]> = {};

export function levelsOf(slug: string): Question[][] {
  if (cache[slug]) return cache[slug];
  const qs = DECKS[slug].questions;
  const total = qs.length;
  const L = Math.max(1, Math.round(total / 7));
  const base = Math.floor(total / L);
  const rem = total % L;
  const out: Question[][] = [];
  let i = 0;
  for (let k = 0; k < L; k++) {
    const n = base + (k < rem ? 1 : 0);
    out.push(qs.slice(i, i + n));
    i += n;
  }
  cache[slug] = out;
  return out;
}

export const nLevels = (slug: string): number => levelsOf(slug).length;

export const lvlQs = (slug: string, lvl: number): Question[] =>
  levelsOf(slug)[lvl] ?? [];

// Difficulty stage 0/1/2 from the deck's average tier (Warm-up / Core / Deep).
export function stageOf(slug: string): number {
  const qs = DECKS[slug].questions;
  let s = 0;
  qs.forEach((q) => {
    s += Number(q.tier) || 2;
  });
  const a = s / qs.length;
  return a < 1.7 ? 0 : a < 2.35 ? 1 : 2;
}

export const STAGES: [string, string][] = [
  ["Warm-up", "Light, easy openers"],
  ["Core", "The everyday substance"],
  ["Deep & honest", "Convictions and harder truths"],
];
