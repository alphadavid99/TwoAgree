// @vitest-environment jsdom
//
// The motion helpers behind the Nov 2026 motion pass: release speed, the
// spring, pointing at a field, and icon line weights.
import { describe, expect, it, vi } from "vitest";
import { Velocity, flagField, spring } from "./motion";
import { iconLine } from "./iconLine";

describe("Velocity", () => {
  it("measures release speed over the last ~80ms only", () => {
    const v = new Velocity();
    v.push(0, 0);
    v.push(100, 500); // an old, slow move
    v.push(110, 520);
    v.push(150, 560); // a quick flick at the end
    // The sample at 0ms is past the 80ms window and dropped: 50px over 60ms.
    expect(Math.round(v.get())).toBe(833);
  });
  it("reads 0 with nothing to compare", () => {
    expect(new Velocity().get()).toBe(0);
  });
});

describe("spring", () => {
  it("settles on its target", () => {
    let now = 0;
    const frames: ((t: number) => void)[] = [];
    vi.spyOn(performance, "now").mockImplementation(() => now);
    vi.stubGlobal("requestAnimationFrame", (f: (t: number) => void) => frames.push(f));
    let x = 0;
    let done = false;
    spring(0, 200, 0, (v) => (x = v), () => (done = true));
    for (let i = 0; i < 200 && !done; i++) {
      now += 16;
      frames.shift()?.(now);
    }
    expect(done).toBe(true);
    expect(x).toBe(200);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
});

describe("flagField", () => {
  it("focuses the field even where nothing can animate", () => {
    const input = document.createElement("input");
    document.body.append(input);
    flagField(input);
    expect(document.activeElement).toBe(input);
    input.remove();
  });
});

describe("iconLine", () => {
  it("keeps lines the same in pixels: thinner small, heavier large", () => {
    expect(iconLine(18)).toBe(1.75);
    expect(iconLine(24)).toBe(2);
    expect(iconLine(64)).toBe(2.5);
  });
});
