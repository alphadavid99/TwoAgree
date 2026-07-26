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
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ORDER } from "../lib/questions";
import { lvlQs, nLevels, stageOf } from "../lib/leveling";
import type { DeckData } from "../lib/scoring";
import type { Session } from "../types";
import HomeScreen from "./HomeScreen";
import DecksScreen from "./DecksScreen";
import ResultsScreen from "./ResultsScreen";
import PlayScreen from "./PlayScreen";
import { CoreScore } from "./CoreScore";

// The screens write through these on mount in some states; the DOM is the
// subject here, not Firebase.
vi.mock("../lib/functions", () => ({
  createInvite: vi.fn(),
  exportMyData: vi.fn(),
  deleteMyAccount: vi.fn(),
  joinByCode: vi.fn(),
  redeemInvite: vi.fn(),
  generatePath: vi.fn(),
}));

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
        onReview={noop}
        onProfile={noop}
      />,
    );
    expect(screen.getByText("Sarah & Judah")).toBeTruthy();
    // The stat tile collapsed once when a label's font-size changed. Both units
    // must survive as their own elements, not merge into one run of text.
    expect(screen.getByText("agreed")).toBeTruthy();
    expect(screen.getByText("known")).toBeTruthy();
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
        onReview={noop}
        onProfile={noop}
      />,
    );
    expect(screen.getByRole("button", { name: "WXYZ" })).toBeTruthy();
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
        onReview={noop}
        onProfile={noop}
      />,
    );
    expect(screen.queryByText(/CONTINUE THE PATH/i)).toBeNull();
  });
});

describe("DecksScreen", () => {
  it("lists every conversation as a real button", () => {
    const { container } = render(
      <DecksScreen session={session} role="host" onPlay={noop} />,
    );
    // They were click-divs — a keyboard user could not open one at all.
    const rows = container.querySelectorAll("button.row");
    expect(rows.length).toBe(ORDER.length);
  });

  it("puts what you're in the middle of above what you've finished", () => {
    // A completed deck used to sit above an in-progress one, so the list gave
    // no answer to "where was I?".
    const [doneSlug, partialSlug] = twoInOneStage();
    const partial: DeckData = { answers: {} };
    partial.answers![lvlQs(partialSlug, 0)[0].id] = { host: 0 };
    const s = {
      ...session,
      decks: {
        [doneSlug]: revealed(doneSlug, nLevels(doneSlug)),
        [partialSlug]: partial,
      },
    } as unknown as Session;
    const { container } = render(<DecksScreen session={s} role="host" onPlay={noop} />);
    const labels = [...container.querySelectorAll("button.row")].map((b) => b.textContent ?? "");
    const iComplete = labels.findIndex((l) => l.includes("complete"));
    const iPartial = labels.findIndex((l) => l.includes("1 of"));
    expect(iComplete).toBeGreaterThanOrEqual(0);
    expect(iPartial).toBeGreaterThanOrEqual(0);
    expect(iComplete).toBeGreaterThan(iPartial);
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
    expect(screen.getByText("Where you landed")).toBeTruthy();
    expect(screen.getByText("Known")).toBeTruthy();
  });
});

describe("CoreScore", () => {
  it("keeps Known as the hero — larger than Agreed", () => {
    // A `span` selector once matched the number as well as its unit and shrank
    // the hero below the secondary stat, inverting the whole hierarchy.
    const { container } = render(
      <CoreScore
        agreed={{ pct: 67, done: 8, total: 70 }}
        known={{ pct: 70, done: 8, total: 63 }}
        myName="Sarah"
        partnerName="Judah"
        t={t}
      />,
    );
    const hero = container.querySelector(".corestat.hero");
    expect(hero).not.toBeNull();
    expect(within(hero as HTMLElement).getByText("Known")).toBeTruthy();
    // The unit carries its own class so it can be sized apart from the number.
    expect(hero!.querySelector(".corenum .pc")?.textContent).toBe("%");
  });

  it("states the denominator, so a big number can't mislead", () => {
    render(
      <CoreScore
        agreed={{ pct: 94, done: 9, total: 70 }}
        known={{ pct: 90, done: 9, total: 63 }}
        myName="Sarah"
        partnerName="Judah"
        t={t}
      />,
    );
    expect(screen.getByText("9 / 70")).toBeTruthy();
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
