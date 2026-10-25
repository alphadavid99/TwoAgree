#!/usr/bin/env node
// Build the typed question bank from the repo-owned JSON source of truth.
//
//   data/questions.json  (flat array, one object per question)  ── the truth
//   data/decks.json      (deck metadata + display order + prefix)
//        │
//        ▼  validate, then group by deck in order
//   src/data/questions.generated.ts   (checked in; imported by the app)
//
// Usage:
//   node scripts/build-questions.mjs           # validate + (re)write the generated file
//   node scripts/build-questions.mjs --check    # validate + fail if the generated file is stale
//
// Every validation failure is collected and reported with the offending ID,
// so a bad paste tells you exactly what to fix. See CLAUDE.md §9.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
// --data <dir> validates another copy of the bank and writes nothing (tests).
const DATA_AT = process.argv.indexOf("--data");
const DATA_DIR = DATA_AT >= 0 ? path.resolve(process.argv[DATA_AT + 1]) : path.join(ROOT, "data");
const VALIDATE_ONLY = DATA_AT >= 0;
const QUESTIONS_PATH = path.join(DATA_DIR, "questions.json");
const DECKS_PATH = path.join(DATA_DIR, "decks.json");
const OUT_PATH = path.join(ROOT, "src", "data", "questions.generated.ts");

const CHECK = process.argv.includes("--check");
const TYPES = new Set(["scale", "mc", "rank", "open"]);

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    fail(`Could not read/parse ${path.relative(ROOT, p)}: ${e.message}`);
  }
}

function fail(msg) {
  console.error(`\n✗ build-questions: ${msg}\n`);
  process.exit(1);
}

// --- load ---------------------------------------------------------------------
const decks = readJson(DECKS_PATH);
const questions = readJson(QUESTIONS_PATH);

if (!Array.isArray(decks) || !decks.length) fail("data/decks.json must be a non-empty array.");
if (!Array.isArray(questions) || !questions.length) fail("data/questions.json must be a non-empty array.");

// --- validate decks -----------------------------------------------------------
const errors = [];
const slugToDeck = new Map();
const prefixToSlug = new Map();
const slugToPrefix = new Map();
for (const d of decks) {
  if (!d.slug || !d.prefix || !d.name || !d.color || !d.icon) {
    errors.push(`deck "${d.slug || "?"}" is missing one of slug/prefix/name/color/icon`);
    continue;
  }
  if (slugToDeck.has(d.slug)) errors.push(`duplicate deck slug: ${d.slug}`);
  if (prefixToSlug.has(d.prefix)) errors.push(`duplicate deck prefix: ${d.prefix}`);
  slugToDeck.set(d.slug, d);
  prefixToSlug.set(d.prefix, d.slug);
  slugToPrefix.set(d.slug, d.prefix);
}
if (errors.length) fail(`deck metadata problems:\n  - ${errors.join("\n  - ")}`);

// --- allocate IDs for freshly pasted questions (write mode only) --------------
// A question may arrive with a `deck` but no `id` — assign the next free number
// for that deck's prefix so a hand-pasted block can never collide with the bank.
// (--check refuses to mutate; a missing id there is a validation error below.)
if (!CHECK && !VALIDATE_ONLY) {
  const nextNum = new Map(); // prefix -> next free integer
  for (const q of questions) {
    if (typeof q.id === "string") {
      const m = q.id.match(/^([A-Z]+)-(\d+)$/);
      if (m) nextNum.set(m[1], Math.max(nextNum.get(m[1]) || 0, Number(m[2]) + 1));
    }
  }
  let allocated = 0;
  for (const q of questions) {
    if (q.id) continue;
    const prefix = slugToPrefix.get(q.deck);
    if (!prefix) fail(`a question has no id and deck "${q.deck}" is unknown — cannot allocate an id.`);
    const n = nextNum.get(prefix) || 1;
    nextNum.set(prefix, n + 1);
    q.id = `${prefix}-${String(n).padStart(3, "0")}`;
    allocated++;
    console.log(`  allocated ${q.id} (${q.deck})`);
  }
  if (allocated) {
    fs.writeFileSync(QUESTIONS_PATH, JSON.stringify(questions, null, 2) + "\n");
    console.log(`  wrote ${allocated} new id(s) back to data/questions.json`);
  }
}

