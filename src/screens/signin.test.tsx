// @vitest-environment jsdom
//
// Item 9's bug: on a phone nobody has signed in on before, "Already have an
// account? Sign in" opened the Create account form. "Sign in" must always
// open sign-in, and "Create one" must always open create.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Onboarding from "./Onboarding";

vi.mock("../firebase", () => ({
  app: {},
  auth: { currentUser: null },
  db: {},
  googleProvider: {},
}));
vi.mock("../lib/functions", () => ({
  createInvite: vi.fn(),
  exportMyData: vi.fn(),
  deleteMyAccount: vi.fn(),
  joinByCode: vi.fn(),
  redeemInvite: vi.fn(),
  generatePath: vi.fn(),
}));

beforeEach(() => localStorage.clear());
afterEach(cleanup);

async function openSignIn() {
  render(<Onboarding invite={null} onDone={() => {}} />);
  await userEvent.click(screen.getByRole("button", { name: /Already have an account/ }));
}

describe("Sign in from the front door", () => {
  it("opens the sign-in form on a fresh browser", async () => {
    await openSignIn();
    expect(screen.getByRole("button", { name: /Sign in →/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Create account →/ })).toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull(); // no sign-up consent box
  });

  it("opens the sign-in form on a returning browser too", async () => {
    localStorage.setItem("aligned_returning", "1");
    await openSignIn();
    expect(screen.getByRole("button", { name: /Sign in →/ })).toBeTruthy();
  });

  it("'Create one' always opens create", async () => {
    await openSignIn();
    await userEvent.click(screen.getByRole("button", { name: /Create one/ }));
    expect(screen.getByRole("button", { name: /Create account →/ })).toBeTruthy();
  });
});
