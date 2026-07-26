import { describe, it, expect } from "vitest";
import { journeyStats, stepDeckData, stepQuestions } from "./path";
import { DECKS } from "./questions";
import type { Session, PathStepData } from "../types";

// Two real, guessable, scoreable questions from two different decks, so the
// fixtures exercise the same "pull each question from its own deck" routing the
// live Path uses.
const pick = (slug: string, n: number) =>
  DECKS[slug].questions.filter((q) => q.type !== "open" && q.guessable).slice(0, n);

const [a1, a2] = pick("in-the-home", 2);
const [b1, b2] = pick("fun-icebreakers", 2);

type Ans = { host: number; guest: number };

// Build a session with two walked steps. `agree` pairs answer identically;
// `guess` entries are what each partner predicted of the other.
function build(opts: {
  step0: { qs: typeof a1[]; ans: Ans[]; guesses?: Ans[] };
  step1: { qs: typeof a1[]; ans: Ans[]; guesses?: Ans[] };
  lamps?: Record<string, boolean>;
}): Session {
  const decks: NonNullable<Session["decks"]> = {};
  const put = (part: { qs: typeof a1[]; ans: Ans[]; guesses?: Ans[] }) => {
    part.qs.forEach((q, i) => {
      const slug = Object.keys(DECKS).find((s) =>
        DECKS[s].questions.some((x) => x.id === q.id),
      )!;
      decks[slug] ??= { answers: {}, guesses: {} };
      decks[slug].answers![q.id] = part.ans[i];
      if (part.guesses?.[i]) decks[slug].guesses![q.id] = part.guesses[i];
    });
  };
  put(opts.step0);
  put(opts.step1);

  const steps: Record<string, PathStepData> = {
    // Real step keys so stepMeta() resolves the waypoint name and glyph.
    "0": { key: "trailhead", mechanic: "guess", qids: opts.step0.qs.map((q) => q.id) },
    "1": { key: "fork", mechanic: "guess", qids: opts.step1.qs.map((q) => q.id) },
  };
  return {
    decks,
    path: { generatedAt: 1, version: 1, questionCount: 4, steps },
    pathLamps: opts.lamps ?? { 0: true, 1: true },
  } as unknown as Session;
}

// Both steps fully agreed except one question on the second — so the two
// waypoints score differently and brightest/hardest are unambiguous.
const split = build({
  step0: { qs: [a1, a2], ans: [{ host: 3, guest: 3 }, { host: 4, guest: 4 }] },
  step1: { qs: [b1, b2], ans: [{ host: 1, guest: 5 }, { host: 2, guest: 5 }] },
});

describe("journeyStats", () => {
  it("scores the whole road, not one waypoint", () => {
    const j = journeyStats(split, "host");
    expect(j.agreed).not.toBeNull();
    expect(j.scored).toBe(4);
    expect(j.walked).toBe(2);
    expect(j.total).toBe(2);
  });

  it("names the brightest and the most-worth-a-conversation waypoint", () => {
    const j = journeyStats(split, "host");
    expect(j.brightest?.key).toBe("trailhead");
    expect(j.hardest?.key).toBe("fork");
    expect(j.brightest!.pct).toBeGreaterThan(j.hardest!.pct);
    expect(j.brightest?.name).toBeTruthy();
  });

  it("reads the same from either side of the couple", () => {
    const mine = journeyStats(split, "host");
    const theirs = journeyStats(split, "guest");
    expect(theirs.agreed).toBe(mine.agreed);
    expect(theirs.brightest?.key).toBe(mine.brightest?.key);
  });

  it("counts only walked steps — an unlit waypoint is not in the number", () => {
    const halfway = build({
      step0: { qs: [a1, a2], ans: [{ host: 3, guest: 3 }, { host: 4, guest: 4 }] },
      step1: { qs: [b1, b2], ans: [{ host: 1, guest: 5 }, { host: 2, guest: 5 }] },
      lamps: { 0: true },
    });
    const j = journeyStats(halfway, "host");
    expect(j.walked).toBe(1);
    expect(j.scored).toBe(2);
    // One waypoint can't be both the brightest and the hardest — with nothing
    // to contrast, the Lookout shows neither rather than naming the same step twice.
    expect(j.brightest).toBeNull();
    expect(j.hardest).toBeNull();
  });

  it("scores Known over guesses actually made, not questions asked", () => {
    const guessed = build({
      step0: {
        qs: [a1, a2],
        ans: [{ host: 3, guest: 3 }, { host: 4, guest: 4 }],
        // host predicts guest right on the first, wrong on the second.
        guesses: [{ host: 3, guest: 3 }, { host: 1, guest: 4 }],
      },
      step1: { qs: [b1, b2], ans: [{ host: 1, guest: 5 }, { host: 2, guest: 5 }] },
    });
    const j = journeyStats(guessed, "host");
    expect(j.guesses).toBe(4); // two questions, both partners guessed each
    expect(j.right).toBe(3);
    expect(j.known).toBe(75);
  });

  it("survives an empty path rather than throwing at the finale", () => {
    const j = journeyStats({ decks: {} } as unknown as Session, "host");
    expect(j).toMatchObject({ agreed: null, known: null, walked: 0, total: 0 });
  });
});

describe("stepDeckData", () => {
  it("gathers a step's questions out of their real decks", () => {
    const step: PathStepData = {
      key: "trailhead",
      mechanic: "guess",
      qids: [a1.id, b1.id],
    };
    const merged = stepDeckData(split, step);
    // a1 and b1 live in different decks; the step sees both as one DeckData.
    expect(Object.keys(merged.answers!).sort()).toEqual([a1.id, b1.id].sort());
    // The at-table open prompt is appended after the bank questions.
    expect(stepQuestions(step).at(-1)?.type).toBe("open");
  });
});
