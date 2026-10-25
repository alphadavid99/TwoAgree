#!/usr/bin/env node
// One-off fresh start for the Oct 2026 question bank: clear every session's
// answers, guesses, progress and laid Path, and both partners' private spaces,
// so everyone starts the new bank from the beginning. Couples, names, join
// codes and Path intake answers are kept.
//
// The plan is functions/src/migrateFresh.ts, emulator-tested in
// src/lib/privacy.rules.test.ts. Same flags as migrate-private-answers.mjs:
//   npm --prefix functions run build
//   node scripts/migrate-fresh-start.mjs [--apply] [--live --project twoagreeapp]
//
// Run it right after deploying the build that carries the new bank.
import { runMigration } from "./lib/migration-runner.mjs";

await runMigration({
  lib: "migrateFresh.js",
  fn: "migrateFreshAll",
  report: (r) => `${r.code}: clear ${r.cleared.join(", ")} (${r.writes} writes)`,
  summary: (rows, apply) => `${rows.filter((r) => r.writes).length} sessions ${apply ? "cleared" : "to clear"}`,
});
