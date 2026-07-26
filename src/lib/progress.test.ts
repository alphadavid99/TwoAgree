import { describe, it, expect } from "vitest";
import { completedLevels, revealedQs, readyReveals, revealKey } from "./progress";
import { nLevels, lvlQs } from "./leveling";
import type { DeckData } from "./scoring";

// A partially-played deck: only levels BOTH partners finished are "revealed"
// (they score in Results and can be reviewed), later levels stay gated.
describe("revealed levels", () => {
  const slug = "us-compatibility"; // 40 questions → several levels
  const L = nLevels(slug);

  it("counts only mutually-finished levels", () => {
    const deck: DeckData = {
      done: {
        0: { host: true, guest: true }, // revealed
        1: { host: true }, // partner not done — gated
      },
    };
    expect(L).toBeGreaterThan(2);
    expect(completedLevels(slug, deck, "host")).toEqual([0]);
    expect(completedLevels(slug, deck, "guest")).toEqual([0]);
    expect(revealedQs(slug, deck, "host")).toEqual(lvlQs(slug, 0));
  });

  it("is empty when nothing is mutually finished", () => {
    expect(completedLevels(slug, { done: { 0: { host: true } } }, "host")).toEqual([]);
    expect(revealedQs(slug, undefined, "host")).toEqual([]);
  });
});

describe("readyReveals", () => {
  const deck = (done: Record<number, { host?: boolean; guest?: boolean }>) =>
    ({ done }) as DeckData;

  it("lists only levels both partners have finished", () => {
    const decks = {
      "in-the-home": deck({ 0: { host: true, guest: true }, 1: { host: true } }),
      "finances-money": deck({ 0: { guest: true } }),
    };
    expect(readyReveals(decks, "host")).toEqual([{ slug: "in-the-home", level: 0 }]);
  });

  it("reads the same for either partner — a reveal is mutual or it isn't", () => {
    const decks = { "in-the-home": deck({ 0: { host: true, guest: true } }) };
    expect(readyReveals(decks, "guest")).toEqual(readyReveals(decks, "host"));
  });

  it("is empty when nothing is finished", () => {
    expect(readyReveals({ "in-the-home": deck({ 0: { host: true } }) }, "host")).toEqual([]);
    expect(readyReveals(undefined, "host")).toEqual([]);
  });

  it("keys a reveal stably so 'already seen' survives a reload", () => {
    expect(revealKey("in-the-home", 2)).toBe("in-the-home#2");
  });
});
