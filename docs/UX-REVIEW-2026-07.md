# TwoAgree — UI / UX / Workflow Review (July 2026)

**Scope:** the full app as of `claude/app-ui-ux-review-kkvfo2` (branched from main @ a9ea85f) — onboarding, shell/nav, the answering loop, reveal & celebrations, results, the Path, visual system, motion, copy, accessibility.
**Method:** the app was run locally against the emulator suite; ~130 screenshots were captured of every screen and interaction (all four question types, guess + importance phases, both reveal ceremonies, the full 16-step onboarding walk). Eleven specialist review passes were then run over code + screenshots, followed by an adversarial fact-check of every high/medium claim. Everything below carries `file:line` evidence; claims that failed verification were dropped or corrected.
**Brief:** *"Like Duolingo, but pleasant instead of energetic. Beautiful. Very interactive question types, easy to answer. A pleasing score for how much they agree and how much they know each other. Increasingly visual celebrations the higher the scores."*

---

## 1. The verdict

The foundation is genuinely strong — much stronger than a typical solo build. The brand system is disciplined (one colour source, documented deviations), the motion language is already "calm Duolingo" (one spring curve everywhere, thorough reduced-motion guards), onboarding does value-before-signup correctly, and the per-question reveal visuals (scale bars that merge into a heart, matched chips, rank columns) are bespoke and beautiful. **Nothing here needs a redesign.**

What stands between this and the app in the brief is one theme, repeated at different scales: **the payoff layer is half-built.**

- The reveal ceremony's climax — the count-up — literally plays behind an invisible element (opacity 0) every single time.
- A complete celebration-escalation system (ring-pop, halo, glints, goldwash, sparks) sits **dead in the CSS**, referenced by no component. Today the ladder is: 0–75% nothing, >75% petals, >90% more petals.
- The Us tab shows eight percentages and zero questions — a scoreboard, when the product's purpose is a conversation agenda.
- The two core numbers (Agreed / Known) swap colours between screens, and Known never appears on Home at all.
- A handful of flow dead-ends (no sign-in for returning users, no onboarding resume, no exit from a Path step, no skip on open questions) can hard-strand exactly the users you're about to recruit.

All of it is finishing work, not rework — most of the machinery already exists in the repo.

---

## 2. What is already right — do not touch

| What | Where |
|---|---|
| Value-before-signup onboarding: anonymous auth carries warm-up answers; account asked only at the invite gate (host) / after the reveal (invitee) | `Onboarding.tsx:70–115, 290–311` |
| The consent screen — "This won't tell you whether to get married. It'll tell you what you haven't talked about." | `Onboarding.tsx:443–501` |
| "Not a verdict — a place to start talking." at the moment of judgment anxiety | `RevealScreen.tsx:199–203, 257–262` |
| Per-type reveal visualisations: scale bars + heart on agreement, MC chips, rank columns, quoted open answers | `RevealScreen.tsx:430–556` |
| The berry-you / honey-partner person-colour system, used consistently across dots, chips, avatars, columns | `index.css:1215–1224, 1283–1294, 1355–1360` |
| The press/settle motion language: one spring bezier (0.34, 1.56, 0.64, 1) at every touchpoint, 7 reduced-motion blocks | `index.css:163, 476–563, 1685–1703` |
| Scale orbs with the live "Leaning / Strongly / Right in the middle" label — kills the "is 3 neutral?" problem | `PlayScreen.tsx:353–385` |
| "Not yet" as a first-class, unscored, pressure-free answer | `PlayScreen.tsx:124–133`, `scoring.ts:48–53` |
| Per-question persistence — exit is always safe, resume is seamless | `PlayScreen.tsx:62–67, 111–122` |
| The Path's claret world — arrival screens, verse cards, the lamp ritual. The most beautiful surfaces in the app | `PathStep.tsx:141–196, 440–516` |
| The waiting state: breathing rings around a perfectly still mark (marks never animate) | `SessionApp.tsx:235–240`, `index.css:1530–1562` |
| Score honesty: denominators beside every big number; share card Core-only; no leaderboards | `CoreScore.tsx:7–11, 36–48` |
| Petal celebrations in brand colours — organic, calm, never generic confetti | `RevealScreen.tsx:304–341`, `index.css:1883–1912` |
| Flags copy: "Nothing here is a problem — it's just where the talking is." | `FlagsReview.tsx:274–279` |
| Token discipline: raw hex only in `tokens.css`, app-layer deviation documented | `tokens.css:1–76`, `index.css:1–38` |

---

## 3. Fix first — dead ends that strand real couples

