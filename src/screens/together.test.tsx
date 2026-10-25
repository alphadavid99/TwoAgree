// @vitest-environment jsdom
//
// Together (design refresh, items 3 and 13): "We talked" is asked, never
// reported; the guide's "We talked about this" saves your tick and note.
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lvlQs, nLevels } from "../lib/leveling";
import { ORDER } from "../lib/questions";
import type { DeckData } from "../lib/scoring";
import type { Session } from "../types";

vi.mock("../firebase", () => ({ app: {}, auth: { currentUser: null }, db: {}, googleProvider: {} }));
vi.mock("../lib/functions", () => ({ publishPart: vi.fn() }));
const writes = vi.hoisted(() => ({ writeTalked: vi.fn(async () => {}), writeTalkPin: vi.fn(async () => {}), NOTE_MAX: 280 }));
vi.mock("../lib/session", () => writes);

import ResultsScreen from "./ResultsScreen";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const slug = ORDER.find((s) => nLevels(s) >= 1 && lvlQs(s, 0).some((q) => q.type === "mc"))!;
const mc = lvlQs(slug, 0).find((q) => q.type === "mc")!;
function session(talks: DeckData["talks"]): Session {
  const d: DeckData = { answers: {}, done: { 0: { host: true, guest: true } }, talks };
  for (const q of lvlQs(slug, 0))
    d.answers![q.id] = q.type === "scale" ? { host: 2, guest: 4 } : q.type === "rank" ? { host: "0,1", guest: "1,0" } : q.type === "open" ? { host: "a", guest: "b" } : { host: 0, guest: 1 };
  return {
    created: 0,
    members: { host: { name: "Sarah", uid: "u1" }, guest: { name: "Judah", uid: "u2" } },
    decks: { [slug]: d },
  } as unknown as Session;
}
const show = (s: Session) => render(<ResultsScreen session={s} role="host" code="ABCD" onOpen={() => {}} onBrowse={() => {}} />);

describe("Together", () => {
  it("asks “Have you talked this through yet?” without saying who ticked", () => {
    const { container } = show(session({ [mc.id]: { pinned: { guest: true }, talked: { guest: true } } }));
    expect(screen.getByText("Have you talked this through yet?")).toBeTruthy();
    expect(container.textContent).not.toMatch(/Judah (says|ticked|has ticked)/);
  });

  it("“Yes, we have” saves your tick", async () => {
    show(session({ [mc.id]: { pinned: { guest: true }, talked: { guest: true } } }));
    await userEvent.click(screen.getByRole("button", { name: "Yes, we have" }));
    expect(writes.writeTalked).toHaveBeenCalledWith("ABCD", slug, mc.id, "host", true, "");
  });

  it("after you tick, says it moves once your partner ticks too", () => {
    show(session({ [mc.id]: { pinned: { host: true }, talked: { host: true } } }));
    expect(screen.getByText(/once Judah ticks it too/)).toBeTruthy();
  });

  it("the guide saves your tick and the note; a suggestion goes on the list too", async () => {
    show(session({}));
    await userEvent.click(screen.getByRole("button", { name: "Talk it through" }));
    await userEvent.type(screen.getByRole("textbox"), "Try a joint account");
    await userEvent.click(screen.getByRole("button", { name: "We talked about this" }));
    const [[code, s, qid, role, on, note]] = writes.writeTalked.mock.calls as unknown as [string, string, string, string, boolean, string][];
    expect([code, s, role, on, note]).toEqual(["ABCD", slug, "host", true, "Try a joint account"]);
    expect(writes.writeTalkPin).toHaveBeenCalledWith("ABCD", slug, qid, "host", true);
  });

  it("shows one honey button at most", () => {
    const { container } = show(session({}));
    expect(container.querySelectorAll(".btn.pill, .btn.honey").length).toBeLessThanOrEqual(1);
  });
});
