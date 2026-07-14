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
