import { describe, it, expect } from "vitest";
import { talkEventIcs } from "./calendar";

describe("talkEventIcs", () => {
  it("is tomorrow at 7pm local for an hour, with no alarm", () => {
    const ics = talkEventIcs("TwoAgree: Faith, part 2", "Talk it through; together", new Date(2026, 9, 24, 23, 10));
    expect(ics).toContain("DTSTART:20261025T190000");
    expect(ics).toContain("DTEND:20261025T200000");
    expect(ics).toContain("SUMMARY:TwoAgree: Faith\\, part 2");
    expect(ics).toContain("DESCRIPTION:Talk it through\\; together");
    expect(ics).not.toContain("VALARM");
  });
});
