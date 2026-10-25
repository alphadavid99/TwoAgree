# Design refresh: overnight report

Branch `claude/design-refresh`, 29 commits (this report included) on top of `claude/blissful-edison-aby3e9`. Nothing was deployed. The live `twoagreeapp` database wasn't touched. No email was sent, nobody was invited, and no pull request was opened.

**In one line:** all seven phases of `docs/DESIGN-REFRESH-PLAN.md` are built, tested and pushed. Three things are worded differently from the mockups because the mockup wording wasn't true, and they are listed below. Two one-off migrations are written, tested in the emulator only, and waiting for you.

## Test results (final run, on `57e0b04`)

| Gate | Result |
|---|---|
| `npm test` (app) | **191 / 191** passed |
| `npx tsc -b` | clean |
| `npm run build` (includes the gallery leak check) | passes |
| `npm run build:gallery` | passes, 1.02 MB, self-contained |
| `functions`: `npm test` | **55 / 55** passed |
| `functions`: `tsc --noEmit` | clean |
| Emulator: `npm run test:rules` (database + auth) | **43 / 43** passed (21 rules + 22 privacy / functions) |
| `npm run audit:gallery` | **108 screens: 0 text under 12px, 0 taps under 44px, 0 contrast fails** |

Before this work the audit was 211 / 85 / 85. No test was skipped, disabled or loosened. Where a test changed, it was because the decided behaviour changed (for example, PAR-004 no longer scores as complementary).

One slip to know about: commit `7fd4d83` broke the gallery build because the gallery's fake database had no `serverTimestamp`. I ran the gates through a pipe that hid the exit code. It was fixed in the next commit (`7223e85`), and every gate since has run with the failure visible.

## What's done, by phase

### Phase 1 · Trust first
- **Sign in opens sign-in on a new phone** (`67d0c57`). The front door now says which mode it wants; device history is only a fallback. Covered by a regression test.
- **Answers private on the server until you've both finished a part** (`c4b3355`). Answers, guesses and importance go to `private/{uid}/{code}/…`, which only the author can read. When both "done" flags are in, the `publishPart` callable copies that one part for both of you into the session in one atomic write. A shared answer is never rewritten afterwards. Export includes unpublished answers, and delete purges them.
- **Invitation, What is TwoAgree?, finished and reveal-ready screens** (`db7b3d8`). Invite links carry the inviter's first name. The About page has the ESV/NKJV notice.
- **Scoring version 2** (`a94a6ef`). PAR-004 dropped, every score shows its count, and How scores work is a sheet.
- **At-the-table reveal crash** (`5332020`): a regression test proves it.

### Phase 2 · The kit and the question bank
- **The thick-card kit** (`6cd29af`): one design language, every colour pair passes, every tap target is 48px, and `npm run audit:gallery` holds every screen to it.
- **Fixed, named parts** (`d6067f9`): the 56 approved names now live in `data/decks.json`. The build fails if a question is in no part or in two. Nobody's progress moved (the functions bank is byte-identical).
- **Names instead of Him / Her** (`fb4a0bf`): 18 questions, stored as who was picked. The re-ask migration is written (see Migrations).

### Phase 3 · Answering
- **Question screens** (`4ce2866`): calm header with Saving… / ✓ Saved / Not saved and Try again. Next is pinned. Moving on never waits for the server. Rank uses up/down. Importance is A little / Somewhat / A lot (stored as 1/3/5). The last-question line is your chosen wording.
- **Onboarding** (`86ec2e9`): names and stage on one screen, and no photo at sign-up.
- **The rest of sign-in** (`b7a866f`): errors that offer a way forward, show-password, a reset screen, a forgiving code box, and the crash screen.

### Phase 4 · Reveal and Together
- **The reveal** (`162a43c`): the claret room for every score, ranges set by Agree only, and 35 lines and 15 verses. The server picks one line and verse per part (the same on both phones, never a repeat of your last).
- **Share cards** (`8ab3cc9`): the real wordmark, a score card with a preview and an "Include our names" switch. Sensitive topics read "A TwoAgree conversation" on any shared image.
- **Your answers, side by side** (`fa56b7a`): score rings that shrink into a sticky bar with the filters, and filters with counts. The answer track replaces the heart slider. Guesses read in words. "Worth a closer look" sits inside the card with its reason, and "+ Add to talk about" is a quiet link. **No heart slider or "4 / 5" anywhere** (tested).
- **Together** (`7fd4d83`, `5f88b12`): four sections, the Talk it through guide (Listen · Understand · A next step, an optional shared note) and "Have you talked this through yet?", which never says who ticked first. Talked-about questions keep the date and the note. **The shared note is in your export and removed by delete** (emulator-tested). Delete now also removes your talk-list ticks, which it used to leave behind.

