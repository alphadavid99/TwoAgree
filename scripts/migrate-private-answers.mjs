#!/usr/bin/env node
// One-off migration (design refresh, recommendation 5): move answers in parts
// that haven't opened for both partners out of the shared session and into
// each author's private space; stamp opened parts as published.
//
// The plan is functions/src/migratePrivate.ts, emulator-tested in
// src/lib/privacy.rules.test.ts. This runner only connects and applies it.
//
//   npm --prefix functions run build            # compiles the plan
//   node scripts/migrate-private-answers.mjs    # DRY RUN against the emulator
//   node scripts/migrate-private-answers.mjs --apply           # emulator, writes
//
// Against the live database (Dave only, after checking a dry run):
//   GOOGLE_APPLICATION_CREDENTIALS=<service-account.json> \
//   node scripts/migrate-private-answers.mjs --live --project twoagreeapp [--apply]
//
// Deploy the new database rules and functions BEFORE applying it live, or
// clients still on the old build will keep writing answers to the session.
import { createRequire } from "node:module";
import { existsSync } from "node:fs";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const live = args.includes("--live");
const at = args.indexOf("--project");
const project = at >= 0 ? args[at + 1] : undefined;

const lib = new URL("../functions/lib/migratePrivate.js", import.meta.url);
if (!existsSync(lib)) {
  console.error("Build the functions first: npm --prefix functions run build");
  process.exit(1);
}
if ((at >= 0 && (!project || project.startsWith("--"))) || (live && !project)) {
  console.error("--project needs a value, e.g. --project twoagreeapp (and --live requires it).");
  process.exit(1);
}

const require = createRequire(new URL("../functions/package.json", import.meta.url));
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");

let databaseURL;
if (live) {
  databaseURL = `https://${project}-default-rtdb.europe-west1.firebasedatabase.app`;
} else {
  const ns = project ?? "twoagreeapp";
  process.env.FIREBASE_DATABASE_EMULATOR_HOST ??= "127.0.0.1:9000";
  databaseURL = `http://${process.env.FIREBASE_DATABASE_EMULATOR_HOST}/?ns=${ns}`;
}

const { migrateAll } = await import(lib.href);
const app = initializeApp({ databaseURL, projectId: project ?? "twoagreeapp" });
const rows = await migrateAll(getDatabase(app), { apply });
let moved = 0;
for (const r of rows) {
  moved += r.moved;
  if (r.writes) console.log(`${r.code}: move ${r.moved}, publish ${r.published}, orphaned ${r.orphaned} (${r.writes} writes)`);
}
console.log(
  `${apply ? "APPLIED" : "DRY RUN"} on ${live ? databaseURL : `emulator ${databaseURL}`}: ` +
    `${rows.length} sessions, ${moved} entries ${apply ? "moved" : "to move"}.`,
);
process.exit(0);
