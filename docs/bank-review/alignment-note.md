# Reply to Claude Code — where we agree, and what it's missing

## Agreed, and you were right about the biggest thing

The ID risk is the real problem and I had underweighted it. I treated the bank as a document;
it is live data. So I went back and classified all 182 wording replacements by your rule.

**Only 13 can safely keep their ID. 169 need a new ID and the old one retired.**

Breakdown of the 169:
- 59 changed answer format (a stored SCALE value cannot be read as an MC pick)
- 93 changed the number of options
- 17 kept the count but changed what the options mean

The 13 safe ones are all OPEN questions — no options, nothing to shift. Every block in
section 2 of the change-set is now tagged `KEEP ID` or `NEW ID`, with the reason and the
previous wording printed underneath so you can confirm rather than take my word.

Some are genuinely different questions wearing an old ID. `VAL-007` went from immigration to
gender identity. `HEALTH-003` went from tattoos to how active our lifestyle should be.
`HEALTH-010` went from grooming to sleep schedules. `FIN-014` went from credit rating to
lifestyle growth. Those must not keep their IDs.

Also agreed and adopted:
- Retire, don't delete. The 17 removals are listed as retirements.
- A `retired` state is needed. Your point that `status` holds only `Draft` or `Approved` also
  invalidates the `Reviewed` value I had been using — everything is now `Approved` except 7
  questions whose wording is mine rather than Dave's, which stay `Draft` until he reads them.
- Parts are fixed. Do not move an existing question between parts. The category field in my
  change-set is from the old 19-category workbook and is marked advisory throughout.
- Deploy the bank with Functions, since they carry their own copy.
- Your compare-then-approve-then-build order is better than my six-stage plan. Use yours.

## Three corrections

**1. It is not a replacement bank.** It covers 271 of your 399 questions. About 128 of yours
are not mentioned in it at all and must be left untouched. Treat anything absent as "no
change", never as "delete".

**2. Old IDs are kept throughout.** You asked. Every question that exists today is referenced
by its current ID, and follow-ups are written `PARENT#fu1` so you can see what they attach to.
The `NEW-xxxxx` IDs are placeholders for questions that have never existed and need real IDs.

**3. Your step 2 comparison won't catch one class of duplicate.** Classifying my questions
against existing IDs tells you what changed. It does not tell you that a brand new question of
mine duplicates one of your 128 that I have never seen, under a different ID. That needs a
separate semantic pass over the 73 new questions and 121 follow-ups, judged on what each
question elicits rather than on wording. Specifically: a shared sentence frame proves nothing
("How do you feel about divorce" and "How do you feel about abortion" are different questions),
a follow-up that narrows its parent is not a duplicate of it, and a belief question and a
behaviour question on one topic are not duplicates. I wrote that rule for my own pass and then
broke it — I dropped 13 follow-ups for narrowing their parents and Dave had to restore them.
Hold yourself to it more tightly than I did.

## Four things in the change-set you did not mention, and need

**1. Two questions must be scored mirrored, not matched** — `US-018` and `FIN-005#fu1`. Their
options are self-referential ("I give more" / "you give more"; "Mainly me" / "Mainly you"). Two
partners who both pick option 1 are asserting opposite facts, so matching answers there mean
disagreement and mirrored answers mean agreement. This needs a per-question flag the scorer
reads, and it is wrong in production today.

**2. The weighting layer is gone.** The six old "How important is it that we agree on X"
questions were the mechanism; four were rewritten into content questions across the review
rounds, so only `FAITH-014` and `FAM-004` still function as weighters. Weight parts from config
instead, scaled by each partner's ranking in `US-022#fu1`. Tell us what the scoring code
currently reads for this, because if it still expects those six it will lose its weighting
quietly rather than erroring.

**3. Three data-level scoring bugs are fixed in the change-set and should be checked:**
`CONF-015`'s scale ran the opposite way to `CONF-005` and `CONF-006`, so a consistent answerer
scored as contradicting themselves. `FIN-009` ran the opposite way to `FIN-006`, same problem.
`VAL-004`'s divorce ladder was not cumulative — option 4 dropped the grounds listed in options
2 and 3, so two people with identical convictions could land on different options.

**4. A session rule:** never serve `HEALTH-005`, `HEALTH-006`, `NEW-muvmkn7r` and
`NEW-muvmjt5v` in one session. Different scopes, but together a person writes the same
disclosure four times.

## Still open — ask Dave, do not decide

- **Does `Draft` hide a question from users?** Trace it and say. It decides whether the 7
  Draft questions are invisible or live.
- **Any part mapping you are not confident about**, and anything bound for
  `where-we-are-now`, which has no counterpart in the old workbook.
- **Whether to ship this in one branch or stage it.** 169 questions changing identity plus 17
  retirements is a large share of a live bank. Couples mid-journey will see completion counts
  and reveals shift.

## What to ask for

The change-set is `twoagree-bank-final.md`. It is markdown, not a spreadsheet, deliberately —
the part mapping is unresolved, so a spreadsheet would bake in stale part names. Read it as a
spec and produce your comparison from it.
