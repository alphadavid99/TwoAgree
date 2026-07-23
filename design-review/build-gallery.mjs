import { readFileSync, writeFileSync } from "node:fs";

const ROOT = "/home/user/TwoAgree";
const SHOTS = `${ROOT}/design-review/screens`;
const b64 = (p) => readFileSync(p).toString("base64");
const png = (name) => `data:image/png;base64,${b64(`${SHOTS}/${name}.png`)}`;
const font = (p) =>
  `data:font/woff2;base64,${b64(`${ROOT}/node_modules/@fontsource/${p}`)}`;

const F400 = font("fraunces/files/fraunces-latin-400-normal.woff2");
const F600 = font("fraunces/files/fraunces-latin-600-normal.woff2");
const H400 = font("hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff2");
const H600 = font("hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2");

// Curated flow: each distinct screen once, preferring the capture with the
// real bottom-nav chrome where one exists.
const GROUPS = [
  {
    eyebrow: "Before the session",
    title: "Getting in",
    blurb:
      "The front door: what a couple meets before they’ve answered a thing — the promise, the account, the first choice.",
    shots: [
      ["onboarding", "Onboarding", "The opening promise — Amos 3:3 and how it works."],
      ["auth", "Create account / sign in", "Email or Google; consent lives here."],
      ["startmenu", "Pick a starter", "A first conversation matched to your stage."],
      ["start", "Start or join", "Open a new session, or join a partner’s by code."],
    ],
  },
  {
    eyebrow: "The signed-in shell",
    title: "Home base",
    blurb:
      "The four tabs of the live app, each shown with the floating pill nav that carries between them.",
    shots: [
      ["app-home", "Home", "Where you left off, together."],
      ["app-talk", "Talk", "Every conversation, grouped by depth."],
      ["app-together", "Together", "Where the two of you landed, deck by deck."],
      ["app-path", "The Path", "A guided journey, drawn from what you both say matters."],
    ],
  },
  {
    eyebrow: "Answering & revealing",
    title: "The heart of it",
    blurb:
      "One partner answering in private, then the shared reveal — the moment neither sees until both are in.",
    shots: [
      ["play", "Answering", "One question at a time; predict your partner next."],
      ["reveal", "The reveal moment", "“You’ve both answered” — the unlock."],
      ["reveal-review", "Agreement breakdown", "Per-question verdicts, guesses and scale gaps."],
      ["flags", "Before you walk on", "Blind spots and uneven stakes, gathered for a closer look."],
      ["partpicker", "Choosing a part", "Deeper levels of a conversation, unlocked in order."],
      ["pathstep", "A Path step", "Walking one guided step of the journey."],
    ],
  },
  {
    eyebrow: "The numbers & you",
    title: "Where you stand",
    blurb: "The scoring instrument and the account — the two screens that hold the record.",
    shots: [
      ["corescore", "Core score", "Two numbers: how well you know each other, and how much you agree."],
      ["profile", "Profile & your data", "Name, photo, language — plus export and delete (GDPR)."],
    ],
  },
];

const count = GROUPS.reduce((n, g) => n + g.shots.length, 0);

const card = ([file, name, role]) => `
      <figure class="card">
        <button class="frame" type="button" data-src="${file}" aria-label="Enlarge ${name}">
          <img src="${png(file)}" alt="${name} screen" loading="lazy" />
        </button>
        <figcaption>
          <span class="cname">${name}</span>
          <span class="crole">${role}</span>
        </figcaption>
      </figure>`;

const section = (g) => `
    <section class="grp">
      <header class="grp-head">
        <p class="eyebrow">${g.eyebrow}</p>
        <h2>${g.title}</h2>
        <p class="blurb">${g.blurb}</p>
      </header>
      <div class="grid">${g.shots.map(card).join("")}</div>
    </section>`;

