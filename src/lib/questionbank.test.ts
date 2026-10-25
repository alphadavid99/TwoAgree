// The bank check (npm run build:questions) fails the build if a question is in
// no part or in two (design refresh, item 11). Run against a copy of the bank.
import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type Deck = { slug: string; parts: { name: string; qids: string[] }[] };

function check(mutate: (decks: Deck[]) => void): { ok: boolean; out: string } {
  const dir = mkdtempSync(join(tmpdir(), "bank-"));
  cpSync("data/questions.json", join(dir, "questions.json"));
  const decks = JSON.parse(readFileSync("data/decks.json", "utf8")) as Deck[];
  mutate(decks);
  writeFileSync(join(dir, "decks.json"), JSON.stringify(decks));
  try {
    const out = execFileSync("node", ["scripts/build-questions.mjs", "--check", "--data", dir], {
      encoding: "utf8",
      stdio: "pipe",
    });
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out: String((e as { stderr?: string }).stderr) };
  }
}

describe("the bank check holds every question to exactly one part", () => {
  it("passes on the real bank", () => {
    expect(check(() => {}).ok).toBe(true);
  });

  it("fails when a question is in no part, naming it", () => {
    let removed = "";
    const r = check((d) => {
      removed = d[0].parts[0].qids.pop()!;
    });
    expect(r.ok).toBe(false);
    expect(r.out).toContain(`${removed}: in no part`);
  });

  it("fails when a question is in two parts", () => {
    let dup = "";
    const r = check((d) => {
      dup = d[0].parts[0].qids[0];
      d[0].parts[1].qids.push(dup);
    });
    expect(r.ok).toBe(false);
    expect(r.out).toContain(`${dup}: in two parts`);
  });

  it("fails when a part has no name, or names another deck's question", () => {
    const r = check((d) => {
      d[0].parts[0].name = " ";
      d[1].parts[0].qids.push(d[0].parts[1].qids[0]);
    });
    expect(r.ok).toBe(false);
    expect(r.out).toContain("needs a name");
    expect(r.out).toContain("belongs to deck");
  });
});
