// @vitest-environment jsdom
//
// Shorter onboarding (design refresh, item 8). The person who starts:
// Welcome · Names and stage · Consent · 5 questions · 5 guesses · Account ·
// Invite · Where would you like to start? = 16 screens. The person invited:
// Invitation · Name · Consent · 5 + 5 · First reveal · Account · Start = 16.
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Onboarding from "./Onboarding";
import { DECKS } from "../lib/questions";
import { STARTER_QIDS } from "../lib/onboarding";

vi.mock("../firebase", () => ({ app: {}, auth: { currentUser: null }, db: {}, googleProvider: {} }));
vi.mock("../lib/functions", () => ({
  createInvite: vi.fn(),
  joinByCode: vi.fn(),
  redeemInvite: vi.fn(),
  publishPart: vi.fn(),
}));
afterEach(cleanup);

describe("onboarding, the person who starts", () => {
  it("asks names and stage on one screen, then goes straight to consent", async () => {
    render(<Onboarding invite={null} onDone={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.getByRole("heading", { name: "Let’s begin" })).toBeTruthy();
    await userEvent.type(screen.getByLabelText("Your name"), "Sarah");
    await userEvent.type(screen.getByLabelText("And who are you doing this with?"), "Judah");
    const go = screen.getByRole("button", { name: /Continue/ });
    expect((go as HTMLButtonElement).disabled).toBe(true); // stage still needed
    await userEvent.click(screen.getByRole("button", { name: "Engaged" }));
    await userEvent.click(go);
    expect(screen.getByRole("heading", { name: "Before we start." })).toBeTruthy();
  });

  it("has five starter questions, each with its own guess screen", () => {
    const byId = new Map(DECKS["fun-icebreakers"].questions.map((q) => [q.id, q]));
    const qs = STARTER_QIDS.map((id) => byId.get(id)!);
    expect(qs).toHaveLength(5);
    expect(qs.every((q) => q.guessable && q.type !== "open")).toBe(true);
  });
});