const html = `<style>
  @font-face { font-family: "Fraunces"; src: url(${F400}) format("woff2"); font-weight: 400; font-display: swap; }
  @font-face { font-family: "Fraunces"; src: url(${F600}) format("woff2"); font-weight: 600; font-display: swap; }
  @font-face { font-family: "Hanken"; src: url(${H400}) format("woff2"); font-weight: 400; font-display: swap; }
  @font-face { font-family: "Hanken"; src: url(${H600}) format("woff2"); font-weight: 600; font-display: swap; }

  :root {
    --ground: #FBF6F0; --panel: #FFFFFF; --frame: #FFFFFF;
    --ink: #2A1120; --ink2: #6B5A61;
    --claret: #3E1A2E; --honey: #B67A1E; --honey-on-claret: #DCB265;
    --blush: #F3DED6; --line: #EADFD8;
    --shadow: 24px 40px 80px -48px rgba(62, 26, 46, .45);
    --disp: "Fraunces", Georgia, serif;
    --ui: "Hanken", system-ui, sans-serif;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --ground: #1C0C15; --panel: #291320; --frame: #FFFFFF;
      --ink: #F5E7EB; --ink2: #BE9CA8;
      --claret: #F3DED6; --honey: #DCB265; --honey-on-claret: #DCB265;
      --blush: #3A1C2C; --line: #3E2130;
      --shadow: 24px 40px 80px -48px rgba(0, 0, 0, .7);
    }
  }
  :root[data-theme="light"] {
    --ground: #FBF6F0; --panel: #FFFFFF; --ink: #2A1120; --ink2: #6B5A61;
    --claret: #3E1A2E; --honey: #B67A1E; --blush: #F3DED6; --line: #EADFD8;
    --shadow: 24px 40px 80px -48px rgba(62, 26, 46, .45);
  }
  :root[data-theme="dark"] {
    --ground: #1C0C15; --panel: #291320; --ink: #F5E7EB; --ink2: #BE9CA8;
    --claret: #F3DED6; --honey: #DCB265; --blush: #3A1C2C; --line: #3E2130;
    --shadow: 24px 40px 80px -48px rgba(0, 0, 0, .7);
  }

  * { box-sizing: border-box; }
  body { margin: 0; background: var(--ground); color: var(--ink); font-family: var(--ui); -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 1200px; margin: 0 auto; padding: 0 28px 96px; }

  /* Masthead — the one claret band; gold rides only on it (brand rule 1). */
  .mast { background: var(--claret); color: #F3DED6; margin: 0 -28px 8px; padding: 64px 28px 40px; }
  @media (prefers-color-scheme: dark) { .mast { background: #2A1120; } }
  :root[data-theme="dark"] .mast { background: #2A1120; }
  :root[data-theme="light"] .mast { background: #3E1A2E; color: #F3DED6; }
  .mast-in { max-width: 1200px; margin: 0 auto; }
  .mast .kicker { font-family: var(--ui); font-weight: 600; text-transform: uppercase; letter-spacing: .22em; font-size: 12px; color: #DCB265; margin: 0 0 14px; }
  .mast h1 { font-family: var(--disp); font-weight: 600; font-size: clamp(34px, 6vw, 60px); line-height: 1.02; letter-spacing: -.01em; margin: 0; text-wrap: balance; }
  .mast .verse { font-family: var(--disp); font-style: italic; font-size: clamp(16px, 2.4vw, 22px); color: #E7CBBE; margin: 16px 0 0; max-width: 34ch; }
  .mast .meta { display: flex; flex-wrap: wrap; gap: 10px 22px; margin: 30px 0 0; font-size: 13.5px; color: #CBA9AE; border-top: 1px solid rgba(220,178,101,.28); padding-top: 18px; }
  .mast .meta b { color: #F3DED6; font-weight: 600; }

  .grp { margin-top: 64px; }
  .grp-head { max-width: 60ch; }
  .eyebrow { font-weight: 600; text-transform: uppercase; letter-spacing: .2em; font-size: 12px; color: var(--honey); margin: 0 0 10px; }
  .grp-head h2 { font-family: var(--disp); font-weight: 600; font-size: clamp(26px, 4vw, 38px); line-height: 1.05; margin: 0; color: var(--ink); text-wrap: balance; }
  .blurb { color: var(--ink2); font-size: 16px; line-height: 1.55; margin: 12px 0 0; }

  .grid { margin-top: 30px; column-width: 288px; column-gap: 30px; }
  .card { break-inside: avoid; margin: 0 0 34px; display: flex; flex-direction: column; gap: 14px; }
  .frame { display: block; width: 100%; padding: 0; border: 0; background: var(--frame); border-radius: 30px; overflow: hidden; box-shadow: var(--shadow); cursor: zoom-in; outline-offset: 4px; }
  .frame img { display: block; width: 100%; height: auto; border-radius: 30px; }
  .frame:focus-visible { outline: 3px solid var(--honey); }
  figcaption { display: flex; flex-direction: column; gap: 3px; padding: 0 4px; }
  .cname { font-family: var(--ui); font-weight: 600; font-size: 16px; color: var(--ink); }
  .crole { font-size: 13.5px; line-height: 1.45; color: var(--ink2); }

  /* Lightbox */
  .lb { position: fixed; inset: 0; background: rgba(30, 12, 21, .86); display: none; align-items: flex-start; justify-content: center; padding: 40px; overflow: auto; z-index: 50; }
  .lb.on { display: flex; }
  .lb img { max-width: min(440px, 100%); width: 100%; height: auto; border-radius: 34px; box-shadow: 0 40px 120px -30px rgba(0,0,0,.8); }
  .lb-close { position: fixed; top: 20px; right: 24px; width: 44px; height: 44px; border-radius: 50%; border: 0; background: #F3DED6; color: #2A1120; font-size: 22px; cursor: pointer; }

  .foot { margin-top: 72px; padding-top: 24px; border-top: 1px solid var(--line); color: var(--ink2); font-size: 13.5px; line-height: 1.6; }
  @media (prefers-reduced-motion: no-preference) { .frame img { transition: transform .3s ease; } .frame:hover img { transform: scale(1.015); } }
</style>

<div class="mast">
  <div class="mast-in">
    <p class="kicker">TwoAgree · Design review</p>
    <h1>Every screen, one wall</h1>
    <p class="verse">“Can two walk together, unless they are agreed?” — Amos 3:3</p>
    <div class="meta">
      <span><b>${count} screens</b> across four flows</span>
      <span><b>23 Jul 2026</b></span>
      <span>Rendered at <b>430&nbsp;×&nbsp;932</b>, 2× density</span>
      <span>Real type — <b>Fraunces + Hanken Grotesk</b>, not the fallback</span>
    </div>
  </div>
</div>

<div class="wrap">
  ${GROUPS.map(section).join("")}
  <p class="foot">
    Captured from the live React build in an isolated harness (Firebase stubbed, mock couple “Sarah &amp; Judah”).
    Data is representative — a spread of Agreed / Close / Worth-a-chat verdicts and both flag types — so the scoring
    screens show real range. Tap any screen to enlarge.
  </p>
</div>

<div class="lb" id="lb"><button class="lb-close" id="lbClose" aria-label="Close">×</button><img id="lbImg" alt="" /></div>

<script>
  const lb = document.getElementById("lb"), lbImg = document.getElementById("lbImg");
  document.querySelectorAll(".frame").forEach((b) => b.addEventListener("click", () => {
    lbImg.src = b.querySelector("img").src; lb.classList.add("on"); document.body.style.overflow = "hidden";
  }));
  const close = () => { lb.classList.remove("on"); lbImg.src = ""; document.body.style.overflow = ""; };
  document.getElementById("lbClose").addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
</script>`;

writeFileSync(`${ROOT}/design-review/gallery.html`, html);
console.log(`gallery.html written — ${count} screens, ${(html.length / 1024 / 1024).toFixed(1)} MB`);
