import { describe, it, expect, beforeEach, vi } from "vitest";

const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
});

const {
  getOnbCheckpoint,
  setOnbCheckpoint,
  clearOnbCheckpoint,
  getLastDeck,
  setLastDeck,
} = await import("./local");

beforeEach(() => store.clear());

describe("onboarding checkpoint", () => {
  it("round-trips the flow position", () => {
    setOnbCheckpoint("u1", { flow: "b", step: "questions", code: "ABCD", role: "guest" });
    expect(getOnbCheckpoint("u1")).toMatchObject({
      flow: "b",
      step: "questions",
      code: "ABCD",
      role: "guest",
    });
  });

  it("is per-user, so two accounts on one device never cross", () => {
    setOnbCheckpoint("u1", { flow: "a", step: "invite" });
    expect(getOnbCheckpoint("u2")).toBeNull();
  });

  it("clears on hand-off", () => {
    setOnbCheckpoint("u1", { flow: "a", step: "menu" });
    clearOnbCheckpoint("u1");
    expect(getOnbCheckpoint("u1")).toBeNull();
  });

  it("treats a corrupt entry as no checkpoint rather than crashing the door", () => {
    store.set("aligned_onb_u1", "{not json");
    expect(getOnbCheckpoint("u1")).toBeNull();
  });
});

describe("last opened conversation", () => {
  it("is remembered per couple, not per user", () => {
    setLastDeck("u1", "ABCD", "faith-worship-practice");
    setLastDeck("u1", "WXYZ", "finances-money");
    expect(getLastDeck("u1", "ABCD")).toBe("faith-worship-practice");
    expect(getLastDeck("u1", "WXYZ")).toBe("finances-money");
  });

  it("is null before anything has been opened", () => {
    expect(getLastDeck("u1", "ABCD")).toBeNull();
  });
});
