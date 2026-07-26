// The Path — client-side helpers. The Path is a SEQUENCER over the existing
// question engine (brief §"get-this-right #1"): it never stores answers in a new
// shape. A step's bank questions are answered under their real deck slug (so an
// answer given here counts in that deck too, and one already answered there
// counts complete here — the brief's overlap rule, for free). The one Path-only
// thing is the per-step "At the table" OPEN prompt, stored under a synthetic
// deck slug so it flows through the existing OPEN mechanics.
import { DECKS, type Question } from "./questions";
import type { DeckData, Role } from "./scoring";
import { jointQuestions, overall, knowScore, weightedStats } from "./scoring";
import type { Session, PathStepData } from "../types";
import { PATH_STEPS, type PathStepMeta } from "../data/path.generated";

// Synthetic deck slug that holds the "At the table" open answers (keyed by step
// key). Distinct from the sessions/{code}/path node (the curriculum structure).
export const AT_TABLE_SLUG = "at-table";
export const atTableQid = (stepKey: string) => `attable-${stepKey}`;

// qid → its Question plus the real deck slug it lives in. Built once from the
// generated bank so the Path can route answers to the right deck.
const BY_ID: Record<string, { q: Question; slug: string }> = {};
for (const slug of Object.keys(DECKS)) {
  for (const q of DECKS[slug].questions) BY_ID[q.id] = { q, slug };
}

export const questionOf = (qid: string): Question | undefined => BY_ID[qid]?.q;
export const deckOf = (qid: string): string | undefined => BY_ID[qid]?.slug;

// Step display metadata (name, glyph, verses, at-table prompt), keyed by key.
export const stepMeta = (key: string): PathStepMeta | undefined =>
  PATH_STEPS.find((s) => s.key === key);

// The synthetic OPEN Question for a step's "At the table" prompt.
export function atTableQuestion(stepKey: string): Question | null {
  const meta = stepMeta(stepKey);
  if (!meta?.atTable) return null;
  return { id: atTableQid(stepKey), q: meta.atTable, type: "open", depth: 1 };
}

// The playable questions of a step, in order: its bank questions then the open
// "At the table" prompt (the last item in every step).
export function stepQuestions(step: PathStepData): Question[] {
  const bank = step.qids.map(questionOf).filter((q): q is Question => !!q);
  const at = atTableQuestion(step.key);
  return at ? [...bank, at] : bank;
}

// Merge the answers/guesses/importance for a step's questions into one DeckData,
// pulling each bank question from its real deck and the open prompt from the
// synthetic at-table deck. This is what feeds the existing RevealScreen/scoring.
export function stepDeckData(session: Session, step: PathStepData): DeckData {
  const out: DeckData = { answers: {}, guesses: {}, importance: {} };
  for (const qid of step.qids) {
    const slug = deckOf(qid);
    const d = slug ? session.decks?.[slug] : undefined;
    if (d?.answers?.[qid]) out.answers![qid] = d.answers[qid];
    if (d?.guesses?.[qid]) out.guesses![qid] = d.guesses[qid];
    if (d?.importance?.[qid]) out.importance![qid] = d.importance[qid];
  }
  const at = session.decks?.[AT_TABLE_SLUG]?.answers?.[step.key];
  if (at) out.answers![atTableQid(step.key)] = at;
  return out;
}

// Has `role` answered a specific question (looked up in its real deck)?
function answered(session: Session, qid: string, role: Role): boolean {
  const slug = deckOf(qid);
  return slug ? session.decks?.[slug]?.answers?.[qid]?.[role] != null : false;
}

// Has `role` finished a whole step (every bank question + the at-table prompt)?
export function stepDoneBy(session: Session, step: PathStepData, role: Role): boolean {
  if (!step.qids.every((qid) => answered(session, qid, role))) return false;
  const at = atTableQuestion(step.key);
  if (at) return session.decks?.[AT_TABLE_SLUG]?.answers?.[step.key]?.[role] != null;
  return true;
}

// A step is revealable once BOTH partners have finished it and there is joint
// material to show (mirrors the deck reveal gate).
export function stepRevealable(session: Session, step: PathStepData, role: Role): boolean {
  const other: Role = role === "host" ? "guest" : "host";
  if (!stepDoneBy(session, step, role) || !stepDoneBy(session, step, other)) return false;
  return jointQuestions(stepQuestions(step), stepDeckData(session, step)).length > 0;
}

