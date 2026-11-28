import { describe, it, expect } from "vitest";
import { ceremonyLevel, arrivalFor, defaultFinish, shareFinishes, countAt, LEVELS } from "./ceremony";

describe("ceremonyLevel (Agree only)", () => {
  it("gives every score a level, starting with the quiet lanterns", () => {
    expect(ceremonyLevel(0)).toBe(1);
    expect(ceremonyLevel(40)).toBe(1);
  });

  it("steps up at each boundary", () => {
    expect(ceremonyLevel(41)).toBe(2);
    expect(ceremonyLevel(60)).toBe(2);
    expect(ceremonyLevel(61)).toBe(3);
    expect(ceremonyLevel(80)).toBe(3);
    expect(ceremonyLevel(81)).toBe(4);
    expect(ceremonyLevel(99)).toBe(4);
    expect(ceremonyLevel(100)).toBe(5);
  });

  it("gets louder at every level", () => {
    for (const n of [2, 3, 4, 5] as const) {
      expect(LEVELS[n].warp).toBeGreaterThan(LEVELS[(n - 1) as 1 | 2 | 3 | 4].warp);
      expect(LEVELS[n].stars).toBeGreaterThan(LEVELS[(n - 1) as 1 | 2 | 3 | 4].stars);
    }
  });
});

describe("arrivalFor", () => {
  it("rises and turns slowly at 60 and under", () => {
    expect(arrivalFor(0)).toBe("soft");
    expect(arrivalFor(60)).toBe("soft");
  });

  it("flips from 61 up to 89", () => {
    expect(arrivalFor(61)).toBe("flip");
    expect(arrivalFor(89)).toBe("flip");
  });

  it("rockets in, then flips, from 90", () => {
    expect(arrivalFor(90)).toBe("rocket");
    expect(arrivalFor(99)).toBe("rocket");
    expect(arrivalFor(100)).toBe("rocket");
  });
});

describe("the card's finish", () => {
  it("is bright milk under 100 and gold line at 100", () => {
    expect(defaultFinish(99)).toBe("milk");
    expect(defaultFinish(100)).toBe("goldline");
  });

  it("offers a choice of three only at 100", () => {
    expect(shareFinishes(99)).toEqual([]);
    expect(shareFinishes(100)).toEqual(["goldline", "gilded", "claret"]);
  });
});

describe("countAt", () => {
  it("always starts at zero and lands on the score", () => {
    for (const pct of [0, 32, 90, 100]) {
      expect(countAt(pct, 0, 2)).toBe(0);
      expect(countAt(pct, 2, 2)).toBe(pct);
      expect(countAt(pct, 9, 2)).toBe(pct);
    }
  });

  it("never runs past the score on the way", () => {
    for (let t = 0; t <= 2; t += 0.1) expect(countAt(72, t, 2)).toBeLessThanOrEqual(72);
  });
});
