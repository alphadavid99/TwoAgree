// Answers private until you've both finished a part (design refresh,
// recommendation 5). Your answers, guesses and importance ratings are written
// to private/{uid}/{code}, which only you can read; the server copies a part
// into the shared session once you've both marked it done (publishPart, in
// functions/). This module is the client half, and is pure:
//
//  - mergePrivate lays your own unpublished entries over the shared session,
//    so every screen sees exactly the shape it always has: your answers under
//    your role, your partner's only once published.
//  - A part both of you have finished but the server hasn't published yet is
//    shown as not finished by your partner, so no screen opens a reveal with
//    half its answers missing. unpublished() lists those parts so the app can
//    ask the server to publish them (a self-heal if a phone went offline).
import type { DeckData, Role } from "./scoring";
import { other } from "./scoring";
import { nLevels } from "./leveling";
import { DECKS } from "./questions";
import type { Session } from "../types";

export const PRIVATE_KINDS = ["answers", "guesses", "importance"] as const;
export type PrivateKind = (typeof PRIVATE_KINDS)[number];

/** private/{uid}/{code}: one person's own entries for one session. */
export interface PrivateSpace {
  decks?: Record<string, Partial<Record<PrivateKind, Record<string, number | string>>>>;
}

export type Unpublished = { slug: string; level: number } | { step: number };

const bothDone = (flags: Partial<Record<Role, boolean>> | undefined) =>
  flags?.host === true && flags?.guest === true;

export function mergePrivate(
  shared: Session | null,
  mine: PrivateSpace | null,
  role: Role | null,
): Session | null {
  if (!shared) return null;
  if (!role) return shared;
  const them = other(role);
  const decks: Record<string, DeckData> = { ...(shared.decks ?? {}) };

  for (const [slug, own] of Object.entries(mine?.decks ?? {})) {
    const d: DeckData = { ...(decks[slug] ?? {}) };
    for (const kind of PRIVATE_KINDS) {
      const entries = own?.[kind];
      if (!entries) continue;
      const merged: Record<string, Record<string, unknown>> = { ...(d[kind] ?? {}) };
      for (const [qid, v] of Object.entries(entries)) {
        merged[qid] = { ...(merged[qid] ?? {}), [role]: v };
      }
      (d as Record<string, unknown>)[kind] = merged;
    }
    decks[slug] = d;
  }

  // Both finished, not yet published: your partner reads as still going.
  for (const [slug, d] of Object.entries(decks)) {
    const done = d.done;
    if (!done) continue;
    let copy: DeckData["done"] | null = null;
    for (const lvl of Object.keys(done)) {
      if (bothDone(done[lvl]) && d.published?.[lvl] !== true) {
        copy ??= { ...done };
        const { [them]: _hidden, ...rest } = done[lvl]!;
        void _hidden;
        copy[lvl] = rest;
      }
    }
    if (copy) decks[slug] = { ...d, done: copy };
  }

  return { ...shared, decks };
}

/** Parts and Path steps both of you have finished that aren't published yet. */
export function unpublished(shared: Session | null): Unpublished[] {
  const out: Unpublished[] = [];
  for (const [slug, d] of Object.entries(shared?.decks ?? {})) {
    if (!DECKS[slug]) continue;
    for (const lvl of Object.keys(d.done ?? {})) {
      const level = Number(lvl);
      if (level >= nLevels(slug)) continue;
      if (bothDone(d.done![lvl]) && d.published?.[lvl] !== true) out.push({ slug, level });
    }
  }
  for (const [idx, flags] of Object.entries(shared?.pathDone ?? {})) {
    if (bothDone(flags) && shared?.pathPublished?.[idx] !== true) out.push({ step: Number(idx) });
  }
  return out;
}

/** Has `who` begun this part? Shared flags only — never the other's answers. */
export function startedLevel(deck: DeckData | undefined, lvl: number, who: Role): boolean {
  return deck?.started?.[lvl]?.[who] === true || deck?.done?.[lvl]?.[who] === true;
}
