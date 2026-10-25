// The keepsake card — rendered to a real image, not a sentence.
//
// "Share your card" used to send plain text ("Sarah & Judah — we knew each
// other 70%…"); the designed card on screen never left the app, and the code
// admitted it was relying on people screenshotting. For a solo build with no
// marketing budget, a couple posting a beautiful card into a group chat IS the
// growth channel, so it should be the most finished pixel in the product.
//
// 9:16 so it drops straight into a story, claret ground so gold type is legal
// (brand RULE 1), and nothing on it that the couple didn't choose to put there.
import { brand } from "../brand/tokens";
import { MARK_D1, MARK_D2, MARK_VIEW_BOX } from "../brand/Mark";

export type CardFields = {
  myName: string;
  partnerName: string;
  /** "walked through 8 of 21 conversations" — always present, never a score. */
  conversationsDone: number;
  conversationsTotal: number;
  /** Replaces that line outright, for a milestone with its own sentence
   *  (the Path's finale earned "have walked the whole Path together"). */
  story?: string;
  /** Opt-in lines. Agreement is never included unless explicitly chosen. */
  known?: { pct: number; done: number; total: number; right?: number; made?: number };
  agreed?: { pct: number; done: number; total: number };
  closest?: string;
  /** The range's line and verse (lib/reveal.ts), only with the Agree score. */
  words?: { line: string; verse: { text: string; ref: string } };
};

/**
 * The wordmark on a canvas — the mark IS the A (brand rule 3): "Two", the
 * mark drawn from its own vector paths at .62em × .78em, then "gree", in
 * Inter. Centred on `cx`, baseline at `y`.
 */
export function drawWordmark(
  c: CanvasRenderingContext2D,
  cx: number,
  y: number,
  size: number,
  type: string,
  mark: string,
): void {
  c.save();
  c.font = `400 ${size}px Inter, "Hanken Grotesk", system-ui, sans-serif`;
  c.textAlign = "left";
  const two = c.measureText("Two").width;
  const gree = c.measureText("gree").width;
  const mw = size * 0.62;
  const mh = size * 0.78;
  const gap = size * 0.015;
  let x = cx - (two + gap + mw + gap + gree) / 2;
  c.fillStyle = type;
  c.fillText("Two", x, y);
  x += two + gap;
  // The mark's 220×220 viewBox, fitted into mw × mh ("meet"), baseline-aligned.
  const [vx, vy, vw, vh] = MARK_VIEW_BOX.split(" ").map(Number);
  const k = Math.min(mw / vw, mh / vh);
  c.translate(x + (mw - vw * k) / 2, y - mh + size * 0.015 + (mh - vh * k) / 2);
  c.scale(k, k);
  c.translate(-vx, -vy);
  c.fillStyle = mark;
  c.fill(new Path2D(MARK_D1));
  c.fill(new Path2D(MARK_D2));
  c.restore();
  c.save();
  c.font = `400 ${size}px Inter, "Hanken Grotesk", system-ui, sans-serif`;
  c.textAlign = "left";
  c.fillStyle = type;
  c.fillText("gree", x + mw + gap, y);
  c.restore();
}

const W = 1080;
const H = 1920;

const firstName = (n: string) => n.trim().split(/\s+/)[0] || n;

// Fraunces/Hanken are self-hosted and may not have parsed when the user taps,
// which would silently draw the whole card in a system serif.
async function fontsReady(): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    /* older browsers — the fallback stack still renders something sane */
  }
}

