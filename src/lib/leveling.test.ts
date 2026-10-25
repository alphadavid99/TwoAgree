import { describe, it, expect } from "vitest";
import { levelsOf, nLevels, lvlQs, stageOf, partName } from "./leveling";
import { DECKS, ORDER } from "./questions";
import APPROVED from "../../docs/refresh/part-names.json";
import BANK from "../../data/questions.json";

describe("question bank integrity", () => {
  it("has 21 conversations and 558 questions (Oct 2026 bank)", () => {
    expect(ORDER).toHaveLength(21);
    const total = ORDER.reduce((n, s) => n + DECKS[s].questions.length, 0);
    expect(total).toBe(558);
  });
  it("every follow-up is asked straight after its main question, in the same part", () => {
    // Follow-ups never split from their main question (Dave, Oct 2026). A
    // follow-up may come after a sibling follow-up of the same main question.
    const follows = new Map(
      (BANK as { id: string; followsId?: string }[]).filter((q) => q.followsId).map((q) => [q.id, q.followsId!]),
    );
    const root = (id: string): string => (follows.has(id) ? root(follows.get(id)!) : id);
    for (const slug of ORDER) {
      for (const part of DECKS[slug].parts) {
        part.qids.forEach((id, i) => {
          if (!follows.has(id)) return;
          expect(i, `${id} opens a part`).toBeGreaterThan(0);
          expect(root(part.qids[i - 1]), `${id} is not straight after its main question`).toBe(root(id));
        });
      }
    }
  });
});

describe("levelsOf partitions a deck in order", () => {
  it("levels reconstruct the deck exactly, for every deck", () => {
    for (const slug of ORDER) {
      const flat = levelsOf(slug).flat();
      expect(flat).toEqual(DECKS[slug].questions); // same items, same order
    }
  });
  it("every part has its approved name (78 names, no 'Part 2')", () => {
    let n = 0;
    for (const slug of ORDER) {
      expect(DECKS[slug].parts.length).toBe(nLevels(slug));
      for (let l = 0; l < nLevels(slug); l++) {
        expect(partName(slug, l).trim(), `${slug} part ${l + 1}`).not.toBe("");
        expect(partName(slug, l)).toBe(APPROVED[slug][l]);
        n++;
      }
    }
    expect(n).toBe(78);
  });
  it("every part holds 6 to 8 questions, follow-ups counted (Oct 2026 re-cut)", () => {
    for (const slug of ORDER) {
      for (let l = 0; l < nLevels(slug); l++) {
        const n = lvlQs(slug, l).length;
        expect(n >= 6 && n <= 8, `${slug} part ${l + 1} has ${n}`).toBe(true);
      }
    }
  });
});

describe("stageOf", () => {
  it("returns 0, 1, or 2 for every deck", () => {
    for (const slug of ORDER) {
      expect([0, 1, 2]).toContain(stageOf(slug));
    }
  });
});