export const lampLit = (session: Session, index: number): boolean =>
  session.pathLamps?.[String(index)] === true;

// The step list, ordered, as {index, key, data}. The path node keys steps by
// numeric index; The Lookout (finale) has no data node.
export function orderedSteps(session: Session): { index: number; data: PathStepData }[] {
  const steps = session.path?.steps ?? {};
  return Object.keys(steps)
    .map(Number)
    .sort((a, b) => a - b)
    .map((index) => ({ index, data: steps[String(index)] }));
}

// The first step whose lamp isn't lit — the couple's current position. Returns
// the step count (all lit → at The Lookout) when the whole trail is walked.
export function currentIndex(session: Session): number {
  const steps = orderedSteps(session);
  for (const { index } of steps) if (!lampLit(session, index)) return index;
  return steps.length; // all question-steps done → The Lookout
}

export const pathReady = (session: Session | null): boolean =>
  !!session?.path?.steps && Object.keys(session.path.steps).length > 0;

// ---- Journey-wide scoring (The Lookout) ------------------------------------
// The intro promises "You arrive at your alignment"; the finale has to pay that
// off with the whole road, not one waypoint. These aggregate the SAME scoring
// the per-step reveals use, over every step the couple has actually walked —
// so the Lookout number can never disagree with the lamps behind it.

export type Waypoint = {
  index: number;
  key: string;
  name: string;
  glyph: string;
  pct: number;
};

export type JourneyStats = {
  agreed: number | null;
  known: number | null;
  /** Joint scoreable questions behind `agreed`, over the trail's scoreable total. */
  scored: number;
  scoredTotal: number;
  /** Guesses right, over guesses made — the honest denominator for `known`. */
  right: number;
  guesses: number;
  walked: number;
  total: number;
  /** Strongest and most-worth-a-conversation waypoints (null under 2 walked). */
  brightest: Waypoint | null;
  hardest: Waypoint | null;
};

// One waypoint's agreement, or null when it holds nothing joint and scoreable.
function waypointPct(session: Session, step: PathStepData, role: Role): number | null {
  const deck = stepDeckData(session, step);
  const qs = jointQuestions(stepQuestions(step), deck);
  const { weight } = weightedStats(qs, deck, role);
  return weight ? overall(qs, deck, role) : null;
}

export function journeyStats(session: Session, role: Role): JourneyStats {
  const steps = orderedSteps(session);
  // Merge every walked step into one DeckData and one question list, then score
  // once — a true question-level mean, not an average of per-step averages.
  const all: DeckData = { answers: {}, guesses: {}, importance: {} };
  const allQs: Question[] = [];
  const points: Waypoint[] = [];

  for (const { index, data } of steps) {
    if (!lampLit(session, index)) continue;
    const deck = stepDeckData(session, data);
    Object.assign(all.answers!, deck.answers);
    Object.assign(all.guesses!, deck.guesses);
    Object.assign(all.importance!, deck.importance);
    allQs.push(...stepQuestions(data));
    const pct = waypointPct(session, data, role);
    const meta = stepMeta(data.key);
    if (pct != null && meta) {
      points.push({ index, key: data.key, name: meta.name, glyph: meta.glyph, pct });
    }
  }

  const joint = jointQuestions(allQs, all);
  const { weight } = weightedStats(joint, all, role);
  const know = knowScore(allQs, all, role);
  // Ranked low→high; ties keep trail order, so the pair is stable between visits.
  const ranked = [...points].sort((a, b) => a.pct - b.pct || a.index - b.index);

  return {
    agreed: weight ? overall(joint, all, role) : null,
    known: know.pct,
    scored: joint.filter((q) => q.type !== "open").length,
    scoredTotal: allQs.filter((q) => q.type !== "open").length,
    right: know.right,
    guesses: know.made,
    walked: steps.filter((s) => lampLit(session, s.index)).length,
    total: steps.length,
    // With one waypoint there's no "brightest vs hardest" to draw — naming the
    // same step both would read as a bug.
    brightest: ranked.length >= 2 ? ranked[ranked.length - 1] : null,
    hardest: ranked.length >= 2 ? ranked[0] : null,
  };
}
