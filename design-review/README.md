# Design-review harness

Screenshots of **every** app screen, rendered from the live React build with no
backend. Firebase is swapped for inert stubs at the module boundary, so each
screen renders offline from a mock couple ("Sarah & Judah") with representative
answers — the scoring/reveal screens show a real spread of Agreed / Close /
Worth-a-chat verdicts and both flag types.

## Regenerate

```bash
# 1. serve the harness (isolated Vite config, port 5199)
node_modules/.bin/vite --config vite.harness.config.ts

# 2. in another shell, capture every screen → design-review/screens/*.png
node design-review/capture.mjs

# 3. build the single-page review gallery → design-review/gallery.html
node design-review/build-gallery.mjs
```

`screens/` and `gallery.html` are gitignored (large, reproducible).

## How it fits together

| File | Role |
|---|---|
| `../vite.harness.config.ts` | Dev-only Vite config; a `resolveId` plugin redirects `firebase`, `firebase/auth`, `firebase/database`, the data hooks and `lib/functions` to stubs. |
| `../harness.html` + `../src/harness/main.tsx` | Harness entry — same fonts/CSS as the app, mounts the screen switcher. |
| `../src/harness/Harness.tsx` | Renders one screen by `?screen=<key>` from mock props. `SCREENS` lists the keys. |
| `../src/harness/mocks.ts` | The mock `Session` (built from the real question bank), `User`, `Profile`, path. |
| `../src/harness/stubs/` | Inert Firebase / hook / functions stubs. |
| `capture.mjs` | Drives headless Chromium over each `?screen=` route. |
| `build-gallery.mjs` | Embeds the PNGs + real app fonts into `gallery.html`. |

## Adding a screen

Add a `case` in `src/harness/Harness.tsx`, list its key in `SCREENS` and in
`capture.mjs`, and (optionally) place it in a group in `build-gallery.mjs`.
