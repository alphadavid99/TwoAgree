# TwoAgree

> Formerly **Aligned**, renamed after **Amos 3:3** — *"Can two walk together,
> unless they are agreed?"* Live at **[twoagree.app](https://twoagree.app)** on
> the Firebase project `twoagreeapp`. The old project `aligned-9f843` is dead.
> Some internal identifiers (localStorage keys, the `aligned` word in scoring
> vocabulary) still read `aligned` by design — see CLAUDE.md.

A faith-based (non-denominational, Christian) couples compatibility app.
Two partners answer the same questions independently; their answers are scored
for alignment. **Surface, don't settle** — results start conversations, they
don't declare a winner.

This repo is the React + TypeScript + Vite rebuild. Web first (to recruit
testers), then iOS + Android via Capacitor wrapping the same codebase.

## Stack

- **React + TypeScript + Vite** — the web app (this repo root).
- **Firebase** (`twoagreeapp`, europe-west1, Blaze):
  - Realtime Database — session/answer data.
  - Auth — email/password + Google.
  - Cloud Functions (`functions/`) — invites, GDPR export/delete (Phase 3).
  - Hosting — deploy target.
- **Emulator Suite** — all local dev and rules testing.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the VITE_FIREBASE_* values
npm run dev                  # Vite dev server
```

### Firebase emulators

The Realtime Database and Functions emulators require a Java runtime.

```bash
cd functions && npm install && npm run build && cd ..
firebase emulators:start
```

Emulator UI: http://localhost:4000

### Deploy (web)

```bash
npm run build
firebase deploy --only hosting
```

## Layout

```
src/            React app (screens/, components/, hooks/, lib/ grow here)
  firebase.ts   modular SDK init — exported auth, db
functions/      Cloud Functions (TypeScript)
database.rules.json   RTDB security rules (emulator-tested before deploy)
legacy/         the original single-file app + canonical question bank
                (source of truth to port from — not shipped)
```

See [CLAUDE.md](CLAUDE.md) for the full project brief and working agreement.
