// Builds the redesign review gallery: current screen vs redesigned mockup,
// side by side, one pair per screen. Overwrites design-review/gallery.html so
// the published artifact keeps its URL.
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = "/home/user/TwoAgree";
const CUR = `${ROOT}/design-review/screens`;
const NEW = `${ROOT}/design-review/redesign/shots`;
const b64 = (p) => readFileSync(p).toString("base64");
const png = (dir, name) => `data:image/png;base64,${b64(`${dir}/${name}.png`)}`;
const font = (p) =>
  `data:font/woff2;base64,${b64(`${ROOT}/node_modules/@fontsource/${p}`)}`;

const F400 = font("fraunces/files/fraunces-latin-400-normal.woff2");
const F600 = font("fraunces/files/fraunces-latin-600-normal.woff2");
const H400 = font("hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff2");
const H600 = font("hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2");

// [redesign file, current file, title, one-line note]
const PAIRS = [
  ["onboarding", "onboarding", "Onboarding", "The verse becomes the hero — gold on claret, the brand's signature, from the first screen."],
  ["auth", "auth", "Sign in", "Segmented mode switch, floating-label fields, claret primary — quieter, more composed."],
  ["home", "app-home", "Home", "A claret morning panel carries the greeting and both stats; one continue hero below, reveals as quiet rows."],
  ["decks", "app-talk", "Talk", "A “continue where you left off” hero, then hairline rows with per-part progress ticks — no more donut soup."],
  ["play", "play", "Answering", "Segmented progress, roomier options with a real selected state; the identity-purple CTA stays."],
  ["reveal", "reveal", "The reveal moment", "A full claret ceremony: gold arc, met avatars, the unlock line in Fraunces italic."],
  ["reveal-review", "reveal-review", "Agreement breakdown", "Scores live on a claret band; verdict chips are colour-coded; answers read as his/hers pills."],
  ["results", "app-together", "Together", "Known leads in gold on claret; superlatives as twin tiles; decks as rows with agreed · known columns."],
  ["flags", "flags", "Before you walk on", "One flag at a time: why it's flagged (on claret), the answers, and a starter question to get you talking."],
  ["profile", "profile", "Profile", "An identity card up top — you, your line, who you're walking with — then quiet grouped settings."],
];

const pair = ([nf, cf, title, note], i) => `
    <section class="pair">
      <header class="phead">
        <span class="pnum">${String(i + 1).padStart(2, "0")}</span>
        <div><h2>${title}</h2><p>${note}</p></div>
      </header>
      <div class="duo">
        <figure>
          <div class="tag was">Current</div>
          <div class="frame"><img src="${png(CUR, cf)}" alt="${title} — current" loading="lazy"></div>
        </figure>
        <figure>
          <div class="tag now">Redesign</div>
          <div class="frame hot"><img src="${png(NEW, nf)}" alt="${title} — redesign" loading="lazy"></div>
        </figure>
      </div>
    </section>`;

