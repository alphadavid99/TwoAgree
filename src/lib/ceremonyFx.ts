// The reveal ceremony's light show: stars, rays, lanterns, confetti, fireworks.
// One canvas, drawn BEHIND the card and the words (docs/split/DECISIONS.md):
// the celebration frames the result and never crosses it. Moving elements are
// GSAP's job (RevealCeremony.tsx); this file only draws particles.
//
// Nothing here knows about React. The loop stops itself once the last event
// has fired and the last particle has faded, leaving the final sky in place.
import { ceremony as C } from "../brand/tokens";
import { LEVELS, countAt, type CeremonyLevel, type LevelConfig } from "./ceremony";

const TAU = Math.PI * 2;
const COLS = [C.gold, C.blush, C.rose, C.deep, C.light];
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = () => COLS[(Math.random() * COLS.length) | 0];
const outCubic = (k: number) => 1 - Math.pow(1 - k, 3);
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${Math.max(0, a).toFixed(3)})`;
};

type Kind = "confetti" | "spark" | "shell" | "ring" | "glint" | "twinkle" | "shooting" | "petal" | "lantern";
type Burst = "peony" | "ring" | "willow" | "double";
interface P {
  k: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  life: number;
  t: number;
  c: string;
  px?: number;
  py?: number;
  drag?: number;
  w?: number;
  h?: number;
  r?: number;
  r0?: number;
  r1?: number;
  a?: number;
  rot?: number;
  vr?: number;
  sway?: number;
  s?: number;
  burst?: Burst;
}
interface Star {
  a: number;
  d: number;
  z: number;
  tw: number;
  c: string;
}

export interface FxOptions {
  level: CeremonyLevel;
  pct: number;
  /** Seconds before the count starts (the card is still arriving). */
  lead: number;
  /** The card's resting box, in canvas pixels. Read at start and on resize. */
  box: () => { x: number; y: number; w: number; h: number };
  /** The card's live box while it flies in, for the rocket's trail. */
  liveBox?: () => { x: number; y: number; w: number; h: number };
  onCount: (shown: number) => void;
  onShake?: (dx: number, dy: number) => void;
  /** 100% only: the room turns to dawn as the count lands. */
  onDawn?: () => void;
}

export class CeremonyFx {
  private g: CanvasRenderingContext2D | null;
  private cfg: LevelConfig;
  private W = 0;
  private H = 0;
  private cx = 0;
  private cy = 0;
  private bw = 280;
  private bh = 340;
  private parts: P[] = [];
  private stars: Star[] = [];
  private evs: { t: number; fn: () => void }[] = [];
  private raf = 0;
  private last = 0;
  private ft = 0;
  private flashA = 0;
  private shakeA = 0;
  private ang = 0;
  private rainUntil = 0;
  private boostUntil = 0;
  private trailing = false;
  private shown = -1;
  private stopped = false;

  private cv: HTMLCanvasElement;
  private o: FxOptions;

  constructor(cv: HTMLCanvasElement, o: FxOptions) {
    this.cv = cv;
    this.o = o;
    this.g = cv.getContext("2d");
    this.cfg = LEVELS[o.level];
  }

  start() {
    if (!this.g || typeof requestAnimationFrame !== "function") {
      this.o.onCount(this.o.pct);
      return;
    }
    this.resize();
    this.stars = Array.from({ length: this.cfg.stars }, () => ({
      a: rnd(0, TAU),
      d: rnd(0.05, 1.1),
      z: rnd(0.5, 1.5),
      tw: rnd(0, TAU),
      c: Math.random() < 0.3 ? C.gold : C.blush,
    }));
    this.plan();
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.stopped = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.o.onShake?.(0, 0);
  }

  resize = () => {
    if (!this.g) return;
    const r = this.cv.getBoundingClientRect();
    const d = Math.min(window.devicePixelRatio || 1, 2);
    this.W = r.width;
    this.H = r.height;
    this.cv.width = Math.round(this.W * d);
    this.cv.height = Math.round(this.H * d);
    this.g.setTransform(d, 0, 0, d, 0, 0);
    const b = this.o.box();
    this.cx = b.x + b.w / 2;
    this.cy = b.y + b.h / 2;
    this.bw = b.w;
    this.bh = b.h;
  };

  // ---- the arrival's own moments, called by the choreography ----
  /** The rocket: stars at full speed and a trail of fire for `secs`. */
  rocket(secs: number) {
    this.trailing = true;
    this.boostUntil = secs;
    this.at(secs - 0.1 - this.o.lead, () => {
      this.trailing = false;
      this.flash(0.35);
      this.shakeA = 5;
      this.ring(0, 220, 0.8, 5);
    });
  }

  /** A tap skipped the arrival: land the count now. The celebration still plays. */
  land() {
    const t = this.o.lead + this.cfg.count;
    if (this.ft < t) this.ft = t;
    this.trailing = false;
    this.boostUntil = 0;
  }

  flash(a: number) {
    this.flashA = Math.max(this.flashA, a);
  }

  // ---- things that can appear ----
  /** Queue `fn` for `t` seconds after the count starts (negative = before). */
  private at(t: number, fn: () => void) {
    this.evs.push({ t, fn });
    this.evs.sort((a, b) => a.t - b.t);
  }
  private add(p: Partial<P> & Pick<P, "k" | "x" | "y" | "life">) {
    this.parts.push({ vx: 0, vy: 0, g: 0, t: 0, c: C.gold, ...p });
  }
  private ring(delay: number, r1: number, a: number, w: number) {
    this.add({ k: "ring", x: this.cx, y: this.cy, r0: this.bw / 2, r1: r1 + 60, a, w, life: 1.1, t: -delay });
  }
  private lantern = () => {
    this.add({ k: "lantern", x: rnd(30, this.W - 30), y: this.H + 30, vy: -rnd(26, 44), sway: rnd(0, TAU), s: rnd(0.8, 1.3), life: rnd(11, 15) });
  };
  private ember(x: number, y: number, up: boolean) {
    this.add({
      k: "glint", x, y, vx: rnd(-22, 22), vy: up ? -rnd(40, 110) : rnd(60, 220), g: up ? -10 : 0,
      life: rnd(0.8, 1.9), r: rnd(1.2, 3.2), c: Math.random() < 0.65 ? C.gold : C.light,
    });
  }
  private twinkle(x: number, y: number, delay = 0, size = rnd(5, 11)) {
    this.add({ k: "twinkle", x, y, life: rnd(0.7, 1.2), t: -delay, r: size, c: Math.random() < 0.6 ? C.light : C.gold });
  }
  /** A ring of twinkles just outside the card's edge. */
  private twinkles(n: number) {
    const rx = this.bw / 2 + 26;
    const ry = this.bh / 2 + 26;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + rnd(-0.2, 0.2);
      this.twinkle(this.cx + Math.cos(a) * rx * rnd(0.98, 1.2), this.cy + Math.sin(a) * ry * rnd(0.98, 1.2), rnd(0, 0.9));
    }
  }
  private shooting(delay: number) {
    const l = Math.random() < 0.5;
    this.add({ k: "shooting", x: l ? -20 : this.W + 20, y: rnd(this.H * 0.04, this.H * 0.4), vx: (l ? 1 : -1) * rnd(420, 640), vy: rnd(120, 230), life: 1.2, t: -delay });
  }
  private cannons(n: number) {
    for (const side of [0, 1]) {
      for (let i = 0; i < n; i++) {
        const a = side ? rnd(Math.PI * 1.06, Math.PI * 1.44) : rnd(-Math.PI * 0.44, -Math.PI * 0.06);
        const sp = rnd(300, 760);
        this.add({
          k: "confetti", x: side ? this.W + 6 : -6, y: this.H * 0.72, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 560, drag: 0.992,
          life: rnd(2.6, 4.2), t: -rnd(0, 0.3), w: rnd(5, 10), h: rnd(8, 15), rot: rnd(0, 6.3), vr: rnd(-10, 10), c: pick(),
        });
      }
    }
  }
  private rain(n: number) {
    for (let i = 0; i < n; i++)
      this.add({
        k: "confetti", x: rnd(-10, this.W + 10), y: -14, vx: rnd(-40, 40), vy: rnd(120, 300), g: 120, drag: 0.995,
        life: rnd(3, 4.6), w: rnd(5, 10), h: rnd(8, 15), rot: rnd(0, 6.3), vr: rnd(-9, 9), c: pick(),
      });
  }
  private petals(n: number) {
    for (let i = 0; i < n; i++)
      this.add({
        k: "petal", x: rnd(0, this.W), y: -20, vx: rnd(-20, 20), vy: rnd(50, 110), g: 8, sway: rnd(0, TAU),
        life: rnd(6, 9), t: -rnd(0, 4), w: rnd(7, 12), rot: rnd(0, 6.3), vr: rnd(-2, 2), c: Math.random() < 0.5 ? C.rose : C.blush,
      });
  }
  private burst(x: number, y: number, style: Burst) {
    const n = style === "ring" ? 44 : style === "willow" ? 60 : 72;
    const c1 = pick();
    const c2 = Math.random() < 0.5 ? C.light : C.gold;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + (style === "ring" ? 0 : rnd(-0.08, 0.08));
      const sp = style === "ring" ? 190 : style === "willow" ? rnd(60, 170) : rnd(60, 270);
      this.add({
        k: "spark", x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: style === "willow" ? 150 : 80,
        drag: style === "willow" ? 0.975 : 0.982, life: style === "willow" ? rnd(1.6, 2.3) : rnd(0.9, 1.5), w: style === "willow" ? 1.6 : 2.4, c: i % 3 ? c1 : c2,
      });
    }
    this.flash(0.1);
    this.twinkle(x, y, 0, 18);
    if (style === "double") this.at(this.ct() + 0.16, () => this.burst(x, y, "ring"));
  }
  private shell(delay: number, fx: number, fy: number, style: Burst) {
    const x = this.W * fx;
    const ty = this.H * fy;
    this.add({ k: "shell", x, y: this.H + 10, vx: rnd(-14, 14), vy: -(this.H + 10 - ty) / 0.75, life: 0.75, t: -delay, burst: style, c: C.light });
  }

  // ---- what each level does, timed from when the count starts ----
  private plan() {
    const n = this.o.level;
    const cd = this.cfg.count;
    if (n === 1) {
      for (let i = 0; i < 11; i++) this.at(0.4 + i * 0.75, this.lantern);
      this.at(cd, () => { this.ring(0, 170, 0.35, 3); this.twinkles(8); });
    }
    if (n === 2) {
      for (let i = 0; i < 5; i++) this.at(0.6 + i * 1.1, this.lantern);
      this.at(cd, () => { this.ring(0, 200, 0.6, 4); this.ring(0.25, 260, 0.3, 3); this.twinkles(14); this.shooting(0.4); this.shooting(1.3); this.flash(0.12); });
    }
    if (n === 3) {
      this.at(cd, () => {
        this.flash(0.3); this.shakeA = 4; this.ring(0, 230, 0.7, 5); this.ring(0.2, 320, 0.4, 4); this.twinkles(16); this.cannons(34);
        this.shooting(0.5); this.shooting(1.4); this.shell(0.5, 0.5, 0.1, "peony"); this.shell(1.5, 0.2, 0.14, "ring");
      });
    }
    if (n === 4) {
      this.at(cd, () => {
        this.flash(0.5); this.shakeA = 6; this.ring(0, 260, 0.9, 6); this.ring(0.15, 360, 0.6, 5); this.ring(0.32, 480, 0.35, 4); this.twinkles(20); this.cannons(60);
        this.shell(0.3, 0.5, 0.09, "peony"); this.shell(0.8, 0.16, 0.16, "ring"); this.shell(1.2, 0.84, 0.13, "peony");
        this.shell(1.9, 0.3, 0.08, "willow"); this.shell(2.5, 0.72, 0.15, "double"); this.shell(3.2, 0.5, 0.1, "peony");
        this.shooting(0.4); this.shooting(1.1); this.shooting(2.2);
      });
      this.at(cd + 1.6, () => this.cannons(36));
    }
    if (n === 5) {
      this.at(cd, () => {
        this.flash(0.7); this.shakeA = 9; this.o.onDawn?.();
        this.ring(0, 280, 1, 7); this.ring(0.14, 400, 0.7, 6); this.ring(0.3, 540, 0.5, 5); this.ring(0.5, 700, 0.3, 4);
        this.twinkles(28); this.cannons(70); this.petals(14); this.rainUntil = cd + 3;
        const xs = [0.5, 0.14, 0.86, 0.3, 0.7, 0.5, 0.12, 0.88, 0.5, 0.26, 0.74];
        const ys = [0.08, 0.15, 0.12, 0.07, 0.16, 0.1, 0.1, 0.09, 0.06, 0.13, 0.14];
        const st: Burst[] = ["peony", "ring", "peony", "willow", "double", "peony", "ring", "willow", "double", "peony", "peony"];
        xs.forEach((x, j) => this.shell(0.25 + j * 0.48, x, ys[j], st[j]));
        for (let s = 0; s < 6; s++) this.shooting(0.3 + s * 0.8);
      });
      this.at(cd + 1.8, () => this.cannons(30));
      this.at(cd + 3.4, () => { this.ring(0, 360, 0.5, 5); this.twinkles(22); });
      this.at(cd + 5.6, () => {
        this.burst(this.W * 0.5, this.H * 0.1, "peony"); this.burst(this.W * 0.18, this.H * 0.14, "ring"); this.burst(this.W * 0.82, this.H * 0.12, "willow"); this.flash(0.3);
      });
    }
  }

  /** Seconds since the count started (negative while the card arrives). */
  private ct() {
    return this.ft - this.o.lead;
  }

  private frame = (now: number) => {
    if (this.stopped) return;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.ft += dt;
    const ct = this.ct();
    const cd = this.cfg.count;
    const shown = countAt(this.o.pct, ct, cd);
    if (shown !== this.shown) {
      this.shown = shown;
      this.o.onCount(shown);
    }
    while (this.evs.length && this.evs[0].t <= ct) this.evs.shift()!.fn();
    if (this.trailing && this.o.liveBox) {
      const b = this.o.liveBox();
      for (let i = 0; i < 6; i++) this.ember(b.x + b.w / 2 + rnd(-70, 70), b.y + b.h - 10, false);
    }
    if (this.o.level === 2 && ct < cd && Math.random() < 0.5) this.ember(rnd(10, this.W - 10), this.H + 6, true);
    if (this.shakeA > 0.2) {
      this.o.onShake?.(rnd(-this.shakeA, this.shakeA), rnd(-this.shakeA, this.shakeA));
      this.shakeA *= Math.pow(0.012, dt);
    } else if (this.shakeA) {
      this.shakeA = 0;
      this.o.onShake?.(0, 0);
    }
    if (this.rainUntil && ct < this.rainUntil && Math.random() < 0.6) this.rain(1);
    const g = this.g!;
    g.clearRect(0, 0, this.W, this.H);
    this.sky(g, dt, ct);
    this.particles(g, dt);
    // Done: the count has landed, nothing is queued and nothing is still moving.
    const done = ct > cd + 2 && !this.evs.length && !this.parts.length && this.flashA < 0.004 && !this.shakeA;
    this.raf = done ? 0 : requestAnimationFrame(this.frame);
  };

  // The sky: a glow behind the card, turning rays, and the stars.
  private sky(g: CanvasRenderingContext2D, dt: number, ct: number) {
    const c = this.cfg;
    const t = Math.max(0, ct);
    const k = Math.min(1, t / c.count);
    const after = Math.max(0, t - c.count);
    const R = Math.sqrt(this.W * this.W + this.H * this.H) / 2;
    const w =
      this.ft < this.boostUntil
        ? c.warp * Math.min(1, this.ft / 0.35)
        : ct < 0
          ? c.warp * 0.3
          : t < c.count
            ? c.warp * (0.3 + 0.7 * Math.pow(Math.sin((Math.min(1, t / (c.count * 0.55)) * Math.PI) / 2), 2))
            : c.warp * Math.exp(-after * 2.6);
    const glow = c.glow * (0.25 + 0.75 * k) * (1 + 0.08 * Math.sin(this.ft * 2.2));
    const gg = g.createRadialGradient(this.cx, this.cy, 10, this.cx, this.cy, 300);
    gg.addColorStop(0, rgba(C.gold, 0.34 * glow));
    gg.addColorStop(1, rgba(C.gold, 0));
    g.fillStyle = gg;
    g.fillRect(0, 0, this.W, this.H);
    const ra = c.rays * (t < c.count ? 0.18 * k : Math.min(1, 0.18 + after * 1.6));
    if (ra > 0.01) {
      this.ang += dt * 0.16;
      g.save();
      g.translate(this.cx, this.cy);
      g.rotate(this.ang);
      const rg = g.createRadialGradient(0, 0, 90, 0, 0, R * 1.25);
      rg.addColorStop(0, rgba(C.light, 0.2 * ra));
      rg.addColorStop(1, rgba(C.light, 0));
      g.fillStyle = rg;
      for (let i = 0; i < 14; i++) {
        g.rotate(TAU / 14);
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(R * 1.3, -R * 0.085);
        g.lineTo(R * 1.3, R * 0.085);
        g.closePath();
        g.fill();
      }
      g.restore();
    }
    g.lineCap = "round";
    for (const p of this.stars) {
      p.d += dt * (0.006 + w * 1.9) * p.z * (0.25 + p.d * 1.6);
      if (p.d > 1.25) {
        p.d = rnd(0.02, 0.2);
        p.a = rnd(0, TAU);
      }
      const x = this.cx + Math.cos(p.a) * p.d * R;
      const y = this.cy + Math.sin(p.a) * p.d * R;
      const len = w * 90 * p.d * p.z;
      g.globalAlpha = Math.max(0, Math.min(1, Math.min(1, p.d * 2.4) * (0.3 + 0.25 * Math.sin(this.ft * 2 + p.tw) + w * 0.5)));
      g.strokeStyle = p.c;
      g.lineWidth = p.z * (1 + w * 0.8);
      g.beginPath();
      g.moveTo(x - Math.cos(p.a) * len, y - Math.sin(p.a) * len);
      g.lineTo(x + 0.01, y + 0.01);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  private particles(g: CanvasRenderingContext2D, dt: number) {
    const born: P[] = [];
    this.parts = this.parts.filter((p) => {
      p.t += dt;
      if (p.t < 0) return true;
      if (p.t > p.life) {
        if (p.burst) born.push(p);
        return false;
      }
      const k = p.t / p.life;
      p.px = p.x;
      p.py = p.y;
      if (p.drag) {
        p.vx *= p.drag;
        p.vy *= p.drag;
      }
      if (p.g) p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      g.globalAlpha = Math.min(1, (1 - k) * 1.7);
      if (p.k === "confetti") {
        p.rot = p.rot! + p.vr! * dt;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.fillStyle = p.c;
        const hh = p.h! * Math.cos(p.t * 7 + p.rot);
        g.fillRect(-p.w! / 2, -hh / 2, p.w!, hh);
        g.restore();
      } else if (p.k === "spark") {
        g.strokeStyle = p.c;
        g.lineWidth = p.w!;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(p.px - p.vx * 0.035, p.py - p.vy * 0.035);
        g.lineTo(p.x, p.y);
        g.stroke();
      } else if (p.k === "shell") {
        g.globalAlpha = 1;
        g.strokeStyle = p.c;
        g.lineWidth = 2.5;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(p.x, p.y + 26);
        g.lineTo(p.x, p.y);
        g.stroke();
        if (Math.random() < 0.6) this.ember(p.x, p.y + 10, false);
      } else if (p.k === "ring") {
        g.globalAlpha = p.a! * (1 - k);
        g.strokeStyle = C.light;
        g.lineWidth = p.w! * (1 - k) + 0.6;
        g.beginPath();
        g.arc(p.x, p.y, p.r0! + (p.r1! - p.r0!) * outCubic(k), 0, TAU);
        g.stroke();
      } else if (p.k === "glint") {
        g.globalAlpha = Math.sin(Math.min(1, k) * Math.PI);
        g.fillStyle = p.c;
        g.beginPath();
        g.arc(p.x, p.y, p.r!, 0, TAU);
        g.fill();
      } else if (p.k === "twinkle") {
        const sc = Math.sin(k * Math.PI);
        const r = p.r! * sc;
        g.globalAlpha = sc;
        g.fillStyle = p.c;
        g.beginPath();
        g.moveTo(p.x, p.y - r);
        g.quadraticCurveTo(p.x, p.y, p.x + r, p.y);
        g.quadraticCurveTo(p.x, p.y, p.x, p.y + r);
        g.quadraticCurveTo(p.x, p.y, p.x - r, p.y);
        g.quadraticCurveTo(p.x, p.y, p.x, p.y - r);
        g.fill();
      } else if (p.k === "shooting") {
        const gr = g.createLinearGradient(p.x, p.y, p.x - p.vx * 0.16, p.y - p.vy * 0.16);
        gr.addColorStop(0, rgba(C.light, 0.95));
        gr.addColorStop(1, rgba(C.light, 0));
        g.globalAlpha = Math.sin(k * Math.PI);
        g.strokeStyle = gr;
        g.lineWidth = 2.2;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(p.x, p.y);
        g.lineTo(p.x - p.vx * 0.16, p.y - p.vy * 0.16);
        g.stroke();
      } else if (p.k === "petal") {
        p.rot = p.rot! + p.vr! * dt;
        p.x += Math.sin(p.t * 1.6 + p.sway!) * 26 * dt;
        g.globalAlpha = Math.min(0.9, (1 - k) * 3);
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.fillStyle = p.c;
        g.beginPath();
        g.ellipse(0, 0, p.w!, p.w! * 0.55, 0, 0, TAU);
        g.fill();
        g.restore();
      } else {
        p.x += Math.sin(p.t * 0.9 + p.sway!) * 12 * dt;
        const a = Math.min(1, p.t * 1.5) * Math.min(1, (1 - k) * 4);
        const s = p.s!;
        const lg = g.createRadialGradient(p.x, p.y, 2, p.x, p.y, 46 * s);
        lg.addColorStop(0, rgba(C.lantern, 0.5 * a));
        lg.addColorStop(1, rgba(C.lantern, 0));
        g.globalAlpha = 1;
        g.fillStyle = lg;
        g.fillRect(p.x - 50 * s, p.y - 50 * s, 100 * s, 100 * s);
        g.globalAlpha = a;
        g.fillStyle = C.gold;
        g.beginPath();
        g.moveTo(p.x - 7 * s, p.y - 10 * s);
        g.lineTo(p.x + 7 * s, p.y - 10 * s);
        g.lineTo(p.x + 5 * s, p.y + 9 * s);
        g.lineTo(p.x - 5 * s, p.y + 9 * s);
        g.closePath();
        g.fill();
        g.fillStyle = C.light;
        g.fillRect(p.x - 3 * s, p.y + 2 * s, 6 * s, 6 * s);
      }
      return true;
    });
    for (const p of born) this.burst(p.x, p.y, p.burst!);
    g.globalAlpha = 1;
    if (this.flashA > 0.004) {
      g.fillStyle = rgba(C.light, this.flashA);
      g.fillRect(0, 0, this.W, this.H);
      this.flashA *= Math.pow(0.02, dt);
    }
  }
}