These are the launch-relevant flow breaks. Every one was reproduced against the code; none is speculative. Effort: **S** = under half a day, **M** = 1–3 days.

| # | Finding | Impact | Effort |
|---|---|---|---|
| 3.1 | **Returning users can't sign in.** AuthScreen is only reachable via the anonymous-auth *failure* fallback. An existing user on a new device sees only "Start", mints a new anonymous user, and at the profile gate Google fails with a raw, unmapped `credential-already-in-use`; the email path says "try signing in" with nothing to tap. `Onboarding.tsx:326–348`, `App.tsx:247–249`, `errors.ts:7–48` | Existing users hard-stuck; their real session unreachable | S |
| 3.2 | **Onboarding can't resume.** All flow state is ephemeral `useState`; the session code is only persisted at `onDone`. A mid-flow reload restarts from zero (host: duplicate session, orphaned answers). The invitee is worse: `?t=` is never stripped, the token is already burned, so a reload lands on "invalid or already used" *while actually seated in the session*. `Onboarding.tsx:85–97`, `App.tsx:214–221` | First-run abandonment; invite flow dead-ends | M |
| 3.3 | **The fallback invite link `/?c=CODE` is a URL nothing reads.** When `createInvite` fails, the host silently shares a link with no consumer (`invite.ts:7–9` reads only `t`). The partner lands on the generic front door; if they push on they create a *separate* session. `Onboarding.tsx:899–904` | The couple's first shared moment fails silently for both | S |
| 3.4 | **No exit from a Path step.** StepPlay renders no TopBar; SessionApp hides the nav. A step can be ~23 screens (Garden — intimacy — is the likeliest to need an out). Deck play has an exit at every phase; the Path has none. `PathStep.tsx:316–326`, vs `PlayScreen.tsx:167, 227, 278` | Users trapped mid-sensitive-topic; only escape is killing the app | S |
| 3.5 | **Open questions are a hard dead-end.** Empty text keeps Next disabled, and none of the 37 open questions carries `notYet` (overlap with the 48 flagged: zero). A user not ready to write about past relationships can only abandon the whole part via X. `PlayScreen.tsx:304, 311–320, 388–399` | Bail-out at the exact moment of vulnerability | S |
| 3.6 | **Raw Firebase errors reach couples at the highest-trust moment.** `prettyError` falls back to `err.message` for unmapped codes — captured live: "Firebase: Error (auth/internal-error)." under the password field at the invite gate. Missing maps: `internal-error`, `network-request-failed`, `credential-already-in-use`, `popup-blocked`. Two mapped strings are developer-voice ("check your security rules", "Firebase console"). `errors.ts:40–58` | Trust crack at the conversion moment | S |
| 3.7 | **Rank questions break inside the Path player.** `composePath` filters only `open`; 22 rank questions can be selected (probe: LOYAL-017 into the Summit). StepPlay renders rank as single-select and writes a scalar; scoring expects a comma-joined order — the reveal produces nonsense. StepPlay also never asks importance, though the Summit band is exactly the importance band. `composePath.ts:109`, `PathStep.tsx:286–314`, `scoring.ts:130–151` | Corrupted answers + broken reveal on the deepest questions | S (filter) / M (port rank+importance UI) |
| 3.8 | **"Where would you like to start?" discards the choice.** StartMenu's `onPick` is wired as `() => onDone(code)` — the picked conversation (Money, Intimacy…) is dropped and the user lands on Home with the default deck. Both flows end on this broken promise. `Onboarding.tsx:314–320, 437–439`, `SessionApp.tsx:53–66` | The flow's closing promise breaks at the final tap | S |
| 3.9 | **Exiting between answer and guess silently forfeits that guess forever.** Resume position derives only from answers, so the Known score quietly loses data points. `PlayScreen.tsx:62–67, 85–86` | Known score silently underreports | S |
| 3.10 | **Disabled buttons look fully enabled.** `.screen-enter > *` uses `animation … both`; the final keyframe's `opacity:1` beats `.btn[disabled]{opacity:.55}` forever (pixel-verified: identical rgb on disabled vs enabled CTAs). Users tap Start on the consent screen without ticking and get zero feedback. `index.css:1518–1528` vs `195–198` | Every gating CTA in onboarding misleads | S |

Also worth wiring while in here: Home's featured card resets to `ORDER[0]` on every reload under a greeting that says "Where you left off, together" (`SessionApp.tsx:65`) — derive it from actual progress; and `local.ts`'s own header already promises "active session **+ deck**".

---

## 4. The answering loop — good bones, missing feedback beats

