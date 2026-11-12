// @vitest-environment jsdom
//
// The parts ring on Home's card: one segment per part, one colour of fill.
import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { PartsRing } from "./PartsRing";

afterEach(cleanup);

describe("PartsRing", () => {
  it("draws a segment per part and fills only the ones you've started", () => {
    const { container } = render(<PartsRing fills={[1, 0.5, 0]} />);
    expect(container.querySelectorAll("path.pring-track").length).toBe(3);
    const fills = container.querySelectorAll("path.pring-fill");
    expect(fills.length).toBe(2);
    // Finished: the whole segment. Part way: that share of it.
    expect(fills[0].getAttribute("stroke-dasharray")).toBeNull();
    expect(fills[1].getAttribute("stroke-dasharray")).toBe("0.5 2");
  });

  it("starts at twelve o'clock with equal gaps, and never fills past a part", () => {
    const { container } = render(<PartsRing fills={[3, -1]} />);
    const d = [...container.querySelectorAll("path.pring-track")].map((p) => p.getAttribute("d") ?? "");
    // Two halves: mirror images either side of the vertical through the centre.
    const xy = (s: string) => s.match(/-?\d+\.\d+/g)!.map(Number);
    const [ax, ay] = xy(d[0]);
    const b = xy(d[1]);
    expect(ax).toBeGreaterThan(60);
    expect(b[b.length - 2]).toBeCloseTo(120 - ax, 2);
    expect(b[b.length - 1]).toBeCloseTo(ay, 2);
    expect(container.querySelectorAll("path.pring-fill").length).toBe(1);
  });

  it("is one whole circle for a one-part conversation", () => {
    const { container } = render(<PartsRing fills={[0.25]} />);
    expect(container.querySelectorAll("path").length).toBe(0);
    expect(container.querySelector("circle.pring-fill")?.getAttribute("stroke-dasharray")).toBe("0.25 2");
  });
});
