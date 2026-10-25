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

Build from these. Don't hand-style a one-off when a kit piece fits.

| Piece | Spec |
|---|---|
| Card | White, 2px edge `#F0E3DC`, 5px base `#E8D3C7`, radius 20, padding 16. |
| Claret card | `--ta-claret` with a 5px `#23101B` base. At most one per screen, for the important moment (scores, a ready reveal). |
| Honey button | The one main action on a screen. `--app-honey` fill, ink `#3A2410`, 4px base `#C38A2A`. |
| Claret button | The question flow (Next, Finish part). White text, 4px `#23101B` base. |
| White button | Secondary. 2px `--ta-line` edge, 4px base. Claret text. |
| Red button | Deleting only. `#A32D45`, white text. |
| Text button | Grey, no fill, still 48px tall to tap. |
| Answer row | At least 52px, never a fixed height. Selected: claret edge, filled radio, light blush `#FBF5F7` that fills in from the left, the radio springing and ringing out once. Never colour alone. |
| Filter pill | 40px. Selected: claret fill, white text. |
| Importance control | A soft segmented control on a light track (A little · Somewhat · A lot). Selected: a white segment with a claret edge and a small spring, never a filled button. Optional; tapping the choice clears it. |
| Badge | A label, not a button. Agreed `#FBEBDC`/`#8F5A12` · Close `#F7EEF1`/`#5C2E45` · Worth a chat claret/`#F3D58E`. |
| Avatar | Host: white on claret. Guest: ink `#3A2410` on `#D9963A`. Each person keeps their colour on both phones. Side by side, never overlapping. |
| Score rings | Two separate rings, Agree in honey and Known in claret (rose on claret grounds), each with its count underneath. They shrink into a slim bar as you scroll on Review and Together. |

All buttons are 52px tall with radius 16. Pressing drops the base from 4px to 1px over 120ms.
The colours above are tokens in `tokens.css` (`--kit-card-edge`, `--kit-card-base`, `--kit-claret-base`, `--kit-honey-base`, `--kit-red`, `--kit-sel-bg`, `--kit-close-bg`, `--kit-chat-ink`); use the tokens, not the hex.

In code: `.card`, `.kcard-claret`, `.btn` (claret), `.btn.pill` (honey), `.btn.out` (white), `.btn.red`, `.btn.ghost` (text), `.opt` (answer row), `.fpill` (filter pill, `aria-pressed`), `.kbadge.agreed|close|chat`, `<Avatar tone={toneFor(role)}>`, `<Loading>` (the loading rule), `<HowScores>` (sheet). Type: `.hero`, `.h1`, `.qtext`, `.ktitle`, `.helper`, `.eyebrow`. All of them are on one screen in the gallery: flow 0, "The kit".

## Type

| Use | Font |
|---|---|
| Hero | Fraunces 32/38 |
| Screen heading | Fraunces 28/34 |
| Question | Fraunces 19/26; 18/25 over 90 characters |
| Card title | Fraunces 18/24 |
| Body | Hanken Grotesk 16/24 |
| Answers | Hanken Grotesk 15/22 |
| Helper | Hanken 14/20. The floor for anything you need to read to act. |
| Label | Hanken 12, uppercase, tracked. Labels only, never instructions. |

Sizes in rem, so the phone's text-size setting scales them. At large sizes, rows wrap and stack; nothing truncates.

## Layout and spacing

- Spacing on a 4/8 scale: 4, 8, 12, 16, 20, 24, 32, 40.
- 20px side gutter on phones. 24px between sections.
- A label sits 6px from its own field and 24px from the group above.
- Group related things in one card rather than with white space alone.
- Phone first: the bottom tab bar (Home, Talk, Path, Together, You, always labelled), back at top left, close at top right.
- The most important item goes first in a list; destructive actions go last, on their own, with space around them.

## Interaction

- Tap targets at least 48×48px (44pt on iOS).
- Question screens are exactly the phone's height. The top (back, close, the stones, "3 of 8", the question) and the bottom (importance, the main button) stay put; only the answers scroll between them, fading at whichever edge has more beyond it, with a "More below" chip on the card's bottom edge when there's more below. "How much does this matter?" rises in above the main button once an answer is chosen, so it never needs scrolling. Back (a square white button), then Skip, Not yet or Skip for now, then the main button, all in one row at the bottom.
- Back (bottom left) steps through earlier questions and guesses with their answers still picked; any of them can be changed until the part is finished. An importance chosen on an earlier visit says so ("Your earlier answer").
- A guess says whose answer it is in one line ("✦ Guess · What will Judah say?"); your own answer is marked softly in place ("You", dashed), so the guess is the only strong colour.
- Rank: tap the options in order; each takes the next number and the last is numbered for you. Tap a numbered one to take it out, or Start again.
- Scale ends are short labels (at most 40 characters, no colon), the same kind of thing at both ends. Picking a point shows one plain line saying what it means, in a bubble sized to its words, pointing at the chosen orb.
- Every screen opens at the top. Going back (closing a conversation, Back in You) returns to where you were.
- Never make someone wait on the server to move on. Show the next step at once, then "Saving…", "✓ Saved", or "Try again" if it fails. Never lose an answer.
- Loading shows the outline of the screen, not a spinner. After 5 seconds add "Still loading…"; after 10, offer Try again and a way back.
- Every error says what happened and what to do next, in plain words, with Try again where it can work.
- Accept messy input and clean it: codes in any case with spaces or dashes, a pasted invite link, emails with stray spaces.
- Focus: a 2px claret outline with a 3px gap.

## Colour and contrast

- Text at least 4.5:1 against its ground; large text (24px+) and control edges at least 3:1.
- Measured pairs that pass: ink on white 17.5, grey `--ta-grey` on white 6.4, amber `#8F5A12` on white 5.8, ink on honey 7.0, white on claret 15.1, gold on claret 10.6.
- Gold on claret only (brand rule 1); app screens are white or soft blush (rule 2); the mark is the A (rule 3). See CLAUDE.md §10.1.

## Words

- Short, warm, direct. "You" and the partner's name.
- Questions in plain words anyone can follow and a translator can carry: no idioms ("take a back seat", "dropping by"), at most 100 characters. The plain-language pass of Oct 2026 rewrote the 91 that ran longer.
- Scores always carry their count: "Based on 22 questions you both answered", "7 of 10 guesses right".
- "Not a verdict: a place to start talking." on every reveal except 100%.
- Scripture is ESV, except Amos 3:3 (NKJV).

## Checking a screen

Before calling a screen done: render it in the gallery (`npm run build:gallery`), check it at 390px wide and with large text, and run `npm run audit:gallery`, which measures every gallery screen for text under 12px, tap targets under 44px and colour pairs under 4.5:1 (3:1 for large text) and writes `review/audit.json`. It must report zero. Aim for 48px targets; the audit's floor is Apple's 44.
