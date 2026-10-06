// DEV-ONLY screen gallery build. Not part of `npm run build`, never deployed.
//
// What makes this safe:
//  - It has its own entry (gallery.html) and its own config; vite.config.ts never
//    references either, and scripts/check-no-gallery.mjs fails the prod build if
//    any gallery code or the marker string turns up in dist/.
//  - Every `firebase/*` import is aliased to an in-memory fake (src/gallery/mock),
//    so the real SDK is not in this bundle and cannot open a connection.
//  - envDir:false → no .env.production, so no Firebase project id, API key or
//    Sentry DSN is baked into the output.
//  - Output goes to dist-gallery/ (firebase.json hosts dist/).
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { existsSync, readFileSync, renameSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { extname } from 'node:path'

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))
const mock = (name: string) => here(`./src/gallery/mock/${name}.ts`)

// Screens size themselves against the viewport (100dvh, 46vh, min(100vw…)).
// Inside a 390×844 frame the viewport is the whole browser window, so those
// would be wrong. Rewrite viewport units to read a per-frame custom property
// (set on .gframe to 1% of the frame); outside a frame it falls back to the
// real unit. Applied to this build only — production CSS is untouched.
function frameViewportUnits(): Plugin {
  return {
    name: 'gallery:frame-viewport-units',
    enforce: 'pre',
    transform(code, id) {
      if (!id.split('?')[0].endsWith('.css')) return
      return code
        .replace(
          /(-?\d*\.?\d+)(svh|dvh|lvh|vh)\b/g,
          (_m, n: string, u: string) => `calc(var(--gvh, 1${u}) * ${n})`,
        )
        .replace(
          /(-?\d*\.?\d+)vw\b/g,
          (_m, n: string) => `calc(var(--gvw, 1vw) * ${n})`,
        )
    },
  }
}

// Files in public/ are referenced by absolute URL ("/fonts/…", "/avatar…png"),
// which Vite leaves alone — they'd 404 from a lone .html file. Inline them.
const MIME: Record<string, string> = {
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}
function inlinePublicAssets(): Plugin {
  return {
    name: 'gallery:inline-public-assets',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0]
      if (!/\.(css|tsx?)$/.test(file) || file.includes('node_modules')) return
      let changed = false
      const out = code.replace(
        /(["'(])\/([\w\-./]+\.(?:woff2|png|svg|jpe?g|webp))(?=["')])/g,
        (m, q: string, rel: string) => {
          const abs = here(`./public/${rel}`)
          if (!existsSync(abs)) return m
          changed = true
          const mime = MIME[extname(rel)]
          return `${q}data:${mime};base64,${readFileSync(abs).toString('base64')}`
        },
      )
      return changed ? out : undefined
    },
  }
}

// vite-plugin-singlefile writes gallery.html; the deliverable has its own name.
function renameOutput(): Plugin {
  let outDir = ''
  return {
    name: 'gallery:rename-output',
    apply: 'build',
    configResolved(c) {
      outDir = c.build.outDir
    },
    closeBundle() {
      renameSync(`${outDir}/gallery.html`, `${outDir}/twoagree-screens.html`)
    },
  }
}

export default defineConfig({
  root: here('.'),
  envDir: false,
  publicDir: false,
  plugins: [
    react(),
    frameViewportUnits(),
    inlinePublicAssets(),
    viteSingleFile(),
    renameOutput(),
  ],
  resolve: {
    alias: [
      { find: /^firebase\/app$/, replacement: mock('app') },
      { find: /^firebase\/auth$/, replacement: mock('auth') },
      { find: /^firebase\/database$/, replacement: mock('database') },
      { find: /^firebase\/functions$/, replacement: mock('functions') },
      // The native sign-in plugin: web never reaches it, but if a screen ever
      // did, it must not silently do something.
      { find: /^@capacitor-firebase\/authentication$/, replacement: mock('native-auth') },
    ],
  },
  define: {
    __TWOAGREE_GALLERY__: 'true',
    __BUILD_STAMP__: JSON.stringify('gallery build'),
    // The Path is flag-gated in the app; the gallery shows it.
    'import.meta.env.VITE_PATH_ENABLED': '"true"',
  },
  build: {
    outDir: 'dist-gallery',
    emptyOutDir: true,
    rollupOptions: { input: here('gallery.html') },
  },
})
