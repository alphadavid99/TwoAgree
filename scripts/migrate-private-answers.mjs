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
import { runMigration } from "./lib/migration-runner.mjs";

await runMigration({
  lib: "migratePrivate.js",
  fn: "migrateAll",
  report: (r) => `${r.code}: move ${r.moved}, publish ${r.published}, orphaned ${r.orphaned} (${r.writes} writes)`,
  summary: (rows, apply) => `${rows.reduce((n, r) => n + r.moved, 0)} entries ${apply ? "moved" : "to move"}`,
});
