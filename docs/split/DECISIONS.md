# Know / Agree split: decisions

Agreed with Dave, Nov 2026. This is the record future sessions build from. Where
it disagrees with `CLAUDE.md` or `docs/design-system.md`, this file is newer.
Prototypes are in `docs/split/prototypes/`; the first-pass sort is
`docs/split/sort.json`; the question voice is the `question-voice` skill.

## The idea

The app splits in two.

- **Know** (today's conversations): getting to know each other. Each person
  answers for themselves, then guesses the other's answer. It gives a Known score.
- **Agree** (the path): a curated set of questions per stage that shows where the
  two agree and where they don't. It gives an Agree score.

## Stages

- Four stages: **Friends**, **In a relationship**, **Engaged**, **Married**.
- The inviter sets the stage; the other person confirms it on joining.
- The stage is stored on the session, never on the person.
- **Friends get Know only.** The path opens at "In a relationship", so there are
  three paths to write, not four. Friends questions are a new set.
- Moving forward a stage needs both to confirm and gets the biggest celebration.
- Moving back needs only one person, with a calm (not celebratory) transition.
- A session stays open until someone closes it or deletes their data. Either
  person can close it alone; it closes for both and answers are kept.
- Minimum age 18, stated in the terms and confirmed at sign-up. Legal wording is
  for Dave to confirm.

## Questions

- One bank. Every question is sorted **Know**, **Agree** or **Disclosure**, and a
  question may be more than one kind. It is asked once and counts in each place.
- **Agreement matters** is a per-question flag. In the path it feeds the Agree
  score. On a Know question it only shows a note on the reveal ("you agreed" /
  "worth talking about"), never a score.
- **Disclosures** (trauma, addiction, past) can be open or multiple choice. They
  sit in the path, unscored, one or two at the end of a step. Friends may get
  some in deeper Know levels.
- "How are we doing" questions are not their own kind. They are the pool for
  path check-ins and deeper Know levels.
- The Draft / Approved label in the bank is meaningless and is to be removed.
- Each question is tagged with the stages it suits.

### Carry-over across stages

- One question, one ID. Each stage may have its own wording for the question
  **and** for every option.
- Fixed across a question's stage versions: the number of options, their order,
  and what each position means.
- If a stage needs different choices, it is a new question.
- Hope versus reality ("how would you want to" / "how do we") is always a new
  question, placed as a follow-up.
- When a couple meets a question they answered at an earlier stage, they see
  their earlier answer and choose to keep or change it. Nothing is asked cold
  twice.
- The build checks option count and order; meaning is checked by a human read.

## Know

- Cumulative: each stage adds topics and questions; earlier ones stay.
- Topics are regrouped from what the sort leaves (the 21 decks do not survive
  as they are).
- Flow per question: your own answer, then straight away your guess, worded with
  the partner's name in a full sentence ("Sarah was asked if she'd want pets.
  What do you think she said?").
- The score is front and centre and is one combined number, with each person's
  score underneath.

## Agree (the path)

- A fixed core path per stage. The intake stays, reworded ("what's important to
  you"), and its answers are saved; tailoring by intake is parked and will add
  steps on top of the core.
- Steps have plain names (Money, Family), not place names.
- Steps vary in length. Verses and the "at the table" prompt stay.
- Couples guess on Agree questions too; the Known result shows small.
- The Agree score is a number, built only from "agreement matters" questions.
- A question can be skipped, and shows as skipped to both. Skipping a step is a
  request to the partner and happens only if both agree.
- A finished path offers: look back over answers, do a check-in, talk about one
  topic, walk the path again (keep or change). No scheduled check-ins. A badge in
  the app marks new questions; push notifications wait for the native apps.

## Design

- **The path is The Road:** one scrolling landscape, steps along a winding road,
  the two of you standing together on the current step. Each stage gets its own
  scenery. The verse lives on the step's arrival page, not on the map.
- **The reveal is a full-screen ceremony** in the claret room, in three beats:
  the two of you come together; each question lands one at a time with its tick
  animating; then the result card.
- **The result card** arrives face down and flips over; the score counts up from
  zero. From 90% the face-down card rockets up from the bottom first.
- **Card finish:** bright milk frost for every score under 100; the gold-line
  card at 100%. The card on the reveal is always that default and never
  changes. The choice belongs to sharing only: at 100% the share sheet offers
  gold line, gilded, and claret and gold, and the choice sets the look of the
  shared image.
- **The card shows:** the two of you, the number, "agreed on {step}", agreed /
  to talk about, and the guesses result. "Based on N questions you both
  answered" and "Not a verdict: a place to start talking." sit on the See your
  answers screen.
- **Celebration levels**, all drawn behind the card, never over it:
  0–40 lanterns; 41–60 embers and a ripple; 61–80 daybreak (rays, confetti,
  first fireworks); 81–99 lift-off (hyperspeed stars, flash, shockwaves,
  cannons, fireworks); 100 glory (all of it, dawn, petals, a longer finale).
  This replaces the design-system rule "never animate a low score": a low score
  gets a quiet, warm moment.
- GSAP sequences the moving elements; particles are drawn on canvas.
- Sound and haptics are to be added with the native apps.

## Launch and data

- French is parked; new questions fall back to English.
- Existing testers start fresh when the split ships. Ask Dave before deleting
  any data.
- Privacy and terms changes (friends wording, 18+) are drafted for Dave's review.

## Parked

Multiple sessions per person; intake tailoring; French; push notifications.

## Order of work

1. Voice guide (first version done).
2. Path and reveal design (done as prototypes).
3. Sort the bank (first pass done; Dave reviewing the borderline calls).
4. New Know topics.
5. Friends questions. 6. Married questions. 7. Relationship and engaged.
8. Lay out the three paths.
9. Bank structure. 10. Split the app. 11. Onboarding. 12. Path features.
13. The Road. 14. Results and reveals. 15. Stage change. 16. Server and rules.
17. Privacy and terms. 18. Full test. 19. Start fresh and go live.
