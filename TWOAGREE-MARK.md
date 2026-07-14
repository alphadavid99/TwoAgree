# TwoAgree — Mark & Icon Specification

**Version 5.1 — Questrial. Complete.** Supersedes all prior mark artwork.

> **This spec is self-contained. Do not ask questions — every decision is already made below.** Work top to bottom, then write `BRAND-REPORT.md` (§8) and stop. If something genuinely blocks you, record it in the report rather than pausing.

Every number here is derived, not chosen. If a number here conflicts with a file in the repo, this document wins and the file is wrong.

---

## 0. What you are doing

Replacing the TwoAgree logo and icons with a redrawn mark. Four defects are fixed:

| Defect | Old | New |
|---|---|---|
| Bézier curves with an S-curve inflection; mirror symmetry faked | `L` + `C` | `L` segments only |
| Logo floated above the text baseline | `0.0760em` high | sits on the baseline |
| Apex gap died below 128px | `0.194x` | `0.382x` |
| Mark stroke lighter than the wordmark | 84% of stem | matched |

**Do not redesign anything.** Do not round coordinates, merge paths, or run SVGO with path-merging on. Every decimal is load-bearing.

---

## 1. Survey

Find and record — **do not stop, just record in `BRAND-REPORT.md`:**

```
- *.svg containing the old paths — grep "899.862" and "1137.09"
- favicon.*, apple-touch-icon.*, icon-*.png, *.webmanifest, manifest.json
- components named Logo, Wordmark, Brand, Mark, Icon
- <link rel="icon">, <link rel="apple-touch-icon">, og:image, twitter:image
- CSS/Tailwind config holding brand colours
- every font-weight > 400 and every <strong>/<b> in the wordmark's
  inheritance chain  -> all of these are bugs, fix them per §5.2
```

Then continue to §4. Delete every old asset you found once the new ones are in place.

---

## 2. The mark has two cuts

Two leaning strokes and one floating gold bar. It exists in **two weights**, the way a typeface does — same skeleton, same laws, different `H/x`. This is a weight axis, not a second logo.

| | **Display cut** | **Text cut** |
|---|---|---|
| For | icon, favicon, app tile, standalone | the A inside the wordmark, **only** |
| `H/x` | **7.0964** | measured from Questrial — §5.0 |
| viewBox | `0 0 1000 1000` | computed by the script |
| Constrained by | the 32px raster | the font |

**Why two.** The wordmark's A must match Questrial's stem or it looks broken in the word. Questrial is a single-weight geometric sans with a uniform, light stroke, so a matched A is nearly a hairline — fine inside text, fatal on an icon:

| Cut | s-slot @32px |
|---|---|
| Display cut | **0.896px** |
| Questrial-matched text cut | **~0.70px** |

The `s` slot is what makes the mark *two things*. The icon keeps its own weight so the slot survives. The wordmark's A never meets a 32px raster.

### Locked in both cuts

| Symbol | Value | |
|---|---|---|
| `α` | **18.000°** lean from vertical | 2α = 36° = the golden gnomon apex. `leg/base = φ` exactly. |
| `s` | **x/φ² = 0.381966x** | the separation constant |
| bar axis | `H/φ²` from the baseline | |
| bar weight | `0.92x` | −8% horizontal-vs-diagonal correction |
| clearspace | **3x** all four sides | minimum |

### Colour

| Token | Hex | Role |
|---|---|---|
| `--twoagree-claret` | `#3E1A2E` | ground |
| `--twoagree-claret-ink` | `#2A1120` | deep ground |
| `--twoagree-honey` | `#C6913C` | **accent — the bar only** |
| `--twoagree-paper` | `#FBF6F0` | strokes on dark, ground on light |
| `--twoagree-blush` | `#F3DED6` | surface |

---

## 3. Hard rules

Measured constraints, not preferences.

