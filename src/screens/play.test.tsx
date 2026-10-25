// @vitest-environment jsdom
//
// The question screens (design refresh, item 12): the next question appears at
// once while the answer saves; a failed save says so and can be retried; rank
// order can be fixed without starting over; importance is stored as 1, 3, 5.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lvlQs, nLevels } from "../lib/leveling";
import { ORDER } from "../lib/questions";

vi.mock("../firebase", () => ({ app: {}, auth: { currentUser: { uid: "u1" } }, db: {}, googleProvider: {} }));
vi.mock("../lib/functions", () => ({ publishPart: vi.fn() }));
const writes = vi.hoisted(() => ({
  writeAnswer: vi.fn(),
  writeGuess: vi.fn(),
  writeImportance: vi.fn(),
  markLevelDone: vi.fn(),
}));
vi.mock("../lib/session", () => writes);

import PlayScreen from "./PlayScreen";

const names = { host: "Sarah", guest: "Judah" };
const find = (pred: (q: ReturnType<typeof lvlQs>[number], i: number) => boolean) => {
  for (const slug of ORDER)
    for (let level = 0; level < nLevels(slug); level++) {
      const i = lvlQs(slug, level).findIndex(pred);
      if (i === 0) return { slug, level };
    }
  throw new Error("no part opens on such a question");
};
const play = (at: { slug: string; level: number }, onFinish = () => {}) =>
  render(
    <PlayScreen code="ABCD" slug={at.slug} level={at.level} role="host" deck={undefined}
      partnerName="Judah" names={names} onFinish={onFinish} onExit={() => {}} />,
  );

beforeEach(() => {
  Object.values(writes).forEach((f) => f.mockReset());
  writes.writeAnswer.mockResolvedValue(undefined);
  writes.writeGuess.mockResolvedValue(undefined);
  writes.writeImportance.mockResolvedValue(undefined);
  writes.markLevelDone.mockResolvedValue(undefined);
});
afterEach(cleanup);

describe("moving on never waits for the server", () => {
  it("shows the guess at once while the answer is still saving, then ✓ Saved", async () => {
    let land!: () => void;
    writes.writeAnswer.mockReturnValue(new Promise<void>((r) => (land = r)));
    play(find((q) => q.type === "mc" && !!q.guessable && q.depth < 4));
    await userEvent.click(screen.getAllByRole("button", { pressed: false })[1]);
    await userEvent.click(screen.getByRole("button", { name: /Next/ }));
    expect(screen.getByText(/what will/)).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Saving…");
    await act(async () => land());
    expect(screen.getByRole("status").textContent).toBe("✓ Saved");
  });

  it("says when an answer didn't save, keeps going, and Try again resends it", async () => {
    writes.writeAnswer.mockRejectedValueOnce(new Error("offline"));
    play(find((q) => q.type === "mc" && !!q.guessable && q.depth < 4));
    await userEvent.click(screen.getAllByRole("button", { pressed: false })[1]);
    await userEvent.click(screen.getByRole("button", { name: /Next/ }));
    expect(await screen.findByText(/didn’t save/)).toBeTruthy();
    expect(screen.getByText(/what will/)).toBeTruthy(); // still moving on
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(writes.writeAnswer).toHaveBeenCalledTimes(2);
    expect(await screen.findByText("✓ Saved")).toBeTruthy();
  });
});

describe("rank", () => {
  it("fixes the order with up and down, without starting over", async () => {
    play(find((q) => q.type === "rank"));
    const downs = screen.getAllByRole("button", { name: /^Move .* down$/ });
    await userEvent.click(downs[0]); // 0 ↓ → order 1,0,2,…
    const ups = screen.getAllByRole("button", { name: /^Move .* up$/ });
    await userEvent.click(ups[2]); // the third row up one
    await userEvent.click(screen.getByRole("button", { name: /This is my order|Finish part/ }));
    const stored = writes.writeAnswer.mock.calls[0][4] as string;
    expect(stored.split(",").slice(0, 3)).toEqual(["1", "2", "0"]);
  });
});

