# Brand Report — TwoAgree mark & icons (spec v5.1)

Written for Dave, in plain English, after applying `TWOAGREE-MARK.md` top to bottom.

---

## 1. What changed

**Added**

- `public/mark.svg` — the mark on its own, one colour, straight lines only.
- `public/mark-gold.svg` — cream strokes with the gold bar, for dark claret grounds only.
- `public/icon-master.svg` — the claret app tile every image below is generated from.
- `public/favicon.svg` — the tile with rounded corners, used by browser tabs.
- `public/apple-touch-icon.png` (180, square — iPhones round it themselves).
- `public/icon-192.png`, `public/icon-512.png` (rounded corners).
- `public/icon-maskable-512.png` (square, colour to every edge, for Android's shaped icons).
- `public/icon-monochrome-512.png` (white mark on a see-through ground — Android themed icons recolour it).
- `public/site.webmanifest` — tells phones the app's name, colours and icons when saved to a home screen.
- `public/fonts/Questrial-Regular.ttf` — the wordmark's typeface, served from our own site.
- `scripts/measure-questrial.mjs` — the measuring script from the spec, kept so the numbers can be re-derived.

**Replaced**

- The old caret logo and "Aligned" text in the app header is now the live-type **TwoAgree** wordmark, with the mark sitting in as the letter A. It is real text — you can select it, and it survives a font change.
- The old `favicon.svg` (berry caret) is gone; the new tile is in its place.
- The browser tab title and theme colour now read TwoAgree / claret.
- The small standalone caret used inside the app (top bars, waiting screen) is now the standalone mark.

**Removed**

- The logo's entrance animation and the "breathing" logo on the waiting screen — the spec forbids animating the mark. The soft ripple rings on the waiting screen remain; they were never part of the mark.
- The old wordmark styles, including a weight-500 setting in the old logo text (the kind of faked-thickness bug the spec calls out). The new wordmark is locked to weight 400 and the browser is told never to synthesise a bold or italic for it.

**Survey note.** The spec's list of old TwoAgree artwork (the "899.862"/"1137.09" paths) does not exist anywhere in this repository — this codebase carried the Aligned caret instead, so this is the first application of the TwoAgree mark here rather than a replacement of version 4 artwork. The old Aligned assets found (caret favicon, caret logo component, "Aligned" wordmark text and its weight-500 style) were all replaced or deleted as listed above.

## 2. The measurement

As printed by the measuring script against Questrial Regular:

- **S/cap: 11.31%** (stroke-to-cap-height ratio — inside the plausible 8–20% window)
- **H/x: 9.4488** (text-cut height in stroke units)
- **H/W: 1.0955** (the A is a touch taller than it is wide)

## 3. Verification

| Check | Result |
|---|---|
| No file still contains the old path numbers (899.862 / 1137.09 / 936.886 / 968.149) | **Pass** — zero matches repo-wide |
| Mark paths use straight lines only (no curve commands) | **Pass** — all four SVG assets checked |
| `mark.svg` canvas is exactly 1000×1000 with the art touching all four edges | **Pass** |
| The gold colour appears only on the bar | **Pass** — one rule in the stylesheet, nowhere else |
| No boldness above 400 anywhere in the wordmark's chain | **Pass** — old weight-500 style deleted |
| Synthetic bold/italic disabled; Questrial preloaded with graceful swap | **Pass** |
| Apple icon square; maskable icon bleeds claret to every edge | **Pass** — checked the pixels (fully opaque to the corners) |
| No 16×16 PNG; monochrome icon exists with a transparent ground | **Pass** — checked the pixels |
| Clearspace of at least 3 stroke-widths around the header mark | **Pass** — the header padding gives roughly 4 stroke-widths at its tightest |
| Lighthouse PWA icon check | **Not run** — Lighthouse isn't available in this build environment. In its place: the manifest parses as valid JSON, all four icons exist at their declared sizes, and the maskable icon is full-bleed. Worth one Lighthouse pass from your machine to close this formally. |
| Wordmark screenshots at 16, 32 and 64 px — feet on the baseline, apex level with or a hair above the T's capline | **Pass** — screenshots taken at all three sizes with the baseline drawn in; feet sit on it at every size |

## 4. Things to know (outside the spec's scope, not changed)

- A handful of in-app sentences still say "Aligned" (the sign-up consent line, the invite messages, the privacy policy page). The spec covers the mark and icons only, so renaming running copy was not done here — say the word and it's a ten-minute pass.
- The app's own colour system (berry, honey, blush) is untouched; the spec's claret/gold/paper tokens exist alongside it and are used by the mark only. The claret mark on the blush ground reads well, but the berry buttons and the claret mark are two different purples on one screen — worth a look on the live site.
- The site still lives at aligned-9f843.web.app — the Firebase project name is not a brand asset, but the URL shows to testers.
- The three "decisions already taken" in the spec (no reversed cut, no 16px favicon, dark tile on dark wallpapers) were left exactly as decided.
