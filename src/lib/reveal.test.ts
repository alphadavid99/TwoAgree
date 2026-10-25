import { describe, it, expect } from "vitest";
import { rangeOf, revealWords, LIBRARY_RANGES } from "./reveal";

describe("the reveal library", () => {
  it("has 35 lines and 15 verses, 7 and 3 per range", () => {
    expect(LIBRARY_RANGES).toHaveLength(5);
    expect(LIBRARY_RANGES.flatMap((r) => r.lines)).toHaveLength(35);
    expect(LIBRARY_RANGES.flatMap((r) => r.verses)).toHaveLength(15);
  });

  it("sets the range by Agree alone", () => {
    expect([0, 33, 34, 60, 61, 90, 91, 99, 100].map(rangeOf)).toEqual([0, 0, 1, 1, 2, 2, 3, 3, 4]);
  });

  it("each range shows its own copy", () => {
    const at = [27, 50, 77, 95, 100].map((p) => revealWords(p, { line: 0, verse: 0 }, "x"));
    expect(at.map((w) => w.line)).toEqual([
      "New paths to explore together.",
      "Finding your shared stride.",
      "Walking well together.",
      "Step for step.",
      "Perfectly in step.",
    ]);
    expect(at.map((w) => w.verse.ref)).toEqual([
      "Proverbs 27:17",
      "Ephesians 4:2",
      "Ecclesiastes 4:9",
      "Colossians 2:2",
      "Song of Solomon 6:3",
    ]);
  });

  it("both partners see the same words: from the stored pick, or the same fallback", () => {
    const pick = { line: 4, verse: 2 };
    expect(revealWords(77, pick, "ABCD|money|0")).toEqual(revealWords(77, pick, "ABCD|money|0"));
    const a = revealWords(50, null, "ABCD|money|0");
    expect(revealWords(50, undefined, "ABCD|money|0")).toEqual(a);
    expect(LIBRARY_RANGES[1].lines).toContain(a.line);
  });
});
