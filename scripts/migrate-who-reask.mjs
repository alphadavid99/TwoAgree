#!/usr/bin/env node
// One-off migration (design refresh, item 12): clear old Him / Her answers and
// guesses on the 18 "which of you" questions so they're asked again once, by
// name. Reopens the part (or Path step) for whoever has to answer again.
//
// The plan is functions/src/migrateWho.ts, emulator-tested in
// src/lib/privacy.rules.test.ts. Same flags as migrate-private-answers.mjs:
//   npm --prefix functions run build
//   node scripts/migrate-who-reask.mjs [--apply] [--live --project twoagreeapp]
//
// Run it right after deploying the build that asks these questions by name.
import { runMigration } from "./lib/migration-runner.mjs";

await runMigration({
  lib: "migrateWho.js",
  fn: "migrateWhoAll",
  report: (r) => `${r.code}: clear ${r.cleared} (${r.writes} writes)`,
  summary: (rows, apply) => `${rows.reduce((n, r) => n + r.cleared, 0)} old answers or guesses ${apply ? "cleared" : "to clear"}`,
});
