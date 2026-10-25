// @vitest-environment jsdom
//
// The Path map (design refresh, item 14): every step is a real button with a
// spoken name and state, so the map works by keyboard and screen reader as
// well as touch. And the Trailhead opens before both of you have answered.
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Session } from "../types";
import { PATH_STEPS } from "../data/path.generated";

vi.mock("../firebase", () => ({ app: {}, auth: { currentUser: null }, db: {}, googleProvider: {} }));

import { PathMap } from "./PathMap";

afterEach(cleanup);
const t = (en: string) => en;

const KEYS = PATH_STEPS.slice(0, 9).map((s) => s.key);
const full = (lamps: number): Session =>
  ({
    members: { host: { name: "Sarah", uid: "u1" }, guest: { name: "Judah", uid: "u2" } },
    path: { steps: Object.fromEntries(KEYS.map((key, i) => [i, { key, mechanic: "guess", qids: [] }])) },
    pathLamps: Object.fromEntries(Array.from({ length: lamps }, (_, i) => [i, true])),
  }) as unknown as Session;
const partial = (walked: boolean): Session =>
  ({
    members: { host: { name: "Sarah", uid: "u1" }, guest: { name: "Judah", uid: "u2" } },
    path: { partial: true, steps: { 0: { key: "trailhead", mechanic: "guess", qids: [] } } },
    pathLamps: walked ? { 0: true } : {},
  }) as unknown as Session;

describe("the Path map", () => {
  it("names every step for a screen reader, with where you are", () => {
    render(<PathMap session={full(3)} role="host" partnerName="Judah" onOpen={() => {}} t={t} />);
    const stops = screen.getAllByRole("button", { name: /^Step \d+, / });
    expect(stops).toHaveLength(10);
    const here = stops.find((b) => b.getAttribute("aria-current") === "step")!;
    expect(here.getAttribute("aria-label")).toBe("Step 4, The Table, Family, children & in-laws: you are here");
    expect(stops[0].getAttribute("aria-label")).toMatch(/: walked$/);
    expect(stops[6].getAttribute("aria-label")).toMatch(/: not open yet$/);
  });

  it("opens a step from the keyboard, and says why a step ahead isn't open", async () => {
    const onOpen = vi.fn();
    render(<PathMap session={full(3)} role="host" partnerName="Judah" onOpen={onOpen} t={t} />);
    const here = screen.getByRole("button", { name: /you are here/ });
    here.focus();
    await userEvent.keyboard("{Enter}");
    expect(onOpen).toHaveBeenCalledWith(3);
    await userEvent.click(screen.getByRole("button", { name: /^Step 8,/ }));
    expect(screen.getByRole("status").textContent).toMatch(/one step at a time/);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("starts with the Trailhead before Judah has answered the path questions", async () => {
    const onOpen = vi.fn();
    render(<PathMap session={partial(false)} role="host" partnerName="Judah" onOpen={onOpen} t={t} />);
    expect(screen.getByText("Start with The Trailhead")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Take the first step" }));
    expect(onOpen).toHaveBeenCalledWith(0);
    await userEvent.click(screen.getByRole("button", { name: /^Step 2,/ }));
    expect(screen.getByRole("status").textContent).toMatch(/once Judah has answered the path questions/);
  });

  it("after the Trailhead, says the Fork is being chosen, never the Lookout", () => {
    render(<PathMap session={partial(true)} role="host" partnerName="Judah" onOpen={() => {}} t={t} />);
    expect(screen.getByText("Next: The Fork")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Continue" })).toBeNull();
    expect(screen.getByRole("button", { name: /^Step 10,/ }).getAttribute("aria-label")).toMatch(/not open yet/);
  });
});
