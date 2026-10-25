import { describe, it, expect } from "vitest";
import { planWhoReask, WHO_IDS } from "./migrateWho.js";
import { LEVELS } from "./questionBank.generated.js";

const members = { host: { uid: "s" }, guest: { uid: "j" } };
const COOK = "HOME-001"; // in-the-home, part 1
const lvl = LEVELS["in-the-home"].findIndex((ids) => ids.includes(COOK));

describe("planWhoReask", () => {
  it("covers the 18 which-of-you questions", () => expect(WHO_IDS).toHaveLength(18));

  it("clears old Him/Her answers and guesses, and reopens the part for that person", () => {
    const { updates, cleared } = planWhoReask(
      "ABCD",
      {
        members,
        decks: {
          "in-the-home": {
            answers: { [COOK]: { host: 0, guest: 2 } },
            guesses: { [COOK]: { host: 2, guest: 1 } },
            done: { [lvl]: { host: true, guest: true } },
            published: { [lvl]: true },
          },
        },
      },
      {},
    );
    expect(updates).toEqual({
      [`sessions/ABCD/decks/in-the-home/answers/${COOK}/host`]: null,
      [`sessions/ABCD/decks/in-the-home/done/${lvl}/host`]: null,
      [`sessions/ABCD/decks/in-the-home/published/${lvl}`]: null,
      [`sessions/ABCD/decks/in-the-home/guesses/${COOK}/guest`]: null,
    });
    expect(cleared).toBe(2);
  });

  it("clears them in private spaces too, and reopens a Path step that held one", () => {
    const { updates } = planWhoReask(
      "ABCD",
      { members, path: { steps: { 3: { qids: [COOK] } } }, pathDone: { 3: { guest: true } } },
      { guest: { decks: { "in-the-home": { answers: { [COOK]: 1 } } } } },
    );
    expect(updates).toEqual({
      [`private/j/ABCD/decks/in-the-home/answers/${COOK}`]: null,
      "sessions/ABCD/pathDone/3/guest": null,
      "sessions/ABCD/pathPublished/3": null,
    });
  });

  it("leaves new answers, other options and other questions alone; a second run is a no-op", () => {
    const s = {
      members,
      decks: {
        "in-the-home": { answers: { [COOK]: { host: "host", guest: 3 } } },
        "roles-responsibilities": { answers: { "ROLE-006": { host: 0, guest: 1 } } },
      },
    };
    expect(planWhoReask("ABCD", s, {}).updates).toEqual({});
  });
});
