// Renders DESIGN-BRIEF.md as a styled, self-contained HTML page with every
// attached image embedded as an appendix. Light markdown converter — covers
// exactly the syntax the brief uses (h1-h3, hr, tables, lists, bold, italic,
// inline code, blockquote-free prose).
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const ROOT = "/home/user/TwoAgree/design-review";
const md = readFileSync(`${ROOT}/brief/DESIGN-BRIEF.md`, "utf8");
const b64 = (p) => readFileSync(p).toString("base64");
const png = (p) => `data:image/png;base64,${b64(p)}`;
const font = (p) =>
  `data:font/woff2;base64,${b64(`/home/user/TwoAgree/node_modules/@fontsource/${p}`)}`;

const inline = (s) =>
  s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

function mdToHtml(src) {
  const lines = src.split("\n");
  const out = [];
  let i = 0, list = null, para = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  while (i < lines.length) {
    const l = lines[i];
    if (/^\|/.test(l)) {
      flushPara(); flushList();
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => inline(c.trim()));
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push('<div class="tbl"><table><thead><tr>' + head.map((h) => `<th>${h}</th>`).join("") +
        "</tr></thead><tbody>" +
        body.map((r) => "<tr>" + r.map((c) => `<td>${c}</td>`).join("") + "</tr>").join("") +
        "</tbody></table></div>");
      continue;
    }
    if (/^#{1,3} /.test(l)) {
      flushPara(); flushList();
      const level = l.match(/^#+/)[0].length;
      out.push(`<h${level}>${inline(l.replace(/^#+ /, ""))}</h${level}>`);
    } else if (/^---\s*$/.test(l)) {
      flushPara(); flushList(); out.push("<hr>");
    } else if (/^[-*] /.test(l)) {
      flushPara();
      if (list !== "ul") { flushList(); out.push("<ul>"); list = "ul"; }
      // gather continuation lines (indented)
      let item = l.replace(/^[-*] /, "");
      while (i + 1 < lines.length && /^ {2,}\S/.test(lines[i + 1]) && !/^ *([-*]|[0-9]+\.) /.test(lines[i + 1])) { item += " " + lines[++i].trim(); }
      out.push(`<li>${inline(item)}</li>`);
    } else if (/^\d+\. /.test(l)) {
      flushPara();
      if (list !== "ol") { flushList(); out.push("<ol>"); list = "ol"; }
      let item = l.replace(/^\d+\. /, "");
      while (i + 1 < lines.length && /^ {2,}\S/.test(lines[i + 1]) && !/^ *([-*]|[0-9]+\.) /.test(lines[i + 1])) { item += " " + lines[++i].trim(); }
      out.push(`<li>${inline(item)}</li>`);
    } else if (/^\s*$/.test(l)) {
      flushPara(); flushList();
    } else {
      flushList(); para.push(l.trim());
    }
    i++;
  }
  flushPara(); flushList();
  return out.join("\n");
}

const gallery = (dir, title, note) => {
  const files = readdirSync(`${ROOT}/brief/${dir}`).filter((f) => f.endsWith(".png")).sort();
  return `<h3>${title}</h3><p class="gnote">${note}</p><div class="grid">` +
    files.map((f) => `<figure><div class="frame"><img loading="lazy" src="${png(`${ROOT}/brief/${dir}/${f}`)}" alt="${f}"></div><figcaption><code>${dir}/${f}</code></figcaption></figure>`).join("") +
    "</div>";
};

