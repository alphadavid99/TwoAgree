import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './brand/tokens.css' // brand tokens first — single source of colour
// Self-hosted fonts (no Google CDN — the user's IP never leaves for a font).
// Inter carries the wordmark ONLY, so it's self-hosted from /public with a
// stable path and preloaded in index.html (see its @font-face in index.css) —
// that kills the fallback-font flash on the brand wordmark. Hanken Grotesk is
// the UI face, Fraunces the display.
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/fraunces/400.css'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/600.css'
import './index.css'
import App from './App.tsx'
import { initNative } from './lib/device/native'
import { initObservability } from './lib/observability'
import { ErrorBoundary } from './components/ErrorBoundary'

// Wire up native-shell behaviour (status bar, deep links). No-op on web.
initNative()

// Error reporting + analytics. Both no-op unless their env var is set, and
// both are scrubbed of anything that could carry an answer — see the module.
initObservability()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
