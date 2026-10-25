import { describe, it, expect } from "vitest";
import { planFreshStart } from "./migrateFresh.js";

const members = { host: { uid: "s" }, guest: { uid: "j" } };

describe("planFreshStart", () => {
  it("clears every deck, the laid Path and both private spaces", () => {
    const s = {
      members,
      decks: { "in-the-home": { answers: { "HOME-001": { host: 0 } } } },
      path: { steps: {} },
      pathDone: { 0: { host: true } },
      pathPublished: { 0: true },
      pathLamps: { 0: true },
    };
    const { updates } = planFreshStart("ABCD", s, { host: { decks: {} }, guest: { decks: {} } });
    expect(updates).toEqual({
      "sessions/ABCD/decks": null,
      "sessions/ABCD/path": null,
      "sessions/ABCD/pathDone": null,
      "sessions/ABCD/pathPublished": null,
      "sessions/ABCD/pathLamps": null,
      "private/s/ABCD": null,
      "private/j/ABCD": null,
    });
  });

  it("never touches the couple: members, uids, names or the date to meet", () => {
    const { updates } = planFreshStart("ABCD", { members, decks: {} }, {});
    for (const path of Object.keys(updates)) {
      expect(path).not.toMatch(/members|uids|meetAt|created/);
    }
  });

  it("leaves a partner who hasn't joined alone, and a second run writes nothing", () => {
    const solo = { members: { host: { uid: "s" } }, decks: { x: {} } };
    expect(Object.keys(planFreshStart("ABCD", solo, { host: null }).updates)).toEqual(["sessions/ABCD/decks"]);
    expect(planFreshStart("ABCD", { members }, { host: null, guest: null }).updates).toEqual({});
  });
});
