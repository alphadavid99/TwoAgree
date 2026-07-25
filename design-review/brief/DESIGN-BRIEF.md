# TwoAgree — Design Brief

*Prepared for a full visual redesign pass. Everything a designer needs is in this
document and the attached images; the referenced screens exist in a working
React app, so designs land directly on real, buildable surfaces.*

---

## 1. What TwoAgree is

A faith-based (non-denominational Christian) **couples compatibility app**, named
from Amos 3:3 — *“Can two walk together, unless they are agreed?”*

Two partners answer the same questions **independently and privately**. Their
answers are scored for alignment and revealed **only once both have finished** —
the reveal is mutual or it doesn't happen. Results **surface conversation, they
don't declare a winner**.

- **Core philosophy: “surface, don't settle.”** The product exists to get honest
  things onto the table before a couple commits — not to gamify or judge.
- **Audience:** Christian couples (dating → engaged → married), UK-first,
  mobile-first. Real people answering questions about faith, money, sex,
  children, conflict.
- **Platform:** responsive web app at a **430 × 932 design canvas** (iPhone-ish),
  later wrapped natively for iOS/Android. Design portrait mobile; nothing
  desktop-first.
- **Placeholder couple in all mockups:** **Sarah** (user, “S”, claret) and
  **Judah** (partner, “J”, honey).

### Tone

Calm, devotional, warm. Collaborative framing throughout — “the two of you”,
“where you landed” — never “you vs. them”. Serious without being solemn;
a wedding order-of-service, not a quiz app.

---

## 2. Hard rules (non-negotiable)

1. **No gamified guilt.** No streaks, badges, loss-aversion mechanics, or
   competitive framing. Encouraging copy at every score level — a low score is
   “still discovering each other”, never failure.
2. **The reveal is sealed.** Neither partner sees the other's answers until both
   finish. The UI must make this promise felt (it's the product's trust moment).
3. **Scores never stand alone.** Every percentage shows its denominator
   (“37% · across 11 questions”). A number over 9 questions must not read as
   authoritative as one over 70.
4. **No winner language.** “Worth a chat” is the strongest negative verdict.
   The line “Not a verdict — a place to start talking” is canon.
5. **The play screen keeps its identity-purple (claret) primary button and
   progress bar** — explicit owner preference. Honey is the action colour
   everywhere else on light grounds.
6. **The mark is the A.** The wordmark is “Two” + the vector mark + “gree”; never
   set “TwoAgree” as plain text, never redraw the mark, never animate it.
7. **Honest questions stay honest.** Contentious prompts (abortion, gender
   roles, sex) are not softened by design or copy.
8. **GDPR is a feature.** Export-my-data and delete-account live prominently in
   the profile, designed with the same care as everything else.

---

## 3. Brand system

### 3.1 Palette

**Brand core (strict):**

| Token | Hex | Job |
|---|---|---|
| claret | `#3E1A2E` | Primary. Grounds, headers, primary buttons. |
| claret-deep / ink | `#2A1120` | Body text, pressed states, deep gradient stop. |
| claret-hover | `#5C2E45` | Hover on claret; hairlines on dark grounds. |
| honey (mark gold) | `#C6913C` | Accent. **Only ever on a claret ground.** |
| honey-raised | `#DCB265` | Gold hover/raised, claret grounds only. |
| blush | `#F3DED6` | Cards, callouts, selected states. |
| white | `#FFFFFF` | In-app card surface. |
| grey | `#6B5A61` | Secondary text (6.0:1 on white). |
| line | `#EADFD8` | Hairlines on light grounds. |
| paper | `#FBF6F0` | **Marketing surfaces only — never app screens.** |

**App layer (approved hybrid deviation):** the app keeps a warm honey accent
system on light grounds — this is deliberate and stays:

| Token | Hex | Job |
|---|---|---|
| app-honey | `#E5A93C` | Action fills on light: CTAs, active nav pill, progress. |
| app-honey-deep | `#D9963A` | Hover; also **Judah's partner colour**. |
| app-honey-ink | `#3A2410` | Text on a honey fill. |
| app-amber | `#8F5A12` | Text-safe amber for honey-coloured text on light. |
| ground gradient | `#FBF2F5 → #F8E9EC` | The blush field app screens sit on. |
| opt-bg | `#F8E9EC` | Soft wells: inputs, chips, selected states. |

