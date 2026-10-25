import { describe, it, expect } from "vitest";
import { celebrationTier, PETAL_COUNT } from "./celebrate";

describe("celebrationTier (Agree only)", () => {
  it("gives every score the claret room", () => {
    expect(celebrationTier(0)).toBe(1);
    expect(celebrationTier(27)).toBe(1);
    expect(celebrationTier(60)).toBe(1);
  });

  it("steps up at each range boundary", () => {
    expect(celebrationTier(61)).toBe(2);
    expect(celebrationTier(90)).toBe(2);
    expect(celebrationTier(91)).toBe(3);
    expect(celebrationTier(99)).toBe(3);
    expect(celebrationTier(100)).toBe(4);
  });

  it("pours no petals in the first ranges — tier 1 is the room itself", () => {
    expect(PETAL_COUNT[1]).toBe(0);
    expect(PETAL_COUNT[2]).toBeGreaterThan(0);
  });

  it("gets thicker at every tier above", () => {
    expect(PETAL_COUNT[3]).toBeGreaterThan(PETAL_COUNT[2]);
    expect(PETAL_COUNT[4]).toBeGreaterThan(PETAL_COUNT[3]);
  });
});