The loop's interaction fundamentals are right (see §2). What's missing is the *feedback layer* — the small confirmations Duolingo never skips — plus rhythm control on deep decks.

**Continuity & context**
- **The progress bar and part eyebrow vanish during guess and importance phases** — and 336 of 399 questions are guessable, so couples spend roughly half the loop with no sense of place. The card also shifts (marginTop 20 vs bar+18). Keep `.qprog` mounted through all three phases, same offset, no tick on sub-steps. `PlayScreen.tsx:164–274` vs `279–284`
- **The importance screen never says which question it's about.** On Deal-breakers all 23 questions trigger the identical "How much does this matter to you?" card — users rate on muscle memory, and those ratings drive scoring weight. Quote the question + a compact YOU-SAID chip (the `.yousaid` pattern exists). `PlayScreen.tsx:164–199`
- **Fold importance into the answer card** on non-rank types: after a choice, a compact honey 1–5 row slides open under the options; Next banks both. A 7-question deep part currently runs ~20 near-identical screens (answer → importance → guess); this removes a third of them with zero scoring changes. `PlayScreen.tsx:32–33, 111–144`

**Micro-feedback**
- **The bar fills on arrival, not on answering** — it reads ~17% before the first answer and 100% during the last question. Fill on commit (width = `idx/qs.length`, advance on submit, ~250ms beat before the next card) and the last answer visibly completes the bar. `PlayScreen.tsx:279–284`
- **The bottom hint never reacts** — "TAP TO ANSWER" persists after tapping. Make the suffix live ("TAP NEXT WHEN READY"). `PlayScreen.tsx:321–328`
- **No busy shimmer on Next / Lock it in** — the `.btn.busy` pattern exists and is used in AuthScreen/Onboarding, but not in the loop where users tap dozens of times. `PlayScreen.tsx:261–268, 301–310`
- **Rank needs three touches:** a live counter while ranking ("Ranked 2 of 6 — keep tapping"), auto-assign the final remaining option, and a hint that tapping a ranked row un-ranks it. Renumbering should transition (150ms) instead of snapping. `PlayScreen.tsx:401–431`

**Correction**
- **There is no way to fix a mis-tap, ever** — writes are immediate and forward-only. The cheapest correct fix: make the YOU-SAID chip on the guess screen tappable ("YOU SAID Mostly her · **change**") returning to the answer view preloaded; `writeAnswer` already overwrites by path. `PlayScreen.tsx:78–94, 111–122`
- **Scale recap says "4 / 5"** in an app that names positions — compose it from `SCALE_WORDS` + endpoints ("Leaning — Everything in its place"). `PlayScreen.tsx:224`

**Interactivity variety (renderer-only, scoring untouched)**
The bank is 189 MC + 149 scale and every part is the same two shapes. Three variants `scoreQ` already handles: **this-or-that** (any 2-option MC as two big side-by-side cards), **conviction statements** (scale preset lo="Strongly disagree" / hi="Strongly agree" — poses hot-button items as honest statements), and a **glide slider** skin for continuous-feeling scales. Parts then alternate shapes the way a good lesson does.

---

## 5. The reveal — finish the gift

This is the heart of the brief, and the highest-leverage work in the repo. Three facts:

1. **The climax plays invisibly.** `PctRing`'s 900ms draw+count-up starts on mount, but its wrapper `.lvlup-rise.r1` holds opacity 0 for 1.15s (`fill: both`). Live probe: at t=1600ms the wrapper is at opacity 0 with the arc already at 55%. The couple sees a blank blush screen, then rings pop in pre-settled. *The single most dramatic beat in the app has never once been seen.* `Ring.tsx:20–40`, `index.css:1773–1783`, `RevealScreen.tsx:123–134`
2. **~120 lines of finished celebration CSS are dead code.** `.bloomwrap` (ring-pop + expanding halo + two timed glints) and the `.grand` tier (goldwash pulse + radial spark burst) are referenced by no component — grep confirms zero `.tsx` usage. What ships is: 0–75% nothing, >75% 26 petals, >90% 96 petals. 100% looks identical to 91%. Known **never** triggers celebration, despite CoreScore declaring it the hero. `index.css:1565–1638, 1794–1847`, `RevealScreen.tsx:127–129`
3. **Tapping to skip the meet stage forfeits the party** — `skipped.current` cancels `setParty` entirely, so the excited couple who taps (the most natural thing at 100%) loses the petals as punishment. `RevealScreen.tsx:121–139`

### The ladder (mostly wiring, not building)

