// @vitest-environment jsdom
//
// Talk about this (design refresh, items 3 and 13; on Home's cards since Nov
// 2026): "We talked" is asked, never reported; the guide's "We talked about
// this" saves your tick and note. Together is the score, then Past
// conversations: only what you've both opened.
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
import { TalkCard } from "../components/TalkCard";
import { talkNext } from "../lib/talkNext";
import { namesFor } from "../lib/who";

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
const t = (en: string) => en;
const show = (s: Session) => {
  const next = talkNext(s.decks, "host").next[0];
  return render(
    <TalkCard
      s={next}
      code="ABCD"
      role="host"
      lang="en"
      names={namesFor(s.members, "host", "Sarah", "Judah")}
      me={{ name: "Sarah", tone: "berry" }}
      them={{ name: "Judah", tone: "honey" }}
      t={t}
      kind="Talk about this"
    />,
  );
};

describe("Talk about this", () => {
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

describe("Together", () => {
  it("is the score, front and centre, with Past conversations and Share", () => {
    render(<ResultsScreen session={session({})} role="host" code="ABCD" />);
    expect(screen.getByRole("heading", { name: "Together" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Past conversations →" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Share your card" })).toBeTruthy();
    // Talk about next and the conversation tiles live elsewhere now.
    expect(screen.queryByText("Talk about next")).toBeNull();
  });

  it("Past conversations lists only what you've both opened, and opens a part to review", async () => {
    const onPart = vi.fn();
    const { container } = render(<ResultsScreen session={session({})} role="host" code="ABCD" onPart={onPart} />);
    await userEvent.click(screen.getByRole("button", { name: "Past conversations →" }));
    expect(screen.getByRole("heading", { name: "Past conversations" })).toBeTruthy();
    expect(screen.getByRole("searchbox")).toBeTruthy();
    expect(container.querySelectorAll("button.cv-circ:not(.fy)").length).toBe(1);
    const parts = container.querySelectorAll("button.cv-part");
    expect(parts.length).toBe(1);
    await userEvent.click(parts[0] as HTMLElement);
    expect(onPart).toHaveBeenCalledWith(slug, 0);
  });
});