const html = `<style>
  @font-face { font-family:"Fraunces"; src:url(${F400}) format("woff2"); font-weight:400; font-display:swap; }
  @font-face { font-family:"Fraunces"; src:url(${F600}) format("woff2"); font-weight:600; font-display:swap; }
  @font-face { font-family:"Hanken"; src:url(${H400}) format("woff2"); font-weight:400; font-display:swap; }
  @font-face { font-family:"Hanken"; src:url(${H600}) format("woff2"); font-weight:600; font-display:swap; }
  :root {
    --ground:#FBF6F0; --ink:#2A1120; --ink2:#6B5A61; --claret:#3E1A2E; --honey:#B67A1E;
    --gold:#DCB265; --blush:#F3DED6; --line:#EADFD8;
    --shadow: 22px 36px 70px -44px rgba(62,26,46,.5);
    --disp:"Fraunces",Georgia,serif; --ui:"Hanken",system-ui,sans-serif;
  }
  @media (prefers-color-scheme: dark) {
    :root { --ground:#1C0C15; --ink:#F5E7EB; --ink2:#BE9CA8; --claret:#2A1120; --honey:#DCB265;
      --blush:#3A1C2C; --line:#3E2130; --shadow: 22px 36px 70px -44px rgba(0,0,0,.75); }
  }
  :root[data-theme="light"] { --ground:#FBF6F0; --ink:#2A1120; --ink2:#6B5A61; --claret:#3E1A2E;
    --honey:#B67A1E; --blush:#F3DED6; --line:#EADFD8; --shadow: 22px 36px 70px -44px rgba(62,26,46,.5); }
  :root[data-theme="dark"] { --ground:#1C0C15; --ink:#F5E7EB; --ink2:#BE9CA8; --claret:#2A1120;
    --honey:#DCB265; --blush:#3A1C2C; --line:#3E2130; --shadow: 22px 36px 70px -44px rgba(0,0,0,.75); }

  * { box-sizing: border-box; }
  body { margin:0; background:var(--ground); color:var(--ink); font-family:var(--ui); -webkit-font-smoothing:antialiased; }
  .wrap { max-width:1160px; margin:0 auto; padding:0 28px 96px; }

  .mast { background:#3E1A2E; color:#F3DED6; margin:0 -28px; padding:60px 28px 38px; }
  .mast-in { max-width:1160px; margin:0 auto; }
  .kicker { font:600 12px var(--ui); letter-spacing:.22em; text-transform:uppercase; color:#DCB265; margin:0 0 14px; }
  .mast h1 { font-family:var(--disp); font-weight:600; font-size:clamp(32px,5.5vw,54px); line-height:1.04; margin:0; text-wrap:balance; }
  .mast .thesis { margin:18px 0 0; max-width:62ch; font:400 16px/1.6 var(--ui); color:#E7CBBE; }
  .mast .thesis b { color:#F3DED6; }
  .mast .meta { display:flex; flex-wrap:wrap; gap:10px 22px; margin-top:26px; padding-top:16px;
    border-top:1px solid rgba(220,178,101,.28); font-size:13.5px; color:#CBA9AE; }
  .mast .meta b { color:#F3DED6; }

  .pair { margin-top:72px; }
  .phead { display:flex; gap:18px; align-items:baseline; max-width:70ch; }
  .pnum { font-family:var(--disp); font-weight:600; font-size:15px; color:var(--honey);
    border:1.5px solid var(--line); border-radius:999px; padding:6px 11px; flex:none; }
  .phead h2 { font-family:var(--disp); font-weight:600; font-size:clamp(24px,3.4vw,32px); margin:0; }
  .phead p { margin:8px 0 0; color:var(--ink2); font-size:15.5px; line-height:1.55; }

  .duo { display:grid; grid-template-columns:1fr 1fr; gap:34px; margin-top:24px; align-items:start; }
  @media (max-width:760px){ .duo { grid-template-columns:1fr; } }
  figure { margin:0; }
  .tag { display:inline-block; font:600 11px/1 var(--ui); letter-spacing:.18em; text-transform:uppercase;
    padding:7px 12px; border-radius:999px; margin-bottom:12px; }
  .tag.was { background:var(--blush); color:#7B3A5A; }
  .tag.now { background:#3E1A2E; color:#DCB265; }
  .frame { border-radius:28px; overflow:hidden; background:#fff; box-shadow:var(--shadow); }
  .frame.hot { outline:2.5px solid var(--gold); outline-offset:4px; }
  .frame img { display:block; width:100%; height:auto; }

  .foot { margin-top:80px; padding-top:24px; border-top:1px solid var(--line); color:var(--ink2);
    font-size:13.5px; line-height:1.65; max-width:75ch; }
</style>

<div class="mast">
  <div class="mast-in">
    <p class="kicker">TwoAgree · Design review, round two</p>
    <h1>The redesign, side by side</h1>
    <p class="thesis"><b>Gold on claret, at the moments that matter.</b> The brand's signature ground now carries the
      emotional beats — the verse, the reveal, the scores, the greeting — while working screens go quieter:
      one hero moment per screen, hairline rows instead of stacked cards, colour-coded verdicts, and his-and-hers
      answer pills throughout.</p>
    <div class="meta">
      <span><b>10 screens</b> reworked</span>
      <span>Left: <b>current build</b> · Right: <b>redesign</b></span>
      <span>Real Fraunces + Hanken Grotesk</span>
      <span>430 × 932 · 2×</span>
    </div>
  </div>
</div>

<div class="wrap">
  ${PAIRS.map(pair).join("")}
  <p class="foot">
    Redesigns are pixel-accurate HTML/CSS mockups on the real brand tokens and vector mark — buildable as-is in the
    React app. The play screen keeps its identity-purple button and progress bar. Gold sits only on claret grounds;
    working surfaces stay white and blush with the honey action colour.
  </p>
</div>`;

writeFileSync(`${ROOT}/design-review/gallery.html`, html);
console.log(`gallery.html written — ${PAIRS.length} pairs, ${(html.length / 1024 / 1024).toFixed(1)} MB`);