const html = `<style>
  @font-face { font-family:"Fraunces"; src:url(${font("fraunces/files/fraunces-latin-600-normal.woff2")}) format("woff2"); font-weight:600; font-display:swap; }
  @font-face { font-family:"Hanken"; src:url(${font("hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff2")}) format("woff2"); font-weight:400; font-display:swap; }
  @font-face { font-family:"Hanken"; src:url(${font("hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2")}) format("woff2"); font-weight:600; font-display:swap; }
  :root { --ground:#FBF6F0; --panel:#fff; --ink:#2A1120; --ink2:#6B5A61; --claret:#3E1A2E;
    --gold:#DCB265; --amber:#8F5A12; --blush:#F3DED6; --line:#EADFD8; }
  @media (prefers-color-scheme: dark) { :root { --ground:#1C0C15; --panel:#291320; --ink:#F5E7EB;
    --ink2:#BE9CA8; --claret:#2A1120; --amber:#DCB265; --blush:#3A1C2C; --line:#3E2130; } }
  :root[data-theme="light"] { --ground:#FBF6F0; --panel:#fff; --ink:#2A1120; --ink2:#6B5A61;
    --claret:#3E1A2E; --amber:#8F5A12; --blush:#F3DED6; --line:#EADFD8; }
  :root[data-theme="dark"] { --ground:#1C0C15; --panel:#291320; --ink:#F5E7EB; --ink2:#BE9CA8;
    --claret:#2A1120; --amber:#DCB265; --blush:#3A1C2C; --line:#3E2130; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--ground); color:var(--ink);
    font:400 16px/1.65 "Hanken",system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
  .mast { background:#3E1A2E; color:#F3DED6; padding:56px 28px 36px; }
  .mast-in, .wrap { max-width:880px; margin:0 auto; }
  .mast .k { font:600 12px "Hanken"; letter-spacing:.22em; text-transform:uppercase; color:#DCB265; margin:0 0 12px; }
  .mast h1 { font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:clamp(30px,5vw,48px);
    line-height:1.05; margin:0; }
  .mast p.sub { margin:14px 0 0; color:#E7CBBE; max-width:60ch; }
  .wrap { padding:12px 28px 96px; }
  h1 { display:none; } /* md h1 duplicated by masthead */
  h2 { font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:28px; line-height:1.15;
    margin:52px 0 14px; text-wrap:balance; }
  h3 { font:600 17px "Hanken"; margin:32px 0 10px; }
  p, li { color:var(--ink); max-width:72ch; }
  em { color:var(--ink2); }
  hr { border:0; border-top:1px solid var(--line); margin:40px 0; }
  code { background:var(--blush); border-radius:6px; padding:2px 7px; font:500 13.5px ui-monospace,monospace; }
  ul, ol { padding-left:24px; } li { margin:6px 0; }
  .tbl { overflow-x:auto; margin:16px 0; border:1px solid var(--line); border-radius:14px; background:var(--panel); }
  table { border-collapse:collapse; width:100%; font-size:14.5px; }
  th { text-align:left; font:600 11.5px "Hanken"; letter-spacing:.12em; text-transform:uppercase;
    color:var(--amber); padding:12px 16px; border-bottom:1px solid var(--line); }
  td { padding:11px 16px; border-bottom:1px solid var(--line); vertical-align:top; }
  tr:last-child td { border-bottom:0; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:20px; margin:18px 0 8px; }
  figure { margin:0; }
  .frame { border-radius:18px; overflow:hidden; background:#fff; box-shadow:0 16px 34px -22px rgba(62,26,46,.45); }
  .frame img { display:block; width:100%; height:auto; }
  figcaption { margin-top:8px; font-size:12px; color:var(--ink2); }
  .gnote { color:var(--ink2); font-size:14.5px; margin-top:-4px; }
  .appx { margin-top:64px; padding-top:8px; border-top:2px solid var(--claret); }
</style>
<div class="mast"><div class="mast-in">
  <p class="k">TwoAgree · Project spec for Claude Design</p>
  <h1>Design brief — every screen, the system, and the direction</h1>
  <p class="sub">The written spec below is also in the zip as <b>DESIGN-BRIEF.md</b>, alongside all
  30 screen images and the brand assets referenced here.</p>
</div></div>
<div class="wrap">
${mdToHtml(md)}
<div class="appx">
  <h2>Appendix — attached images</h2>
  ${gallery("current", "Current build (20)", "Screenshots of the live React app — the surfaces being redesigned.")}
  ${gallery("redesign", "Round-two concepts (10)", "The approved direction — “gold on claret, at the moments that matter.” Push further from here.")}
</div>
</div>`;

writeFileSync(`${ROOT}/brief.html`, html);
console.log(`brief.html — ${(html.length / 1024 / 1024).toFixed(1)} MB`);
