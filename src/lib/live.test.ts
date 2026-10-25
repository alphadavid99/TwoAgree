import { describe, expect, it, vi } from "vitest";

vi.mock("../firebase", () => ({ db: {} }));
import { incoming, isOpen, LIVE_OPEN_MS, type LiveRequest } from "./live";

const r = (o: Partial<LiveRequest> = {}): LiveRequest => ({ from: "host", slug: "home", level: 0, status: "asked", at: 1_000, ...o });

describe("a request to start a part together", () => {
  it("is open while asked and under ten minutes old", () => {
    expect(isOpen(r(), 1_000 + LIVE_OPEN_MS - 1)).toBe(true);
    expect(isOpen(r(), 1_000 + LIVE_OPEN_MS)).toBe(false);
    expect(isOpen(r({ status: "declined" }), 2_000)).toBe(false);
    expect(isOpen(undefined, 2_000)).toBe(false);
  });

  it("reaches only the partner it was sent to", () => {
    expect(incoming(r(), "guest", 2_000)).toBe(true);
    expect(incoming(r(), "host", 2_000)).toBe(false);
    expect(incoming(r({ status: "accepted" }), "guest", 2_000)).toBe(false);
  });
});
