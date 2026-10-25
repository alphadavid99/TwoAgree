// @vitest-environment jsdom
//
// You (design refresh, item 15): a settings list; Download my data with a real
// error and Try again; Delete with no Cancel once it has started.
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../firebase", () => ({ app: {}, auth: { currentUser: null }, db: {}, googleProvider: {} }));
vi.mock("firebase/auth", async (orig) => ({ ...(await orig<object>()), signOut: vi.fn() }));
const fns = vi.hoisted(() => ({
  exportMyData: vi.fn(),
  deleteMyAccount: vi.fn(),
}));
vi.mock("../lib/functions", () => fns);
vi.mock("../hooks/useProfile", () => ({
  useProfile: () => ({ profile: { name: "Sarah", bio: "A line", notify: true }, loading: false, saveProfile: vi.fn(async () => {}) }),
}));

import ProfileScreen from "./ProfileScreen";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const user = { uid: "u1", email: "sarah@example.invalid", displayName: "Sarah" } as never;
const show = () =>
  render(<ProfileScreen user={user} code="TEST" partnerName="Judah" myNameHere="Sarah" onLeave={() => {}} />);

describe("You", () => {
  it("is a settings list with the reveal email worded for item 5", () => {
    show();
    expect(screen.getByRole("switch", { name: /Email me when a reveal is ready/ }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByText("Once you’ve both finished a part. Never a reminder to Judah.")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Close this session on this device/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /What Judah sees/ })).toBeTruthy();
    expect(screen.queryByText(/Leave this session|Erase everything/)).toBeNull();
  });

  it("Download my data: a failure is a red alert with Try again", async () => {
    fns.exportMyData.mockRejectedValueOnce(new Error("offline"));
    show();
    await userEvent.click(screen.getByRole("button", { name: /^Download my data/ }));
    expect(screen.getByText(/Judah’s answers aren’t included/)).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Download" }));
    expect(screen.getByRole("alert").textContent).toMatch(/couldn’t create your download/);
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
  });

  it("Delete: says what's kept, and there's no Cancel once deletion starts", async () => {
    fns.deleteMyAccount.mockReturnValueOnce(new Promise(() => {}));
    show();
    await userEvent.click(screen.getByRole("button", { name: "Delete my account" }));
    expect(screen.getByText(/your consent record/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Delete my account" }));
    expect(fns.deleteMyAccount).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Deleting your account…" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });

  it("Edit profile never claims Judah sees the photo or line", async () => {
    show();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByText(/Judah sees you as “Sarah” in this one/)).toBeTruthy();
    expect(screen.getByText(/Judah doesn’t see them/)).toBeTruthy();
  });
});
