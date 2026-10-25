// Verifies dist-gallery/twoagree-screens.html is a genuinely standalone file:
// one file, no external requests, fonts and images inlined, no real Firebase SDK.
import { readdirSync, readFileSync, statSync } from 'node:fs'

const OUT = 'dist-gallery'
const FILE = `${OUT}/twoagree-screens.html`
const problems = []

const files = readdirSync(OUT)
if (files.length !== 1 || files[0] !== 'twoagree-screens.html')
  problems.push(`dist-gallery should hold exactly twoagree-screens.html, found: ${files.join(', ')}`)

const html = readFileSync(FILE, 'utf8')
const bytes = statSync(FILE).size

const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n')
const external = [
  [html, /<script[^>]+\bsrc=/i, 'external <script src>'],
  [html, /<link[^>]+rel=["']?(?:stylesheet|modulepreload|preload)/i, 'external <link>'],
  [html, /<img[^>]+\bsrc=["'](?!data:)/i, '<img> that is not a data URI'],
  [css, /\burl\(\s*["']?(?!data:|#)[^)'"\s]/i, 'CSS url() that is not a data URI'],
  [css, /@import/i, 'CSS @import'],
]
for (const [text, re, what] of external) if (re.test(text)) problems.push(`not self-contained: ${what}`)

// Strings that only the real Firebase SDK / Google endpoints carry.
for (const s of ['firebaseio.com', 'googleapis.com', 'identitytoolkit', 'securetoken'])
  if (html.includes(s)) problems.push(`real Firebase/Google endpoint string present: ${s}`)
// Config that would have come from .env.production.
for (const s of ['twoagreeapp', 'AIza'])
  if (html.includes(s)) problems.push(`real project identifier present: ${s}`)
if (!html.includes('twoagree-gallery-build-marker-7f3a')) problems.push('marker missing: wrong build?')

const fonts = (html.match(/data:font\/woff2;base64/g) ?? []).length
if (fonts < 7) problems.push(`expected >=7 inlined woff2 fonts, found ${fonts}`)

if (problems.length) {
  console.error('\ncheck-gallery FAILED:')
  for (const p of problems) console.error('  ✗ ' + p)
  process.exit(1)
}
console.log(`check-gallery: ${FILE} OK (${(bytes / 1048576).toFixed(2)} MB, ${fonts} fonts inlined, self-contained).`)
