// @vitest-environment jsdom
//
// The reveal ceremony on a fresh reveal (docs/split/DECISIONS.md, "Design"):
// three beats, a tap skips ahead, the card carries the score with its count,
// and "Not a verdict" lives on the answers screen, not on the card.
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lvlQs } from "../lib/leveling";
import { overall, type DeckData } from "../lib/scoring";

vi.mock("../firebase", () => ({ app: {}, auth: { currentUser: null }, db: {}, googleProvider: {} }));
vi.mock("../lib/functions", () => ({ publishPart: vi.fn() }));

import RevealScreen from "./RevealScreen";

afterEach(cleanup);

const SLUG = "in-the-home";

// Both answer everything; `differ` questions get different answers.
function deckWith(differ: number): DeckData {
  const deck: DeckData = { answers: {}, done: { 0: { host: true, guest: true } } };
  let left = differ;
  for (const q of lvlQs(SLUG, 0)) {
    if (q.type === "scale") {
      const apart = left > 0;
      if (apart) left--;
      deck.answers![q.id] = { host: 1, guest: apart ? 5 : 1 };
    } else if (q.type === "rank") {
      const v = q.opts!.map((_, i) => i).join(",");
      deck.answers![q.id] = { host: v, guest: v };
    } else if (q.type === "open") {
      deck.answers![q.id] = { host: "x", guest: "y" };
    } else {
      const apart = left > 0;
      if (apart) left--;
      deck.answers![q.id] = { host: 0, guest: apart ? 1 : 0 };
    }
  }
  return deck;
}

const open = (deck: DeckData) =>
  render(<RevealScreen slug={SLUG} level={0} role="host" deck={deck} myName="Sarah" partnerName="Judah" code="ABCD" onDone={() => {}} />);

const skipToCard = async () => {
  const el = document.querySelector(".rc") as HTMLElement;
  await userEvent.click(el); // beats 1 and 2 → the card
  await userEvent.click(el); // land the count
};

describe("the reveal ceremony", () => {
  it("opens on the two of you, and a tap skips to the settled card", async () => {
    open(deckWith(2));
    expect(screen.getByText("You've both answered.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /See your answers/ })).toBeNull();
    await skipToCard();
    expect(screen.getByRole("button", { name: /See your answers/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Share your score/ })).toBeTruthy();
  });

  it("shows the real score with its count, the counts and both names", async () => {
    const deck = deckWith(2);
    const pct = overall(lvlQs(SLUG, 0), deck, "host");
    expect(pct).toBeLessThan(100);
    open(deck);
    await skipToCard();
    const card = document.querySelector(".rc-card") as HTMLElement;
    expect(card.querySelector(".rc-num")!.textContent).toBe(`${pct}%`);
    expect(card.textContent).toContain("Sarah & Judah");
    expect(card.textContent).toMatch(/agreed on /);
    expect(card.textContent).toMatch(/Based on \d+ questions? you both answered/);
    expect(card.textContent).toMatch(/\d+ agreed · 2 to talk about/);
    expect(card.className).toContain("milk");
  });

  it("keeps 'Not a verdict' off the card and puts it on the answers screen", async () => {
    open(deckWith(2));
    await skipToCard();
    expect(screen.queryByText(/Not a verdict/)).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /See your answers/ }));
    expect(screen.getByText(/Not a verdict: a place to start talking\./)).toBeTruthy();
  });

  it("gives 100% the gold-line card and a choice of three when sharing", async () => {
    const deck = deckWith(0);
    expect(overall(lvlQs(SLUG, 0), deck, "host")).toBe(100);
    open(deck);
    await skipToCard();
    const card = document.querySelector(".rc-card") as HTMLElement;
    expect(card.className).toContain("goldline");
    expect(card.textContent).toMatch(/All \d+ agreed/);
    await userEvent.click(screen.getByRole("button", { name: /Share your score/ }));
    expect(screen.getByRole("button", { name: /Gold line/ }).getAttribute("aria-pressed")).toBe("true");
    await userEvent.click(screen.getByRole("button", { name: /Claret and gold/ }));
    expect(card.className).toContain("claret");
    await userEvent.click(screen.getByRole("button", { name: /Gilded/ }));
    expect(card.className).toContain("gilded");
  });

  it("offers no card choice under 100%", async () => {
    open(deckWith(2));
    await skipToCard();
    await userEvent.click(screen.getByRole("button", { name: /Share your score/ }));
    expect(screen.queryByRole("button", { name: /Gilded/ })).toBeNull();
  });

  it("at 100% the answers screen has no 'Not a verdict' line", async () => {
    open(deckWith(0));
    await skipToCard();
    await userEvent.click(screen.getByRole("button", { name: /See your answers/ }));
    expect(screen.queryByText(/Not a verdict/)).toBeNull();
  });
});
