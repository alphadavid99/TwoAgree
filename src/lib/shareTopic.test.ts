import { describe, it, expect } from "vitest";
import { shareTopic, SENSITIVE_DECKS } from "./shareTopic";
import { DECKS } from "./questions";

describe("shareTopic — what a shared card says about the topic", () => {
  it("never names Intimacy, the past or deal-breakers", () => {
    for (const slug of SENSITIVE_DECKS) {
      for (const lang of ["en", "fr"] as const) {
        const label = shareTopic(slug, lang, 0);
        expect(label).toMatch(/TwoAgree/);
        expect(label).not.toContain(DECKS[slug].name);
      }
    }
    for (const step of ["garden", "valley", "summit"]) {
      expect(shareTopic(step, "en")).toBe("A TwoAgree conversation");
    }
  });

  it("names everything else, with the part when there are several", () => {
    expect(shareTopic("fun-icebreakers", "en", 0)).toBe("Fun · Part 1");
    expect(shareTopic("career-ambition", "en", 0)).toBe("Work");
    expect(shareTopic("table", "en")).toBe("The Table");
  });
});