> **RULE 1 — Gold and paper may never share an edge.** `#C6913C` on `#FBF6F0` is **2.60:1**, under the 3:1 floor. The claret `s` gap is what keeps the accent legible. This is why the bar floats.

> **RULE 2 — Gold only ever sits on claret.** On any light ground the bar renders **claret**. The mark is complete in one ink.

> **RULE 3 — Gold marks the shared element only.** The bar. Never a stroke, background, border, text, or hover state.

> **RULE 4 — The two strokes never merge.** If a raster closes the apex, that size doesn't ship. It does not get a merged apex.

> **RULE 5 — Never distort.** No stretch, skew, rotation, outline stroke, shadow, gradient, bevel or glow.

> **RULE 6 — Questrial is 400 and only 400.** No bold, no italic, no variable axis.

---

## 4. The icon — locked, build as written

### 4.1 `mark.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-label="TwoAgree">
  <path fill="currentColor" d="M 324.92 0 L 473.087 0 L 148.168 1000 L 0 1000 Z"/>
  <path fill="currentColor" d="M 526.913 0 L 675.08 0 L 1000 1000 L 851.832 1000 Z"/>
  <path fill="currentColor" d="M 349.933 553.213 L 650.067 553.213 L 692.191 682.855 L 307.809 682.855 Z"/>
</svg>
```

The art fills the viewBox exactly. No padding. Deliberate.

### 4.2 `mark-gold.svg`

Same three paths. Strokes `#FBF6F0`, bar `#C6913C`. Dark grounds only.

### 4.3 `icon-master.svg` — source for every raster

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#3E1A2E"/>
  <g transform="translate(122.88 115.2) scale(0.26624)">
    <path fill="#FBF6F0" d="M 324.92 0 L 473.087 0 L 148.168 1000 L 0 1000 Z"/>
    <path fill="#FBF6F0" d="M 526.913 0 L 675.08 0 L 1000 1000 L 851.832 1000 Z"/>
    <path fill="#C6913C" d="M 349.933 553.213 L 650.067 553.213 L 692.191 682.855 L 307.809 682.855 Z"/>
  </g>
</svg>
```

For any other tile size `T`: `scale = 0.52*T/1000`, `translate x = 0.24*T`, `y = (T - 1000*scale)/2 - 0.015*T` (Gravity Effect, nudge up 1.5%).

The mark is **52%** of the tile width. Do not enlarge it — 52% holds the `s` slot near 1px at 32px and keeps the maskable icon inside its safe circle.

### 4.4 `favicon.svg`

`icon-master.svg` with `rx="115.2"` on the rect.

### 4.5 Rasters — all from `icon-master.svg`, never from each other

| File | Size | Corners |
|---|---|---|
| `apple-touch-icon.png` | 180×180 | **square** — iOS masks it itself |
| `icon-192.png` | 192×192 | rounded, rx 22.5% |
| `icon-512.png` | 512×512 | rounded, rx 22.5% |
| `icon-maskable-512.png` | 512×512 | **square, full bleed** |
| `icon-monochrome-512.png` | 512×512 | **transparent ground, mark solid `#FFFFFF`** — Android themed icons; the OS recolours it |
| `favicon-32.png` | 32×32 | rounded |

`icon-monochrome-512.png` is `icon-master.svg` with the `<rect>` deleted and both fills set to `#FFFFFF`. One ink — the `s` gaps do the separation, exactly as RULE 2 intends. Same `translate`/`scale`.

```js
import sharp from 'sharp';
await sharp('icon-master.svg', { density: 1024 })
  .resize(180, 180).png({ compressionLevel: 9 })
  .toFile('apple-touch-icon.png');
```

> **No 16×16 PNG — this is a decision, not a gap.** An SVG favicon renders at the *device* resolution. Any 2× display gives 32 device px, where the `s` slot measures 0.896px and holds. Only a legacy 1× display lands at 16 device px, where it softens — acceptable. `favicon.svg` plus `favicon-32.png` covers everything. Nothing further is required.

### 4.6 `site.webmanifest`

