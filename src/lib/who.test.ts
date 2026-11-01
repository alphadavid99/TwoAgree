import { describe, it, expect } from "vitest";
import { optValue, optIndex, optText, withNames, isLegacyWho, asTheirs, forGuess } from "./who";
import { scoreQ } from "./scoring";
import { DECKS } from "./questions";

const ALL = Object.values(DECKS).flatMap((d) => d.questions);

const cooking = DECKS["in-the-home"].questions.find((q) => q.id === "HOME-012")!;
const names = { host: "Sarah Placeholder", guest: "Judah" };

describe("which-of-you questions", () => {
  it("show both names, in the same order, whoever is looking", () => {
    // Both phones build the options from the session's host and guest, never
    // from "me" and "them", so Sarah and Judah see one list.
    expect(withNames(cooking, names).opts).toEqual([
      "Mostly Sarah",
      "Mostly Judah",
      "Split roughly equally",
      "Whoever enjoys it or is better at it",
      "Whoever has more time",
    ]);
  });

  it("store who was picked, not the position", () => {
    expect(optValue(cooking, 0)).toBe("host");
    expect(optValue(cooking, 1)).toBe("guest");
    expect(optValue(cooking, 2)).toBe(2);
    expect(optIndex(cooking, "guest")).toBe(1);
    expect(optText(withNames(cooking, names), "host")).toBe("Mostly Sarah");
  });

  it("matching answers score as agreed, from both sides", () => {
    const deck = { answers: { "HOME-012": { host: "host" as const, guest: "host" as const } } };
    expect(scoreQ(cooking, deck, "host").verdict).toBe("Agreed");
    expect(scoreQ(cooking, deck, "guest").verdict).toBe("Agreed");
    const differ = { answers: { "HOME-012": { host: "host" as const, guest: "guest" as const } } };
    expect(scoreQ(cooking, differ, "guest").verdict).toBe("Worth a chat");
  });

  it("an answer to the old Him / Her wording can't be read, and is flagged to re-ask", () => {
    expect(optIndex(cooking, 0)).toBeNull();
    expect(optText(cooking, 1)).toBeUndefined();
    expect(isLegacyWho(cooking, 0)).toBe(true);
    expect(isLegacyWho(cooking, 2)).toBe(false);
    expect(isLegacyWho(cooking, "host")).toBe(false);
  });

  it("leaves every other question alone, including husband/wife roles", () => {
    const roles = DECKS["faith-worship-practice"].questions.find((q) => q.id === "FAITH-038")!;
    const named = withNames(roles, names);
    expect(named.q).toBe(roles.q);
    expect(named.opts).toEqual(roles.opts);
    expect(roles.opts![0]).toBe("The husband");
    expect(optValue(roles, 0)).toBe(0);
  });

  it("covers exactly the 17 which-of-you questions, and no Him / Her is left", () => {
    const who = Object.values(DECKS).flatMap((d) => d.questions.filter((q) => q.who));
    expect(who).toHaveLength(17);
    for (const q of Object.values(DECKS).flatMap((d) => d.questions)) {
      // "Him" for God and "her role" in a belief about roles are fine; an option
      // that just names Him or Her as one of you is not.
      expect((q.opts ?? []).some((o) => /^(mostly |mainly )?(him|her)$/i.test(o.trim())), q.id).toBe(false);
    }
  });
});

describe("who's speaking: the partner is named, never 'me'", () => {
  const names = { host: "Sarah Placeholder", guest: "Judah", me: "host" as const };
  const ask = (id: string) => ALL.find((q) => q.id === id)!;

  it("names your partner in the question, and in your own choices", () => {
    const q = withNames(ask("US-053"), names);
    expect(q.q).toBe("What makes you feel most emotionally chosen by Judah?");
    expect(q.opts?.[0]).toBe("When Judah prioritises time with me");
  });

  it("shows your partner's answer in their words", () => {
    const q = withNames(ask("US-053"), names);
    expect(asTheirs(q).opts?.[0]).toBe("When Sarah prioritises time with me");
    expect(asTheirs(q).q).toBe(q.q);
  });

  it("asks the guess about your partner, with their choices", () => {
    const g = forGuess(withNames(ask("US-053"), names));
    expect(g.q).toBe("What makes Judah feel most emotionally chosen by you?");
    expect(g.opts?.[0]).toBe("When Sarah prioritises time with me");
  });

  it("reads the same from the other phone", () => {
    const q = withNames(ask("NOW-003"), { ...names, me: "guest" });
    expect(q.q).toBe("How well do you feel Sarah understands you?");
    expect(forGuess(q).q).toBe("How well does Sarah feel you understand them?");
  });

  it("leaves no question in the bank speaking as I or me", () => {
    for (const q of ALL) {
      expect(/\b(I|me|my|mine)\b/.test(q.q), q.id).toBe(false);
      if (q.guessable && q.q.includes("{P}")) expect(q.qGuess, q.id).toBeTruthy();
    }
  });
});
