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
  known?: { pct: number; done: number; total: number };
  agreed?: { pct: number; done: number; total: number };
  closest?: string;
};

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
  g.addColorStop(0, "#4A2138");
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
  const BOTTOM_TOP = H - 470;
  c.fillStyle = "rgba(220,178,101,0.9)";
  c.font = 'italic 400 44px Fraunces, Lora, Georgia, serif';
  let vy = BOTTOM_TOP;
  for (const line of wrap(c, "\u201CCan two walk together, unless they are agreed?\u201D", W - 220)) {
    c.fillText(line, W / 2, vy);
    vy += 66;
  }
  c.fillStyle = "rgba(201,160,180,0.85)";
  c.font = '700 26px "Hanken Grotesk", system-ui, sans-serif';
  c.letterSpacing = "6px";
  c.fillText("AMOS 3:3", W / 2 + 3, vy + 34);
  c.letterSpacing = "0px";
  // Hairline sits clear of the reference above it, not through it.
  c.fillStyle = "rgba(220,178,101,0.3)";
  c.fillRect(W / 2 - 110, H - 208, 220, 2);
  c.fillStyle = "rgba(248,233,236,0.55)";
  c.font = '500 30px "Hanken Grotesk", system-ui, sans-serif';
  c.fillText("twoagree.app", W / 2, H - 140);

  // ---- Top mark
  const TOP = 250;
  c.fillStyle = brand.honeyRaised;
  c.font = '600 34px Inter, "Hanken Grotesk", system-ui, sans-serif';
  c.letterSpacing = "14px";
  c.fillText("TWOAGREE", W / 2 + 7, TOP);
  c.letterSpacing = "0px";
  roundRect(c, W / 2 - 72, TOP + 46, 144, 8, 4);
  c.fill();

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
  if (f.known) chips.push(`We know each other ${f.known.pct}%  \u00B7  ${f.known.done}/${f.known.total}`);
  if (f.agreed) chips.push(`We agree ${f.agreed.pct}%  \u00B7  ${f.agreed.done}/${f.agreed.total}`);
  if (f.closest) chips.push(`Closest on ${f.closest}`);

  const blockH =
    nameLines.length * 126 + 40 + storyLines.length * 58 + (chips.length ? 40 + chips.length * 112 : 0);
  const spaceTop = TOP + 100;
  const spaceBottom = BOTTOM_TOP - 110;
  let y = spaceTop + Math.max(0, (spaceBottom - spaceTop - blockH) / 2) + 84;

  c.fillStyle = "#F8E9EC";
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