```json
{
  "name": "TwoAgree",
  "short_name": "TwoAgree",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "/icon-monochrome-512.png", "sizes": "512x512", "type": "image/png", "purpose": "monochrome" }
  ],
  "theme_color": "#3E1A2E",
  "background_color": "#2A1120",
  "display": "standalone"
}
```

### 4.7 Head tags

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#3E1A2E">
```

---

## 5. The wordmark

### 5.0 Measure Questrial — the script does this, you do not judge it

Arithmetic, not design. Run it and use what it prints.

```bash
npm i canvas
curl -L -o Questrial-Regular.ttf \
  "https://github.com/google/fonts/raw/main/ofl/questrial/Questrial-Regular.ttf"
node scripts/measure-questrial.mjs
```

```js
// scripts/measure-questrial.mjs
import { createCanvas, registerFont } from 'canvas';
registerFont('./Questrial-Regular.ttf', { family: 'QuestrialM' });

const PHI = (1 + Math.sqrt(5)) / 2;
const AL = 18 * Math.PI / 180;
const T = Math.tan(AL), C = Math.cos(AL);
const S = 1 / (PHI * PHI);          // separation constant, x/phi^2
const WH = 1 / C;                   // horizontal stroke width, in x
const PX = 600;
const r3 = v => Math.round(v * 1000) / 1000;

function coverage(glyph) {
  const n = Math.round(PX * 2.2);
  const cv = createCanvas(n, n), x = cv.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, n, n);
  x.fillStyle = '#000'; x.textBaseline = 'alphabetic';
  x.font = `${PX}px QuestrialM`;
  x.fillText(glyph, Math.round(PX * 0.6), Math.round(PX * 1.6));
  const d = x.getImageData(0, 0, n, n).data, rows = [];
  for (let y = 0; y < n; y++) {
    const row = new Float64Array(n);
    for (let xx = 0; xx < n; xx++) row[xx] = 1 - d[(y * n + xx) * 4] / 255;
    rows.push(row);
  }
  return rows;
}
const inked = rows => rows.map((r, i) => [i, r.reduce((a, b) => a + b, 0)])
                          .filter(([, s]) => s > 0.5).map(([i]) => i);
function runs(row, lo = 0.06) {          // sub-pixel: integrate coverage per blob
  const out = []; let s = null, acc = 0;
  for (let i = 0; i < row.length; i++) {
    if (row[i] > lo) { if (s === null) { s = i; acc = 0; } acc += row[i]; }
    else if (s !== null) { out.push(acc); s = null; }
  }
  if (s !== null) out.push(acc);
  return out;
}
const median = a => { const b = [...a].sort((p, q) => p - q), m = b.length >> 1;
  return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };

// cap height from H — flat top, flat bottom, no overshoot to contaminate it
const H = coverage('H'), hr = inked(H);
if (!hr.length) throw new Error('Questrial did not render. Check the .ttf path.');
const capTop = hr[0], cap = hr[hr.length - 1] - capTop + 1;

// stem: median run width over 25 scanlines, well clear of H's crossbar
const stems = [];
for (let f = 0.06; f <= 0.30; f += 0.01)
  runs(H[Math.round(capTop + cap * f)]).forEach(w => stems.push(w));
const stem = median(stems);
const Scap = stem / cap;

// sanity: any real text face sits between 8% and 20%. Outside that the
// measurement is broken, not the design. Fail loudly rather than ship junk.
if (!(Scap > 0.08 && Scap < 0.20))
  throw new Error(`S/cap measured ${(Scap*100).toFixed(2)}% — implausible. Font failed to load?`);

// sidebearings: give the mark the same fit Questrial gives its own A
const mc = createCanvas(10, 10).getContext('2d');
mc.font = `${PX}px QuestrialM`; mc.textBaseline = 'alphabetic';
const m = mc.measureText('A');
const marginL = (-m.actualBoundingBoxLeft) / PX;
const marginR = (m.width - m.actualBoundingBoxRight) / PX;

