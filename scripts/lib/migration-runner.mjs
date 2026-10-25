// Shared runner for the one-off data migrations (scripts/migrate-*.mjs).
// Connects the admin SDK to the emulator (default) or, with --live --project,
// to a real database; dry run unless --apply. The migration itself is a
// compiled module in functions/lib, emulator-tested in the app's rules suite.
import { createRequire } from "node:module";
import { existsSync } from "node:fs";

export async function runMigration({ lib, fn, report, summary }) {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const live = args.includes("--live");
  const at = args.indexOf("--project");
  const project = at >= 0 ? args[at + 1] : undefined;

  const libUrl = new URL(`../../functions/lib/${lib}`, import.meta.url);
  if (!existsSync(libUrl)) {
    console.error("Build the functions first: npm --prefix functions run build");
    process.exit(1);
  }
  if ((at >= 0 && (!project || project.startsWith("--"))) || (live && !project)) {
    console.error("--project needs a value, e.g. --project twoagreeapp (and --live requires it).");
    process.exit(1);
  }

  const require = createRequire(new URL("../../functions/package.json", import.meta.url));
  const { initializeApp } = require("firebase-admin/app");
  const { getDatabase } = require("firebase-admin/database");

  let databaseURL;
  if (live) {
    databaseURL = `https://${project}-default-rtdb.europe-west1.firebasedatabase.app`;
  } else {
    process.env.FIREBASE_DATABASE_EMULATOR_HOST ??= "127.0.0.1:9000";
    databaseURL = `http://${process.env.FIREBASE_DATABASE_EMULATOR_HOST}/?ns=${project ?? "twoagreeapp"}`;
  }

  const mod = await import(libUrl.href);
  const app = initializeApp({ databaseURL, projectId: project ?? "twoagreeapp" });
  const rows = await mod[fn](getDatabase(app), { apply });
  for (const r of rows) if (r.writes) console.log(report(r));
  console.log(
    `${apply ? "APPLIED" : "DRY RUN"} on ${live ? databaseURL : `emulator ${databaseURL}`}: ` +
      `${rows.length} sessions, ${summary(rows, apply)}.`,
  );
  process.exit(0);
}
