# Deploy & operations

## Manual deploy (works today)

From the project root, with the Firebase CLI logged in (`firebase login`):

```bash
npm run build
firebase deploy --only hosting                 # web app
firebase deploy --only database                # security rules
firebase deploy --only functions               # Cloud Functions
# or everything at once:
firebase deploy
```

Live site: https://aligned-9f843.web.app

## Automated deploy (GitHub Actions)

`.github/workflows/ci.yml` runs lint + tests + build on every push/PR — active now, no setup.

`.github/workflows/deploy.yml` auto-deploys **Hosting** on every push to `main`.
It needs **one** thing: a repo secret named `FIREBASE_SERVICE_ACCOUNT`. Until
that secret exists the job runs but no-ops (main stays green). The public web
config lives in the committed `.env.production`, so no repo Variables are needed.

**One-time setup — add the deploy key (browser only):**

1. **Get the key.** Firebase Console → your project → ⚙ **Project settings** →
   **Service accounts** tab → **Generate new private key** → confirm. A `.json`
   file downloads. Open it in any text editor and copy *all* of it.
2. **Add it to GitHub.** Repo → **Settings** → **Secrets and variables** →
   **Actions** → **Secrets** tab → **New repository secret**. Name it exactly
   `FIREBASE_SERVICE_ACCOUNT`, paste the JSON as the value, **Add secret**.

That's it — the next push/merge to `main` publishes automatically. (If a deploy
ever fails on permissions, grant that service account the **Firebase Hosting
Admin** role in Google Cloud Console → IAM.)

Functions + rules stay manual (they change rarely and deploying them from CI
needs broader IAM). Deploy them with `firebase deploy --only functions,database`.

## Still Dave's calls (Phase 4 launch polish)

These need your accounts/decisions — none are code I can finish blind:

- **Custom domain.** Firebase Console → Hosting → Add custom domain. Needs a
  domain you own + a DNS record. Point me at the domain and I'll wire it.
- **Analytics (privacy-respecting).** Recommend **Plausible** or **Umami**
  (cookieless, GDPR-friendly) over Google Analytics, given we hold
  special-category data. Both need an account + a script snippet.
- **Error monitoring.** Recommend **Sentry** (generous free tier). Needs a
  project DSN; then a small `initSentry()` behind an env var.
- **Staging project.** Optional: a second Firebase project (e.g.
  `aligned-staging`) as a `.firebaserc` alias for preview before prod.

## Deferred: Phase 5 (native)

Per CLAUDE.md, Capacitor packaging is intentionally **not** started — it waits
until web retention proves out. When ready it's a packaging step (wrap this
build, swap the `lib/device/*` adapters to native plugins), not a rewrite.
