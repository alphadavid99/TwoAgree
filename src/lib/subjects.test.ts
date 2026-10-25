import { describe, it, expect } from "vitest";
import { SUBJECTS } from "./subjects";
import { ORDER } from "./questions";

describe("subject groups", () => {
  it("place every conversation in exactly one group", () => {
    const all = SUBJECTS.flatMap((g) => g.slugs);
    expect([...all].sort()).toEqual([...ORDER].sort());
    expect(new Set(all).size).toBe(all.length);
  });
  it("put Health with Life together", () => {
    expect(SUBJECTS.find((g) => g.key === "life")!.slugs).toContain("health-lifestyle");
  });
});
