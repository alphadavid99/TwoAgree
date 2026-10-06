// Fails the PRODUCTION build if any part of the dev-only screen gallery has
// been bundled or would be deployed. Runs as `postbuild` (so `npm run build`,
// CI and the deploy workflow all hit it) and can be run alone after a build.
//
// Four independent checks, because any one can be defeated by a refactor:
//   1. dist/ has no gallery entry or output.
//   2. No file in dist/ contains the gallery's marker string or its fake-Firebase
//      error class (they live only in src/gallery/**).
//   3. firebase.json hosts dist/ (never dist-gallery/) and mentions no gallery.
//   4. The production Vite config does not reference the gallery entry.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const MARKERS = ['twoagree-gallery-build-marker-7f3a', 'GalleryFirebaseError', '__TWOAGREE_GALLERY__']
const problems = []

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

if (!existsSync('dist')) {
  console.error('check-no-gallery: dist/ not found. Run `npm run build` first.')
  process.exit(1)
}

for (const f of walk('dist')) {
  if (/gallery|twoagree-screens/i.test(f)) problems.push(`dist contains a gallery file: ${f}`)
  if (/\.(html|js|mjs|css|map|json|svg|txt)$/i.test(f)) {
    const text = readFileSync(f, 'utf8')
    for (const m of MARKERS) if (text.includes(m)) problems.push(`${f} contains gallery marker "${m}"`)
  }
}

const hosting = readFileSync('firebase.json', 'utf8')
if (/gallery/i.test(hosting)) problems.push('firebase.json mentions the gallery')
if (!/"public"\s*:\s*"dist"/.test(hosting)) problems.push('firebase.json hosting.public is not "dist"')

// (vite.config.ts legitimately mentions the gallery to 404 it on the dev server;
// what it must never do is import it or make it a build input.)
if (/(\bimport\b|\bfrom\b|\binput\b|\brequire\()[^\n]*gallery/i.test(readFileSync('vite.config.ts', 'utf8').replace(/\/\/.*$/gm, '')))
  problems.push('vite.config.ts imports the gallery or makes it a build input')

if (problems.length) {
  console.error('\nGALLERY LEAKED INTO THE PRODUCTION BUILD:')
  for (const p of problems) console.error('  ✗ ' + p)
  console.error('\nThe screen gallery is dev-only. Remove the import/reference and rebuild.\n')
  process.exit(1)
}
console.log('check-no-gallery: dist/ is clean (no gallery code, entry or hosting reference).')