// ---- the chassis falls out ----
const Hx = 1.015 / (0.95 * Scap);   // 0.95 = cos(18deg): match HORIZONTAL measure
const Wx = 2 * WH + S + 2 * T * Hx;
const K = 1000 / Hx;
const XLO = 1000 * T, XLI = XLO + WH * K, XRI = XLI + S * K, XRO = XRI + WH * K;
const hs = S / C * K, Lx0 = XLI + hs, Rx0 = XRI - hs;
const yc = 1000 / PHI, tb = 0.92 * K, yT = yc - tb / 2, yB = yc + tb / 2;
const Lx = y => Lx0 - T * y, Rx = y => Rx0 + T * y;

console.log(`
MEASURED   cap ${cap.toFixed(1)}px   stem ${stem.toFixed(2)}px   S/cap ${(Scap*100).toFixed(2)}%
DERIVED    H/x ${Hx.toFixed(4)}   W/x ${Wx.toFixed(4)}   H/W ${(Hx/Wx).toFixed(4)}

__VBW__        ${r3(Wx * K)}
__W_OVER_H__   ${(Wx / Hx).toFixed(5)}
__MARGIN_L__   ${marginL.toFixed(4)}em
__MARGIN_R__   ${marginR.toFixed(4)}em
__PATH_L__     M ${r3(XLO)} 0 L ${r3(XLI)} 0 L ${r3(XLI - 1000*T)} 1000 L 0 1000 Z
__PATH_R__     M ${r3(XRI)} 0 L ${r3(XRO)} 0 L ${r3(XRO + 1000*T)} 1000 L ${r3(XRI + 1000*T)} 1000 Z
__PATH_BAR__   M ${r3(Lx(yT))} ${r3(yT)} L ${r3(Rx(yT))} ${r3(yT)} L ${r3(Rx(yB))} ${r3(yB)} L ${r3(Lx(yB))} ${r3(yB)} Z
`);
```

Substitute all seven values into §5.1 and §5.2 verbatim. Record `S/cap`, `H/x` and `H/W` in the report. **If the script throws, the font didn't load — fix that and rerun. Do not hand-derive the numbers and do not substitute the display cut.**

### 5.1 Structure

Live type with the mark inlined as the A. **Do not outline it to SVG** — it must stay selectable and survive a font change.

```html
<a href="/" aria-label="TwoAgree" class="twoagree-lockup">
  <span class="twoagree-wordmark" aria-hidden="true">Two<svg viewBox="0 0 __VBW__ 1000"
    ><path d="__PATH_L__"/><path d="__PATH_R__"/><path class="bar" d="__PATH_BAR__"/></svg>gree</span>
</a>
```

### 5.2 CSS

```css
.twoagree-wordmark {
  font-family: 'Questrial', system-ui, sans-serif;
  font-weight: 400;          /* the only weight that exists */
  font-style: normal;        /* there is no italic */
  font-synthesis: none;      /* CRITICAL — see below */
  letter-spacing: -0.005em;
  line-height: 1;
  white-space: nowrap;
  color: var(--twoagree-paper);
}

.twoagree-wordmark svg {
  height: 1.015cap;                     /* apex overshoots the capline by 1.5% */
  width:  calc(1.015cap * __W_OVER_H__);
  vertical-align: baseline;             /* feet land on the baseline */
  margin-left:  __MARGIN_L__;           /* Questrial's own A sidebearings */
  margin-right: __MARGIN_R__;
  display: inline-block;
  fill: currentColor;
}

