# Design refresh: build plan

Every decision from the design review walkthrough (items 1–17) and the UX laws review, turned into an order of work. Each phase ends in something that can ship to a preview channel and be checked in the screen gallery. Phase 1 is the gate: nothing new goes to testers until it’s done.

Sizes are for building with Claude Code, not by hand. S: under two hours. M: about half a day. L: a day or more, with testing. The real pace is set by your reviews and phone checks, marked “Needs you”.

## Phase 1 · Trust first

Fixes that protect people's answers and let returning users in. Ship before inviting any new testers.

### Sign in opens Create account on a new phone · item 9 · S

“Sign in” always opens sign-in; “Create one” always opens create. Ship on its own, first.

**Done when:** A fresh browser profile: tapping Sign in shows the sign-in form.

### Answers private on the server until you’ve both finished · item 5 · L

Answers, guesses and importance go to a private space only their author can read. When the second “done” lands, a Cloud Function (built on the existing reveal-email trigger) publishes that part into the shared session. Started and done flags stay shared, so partner status keeps working. The starter questions, Path at-the-table answers and written answers use the same route. One-off migration of existing test sessions: anything in an unopened part moves back to the private spaces.

**Done when:** Emulator tests with two accounts and an outsider: neither partner can read the other's answers in an unopened part by any route; both can read a published part; the outsider reads nothing. Reveal, scoring and Together unchanged after publishing.

**Needs you:** A look at the emulator test results before it ships.

### Privacy wording, the invitation and “What is TwoAgree?” · item 1 · S

The invitation landing (“Begin your walk together…”, Join Sarah, What is TwoAgree?), the new about page, the finished and reveal-ready screens. The line “Your answers stay private until you’ve both finished a part” ships only with the server fix above.

**Done when:** Every screen in item 1 matches the walkthrough; the about page is reachable from the invitation and back.

**Needs you:** A read of the about page.

### Scoring version 2 · item 4 · S

Keep the weighted Agree score. Drop the PAR-004 complement exception. “Based on N questions you both answered” wherever a score appears, and a How scores work sheet.

**Done when:** Scoring tests updated: PAR-004 different answers now count as different; labels show the real count.

### The at-table reveal crash · item — · S

readyReveals crashes SessionApp when the synthetic at-table deck has finished answers (found while building the gallery). Fix before the Path changes in phase 6.

**Done when:** A session with both partners' at-table answers loads Home without an error.

## Phase 2 · The kit and the question bank

Build the shared pieces once, so every later screen is assembled, not hand-styled.

### The thick-card kit · item 16 · M