### Phase 5 · Home and Conversations
- **Home** (`728e7f2`): the soft scores card (two small rings, kept apart), the claret reveal-ready card when there is one, and the next-step card ("Part 2 of 5 · Growing in faith together") with the screen's only honey button. Before your partner joins there's an invite card. The Path card shows its scene, with a white "Continue the Path". All five tabs carry their labels.
- **The Path scene**: ten code-drawn landmarks (gate, signpost, storehouse, table under a tree, rose arbour, bridge, chapel, sunrise, peak with the gold bar, bench). They're ready to swap for your illustrations.
- **Conversations** (`684c4fb`): "Pick up where you left off", five subject groups, parts with one bar each, and Hardest / Vulnerable tags. There's a forgiving search, and no question counts or time estimates. **Choose a part** shows the named parts with both of you as small avatars (ticked / dashed), plus "Opened together · 77% agree". Known and "What surprised you" moved in here from Together. The start menu says "3 parts".

### Phase 6 · The Path
- **The map** (`867f125`): one illustrated road from the Trailhead to the Lookout. It opens where you are, with a pinned step card, and walked steps keep a small lit lamp. **Each step is a real button with a spoken name and state**, so it works by keyboard and screen reader (tested).
- **The Trailhead opens straight away**: `generatePath` lays it (gentle start) as soon as your own path questions are in. It lays the rest once both of you have answered, keeping the Trailhead exactly as laid and never repeating its questions. **composePath tests cover a Trailhead walked before the second intake.** An emulator test also runs the real function with two partners and an outsider.
- **Arrival** (a light screen with the scene, what to expect and the verse), **"You've walked The Table together"** with the next step (replacing Light the lamp), and **the Lookout** (rings, two highlights, one verse, Review our answers, Take a keepsake).
- The path questions skip the stage question when onboarding already has it (7, not 8).

### Phase 7 · You
- **The You screen** (`14ecb24`): a settings list; Edit profile on its own screen; "Email me when a reveal is ready"; the session code; the Close this session sheet; What Judah sees; Download my data with a real red error and Try again; and the Delete screen, where Cancel disappears once deletion starts.
- **Delete and export behave exactly as the screens say.** Two emulator tests check every bullet against the real Cloud Functions: profile, photo and path questions deleted; your answers, guesses and ratings removed from every session; your partner's kept; a solo session removed; the consent record kept; and export without your partner's answers.

## Not done, and why
- **Path step questions still use the Path's own player.** It is kit-styled, but it isn't item 12's pinned-Next screen with the save queue. Moving the Path onto `PlayScreen` is a bigger refactor than the plan's Phase 6 items. It is a sensible next job.
- **No prose blurb under each conversation in Choose a part.** The bank has no deck descriptions, so the subtitle reads "Everyday · 5 parts". Writing 21 blurbs is a content job for you.
- **Previews per phase**: the plan says to deploy each phase to a preview channel. I don't deploy, so that's yours.

## Where I didn't follow the mockup (honesty over the mock)
1. **Edit profile doesn't say "Judah sees this" under your name, photo or line.** Your partner never sees your photo or your line about you: the rules lock `users/{uid}` to you. The session keeps the name you had when it started, so renaming doesn't reach an existing session. The screen says exactly that, and **What Judah sees** lists what they do and never see. If you want renames to reach the session, that needs a small rules change (members writing their own `members/{role}/name`) plus an emulator test. That's your call.
2. **Avatars sit side by side, never overlapping**, as the design system says, although several mockups overlap them.
3. **Together's numbers come from revealed parts** (the same maths as the reveals and Home), not the old fixed-70 "Core" headline, which the decision said counted the wrong thing.

