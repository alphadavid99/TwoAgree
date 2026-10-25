import { describe, it, expect } from "vitest";
import { cleanFirstName, inviteLink, parseInvite } from "./invite";

describe("invite links carry the inviter's first name", () => {
  it("round-trips a token link with a name", () => {
    const link = inviteLink("https://twoagree.app", { token: "abc-123" }, "Sarah Placeholder");
    expect(link).toBe("https://twoagree.app/?t=abc-123&n=Sarah");
    expect(parseInvite(new URL(link).search)).toEqual({ kind: "token", value: "abc-123", from: "Sarah" });
  });

  it("keeps the bare-code fallback working, with or without a name", () => {
    expect(parseInvite("?c=ab12&n=Zoë")).toEqual({ kind: "code", value: "AB12", from: "Zoë" });
    expect(parseInvite("?c=AB12")).toEqual({ kind: "code", value: "AB12" });
    expect(parseInvite("")).toBeNull();
  });

  it("never lets the name carry markup or more than a first name", () => {
    expect(cleanFirstName("<b>Sarah</b>")).toBe("bSarahb");
    expect(cleanFirstName("  O’Neil-Smith  Jones")).toBe("O’Neil-Smith");
    expect(cleanFirstName("A".repeat(40))).toHaveLength(20);
    expect(cleanFirstName("   ")).toBeUndefined();
  });
});