Card, claret card, buttons (honey main, claret, white, red, text), answer row, filter pill, badge, avatar (Judah's initial in dark ink), score rings that shrink into a bar on scroll, the loading rule (5s and 10s). Type scale with questions at 22px, 14px floor for helper text, 12px for labels. Every tap target at least 48px. All colours from tokens.css.

**Done when:** Every colour pair in use passes 4.5:1 for text; the gallery audit finds no tap target under 44px and no text under 12px.

**Needs you:** A look at the kit in the gallery.

### The design rules file · UX laws · S

docs/design-system.md: the kit, the spacing and type rules, and TwoAgree's own “never” list (no streaks or guilt, no pre-selected answers, honey never as text on white, one honey action per screen). CLAUDE.md gets a short pointer to it, so every future screen is built to the same rules.

**Done when:** A new screen built from the rules alone matches the kit.

**Needs you:** A read of the rules before they go in.

### Fixed, named parts in the question bank · item 11 · S

Each part becomes a name plus its list of question IDs in the bank, using today's cut and the 56 approved names. The bank check fails the build if a question is in no part or in two.

**Done when:** npm run build:questions passes; every part has a name; nobody's progress moves.

### Names instead of Him / Her · item 12 · S

The 18 “which of us” questions store the person (host or guest), shown as names in the same order for both of you. The 5 husband/wife role questions stay. Existing test answers to the 18 are asked again once.

**Done when:** Both partners see “Mostly Sarah / Mostly Judah” in the same order; matching answers score as agreed.

## Phase 3 · Answering

The loop people spend most time in.

### Question screens · item 12 · M

Calm header (part name, “3 of 6”, “✓ Saved”), Next pinned in the same place at the bottom of every question, moving on at once while the answer saves (“Saving…” then “✓ Saved”, Try again if it fails), the guess on its own screen, rank with up and down and “This is my order”, importance as A little · Somewhat · A lot (stored 1, 3, 5), bigger scale labels, open questions unchanged. Last question: “Once you've both finished this part, you're ready to talk it through together.”

**Done when:** Every question type plays end to end in the gallery and on a phone; the rank order can be fixed without starting over; Next never moves; a slow connection never blocks the next question.

**Needs you:** Play a part on your phone.

### Onboarding · item 8 · M

Names and stage on one screen, five starter questions with each guess on its own screen, no photo at sign-up, keep “Where would you like to start?”.

**Done when:** 16 screens for the person who starts, 16 for the person invited.

**Needs you:** Go through it as both people.

### The rest of sign-in · item 9 · S

One heading per screen, show-password, Forgot password under the field, error panels with the next step, a “Check your email” screen, field-level sign-up errors that keep the email. The join code accepts lowercase, spaces, dashes or a pasted invite link. The crash screen says “We couldn’t open this screen” with Try again.

**Done when:** Each error state in the gallery shows a way forward.

## Phase 4 · Reveal and Together

The payoff: what couples see once they've both finished.

### The reveal · item 2 · M

Claret room for every score, the crescendo kept (petals, rays, the 100% medallion with fireworks). Range set by Agree only. 35 lines and 15 verses, picked at random, the same for both of you, never repeated back to back. ESV, with Amos 3:3 in NKJV. “Not a verdict” on every reveal except 100%. “Not yet” answers shown, unscored.

**Done when:** Both partners see the same line and verse; each range shows its own copy.

**Needs you:** Confirm the ESV terms.

### Share cards · item 2 · M

The progress card with the wordmark and encouragement line; the new score card from the reveal, with a preview, an “Include our names” switch, and “A TwoAgree conversation” in place of Intimacy, Past & healing and Deal-breakers.

**Done when:** Sensitive topic names never appear on a shared image.

**Needs you:** Share a card to your own phone.

### Your answers, side by side · item 13 · M

Rings that shrink into a bar with the filters (All first), the answer track instead of the heart slider, “You both chose …”, badges in brand colours, “Worth a closer look” inside the card with its reason, guesses in words (“You guessed right”), “+ Add to talk about”.

**Done when:** No heart slider or “4 / 5” anywhere; filters show the right counts.

### Together · item 3, 13 · M

Four sections: who, where you stand (the claret card with two rings), what to talk about next with Talk it through, your conversations as tiles. The conversation guide sheet (Listen · Understand · A next step, an optional shared note). “Have you talked this through yet?” without saying who ticked first; still needs both.

**Done when:** The shared note is included in export and removed by delete.

**Needs you:** Try the guide with someone.

## Phase 5 · Home and Conversations

Where every visit starts.

### Home · item 10 · M

The soft scores card with two small separate rings, the next-step card (“Part 2 of 5 · Growing in faith together”), the Path card with its scene (its button white whenever Continue is on screen, so there is one honey action), five labelled tabs. Loading shows the shape of the screen, not a spinner.

**Done when:** Each Home state (new, solo, joined, reveal ready, Path) has one obvious next step.

### Conversations · item 11 · M

Subject groups, “Pick up where you left off”, rows with parts and a bar per part, Hardest tags, named parts with both of you as small avatars, a cleaner Choose a part (no top icon, smaller numbers). No time estimates.

**Done when:** The list is grouped as approved; every part shows its name.

## Phase 6 · The Path

The guided route, rebuilt in the new style.

### The map and the step screens · item 14 · L

The illustrated map that opens where you are, with a pinned step card; the light arrival screen with the scene; “You've walked The Table together” instead of Light the lamp; the Lookout with rings, two highlights and one verse. Code-drawn landmarks now, your illustrations later.

**Done when:** The map works by keyboard and screen reader as well as touch.

**Needs you:** Your illustrations, whenever they’re ready.

### Open the Trailhead straight away · item 14 · M

The Trailhead opens before both of you have answered the path questions (gentle depth); the rest of the route is composed once both have. Skip the stage question when onboarding has it.

**Done when:** composePath tests cover a Trailhead walked before the second intake.

## Phase 7 · You

Settings and your data.

### The You screen · item 15 · M

The settings list, Edit profile on its own screen, “Email me when a reveal is ready”, session code, the close-session sheet, What Judah sees, Download my data with a real error and Try again, the Delete your account and answers screen.

**Done when:** Delete and export behave exactly as the screens say (checked against the Cloud Functions).

## After every phase

- Re-run the screen gallery and the contrast and tap-target audit after each phase, and refresh review/ so the screens can be checked.
- Deploy each phase to a Firebase preview channel first; production after a check on a real phone.

## For Dave to check

- ESV permission terms (Crossway) and the copyright notice on the About page.
- The last-question line: the chosen wording, or one of the two alternatives.
- Importance as three buttons and the bigger scale labels were shown but not discussed. Say if you'd rather keep the 1–5 dots.

## Parked for later

- Illustrated Path landmarks (you're supplying them).
- Scripture and teaching for flagged topics.
- Friends mode.
- A general (non-faith) version.
- Donations, after checking Apple's in-app purchase rules.
