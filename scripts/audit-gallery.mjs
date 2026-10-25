// Accessibility audit over every gallery screen (design refresh, item 16):
//  - text smaller than 12px
//  - tap targets smaller than 44px (Apple's minimum; the kit aims for 48)
//  - text below 4.5:1 against its ground (3:1 for large text, 24px+ or 18.66px+ bold)
// Run after `npm run build:gallery`:   npm run audit:gallery
// Writes review/audit.json and prints a summary. Exits 1 if anything fails.
// Needs a Chromium; set CHROMIUM_PATH if it isn't at /opt/pw-browsers/chromium.
import { chromium } from 'playwright-core'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const SRC = resolve('dist-gallery/twoagree-screens.html')
const CHROMIUM = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium'
if (!existsSync(SRC)) {
  console.error('Build the gallery first: npm run build:gallery')
  process.exit(1)
}

const browser = await chromium.launch({ executablePath: CHROMIUM })
const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } })
await page.goto(pathToFileURL(SRC).href + '?all=1')
await page.waitForFunction(
  () => [...document.querySelectorAll('.gframe')].every((f) => f.dataset.gready !== 'false'),
  null,
  { timeout: 120_000 },
)
// Let entrance motion settle so colours and sizes are final.
await page.waitForTimeout(4000)
// Backdrops such as the reveal's claret room ignore pointer events, which hides
// them from elementsFromPoint; measuring needs them.
await page.addStyleTag({ content: '.gframe * { pointer-events: auto !important }' })