.twoagree-wordmark svg .bar { fill: currentColor; }          /* RULE 2 */
.on-claret .twoagree-wordmark svg .bar { fill: var(--twoagree-honey); }
```

Also preload Questrial and set `font-display: swap`.

**`font-synthesis: none` is not optional.** Questrial ships one weight and no italic. Without it, any inherited `font-weight: 600` or `<strong>` makes the browser fake a bold by dilating the outline — the stems thicken, the mark does not, and the exact defect this update exists to fix comes straight back. Every hit from §1 must be set to 400.

### 5.3 Why `cap`

The old CSS used `height:.78em; width:.62em` against a square viewBox. Default `preserveAspectRatio="xMidYMid meet"` locks scale to the **width**, letterboxing 0.080em top and bottom — the mark floated 0.0760em above the baseline, 10.4% of cap height, ~4.9px at 64px. `cap` sizes to the font's real cap height, so it's correct with no magic number. **Do not replace `cap` with an `em` value.**

---

## 6. Verify — report pass/fail on each

- [ ] No file still contains `899.862`, `1137.09`, `936.886` or `968.149`
- [ ] No `<path>` in any mark asset contains `C`, `S`, `Q` or `A` — **`L` and `Z` only**
- [ ] `mark.svg` viewBox is exactly `0 0 1000 1000`, art touching all four edges
- [ ] `--twoagree-honey` appears **only** on `.bar` — grep the whole repo
- [ ] No `font-weight` above 400 resolves anywhere in the wordmark's chain
- [ ] `font-synthesis: none` set; Questrial preloaded with `font-display: swap`
- [ ] `apple-touch-icon.png` square; `icon-maskable-512.png` bleeds claret to all edges
- [ ] No 16×16 PNG exists; `icon-monochrome-512.png` does, with a transparent ground
- [ ] Clearspace around the header mark ≥ 3x
- [ ] Lighthouse PWA icon check passes
- [ ] Screenshot the wordmark at 16px, 32px and 64px. The A's feet sit **on** the baseline and its apex is level with or 1–2% above the T's capline — never below.

---

## 7. Do not

- Do not run SVGO with `mergePaths`, `convertShapeToPath`, or rounding below 3 decimals
- Do not add `stroke` to any path — the mark is fills only
- Do not add `<title>` inside the SVG when the parent has `aria-label`
- Do not add hover, transition or animation to the mark
- Do not use the display cut inside the wordmark, or the text cut on a tile
- Do not invent a "simplified" or "compact" variant
- Do not use the mark as a bullet, divider, spinner or background watermark
- Do not put the wordmark inside a coloured pill, badge or button
- Do not change 52%, 1.015, 0.92x, 0.381966 or 18.000°

---

## 8. `BRAND-REPORT.md` — write this last

Plain English, for a non-engineer. No jargon, no code.

```
1. What changed        — files replaced, deleted, added
2. The measurement     — S/cap, H/x, H/W as printed by the script
3. Verification        — §6 as a pass/fail list
```

### Decisions already taken — do not revisit, do not "improve"

Three things look like gaps and are not. They were each considered and closed. If you spot them, leave them alone.

**One master, no reversed cut.** Irradiation correction — thinning a mark for light-on-dark — is inherited from ink spread on paper and CRT phosphor bloom. Modern LCD/OLED does not bloom enough to earn it. Worse, the arithmetic is violent: because the gap is small relative to the strokes, thinning them 8% forces the gap **44% wider** — a 2.2px change at 180px to treat a bloom of perhaps 0.5px. And two masters differing by 8% drift apart in a repo within a year. One master. Revisit only if TwoAgree ever prints signage or backlit displays.

**No 16px favicon.** An SVG favicon renders at device resolution, so any 2× display gives 32 device px, where the mark holds. Only legacy 1× hardware lands at 16 device px and softens. Not worth a hand-cut variant.

**The claret app tile is dark on dark wallpapers, and that is fine.** It measures 1.13:1 against an iOS dark wallpaper. So does Spotify's at 1.10:1 and Netflix's at 1.23:1. The tile edge was never doing the identifying — the paper strokes at **14.04:1 against the tile** are. Do not "fix" this with a border, a stroke, a glow or a lighter tile. Any of those would break RULE 3 or add the fad decoration this mark exists to avoid.
