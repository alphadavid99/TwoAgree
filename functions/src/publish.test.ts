import { describe, it, expect } from "vitest";
import { levelSlots, stepSlots, publishUpdates, AT_TABLE_SLUG } from "./publish.js";
import { BANK, LEVELS } from "./questionBank.generated.js";

const slug = Object.keys(LEVELS).find((s) => LEVELS[s].length >= 2)!;
const [l0, l1] = [LEVELS[slug][0], LEVELS[slug][1]];

describe("levelSlots", () => {
  it("names exactly one part's questions", () => {
    expect(levelSlots(slug, 0)!.map((s) => s.qid)).toEqual(l0);
    expect(levelSlots(slug, 0)!.every((s) => s.slug === slug)).toBe(true);
  });
  it("is null for a part or deck that doesn't exist", () => {
    expect(levelSlots(slug, 99)).toBeNull();
    expect(levelSlots("no-such-deck", 0)).toBeNull();
  });
  it("covers every question in the bank exactly once", () => {
    const seen = Object.values(LEVELS).flat(2);
    expect(new Set(seen).size).toBe(seen.length);
    expect(seen.length).toBe(Object.keys(BANK).length);
  });
});

describe("stepSlots", () => {
  it("routes each bank question to its real deck, then the at-table prompt", () => {
    const qid = l0[0];
    const slots = stepSlots({ key: "table", qids: [qid, "NOPE-999"] });
    expect(slots).toEqual([
      { slug: BANK[qid].deck, qid },
      { slug: AT_TABLE_SLUG, qid: "table" },
    ]);
  });
});

describe("publishUpdates", () => {
  const priv = (decks: Record<string, unknown>) => ({ decks }) as never;

  it("copies both partners' answers, guesses and importance for the part", () => {
    const q = l0[0];
    const u = publishUpdates("ABCD", levelSlots(slug, 0)!, {
      host: priv({ [slug]: { answers: { [q]: 2 }, guesses: { [q]: 1 }, importance: { [q]: 5 } } }),
      guest: priv({ [slug]: { answers: { [q]: "__not_yet__" } } }),
    });
    expect(u).toEqual({
      [`sessions/ABCD/decks/${slug}/answers/${q}/host`]: 2,
      [`sessions/ABCD/decks/${slug}/guesses/${q}/host`]: 1,
      [`sessions/ABCD/decks/${slug}/importance/${q}/host`]: 5,
      [`sessions/ABCD/decks/${slug}/answers/${q}/guest`]: "__not_yet__",
    });
  });

  it("never copies answers from another part", () => {
    const other = l1[0];
    const u = publishUpdates("ABCD", levelSlots(slug, 0)!, {
      host: priv({ [slug]: { answers: { [other]: 3 } } }),
      guest: priv({ [slug]: { answers: { [other]: 4 } } }),
    });
    expect(u).toEqual({});
  });

  it("skips missing spaces and never writes null or object leaves", () => {
    const q = l0[0];
    const u = publishUpdates("ABCD", levelSlots(slug, 0)!, {
      host: null,
      guest: priv({ [slug]: { answers: { [q]: { nested: 1 } }, guesses: { [q]: null } } }),
    });
    expect(u).toEqual({});
  });
});
