import { describe, it, expect } from "vitest";
import { discoveries, answerText } from "./discoveries";
import { DECKS } from "./questions";
import { lvlQs } from "./leveling";
import type { DeckData } from "./scoring";

const SLUG = "in-the-home";
const L0 = lvlQs(SLUG, 0);
const mc = L0.find((q) => q.type === "mc" && q.guessable)!;
const scale = DECKS[SLUG].questions.find((q) => q.type === "scale")!;

// A revealed level: both finished, so its questions are scoreable.
const revealed = (extra: Partial<DeckData>): Record<string, DeckData> => ({
  [SLUG]: { done: { 0: { host: true, guest: true } }, ...extra },
});

describe("discoveries", () => {
  it("surfaces a guess you got wrong as something you learned", () => {
    const out = discoveries(
      revealed({
        answers: { [mc.id]: { host: 0, guest: 1 } },
        guesses: { [mc.id]: { host: 0 } }, // host guessed guest would say 0
      }),
      "host",
    );
    expect(out).toHaveLength(1);
    expect(out[0].theirAnswer).toBe(1);
    expect(out[0].yourGuess).toBe(0);
  });

  it("ignores guesses you got right — nothing was learned", () => {
    const out = discoveries(
      revealed({
        answers: { [mc.id]: { host: 0, guest: 1 } },
        guesses: { [mc.id]: { host: 1 } },
      }),
      "host",
    );
    expect(out).toEqual([]);
  });

  it("is yours alone — your partner's wrong guess is their discovery", () => {
    const decks = revealed({
      answers: { [mc.id]: { host: 0, guest: 1 } },
      // Only the guest guessed, and wrongly: host said 0, guest predicted 1.
      guesses: { [mc.id]: { guest: 1 } },
    });
    expect(discoveries(decks, "host")).toEqual([]);
    expect(discoveries(decks, "guest")).toHaveLength(1);
  });

  it("stays out of levels the two of them haven't both finished", () => {
    const out = discoveries(
      {
        [SLUG]: {
          done: { 0: { host: true } },
          answers: { [mc.id]: { host: 0, guest: 1 } },
          guesses: { [mc.id]: { host: 0 } },
        },
      },
      "host",
    );
    expect(out).toEqual([]);
  });

  it("drops a guess that can't be shown as words (sentinel or retired option)", () => {
    const out = discoveries(
      revealed({
        answers: { [mc.id]: { host: 0, guest: 1 } },
        guesses: { [mc.id]: { host: 99 } }, // no such option
      }),
      "host",
    );
    expect(out).toEqual([]);
  });

  it("is empty with nothing played", () => {
    expect(discoveries(undefined, "host")).toEqual([]);
  });
});

describe("answerText", () => {
  it("names the end a scale answer leans toward instead of printing '4 / 5'", () => {
    expect(answerText(scale, 5)).toBe(scale.hi);
    expect(answerText(scale, 1)).toBe(scale.lo);
    expect(answerText(scale, 3)).toBe("somewhere in the middle");
  });

  it("uses the chosen option's own words for a multiple choice", () => {
    expect(answerText(mc, 1)).toBe(mc.opts![1]);
  });
});