| Band | What happens (all existing CSS unless noted) |
|---|---|
| every reveal | Rings draw **in view**; count-up is the entrance; soft `ringPop` as the number lands |
| ≥ 60% | + the two timed gold `glints` |
| ≥ 75% | + `haloOut` bloom + the current petal fall |
| ≥ 90% | + `goldwash` pulse + `sparkOut` burst as the number settles + dense petals |
| 100% | one singular beat no other band gets (new, small): the two avatars from stage 1 drift back in and settle together between the rings — *two walking together, literally* |

Trigger the same ladder off **Known ≥ 90** as well. Fix skip to *reschedule* the party (~700ms later), never cancel. Petal positions/delays are currently modular-arithmetic chains that fall in visible diagonal strings — randomise per mount (~15 lines).

### Words that scale with the moment
`knowLine` has a comfort ladder; **Agreed — the number couples actually fear — has none.** A couple landing 34% on Theology gets a bare number. Add a tiered `agreedLine`, honest and unsoftened: ≥85 "Walking closely"; ≥60 "Well agreed — and a few real differences"; below: "You differ on real things — that's exactly what this is for." Below ~60%, the primary CTA becomes **"See where to start talking"** and the ceremony surfaces the flag count ("3 things worth a closer look") — the FlagBox machinery already exists but currently renders only below the fold of the answers phase. `RevealScreen.tsx:52–57, 185–215`, `FlagsReview.tsx:72–98`

