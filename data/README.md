# Question bank — single source of truth

The TwoAgree question bank lives here as plain JSON in the repo. There is **one**
bank and this is it. The old `.xlsx`/TSV workbook and the standalone HTML viewer
are retired — do not resurrect a second authoring surface.

## Files

| File | What it is |
| --- | --- |
| `questions.json` | Flat array, one object per question. **Edit this.** |
| `decks.json` | Deck metadata: slug, ID prefix, display name, colour, icon, and (by array order) the deck display order. |

Everything the app renders is generated from these two files into
`src/data/questions.generated.ts` by `scripts/build-questions.mjs`. The app imports
the bank through `src/lib/questions.ts`, which just re-exports the generated file.

## Question shape

```jsonc
{
  "id": "HOME-001",          // PREFIX-000; prefix must match the deck
  "deck": "in-the-home",     // slug from decks.json
  "type": "mc",              // "scale" | "mc" | "rank" | "open"
  "tier": "1",               // difficulty "1" | "2" | "3"
  "level": 1,                // 1–5
  "q": "Who does most of the cooking in your home?",
  "opts": ["Mostly him", "Mostly her", "Both equally", "..."], // mc / rank only
  // "lo": "...", "hi": "...",   // scale only (endpoint labels)
  "guessable": true,         // supports the predict-your-partner layer
  // "complement": true,      // optional: scores aligned even when answers differ
  "ref": "Romans 12:13",     // optional linked verse
  "note": "...",             // discussion note shown on reveal
  "subcat": "",              // optional authoring metadata below this line
  "status": "Draft",
  "source": "Self",
  "dateAdded": "2026-06-23"
}
```

`open` questions have no `opts`/`lo`/`hi`. `mc`/`rank` need ≥2 `opts`. `scale`
needs `lo`+`hi`.

## Commands

```bash
npm run build:questions        # validate + regenerate the typed bank
node scripts/build-questions.mjs --check   # validate + fail if the generated file is stale
```

`--check` runs automatically before `npm run build` and `npm test` (`prebuild` /
`pretest`), so an invalid or un-regenerated bank fails CI instead of shipping.

Validation fails loudly and names the offending ID for: duplicate IDs, a prefix
that doesn't match its deck, `mc`/`rank` with fewer than 2 options, `scale`
missing `lo`/`hi`, `open` carrying options, `tier` outside 1–3, `level` outside
1–5.

## Adding questions

Add the new objects to `questions.json` and run `npm run build:questions`. IDs are
assigned as the next free number per prefix, so a pasted block without IDs can't
collide with what's already in the bank — the repo is the truth, and the build
stands on it.
