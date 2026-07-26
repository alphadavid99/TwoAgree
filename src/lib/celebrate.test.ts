import { describe, it, expect } from "vitest";
import { celebrationTier, PETAL_COUNT } from "./celebrate";

describe("celebrationTier", () => {
  it("stays quiet below 60 — a low reveal routes to conversation, it doesn't cheer", () => {
    expect(celebrationTier(0, 0)).toBe(0);
    expect(celebrationTier(59, 59)).toBe(0);
    expect(celebrationTier(34, null)).toBe(0);
  });

  it("steps up at each band boundary", () => {
    expect(celebrationTier(60, null)).toBe(1);
    expect(celebrationTier(74, null)).toBe(1);
    expect(celebrationTier(75, null)).toBe(2);
    expect(celebrationTier(89, null)).toBe(2);
    expect(celebrationTier(90, null)).toBe(3);
    expect(celebrationTier(99, null)).toBe(3);
    expect(celebrationTier(100, null)).toBe(4);
  });

  it("celebrates a high Known even when agreement is lower", () => {
    // The couple who read each other almost perfectly earns the moment too.
    expect(celebrationTier(20, 95)).toBe(3);
    expect(celebrationTier(50, 100)).toBe(4);
  });

  it("treats a missing Known as no signal, never as zero", () => {
    expect(celebrationTier(92, null)).toBe(3);
  });

  it("pours no petals until 75 — tier 1 is the room itself", () => {
    expect(PETAL_COUNT[0]).toBe(0);
    expect(PETAL_COUNT[1]).toBe(0);
    expect(PETAL_COUNT[2]).toBeGreaterThan(0);
  });

  it("gets thicker at every tier above 75", () => {
    expect(PETAL_COUNT[3]).toBeGreaterThan(PETAL_COUNT[2]);
    expect(PETAL_COUNT[4]).toBeGreaterThan(PETAL_COUNT[3]);
  });
});
