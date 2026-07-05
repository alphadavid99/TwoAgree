// Screenshot harness (dev-only, not committed): renders preview views.
import { chromium } from "playwright-core";

const OUT = process.env.OUT_DIR;
const base = "http://localhost:5199/preview.html";
const shots = [
  { view: "home", wait: 1600 },
  { view: "reveal90", wait: 3400, name: "reveal-grand" },
  { view: "reveal90", wait: 4800, name: "reveal-grand-late" },
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({
  viewport: { width: 420, height: 860 },
  deviceScaleFactor: 2,
});
for (const s of shots) {
  await page.goto(`${base}?view=${s.view}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(s.wait);
  await page.screenshot({ path: `${OUT}/${s.name ?? s.view}.png` });
  console.log("shot", s.name ?? s.view);
}
await browser.close();
