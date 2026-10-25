import { describe, it, expect } from "vitest";
import { levelsOf, nLevels, lvlQs, stageOf, partName } from "./leveling";
import { DECKS, ORDER } from "./questions";
import APPROVED from "../../docs/refresh/part-names.json";

describe("question bank integrity", () => {
  it("has 21 conversations and 399 questions (brief 2)", () => {
    expect(ORDER).toHaveLength(21);
    const total = ORDER.reduce((n, s) => n + DECKS[s].questions.length, 0);
    expect(total).toBe(399);
  });
  it("every deck is sorted by depth ascending (brief 2 §A7b)", () => {
    for (const slug of ORDER) {
      const depths = DECKS[slug].questions.map((q) => q.depth);
      const sorted = [...depths].sort((a, b) => a - b);
      expect(depths, `${slug} not depth-sorted`).toEqual(sorted);
    }
  });
});

describe("levelsOf partitions a deck in order", () => {
  it("levels reconstruct the deck exactly, for every deck", () => {
    for (const slug of ORDER) {
      const flat = levelsOf(slug).flat();
      expect(flat).toEqual(DECKS[slug].questions); // same items, same order
    }
  });
  it("every part has its approved name (item 11: 56 names, no 'Part 2')", () => {
    let n = 0;
    for (const slug of ORDER) {
      expect(DECKS[slug].parts.length).toBe(nLevels(slug));
      for (let l = 0; l < nLevels(slug); l++) {
        expect(partName(slug, l).trim(), `${slug} part ${l + 1}`).not.toBe("");
        expect(partName(slug, l)).toBe(APPROVED[slug][l]);
        n++;
      }
    }
    expect(n).toBe(56);
  });
  it("fixing the parts moved nobody: each part holds what the old ~7-per-part cut gave it", () => {
    // The old cutter, verbatim, over the same depth-ordered deck. This guards
    // the switch to fixed parts; once questions are added to a part on
    // purpose, the two are allowed to differ.
    for (const slug of ORDER) {
      const qs = DECKS[slug].questions;
      const L = Math.max(1, Math.round(qs.length / 7));
      const base = Math.floor(qs.length / L);
      const rem = qs.length % L;
      let i = 0;
      for (let k = 0; k < L; k++) {
        const n = base + (k < rem ? 1 : 0);
        expect(lvlQs(slug, k).map((q) => q.id), `${slug} part ${k + 1}`).toEqual(
          qs.slice(i, i + n).map((q) => q.id),
        );
        i += n;
      }
    }
  });
  it("distributes the remainder to the earliest levels", () => {
    // A single-part deck's part 0 is the whole deck.
    const single = ORDER.find((s) => nLevels(s) === 1)!;
    expect(lvlQs(single, 0).length).toBe(DECKS[single].questions.length);
  });
});

describe("stageOf", () => {
  it("returns 0, 1, or 2 for every deck", () => {
    for (const slug of ORDER) {
      expect([0, 1, 2]).toContain(stageOf(slug));
    }
  });
});