function roundRect(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

/** Wrap `text` to `maxW`, returning the lines. */
function wrap(c: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (c.measureText(next).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderShareCard(f: CardFields): Promise<Blob | null> {
  await fontsReady();
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d");
  if (!c) return null;

  // Ground: the claret room, lit from above.
  const g = c.createLinearGradient(0, 0, W * 0.3, H);
  g.addColorStop(0, brand.claret);
  g.addColorStop(0.72, brand.claretDeep);
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);

  // A soft gold bloom behind the names, so the card isn't a flat rectangle.
  const bloom = c.createRadialGradient(W / 2, H * 0.34, 0, W / 2, H * 0.34, W * 0.72);
  bloom.addColorStop(0, "rgba(220,178,101,0.16)");
  bloom.addColorStop(1, "rgba(220,178,101,0)");
  c.fillStyle = bloom;
  c.fillRect(0, 0, W, H);

  c.textAlign = "center";

  // ---- Bottom block, laid out first so the middle can centre in what's left.
  // (The verse and the domain are fixed anchors; everything else breathes.)
  // With the Agree score: the range's line and its verse (ESV), the same
  // words the couple saw on their reveal. Measured first, so the block sits
  // clear of the hairline and the domain whatever its length.
  const verse = f.words?.verse ?? { text: "Can two walk together, unless they are agreed?", ref: "Amos 3:3" };
  c.font = '600 64px Fraunces, Lora, Georgia, serif';
  const lineLines = f.words ? wrap(c, f.words.line, W - 180) : [];
  c.font = 'italic 400 44px Fraunces, Lora, Georgia, serif';
  const verseLines = wrap(c, `\u201C${verse.text}\u201D`, W - 220);
  const bottomH = (lineLines.length ? lineLines.length * 80 + 20 : 0) + verseLines.length * 66 + 34;
  const BOTTOM_TOP = H - 260 - bottomH;
  let vy = BOTTOM_TOP;
  c.fillStyle = brand.paper;
  c.font = '600 64px Fraunces, Lora, Georgia, serif';
  for (const line of lineLines) {
    c.fillText(line, W / 2, vy);
    vy += 80;
  }
  if (lineLines.length) vy += 20;
  c.fillStyle = brand.honeyRaised;
  c.font = 'italic 400 44px Fraunces, Lora, Georgia, serif';
  for (const line of verseLines) {
    c.fillText(line, W / 2, vy);
    vy += 66;
  }
  c.fillStyle = brand.blush;
  c.font = '700 26px "Hanken Grotesk", system-ui, sans-serif';
  c.letterSpacing = "6px";
  c.fillText(verse.ref.toUpperCase(), W / 2 + 3, vy);
  c.letterSpacing = "0px";
  // Hairline sits clear of the reference above it, not through it.
  c.fillStyle = "rgba(220,178,101,0.3)";
  c.fillRect(W / 2 - 110, H - 208, 220, 2);
  c.fillStyle = "rgba(248,233,236,0.55)";
  c.font = '500 30px "Hanken Grotesk", system-ui, sans-serif';
  c.fillText("twoagree.app", W / 2, H - 140);

  // ---- Top: the wordmark, the mark as the A (never plain text).
  const TOP = 250;
  drawWordmark(c, W / 2, TOP, 96, brand.paper, brand.honey);

  // ---- Middle block: measure it, then centre it between mark and verse so the
  // card never leaves a dead band down its waist.
  const names = `${firstName(f.myName)} & ${firstName(f.partnerName)}`;
  c.font = '600 108px Fraunces, Lora, Georgia, serif';
  const nameLines = wrap(c, names, W - 180);
  c.font = '400 40px "Hanken Grotesk", system-ui, sans-serif';
  const storyLines = wrap(
    c,
    f.story ??
      `have walked through ${f.conversationsDone} of ${f.conversationsTotal} conversations together`,
    W - 240,
  );
  const chips: string[] = [];
  // Every score carries its count (scoring version 2).
  if (f.known)
    chips.push(
      f.known.made
        ? `We know each other ${f.known.pct}%  \u00B7  ${f.known.right} of ${f.known.made} guesses`
        : `We know each other ${f.known.pct}%`,
    );
  if (f.agreed) chips.push(`We agree ${f.agreed.pct}%  \u00B7  ${f.agreed.done} questions`);
  if (f.closest) chips.push(`Closest on ${f.closest}`);

  const blockH =
    nameLines.length * 126 + 40 + storyLines.length * 58 + (chips.length ? 40 + chips.length * 112 : 0);
  const spaceTop = TOP + 100;
  const spaceBottom = BOTTOM_TOP - 110;
  let y = spaceTop + Math.max(0, (spaceBottom - spaceTop - blockH) / 2) + 84;

  c.fillStyle = brand.paper;
  c.font = '600 108px Fraunces, Lora, Georgia, serif';
  for (const line of nameLines) {
    c.fillText(line, W / 2, y);
    y += 126;
  }

  c.fillStyle = "rgba(248,233,236,0.74)";
  c.font = '400 40px "Hanken Grotesk", system-ui, sans-serif';
  y += 26;
  for (const line of storyLines) {
    c.fillText(line, W / 2, y);
    y += 58;
  }

  // Opt-in chips. Each is something the couple ticked, never a default.
  y += 52;
  c.font = '600 38px "Hanken Grotesk", system-ui, sans-serif';
  for (const chip of chips) {
    const w = c.measureText(chip).width + 76;
    c.fillStyle = "rgba(92,46,69,0.78)";
    roundRect(c, W / 2 - w / 2, y - 48, w, 88, 44);
    c.fill();
    c.fillStyle = brand.honeyRaised;
    c.fillText(chip, W / 2, y + 12);
    y += 112;
  }

  return await new Promise((res) => cv.toBlob((b) => res(b), "image/png"));
}

// ---- The score card, shared from the reveal (design refresh, item 2) ------
// A still of the reveal's crescendo in 9:16, for stories and group chats: the
// same line the couple saw, and an invitation ("How in step are you two?")
// that ranks nobody. The topic is always shareTopic()'s label, so Intimacy,
// the past and deal-breakers never appear on it; names only if switched on.
export type ScoreCardFields = {
  pct: number;
  basis: number;
  line: string;
  /** From shareTopic(): never a sensitive topic name. */
  topic: string;
  /** "Sarah & Judah", only when "Include our names" is on. */
  names?: string;
  /** Celebration range, 1–4 (lib/celebrate.ts). */
  tier: 1 | 2 | 3 | 4;
};

// A seeded random so the card is identical however often it's previewed.
function seeded(seed: number) {
  let x = seed || 1;
  return () => {
    x = (x * 1664525 + 1013904223) % 4294967296;
    return x / 4294967296;
  };
}

export async function renderScoreCard(f: ScoreCardFields): Promise<Blob | null> {
  await fontsReady();
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d");
  if (!c) return null;
  const rand = seeded(f.pct * 97 + f.basis);
  const RY = 930; // ring centre

  const g = c.createLinearGradient(0, 0, W * 0.3, H);
  g.addColorStop(0, brand.claret);
  g.addColorStop(0.72, brand.claretDeep);
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);

  // Every range: gold ripples and motes, the claret room's own light.
  c.strokeStyle = "rgba(220,178,101,0.12)";
  c.lineWidth = 2;
  for (let r = 420; r <= 900; r += 120) {
    c.beginPath();
    c.arc(W / 2, RY, r, 0, Math.PI * 2);
    c.stroke();
  }
  for (let i = 0; i < 26; i++) {
    c.fillStyle = `rgba(220,178,101,${0.25 + rand() * 0.35})`;
    c.beginPath();
    c.arc(rand() * W, rand() * H, 3 + rand() * 4, 0, Math.PI * 2);
    c.fill();
  }
  // 91+: rays and a glow behind the ring.
  if (f.tier >= 3) {
    const glow = c.createRadialGradient(W / 2, RY, 0, W / 2, RY, 620);
    glow.addColorStop(0, "rgba(220,178,101,0.28)");
    glow.addColorStop(1, "rgba(220,178,101,0)");
    c.fillStyle = glow;
    c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(220,178,101,0.16)";
    c.lineWidth = 10;
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      c.beginPath();
      c.moveTo(W / 2 + Math.cos(a) * 400, RY + Math.sin(a) * 400);
      c.lineTo(W / 2 + Math.cos(a) * 760, RY + Math.sin(a) * 760);
      c.stroke();
    }
  }
  // 61+: petals.
  if (f.tier >= 2) {
    for (let i = 0; i < 46; i++) {
      c.save();
      c.translate(rand() * W, rand() * H);
      c.rotate(rand() * Math.PI);
      c.fillStyle = rand() > 0.5 ? "rgba(243,222,214,0.85)" : "rgba(220,178,101,0.85)";
      c.beginPath();
      c.ellipse(0, 0, 9, 15, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  }
  // 100: fireworks across the top.
  if (f.tier >= 4) {
    const bursts: [number, number, number, string][] = [
      [190, 330, 120, brand.honeyRaised],
      [420, 230, 70, brand.honeyRaised],
      [760, 280, 76, brand.blush],
      [930, 420, 110, brand.honeyRaised],
      [330, 520, 80, brand.blush],
    ];
    for (const [x, y, r, col] of bursts) {
      c.strokeStyle = col;
      c.fillStyle = col;
      c.lineWidth = 4;
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        c.beginPath();
        c.moveTo(x + Math.cos(a) * r * 0.35, y + Math.sin(a) * r * 0.35);
        c.lineTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8);
        c.stroke();
        c.beginPath();
        c.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 5, 0, Math.PI * 2);
        c.fill();
      }
    }
  }

  c.textAlign = "center";
  drawWordmark(c, W / 2, 170, 84, brand.paper, brand.honey);

  c.fillStyle = brand.honeyRaised;
  c.font = '700 30px "Hanken Grotesk", system-ui, sans-serif';
  c.letterSpacing = "6px";
  c.fillText(f.topic.toUpperCase(), W / 2 + 3, 330);
  c.letterSpacing = "0px";
  if (f.names) {
    c.fillStyle = brand.paper;
    c.font = '600 84px Fraunces, Lora, Georgia, serif';
    c.fillText(f.names, W / 2, 450);
  }

  if (f.tier >= 4) {
    // The gold medallion.
    c.fillStyle = "rgba(198,145,60,0.25)";
    c.beginPath();
    c.arc(W / 2, RY, 360, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = brand.honey;
    c.lineWidth = 30;
    c.beginPath();
    c.arc(W / 2, RY, 320, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = brand.honey;
    roundRect(c, W / 2 - 250, RY - 400, 500, 76, 38);
    c.fill();
    c.fillStyle = brand.claret;
    c.font = '700 30px "Hanken Grotesk", system-ui, sans-serif';
    c.letterSpacing = "5px";
    c.fillText("COMPLETE ALIGNMENT", W / 2 + 2, RY - 352);
    c.letterSpacing = "0px";
    c.fillStyle = brand.honeyRaised;
  } else {
    c.strokeStyle = "rgba(243,222,214,0.14)";
    c.lineWidth = 34;
    c.beginPath();
    c.arc(W / 2, RY, 330, 0, Math.PI * 2);
    c.stroke();
    c.strokeStyle = brand.honeyRaised;
    c.lineCap = "round";
    c.beginPath();
    c.arc(W / 2, RY, 330, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * f.pct) / 100);
    c.stroke();
    c.lineCap = "butt";
    c.fillStyle = brand.paper;
  }
  c.font = '600 250px Fraunces, Lora, Georgia, serif';
  const num = String(f.pct);
  const nw = c.measureText(num).width;
  c.fillText(num, W / 2 - 30, RY + 70);
  c.font = '600 110px Fraunces, Lora, Georgia, serif';
  c.textAlign = "left";
  c.fillText("%", W / 2 - 30 + nw / 2 + 6, RY - 20);
  c.textAlign = "center";
  c.fillStyle = brand.honeyRaised;
  c.font = '700 32px "Hanken Grotesk", system-ui, sans-serif';
  c.letterSpacing = "7px";
  c.fillText("AGREED", W / 2 + 3, RY + 160);
  c.letterSpacing = "0px";

  c.font = '500 40px "Hanken Grotesk", system-ui, sans-serif';
  c.fillText(`based on ${f.basis} question${f.basis === 1 ? "" : "s"}`, W / 2, RY + 450);

  c.fillStyle = brand.paper;
  c.font = '600 84px Fraunces, Lora, Georgia, serif';
  let y = RY + 580;
  for (const line of wrap(c, f.line, W - 160)) {
    c.fillText(line, W / 2, y);
    y += 100;
  }

  c.fillStyle = "rgba(220,178,101,0.3)";
  c.fillRect(W / 2 - 110, H - 290, 220, 2);
  c.fillStyle = brand.blush;
  c.font = 'italic 400 46px Fraunces, Lora, Georgia, serif';
  c.fillText("How in step are you two?", W / 2, H - 200);
  c.fillStyle = "rgba(248,233,236,0.6)";
  c.font = '500 32px "Hanken Grotesk", system-ui, sans-serif';
  c.fillText("twoagree.app", W / 2, H - 130);

  return await new Promise((res) => cv.toBlob((b) => res(b), "image/png"));
}

export type ShareOutcome = "shared" | "downloaded" | "cancelled" | "failed";

/**
 * Share the rendered card as a FILE where the platform supports it, otherwise
 * fall back to a download. Returns what actually happened, so the UI can stop
 * claiming success for a cancelled share sheet.
 */
export async function shareCardImage(
  blob: Blob,
  filename: string,
  text: string,
): Promise<ShareOutcome> {
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & {
    canShare?: (d: { files?: File[] }) => boolean;
  };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], text });
      return "shared";
    } catch {
      return "cancelled"; // the sheet was dismissed — say nothing
    }
  }
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return "downloaded";
  } catch {
    return "failed";
  }
}
