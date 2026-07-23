// Capture a PNG of every app screen from the isolated harness.
//
//   1) node_modules/.bin/vite --config vite.harness.config.ts   (serves :5199)
//   2) node design-review/capture.mjs
//
// Screens render offline (Firebase stubbed in the harness) from a mock couple,
// so scoring/reveal screens show a real spread of verdicts and flags. Output
// lands in design-review/screens/ (gitignored). Rebuild the review gallery with
// design-review/build-gallery.mjs.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
// Playwright is globally installed in this environment; fall back to a local one.
let chromium;
try {
  ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
} catch {
  ({ chromium } = require("playwright"));
}

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "screens");
const BASE = "http://localhost:5199/harness.html";
const CHROME =
  process.env.HARNESS_CHROME ||
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
mkdirSync(OUT, { recursive: true });

const STANDALONE = [
  "auth", "onboarding", "startmenu", "start", "profile", "home", "decks",
  "play", "partpicker", "reveal", "reveal-review", "results", "corescore",
  "flags", "path", "pathstep",
];
const APP_TABS = [
  ["app-home", null], ["app-talk", "Talk"], ["app-path", "Path"], ["app-together", "Together"],
];

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

async function settle() {
  await page.waitForSelector(".phone", { timeout: 15000 });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(500);
}

const report = [];
for (const s of STANDALONE) {
  errors.length = 0;
  await page.goto(`${BASE}?screen=${s}`, { waitUntil: "domcontentloaded" });
  await settle();
  await page.screenshot({ path: `${OUT}/${s}.png`, fullPage: true });
  report.push({ screen: s, errors: [...errors] });
  console.log(`captured ${s}${errors.length ? "  ⚠ " + errors.length : ""}`);
}

await page.goto(`${BASE}?screen=app`, { waitUntil: "domcontentloaded" });
await settle();
for (const [name, label] of APP_TABS) {
  errors.length = 0;
  if (label) {
    await page.getByRole("button", { name: label, exact: true }).first().click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  report.push({ screen: name, errors: [...errors] });
  console.log(`captured ${name}${errors.length ? "  ⚠ " + errors.length : ""}`);
}

await browser.close();
const bad = report.filter((r) => r.errors.length);
console.log(bad.length ? `\n${bad.length} screens had console errors` : "\nNo console errors on any screen.");
