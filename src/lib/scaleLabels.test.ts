import { describe, expect, it } from "vitest";
import { scalePoint, shortEnd } from "./scaleLabels";
import type { Question } from "./questions";

const q = (o: Partial<Question>): Question => ({ id: "T-001", q: "?", type: "scale", depth: 1, ...o }) as Question;

describe("scale labels", () => {
  it("shortens an end label at its colon, and leaves a plain one alone", () => {
    expect(shortEnd("My relationship: I'd usually prioritise time with my partner")).toBe("My relationship");
    expect(shortEnd("Not important")).toBe("Not important");
  });

  it("uses the question's own words for a point, split at the colon", () => {
    const s = q({ lo: "Me: one", hi: "You: five", steps: ["Me: one", "two", "three", "four", "You: five"] });
    expect(scalePoint(s, 1, "en")).toEqual({ word: "Me", detail: "one" });
    expect(scalePoint(s, 2, "en")).toEqual({ word: "two" });
  });

  it("falls back to how strongly, plus the full end when it was shortened", () => {
    const s = q({ lo: "Not important: I'm open", hi: "Essential" });
    expect(scalePoint(s, 2, "en")).toEqual({ word: "Leaning", detail: "Not important: I'm open" });
    expect(scalePoint(s, 3, "en")).toEqual({ word: "Right in the middle" });
    expect(scalePoint(s, 5, "en")).toEqual({ word: "Strongly" });
  });

  it("doesn't show English steps in French", () => {
    const s = q({ lo: "Bas", hi: "Haut", steps: ["a", "b", "c", "d", "e"] });
    expect(scalePoint(s, 4, "fr")).toEqual({ word: "Plutôt" });
  });
});
