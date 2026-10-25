import { describe, expect, it } from "vitest";
import { scaleSay } from "./scaleLabels";
import { DECKS, ORDER, type Question } from "./questions";

const q = (o: Partial<Question>): Question => ({ id: "T-001", q: "?", type: "scale", depth: 1, ...o }) as Question;

describe("what a scale point says", () => {
  it("uses the question's own words for the point", () => {
    const s = q({ lo: "Me", hi: "You", steps: ["Me: one", "two", "three", "four", "You: five"] });
    expect(scaleSay(s, 1, "en")).toBe("Me: one");
    expect(scaleSay(s, 2, "en")).toBe("two");
  });

  it("otherwise says how strongly, towards which end, as one line", () => {
    const s = q({ lo: "Too slow for me", hi: "I'd love it" });
    expect(scaleSay(s, 2, "en")).toBe("Leaning: too slow for me");
    expect(scaleSay(s, 3, "en")).toBe("Right in the middle");
    expect(scaleSay(s, 5, "en")).toBe("Strongly: I'd love it");
  });

  it("doesn't show English steps in French", () => {
    const s = q({ lo: "Bas", hi: "Haut", steps: ["a", "b", "c", "d", "e"] });
    expect(scaleSay(s, 4, "fr")).toBe("Plutôt : haut");
  });

  it("keeps every end label short, so the two ends never read as one sentence", () => {
    for (const slug of ORDER)
      for (const x of DECKS[slug].questions)
        if (x.type === "scale")
          for (const e of [x.lo!, x.hi!]) {
            expect(e.length, `${x.id} "${e}"`).toBeLessThanOrEqual(40);
            expect(e, x.id).not.toMatch(/[:(]/);
          }
  });
});
