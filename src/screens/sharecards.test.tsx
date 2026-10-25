// @vitest-environment jsdom
//
// Share cards (design refresh, item 2): sensitive topic names never appear on
// a shared image. Checked twice: what the reveal hands the card renderer, and
// every string the renderers actually draw.
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lvlQs } from "../lib/leveling";
import { DECKS } from "../lib/questions";
import type { DeckData } from "../lib/scoring";

vi.mock("../firebase", () => ({ app: {}, auth: { currentUser: null }, db: {}, googleProvider: {} }));
vi.mock("../lib/functions", () => ({ publishPart: vi.fn() }));
vi.mock("../lib/session", () => ({ writeTalkPin: vi.fn() }));

const SENSITIVE = ["Intimacy", "The Past", "Deal-breakers", "Past & healing", "Intimacy & affection"];
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// A canvas that records what is drawn on it.
function fakeCanvas() {
  const drawn: string[] = [];
  const ctx = new Proxy(
    {
      fillText: (s: string) => void drawn.push(s),
      measureText: (s: string) => ({ width: s.length * 20 }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
    } as Record<string, unknown>,
    { get: (o, k) => (k in o ? o[k as string] : () => {}), set: () => true },
  );
  const orig = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
    const el = orig(tag);
    if (tag === "canvas") {
      (el as HTMLCanvasElement).getContext = (() => ctx) as never;
      (el as HTMLCanvasElement).toBlob = ((cb: (b: Blob) => void) => cb(new Blob())) as never;
    }
    return el;
  });
  (globalThis as { Path2D?: unknown }).Path2D ??= class {};
  return drawn;
}

describe("sensitive topics never reach a shared image", () => {
  it("the reveal's score card for Intimacy says only 'A TwoAgree conversation'", async () => {
    const drawn = fakeCanvas();
    const deck: DeckData = { answers: {}, done: { 0: { host: true, guest: true } } };
    for (const q of lvlQs("intimacy-physical", 0)) {
      const v = q.type === "scale" ? 4 : q.type === "rank" ? q.opts!.map((_, i) => i).join(",") : q.type === "open" ? "x" : 0;
      deck.answers![q.id] = { host: v, guest: v };
    }
    render(
      <RevealScreen slug="intimacy-physical" level={0} role="host" deck={deck} myName="Sarah" partnerName="Judah" code="ABCD" onDone={() => {}} />,
    );
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1300));
    });
    await userEvent.click(screen.getByRole("button", { name: /Share your score/ }));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    const text = drawn.join(" | ");
    expect(text).toContain("A TWOAGREE CONVERSATION");
    for (const word of SENSITIVE) expect(text.toLowerCase()).not.toContain(word.toLowerCase());
    expect(text).not.toContain("Sarah"); // names are off until switched on
    await userEvent.click(screen.getByRole("switch", { name: /Include our names/ }));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(drawn.join(" | ")).toContain("Sarah & Judah");
  });

  it("the progress card's 'closest' line is safe too", async () => {
    const { shareTopic } = await import("../lib/shareTopic");
    const { renderShareCard } = await import("../lib/sharecard");
    for (const slug of ["intimacy-physical", "past-baggage", "deal-breakers"]) {
      const drawn = fakeCanvas();
      await renderShareCard({
        myName: "Sarah",
        partnerName: "Judah",
        conversationsDone: 3,
        conversationsTotal: 21,
        closest: shareTopic(slug, "en"),
      });
      const text = drawn.join(" | ");
      expect(text).toContain("A TwoAgree conversation");
      expect(text).not.toContain(DECKS[slug].name);
      vi.restoreAllMocks();
    }
  });
});

import RevealScreen from "./RevealScreen";
