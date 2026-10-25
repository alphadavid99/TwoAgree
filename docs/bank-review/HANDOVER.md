# Question bank overhaul: handover

Start here in the next session. Work on a **new branch** (ask Dave to name it; don't stack on `claude/design-refresh`).

## What Dave wants
A full overhaul: the reviewed bank replaces the old one. Only testers use the app, so **start everyone fresh** (clear old answers in the emulator-tested way; Dave runs anything live). No need to keep old IDs readable.

## The inputs (all in this folder)
- `twoagree-bank-final.md`: the reviewed bank (456 active, 17 retired, 121 follow-ups, 73 new). Written as a change-set against the old 271-question workbook.
- `alignment-note.md`: scoring notes from the review (mirrored questions US-018 and FIN-005#fu1, reversed scales fixed, weighting layer, the "never serve these four together" rule, 7 Draft questions).
- `duplicate-pairs.json` + Dave's verdicts below.

## What was found
- The review never saw **128 questions** added to the app on 15 July (commit 42dab30), plus 8 renumbered to LOYAL-001..008 (the review calls those by their old IDs: INT-004, INT-006, INT-011, CONF-005, CONF-006, CONF-007, CONF-010, PAST-005).
- The review's IDs otherwise match the app (169 of 176 "previously" texts match exactly).
- Dave marked 51 possible duplicates (page: https://claude.ai/artifact/Md85EVZbTiULDSspievaZC, collection `marks`):
  - **Same, drop the July question:** DEAL-011 DEAL-015 DEAL-016 DEAL-018 DREAM-007 DREAM-009 DREAM-012 FUN-017 FUN-022 INLAW-008 INT-015 INT-022 LOYAL-014 NOW-004 NOW-008 NOW-014 NOW-016 NOW-018 ROLE-006 ROLE-008 ROLE-009 ROLE-010 US-047
  - **Different, keep both:** the other 28 pairs.
  - The other 77 July questions had no match: keep.
- Final bank ≈ **456 reviewed + 105 July = ~561**.

## Decided by Dave (25 Oct)
1. **Grouping:** keep the app's 21 conversations. Place every question in the one that fits its topic. Show Dave the list to approve before building.
2. **Follow-ups:** always asked straight after their main question. No answer-based rules.
3. **Rounds (parts):** rebuild each conversation's parts at **about 7 questions each, follow-ups counted**. A main question and its follow-ups always stay together in one part, so a part may be 6 to 8. Give every part a short name, as before (Dave approves the names with the grouping list).

## Still to decide with Dave (plain English, one at a time)
1. The 7 Draft questions: Draft does not hide a question today (check `status` handling before claiming otherwise).
2. Scoring changes from `alignment-note.md` (mirrored scoring flag, weighting).

## Build rules (CLAUDE.md §9)
`data/questions.json` + `data/decks.json` are the only source. Run `npm run build:questions`; every question must be in exactly one named part. Redeploy Functions with the bank. All gates green before committing.

## Session 2 (25 Oct): grouping proposed, waiting on Dave
- Branch `ccr-e0c32ad1-ujx8p9`, cut from `claude/design-refresh`.
- `grouping.json` places all **561** (456 reviewed + 105 July) into the 21 conversations as **79 named parts**, every part 6 to 8 with follow-ups counted. `tools/` rebuilds and checks it (see `tools/README.md`).
- 20 moves proposed (politics → Convictions, sexuality/gender doctrine → Convictions, IVF/donor/surrogate → Children, privacy → Faithfulness, careers → Work, the "right now" Us questions → Where We Are Now, PAST-005 back to The Past). Each needs Dave's yes.
- 4 possible duplicates *inside the reviewed set* (Dave's July pass never compared these): NEW-muvhvx1v/INT-009, NEW-muvhwocj/VAL-002, NEW-muvhufuw/VAL-007, NEW-muwlyt9p/FAM-002.
- Approval page: https://claude.ai/artifact/9i8cYDtFYmdRqC5jzU96uu. Verdicts land in its `verdicts` collection (one doc per part / move / pair: `verdict`, `note`, `rename`). Read them with ArtifactData, apply to `grouping.json`, re-run `tools/check.py`.

## Build notes (found while mapping; act on them at build)
- **Draft hides nothing.** `status` is stripped by `scripts/build-questions.mjs` and never reaches the app; 394 of today's 399 are Draft and all are live. Still to put to Dave.
- **Scales:** the review writes most SCALE questions with 5 labelled steps; the app's scale takes only `lo`/`hi` (5 orbs, generic intensity words). Either keep the endpoints only or add optional per-step labels to the schema.
- **Him/her:** HHB options ("Mostly him / Mostly her") must become `{A}`/`{B}` with `who: true`, as the app already does (`src/lib/who.ts`).
- **Levels → `depth`:** the review's Level 1–5 maps straight onto the app's `depth` 1–5.
- **IDs:** with everyone starting fresh, keep IDs for unchanged and KEEP-ID questions (French overlay and hooks keyed on them survive); mint new ones for everything else, with the deck's own prefix. Check `decks.json` `hook` ids, `data/path.json`, `data/reveal-library.json`, `src/lib/questions.fr.ts`, onboarding picks and tests for ids that change.
- **Functions** carry their own copy (`functions/src/questionBank.generated.ts`): regenerate and redeploy with the bank.
- **Mirrored scoring** (US-018, FIN-005#fu1) and the "never serve HEALTH-005/006 with NEW-muvmkn7r/NEW-muvmjt5v" rule: in this grouping the four sit in two different conversations, never one part.
- **Typo to fix on build:** `SELF-005#fu1` reads "rank these areas of your life in terms of importance to you" (lower-case, no question form).

## Session 2, round two (25 Oct): Dave's verdicts applied
- Dave approved all 79 parts and all 20 moves. Duplicates: dropped `VAL-007`, `VAL-002` and `NEW-muwlyt9p` (IVF); kept both of `NEW-muvhvx1v`/`INT-009`. The two dropped questions' follow-ups now follow their replacements (`VAL-007#fu1` → `NEW-muvhufuw`, `VAL-002#fu1` → `NEW-muvhwocj`).
- His comments, applied: modesty joins "Sex, gender and marriage"; `ROLE-012` → Fun; surnames (`NEW-muvgvq1q`) → Us "Getting ready for marriage"; `SELF-005#fu1` is standalone after `SELF-008`; `NOW-006` reworded. Everything is recorded under `decisions` in `grouping.json`, and `tools/merge.py` applies it.
- Knock-on changes he hasn't seen yet: Roles became two parts of 8 ("Who does what", "Leading and headship"), and `PAR-009` moves to Children so each Children part has 6. Those verdicts were cleared on the page so he can look at them again.
- **Now: 558 questions, 78 parts, all 6 to 8.** The comment threads stay open on the page because none was sent to Claude. Dave can resolve them himself.
- **Draft: decided (Dave, 25 Oct).** Ignore the label. Every question goes live, Draft or not, as today. `status` stays as authoring metadata only.
- **Mirrored scoring: built (Dave, 25 Oct).** New `mirror: true` flag, scale-only (the build rejects it on any other type or alongside `complement`). Scoring flips the partner's answer (1↔5, 2↔4) before comparing. Guesses aren't flipped, because you guess your partner's answer in their own words. The reveal track places the partner's dot as it reads from your side and never says "You both said" on a mirrored question. At build: set `mirror` on the new `US-018`, and make `FIN-005#fu1` a who question ("Mainly {A}" / "Mainly {B}" / …), which the app already stores by person. Both are in `grouping.json` → `decisions.scoring`.
- **Weighting: no change needed.** Scoring never read the six old "how important is it that we agree" questions. It weights by `depth` and by each partner's per-question importance rating.
