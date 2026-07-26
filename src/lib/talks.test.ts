import { describe, it, expect } from "vitest";
import { talkList, talkStateOf, isPinned } from "./talks";
import { DECKS } from "./questions";
import type { DeckData } from "./scoring";

const SLUG = "in-the-home";
const [q1, q2] = DECKS[SLUG].questions;

const deckWith = (talks: DeckData["talks"]): Record<string, DeckData> => ({
  [SLUG]: { talks },
});

describe("talkStateOf", () => {
  it("reads the same node from either side of the couple", () => {
    const deck: DeckData = { talks: { [q1.id]: { pinned: { host: true } } } };
    expect(talkStateOf(SLUG, q1, deck, "host")).toMatchObject({
      pinnedByMe: true,
      pinnedByThem: false,
    });
    expect(talkStateOf(SLUG, q1, deck, "guest")).toMatchObject({
      pinnedByMe: false,
      pinnedByThem: true,
    });
  });

  it("is closed only when BOTH have confirmed the conversation happened", () => {
    const oneSided: DeckData = { talks: { [q1.id]: { talked: { host: true } } } };
    expect(talkStateOf(SLUG, q1, oneSided, "host").closed).toBe(false);
    const both: DeckData = {
      talks: { [q1.id]: { talked: { host: true, guest: true } } },
    };
    expect(talkStateOf(SLUG, q1, both, "host").closed).toBe(true);
  });
});

describe("talkList", () => {
  it("puts either partner's pin on the shared agenda", () => {
    const { open } = talkList(deckWith({ [q1.id]: { pinned: { guest: true } } }), "host");
    expect(open.map((s) => s.q.id)).toEqual([q1.id]);
    expect(isPinned(open[0])).toBe(true);
  });

  it("moves a topic to closed once both confirm, keeping it as evidence", () => {
    const { open, closed } = talkList(
      deckWith({
        [q1.id]: { pinned: { host: true } },
        [q2.id]: { pinned: { host: true }, talked: { host: true, guest: true } },
      }),
      "host",
    );
    expect(open.map((s) => s.q.id)).toEqual([q1.id]);
    expect(closed.map((s) => s.q.id)).toEqual([q2.id]);
  });

  it("drops a question that was pinned and then un-pinned", () => {
    const { open, closed } = talkList(
      deckWith({ [q1.id]: { pinned: { host: false, guest: false } } }),
      "host",
    );
    expect(open).toEqual([]);
    expect(closed).toEqual([]);
  });

  it("survives a talk node for a question no longer in the bank", () => {
    const { open } = talkList(deckWith({ "GONE-999": { pinned: { host: true } } }), "host");
    expect(open).toEqual([]);
  });

  it("is empty when nothing has been pinned", () => {
    expect(talkList(undefined, "host")).toEqual({ open: [], closed: [] });
  });
});
