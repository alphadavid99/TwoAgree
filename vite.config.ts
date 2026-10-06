// defineConfig comes from vitest/config (not vite) so the `test` block below
// type-checks — tsc -b compiles this file as part of the build.
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'

// A human-readable stamp baked at build time so any given bundle — web or the
// TestFlight build wrapping it — is identifiable by sight (brief §6). The native
// build number is appended at runtime from @capacitor/app (see BuildStamp.tsx).
const BUILD_STAMP =
  new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC'

// Dev-only tooling lives behind its own entry and config. Make sure the main dev
// server can never serve it (against the real Firebase SDK) by mistake, and
// pin the production entry so no extra HTML file can become a build input.
function devToolsStayOut(): Plugin {
  return {
    name: 'twoagree:dev-tools-stay-out',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (/^\/(gallery\.html|src\/gallery\/)/.test(req.url ?? '')) {
          res.statusCode = 404
          res.end('Not served here. Run `npm run dev:gallery`.')
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devToolsStayOut()],
  build: { rollupOptions: { input: 'index.html' } },
  define: {
    __BUILD_STAMP__: JSON.stringify(BUILD_STAMP),
  },
  test: {
    // rules.test.ts needs the RTDB emulator, so it is not part of the default
    // `npm test` (which must stay runnable anywhere, including CI with no
    // emulator). Run it with `npm run test:rules`, which starts one for you.
    // functions/ is a separate package with its own runner (npm --prefix
    // functions test) — keep the app suite from reaching into it.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/rules.test.ts',
      'functions/**',
    ],
  },
})
