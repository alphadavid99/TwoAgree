import { describe, it, expect } from "vitest";
import { levelsOf, nLevels, lvlQs, stageOf } from "./leveling";
import { DECKS, ORDER } from "./questions";

describe("question bank integrity", () => {
  it("has 19 decks and 270 questions", () => {
    expect(ORDER).toHaveLength(19);
    const total = ORDER.reduce((n, s) => n + DECKS[s].questions.length, 0);
    expect(total).toBe(270);
  });
});

describe("levelsOf partitions a deck in order", () => {
  it("levels reconstruct the deck exactly, for every deck", () => {
    for (const slug of ORDER) {
      const flat = levelsOf(slug).flat();
      expect(flat).toEqual(DECKS[slug].questions); // same items, same order
    }
  });
  it("uses ~7-question levels (round(total/7), min 1)", () => {
    for (const slug of ORDER) {
      const total = DECKS[slug].questions.length;
      expect(nLevels(slug)).toBe(Math.max(1, Math.round(total / 7)));
    }
  });
  it("distributes the remainder to the earliest levels", () => {
    // in-the-home has 9 questions -> 1 level of 9
    expect(lvlQs("in-the-home", 0).length).toBe(
      DECKS["in-the-home"].questions.length,
    );
  });
});

describe("stageOf", () => {
  it("returns 0, 1, or 2 for every deck", () => {
    for (const slug of ORDER) {
      expect([0, 1, 2]).toContain(stageOf(slug));
    }
  });
});