describe("importance and the last question", () => {
  it("offers A little · Somewhat · A lot, stored as 1, 3 and 5", async () => {
    play(find((q) => q.type === "mc" && (q.depth >= 4 || q.id.startsWith("DEAL-"))));
    await userEvent.click(screen.getAllByRole("button", { pressed: false })[1]);
    expect(screen.getByText("Optional")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "A lot" }));
    await userEvent.click(screen.getByRole("button", { name: /Next|Finish part/ }));
    await act(async () => {});
    expect(writes.writeImportance.mock.calls[0][4]).toBe(5);
  });

  it("the last question says what happens next, and Finish part saves before marking done", async () => {
    const onFinish = vi.fn();
    // A single-question view of a part: everything else already answered.
    const at = find(() => true);
    const qs = lvlQs(at.slug, at.level);
    const earlier = qs.slice(0, -1);
    const deck = {
      answers: Object.fromEntries(earlier.map((q) => [q.id, { host: 1 }])),
      guesses: Object.fromEntries(earlier.map((q) => [q.id, { host: 1 }])),
    };
    render(
      <PlayScreen code="ABCD" slug={at.slug} level={at.level} role="host" deck={deck}
        partnerName="Judah" names={names} onFinish={onFinish} onExit={() => {}} />,
    );
    expect(screen.getByText(/Once you’ve both finished this part, you’re ready to talk it through together\./)).toBeTruthy();
    const last = qs[qs.length - 1];
    if (last.type === "open") await userEvent.type(screen.getByRole("textbox"), "x");
    else if (last.type === "scale") await userEvent.click(screen.getAllByRole("button", { pressed: false })[2]);
    else if (last.type === "mc") await userEvent.click(screen.getAllByRole("button", { pressed: false })[1]);
    await userEvent.click(screen.getByRole("button", { name: /Finish part/ }));
    if (last.guessable && last.type !== "open") await userEvent.click(screen.getByRole("button", { name: "Skip" }));
    await act(async () => {});
    expect(writes.markLevelDone).toHaveBeenCalledTimes(1);
    expect(writes.writeAnswer.mock.invocationCallOrder[0]).toBeLessThan(writes.markLevelDone.mock.invocationCallOrder[0]);
    expect(onFinish).toHaveBeenCalled();
  });
});

describe("going back (feedback 15)", () => {
  it("steps back to the guess, then the answer, with both still picked, and a change is saved", async () => {
    const at = find((q, i) => i === 0 && q.type === "mc" && !q.who && !!q.guessable && q.depth < 4);
    play(at);
    const first = lvlQs(at.slug, at.level)[0];
    expect(screen.queryByRole("button", { name: /Back to the previous question/ })).toBeNull();
    // Answer the first question with its second option, and guess its third.
    await userEvent.click(screen.getAllByRole("button", { pressed: false })[1]);
    await userEvent.click(screen.getByRole("button", { name: /Next/ }));
    await userEvent.click(screen.getAllByRole("button", { pressed: false })[2]);
    await userEvent.click(screen.getByRole("button", { name: /my guess/ }));
    expect(screen.getByText(/^2 of/)).toBeTruthy();

    // Back lands on the guess with it still chosen…
    await userEvent.click(screen.getByRole("button", { name: /Back to the previous question/ }));
    expect(screen.getByText(/what will/)).toBeTruthy();
    expect(screen.getByRole("button", { pressed: true }).textContent).toContain(first.opts![2]);
    // …and again on the answer, still chosen.
    await userEvent.click(screen.getByRole("button", { name: /Back to the previous question/ }));
    expect(screen.queryByText(/what will/)).toBeNull();
    expect(screen.getByRole("button", { pressed: true }).textContent).toContain(first.opts![1]);

    // Changing it saves the new answer.
    await userEvent.click(screen.getAllByRole("button", { pressed: false })[0]);
    await userEvent.click(screen.getByRole("button", { name: /Next/ }));
    expect(writes.writeAnswer).toHaveBeenCalledTimes(2);
    expect(writes.writeAnswer.mock.calls[1][4]).not.toEqual(writes.writeAnswer.mock.calls[0][4]);
  });
});