**Verdict / state colours:**

| State | Hex | Notes |
|---|---|---|
| Agreed | `#5E7A4E` (chip ground `#EAF1E4`) | calm sage — never a triumphant green |
| Close | amber text `#7A4E10` on `#FBEBD3` | |
| Worth a chat | `#7B3A5A` on `#F4E4EA` | claret-family, not red — a nudge, not an alarm |
| Complementary | `#8250B8` on `#EFE6F8` | different answers that fit together |
| Guessed right | `#2FA96B` | |
| Danger/delete | `#B23A48` | destructive actions only |

**The three brand rules:** (1) gold only ever sits on claret; (2) app screens
are white/blush (paper is marketing-only); (3) the mark is the A. Rule 1 has the
approved app-layer exception above — `app-honey` on light grounds is fine;
mark-gold `#C6913C` on white is not.

### 3.2 Typography

| Role | Face | Notes |
|---|---|---|
| Display | **Fraunces** (400/500/600, + italic) | Headlines, scores, question text. Italic Fraunces = the devotional voice (verse, “Not a verdict…”). |
| UI | **Hanken Grotesk** (400/500/600) | Everything else. |
| Wordmark only | **Inter** 400 | Carries “Two…gree” around the mark. Never used elsewhere. |

Uppercase eyebrow labels get generous letter-spacing (~0.2em) and amber/gold
colour. Question text is set in Fraunces at ~27px on the play screen.

### 3.3 The mark

