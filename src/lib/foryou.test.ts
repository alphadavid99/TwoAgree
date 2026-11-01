import { describe, expect, it, vi } from "vitest";

vi.mock("../firebase", () => ({ db: {} }));
import { forYou } from "./foryou";
import { isFresh, isWaiting, KEEP_MS, POPUP_MS, type Invite } from "./invites";
import { ORDER } from "./questions";
import { nLevels } from "./leveling";
import type { Session } from "../types";

const slug = ORDER.find((s) => nLevels(s) >= 2)!;
const inv = (o: Partial<Invite> = {}): Invite => ({ from: "guest", slug, level: 0, status: "asked", at: 1_000, ...o });
const sess = (o: Partial<Session> = {}): Session => ({ created: 1, members: {}, ...o }) as Session;

describe("an invite to do a part together", () => {
  it("pops up only while fresh, and only for the partner it was sent to", () => {
    expect(isFresh(inv(), "host", 1_000 + POPUP_MS - 1)).toBe(true);
    expect(isFresh(inv(), "host", 1_000 + POPUP_MS)).toBe(false);
    expect(isFresh(inv(), "guest", 2_000)).toBe(false);
    expect(isFresh(inv({ status: "later" }), "host", 2_000)).toBe(false);
  });

  it("keeps waiting after Not right now, for a fortnight", () => {
    expect(isWaiting(inv({ status: "later" }), 2_000)).toBe(true);
    expect(isWaiting(inv(), 1_000 + KEEP_MS)).toBe(false);
    expect(isWaiting(inv({ status: "accepted" }), 2_000)).toBe(false);
    expect(isWaiting(inv({ status: "cancelled" }), 2_000)).toBe(false);
  });
});

describe("For you", () => {
  it("lists your partner's invite until you start that part", () => {
    const s = sess({ invites: { [`${slug}~0`]: inv({ status: "later" }) } });
    expect(forYou(s, "host", 2_000).map((i) => i.kind)).toEqual(["invite"]);
    const begun = sess({ ...s, decks: { [slug]: { started: { 0: { host: true } } } } });
    expect(forYou(begun, "host", 2_000)).toEqual([]);
  });

  it("shows the invite you sent until your partner starts it", () => {
    const s = sess({ invites: { [`${slug}~0`]: inv({ from: "host" }) } });
    expect(forYou(s, "host", 2_000).map((i) => i.kind)).toEqual(["sent"]);
    expect(forYou(s, "guest", 2_000).map((i) => i.kind)).toEqual(["invite"]);
  });

  it("shows what your partner has started and finished, never what's opened", () => {
    const s = sess({
      decks: {
        [slug]: {
          started: { 0: { guest: true }, 1: { guest: true } },
          done: { 0: { guest: true }, 1: {} },
        },
      },
    });
    expect(forYou(s, "host", 2_000).map((i) => [i.kind, i.level])).toEqual([
      ["theyFinished", 0],
      ["theyStarted", 1],
    ]);
    const both = sess({ decks: { [slug]: { done: { 0: { guest: true, host: true } } } } });
    expect(forYou(both, "host", 2_000)).toEqual([]);
  });
});
