import { describe, it, expect, vi, afterEach } from "vitest";

// errors.ts reads the language through i18n, which touches localStorage at
// import time. The suite runs in plain node, so stand one up before importing.
const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
});

const { prettyError } = await import("./errors");

afterEach(() => vi.restoreAllMocks());

describe("prettyError", () => {
  it("never leaks Firebase's machine text for an unmapped code", () => {
    // The exact shape captured in the UX review, under the password field.
    const err = { code: "auth/internal-error", message: "Firebase: Error (auth/internal-error)." };
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const out = prettyError(err);
    expect(out).not.toMatch(/Firebase|auth\//);
    expect(out).toBe("Something went wrong: please try again.");
  });

  it("maps the codes the account-linking flows actually throw", () => {
    expect(prettyError({ code: "auth/credential-already-in-use" })).toMatch(/already exists/i);
    expect(prettyError({ code: "auth/network-request-failed" })).toMatch(/offline/i);
    expect(prettyError({ code: "auth/popup-blocked" })).toMatch(/pop-ups/i);
  });

  it("speaks to a couple, not to a developer", () => {
    expect(prettyError({ code: "PERMISSION_DENIED" })).not.toMatch(/rules|console/i);
    expect(prettyError({ code: "auth/operation-not-allowed" })).not.toMatch(/Firebase|console/i);
  });

  it("still passes through our own human-written callable messages", () => {
    const err = { code: "functions/failed-precondition", message: "This invite link is invalid or already used." };
    expect(prettyError(err)).toBe("This invite link is invalid or already used.");
  });

  it("suppresses a bare message that is really a stack-trace prefix", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(prettyError({ message: "FirebaseError: boom" })).toBe(
      "Something went wrong: please try again.",
    );
  });
});
