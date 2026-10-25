// @vitest-environment jsdom
//
// Smoke tests: every screen renders, and the handful of things that would be
// embarrassing to ship broken are asserted.
//
// Why these exist: 108 tests covered pure logic and not one rendered a screen,
// so during the UX build a CSS edit inverted the Core headline's size hierarchy
// and another collapsed Home's stat tiles — both caught only because a human
// looked at a screenshot. These are not a replacement for looking; they are the
// floor beneath it.
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { ORDER } from "../lib/questions";
import { lvlQs, nLevels, partName } from "../lib/leveling";
import { readyReveals } from "../lib/progress";
import type { DeckData } from "../lib/scoring";
import type { Session } from "../types";
import HomeScreen from "./HomeScreen";
import DecksScreen from "./DecksScreen";
import PartPicker from "./PartPicker";
import userEvent from "@testing-library/user-event";
import ResultsScreen from "./ResultsScreen";
import PlayScreen from "./PlayScreen";

// The DOM is the subject here, not Firebase. src/firebase.ts calls getAuth()
// at module load, which throws `auth/invalid-api-key` wherever VITE_FIREBASE_*
// isn't set — true in CI, and not true on a machine with a .env.local, which
// is exactly how this passed locally and failed on the first CI run. Mocked so
// these tests never depend on any environment at all.
vi.mock("../firebase", () => ({
  app: {},
  auth: { currentUser: null },
  db: {},
  googleProvider: {},
}));
vi.mock("../lib/functions", () => ({
  createInvite: vi.fn(),
  exportMyData: vi.fn(),
  deleteMyAccount: vi.fn(),
  joinByCode: vi.fn(),
  redeemInvite: vi.fn(),
  generatePath: vi.fn(),
}));

// Unmount after every test: a screen left mounted keeps its timers, which then
// fire after this file's jsdom is torn down ("window is not defined" under a
// loaded parallel run).
afterEach(cleanup);

const t = (en: string) => en;
const noop = () => {};

const slugA = ORDER.find((s) => nLevels(s) >= 2) ?? ORDER[0];

/** Both partners answered `levels` levels of `slug` — a real revealed score. */
function revealed(slug: string, levels = 1): DeckData {
  const deck: DeckData = { answers: {}, guesses: {}, done: {} };
  for (let l = 0; l < levels; l++) {
    lvlQs(slug, l).forEach((q, i) => {
      const v = q.type === "scale" ? 3 : q.type === "rank" ? q.opts!.map((_, k) => k).join(",") : 0;
      const other =
        q.type === "scale" ? (i % 2 ? 3 : 5) : q.type === "rank" ? v : i % 2 ? 0 : 1;
      deck.answers![q.id] = { host: v, guest: other };
    });
    deck.done![l] = { host: true, guest: true };
  }
  return deck;
}

/** Two decks from the SAME stage bucket — rows are grouped by stage first, so
 *  an ordering assertion across buckets would prove nothing. */
function twoInOneStage(): [string, string] {
  const byStage = new Map<number, string[]>();
  for (const slug of ORDER) {
    const st = stageOf(slug);
    byStage.set(st, [...(byStage.get(st) ?? []), slug]);
  }
  const pair = [...byStage.values()].find((g) => g.length >= 2)!;
  return [pair[0], pair[1]];
}

const session = {
  created: 0,
  members: { host: { name: "Sarah", uid: "u1" }, guest: { name: "Judah", uid: "u2" } },
  decks: { [slugA]: revealed(slugA) },
} as unknown as Session;

const empty = {
  created: 0,
  members: { host: { name: "Sarah", uid: "u1" }, guest: { name: "Judah", uid: "u2" } },
  decks: {},
} as unknown as Session;

describe("HomeScreen", () => {
  it("renders both partners and the two headline numbers", () => {
    render(
      <HomeScreen
        code="ABCD"
        session={session}
        role="host"
        slug={slugA}
        onPlay={noop}
        onBrowse={noop}
        onTogether={noop}
      />,
    );
    expect(screen.getByText("Sarah & Judah")).toBeTruthy();
    // The soft scores card: two rings, each named with its count.
    expect(screen.getByText("Agree")).toBeTruthy();
    expect(screen.getByText("Known")).toBeTruthy();
    expect(screen.getByText(/^based on \d+ questions?$/)).toBeTruthy();
  });

  it("has one honey button: the next step (item 10)", () => {
    const { container } = render(
      <HomeScreen code="ABCD" session={session} role="host" slug={slugA} onPlay={noop} onBrowse={noop} onTogether={noop} onPath={noop} />,
    );
    expect(container.querySelectorAll(".btn.pill, .btn.honey").length).toBe(1);
  });

  it("shows the code to share while the partner hasn't joined", () => {
    const solo = { ...empty, members: { host: { name: "Sarah", uid: "u1" } } } as Session;
    render(
      <HomeScreen
        code="WXYZ"
        session={solo}
        role="host"
        slug={slugA}
        onPlay={noop}
        onBrowse={noop}
        onTogether={noop}
      />,
    );
    expect(screen.getByRole("button", { name: /WXYZ/ }).textContent).toBe("WXYZ");
  });

  it("loads with both partners' Path at-the-table answers in the session", () => {
    // The at-table deck is synthetic (not in the bank). readyReveals once
    // crashed SessionApp on it; Home and its reveal list must just skip it.
    const withTable = {
      ...session,
      decks: {
        ...session.decks,
        "at-table": { answers: { table: { host: "Something honest.", guest: "Mine too." } } },
      },
    } as unknown as Session;
    const pending = readyReveals(withTable.decks, "host");
    expect(pending.every((r) => r.slug !== "at-table")).toBe(true);
    render(
      <HomeScreen
        code="ABCD"
        session={withTable}
        role="host"
        slug={slugA}
        pending={pending}
        onOpenReveal={noop}
        onPlay={noop}
        onBrowse={noop}
        onTogether={noop}
      />,
    );
    expect(screen.getByText("Sarah & Judah")).toBeTruthy();
  });

  it("omits the Path card when the Path is behind its flag", () => {
    render(
      <HomeScreen
        code="ABCD"
        session={session}
        role="host"
        slug={slugA}
        onPlay={noop}
        onBrowse={noop}
        onTogether={noop}
      />,
    );
    expect(screen.queryByText(/CONTINUE THE PATH/i)).toBeNull();
  });
});