### Smaller ceremony fixes
- Stage 1 is conceptually lovely and visually starved (two circles + one line in a 60vh void, ~80% empty). Names under avatars, a soft radial wash blooming as they meet, a tiny settle at touch. Avatars only — the mark never animates. `RevealScreen.tsx:173–183`
- Stage 2's staggered CTAs are invisible-but-clickable during their animation delay (`riseIn … both`) — a blind tap can navigate away. Gate pointer-events until settled. `index.css:1508–1516, 1773–1783`
- The Agreed/Known **colour mapping flips between reveal and Results** (honey=Agreed on the rings; amber=Known on the Us tab). Pick one — recommended: **Agreed = honey** (warmth of agreement, matches Home's pills), **Known = claret** — and enforce it in `ScorePair.tsx:27–28`, `CoreScore`, `.rs.kn`, knowline accents.
- A genuine 0% Known renders as a stark empty gauge beside its gentle copy — below ~5 guesses made, show the count form instead of the ring. `ScorePair.tsx:18–24`
- The moment is never shareable — the card lives two screens away on Results and is never offered when earned. Bridge it in the afterglow ("Save this moment") — see §6 on making the card an image.

---

## 6. From score to conversation — the product's purpose, currently missing its last mile

The app's stated purpose is to aid discussion. Today the loop ends at *reading*:

- **Nothing carries a couple from "Worth a chat" to an actual chat.** No bookmark, no talk list, no "we discussed this" closure — grep for any such mechanic returns zero. Flags resurface identically forever; the one behaviour the product exists to create is never celebrated. **Recommendation:** a per-question "Talk about this" pin (RTDB: `decks/{slug}/talks/{qid}/{role}: true` — scalar leaves per the §6 gotcha), a "Your talk list" section on Together, and a mutual "We talked about it" that retires the item with a small petal moment. Closure is the celebration most worth building.
- **The Together tab is eight percentages and zero substance.** "Most worth a conversation: Money 54%" names a topic and gives the couple nothing to say. Inline the top 1–3 conversation-worthy questions (flag rows first, then lowest "Worth a chat") with the two answer chips — the McBody components already exist. Numbers become the caption, not the content. `ResultsScreen.tsx:40–126`
- **Deep links land unfiltered** — tapping "Money · 54%" opens every question in bank order; the two Worth-a-chats hide among seven Agreed cards. Add a filter chip row ("All · Worth a chat (2) · Flags (3)") or verdict-sort when opened from Together. `SessionApp.tsx:196–212`
- **Flags have no home outside a single reveal.** `collectFlagRows` is pure and deck-agnostic — compute it across all revealed questions on Together and render one entry point ("4 things worth a closer look together"). `flags.ts:25–45`
- **"Share your card" shares a plain sentence, not the card** — and the code comments admit relying on screenshots. Render the designed card (claret names in Fraunces, the hero number, the mark) to a PNG via canvas and share it as a file; add a "Copied" toast; guard the `null%` case. A beautiful card in a group chat is this app's entire organic acquisition channel. `CoreScore.tsx:100–107`
- **Synth cards are coverage-blind** — "Closest agreement: Faith 77%" can rest on 1 of 5 parts while complete Money shows 54%. Gate the two headline callouts on evidence (a full part + weight floor) or annotate ("1 of 5 parts — early read"). `ResultsScreen.tsx:34–38`
- **Scripture is prime conversation fuel and it's hidden** — 110 of 399 questions carry `ref`, rendered only inside the flag walkthrough. Show it (small, muted) on Worth-a-chat cards at minimum. `FlagsReview.tsx:213`
- Small: the flag walkthrough's Skip button is identical to Next (`FlagsReview.tsx:250–263`); "One of you knew" can be false when the other partner simply didn't guess (`scoring.ts:183–185`); scale guesses print "4 / 5" (and seed data "99 / 5") where the endpoint label would feed talk.
- **A discoveries feed** (big idea, cheap): every wrong guess re-projected as treasure — "You learned: Judah would keep finances fully separate", newest first. It gives Known a substance layer, makes low guess scores feel like riches (matching the "So much still to discover" copy), and needs no new data.

---

## 7. The Path — the flagship needs a payoff and a pull

The Path is the app's most beautiful and most devotional surface (see §2), and structurally clean (a pure sequencer over the real decks — no double-asking). Its gaps:

- **The Lookout breaks the intro's promise.** "You arrive at your alignment…" — the actual finale is three verses and a Back button. No journey-wide Agreed/Known, no recap, no keepsake. Aggregate `stepDeckData` across the nine steps through the existing scoring and open the Lookout with the couple's whole-journey numbers, their brightest waypoint, one worth-a-conversation waypoint — then the verses as benediction. `PathScreen.tsx:189–196` vs `500–527`
- **Nothing pulls the couple back.** Home and Results are Path-blind; the "next lamp" draw exists only if they open the tab. Once a path is laid, Home's hero slot should be "Continue the Path — Step 4 · The Table" with the waypoint glyph. Calm, streak-free: where you are, never what you owe. `HomeScreen.tsx:136–346`
- **The current node reads as done** — done nodes get the breathing halo; the *current* one is static and 4px larger. Move the halo to the current node and add a small "Continue" chip. Duolingo anchors its whole map on the active node. `PathScreen.tsx:465–478`
- **The map hides partner state**, and the waiting copy promises "We'll let you know when Judah has walked it too" — no notification mechanism exists. Two-dot walked indicator on the current node (claret you / honey partner); honest copy: "The lamp lights the moment you've both walked it." `PathStep.tsx:425–429`
- **Only the faster partner gets the lamp ceremony** — the second arrival finds it pre-lit and static. Keep the shared lamp bit for the map, play the lighting moment per-partner (local seen-flag). `PathStep.tsx:455–476`
- **Unbounded step sizes land the heaviest sittings on the most sensitive ground** — probe: Garden (intimacy) 11 questions ≈ 23 screens. Cap at ~8/step in `composePath`, redistribute. `composePath.ts:137–161`
- Intake: the progress bar starts at 0% (`idx/` vs `(idx+1)/`), and tab-switching silently discards all intake answers (state below a `key={tab}` remount). `PathScreen.tsx:267–272, 326`

---

## 8. The visual system — one regression, one identity bug, and finishing passes

### The mark (brand regression — decide, then enforce)
`TWOAGREE-MARK.md` v5.1 defines the mark as **three** paths — two leaning strokes **plus the floating gold bar** ("the shared element", the point of the symbol) — L-segments only, and §6 explicitly bans the old coordinates and C-curves. `Mark.tsx` contains exactly those banned coordinates, uses C-curves, and renders **two** paths: no bar anywhere in the UI. `public/favicon.svg` draws the strokes *in gold* on claret — violating RULE 3 (gold marks the bar only, never a stroke). BRAND-REPORT.md records these checks as passing, so the brand-pack integration silently regressed the locked spec — the spec's own rule: "this document wins and the file is wrong." **The couple's symbol of agreement currently has no agreement in it.** Rebuild `Mark.tsx` from §4.1, regenerate the favicon/rasters, re-run the §6 greps — or, if the two-stroke cut is now a deliberate choice, write that decision into the spec. `Mark.tsx:7–14`, `TWOAGREE-MARK.md:94, 108–114, 350–351`

Related: the wordmark's inlined A floats above the baseline and under-reaches the capline — the exact defect §5.3 documents (0.78em/0.62em sizing against the square viewBox letterboxes ~0.08em). Apply the spec's cap-based sizing. Visible at every size on the front door and auth header. `Wordmark.tsx:32–36`

### Colour identity of the two scores
Covered in §5 — the honey/claret meaning of Agreed vs Known flips between adjacent screens. One mapping, enforced everywhere, plus **Known finally surfacing on Home** (revealedRows already returns it; HomeScreen discards it — `HomeScreen.tsx:84`).

### Contrast & the white-card rule
- **White text on honey fills fails contrast (~2.1:1)** on the selected orb — the single most-tapped element in the app — plus rank number chips, partner scale-dots, and partner quote avatars. `tokens.css` itself says honey takes dark text and provides `--app-honey-ink` for exactly this. One-line swaps. `index.css:476–480, 592–596, 1218–1220, 1358–1360`
- **Auth and Start break the white-card system** — blush field wells sit directly on a ground gradient that bottoms out at the same blush (#F8E9EC on #F8E9EC). The first thing a recruited tester sees reads unfinished. Wrap in the standard white card. `AuthScreen.tsx:124–234`, `index.css:59–64, 128–139`
- **The disabled play CTA reads as a muddy grey-mauve slab** (claret gradient at 0.55 opacity over blush) — and it's the state every question starts in. Give disabled its own recipe (blush fill, 50%-claret text, no shadow). Verdict on the two-CTA-colour world: the claret answer / honey guess split mirrors berry-you/honey-partner and reads *intentional* — keep it, style only this state. `index.css:150–165, 195–198`

### Composition & consistency
- **Tall screens die below the fold** — play, guess, picker leave 40–50% dead blush; it reads "failed to load," not calm. The Path intro already solved this (viewport-fill flex, CTA pinned toward the thumb via `margin-top:auto`); extend that pattern to the core loop. `index.css:2950–2958, 3068–3083`
- **21 off-brand deck hexes live in the data layer** (steel blue, violet, murky reds…) — the main place the app drifts from crafted brand toward template. Curate 6–8 brand-family hues in `decks.json`, reuse across the 21. Keep the tile mechanic. `DecksScreen.tsx:81`
- **Two different golds share the claret grounds** — Path interstitials use app-honey #E5A93C where the mark gold #C6913C belongs. Standardise: on claret, always `--ta-honey`. `PathStep.tsx:164–177`, `index.css:2286–2291`
- **13+ variants of the uppercase micro-label** (9.5–12.5px, tracking 0.4–3px, weights 600–800) — consolidate to two classes. **Radii and spacing drift** off the declared scales (18/20/26/14/12px radii; 13×15, 9, 7, 11px spacings) — one mechanical snap-to-token pass.
- Phantom progress: untouched decks show a honey dot at 12 o'clock (`strokeLinecap="round"` at 0 progress) — 16 phantom dots down the Talk list. One-line guard. `Ring.tsx:55–68`
- Talk-screen taxonomy: stage buckets (Warm-up/Core/Deep) *and* per-row depth words (Warm-up/Everyday/Deeper/Vulnerable) compete — drop the row word except where it disagrees meaningfully; and within each stage, sort in-progress → untouched → completed (today completed Money sits above in-progress Faith in a static wall of 13). `DecksScreen.tsx:30–31, 69–77`

---

## 9. Motion — name the system, wire the dead pieces, fix three beats

The motion language is already excellent (§2). The gaps:

- **Motion has no tokens** — riseIn runs at five durations; `revealRise`/`pathfade` are near-duplicates; and a real cascade bug: `.glide-in` and `.screen-enter > *` tie on specificity, so the later rule wins and every question card inside onboarding/PathStep silently plays the wrong entrance. `.brand-enter` is applied at 11 JSX sites and defined nowhere. **Add a five-token motion block to `tokens.css`** (`--dur-press 120ms / --dur-select 400ms / --dur-enter 280ms / --dur-ceremony 900ms / --dur-breathe 3200ms`; `--ease-spring / --ease-glide / --ease-settle`) with three rules: nothing loops but breathe + spinner; no 600–900ms outside ceremony; one overshoot on screen at a time. `index.css:1477–1528`
- **Onboarding replays the full 8-child stagger on every one of ~15 steps** (~0.9s settle each). Reserve `screen-enter` for true arrivals; step-to-step gets the quick `paneIn`. Duolingo keeps intra-flow transitions ~250ms. `Onboarding.tsx:175–921`
- **Sub-steps reuse the new-question glide** — the same question slides in from the right up to three times (≈21 identical slides per part). Grammar: slide = new question; rise-in-place = same question, next facet. `PlayScreen.tsx:164–274`
- **Numbers are alive in exactly one place** — the reveal rings count up; the CoreScore hero and Results percentages are inert. Export `useDraw` from Ring.tsx and count the hero up over ~700ms. Skip per-deck rows (too many counters isn't calm).
- Perf: each Decks visit remounts ~19 RAF count-up loops (one setState per ring per frame) under the pane animation — draw the mini rings with a one-shot CSS dashoffset transition and remember per-session that they've played. Plausible first-frame stutter on the low-end Android Capacitor target. `DecksScreen.tsx:93`, `Ring.tsx:24–38`

---

## 10. Copy & voice — one contradiction, one banned mechanic, a handful of outliers

The voice is strong and the best lines are load-bearing (§2). The outliers:

| Finding | Fix | Where |
|---|---|---|
| **"There's no winner and no score"** — falsified within five minutes by an app made of percentages; reads as bait once the numbers appear | Keep the true promise, drop the false noun: "There's no winner — and nothing to pass. Every number describes the two of you together, never one of you against the other." | `Onboarding.tsx:340` |
| **"8 of 70 — it isn't yours until you finish it"** — textbook loss-aversion, which CLAUDE.md §1 bans; the code comment admits "the score pulls you to finish" | Invite instead of withhold: "8 of 70 — the picture fills in as you answer." | `CoreScore.tsx:52–60` |
| **"Lock it in →"** — the one game-show idiom in a devotional app; FR already ships the calm register ("Je valide") | "That's my guess →" across all three guess flows | `PlayScreen.tsx:267`, `Onboarding.tsx:647`, `PathStep.tsx:353` |
| **"Judah is at 0"** — robotic, faintly scoreboard | "Judah hasn't started this part yet" / "Judah is 3 in" | `HomeScreen.tsx:296–302` |
| **"HOW MUCH" badge** is grammatically orphaned; FR already has the better word | "IMPORTANCE" (or "MATTERS") | `PlayScreen.tsx:175` |
| **"0 of 3 right" + ✗ marks** — test vocabulary fighting the comfort line it sits beside | Drop the tally at 0; otherwise "You saw 2 of 3 coming"; consider ✦ for misses (a surprise, not a fail) | `RevealScreen.tsx:250–256, 408–424` |
| **"Browse the decks"** (and FR "les jeux" — *the games*, the one forbidden word) leaks internal vocab; everywhere else says "conversations" | "Browse the conversations" / "Parcourir les conversations" | `PathScreen.tsx:243–244, 382–384` |
| **FR register break:** "Ton pari… avait parié" (tu + betting vocabulary) inside vous chrome | Uniform vous; "Vous pensiez qu'il dirait…" | `RevealScreen.tsx:413, 421`, `FlagsReview.tsx:176, 189` |
| **133 of 399 questions have no French** — a FR couple hits English mid-deck, unannounced, on the deep decks | Finish the overlay, or disclose at the language picker: "Certaines questions restent en anglais pour l'instant." | `questions.fr.ts` |
| Notification promises that aren't true yet: "This is how we let you know when they answer" (gate), "We'll let you know when Judah has walked it too" (Path) — no notification mechanism exists | Reword to the honest value until Phase-3 ships | `Onboarding.tsx:825–831`, `PathStep.tsx:425–429` |
| CTA grammar drift (Start vs Start →; "← Back" vs "Back"; share text in past tense "we knew each other") | Three rules, one sweep: → on forward CTAs always; Back is plain; scores in present tense | various |

Plus the copy **big idea** worth doing: extract the ~15 recurring phrases into one copy module (the guess step exists in three drifting copies today), and replace generic waits ("Opening your session…") with a small rotating set of quiet blessings in the mold of the existing "Bringing it together…".

---

## 11. Accessibility & mobile ergonomics

<!-- PENDING: a11y reviewer -->

Verified so far from other passes: answer options (orbs, MC rows, rank rows) and Talk-screen deck rows are click-`div`s — no keyboard access, no roles, no focus-visible (the CSS has focus styles for `.btn` only); Path map nodes carry `role="button"` but no `tabIndex`/key handler; the lock toast has no `aria-live`; TopBar's aria-label is hardcoded English and mislabels back as "Close and go home". A web-first product recruiting testers should make the core loop keyboard-operable as a trust signal: render options as buttons/radios — the CSS classes survive unchanged.

---

## 12. What the best comparable apps do (patterns worth borrowing)

<!-- PENDING: benchmarks reviewer -->

---

## 13. The big moves — ranked

Curated from all passes; each is transformative rather than corrective, and all stay inside the design values (no streaks, no guilt, no energy for its own sake).

1. **The Landing (M).** One continuous reveal arc: avatars meet → crossfade (never a blank frame) → rings draw and count up *in view* → a landing beat scaled to the score (§5 ladder, mostly dead CSS wired up). The gasp moment the app is built for.
2. **Claret is for ceremony (M).** The app has two visual worlds — blush for daily work, claret+gold for the Path's holy moments. Move the reveal ceremony onto claret and let the score buy more of it (>75% gold hairline + petals; >90% goldwash + sparks) before docking back to the light world for answers. "Increasingly visual" using rules the brand already permits; welds the two worlds into one rhythm: ordinary = light, milestone = claret.
3. **From score to conversation in one tap (M).** After the rings settle, rise in up to three "Start here" talk-cards (blind spots + biggest gaps, each with the walkthrough's prompt and scripture ref, styled as small claret cards). High scorers get celebration first and one card; low scorers get the cards as the headline. Every reveal ends with the two of them talking.
4. **Tonight's three (L).** A standing ritual card on Together: the three most conversation-worthy revealed questions, full-screen walkthrough, each ending in a mutual "We talked about it" that retires it with a petal moment. The celebration lands on the behaviour the app exists for.
5. **The Couple's Rings on Home (M).** Replace the flat stat tiles with one hero: overlapping Agreed/Known rings (drawing in on open) with the couple's avatars at the intersection; quiet upgrades at 75/90%. Fixes the buried Known score and makes Home the couple's hearth, not a dashboard.
6. **Tonight's step (M).** One recommendation slot above the featured card, chosen by a tiny heuristic (partner-finished part → your in-progress part → next deck in stage), with a warm reason: "Judah's answers to Faith Part 2 are waiting — about four minutes." Calm Duolingo = never having to decide what the lesson is.
7. **Put the couple ON the Path map (M).** Sarah & Judah's paired avatars standing at the current waypoint; when one walks ahead, they wait visibly a stretch up the trail. Solves "you are here", partner state, and map-aliveness in one image. + terrain (the line dips through the Valley, climbs to the Summit) when there's appetite (L).
8. **Keepsakes, not text shares (M).** Canvas-rendered PNG cards in claret & gold for: the Core card, "We finished the Core", first-reveal-ever, and the finished Path (the whole trail aglow, both names, the date, the Amos verse). Couples sharing beautiful cards into group chats is the entire zero-budget growth loop.
9. **The second walker (M).** Presence micro-motion from data already streaming: the waiting screen's counter ticks the moment the partner's answer lands; Home's avatar pulses once when they finish a part; the reveal auto-unlocks with the meet animation the second the last answer arrives. The app breathes when the other person acts.
10. **Discoveries feed (M).** Every wrong guess re-projected as "You learned: …" — the Known score's substance layer, and low guess-scores become riches.
11. **Seven Stones (M).** The part progress bar as one soft segment per question: answer fills half, guess completes it, the current stone breathes; the last stone blooms into the part-complete transition. Fixes phase continuity structurally and gives every tap a landing place.
12. **The illuminated layer (M).** One `<VerseCard>` set-piece (Fraunces italic, hanging quote glyph, gold hairline, small-caps ref) deployed at exactly three peaks: front door, deck-completion reveals, share card — plus a near-subliminal vellum grain (SVG feTurbulence at 2–3%) on the blush ground. The faith identity becomes the source of the beauty rather than a label on it.

---

## 14. Suggested build order

**Sprint 1 — Trust (all S).** §3 dead-ends: sign-in link + error mapping, `?c=` handling, Path step exit, open-question skip, StartMenu slug pass-through, disabled-button styling, guess-resume, featured-card memory, rank filter in composePath.
**Sprint 2 — The Ceremony.** §5: visible count-up, celebration ladder + Known trigger, skip-reschedules-party, agreedLine tiers + low-score CTA, stage-1 dressing, colour-identity unification (+ Known on Home), petal randomisation, share bridge.
**Sprint 3 — The Conversation.** §6: talk pins + talk list + mutual closure, Together-tab inline questions, aggregated flags, review filters, keepsake PNG share, discoveries feed.
**Sprint 4 — The Systems.** §8–9: mark restoration per spec, honey-ink contrast fixes, auth white-card, viewport-fill play screens, deck-hue curation, motion tokens + entrance discipline, label/radius consolidation, a11y semantics pass, copy sweep + FR register, importance-fold + rank touches.

Then the big moves as appetite allows — **The Landing** and **From score to conversation** first; they are the brief.

---

*Method note: two temporary dev-only stubs (a preview write no-op and a slug URL param) were used to capture the screenshot corpus and were reverted before this commit; `.env.local` (gitignored) points dev at the emulator suite. The screenshot corpus lives outside the repo; shot names referenced above (e.g. `40-reveal-stage2-score.png`) are from that session corpus.*

