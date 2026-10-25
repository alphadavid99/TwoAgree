// @vitest-environment jsdom
//
// Sign-in and account fixes (design refresh, item 9): every error says what
// to do next, under the field it belongs to, and the email you typed is kept.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const fb = vi.hoisted(() => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));
vi.mock("firebase/auth", async (orig) => ({ ...(await orig<object>()), ...fb }));
vi.mock("../firebase", () => ({ app: {}, auth: { currentUser: null }, db: {}, googleProvider: {} }));

import AuthScreen from "./AuthScreen";

const fail = (code: string) => Object.assign(new Error(code), { code });
beforeEach(() => Object.values(fb).forEach((f) => f.mockReset()));
afterEach(cleanup);

describe("sign in", () => {
  it("has one heading, and the password can be shown", async () => {
    render(<AuthScreen initialMode="signin" />);
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    await userEvent.type(screen.getByLabelText("Password"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect((screen.getByLabelText("Password") as HTMLInputElement).type).toBe("text");
  });

  it("a wrong password offers the reset in the same panel", async () => {
    fb.signInWithEmailAndPassword.mockRejectedValue(fail("auth/invalid-credential"));
    fb.sendPasswordResetEmail.mockResolvedValue(undefined);
    render(<AuthScreen initialMode="signin" />);
    await userEvent.type(screen.getByLabelText("Email"), " sarah@example.invalid ");
    await userEvent.type(screen.getByLabelText("Password"), "wrong-one");
    await userEvent.click(screen.getByRole("button", { name: /Sign in →/ }));
    expect(await screen.findByText(/We couldn’t sign you in/)).toBeTruthy();
    expect(fb.signInWithEmailAndPassword.mock.calls[0][1]).toBe("sarah@example.invalid"); // tidied
    await userEvent.click(screen.getByRole("button", { name: "reset your password" }));
    expect(await screen.findByRole("heading", { name: "Check your email" })).toBeTruthy();
    expect(screen.getByText("sarah@example.invalid")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Back to sign in" }));
    expect((screen.getByLabelText("Email") as HTMLInputElement).value.trim()).toBe("sarah@example.invalid");
  });
});

describe("create account", () => {
  it("puts each error under its own field and keeps the email", async () => {
    render(<AuthScreen initialMode="signup" />);
    await userEvent.type(screen.getByLabelText("Email"), "sarah@");
    await userEvent.type(screen.getByLabelText("Password"), "abc");
    await userEvent.click(screen.getByRole("button", { name: /Create account →/ }));
    expect(screen.getByText("That doesn’t look like an email address.")).toBeTruthy();
    expect(screen.getByText("Use at least 6 characters.")).toBeTruthy();
    expect(screen.getByText("Tick this to create your account.")).toBeTruthy();
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("sarah@");
    expect(fb.createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it("an email that already has an account offers Sign in instead, keeping the email", async () => {
    fb.createUserWithEmailAndPassword.mockRejectedValue(fail("auth/email-already-in-use"));
    render(<AuthScreen initialMode="signup" />);
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.type(screen.getByLabelText("Email"), "sarah@example.invalid");
    await userEvent.type(screen.getByLabelText("Password"), "secret12");
    await userEvent.click(screen.getByRole("button", { name: /Create account →/ }));
    await userEvent.click(await screen.findByRole("button", { name: "Sign in instead" }));
    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeTruthy();
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("sarah@example.invalid");
  });
});