describe("DecksScreen", () => {
  it("lists every conversation as a real button, grouped by subject", () => {
    const { container } = render(
      <DecksScreen session={session} role="host" onPlay={noop} />,
    );
    // They were click-divs — a keyboard user could not open one at all.
    const rows = container.querySelectorAll("button.cv-row");
    expect(rows.length).toBe(ORDER.length);
    expect(screen.getByRole("heading", { name: "Light to start" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Deeper and honest" })).toBeTruthy();
  });

  it("talks in parts, never question counts (item 11)", () => {
    const { container } = render(<DecksScreen session={empty} role="host" onPlay={noop} />);
    expect(container.textContent).not.toMatch(/\d+ questions/);
    expect(container.textContent).toMatch(/\d+ parts?/);
  });

  it("puts where you left off first, and search narrows the list", async () => {
    const partialSlug = slugA;
    const partial: DeckData = { answers: { [lvlQs(partialSlug, 0)[0].id]: { host: 0 } } };
    const s = { ...session, decks: { [partialSlug]: partial } } as unknown as Session;
    const { container } = render(<DecksScreen session={s} role="host" onPlay={noop} current={partialSlug} />);
    expect(screen.getByText("Pick up where you left off")).toBeTruthy();
    await userEvent.type(screen.getByRole("searchbox"), "  MONEY ");
    expect(container.querySelectorAll("button.cv-row").length).toBe(1);
  });
});

describe("PartPicker", () => {
  it("names every part and shows both of you on each", () => {
    const { container } = render(
      <PartPicker slug={slugA} deck={revealed(slugA)} role="host" myName="Sarah" partnerName="Judah" onSelect={noop} onExit={noop} />,
    );
    for (let i = 0; i < nLevels(slugA); i++) expect(screen.getByText(partName(slugA, i))).toBeTruthy();
    expect(container.textContent).not.toMatch(/Part \d/);
    expect(container.querySelectorAll(".pp-row .pp-avs").length).toBe(nLevels(slugA));
    expect(screen.getByText(/Opened together/)).toBeTruthy();
  });
});

describe("ResultsScreen", () => {
  it("previews the promise on day zero instead of empty machinery", () => {
    render(<ResultsScreen session={empty} role="host" code="ABCD" onOpen={noop} />);
    expect(screen.getByText(/This is where Sarah and Judah meet/)).toBeTruthy();
    expect(screen.getByText(/Start your first conversation/)).toBeTruthy();
    // No rings reading "—%".
    expect(screen.queryByText("Known")).toBeNull();
  });

  it("switches to the real scoreboard once something is revealed", () => {
    render(<ResultsScreen session={session} role="host" code="ABCD" onOpen={noop} />);
    expect(screen.getByRole("heading", { name: "Sarah & Judah" })).toBeTruthy();
    expect(screen.getByText("Known")).toBeTruthy();
  });
});

describe("PlayScreen", () => {
  it("renders answer options as buttons a keyboard can reach", () => {
    const mc = lvlQs(slugA, 0).find((q) => q.type === "mc");
    if (!mc) return; // deck shape changed; the other screens still cover this
    const { container } = render(
      <PlayScreen
        code="ABCD"
        slug={slugA}
        level={0}
        role="host"
        deck={undefined}
        partnerName="Judah"
        onFinish={noop}
        onExit={noop}
      />,
    );
    const opts = container.querySelectorAll("button.opt, button.orb");
    expect(opts.length).toBeGreaterThan(0);
    opts.forEach((o) => expect(o.getAttribute("aria-pressed")).toBe("false"));
  });

  it("keeps the CTA disabled until something is chosen", () => {
    const { container } = render(
      <PlayScreen
        code="ABCD"
        slug={slugA}
        level={0}
        role="host"
        deck={undefined}
        partnerName="Judah"
        onFinish={noop}
        onExit={noop}
      />,
    );
    const cta = container.querySelector("button.btn:not(.ghost)") as HTMLButtonElement;
    expect(cta.disabled).toBe(true);
  });
});

describe("which-of-you questions show names, in the same order for both", () => {
  // HOME-012 opens part 1 of Home: "How would you want us to divide the cooking at home?"
  const names = { host: "Sarah Placeholder", guest: "Judah Placeholder" };
  const optionsFor = (role: "host" | "guest") => {
    const { container, unmount } = render(
      <PlayScreen
        code="ABCD"
        slug="in-the-home"
        level={0}
        role={role}
        deck={undefined}
        partnerName={role === "host" ? "Judah" : "Sarah"}
        names={names}
        onFinish={noop}
        onExit={noop}
      />,
    );
    const texts = [...container.querySelectorAll("button.opt")].map((b) => b.textContent?.trim());
    unmount();
    return texts;
  };
  it("lists Sarah then Judah on both phones, never Him / Her", () => {
    const host = optionsFor("host");
    const guest = optionsFor("guest");
    expect(host.slice(0, 2)).toEqual(["Mostly Sarah", "Mostly Judah"]);
    expect(guest).toEqual(host);
    expect(host.join(" ")).not.toMatch(/\b(him|her)\b/i);
  });
});
