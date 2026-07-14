import { chromium } from "playwright-core";
const OUT = process.env.OUT_DIR;
const shots = [
  { view: "brand", wait: 1800 },
  { view: "auth", wait: 1800 },
  { view: "home", wait: 1600 },
];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 420, height: 860 }, deviceScaleFactor: 3 });
for (const s of shots) {
  await page.goto(`http://localhost:5199/preview.html?view=${s.view}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(s.wait);
  await page.screenshot({ path: `${OUT}/brand-${s.view}.png` });
  console.log("shot", s.view);
}
await browser.close();
