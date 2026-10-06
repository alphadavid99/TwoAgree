# Screen gallery (dev only)

Every routed screen and major state, each in a 390×844 phone frame, grouped by
user journey. For design review. **Never shipped.**

```
npm run dev:gallery     # live, hot-reloading, at http://localhost:5173/gallery.html
npm run build:gallery   # dist-gallery/twoagree-screens.html: one self-contained file
```

URL options: `?all=1` mounts every frame at once (default: as they scroll into
view), `?flow=reveal` shows one flow, `?frame=home-joined` shows one frame.
EN/FR and "freeze CSS motion" are in the header; ↻ on a frame resets it.

## Why it can't leak into production

- Own entry (`gallery.html`) and own config (`vite.gallery.config.ts`); neither
  `vite.config.ts` nor `firebase.json` references them. The main dev server 404s it.
- `npm run build` runs `scripts/check-no-gallery.mjs` (as `postbuild`): it fails
  if `dist/` holds a gallery file or the marker string / `GalleryFirebaseError`
  from `src/gallery/**`, or if hosting/config point at the gallery.
- Output is `dist-gallery/` (gitignored), not `dist/`.

## No network, no real data

- `firebase/{app,auth,database,functions}` are aliased to in-memory fakes in
  `mock/`. The real SDK isn't in the bundle. `envDir:false` keeps `.env.production`
  (project id, API key) out of it.
- Each frame has its own copy of the fixture database and its own signed-in
  user, so tapping through one phone never changes another.
- `guard.ts` makes `fetch`, XHR, WebSocket, EventSource and `sendBeacon` throw. A
  fake callable with no handler throws. Every such throw is counted in a red
  banner in the header and logged to the console.
- `fixtures.ts`: "Sarah/Judah Placeholder", `@example.invalid` addresses, code
  `TEST`, free text labelled "Sample answer (fixture)".

## Adding a frame

Add to `FRAMES` in `frames.tsx`. Prefer mounting the real top-level component
(`App`, `SessionApp`, `Onboarding`) and scripting taps with `steps` over
redrawing a state. A state that can't be reached honestly goes in with
`unrenderable: 'why'` and is listed on the page.
