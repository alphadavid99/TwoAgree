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
  sessions: {
    ABCD: {
      created: 1,
      members: { host: { name: "Sarah", uid: "u1" }, guest: { name: "Judah", uid: "u2" } },
      decks: {
        [SLUG]: {
          answers: { [mc.id]: { host: 0, guest: 1 }, [scale.id]: { host: 4, guest: 2 } },
          guesses: { [mc.id]: { host: 1 } },
          importance: { [scale.id]: { host: 5 } },
        },
        [AT_TABLE_SLUG]: { answers: { trailhead: { host: "A small thing.", guest: "Theirs." } } },
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

  it("does NOT reproduce the partner's answers", () => {
    // The partner said "Theirs." to the at-table prompt and picked option 1 on
    // the scale; neither is this subject's data to be handed back in a document.
    expect(html).not.toContain("Theirs.");
    expect(html).not.toContain("2 of 5");
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
