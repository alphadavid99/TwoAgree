// @vitest-environment jsdom
// The review screen (design refresh, item 13): answers in words, never "4 / 5"
// or a heart slider; filters that count right; guesses in words.
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lvlQs, nLevels } from "../lib/leveling";
import { ORDER } from "../lib/questions";
import { scoreQ, jointQuestions, type DeckData } from "../lib/scoring";

vi.mock("../firebase", () => ({ app: {}, auth: { currentUser: null }, db: {}, googleProvider: {} }));
vi.mock("../lib/functions", () => ({ publishPart: vi.fn() }));
vi.mock("../lib/session", () => ({ writeTalkPin: vi.fn() }));

import RevealScreen from "./RevealScreen";

afterEach(cleanup);

// A part with scale and choice questions, half matched, half not, every one
// guessed (host right, guest wrong on scales).
const slug = ORDER.find((s) => nLevels(s) >= 1 && lvlQs(s, 0).some((q) => q.type === "scale") && lvlQs(s, 0).some((q) => q.type === "mc"))!;
function deck(): DeckData {
  const d: DeckData = { answers: {}, guesses: {}, done: { 0: { host: true, guest: true } } };
  lvlQs(slug, 0).forEach((q, i) => {
    if (q.type === "scale") {
      const g = i % 2 ? 4 : 2;
      d.answers![q.id] = { host: 4, guest: g };
      d.guesses![q.id] = { host: g, guest: 5 };
    } else if (q.type === "mc") {
      d.answers![q.id] = { host: 0, guest: i % 2 ? 0 : 1 };
    } else if (q.type === "rank") {
      const v = q.opts!.map((_, k) => k).join(",");
      d.answers![q.id] = { host: v, guest: v };
    } else {
      d.answers![q.id] = { host: "a", guest: "b" };
    }
  });
  return d;
}

const show = (data: DeckData) =>
  render(
    <RevealScreen slug={slug} level={0} role="host" deck={data} myName="Sarah" partnerName="Judah" review onDone={() => {}} />,
  );

describe("the review screen", () => {
  it("shows answers in words: no heart slider, no “4 / 5”", () => {
    const { container } = show(deck());
    expect(container.textContent).not.toMatch(/\d\s*\/\s*5/);
    expect(container.textContent).not.toContain("♥");
    expect(container.querySelector(".sbar-track")).toBeNull();
    expect(screen.getByRole("heading", { name: "Your answers, side by side" })).toBeTruthy();
  });

  it("filters show the right counts and the right cards", async () => {
    const data = deck();
    show(data);
    const rs = jointQuestions(lvlQs(slug, 0), data)
      .filter((q) => q.type !== "open")
      .map((q) => scoreQ(q, data, "host"));
    const agreed = rs.filter((r) => r.verdict === "Agreed" || r.verdict === "Complementary").length;
    const pill = (name: RegExp) => screen.getByRole("button", { name });
    expect(pill(/^All/).textContent).toContain(String(jointQuestions(lvlQs(slug, 0), data).length));
    expect(pill(/^Agreed/).textContent).toContain(String(agreed));
    expect(pill(/^Different/).textContent).toContain(String(rs.length - agreed));
    await userEvent.click(pill(/^Agreed/));
    expect(document.querySelectorAll(".qc .kbadge.agreed, .qc .kbadge.comp").length).toBe(agreed);
    expect(document.querySelectorAll(".qc .kbadge.chat, .qc .kbadge.close").length).toBe(0);
  });

  it("says guesses in words", () => {
    show(deck());
    expect(screen.getAllByText(/You guessed right/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Judah guessed/).length).toBeGreaterThan(0);
  });
});
