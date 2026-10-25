import { describe, it, expect } from "vitest";
import { planMigration } from "./migratePrivate.js";
import { LEVELS } from "./questionBank.generated.js";

const SLUG = "fun-icebreakers";
const [p0, p1] = [LEVELS[SLUG][0], LEVELS[SLUG][1]];
const members = { host: { uid: "s" }, guest: { uid: "j" } };

describe("planMigration", () => {
  it("leaves an opened part shared and stamps it published", () => {
    const plan = planMigration("ABCD", {
      members,
      decks: { [SLUG]: { answers: { [p0[0]]: { host: 1, guest: 2 } }, done: { 0: { host: true, guest: true } } } },
    });
    expect(plan.updates).toEqual({
      [`sessions/ABCD/decks/${SLUG}/published/0`]: true,
      [`sessions/ABCD/decks/${SLUG}/started/0/host`]: true,
      [`sessions/ABCD/decks/${SLUG}/started/0/guest`]: true,
    });
    expect(plan.moved).toBe(0);
  });

  it("moves an unopened part's entries to each author's private space", () => {
    const q = p1[0];
    const plan = planMigration("ABCD", {
      members,
      decks: {
        [SLUG]: {
          answers: { [q]: { host: 3, guest: "__not_yet__" } },
          guesses: { [q]: { host: 1 } },
          importance: { [q]: { guest: 5 } },
          done: { 1: { host: true } },
        },
      },
    });
    expect(plan.updates).toMatchObject({
      [`private/s/ABCD/decks/${SLUG}/answers/${q}`]: 3,
      [`private/j/ABCD/decks/${SLUG}/answers/${q}`]: "__not_yet__",
      [`private/s/ABCD/decks/${SLUG}/guesses/${q}`]: 1,
      [`private/j/ABCD/decks/${SLUG}/importance/${q}`]: 5,
      [`sessions/ABCD/decks/${SLUG}/answers/${q}/host`]: null,
      [`sessions/ABCD/decks/${SLUG}/answers/${q}/guest`]: null,
      [`sessions/ABCD/decks/${SLUG}/started/1/host`]: true,
      [`sessions/ABCD/decks/${SLUG}/started/1/guest`]: true,
    });
    expect(plan.moved).toBe(4);
    expect(Object.keys(plan.updates).some((k) => k.includes("published"))).toBe(false);
  });

  it("keeps a Path step both walked open, even when its deck part isn't", () => {
    const [a, b] = p1;
    const plan = planMigration("ABCD", {
      members,
      decks: {
        [SLUG]: { answers: { [a]: { host: 1, guest: 1 }, [b]: { host: 0, guest: 2 } } },
        "at-table": { answers: { table: { host: "x", guest: "y" }, fork: { host: "only mine" } } },
      },
      path: { steps: { 0: { key: "table", qids: [a, b] }, 1: { key: "fork", qids: [] } } },
    });
    expect(plan.updates[`sessions/ABCD/pathPublished/0`]).toBe(true);
    expect(plan.updates[`sessions/ABCD/pathDone/0/host`]).toBe(true);
    expect(plan.updates[`sessions/ABCD/pathDone/0/guest`]).toBe(true);
    expect(plan.updates[`private/s/ABCD/decks/${SLUG}/answers/${a}`]).toBeUndefined();
    // Step 1 was walked by Sarah alone: her written answer goes private.
    expect(plan.updates[`sessions/ABCD/pathDone/1/host`]).toBe(true);
    expect(plan.updates[`private/s/ABCD/decks/at-table/answers/fork`]).toBe("only mine");
    expect(plan.updates[`sessions/ABCD/decks/at-table/answers/fork/host`]).toBeNull();
  });

  it("is a no-op the second time", () => {
    const s = {
      members,
      decks: { [SLUG]: { done: { 0: { host: true, guest: true } }, published: { 0: true }, started: { 1: { host: true } } } },
    };
    expect(planMigration("ABCD", s).updates).toEqual({});
  });

  it("leaves entries of someone who has left in place, and counts them", () => {
    const plan = planMigration("ABCD", {
      members: { host: { uid: "s" } },
      decks: { [SLUG]: { answers: { [p1[0]]: { guest: 2 } } } },
    });
    expect(plan.orphaned).toBe(1);
    expect(plan.updates[`sessions/ABCD/decks/${SLUG}/answers/${p1[0]}/guest`]).toBeUndefined();
  });
});
