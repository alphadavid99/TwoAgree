import { describe, it, expect } from "vitest";
import { scaleText, scaleWord } from "./answerWords";
import type { Question } from "./questions";

const t = (en: string) => en;
const q = { id: "X", q: "", type: "scale", depth: 1, lo: "Saver to the bone", hi: "Spender at heart" } as Question;

describe("answers in words", () => {
  it("never shows a number", () => {
    expect(scaleText(q, 4, t)).toBe("Leaning: spender at heart");
    expect(scaleText(q, 1, t)).toBe("Strongly: saver to the bone");
    expect(scaleText(q, 3, t)).toBe("Right in the middle");
    expect(scaleWord(5, t)).toBe("Strongly");
    expect(scaleWord(99, t)).toBe("—");
  });
  it("keeps a first-person end label as written", () => {
    const p = { ...q, lo: "I'd rather keep my past private" } as Question;
    expect(scaleText(p, 1, t)).toBe("Strongly: I'd rather keep my past private");
  });
});
