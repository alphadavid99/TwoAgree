// The reveal's words (design refresh, item 2): every range has its own seven
// encouragement lines and three verses (data/reveal-library.json; ESV, Amos
// 3:3 in the NKJV elsewhere). The range is set by the Agree score alone.
//
// Which line and verse a couple sees is picked by the server when the part
// opens (functions/src/publish.ts choosePick) and stored on the session, so
// both of you see the same words on your own phones, and never the same as
// your previous reveal. Where no pick is stored (parts opened before this, or
// the gallery) a stable fallback is derived from the couple and the part.
import LIBRARY from "../../data/reveal-library.json";

export type RevealRange = 0 | 1 | 2 | 3 | 4;
export interface Pick {
  line: number;
  verse: number;
}
export interface RevealWords {
  range: RevealRange;
  line: string;
  verse: { text: string; ref: string };
}

/** 0–33 · 34–60 · 61–90 · 91–99 · 100 (Agree % only). */
export function rangeOf(agreePct: number): RevealRange {
  if (agreePct >= 100) return 4;
  if (agreePct >= 91) return 3;
  if (agreePct >= 61) return 2;
  if (agreePct >= 34) return 1;
  return 0;
}

// FNV-1a: a small stable hash, so the fallback is the same on both phones.
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function revealWords(agreePct: number, pick: Pick | null | undefined, seed: string): RevealWords {
  const range = rangeOf(agreePct);
  const r = LIBRARY.ranges[range];
  const p = pick ?? { line: hash(`${seed}|line`), verse: hash(`${seed}|verse`) };
  return {
    range,
    line: r.lines[p.line % r.lines.length],
    verse: r.verses[p.verse % r.verses.length],
  };
}

export const LIBRARY_RANGES = LIBRARY.ranges;
