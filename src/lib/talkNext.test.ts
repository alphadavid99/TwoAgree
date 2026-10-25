import { describe, it, expect } from "vitest";
import { talkNext } from "./talkNext";
import { lvlQs, nLevels } from "./leveling";
import { ORDER } from "./questions";
import type { DeckData } from "./scoring";
import type { Session } from "../types";

// A revealed part where the mc answers differ, so there is something to talk about.
const slug = ORDER.find((s) => nLevels(s) >= 1 && lvlQs(s, 0).filter((q) => q.type === "mc").length >= 3)!;
const mcs = lvlQs(slug, 0).filter((q) => q.type === "mc");
function deck(talks: DeckData["talks"] = {}): Session["decks"] {
  const d: DeckData = { answers: {}, done: { 0: { host: true, guest: true } }, talks };
  for (const q of lvlQs(slug, 0)) {
    d.answers![q.id] =
      q.type === "mc" ? { host: 0, guest: 1 } : q.type === "scale" ? { host: 3, guest: 3 } : q.type === "rank" ? { host: "0,1", guest: "0,1" } : { host: "a", guest: "b" };
  }
  return { [slug]: d };
}

describe("talk about next", () => {
  it("puts first what your partner ticked, then untouched ones, then ones you're waiting on", () => {
    const { next } = talkNext(
      deck({
        [mcs[0].id]: { pinned: { host: true }, talked: { host: true } },
        [mcs[1].id]: { pinned: { host: true } },
        [mcs[2].id]: { pinned: { guest: true }, talked: { guest: true } },
      }),
      "host",
    );
    expect(next.map((n) => n.q.id)).toEqual([mcs[2].id, mcs[1].id, mcs[0].id]);
    expect(next.every((n) => !n.suggested)).toBe(true);
  });

  it("with nothing on the list, suggests a difference you haven't talked about", () => {
    const { next } = talkNext(deck({ [mcs[0].id]: { pinned: { host: true }, talked: { host: true, guest: true } } }), "host");
    expect(next).toHaveLength(1);
    expect(next[0].suggested).toBe(true);
    expect(next[0].r.verdict).toBe("Worth a chat");
    expect(next[0].q.id).not.toBe(mcs[0].id);
  });

  it("dates a talked-about question by the second tick and gathers both notes, yours first", () => {
    const { talked } = talkNext(
      deck({
        [mcs[0].id]: {
          pinned: { guest: true },
          talked: { host: true, guest: true },
          at: { host: 2000, guest: 1000 },
          note: { guest: "Theirs", host: "Mine" },
        },
        [mcs[1].id]: { talked: { host: true, guest: true }, at: { host: 5000 } },
      }),
      "host",
    );
    expect(talked.map((x) => x.q.id)).toEqual([mcs[0].id, mcs[1].id]);
    expect(talked[0].at).toBe(2000);
    expect(talked[0].notes).toEqual(["Mine", "Theirs"]);
    // Only one tick dated: no date shown rather than a wrong one.
    expect(talked[1].at).toBeNull();
  });
});