// --- validate questions -------------------------------------------------------
const seen = new Set();
for (const q of questions) {
  const id = q.id || "(no id)";
  const bad = (m) => errors.push(`${id}: ${m}`);

  if (!/^[A-Z]+-\d+$/.test(id)) { bad("id must look like PREFIX-000"); continue; }
  if (seen.has(id)) bad("duplicate id");
  seen.add(id);

  const prefix = id.split("-")[0];
  const expectedSlug = prefixToSlug.get(prefix);
  if (!expectedSlug) bad(`prefix "${prefix}" has no matching deck in data/decks.json`);
  else if (q.deck !== expectedSlug) bad(`deck "${q.deck}" does not match prefix "${prefix}" (expected "${expectedSlug}")`);

  if (!TYPES.has(q.type)) bad(`type "${q.type}" must be one of scale/mc/rank/open`);
  // `depth` (1–5) is the single internal sort key + weight; `tier`/`level` are gone.
  if (!Number.isInteger(q.depth) || q.depth < 1 || q.depth > 5) bad(`depth "${q.depth}" must be an integer 1–5`);
  if ("tier" in q || "level" in q) bad("`tier`/`level` are removed — use `depth`");
  if (typeof q.q !== "string" || !q.q.trim()) bad("question text (q) is empty");
  if (q.guessable !== true && q.guessable !== false) bad("guessable must be true or false");

  // "Which of you" questions (design refresh, item 12): the first two options
  // are the two of you, {A} the host and {B} the guest, shown as your names in
  // the same order on both phones. Nowhere else may carry a placeholder.
  if (q.who === true) {
    if (q.type !== "mc") bad("who questions must be mc");
    else if (!q.opts?.[0]?.includes("{A}") || !q.opts?.[1]?.includes("{B}")) bad("who: opts[0] needs {A} and opts[1] needs {B}");
    else if (q.opts.slice(2).some((o) => /\{[AB]\}/.test(o)) || q.opts[0].includes("{B}") || q.opts[1].includes("{A}")) bad("who: {A}/{B} only in the first two options");
  } else if ("who" in q) bad("who must be true or absent");
  else if ([q.q, ...(q.opts ?? [])].some((o) => /\{[AB]\}/.test(o ?? ""))) bad("{A}/{B} placeholders need who: true");

  // Mirrored scales: the ends are the two of you ("I give more" … "you give
  // more"), so the same answer from both means opposite things. An mc about
  // the two of you is a who question instead, stored by person.
  if ("mirror" in q) {
    if (q.mirror !== true) bad("mirror must be true or absent");
    else if (q.type !== "scale") bad("mirror is for scale questions (use who for mc)");
    else if (q.complement) bad("mirror and complement can't both be set");
  }

  if (q.type === "mc" || q.type === "rank") {
    if (!Array.isArray(q.opts) || q.opts.length < 2) bad(`${q.type} needs at least 2 options`);
    if (q.lo || q.hi) bad(`${q.type} must not have lo/hi`);
  } else if (q.type === "scale") {
    if (!q.lo || !q.hi) bad("scale needs both lo and hi endpoint labels");
    if (q.opts) bad("scale must not have opts");
    // End labels are short markers for the two ends; the full wording of each
    // point lives in steps (shown when that point is picked).
    for (const e of [q.lo, q.hi])
      if (e && (e.length > 40 || /[:(]/.test(e))) bad(`scale end "${e}" must be a short label (40 characters, no colon or brackets); put the full wording in steps`);
    if (q.steps && (!Array.isArray(q.steps) || q.steps.length !== 5 || q.steps.some((x) => typeof x !== "string" || !x.trim())))
      bad("scale steps must be five non-empty labels, lo to hi");
  } else if (q.type === "open") {
    if (q.opts) bad("open must not have opts");
    if (q.lo || q.hi) bad("open must not have lo/hi");
  }
}

// --- validate parts ----------------------------------------------------------
// Each deck's parts are fixed in data/decks.json: a name plus its question ids
// (design refresh, item 11). A name must never drift away from its questions,
// so every question sits in exactly one part of its own deck.
const deckOfId = new Map(questions.map((q) => [q.id, q.deck]));
const partOf = new Map();
for (const d of decks) {
  const where = `deck "${d.slug}"`;
  if (!Array.isArray(d.parts) || !d.parts.length) {
    errors.push(`${where}: needs a "parts" list (each { name, qids })`);
    continue;
  }
  d.parts.forEach((p, i) => {
    const at = `${where} part ${i + 1}`;
    if (typeof p.name !== "string" || !p.name.trim()) errors.push(`${at}: needs a name`);
    if (!Array.isArray(p.qids) || !p.qids.length) errors.push(`${at} ("${p.name}"): needs question ids`);
    for (const id of p.qids ?? []) {
      if (!deckOfId.has(id)) errors.push(`${id}: in ${at} but not in the question bank`);
      else if (deckOfId.get(id) !== d.slug) errors.push(`${id}: in ${at} but belongs to deck "${deckOfId.get(id)}"`);
      if (partOf.has(id)) errors.push(`${id}: in two parts (${partOf.get(id)} and ${at})`);
      else partOf.set(id, at);
    }
  });
}
for (const q of questions) {
  if (!partOf.has(q.id)) errors.push(`${q.id}: in no part — add it to a part of "${q.deck}" in data/decks.json`);
}

if (errors.length) {
  fail(`${errors.length} problem(s) in the question bank:\n  - ${errors.join("\n  - ")}`);
}

// --- render generated TS ------------------------------------------------------
// Runtime carries only the fields the app renders; authoring-only columns
// (level, subcat, status, source, dateAdded) live in the JSON source only.
const byId = new Map(questions.map((q) => [q.id, q]));
const order = decks.map((d) => d.slug);
// A deck's questions run in part order, as fixed in data/decks.json. (The parts
// were cut from the old depth-sorted ~7-per-part split, so Part 1 is still a
// deck's lightest questions and Part N its heaviest — brief §A7b.)
const byDeck = new Map(
  decks.map((d) => [d.slug, d.parts.flatMap((p) => p.qids.map((id) => byId.get(id)))]),
);

function runtimeQuestion(q) {
  const o = { id: q.id, q: q.q, type: q.type, depth: q.depth };
  if (q.ref) o.ref = q.ref;
  if (q.note) o.note = q.note;
  if (q.guessable === true) o.guessable = true;
  if (q.complement === true) o.complement = true;
  if (q.mirror === true) o.mirror = true;
  if (q.who === true) o.who = true;
  if (q.notYet === true) o.notYet = true;
  if (q.core === true) o.core = true;
  if (q.showIf) o.showIf = q.showIf;
  if (q.complementary) o.complementary = q.complementary;
  if (q.opts) o.opts = q.opts;
  if (q.lo) o.lo = q.lo;
  if (q.hi) o.hi = q.hi;
  if (q.steps) o.steps = q.steps;
  return o;
}

// Resolve each conversation's A7 hook (brief 2 §A7) from a question id to live
// text at build time, so rewording the question moves the hook with it.
const decksLiteral = {};
for (const d of decks) {
  if (d.hook && !byId.has(d.hook)) {
    fail(`deck "${d.slug}" hook "${d.hook}" is not a question id`);
  }
  decksLiteral[d.slug] = {
    name: d.name,
    color: d.color,
    icon: d.icon,
    ...(d.hook ? { hook: { id: d.hook, q: byId.get(d.hook).q } } : {}),
    parts: d.parts.map((p) => ({ name: p.name, qids: p.qids })),
    questions: byDeck.get(d.slug).map(runtimeQuestion),
  };
}

const header = `// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source of truth: data/questions.json + data/decks.json.
// Regenerate with: npm run build:questions   (see CLAUDE.md §9)
`;

const body = `${header}
export type QuestionType = "scale" | "mc" | "rank" | "open";

export interface Question {
  id: string;
  q: string;
  type: QuestionType;
  /** 1–5 internal sort key + weight. Never rendered as a number (brief 2 §A3). */
  depth: number;
  ref?: string;
  note?: string;
  /** Supports the predict-your-partner scoring layer. */
  guessable?: boolean;
  /** Scores as fully aligned even when answers differ (purple "Complementary"). */
  complement?: boolean;
  /** A scale about the two of you ("I give more" … "you give more"): one partner's answer is flipped before comparing. */
  mirror?: boolean;
  /** "Which of you": opts[0]/[1] are {A} (host) and {B} (guest); answered as "host"/"guest". */
  who?: boolean;
  /** Offers a first-class, unscored "Not yet" answer (brief §7). */
  notYet?: boolean;
  /** Part of the fixed Core scoring instrument (brief 2 §C). */
  core?: boolean;
  /** Reserved: conditional display (brief 2 §A3). */
  showIf?: string;
  /** Reserved: id of a complementary question (brief 2 §A3). */
  complementary?: string;
  /** Options for mc / rank questions. */
  opts?: string[];
  /** Scale endpoint labels (type === "scale"). */
  lo?: string;
  hi?: string;
  /** Scale only: what each of the five points means, lo to hi (English). */
  steps?: string[];
}

export interface Deck {
  name: string;
  color: string;
  icon: string;
  /** A7 onboarding hook — a real question from inside, resolved at build time. */
  hook?: { id: string; q: string };
  /** The deck's fixed parts, in order: a name and its question ids. */
  parts: { name: string; qids: string[] }[];
  questions: Question[];
}

/** Category slugs in display order. */
export const ORDER: string[] = ${JSON.stringify(order, null, 2)};

/** All decks keyed by slug. */
export const DECKS: Record<string, Deck> = ${JSON.stringify(decksLiteral, null, 2)};
`;

// --- render the compact bank for the Cloud Functions package ------------------
// The Path generation function selects question ids server-side, so it needs
// per-question metadata (deck/type/depth/guessable/complement). The functions
// package can't import from src/, and only functions/ is uploaded at deploy, so
// we vendor a compact map into functions/src. Same source of truth, kept in sync
// by --check (below), so the two can never drift.
const FN_OUT_PATH = path.join(ROOT, "functions", "src", "questionBank.generated.ts");
const bank = {};
for (const q of questions) {
  const e = { deck: q.deck, type: q.type, depth: q.depth };
  if (q.guessable === true) e.guessable = true;
  if (q.complement === true) e.complement = true;
  if (q.who === true) e.who = true;
  bank[q.id] = e;
}
// The parts of each deck, as question ids (data/decks.json). The publish
// function copies exactly one part's answers into the shared session once both
// partners have finished it, so it reads the same fixed parts as the app.
const levels = Object.fromEntries(decks.map((d) => [d.slug, d.parts.map((p) => p.qids)]));
const fnBody = `${header}
// Compact question metadata for the Path generation Cloud Function.
export type QuestionType = "scale" | "mc" | "rank" | "open";
export interface BankEntry {
  deck: string;
  type: QuestionType;
  depth: number;
  guessable?: boolean;
  complement?: boolean;
  who?: boolean;
}

/** Every question's selection metadata, keyed by id. */
export const BANK: Record<string, BankEntry> = ${JSON.stringify(bank, null, 2)};

/** Each deck's parts, in order, as question ids (what one publish releases). */
export const LEVELS: Record<string, string[][]> = ${JSON.stringify(levels, null, 2)};
`;

function checkFile(outPath, expected, label) {
  if (!fs.existsSync(outPath)) {
    fail(`${path.relative(ROOT, outPath)} is missing. Run: npm run build:questions`);
  }
  if (fs.readFileSync(outPath, "utf8") !== expected) {
    fail(`${path.relative(ROOT, outPath)} is stale. Run: npm run build:questions`);
  }
  void label;
}

if (VALIDATE_ONLY) {
  console.log(`✓ question bank valid (${questions.length} questions, ${decks.length} decks).`);
} else if (CHECK) {
  checkFile(OUT_PATH, body);
  checkFile(FN_OUT_PATH, fnBody);
  console.log(`✓ question bank valid and up to date (${questions.length} questions, ${decks.length} decks).`);
} else {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, body);
  fs.mkdirSync(path.dirname(FN_OUT_PATH), { recursive: true });
  fs.writeFileSync(FN_OUT_PATH, fnBody);
  console.log(`✓ wrote ${path.relative(ROOT, OUT_PATH)} + ${path.relative(ROOT, FN_OUT_PATH)} (${questions.length} questions, ${decks.length} decks).`);
}