Two leaning strokes — an “A” without a crossbar (`/\`) — exact vector paths
supplied in `assets/mark-claret.svg` / `assets/mark-gold.svg` (viewBox
`824 921 220 220`). Claret on light grounds, gold on claret grounds. Never
redrawn, cropped tight, or animated.

---

## 4. The approved design direction — “Gold on claret, at the moments that matter”

Round-two concepts (the `redesign/` images) explored this direction and it's
approved as the working thesis. Push it further; don't retreat from it.

1. **Claret carries emotion.** The app's emotional beats — onboarding verse,
   the reveal ceremony, score reveals, the morning greeting, the profile
   identity card — get full claret gradient grounds
   (`#4A2038 → #3E1A2E → #331526`) with true gold accents and soft gold-glow
   radials. This is where the brand's signature look lives.
2. **Working screens go quiet.** Lists, forms, settings: white cards and
   hairline rows on the blush ground gradient. **One hero moment per screen**;
   everything else recedes. Avoid stacked same-weight card soup.
3. **His-and-hers system.** Sarah = claret (blush-tinted pill `#F8E9EC`),
   Judah = honey (tinted pill `#FBEBD3`). Avatars are initial circles. This
   pairing is used consistently: answer pills, scale-bar stops, whispers.
4. **Colour-coded verdict chips** (see table above), uppercase, with a leading
   dot. Scannable down a long breakdown.
5. **Progress is quiet and specific.** Segmented per-question ticks on play;
   per-part ticks on deck rows; no big donut charts on list rows.
6. **Known leads, Agreed follows.** Of the two headline numbers, “how well you
   know each other” is the hero (gold, larger); “agreed” is quieter. Agreed has
   a ceiling problem (100% = two identical people); Known doesn't.

---

## 5. Screen inventory

All current screens are attached in `current/`; ten have round-two concepts in
`redesign/`. “Open” = known gaps for the designer to solve.

### Flow A — Before the session

| Screen | Images | Purpose & notes |
|---|---|---|
| **Onboarding** | `current/onboarding.png`, `redesign/onboarding.png` | First-run promise. Concept: verse hero on claret, three vows, gold CTA. Open: this is step 1 of a longer flow (consent, starter questions, reveal demo, profile, invite) — the whole flow needs the same language. |
| **Auth** | `current/auth.png`, `redesign/auth.png` | Email/Google sign-in, consent checkbox at signup. Open: signup state with consent; error states; password reset. |
| **Starter picker** | `current/startmenu.png` | Stage-matched first conversation (dating/engaged/married). No concept yet — needs the new language. |
| **Start / join** | `current/start.png` | Create a session or join by partner code. No concept yet. |

### Flow B — The shell (bottom pill nav: Home · Talk · Path · Together · You)

| Screen | Images | Purpose & notes |
|---|---|---|
| **Home** | `current/app-home.png`, `redesign/home.png` | Morning greeting, couple chip, two stats, continue card, recent reveals. Concept approved as direction. Open: empty/new-couple state. |
| **Talk (decks)** | `current/app-talk.png`, `redesign/decks.png` | 21 conversations in depth groups (Warm-up → Core → Vulnerable). Concept: continue hero + hairline rows + part ticks + turn states (“Waiting for Judah” / “Your turn”). |
| **Together (results)** | `current/app-together.png`, `redesign/results.png` | Both headline numbers, superlatives, per-deck rows. Concept: claret hero card, Known in gold. Open: share-card design itself. |
| **The Path** | `current/app-path.png`, `current/path.png` | Guided 10-step journey (intro shown; also has map/step states). No redesign concept yet — big opportunity: the “walk together” metaphor as a literal path. |
| **Profile (You)** | `current/profile.png`, `redesign/profile.png` | Identity card, preferences, session, data controls (export/delete). |

### Flow C — Answering & revealing (full-screen, nav hidden)

| Screen | Images | Purpose & notes |
|---|---|---|
| **Play** | `current/play.png`, `redesign/play.png` | One question at a time. Types: multiple-choice, 1–5 scale (labelled ends), rank (tap-to-order), open text. Some questions add an importance rating (1–5) and a predict-your-partner guess step. **Claret CTA + progress here, by owner rule.** Open: scale, rank, open, importance and guess step designs (only MC is in the concept). |
| **Part picker** | `current/partpicker.png` | Choose which part (level) of a deck to play next. No concept yet. |
| **Reveal moment** | `current/reveal.png`, `redesign/reveal.png` | The unlock ceremony. Concept approved — the emotional peak of the app. |
| **Breakdown** | `current/reveal-review.png`, `redesign/reveal-review.png` | Both scores + per-question verdicts, guesses, scale gaps. Open: rank-question display; open-text (quote) display. |
| **Before you walk on** | `current/flags.png`, `redesign/flags.png` | Flagged questions walked one at a time. Two flag types (see §6). Concept adds a “to get you talking” starter — good, keep. |
| **Core score** | `current/corescore.png` | Fixed 70-question instrument headline (Known hero + Agreed, denominators on screen, share card). No concept yet — should follow the Together claret-band language. |
| **Path step** | `current/pathstep.png` | Walking one Path step; has arrival/waiting/lamp states. No concept yet. |

---

## 6. Vocabulary the design must express

- **Verdicts** (mutually exclusive, per question): **Agreed · Close ·
  Worth a chat · Complementary**. Complementary = different answers that fit
  together (purple) — celebrate it, don't treat it as disagreement.
- **Flags** (stack on top of verdicts): **“Didn't know”** (a real difference at
  least one partner didn't see coming — the mutual case is the serious one) and
  **“Matters more”** (importance ratings ≥3 apart). Flags are invitations, not
  warnings.
- **Known vs Agreed:** guess-accuracy vs alignment. Known is the hero number.
- **“Not yet”:** a first-class answer on sensitive questions — counts as
  answered, excluded from scoring, never shamed.
- **Turn states:** “Your turn” / “Waiting for Judah” — quiet, factual, no urgency
  mechanics.
- **Parts:** decks split into ~7-question parts (“Part 1 of 2”), revealed
  part by part.

---

## 7. Components to systematise

Pill bottom nav (active tab grows a honey pill with label) · verdict chips ·
S/J avatars and answer pills · score rings (gold-on-claret) · scale bar with S/J
stops and gap fill · segmented progress ticks · flag walk card · claret hero
panels · eyebrow labels · the whisper line (“Judah is on question 5”).

## 8. Deliverables wanted from this design pass

1. A coherent screen kit covering **every** screen in §5 — including the
   no-concept-yet screens (Path especially) — in the approved direction.
2. The play-screen family: all four question types + importance + guess steps.
3. Empty, waiting, and error states for Home, Talk, Together, and reveal-wait.
4. The shareable score card (social image) for Together/Core.
5. A component sheet of §7 so the system is reusable.

## 9. Attached assets

- `current/` — 20 screenshots of the live build (430×932 @2x).
- `redesign/` — 10 round-two concept renders (same size; approved direction).
- `assets/mark-claret.svg`, `assets/mark-gold.svg` — the exact vector mark.
- `assets/tokens.css` — the app's live colour tokens.
