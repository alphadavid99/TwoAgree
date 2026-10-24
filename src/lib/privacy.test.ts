import { describe, it, expect } from "vitest";
import { mergePrivate, unpublished, startedLevel } from "./privacy";
import { lvlQs } from "./leveling";
import { levelComplete } from "./progress";
import type { Session } from "../types";

const SLUG = "fun-icebreakers";
const [q0, q1] = lvlQs(SLUG, 0).map((q) => q.id);
const base = (decks: Session["decks"], extra: Partial<Session> = {}): Session => ({
  members: { host: { name: "Sarah", uid: "s" }, guest: { name: "Judah", uid: "j" } },
  decks,
  ...extra,
});

describe("mergePrivate", () => {
  it("lays your own unpublished answers under your role", () => {
    const shared = base({ [SLUG]: { started: { 0: { host: true } } } });
    const m = mergePrivate(shared, { decks: { [SLUG]: { answers: { [q0]: 2 }, guesses: { [q0]: 1 } } } }, "host")!;
    expect(m.decks![SLUG].answers![q0]).toEqual({ host: 2 });
    expect(m.decks![SLUG].guesses![q0]).toEqual({ host: 1 });
    expect(m.decks![SLUG].started).toEqual({ 0: { host: true } });
  });

  it("keeps published answers from both of you", () => {
    const shared = base({ [SLUG]: { answers: { [q0]: { host: 2, guest: 3 } }, done: { 0: { host: true, guest: true } }, published: { 0: true } } });
    const m = mergePrivate(shared, { decks: { [SLUG]: { answers: { [q0]: 2, [q1]: 0 } } } }, "guest")!;
    expect(m.decks![SLUG].answers![q0]).toEqual({ host: 2, guest: 2 });
    expect(m.decks![SLUG].answers![q1]).toEqual({ guest: 0 });
    expect(levelComplete(m.decks![SLUG], 0, "guest")).toBe(true);
  });

  it("treats a part both finished but not yet published as not open", () => {
    const shared = base({ [SLUG]: { done: { 0: { host: true, guest: true } } } });
    const m = mergePrivate(shared, null, "host")!;
    expect(levelComplete(m.decks![SLUG], 0, "host")).toBe(false);
    expect(m.decks![SLUG].done![0]).toEqual({ host: true });
    expect(shared.decks![SLUG].done![0]).toEqual({ host: true, guest: true }); // input untouched
  });

  it("returns the shared session unchanged when you have no seat", () => {
    const shared = base({});
    expect(mergePrivate(shared, { decks: { [SLUG]: { answers: { [q0]: 1 } } } }, null)).toBe(shared);
    expect(mergePrivate(null, null, "host")).toBeNull();
  });
});

describe("unpublished", () => {
  it("lists parts and Path steps both finished that the server hasn't published", () => {
    const s = base(
      {
        [SLUG]: { done: { 0: { host: true, guest: true }, 1: { host: true, guest: true }, 2: { host: true } }, published: { 1: true } },
        "at-table": { done: { 0: { host: true, guest: true } } },
      },
      { pathDone: { 0: { host: true, guest: true }, 1: { host: true } }, pathPublished: {} },
    );
    expect(unpublished(s)).toEqual([{ slug: SLUG, level: 0 }, { step: 0 }]);
  });
});

describe("startedLevel", () => {
  it("reads the shared started and done flags", () => {
    expect(startedLevel({ started: { 0: { guest: true } } }, 0, "guest")).toBe(true);
    expect(startedLevel({ done: { 1: { guest: true } } }, 1, "guest")).toBe(true);
    expect(startedLevel({ started: { 0: { host: true } } }, 0, "guest")).toBe(false);
    expect(startedLevel(undefined, 0, "guest")).toBe(false);
  });
});
