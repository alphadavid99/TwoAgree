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
