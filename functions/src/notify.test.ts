import { describe, it, expect } from "vitest";
import { shouldNotify, revealReadyEmail, QUIET_MS, type NotifyInput } from "./notify.js";

const NOW = 1_700_000_000_000;
const base: NotifyInput = {
  finisher: "guest",
  otherAlreadyDone: true,
  recipientOptedIn: true,
  recipientEmail: "sarah@example.com",
  lastNotifiedMs: null,
  nowMs: NOW,
};

describe("shouldNotify — who gets it, and when", () => {
  it("emails the partner who was waiting, not the one who just finished", () => {
    expect(shouldNotify(base)).toEqual({
      send: true,
      to: "sarah@example.com",
      recipient: "host",
    });
    expect(shouldNotify({ ...base, finisher: "host" })).toMatchObject({
      send: true,
      recipient: "guest",
    });
  });

  it("stays silent until BOTH have finished — nothing has opened yet", () => {
    expect(shouldNotify({ ...base, otherAlreadyDone: false })).toEqual({
      send: false,
      reason: "partner not finished",
    });
  });
});

describe("shouldNotify — consent and restraint", () => {
  it("never emails someone who hasn't opted in", () => {
    // Emailing about special-category activity because a checkbox defaulted to
    // on is not consent.
    expect(shouldNotify({ ...base, recipientOptedIn: false })).toEqual({
      send: false,
      reason: "not opted in",
    });
  });

  it("does nothing when there is no email on file", () => {
    expect(shouldNotify({ ...base, recipientEmail: null })).toEqual({
      send: false,
      reason: "no email on file",
    });
    expect(shouldNotify({ ...base, recipientEmail: "" })).toMatchObject({ send: false });
  });

  it("sends once for a couple blitzing five decks, not five times", () => {
    const justSent = { ...base, lastNotifiedMs: NOW - 60_000 };
    expect(shouldNotify(justSent)).toEqual({ send: false, reason: "within quiet window" });
  });

  it("opens up again once the quiet window has passed", () => {
    const old = { ...base, lastNotifiedMs: NOW - QUIET_MS - 1 };
    expect(shouldNotify(old)).toMatchObject({ send: true });
  });

  it("checks the reveal actually opened before it checks anything else", () => {
    // Ordering matters: someone who never opted in should not have "partner not
    // finished" masked, and vice versa. The unopened reveal wins — it means
    // there is genuinely no news, for anyone.
    const neither = { ...base, otherAlreadyDone: false, recipientOptedIn: false };
    expect(shouldNotify(neither).send).toBe(false);
    expect((shouldNotify(neither) as { reason: string }).reason).toBe("partner not finished");
  });
});

describe("revealReadyEmail", () => {
  const mail = revealReadyEmail({ partnerName: "Judah Michael", appUrl: "https://twoagree.app" });

  it("uses the first name and says only that they answered", () => {
    expect(mail.subject).toBe("Judah has answered — your reveal is ready");
    expect(mail.text).toContain("https://twoagree.app");
  });

  it("names no question and no answer — an inbox is not a private place", () => {
    // The subject line can appear on a lock screen in front of anyone, so it
    // must never carry what the couple were asked or what they said.
    const all = `${mail.subject} ${mail.text} ${mail.html}`.toLowerCase();
    for (const leak of ["intimacy", "answered 4", "you said", "agreed %", "score"]) {
      expect(all).not.toContain(leak);
    }
  });

  it("tells the recipient how to stop them", () => {
    expect(mail.text).toMatch(/turn them off/i);
    expect(mail.html).toMatch(/turn it off/i);
  });

  it("escapes a name rather than injecting it into the HTML", () => {
    const nasty = revealReadyEmail({
      partnerName: '<img src=x onerror="alert(1)">',
      appUrl: "https://twoagree.app",
    });
    expect(nasty.html).not.toContain("<img src=x");
    expect(nasty.html).toContain("&lt;img");
  });

  it("falls back gracefully when the partner has no name stored", () => {
    const anon = revealReadyEmail({ partnerName: "   ", appUrl: "https://twoagree.app" });
    expect(anon.subject).toContain("Your partner");
  });
});