const ids = await page.$$eval('.gframe', (fs) => fs.map((f) => f.dataset.frame))
const results = []
for (const id of ids) {
  await page.$eval(`.gframe[data-frame="${id}"]`, (f) => f.scrollIntoView({ block: 'center' }))
  results.push(await page.evaluate((id) => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number)
    return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }
  }
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const blend = (top, bot) => ({
    r: top.r * top.a + bot.r * (1 - top.a),
    g: top.g * top.a + bot.g * (1 - top.a),
    b: top.b * top.a + bot.b * (1 - top.a),
    a: 1,
  })
  const layerOf = (n) => {
    const cs = getComputedStyle(n)
    const bg = parse(cs.backgroundColor)
    if (bg && bg.a > 0) return bg
    if (cs.backgroundImage && cs.backgroundImage !== 'none') {
      const stop = cs.backgroundImage.match(/rgba?\([^)]+\)/)
      if (stop) return parse(stop[0])
    }
    return null
  }
  // The ground under an element: what is actually painted beneath its centre
  // (so a positioned backdrop, like the reveal's claret room, counts), blended
  // down to the first opaque layer. Off-screen elements fall back to their
  // ancestors. A gradient or image ground is approximated by its first stop.
  const sample = (el) => {
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const fr = el.closest('.gframe').getBoundingClientRect()
    const onScreen = cx > fr.left && cx < fr.right && cy > fr.top && cy < fr.bottom &&
      cx > 0 && cy > 0 && cx < innerWidth && cy < innerHeight
    if (!onScreen) return null
    // Text under something else (the floating tab bar) isn't readable here.
    const top = document.elementFromPoint(cx, cy)
    if (top && !(el.contains(top) || top.contains(el))) return null
    const layers = []
    for (const n of document.elementsFromPoint(cx, cy)) {
      if (n !== el && el.contains(n)) continue
      const l = layerOf(n)
      if (l) layers.push(l)
      if (l && l.a >= 1) break
      if (n.classList.contains('gframe')) break
    }
    let c = { r: 255, g: 255, b: 255, a: 1 }
    for (let i = layers.length - 1; i >= 0; i--) c = blend(layers[i], c)
    return c
  }
  // The ground under an element: what is actually painted beneath its centre
  // (so a positioned backdrop, like the reveal's claret room, counts), blended
  // down to the first opaque layer. An element scrolled out of view, or under
  // the tab bar, is scrolled into view first; only if that fails do we fall
  // back to its ancestors. A gradient ground is approximated by its first stop.
  const groundOf = (el) => {
    // The reveal's claret room is position:fixed in the app (it covers the
    // phone however far you scroll); in a gallery frame, which uses transform
    // to contain fixed elements, it scrolls away. Measure against the room.
    const room = el.closest('.ceremony.lit')?.querySelector('.ceremony-ground')
    if (room) {
      const stop = getComputedStyle(room).backgroundImage.match(/rgba?\([^)]+\)/g)
      if (stop) {
        const layers = []
        for (let n = el; n && n !== room.parentElement; n = n.parentElement) {
          const l = layerOf(n)
          if (l) layers.push(l)
        }
        let c = parse(stop[stop.length - 1])
        for (let i = layers.length - 1; i >= 0; i--) c = blend(layers[i], c)
        return c
      }
    }
    let got = sample(el)
    if (!got) {
      const box = el.closest('.gframe')
      const keep = [...box.querySelectorAll('*')].filter((n) => n.scrollTop).map((n) => [n, n.scrollTop])
      const pageY = scrollY
      el.scrollIntoView({ block: 'center' })
      got = sample(el)
      keep.forEach(([n, y]) => (n.scrollTop = y))
      scrollTo(0, pageY)
    }
    if (got) return got
    const layers = []
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n)
      const bg = parse(cs.backgroundColor)
      if (bg && bg.a > 0) layers.push(bg)
      else if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        const stop = cs.backgroundImage.match(/rgba?\([^)]+\)/)
        if (stop) layers.push(parse(stop[0]))
      }
      if (layers.length && layers[layers.length - 1].a >= 1) break
      if (n.classList?.contains('gframe')) break
    }
    let c = { r: 255, g: 255, b: 255, a: 1 }
    for (let i = layers.length - 1; i >= 0; i--) c = blend(layers[i], c)
    return c
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return false
    const cs = getComputedStyle(el)
    return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05
  }
  const label = (el) =>
    (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || el.tagName)
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 60)

  {
    const frame = document.querySelector(`.gframe[data-frame="${id}"]`)
    const small = []
    const taps = []
    const contrast = []
    const seenText = new Set()
    // An open dialog makes everything behind it inert: measure only the dialog.
    const modal = frame.querySelector('[aria-modal="true"]')
    const inScope = (el) => !modal || modal.contains(el)
    // Text: every element that directly holds visible text.
    const walker = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT)
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      if (!t.textContent.trim()) continue
      const el = t.parentElement
      if (!el || seenText.has(el) || !visible(el) || !inScope(el)) continue
      if (el.closest('[aria-hidden="true"], .sr-only, svg, .gframe-crash')) continue
      seenText.add(el)
      const cs = getComputedStyle(el)
      const px = parseFloat(cs.fontSize)
      if (px < 12) small.push({ text: label(el), px })
      const fg = parse(cs.color)
      if (!fg) continue
      const bg = groundOf(el)
      const c = ratio(blend(fg, bg), bg)
      const bold = Number(cs.fontWeight) >= 700
      const large = px >= 24 || (bold && px >= 18.66)
      const need = large ? 3 : 4.5
      if (c < need) contrast.push({ text: label(el), ratio: Math.round(c * 100) / 100, need })
    }
    // Tap targets.
    const sel = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=switch], [role=checkbox], [role=radio], [role=tab]'
    for (const el of frame.querySelectorAll(sel)) {
      if (!visible(el) || el.disabled || !inScope(el)) continue
      if (el.closest('[aria-hidden="true"], .gframe-crash')) continue
      let r = el.getBoundingClientRect()
      // A checkbox wrapped in its label is tapped through the label.
      if (el.matches('input[type=checkbox], input[type=radio]') && el.closest('label')) {
        r = el.closest('label').getBoundingClientRect()
      }
      if (r.height < 44 || r.width < 44) taps.push({ el: label(el), w: Math.round(r.width), h: Math.round(r.height) })
    }
    return { id, small, taps, contrast }
  }
  }, id))
}
await browser.close()

const fails = results.filter((r) => r.small.length || r.taps.length || r.contrast.length)
const total = (k) => results.reduce((n, r) => n + r[k].length, 0)
mkdirSync('review', { recursive: true })
writeFileSync('review/audit.json', JSON.stringify({ screens: results.length, results }, null, 2))
console.log(
  `audit-gallery: ${results.length} screens · text under 12px: ${total('small')} · ` +
    `tap targets under 44px: ${total('taps')} · contrast fails: ${total('contrast')}`,
)
if (process.argv.includes('--verbose')) {
  for (const r of fails) {
    console.log(`\n${r.id}`)
    for (const s of r.small) console.log(`  small ${s.px}px  ${s.text}`)
    for (const s of r.taps) console.log(`  tap   ${s.w}x${s.h}  ${s.el}`)
    for (const s of r.contrast) console.log(`  contrast ${s.ratio} (<${s.need})  ${s.text}`)
  }
}
process.exit(fails.length ? 1 : 0)
