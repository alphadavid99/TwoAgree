// Entry for the dev-only gallery. See vite.gallery.config.ts for why this can
// never ship: it has its own HTML entry, Firebase is aliased to fakes, and
// scripts/check-no-gallery.mjs fails the production build if any of it leaks.
import './storage-shim'
import { createRoot } from 'react-dom/client'
import '../brand/tokens.css'
import '@fontsource/hanken-grotesk/latin-400.css'
import '@fontsource/hanken-grotesk/latin-500.css'
import '@fontsource/hanken-grotesk/latin-600.css'
import '@fontsource/fraunces/latin-400.css'
import '@fontsource/fraunces/latin-500.css'
import '@fontsource/fraunces/latin-600.css'
import '../index.css'
import './gallery.css'
import { installNetworkGuard } from './guard'
import { GalleryFirebaseError } from './mock/runtime'
import Gallery from './Gallery'

if (typeof __TWOAGREE_GALLERY__ === 'undefined') {
  throw new Error('The gallery only runs from vite.gallery.config.ts.')
}

installNetworkGuard()

// A mocked Firebase call that threw inside an event handler still has to be
// visible; the constructor already recorded it, this just stops it vanishing
// into the console as "uncaught".
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason instanceof GalleryFirebaseError) console.error(e.reason)
})

createRoot(document.getElementById('root')!).render(<Gallery />)