## Please check
- **Privacy fix, emulator results:** `src/lib/privacy.rules.test.ts` (22 tests, two partners and an outsider). Key ones:
  - Hides Sarah's finished part from Judah while he's still answering.
  - Asking the server to publish early does nothing.
  - Judah can't forge Sarah's done flag.
  - A shared answer never changes once a part opens.
  - The outsider reads nothing, before or after.
  - Publishing is idempotent and the scores come out exactly as before.
  - Export and delete cover the private space.

  To rerun: `env -u HTTPS_PROXY -u https_proxy -u GLOBAL_AGENT_HTTPS_PROXY -u npm_config_https_proxy npm run test:rules` (the proxy variables break the emulator's localhost).
- **About page wording**, and the ESV copyright notice against Crossway's terms: `review/screens/18-join-about.png`.
- **The data screens' wording** (What Judah sees, Delete): `review/screens/103-profile-sees.png`, `review/screens/107-profile-delete.png`.
- **ROLE-008** ("If one of us had to step back…", options Me / You) is perspective-dependent: Me and You from the two phones mean the same person but score as different. It could become a which-of-you question, or be reworded.
- **The last-question line** and **importance as three buttons**: built as decided. Say if you'd rather have the alternatives.

### On your phone
1. Play a part from start to reveal as both people (Home → Continue → the reveal → See your answers).
2. Together: Talk it through, tick it on one phone, then see the other phone asked "Have you talked this through yet?"
3. The Path: answer the path questions on one phone only, walk the Trailhead, then answer on the other phone and watch the rest appear.
4. You: Download my data (both formats) and the Delete screen (don't press it).
5. Share a score card to your own phone.

## Migrations waiting for you (emulator-tested, never run live)
Both are dry runs by default and safe to run twice.
- `scripts/migrate-private-answers.mjs` moves answers in unopened parts into each author's private space, and stamps opened parts as published.
- `scripts/migrate-who-reask.mjs` clears old Him / Her answers on the 18 which-of-you questions, so they're asked again by name.

Run each one against live like this: `GOOGLE_APPLICATION_CREDENTIALS=… node scripts/<name>.mjs --live --project twoagreeapp` (dry run first, then `--apply`). Build the plans first with `npm --prefix functions run build`.

**Deploy order:** Functions, then database rules, then Hosting straight after, then the migrations. New rules with an old app would block answers; a new app with old Functions has no `publishPart`. `generatePath` changed too (the early Trailhead), so Functions and Hosting must go out together. The reveal-email trigger still needs the Eventarc IAM roles in `docs/DEPLOY.md`. Reveals don't depend on it, because the callable publishes.

## Screens to look at (`review/`)
Every screen is in `review/README.md` (contact sheets by flow) and in the interactive `review/twoagree-screens.html`. The new and changed ones:

| Area | Screens |
|---|---|
| Kit, landmarks | `review/screens/01-kit-sheet.png`, `review/screens/02-kit-scenes.png` |
| Onboarding, sign-in | `06-onb-names`, `16-onb-menu`, `17-join-arrive`, `18-join-about`, `29-auth-signin`, `30-auth-signin-error`, `41-start-join-tidy` |
| Home | `49-home-new`, `52-home-joined`, `53-home-herald`, `54-home-path` |
| Conversations | `55-talk-decks`, `57-talk-picker` |
| Answering | `58-play-scale`, `59-play-mc`, `65-play-last`, `67-play-importance` |
| Reveal and review | `70-reveal-t0`, `74-reveal-t4`, `75-reveal-share`, `79-reveal-answers`, `80-reveal-flags` |
| Together | `82-together-results`, `83-together-guide`, `86-together-talk`, `87-together-ticked`, `88-together-talked` |
| The Path | `93-path-start`, `94-path-start-walked`, `95-path-map`, `96-path-step-arrival`, `98-path-step-walked`, `99-path-lookout` |
| You | `101-profile-main`, `102-profile-edit`, `103-profile-sees`, `104-profile-close`, `106-profile-export-error`, `107-profile-delete` |

All of these are under `review/screens/`, and long screens have a full-length version under `review/full/`. One gallery-only quirk: a frame that scrolls itself (the Path map, Talked about together) shows the tab bar in the wrong place. The app doesn't do this.

Fonts in the renders are the shipped Fraunces and Hanken Grotesk.
