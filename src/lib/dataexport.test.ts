import { describe, it, expect } from "vitest";
import { renderReadableExport, type ExportPayload } from "./dataexport";
import { DECKS } from "./questions";
import { AT_TABLE_SLUG } from "./path";

const SLUG = "in-the-home";
const mc = DECKS[SLUG].questions.find((q) => q.type === "mc")!;
const scale = DECKS[SLUG].questions.find((q) => q.type === "scale")!;

const payload: ExportPayload = {
  exportedAt: "2026-07-26T12:00:00.000Z",
  uid: "u1",
  profile: { name: "Sarah", bio: "Trying to be honest.", email: "s@example.com", created: 1 },
  intake: { answers: { depth: 1 } },
  consent: { at: 1, version: 1 },
  // Already narrowed by functions/src/redact.ts — one value per question, the
  // caller's own. The partner's side never reaches the client at all.
  sessions: {
    ABCD: {
      created: 1,
      yourRole: "host",
      partnerName: "Judah",
      decks: {
        [SLUG]: {
          answers: { [mc.id]: 0, [scale.id]: 4 },
          guesses: { [mc.id]: 1 },
          importance: { [scale.id]: 5 },
        },
        [AT_TABLE_SLUG]: { answers: { trailhead: "A small thing." } },
      },
    },
  },
};

describe("renderReadableExport", () => {
  const html = renderReadableExport(payload);

  it("resolves question ids to the words the person actually saw", () => {
    expect(html).toContain(mc.q);
    // The stored answer is the index 0 — the document must show the option text.
    expect(html).toContain(mc.opts![0]);
    expect(html).toContain("4 of 5");
  });

  it("shows the profile, the consent record and the private intake", () => {
    expect(html).toContain("Sarah");
    expect(html).toContain("Trying to be honest.");
    expect(html).toContain("s@example.com");
    // Consent outlives erasure, so the subject has to be able to see it.
    expect(html).toMatch(/consent/i);
  });

  it("includes the subject's own guess and importance", () => {
    expect(html).toContain(mc.opts![1]); // what they guessed their partner would say
    expect(html).toContain("matters 5/5");
  });

  it("carries the Path's at-the-table answers, which live under a synthetic deck", () => {
    expect(html).toContain("A small thing.");
  });

  it("names the partner but never quotes them", () => {
    // The server strips the partner's side before it reaches the client (see
    // functions/src/redact.test.ts). This asserts the renderer adds nothing
    // back: their name is context the subject is party to, their answers are
    // not. The host answered 4 on the scale; the guest's 2 is simply absent.
    expect(html).toContain("Judah");
    expect(html).toContain("4 of 5");
    expect(html).not.toContain("2 of 5");
    expect(html).toMatch(/not part of your export/i);
  });

  it("escapes user-supplied text rather than injecting it as markup", () => {
    const nasty = renderReadableExport({
      ...payload,
      profile: { ...payload.profile, bio: '<img src=x onerror="alert(1)">' },
    });
    expect(nasty).not.toContain("<img src=x");
    expect(nasty).toContain("&lt;img src=x");
  });

  it("degrades to a valid document when the payload is empty", () => {
    const empty = renderReadableExport({});
    expect(empty).toContain("<!doctype html>");
    expect(empty).toMatch(/No profile stored/);
    expect(empty).toMatch(/No sessions/);
  });
});
