# TwoAgree design system

The rules every screen is built from. Read this before building or changing any UI.
Decisions behind it: the design review walkthrough (items 1–17) and the UX laws review.

## What TwoAgree feels like

- A journey two people take together, at their own pace, often long distance. Never say "sit down together" or "side by side".
- Calm and reverent, with warmth at the right moments (Duolingo's clarity, without the game).
- Honest. Hard questions are asked plainly; scores are real numbers with real counts.
- The UI stays clean: one clear next step per screen.

## Never

- Streaks, countdowns, "don't lose your progress", fake head starts on progress bars, nagging reminders, or anything that makes a partner feel behind.
- A pre-selected or suggested answer. Every question starts empty.
- Softened or hedged wording on hard questions. Rewording for plain language keeps the meaning, the options' order and their number.
- "Him / Her" or "your partner" where a name is known. Use the person's name.
- Honey (`--ta-honey`, `--app-honey`) as text on a light ground. It's a fill colour only.
- A raw hex outside `src/brand/tokens.css` (exceptions are listed in CLAUDE.md §10.1).
- More than one honey button on a screen.
- Telling one partner what the other has or hasn't ticked in "We talked". Ask, don't report.
- Animation on a low score or on private text. Motion is for celebration and feedback only, and always respects reduce-motion.

## The kit

Build from these. Don't hand-style a one-off when a kit piece fits. The look (Dave, Nov 2026, after Revolut and Dateasy): flowing waves on the page, white and frosted cards on top, colour used sparingly.

| Piece | Spec |
|---|---|
| The page | A soft ground (`--app-ground-top`) with flowing waves across the top 640px (`<Flux>`, `components/Flux.tsx`), fading into the ground. **The waves are the only gradient: a card never carries its own.** |
| Card | Frosted glass: `--glass` with a `--glass-line` hairline, radius 22, a soft `--glass-shadow`, backdrop blur. No thick base. |
| Home card stack | One solid white card (radius 28) with the next conversations peeking out underneath; swipe or drag sideways for the next. Dots under it say where you are. |
| Reveal card | One solid white card filling the screen: the two of you across its top (your colours blending into each other, each in a circle with your photo or initial), the number large in the middle, the line and the next step under it. |
| Main button | A white pill with a 1.5px `--app-mauve` edge and `--app-mauve-deep` words, 56px on the question and reveal screens. One per screen. |
| Secondary button | A plain white pill (`.btn.out`). Text buttons stay text, still 44px+ to tap. |
| Red button | Deleting only. |
| Round button | A 44px white glass circle (`.pcircle`): close, search, share, the bell. |
| Answer row | A big rounded pill (min 60px on questions). Selected: a mauve-deep edge and a tick. Never colour alone. |
| Scale | Five large rings, a little deeper mauve toward the top end; the chosen one fills and takes a tick. |
| Filter pill / badge | Quiet glass; selected or tinted = `--app-mauve-tint`. |
| Avatar | White glass disc with the person's colour as its edge and initial (host mauve, guest honey), or their photo. Each person keeps their colour on both phones. |
| Label over value | A row with a small grey label over a strong value and a chevron (`.irow`), for "Between the two of you" and the like. |

Mauve (`--app-mauve`, `--app-mauve-deep`, `--app-mauve-tint`) marks only what you act on and progress. Honey stays for the guest's colour and a few fills; claret is for the text ink and brand moments.

In code: `.card`, `.btn` / `.btn.pill` (main), `.btn.out`, `.btn.red`, `.btn.ghost`, `.pcircle`, `.opt`, `.fpill`, `.kbadge.*`, `.irow`, `<Avatar>`, `<TabHeader>`, `<TopBar>`, `<Loading>`, `<HowScores>`. The kit is in the gallery: flow 0, "The kit".

## Type

Six styles, and nothing else (the gallery audit checks every screen):

| Style | Font |
|---|---|
| Title | Fraunces 26 / 600: screen names, the greeting |
| Question | Fraunces 20 / 600: a long question, the reveal's line, a verse |
| Heading | Hanken 17 / 600: names of conversations, parts and cards |
| Body | Hanken 15 / 400 |
| Strong | Hanken 15 / 600: buttons and tappable words |
| Small | Hanken 13 / 400: labels and meta, sentence case, never uppercase or tracked |

Only display numbers and names over 30px step outside them (the reveal's number, a conversation's name on its card, a question at full size at 26). Tokens: `--t-title`, `--t-question`, `--t-heading`, `--t-body`, `--t-small`. The root is 15px, so the phone's text-size setting still scales everything.

## Layout and spacing

- Spacing on a 4/8 scale: 4, 8, 12, 16, 20, 24, 32, 40. 20px side gutter on phones.
- **One top row on every screen, at the same height:** on a tab, the two of you on the left and the bell always far right, with the screen's own round button just left of it (`<TabHeader>`); on a full-screen flow, close in a circle on the left and the flow's name in the middle (`<TopBar>`). No mark at the top of any screen. The page's top padding includes the notch / Dynamic Island inset.
- Screen names sit in one place and style, left-aligned under the top row (`.pagetitle`).
- The dock: a frosted capsule of icons (Home, Talk, Together with the mark in the middle, Path, You), no labels on screen.
- Launch: the wordmark, centred, until the first real screen is ready. Skeletons appear only when a screen takes over 300ms.
- Talk is a two-column grid of tall glass cards, each with its icon large and the agree score as a pill.
- The most important item goes first; destructive actions go last, on their own.

## Interaction

- Tap targets at least 48×48px (44pt on iOS).
- Question screens are full screen with no card, exactly the phone's height: close, the part's name and Skip (where a question can be skipped) on top; "Question 3 of 7" over one segment per question, with "✓ Saved"; the question large and centred; only the answers scroll. "How much does this matter?" rises in above the main button once an answer is chosen. Back (a circle) and the big Next pill share the bottom row.
- Back (bottom left) steps through earlier questions and guesses with their answers still picked; any of them can be changed until the part is finished. An importance chosen on an earlier visit says so ("Your earlier answer").
- A guess says whose answer it is in one line ("✦ Guess · What will Judah say?"); your own answer is marked softly in place ("You", dashed), so the guess is the only strong colour.
- Starting a part you haven't begun, once your partner has joined: a sheet offers "Do it with Judah now" or "Answer on my own". Together sends Judah an in-app request (Start now / Not right now, open ten minutes) and a link to send when the app isn't open; Start now takes both of you straight into the part. Nothing else is synced: own pace, private answers, the same reveal.
- Rank: tap the options in order; each takes the next number and the last is numbered for you. Tap a numbered one to take it out, or Start again.
- Scale ends are short labels (at most 40 characters, no colon), the same kind of thing at both ends. Picking a point shows one plain line saying what it means, in a bubble sized to its words, pointing at the chosen orb.
- Every screen opens at the top. Going back (closing a conversation, Back in You) returns to where you were.
- Never make someone wait on the server to move on. Show the next step at once, then "Saving…", "✓ Saved", or "Try again" if it fails. Never lose an answer.
- Loading shows the outline of the screen, not a spinner. After 5 seconds add "Still loading…"; after 10, offer Try again and a way back.
- Every error says what happened and what to do next, in plain words, with Try again where it can work.
- Accept messy input and clean it: codes in any case with spaces or dashes, a pasted invite link, emails with stray spaces.
- Focus: a 2px claret outline with a 3px gap.
- Partners see each other's name and profile photo (copied into the session); never an email.

## Colour and contrast

- Text at least 4.5:1 against its ground; large text (24px+) and control edges at least 3:1.
- Measured pairs that pass: ink on white 17.5, grey `--ta-grey` on white 6.4, amber `#8F5A12` on white 5.8, ink on honey 7.0, white on claret 15.1, gold on claret 10.6.
- Gold on claret only (brand rule 1); app screens sit on the soft ground with the waves on top, cards white or glass (rule 2); the mark is the A (rule 3). See CLAUDE.md §10.1.

## Words

- Short, warm, direct. "You" and the partner's name.
- Questions in plain words anyone can follow and a translator can carry: no idioms ("take a back seat", "dropping by"), at most 100 characters. The plain-language pass of Oct 2026 rewrote the 91 that ran longer.
- Scores always carry their count: "Based on 22 questions you both answered", "7 of 10 guesses right".
- "Not a verdict: a place to start talking." on every reveal except 100%.
- Scripture is ESV, except Amos 3:3 (NKJV).

## Checking a screen

Before calling a screen done: render it in the gallery (`npm run build:gallery`), check it at 390px wide and with large text, and run `npm run audit:gallery`, which measures every gallery screen for text under 12px, tap targets under 44px, colour pairs under 4.5:1 (3:1 for large text) and text off the six styles, and writes `review/audit.json`. It must report zero. Aim for 48px targets; the audit's floor is Apple's 44.
