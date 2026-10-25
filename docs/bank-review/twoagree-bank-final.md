# TwoAgree question bank — change-set for Claude Code

**456 active questions, 17 retired.**

## The one thing that matters most

Saved answers are keyed by question ID. Of the 182 questions whose wording this change-set
replaces, **only 13 can safely keep their ID.** The other 169 must get a new ID and have
the old one retired, because either the answer format changed or the option list changed —
so a stored answer of "option 2" would now point at a different choice.

Every question in section 2 is tagged `KEEP ID` or `NEW ID` for exactly this reason. The 13
safe ones are all OPEN questions with no options to shift.

| | Count |
|---|---|
| Replacements safe to keep their ID | 13 |
| Replacements needing a new ID, old one retired | 169 |
| Questions retired outright | 17 |
| Follow-ups to add | 121 |
| Brand new questions to add | 73 |

That is a large share of a 399-question live bank changing identity. Worth deciding
deliberately whether to ship it in one branch or stage it across releases.

## Also read

**This covers 271 of the repo's ~399 questions.** Roughly 128 repo questions are not
mentioned here at all and must be left untouched. This is a per-ID patch, not a replacement
bank.

**The category field is stale.** It uses the workbook's 19 categories; the repo has 21
parts with its own names, at least one of which (`where-we-are-now`) has no counterpart
here. Every category line below is marked advisory. Resolve the mapping against the repo's
own config first, and do not move an existing question into a different part — couples may
already have opened it.

**Status values.** The repo schema holds only `Draft` or `Approved`, so the `Reviewed` state
I had been using is gone. Everything here is `Approved` except the 7 questions whose wording
is mine rather than Dave's, which stay `Draft` until he has read them.

Follow-up IDs are written `PARENT#fu1`. Assign real IDs in the repo's own scheme.

## Decisions already made — do not re-ask

- **RANK questions are guessable.** The workbook and `PROJECT-KNOWLEDGE.md` disagreed; the
  workbook wins. 40 RANK questions flipped to `Guessable: Yes`. 416 guessable, 40 not.
- **`US-001`'s options are replaced** to measure lived day-to-day fit (communication, energy,
  humour, pace, money in practice, free time, tidiness), separating it from `US-021`, which
  ranks values and character.
- **`NEW-muvgxb0d` replaces `ROLE-004`**; ROLE-004 is retired.
- **Three questions re-parented:** `NEW-muvgpv54` follows `ROLE-002`, `CONF-005` follows
  `CONF-006`, `SELF-005#fu1` follows `SELF-008`.
- **`FIN-009`'s ladder reversed** to run spender → saver, matching `FIN-006`. They ran
  opposite ways, so a consistent answerer scored as contradicting themselves.
- **`FIN-010#fu1` given real options** in place of the literal "Options: 1 = ..." string.

## Scoring — code, not data

**1. `US-018` and `FIN-005#fu1` must be scored mirrored, not matched.** Their options are
self-referential ("I give more" / "you give more"; "Mainly me" / "Mainly you"). Two
partners who both pick option 1 are asserting opposite facts. Matching answers there mean
disagreement; mirrored answers mean agreement. Needs a per-question flag the scorer reads.

**2. The weighting layer is retired.** Four of the six old "How important is it that we
agree on X" questions were rewritten into content questions; only `FAITH-014` and `FAM-004`
still read as weighters. Weight parts from config instead, scaled by each partner's ranking
in `US-022#fu1`. If the scoring code still reads those six IDs, it loses its weighting
silently.

**3. Never serve `HEALTH-005`, `HEALTH-006`, `NEW-muvmkn7r` and `NEW-muvmjt5v` in one
session.** Different scopes, but asked together a person writes the same disclosure four
times.

## Wording that is mine, not Dave's — these 7 stay Draft

- `CONF-019#fu2` — When you realise mid-disagreement that you're the one in the wrong, what do you usually do?
- `NEW-muvi9ve1` — What do you believe about speaking in tongues specifically?
- `CONF-001#fu1` — How do you most like to feel loved by your partner?
- `SELF-007#fu1` — How much do worries about the future occupy your thoughts?
- `VAL-004` — When, if ever, do you believe divorce can be morally or biblically acceptable?
- `FIN-010#fu1` — How important is it that we're aligned on money?
- `US-001` — What matters most to you for two people to feel truly compatible? Rank these from most important to least important.

Also edited to remove a defect while keeping Dave's intent: `NEW-muvjiu11`, `NEW-muvjmpje`,
`NEW-muvi50d4`, `INT-006`, `CONF-015`, `NEW-muvguf5h`, `DREAM-006`, `NEW-muwovpk0`, `FIN-009`.

## 1. Retire (17)

Retire rather than delete — couples may have answered these and need them readable in past
reveals.

- `CONF-007#fu1` — How comfortable are you with your partner taking a trip alone?
- `CONF-009` — Rank these from most to least how you give and receive love.
- `CONF-028` — Should partners point out each other's blind spots?
- `FAITH-035` — Do you own your spiritual growth, or would you lean on your partner to lead you?
- `HEALTH-009#fu1` — If our sleep schedules were different, what would matter most to you?
- `HEALTH-010#fu1` — How important is it to you that your partner continues making an effort with their appearance during a long-term relationship?
- `INLAW-007` — As a couple, how much should we make big decisions on our own versus with our parents' input?
- `NEW-muqr2tlh` — If we faced an important decision, prayed about it, sought wise counsel and still genuinely disagreed, what should happen?
- `NEW-muvhgq1k` — When Christians disagree about what a Bible passage means, what should carry the most weight for us?
- `NEW-muvhptqs` — Do you believe God created humans as ONLY man & woman?
- `NEW-muvi4s2w` — How would you want us to handle baptism if we disagreed about what to do with our children?
- `NEW-muycw6wi` — Note to claude - Delete this question - its not letting me delete it
- `ROLE-003#fu1` — If we faced a major decision and still couldn't agree after talking and praying about it, what should we do?
- `ROLE-004` — How strongly do you believe the husband should carry primary responsibility for financially providing for the family? — replaced by `NEW-muvgxb0d`
- `THEO-008` — How important is it that we share the same denomination or church tradition?
- `US-012` — What life experiences would you hope your future spouse had had - and which would you hope they hadn't?
- `VAL-009` — How do you hold creation and evolution together - or not?

## 2. Replace the wording of these 182 questions

Each block is tagged. **`KEEP ID`** — options untouched, stored answers stay valid.
**`NEW ID`** — mint a new ID and retire the old one; the reason is given, and the previous
wording is shown so you can confirm.

### In the Home — 5

### HOME-001 — **NEW ID** (option count changed 4 → 5)
`HOME-001` · HHB · Level 1 (Warm-up) · part (advisory): In the Home · Guessable: Yes · Approved

How would you want us to divide the cooking at home?

- Mostly him
- Mostly her
- Split roughly equally
- Whoever enjoys it or is better at it
- Whoever has more time

Previously: *Who does most of the cooking in your home?*
Previous options: Mostly him | Mostly her | Both equally | We share by meal or day

### HOME-002 — **NEW ID** (format changed HHB → MC)
`HOME-002` · MC · Level 1 (Warm-up) · part (advisory): In the Home · Guessable: Yes · Approved

How would you want us to divide household chores?

- Split them roughly equally
- Divide them based on what each person prefers
- Divide them based on who is better at each task
- Whoever has more time does more
- Keep it flexible and adjust as life changes

Previously: *Who would own most of the household chores?*
Previous options: Mostly him | Mostly her | Split evenly | We'll trade off

### HOME-003 — **NEW ID** (option text changed)
`HOME-003` · MC · Level 1 (Warm-up) · part (advisory): In the Home · Guessable: Yes · Approved

What would you ideally want when it comes to pets in our home?

- A dog
- A cat
- More than one type of pet
- No pets
- I'm flexible

Previously: *How do you feel about pets at home - and are you more of a dog or a cat person?*
Previous options: Dogs | Cats | Both | Neither | Depends on the pet

### HOME-004 — **NEW ID** (option count changed 4 → 5)
`HOME-004` · MC · Level 2 (Everyday) · part (advisory): In the Home · Guessable: Yes · Approved

Where would you most want us to build our life long-term?

- In a city
- In the suburbs
- In a small town
- Somewhere rural or quiet
- I'm open to wherever life takes us

Previously: *Where do you picture us putting down roots - city, suburbs, or somewhere quieter?*
Previous options: City | Suburbs | Rural / small town | Open to wherever

### HOME-005 — **NEW ID** (option count changed 1 → 5)
`HOME-005` · SCALE · Level 2 (Everyday) · part (advisory): In the Home · Guessable: Yes · Approved

How open would you want our home to be to friends, family and people from our community?

- Mostly private — home would mainly be our space
- Occasionally welcoming people in
- A balance of privacy and hospitality
- Regularly having people over
- Very open — I'd love our home to be a place people regularly gather

Previously: *How open and hospitable do you want our home to be to others?*
Previous options: 1 = Our home is our private space ... 5 = Always open to others

### Finances & Money — 15

### FIN-001 — **NEW ID** (option count changed 3 → 5)
`FIN-001` · MC · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

How would you want us to organise our money in marriage?

- Everything combined
- Mostly combined, with some personal money
- Joint money for shared expenses, with separate personal money
- Mostly separate finances
- I’m not sure yet

Previously: *Should a married couple combine their finances fully, keep them separate, or a mix?*
Previous options: Fully combined | Fully separate | Mix of joint and personal

### FIN-002 — **NEW ID** (format changed SCALE → MC)
`FIN-002` · MC · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

Which best describes your attitude towards taking on debt?

- I would avoid debt whenever possible
- I would only use debt for major needs, such as buying a home
- I’m comfortable with some debt if there is a clear plan to repay it
- I’m comfortable using debt when it makes financial sense
- It depends heavily on the type of debt

Previously: *How do you feel about debt?*
Previous options: 1 = Avoid debt entirely ... 5 = Comfortable carrying it

### FIN-003 — **NEW ID** (format changed SCALE → MC)
`FIN-003` · MC · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

How financially transparent should we be with each other?

- Some financial things can stay personal
- Most things should be shared
- We should know the important things
- We should be very open about our finances
- We should have complete transparency about income, debt, savings and spending

Previously: *How financially open should we be with each other?*
Previous options: 1 = Keep some things private ... 5 = Fully transparent

### FIN-005 — **NEW ID** (option count changed 4 → 5)
`FIN-005` · MC · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

How would you want us to manage our day-to-day finances?

- Both of us actively manage everything together
- One person leads, but we regularly review things together
- We divide different financial responsibilities between us
- One person handles most of the finances
- Keep it flexible depending on our circumstances

Previously: *How should we manage money day to day?*
Previous options: One shared budget we both follow | Mostly one of us manages it | Loose, no strict budget | Still figuring it out

### FIN-006 — **NEW ID** (option count changed 1 → 5)
`FIN-006` · SCALE · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

How much would you want us to prioritise saving for the future over enjoying our money now?

- Mostly enjoy it now
- Lean towards enjoying it now
- Balance both equally
- Lean towards saving for the future
- Strongly prioritise the future

Previously: *How much do you prioritise saving for the long term?*
Previous options: 1 = Live for today ... 5 = Save aggressively for the future

### FIN-007 — **NEW ID** (option count changed 4 → 5)
`FIN-007` · MC · Level 4 (Vulnerable) · part (advisory): Finances & Money · Guessable: Yes · Approved

How would you feel about having a prenuptial agreement?

- Strongly against it
- Uncomfortable with it, but willing to discuss it
- Neutral
- Open to it if there were good reasons
- I would actively want one

Previously: *How do you feel about a prenuptial agreement?*
Previous options: Want one | Open to one | Prefer not | Strongly against

### FIN-008 — **NEW ID** (option count changed 4 → 5)
`FIN-008` · MC · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

How much responsibility do you think we should have to financially help parents or close family when they are struggling?

- Our own household should come first — helping would be rare
- Help occasionally when we comfortably can
- Try to help when there is a genuine need
- Make supporting family an important responsibility
- We should make significant sacrifices to help family when needed

Previously: *Beyond any children, who should our will provide for?*
Previous options: Just us and our kids | Extended family too | Church or charity too | Haven't thought about it

### FIN-009 — **NEW ID** (option count changed 1 → 5)
`FIN-009` · SCALE · Level 1 (Warm-up) · part (advisory): Finances & Money · Guessable: Yes · Approved

Where do you naturally fall with money?

- Strong spender
- Mostly a spender
- A balance of saving and spending
- Mostly a saver
- Strong saver

Previously: *Be honest - are you more of a saver or a spender?*
Previous options: 1 = Saver to the bone ... 5 = Spender at heart

### FIN-010 — **NEW ID** (format changed SCALE → RANK)
`FIN-010` · RANK · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

What would financial success mean most to you? Rank these from most important to least important.

- Security and stability
- Freedom and flexibility
- Being able to give generously
- Enjoying life and experiences
- Building something for future generations

Previously: *How important is it that we're aligned on money?*
Previous options: 1 = We can differ freely ... 5 = We need to agree

### FIN-012 — **NEW ID** (option count changed 4 → 5)
`FIN-012` · RANK · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

If we regularly had money left after our main commitments, what would you most want us to do with it? Rank these from highest to lowest priority.

- Give or help others
- Save or invest it
- Support family
- Spend it on experiences and travel
- Improve our lifestyle or buy things we enjoy

Previously: *If we had money left over each month, where should most of it go?*
Previous options: Giving or serving | Saving for the future | Experiences and travel | Things we enjoy now

### FIN-013 — **NEW ID** (format changed MC → OPEN)
`FIN-013` · OPEN · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: No · Approved

What financial commitments, debts or money pressures are you currently carrying that you think I should understand?

Previously: *How much debt are you bringing into the relationship?*
Previous options: None | A small amount | A moderate amount | A significant amount

### FIN-014 — **NEW ID** (format changed MC → SCALE)
`FIN-014` · SCALE · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

As our income grows, how much would you want our lifestyle to grow with it?

- Very little — I'd rather keep life simple and use the extra elsewhere
- A little
- A balance
- Quite a lot — I'd want us to enjoy more as we earn more
- A lot — I'd want our lifestyle to reflect what we can comfortably afford

Previously: *How would you rate your credit?*
Previous options: Excellent | Good | Fair | Poor | Not sure

### FIN-015 — **NEW ID** (option count changed 1 → 5)
`FIN-015` · SCALE · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

How important would it be to you for us to have major debt under control before having children?

- Not a deciding factor
- Slightly important
- Moderately important
- Very important
- Essential to me

Previously: *Should we pay off major debt before having children?*
Previous options: 1 = Not a priority ... 5 = Essential to clear it first

### FIN-016 — **NEW ID** (format changed MC → RANK)
`FIN-016` · RANK · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

Which parts of Christian stewardship would you most want us to be intentional about? Rank them from most important to least important.

- Giving generously
- Living within our means
- Planning wisely for the future
- Being content rather than always wanting more
- Enjoying what God provides with gratitude

Previously: *How do you see the things you own?*
Previous options: Mine to enjoy as I like | Mostly mine, with some giving | God's, and I'm just the manager | Haven't really thought about it

### FIN-017 — **NEW ID** (option count changed 1 → 5)
`FIN-017` · SCALE · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

How important is it to you that we build emergency savings?

- Not very important — we can deal with problems as they come
- Slightly important
- Moderately important
- Very important
- Essential — I'd want us to build a strong financial safety net

Previously: *How important is it to you that we have a financial safety net for emergencies?*
Previous options: 1 = We'll manage problems as they come ... 5 = I want a solid emergency cushion

### Faith & Worship practice — 16

### FAITH-002 — **NEW ID** (format changed SCALE → MC)
`FAITH-002` · MC · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

Which part of your faith most shapes your everyday life?

- Prayer — how I talk to and rely on God
- Scripture — how I understand and apply God's Word
- Worship — how I express my relationship with God
- Church and community — how I grow and live out my faith with others
- How I make decisions — how my faith guides my choices and priorities

Previously: *How central is your faith to your everyday life?*
Previous options: 1 = A background part of life ... 5 = It centres everything

### FAITH-005 — **NEW ID** (format changed SCALE → MC)
`FAITH-005` · MC · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

How open would you want to be with your partner about your faith and spiritual life?

- I would keep most of it private
- I would share some things
- I would share the main things
- I would be very open
- I would want complete openness and accountability

Previously: *How open should we be with each other about our spiritual lives?*
Previous options: 1 = Keep faith private ... 5 = Fully open and accountable

### FAITH-006 — **NEW ID** (option count changed 4 → 5)
`FAITH-006` · MC · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

If you and your partner disagreed about something related to faith, how would you want to handle it?

- Talk it through — keep discussing it until we understand each other
- Study it together — look at Scripture and learn together
- Respect the difference — accept that we may not agree on everything
- Seek guidance — talk to a pastor or trusted Christian mentor
- Agree to disagree — leave the disagreement alone if it isn't something we need to resolve

Previously: *When our faith differs, how should we handle it?*
Previous options: We need to agree | Talk it through till aligned | Respect our differences | Avoid the topic

### FAITH-008 — **NEW ID** (option count changed 1 → 5)
`FAITH-008` · SCALE · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

How involved would you want your partner to be in helping you grow in your faith?

- Not involved — my faith is mainly personal
- A little involved — support me when I need it
- Moderately involved — encourage and pray with me
- Very involved — regularly encourage and challenge me
- Highly involved — actively help me grow in my faith

Previously: *How much should we shape each other's spiritual growth?*
Previous options: 1 = Faith is personal ... 5 = We should actively grow each other's

### FAITH-009 — **NEW ID** (format changed SCALE → MC)
`FAITH-009` · MC · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

How willing are you to make choices based on your faith when they go against what is normal in society?

- I would usually follow what feels normal
- I would consider my faith, but it wouldn't always decide
- It would depend on the situation
- I would usually follow my faith
- My faith would come first, even when it goes against the norm

Previously: *How willing are you to live against the cultural grain for your faith?*
Previous options: 1 = Blend in with the culture ... 5 = Stand apart for our convictions

### FAITH-010 — **KEEP ID**
`FAITH-010` · OPEN · Level 1 (Warm-up) · part (advisory): Faith & Worship practice · Guessable: No · Approved

What's been your best or most difficult experience with church?

Previously: *What's been your best experience with church - and your worst? How involved do you want to be?*

### FAITH-011 — **NEW ID** (format changed OPEN → MC)
`FAITH-011` · MC · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

When you've been through a difficult season, what has it most often done to your faith?

- Strengthened it — I've come out trusting God more
- Deepened it — I've understood God and my faith differently
- Tested it — I've had doubts or questions, but kept believing
- Made me more dependent on God — I've learned to rely on Him more
- It's been difficult to see what God was doing — I still have unanswered questions

Previously: *What has God taught you through the hard stretches - failure, waiting, loss, disappointment?*

### FAITH-012 — **KEEP ID**
`FAITH-012` · OPEN · Level 1 (Warm-up) · part (advisory): Faith & Worship practice · Guessable: No · Approved · SCORING: discussion-only

If you could ask God one question and receive a clear answer, what would you ask Him?

Previously: *If you could ask God one question, what would it be?*

### FAITH-013 — **NEW ID** (option text changed)
`FAITH-013` · RANK · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

What do you see as the most important purposes of marriage? Rank these from most important to least important.

- Building a lifelong partnership
- Growing together as people
- Growing closer to God and serving Him together
- Building and raising a family
- Love, friendship and companionship

Previously: *Rank what marriage is ultimately for.*
Previous options: Companionship | Raising a family | Faith and serving God | Growing each other | Love and romance

### FAITH-014 — **NEW ID** (option count changed 1 → 5)
`FAITH-014` · SCALE · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

How important is it to you that you and your partner agree on matters of faith?

- Not important — We can have quite different views
- Slightly important — Some differences are fine
- Moderately important — I'd want to agree on the main things
- Very important — I'd want us to share most of our beliefs
- Essential — We need to share the same core beliefs

Previously: *How important is it that we share the same faith convictions?*
Previous options: 1 = We can differ freely ... 5 = We need to agree

### FAITH-019 — **NEW ID** (option count changed 1 → 5)
`FAITH-019` · SCALE · Level 4 (Vulnerable) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

When your relationship and your time with God compete for your attention, which would you usually prioritise?

- My relationship — I'd usually prioritise time with my partner
- Mostly my relationship — I'd usually choose my partner, but it depends
- It depends — I would decide based on the situation
- Mostly my time with God — I'd usually make space for God first
- My time with God — I'd prioritise time with God even when my relationship needs attention

Previously: *When your time with God and time with your partner compete for the same hour, which usually wins?*
Previous options: 1 = The relationship usually wins ... 5 = God always comes first

### FAITH-023 — **NEW ID** (option text changed)
`FAITH-023` · MC · Level 4 (Vulnerable) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved · SCORING: discussion-only

How do you think spiritual leadership should work in the home?

- The husband should take the lead
- The wife should take the lead
- Leadership should be shared equally
- It should depend on the situation
- We should lead together rather than one person taking the lead

Previously: *Who should take the lead in prayer and spiritual life in the home?*
Previous options: The husband | The wife | Whoever feels led in the moment | We take turns | Always together, no one leads

### FAITH-027 — **NEW ID** (format changed SCALE → MC)
`FAITH-027` · MC · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

Which best describes your relationship with God at the moment?

- I'm in a dry season — I feel distant or spiritually disconnected
- I'm finding my way — I'm seeking God, but my faith feels unsettled
- I'm steady — My relationship with God feels consistent
- I'm growing — I feel like my faith is deepening
- I'm thriving — I feel especially close to God and engaged in my faith

Previously: *How would you rate the current state of your walk with God?*
Previous options: 1 = In a dry season ... 5 = Thriving

### FAITH-029 — **NEW ID** (option count changed 4 → 5)
`FAITH-029` · MC · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

When Scripture challenges something you currently believe or want, what are you most likely to do?

- Change my view to align with Scripture
- Work through it carefully before changing my view
- Question whether I've understood the passage correctly
- Hold my current position unless I'm convinced otherwise
- I'm unsure

Previously: *When you read Scripture that challenges your own thinking or desires, what's your usual response?*
Previous options: I adjust my view to fit Scripture | I wrestle, but usually submit | I look for another interpretation | I follow my own conviction

### FAITH-032 — **NEW ID** (option count changed 5 → 6)
`FAITH-032` · MC · Level 1 (Warm-up) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

How would you most like to serve in church?

- Teaching or leading — teaching, leading groups or helping others grow
- Caring for people — welcoming, supporting or helping others
- Behind the scenes — practical help, organising or technical roles
- Outreach — serving the community or sharing the faith with others
- Worship or creative ministry — music, media or other creative roles
- I'm not sure yet

Previously: *How do you most want to serve in a church?*
Previous options: Teaching or leading | Hospitality and people | Behind the scenes | Outreach and mission | Not a priority for me

### FAITH-034 — **NEW ID** (format changed SCALE → RANK)
`FAITH-034` · RANK · Level 2 (Everyday) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

Which parts of a faith-centred home would matter most to you? Rank them from most important to least important.

- Praying together
- Reading and discussing Scripture together
- Making decisions based on our faith
- Talking openly about God and our spiritual lives
- Serving and helping others together
- Making church an active part of family life

Previously: *How central should faith be in the daily life of our home?*
Previous options: 1 = A private, personal matter ... 5 = The center of our home

### Theology & Beliefs — 8

### THEO-001 — **NEW ID** (option count changed 4 → 5)
`THEO-001` · MC · Level 3 (Deeper) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Do you believe women should serve as pastors or elders in a church?

- Yes
- No
- Women can lead in certain ministries, but pastor/elder should be reserved for a man
- It depends on how the church defines the role
- I'm still working it out

Previously: *Do you believe a woman can preach or pastor in a church?*
Previous options: Yes | No | Depends on the role | Still working it out

### THEO-002 — **NEW ID** (format changed SCALE → MC)
`THEO-002` · MC · Level 3 (Deeper) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Which best describes how you view the Bible?

- God's Word and completely trustworthy — what it teaches is true and should shape what I believe and how I live
- God's Word and trustworthy for faith and life — but some parts reflect the human authors and their time
- Inspired by God, but also shaped by human culture — so some teachings may not apply in the same way today
- An important guide to Christian faith — but I don't see it as the final authority on everything
- I'm still working out what I believe

Previously: *Theologically, where do you land?*
Previous options: 1 = Traditional / conservative ... 5 = Progressive

### THEO-003 — **NEW ID** (format changed MC → SCALE)
`THEO-003` · SCALE · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

How important is it to you that we share the same denomination or church tradition?

- Not important
- Slightly important
- I'd prefer some theological similarity
- Very important
- Essential — I'd want us firmly within the same tradition

Previously: *Can salvation be lost?*
Previous options: No - once saved, always saved | Yes, it can be lost | Not sure | Doesn't matter much to me

### THEO-004 — **NEW ID** (option count changed 3 → 5)
`THEO-004` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

How do you understand demonic influence on Christians?

- Christians can be demonically possessed and need deliverance
- Christians can experience spiritual attack or oppression, but cannot be possessed
- Demonic influence cannot affect Christians
- I don't believe in demonic influences
- I'm not sure

Previously: *Can believers be affected by spiritual oppression?*
Previous options: Yes | No | Unsure

### THEO-005 — **NEW ID** (option count changed 4 → 5)
`THEO-005` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Do you believe miraculous spiritual gifts such as tongues, prophecy and healing are still active today?

- Yes — all the gifts described in the New Testament continue today
- Yes — but they should be practised carefully and tested
- Some may continue, but I'm cautious about them
- No — miraculous sign gifts ceased after the apostolic era
- I'm still working it out

Previously: *How do you view spiritual gifts like tongues?*
Previous options: For today | Not for today | Unsure | Not important to me

### THEO-006 — **NEW ID** (option count changed 4 → 5)
`THEO-006` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Which view of the end times is closest to yours?

- Christ removes believers before a future tribulation, then later returns to reign
- Christians go through the tribulation before Christ returns to reign
- The millennium is mainly symbolic, and Christ returns once at the end
- The gospel increasingly transforms the world before Christ returns
- I haven't settled my view

Previously: *Where do you land on the end times?*
Previous options: Pre-tribulation rapture | A different rapture view | Symbolic, not literal | Haven't settled it

### THEO-009 — **NEW ID** (option count changed 4 → 5)
`THEO-009` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

When should someone normally be baptised?

- As an infant within a believing family
- Dedicated as an infant, then baptised when they personally believe
- Only after personally professing faith in Christ
- I don't have a firm view
- I'm still working it out

Previously: *Should our children be baptized as infants, or wait until they choose for themselves?*
Previous options: Baptize as infants | Dedicate now, baptize when they choose | Wait until they can decide | Unsure

### THEO-010 — **NEW ID** (option count changed 6 → 8)
`THEO-010` · RANK · Level 3 (Deeper) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Which theological issues would matter most for us to agree on? Rank them from most important to least important.

- Biblical authority
- Salvation
- Baptism
- Spiritual gifts
- Church leadership and women in ministry
- Marriage and gender roles
- Creation
- End times

Previously: *Rank which theological issues matter most for us to agree on.*
Previous options: Baptism (infant vs believer) | End times | Spiritual gifts | Women in ministry | Worship style | Predestination vs free will

### Family & Children — 8

### FAM-002 — **NEW ID** (option count changed 4 → 5)
`FAM-002` · MC · Level 4 (Vulnerable) · part (advisory): Family & Children · Guessable: Yes · Approved

If we struggled to have children naturally, how open would you be to fertility treatment?

- Very open — I would be comfortable exploring most treatment options
- Open, with limits — I would consider treatment, but some options may not be right for me
- Only as a last resort — I would want to try other approaches first
- Not very open — I would prefer not to use fertility treatment
- I'm unsure — I would need to understand the options before deciding

Previously: *If we faced fertility struggles, how open are you to reproductive medicine?*
Previous options: Fully open to treatment | Some methods only | Prefer to accept what comes | Unsure

### FAM-003 — **NEW ID** (option count changed 1 → 5)
`FAM-003` · SCALE · Level 2 (Everyday) · part (advisory): Family & Children · Guessable: Yes · Approved

How open would you be to adoption as a way of building a family?

- Not open to it
- Slightly open
- I would consider it
- Very open
- I would actively want to adopt

Previously: *How open are you to adoption?*
Previous options: 1 = Eager to adopt ... 5 = Prefer not to

### FAM-005 — **NEW ID** (option count changed 4 → 5)
`FAM-005` · MC · Level 2 (Everyday) · part (advisory): Family & Children · Guessable: Yes · Approved

If we wanted children, when would you ideally want to start trying after marriage?

- Within the first year
- After 1–2 years
- After 3–5 years
- More than 5 years later
- I'm not sure yet

Previously: *How soon after marriage would you want to start trying for children?*
Previous options: Right away | Within the first year or two | After several years | We'll see how it goes

### FAM-006 — **NEW ID** (option count changed 1 → 5)
`FAM-006` · SCALE · Level 2 (Everyday) · part (advisory): Family & Children · Guessable: Yes · Approved

How important is having biological children to you personally?

- Not important — I'm equally open to other ways of building a family
- Slightly important
- I would prefer biological children, but I'm flexible
- Very important
- Essential to me

Previously: *How important is it to you to have biological children specifically?*
Previous options: 1 = Any path to family is equal ... 5 = Biological children matter a lot

### FAM-007 — **NEW ID** (option count changed 1 → 5)
`FAM-007` · SCALE · Level 2 (Everyday) · part (advisory): Family & Children · Guessable: Yes · Approved

How important would it be to you for our children to grow up living near extended family?

- Not important — we could live wherever works for us
- Slightly important
- Nice to have, but not a deciding factor
- Very important
- A major priority — I'd want family nearby

Previously: *How important is it that our children grow up close to extended family?*
Previous options: 1 = Wherever life takes us ... 5 = Near family really matters

### FAM-008 — **NEW ID** (option count changed 4 → 5)
`FAM-008` · MC · Level 4 (Vulnerable) · part (advisory): Family & Children · Guessable: Yes · Approved

If one of us wanted another child and the other didn't, how should we handle it?

- We shouldn't have another child unless we both agree
- Keep talking until we reach a decision together
- Pause the decision and revisit it later
- Seek advice or counselling to help us decide
- I'm not sure how we should handle it

Previously: *If we disagreed about having more children, how should we handle it?*
Previous options: Keep talking until we agree | Defer to whoever feels strongest | The one who wants fewer decides | We'd seek outside help

### FAM-009 — **NEW ID** (format changed SCALE → MC)
`FAM-009` · MC · Level 2 (Everyday) · part (advisory): Family & Children · Guessable: Yes · Approved

How actively should parents guide their children's faith?

- Give them freedom — let them explore and decide what they believe
- Introduce them to the faith — but avoid strongly directing them
- Teach them the faith — while encouraging questions and personal choice
- Actively guide them — make faith an important part of their upbringing
- Make faith central — intentionally disciple them at home and through church

Previously: *How important is it to raise our children in the faith?*
Previous options: 1 = Let them choose freely ... 5 = Essential to raise them in it

### FAM-010 — **NEW ID** (format changed SCALE → MC)
`FAM-010` · MC · Level 2 (Everyday) · part (advisory): Family & Children · Guessable: Yes · Approved

How involved would you want grandparents to be in the day-to-day raising of our children?

- Limited involvement — loving relationship, but we handle the parenting
- Occasional involvement — help or advice from time to time
- Regular support — involved often, but we make the parenting decisions
- Very involved — regularly helping with care and family life
- A major role — closely involved in helping us raise the children

Previously: *How involved should grandparents be in raising our children?*
Previous options: 1 = Minimal, we parent ... 5 = Very involved

### Parenting style — 7

### PAR-001 — **NEW ID** (option text changed)
`PAR-001` · RANK · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

What matters most to you in raising our children? Rank these from most important to least important.

- Faith and knowing God
- Character and integrity
- Discipline and self-control
- Emotional security
- Independence and resilience
- Education and achievement

Previously: *Rank what matters most in raising children.*
Previous options: Faith | Discipline | Independence | Kindness | Education | Emotional security

### PAR-002 — **NEW ID** (option count changed 1 → 5)
`PAR-002` · SCALE · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

How much would you want us to parent our children the way you were raised?

- Very differently
- Mostly differently
- Some things the same, some different
- Mostly the same
- Very similarly

Previously: *How much would you parent the way you were raised?*
Previous options: 1 = Very differently from how I was raised ... 5 = Much the same

### PAR-003 — **NEW ID** (option count changed 4 → 5)
`PAR-003` · MC · Level 4 (Vulnerable) · part (advisory): Parenting style · Guessable: Yes · Approved

If one of our children seriously questioned or rejected the Christian faith, how strongly should we continue directing them towards it?

- Give them freedom to decide what they believe without pressure
- Mostly give them space, but remain available
- Keep discussing and encouraging faith without forcing it
- Actively guide them and involve trusted Christian mentors
- Continue clear Christian expectations in our home while actively discipling them

Previously: *If a child questions their faith, how should we respond?*
Previous options: Gently guide them back | Let them explore freely | Step in with concern | Trust the foundation we laid

### PAR-004 — **NEW ID** (option count changed 1 → 5)
`PAR-004` · SCALE · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

When our child repeatedly disobeys, what should our normal approach to discipline be?

- Clear rules with consistent consequences
- Firm correction, explanation and restoration
- Natural or logical consequences wherever possible
- Mainly conversation and coaching, with punishment used rarely
- Adjust our approach depending on the child and situation

Previously: *Where does your discipline style fall?*
Previous options: 1 = Firm and structured ... 5 = Gentle and relational

### PAR-005 — **NEW ID** (option count changed 4 → 5)
`PAR-005` · MC · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

Do you believe physical discipline, such as spanking, should ever be used with our children?

- Yes — it can be a normal part of discipline
- Yes — but only rarely or for serious/repeated disobedience
- Possibly — but I'd want us to be very cautious about it
- No — I wouldn't want us to use physical discipline
- I'm unsure

Previously: *How do you feel about spanking as a form of discipline?*
Previous options: For it | In some situations | Against it | Unsure

### PAR-006 — **NEW ID** (option count changed 4 → 5)
`PAR-006` · MC · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

How would you ideally want us to educate our children?

- Homeschool
- Christian or faith-based school
- Public/state school
- Private school without a particular faith basis
- Decide separately based on what suits each child

Previously: *How would you want to educate our children?*
Previous options: Homeschool | Christian or faith-based school | Public school | Whatever suits each child

### PAR-007 — **NEW ID** (option count changed 1 → 5)
`PAR-007` · SCALE · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

How much should we intentionally protect our children from parts of mainstream culture that conflict with our Christian beliefs?

- Very little — teach discernment while allowing broad exposure
- Some boundaries
- A balance of protection and exposure
- Strong boundaries around influences that conflict with our faith
- Very strong boundaries — deliberately keep them separate from many mainstream influences

Previously: *How set apart from mainstream culture do you want to raise our children?*
Previous options: 1 = Fully part of the culture ... 5 = Deliberately set apart

### Intimacy & Physical — 9

### INT-002 — **NEW ID** (option count changed 4 → 5)
`INT-002` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

What is your conviction about kissing before marriage?

- I would prefer no kissing before marriage
- Brief kissing is fine
- Kissing is fine, but with clear limits
- I don't believe kissing itself needs a boundary
- I'm still working out my boundary

Previously: *What should our physical boundaries be before marriage?*
Previous options: Save all physical intimacy for marriage | Some affection with clear limits | Comfortable being physically close | Still discussing

### INT-003 — **NEW ID** (option count changed 1 → 5)
`INT-003` · SCALE · Level 3 (Deeper) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

How important is strong physical attraction to you in a marriage?

- Not particularly important
- Slightly important
- Moderately important
- Very important
- Essential — I need strong physical attraction to my spouse

Previously: *How much does physical attraction factor into a relationship for you?*
Previous options: 1 = Not much ... 5 = Very much

### INT-004 — **NEW ID** (option count changed 4 → 6)
`INT-004` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

Where would you first consider someone to have crossed a line of faithfulness in marriage?

- Deliberately flirting with someone else
- Building a private emotional closeness that is hidden from their spouse
- Sending romantic or sexual messages
- Kissing someone else
- Sexual touching or sexual activity
- Only having sex with someone else

Previously: *Where does crossing the line begin for you?*
Previous options: Any flirting | Emotional closeness with someone else | Only physical contact | We should define it together

### INT-005 — **NEW ID** (option count changed 1 → 5)
`INT-005` · SCALE · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

How comfortable would you want us to be talking openly about sex with each other?

- I'd find those conversations very difficult
- Somewhat uncomfortable
- Comfortable discussing the important things
- Very comfortable
- Completely open — nothing about our sex life should be difficult to discuss

Previously: *How comfortable are you talking openly about sex?*
Previous options: 1 = Very uncomfortable ... 5 = Very comfortable

### INT-006 — **NEW ID** (option count changed 4 → 5)
`INT-006` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: No · Approved

What is your conviction about pornography within marriage?

- It is sinful and should have no place in marriage
- It is wrong and damaging to a marriage
- I dislike it, but wouldn't treat all use as a serious moral issue
- I think it can be acceptable if both spouses agree
- I'm unsure what I believe

Previously: *How do you view pornography in a marriage?*
Previous options: Never acceptable | A serious problem | Depends | Not a big deal

### INT-007 — **NEW ID** (format changed SCALE → MC)
`INT-007` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

If one of us wanted sex significantly more often than the other, how should we handle it?

- Actively work together to find a rhythm that considers both people's needs
- The person with the lower desire should make a real effort to meet the other more often
- The person with the higher desire should mainly adjust their expectations
- Seek counselling or pastoral help if the difference becomes ongoing
- It would depend on why our levels of desire were different

Previously: *How important is it that we're aligned on physical intimacy?*
Previous options: 1 = We can differ freely ... 5 = We need to agree

### INT-009 — **NEW ID** (option count changed 4 → 5)
`INT-009` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

Do you believe sex before marriage is morally wrong?

- Yes — sex should only take place within marriage
- Generally yes, but I believe there may be exceptional circumstances
- I believe sex can be appropriate within a committed relationship before marriage
- No — I don't believe marriage determines whether sex is morally right
- I'm still working out what I believe

Previously: *What's your view on sex before marriage?*
Previous options: Should be saved for marriage, no exceptions | Ideal, but grace for the past | A personal choice | Not a moral issue to me

### INT-010 — **NEW ID** (format changed SCALE → MC)
`INT-010` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: No · Approved

How much of our sexual history should we share with each other before marriage?

- Full disclosure, including previous partners and significant experiences
- Honest disclosure of the important facts, without unnecessary detail
- Only disclose things that could affect our marriage, health or trust
- I believe some parts of the past can remain private
- I'm unsure

Previously: *How open are you to fully sharing your sexual history before marriage?*
Previous options: 1 = I'd rather keep my past private ... 5 = Fully open about it

### INT-011 — **NEW ID** (option count changed 4 → 5)
`INT-011` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

If one of us was repeatedly struggling with sexual temptation, what should our first response be?

- Tell each other honestly and work through it together
- Tell each other and also involve a trusted Christian mentor or accountability partner
- Seek outside accountability first, then tell the partner if the struggle continues
- Handle it privately unless it starts affecting the relationship
- I'm unsure

Previously: *If one of us struggles with sexual temptation or pornography, what should we do?*
Previous options: Always tell each other | Tell a mentor or accountability partner | Handle it privately | Unsure

### Roles & Responsibilities — 4

### ROLE-001 — **NEW ID** (option count changed 4 → 5)
`ROLE-001` · MC · Level 3 (Deeper) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved · SCORING: discussion-only

How do you believe leadership should work in our marriage?

- The husband should take primary leadership responsibility
- We should lead together as equal partners
- Leadership should depend on the area and who is best suited to it
- Neither of us should have a defined leadership role
- I'm still working out what I believe

Previously: *How do you see roles and leadership working in a marriage?*
Previous options: Husband leads, wife supports | Mutual submission, equal partners | No fixed roles | Still working it out

### ROLE-002 — **NEW ID** (option count changed 3 → 5)
`ROLE-002` · MC · Level 3 (Deeper) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

If we have young children, what would you ideally want the mother's role to look like?

- Primarily stay at home — caring for the children and home would be her main role
- Mostly stay at home — perhaps working part-time or flexibly
- Work if she wants to — but motherhood and home should take priority
- Continue her career — childcare and home responsibilities should be shared
- It depends on our circumstances

Previously: *How do you imagine balancing work and home - would either of us want to stay home, especially with kids?*
Previous options: One of us stays home | Both of us work | Depends on the season of life

### ROLE-003 — **NEW ID** (option count changed 1 → 5)
`ROLE-003` · SCALE · Level 3 (Deeper) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

If we faced an important decision, prayed about it, sought wise counsel and still genuinely disagreed, what should happen?

- The husband should make the final decision
- We should wait until we both agree
- The person with greater knowledge or responsibility in that area should decide
- It depends on the decision
- I'm not sure

Previously: *How important is it that we agree on marriage roles and responsibilities?*
Previous options: 1 = We can differ freely ... 5 = We need to agree

### ROLE-005 — **NEW ID** (format changed SCALE → MC)
`ROLE-005` · MC · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

What do you believe the husband's headship in marriage should mean in practice?

- He has final responsibility for leading the family
- He leads, while actively seeking and valuing his wife's input
- He leads mainly through service, sacrifice and protection rather than authority
- Husband and wife should share leadership equally
- I don't believe husbands have a distinct leadership role
- I'm still working this out

Previously: *How literally do you take 'the husband is the head of the home'?*
Previous options: 1 = Symbolic, we share leadership ... 5 = Literal male headship

### Conflict & Communication — 19

### CONF-001 — **NEW ID** (option text changed)
`CONF-001` · MC · Level 1 (Warm-up) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How do you most naturally show someone you love them?

- Through words — I tell them and encourage them
- Through time — I make time to be with them
- Through actions — I help and do things for them
- Through gifts — I give thoughtful things
- Through affection — I show it physically

Previously: *How do you most naturally give and receive love?*
Previous options: Words of affirmation | Quality time | Acts of service | Gifts | Physical touch

### CONF-003 — **NEW ID** (option count changed 4 → 5)
`CONF-003` · RANK · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

When you're under stress, which of these are you most likely to do? Rank them from most to least likely.

- Pray or turn to God
- Talk it through with someone
- Take time alone
- Keep going and deal with it myself
- Become more easily frustrated

Previously: *Rank how you react under stress, most like you first.*
Previous options: Withdraw and go quiet | Talk it out | Power through alone | Get irritable

### CONF-004 — **NEW ID** (option count changed 1 → 5)
`CONF-004` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How confident do you feel about handling the challenges that marriage may bring?

- Not confident at all
- Slightly confident
- Moderately confident
- Very confident
- Completely confident

Previously: *How anxious do you feel about marriage?*
Previous options: 1 = Completely at ease ... 5 = Quite anxious

### CONF-007 — **NEW ID** (option count changed 1 → 5)
`CONF-007` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How comfortable are you with your partner taking a trip with friends without you?

- Not comfortable at all
- Slightly uncomfortable
- It depends on the trip
- Mostly comfortable
- Completely comfortable

Previously: *How comfortable are you with solo trips with friends?*
Previous options: 1 = Not comfortable ... 5 = Totally fine

### CONF-008 — **NEW ID** (option text changed)
`CONF-008` · RANK · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

Rank what makes you feel most respected by your partner.

- Being listened to
- Honesty
- Loyalty and commitment
- Being supported in front of others
- Having independence and personal space

Previously: *Rank what makes you feel most respected.*
Previous options: Being heard | Loyalty | Honesty | Support in public | My independence

### CONF-010 — **NEW ID** (option count changed 1 → 5)
`CONF-010` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How comfortable are you with your partner having close friendships with people of the opposite sex?

- Not comfortable at all
- Slightly uncomfortable
- It depends on the friendship
- Mostly comfortable
- Completely comfortable

Previously: *How comfortable are you with close opposite-sex friendships after marriage?*
Previous options: 1 = Not comfortable ... 5 = Completely fine

### CONF-011 — **NEW ID** (option text changed)
`CONF-011` · RANK · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

Rank these communication styles from most to least like you.

- Direct and straightforward
- Talk things through in detail
- Quiet and prefer to think before speaking
- Expressive and talkative

Previously: *Rank these communication styles from most to least like you.*
Previous options: Direct and to the point | Detailed processor | Quiet and internal | Expressive and talkative

### CONF-013 — **NEW ID** (option text changed)
`CONF-013` · MC · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

When you are in a conflict, what are you most likely to do?

- Try to resolve it straight away
- Take some time and step away
- Focus on getting my way
- Give in to avoid making things worse
- Look for a compromise

Previously: *In the heat of conflict, which is your reflex?*
Previous options: Give in | Withdraw | Push to win | Compromise | Work it through

### CONF-014 — **NEW ID** (option count changed 1 → 5)
`CONF-014` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How do you usually respond when your partner says no to something you want?

- I find it very difficult
- I find it somewhat difficult
- It depends on the situation
- I usually handle it well
- I accept it easily

Previously: *How well do you handle hearing 'no' from a partner?*
Previous options: 1 = I struggle with it ... 5 = I take it easily

### CONF-017 — **NEW ID** (option count changed 1 → 5)
`CONF-017` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

What kind of atmosphere would you want in our home?

- Calm and quiet
- Mostly calm
- A balance of calm and lively
- Mostly lively
- Lively and energetic

Previously: *How calm or high-energy do you want our home environment to feel?*
Previous options: 1 = Calm and quiet ... 5 = Lively and high-energy

### CONF-018 — **NEW ID** (option count changed 1 → 5)
`CONF-018` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How easily do you become angry?

- Almost never
- Not very easily
- It depends on the situation
- Fairly easily
- Very easily

Previously: *How quick is your temper?*
Previous options: 1 = Very slow to anger ... 5 = Quick-tempered

### CONF-019 — **NEW ID** (format changed SCALE → MC)
`CONF-019` · MC · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

In a disagreement, which matters more to you?

- Keeping the peace
- Finding a solution
- Being understood
- Being right
- It depends on the situation

Previously: *In a disagreement, how much does being proven right matter to you?*
Previous options: 1 = I'd rather keep the peace ... 5 = Being right matters to me

### CONF-020 — **NEW ID** (option text changed)
`CONF-020` · MC · Level 1 (Warm-up) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How much contact do you like to have with your partner during the day?

- I like to stay in contact throughout the day
- A few check-ins is enough
- One meaningful conversation is enough
- I don't need much contact during the day

Previously: *How much daily contact do you need to feel connected?*
Previous options: Constant throughout the day | A few check-ins | Once a day is plenty | We don't need daily contact

### CONF-022 — **NEW ID** (option count changed 1 → 5)
`CONF-022` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

After a disagreement, how likely are you to recognise your own part in what happened?

- Very unlikely
- Somewhat unlikely
- It depends on the situation
- Usually likely
- Very likely

Previously: *When conflict happens, how readily do you take responsibility for your part?*
Previous options: 1 = I usually feel wronged ... 5 = I quickly own my part

### CONF-023 — **NEW ID** (option count changed 1 → 5)
`CONF-023` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How comfortable are you with talking to other people about problems in your relationship?

- Not comfortable at all — I'd keep it between us
- Slightly comfortable — only with someone very close to us
- It depends on the situation
- Mostly comfortable — I'd talk to someone I trust
- Completely comfortable — I'd have no issue talking it through with others

Previously: *How okay is it to talk through our relationship problems with friends or family?*
Previous options: 1 = Keep it strictly between us ... 5 = Fine to talk it through with others

### CONF-024 — **NEW ID** (option count changed 1 → 5)
`CONF-024` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

When you're frustrated, how would you describe the way you speak?

- Very gentle and careful
- Usually gentle
- It depends on the situation
- Usually direct
- Very direct and blunt

Previously: *How gentle or blunt is your way of speaking, especially when frustrated?*
Previous options: 1 = Very gentle ... 5 = Very blunt

### CONF-025 — **NEW ID** (option count changed 1 → 5)
`CONF-025` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How important is it to you that we regularly set aside time just for each other?

- Not important — we'll spend time together naturally
- Slightly important
- Moderately important
- Very important
- Essential — we should make time even when we're busy

Previously: *How important is it to protect regular one-on-one time, no matter how busy we get?*
Previous options: 1 = We'll connect when we connect ... 5 = We must guard dedicated time

### CONF-026 — **NEW ID** (option text changed)
`CONF-026` · MC · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

When we argue, how should we handle mistakes from the past?

- Keep them out of the current argument
- Bring them up only if they're directly relevant
- Bring them up if they show a pattern
- The past is fair to discuss

Previously: *When we argue, is it fair to bring up past mistakes?*
Previous options: No, stay on the current issue | Only if directly relevant | Sometimes, patterns matter | Yes, the past is fair game

### CONF-027 — **NEW ID** (option count changed 1 → 5)
`CONF-027` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How important is it to you that your partner tells you when they notice something you may not see about yourself?

- Not important — I'd rather work things out myself
- Slightly important
- Moderately important
- Very important
- Extremely important — I want my partner to challenge me when needed

Previously: *How important is it that we point out each other's blind spots?*
Previous options: 1 = Better to let things be ... 5 = Very important

### In-Laws & Extended Family — 5

### INLAW-001 — **NEW ID** (option count changed 1 → 5)
`INLAW-001` · SCALE · Level 2 (Everyday) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

How involved would you want our extended families to be in our everyday married life?

- Quite separate — our married life would mainly be our own
- Some involvement, but with plenty of space
- A balance of family involvement and independence
- Very involved in our regular lives
- Deeply involved — I'd want family to be a major part of our everyday life

Previously: *How firm should our boundaries with extended family be?*
Previous options: 1 = Keep family very involved ... 5 = Firm boundaries

### INLAW-002 — **NEW ID** (option count changed 4 → 5)
`INLAW-002` · MC · Level 2 (Everyday) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

How would you ideally want us to divide major holidays between our families?

- Alternate between families from year to year
- Split the holiday between both families where possible
- Bring both families together
- Build our own traditions and see family around them
- Decide separately each year depending on circumstances

Previously: *How should we handle holidays between both families?*
Previous options: Alternate fairly each year | Mostly all together | Start our own traditions | Play it by ear

### INLAW-003 — **NEW ID** (option count changed 4 → 5)
`INLAW-003` · MC · Level 4 (Vulnerable) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

If one of our parents could no longer live independently, what would you ideally want us to do?

- Have them live with us
- Help them live independently nearby
- Arrange professional or supported care
- Share their care with siblings or wider family
- Not sure yet

Previously: *How should we approach caring for aging parents?*
Previous options: They live with us if needed | We support but keep separate homes | Shared with siblings | Haven't thought about it

### INLAW-004 — **NEW ID** (format changed SCALE → MC)
`INLAW-004` · MC · Level 4 (Vulnerable) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

When what your spouse wants and what your parents want genuinely conflict, whose wishes should normally come first?

- My spouse should normally come first
- My spouse should come first unless I believe they're clearly wrong
- Both should carry roughly equal weight
- My responsibilities to my parents may sometimes come first
- We should do as our parents say and honour their decisions even if we don't agree
- I'm not sure

Previously: *How ready are you to put your spouse before your parents?*
Previous options: 1 = It would be hard ... 5 = Fully ready

### INLAW-005 — **NEW ID** (option count changed 1 → 5)
`INLAW-005` · SCALE · Level 2 (Everyday) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

How important would it be to you for your spouse to have a close relationship with your family?

- Not important — respect is enough
- Slightly important
- I'd like them to get along
- Very important — I'd want genuine closeness
- Extremely important — I'd want my spouse to feel like part of my family

Previously: *How important is it to you that both our families support our relationship?*
Previous options: 1 = Not important ... 5 = Essential

### Fun & Icebreakers — 6

### FUN-001 — **NEW ID** (format changed GUESS → MC)
`FUN-001` · MC · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

If we were planning a date night, what would you most enjoy?

- Going somewhere for great food
- Doing an activity or adventure
- A cosy night in together
- Going to a show, concert or event
- Doing something spontaneous we haven't tried before

Previously: *If we could only eat one cuisine for life, which would your partner choose?*

### FUN-002 — **NEW ID** (format changed MC → SCALE)
`FUN-002` · SCALE · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

How competitive do you get when we're playing a game or competing against each other?

- I really don't care who wins
- I enjoy winning, but it's mostly just fun
- Somewhere in the middle
- I get pretty competitive
- I really want to win

Previously: *What's your ideal way to spend a free day?*
Previous options: Out adventuring | Cozy at home | With friends | Tackling projects

### FUN-003 — **NEW ID** (format changed OPEN → MC)
`FUN-003` · MC · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

What kind of humour makes you laugh the most?

- Silly and playful
- Dry or deadpan
- Clever or witty
- Teasing and banter
- Funny stories and everyday observations

Previously: *Here's everything I love doing - which of these would you secretly rather sit out?*

### FUN-004 — **NEW ID** (format changed OPEN → SCALE)
`FUN-004` · SCALE · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

How much of our free time would you want us to spend on shared hobbies versus doing our own things?

- I'd love us to do most things together
- Mostly together
- A balance of both
- Plenty of separate interests
- I'd want us both to have lots of our own hobbies

Previously: *Which shows or movies have actually shaped you - and who gets the remote?*

### FUN-005 — **NEW ID** (format changed OPEN → MC)
`FUN-005` · MC · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

How do you feel about surprises from me?

- I love being surprised
- I like small surprises, but not big ones
- I like surprises if you know it's something I'll enjoy
- I'd usually rather know what's happening
- It depends on the situation

Previously: *Surprise inheritance, money's no object - where do we live, what do you do, and am I still in the picture?*

### FUN-006 — **NEW ID** (format changed SCALE → RANK)
`FUN-006` · RANK · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

Which kinds of memories would you most want us to create together? Rank them from most important to least important.

- Trips and adventures
- Celebrations and traditions
- Food and experiences
- Shared hobbies or projects
- Serving or helping other people together
- Quiet everyday moments together

Previously: *How much of your free time do you want to spend on your own hobbies versus together?*
Previous options: 1 = Mostly together ... 5 = Lots of independent time

### Deal-breakers — 5

### DEAL-001 — **NEW ID** (option text changed)
`DEAL-001` · RANK · Level 5 (Hot-button) · part (advisory): Deal-breakers · Guessable: Yes · Approved

Which of these would be the biggest deal-breaker for you? Rank them from biggest to smallest.

- Dishonesty
- Disrespect
- Unfaithfulness
- Lack of effort
- Lack of responsibility
- Poor communication

Previously: *Rank these from most to least of a deal-breaker for you.*
Previous options: Dishonesty | Disrespect | A different faith | Addiction | Unfaithfulness | Laziness

### DEAL-002 — **NEW ID** (option count changed 7 → 8)
`DEAL-002` · RANK · Level 5 (Hot-button) · part (advisory): Deal-breakers · Guessable: Yes · Approved

What matters most to you in a partner? Rank these from most important to least important.

- Faith
- Kindness
- Loyalty
- honesty
- Attraction
- Shared goals
- Humour
- Ambition

Previously: *Rank your must-haves in a spouse, most important first.*
Previous options: Faith | Kindness | Ambition | Humour | Loyalty | Attraction | Shared goals

### DEAL-003 — **KEEP ID**
`DEAL-003` · OPEN · Level 2 (Everyday) · part (advisory): Deal-breakers · Guessable: No · Approved

What's one thing you would never be willing to give up for a relationship?

Previously: *What's one value or part of your life you'd never be willing to give up?*

### DEAL-005 — **NEW ID** (option text changed)
`DEAL-005` · MC · Level 5 (Hot-button) · part (advisory): Deal-breakers · Guessable: Yes · Approved

If your partner was unfaithful, could you stay in the relationship?

- No, that would be the end of the relationship
- I would try to work through it
- It would depend on what happened
- I would forgive them and try to rebuild the relationship

Previously: *Could you stay with someone who became unfaithful?*
Previous options: No, that's the end | I'd try to work through it | It would depend on the circumstances | I'd forgive and rebuild

### DEAL-009 — **NEW ID** (option text changed)
`DEAL-009` · MC · Level 5 (Hot-button) · part (advisory): Deal-breakers · Guessable: Yes · Approved

If your family strongly disapproved of your partner, could you still marry them?

- No, I couldn't go against my family
- I'd have serious doubts
- Yes, if I was confident in the relationship
- Yes, my family's opinion wouldn't decide it

Previously: *Could you marry someone your family strongly disapproved of?*
Previous options: No | I'd hesitate a lot | Yes, if I was sure | My family's view wouldn't decide it

### Health & Lifestyle — 9

### HEALTH-001 — **NEW ID** (option count changed 1 → 5)
`HEALTH-001` · SCALE · Level 1 (Warm-up) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

How health-conscious would you want us to be about what we eat day to day?

- Very relaxed — enjoyment and convenience matter most
- Mostly relaxed
- A balance of health and enjoyment
- Quite health-conscious
- Very health-conscious — nutrition would be a major priority

Previously: *Where do your eating habits fall?*
Previous options: 1 = Very health-focused ... 5 = Whatever tastes good

### HEALTH-002 — **NEW ID** (option count changed 4 → 5)
`HEALTH-002` · MC · Level 1 (Warm-up) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

How often would you ideally want us to make social plans with friends?

- Rarely
- A few times a month
- About once a week
- Several times a week
- It would depend on the season of life

Previously: *How often do you like to see friends - what's your ideal social rhythm?*
Previous options: Rarely | A few times a month | Weekly | Several times a week

### HEALTH-003 — **NEW ID** (option count changed 1 → 5)
`HEALTH-003` · SCALE · Level 1 (Warm-up) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

How active would you ideally want our lifestyle to be?

- Mostly relaxed — exercise wouldn't be a big part of our lifestyle
- Lightly active
- A balance of activity and relaxation
- Very active
- Fitness and physical activity would be a major part of our lifestyle

Previously: *How do you feel about tattoos?*
Previous options: 1 = Against them ... 5 = Love them

### HEALTH-004 — **NEW ID** (option count changed 4 → 5)
`HEALTH-004` · MC · Level 2 (Everyday) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

What would you ideally want alcohol to look like in our life together?

- No alcohol
- Only occasionally or on special occasions
- Social drinking in moderation
- Regular drinking is fine in moderation
- I don't have a strong preference

Previously: *What's your relationship with alcohol, and what would you want it to look like in our home?*
Previous options: I don't drink | Occasionally / socially | Regularly | I'd prefer an alcohol-free home

### HEALTH-005 — **KEEP ID**
`HEALTH-005` · OPEN · Level 4 (Vulnerable) · part (advisory): Health & Lifestyle · Guessable: No · Approved

Is there anything about your physical or mental health, past or present, that you think I should understand?

Previously: *If you were filling out a health history with me, what should I know - past and present?*

### HEALTH-006 — **KEEP ID**
`HEALTH-006` · OPEN · Level 4 (Vulnerable) · part (advisory): Health & Lifestyle · Guessable: No · Approved

Is there anything in your past or present relationship with substances or addictive habits that you think I should understand?

Previously: *What's your history and current relationship with alcohol or other substances?*

### HEALTH-007 — **NEW ID** (option count changed 4 → 5)
`HEALTH-007` · MC · Level 2 (Everyday) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

When you're ill or feeling unwell, how would you most want me to care for you?

- Give me space and let me rest
- Look after me and fuss over me
- Check on me occasionally, but don't overdo it
- Keep me company
- Ask me what I need at the time

Previously: *When you're sick, how do you most want to be treated?*
Previous options: Left alone to rest | Cared for and fussed over | Checked on lightly | Kept company and distracted

### HEALTH-008 — **NEW ID** (format changed MC → SCALE)
`HEALTH-008` · SCALE · Level 1 (Warm-up) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

How important would it be to you that we regularly put our phones away when we're spending time together?

- Not important
- Slightly important
- Moderately important
- Very important
- Essential — I'd want regular phone-free time together

Previously: *How much of your day goes to screens and your phone, and how would that flex in a marriage?*
Previous options: Barely any | A moderate amount | A lot - it's my work | More than I'd like

### HEALTH-010 — **NEW ID** (format changed SCALE → MC)
`HEALTH-010` · MC · Level 1 (Warm-up) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

If our sleep schedules were different, what would matter most to you?

- Going to bed together most nights
- Waking up together when possible
- Having some shared evening time
- Having some shared morning time
- We're fine keeping different schedules

Previously: *How much do you prioritise personal grooming and self-care?*
Previous options: 1 = Low-maintenance ... 5 = Very particular about it

### Dreams & Future — 3

### DREAM-002 — **NEW ID** (option count changed 4 → 5)
`DREAM-002` · MC · Level 1 (Warm-up) · part (advisory): Dreams & Future · Guessable: Yes · Approved

How much would you ideally want travel to be part of our life together?

- Rarely — I'd mostly prefer life at home
- 1–2 trips a year
- 3–4 trips a year
- 5+ trips a year
- As often as time and money allow

Previously: *How often would you love for us to travel in a typical year?*
Previous options: Rarely | 1-2 times a year | 3-4 times a year | As often as we can

### DREAM-005 — **NEW ID** (format changed OPEN → MC)
`DREAM-005` · MC · Level 2 (Everyday) · part (advisory): Dreams & Future · Guessable: Yes · Approved

Ten years from now, which would you most want to have achieved?

- A strong family life — a close, loving home and family
- Financial freedom — enough money to have real choices about how I live
- Meaningful work — work that gives me purpose and satisfaction
- A deeper faith — a stronger relationship with God and a more mature faith
- More freedom and adventure — the time and freedom to travel, explore and enjoy life

Previously: *Ten years out, where do you want to be - in your heart, your faith, and your finances?*

### DREAM-006 — **KEEP ID**
`DREAM-006` · OPEN · Level 1 (Warm-up) · part (advisory): Dreams & Future · Guessable: No · Approved

If we get married, I would love for us to…
Complete the sentence with a few things you would love for us to experience, build or do together.

Previously: *Finish this a few times: 'If we marry, I would love for us to...'*

### Past & Baggage — 11

### PAST-001 — **KEEP ID**
`PAST-001` · OPEN · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: No · Approved

Is there anything from your past that still affects how you trust, communicate, handle conflict, intimacy, family or faith today?

Previously: *Is there anything from your past you're still working through or healing from?*

### PAST-002 — **NEW ID** (format changed OPEN → MC)
`PAST-002` · MC · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: No · Approved

Are you currently in contact with anyone you previously dated or had a romantic or sexual relationship with?

- No contact
- Only unavoidable contact, such as work, family or church
- Occasional friendly contact
- Regular contact or friendship
- A close friendship
- There is a situation I think my partner should understand

Previously: *Is there anyone in our circle you've had more than a friendship with that I should know about?*

### PAST-003 — **NEW ID** (format changed OPEN → MC)
`PAST-003` · MC · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: Yes · Approved

What has been the biggest recurring difficulty in your past romantic relationships?

- Communication
- Conflict or arguments
- Trust or jealousy
- Emotional openness
- Commitment
- Boundaries or faithfulness
- Different values or life goals
- I haven't had a serious previous relationship

Previously: *What have your past relationships taught you that'll make you a better partner now?*

### PAST-004 — **NEW ID** (format changed MC → SCALE)
`PAST-004` · SCALE · Level 1 (Warm-up) · part (advisory): Past & Baggage · Guessable: Yes · Approved

How much do you think experiences from your past still influence how you behave in relationships today?

- Very little — I see most of it as behind me
- A little
- Some past patterns still affect me
- Quite a lot
- A lot — I'm very aware that my past still shapes my reactions

Previously: *How much 'baggage' are you bringing - and what size does it pack into?*
Previous options: A briefcase | A carry-on | A full suitcase | A steamer trunk

### PAST-005 — **NEW ID** (format changed SCALE → MC)
`PAST-005` · MC · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: Yes · Approved

Which best describes how you feel emotionally about your previous romantic relationships?

- I've never had a serious previous relationship
- They're fully behind me and I feel at peace
- I'm over the people, but some experiences still affect me
- There are still some unresolved feelings or questions
- I'm still emotionally attached to someone from my past
- I'm still actively processing a previous relationship

Previously: *How fully closed are your past relationships?*
Previous options: 1 = Still processing them ... 5 = Fully closed

### PAST-006 — **NEW ID** (format changed OPEN → MC)
`PAST-006` · MC · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: Yes · Approved

Which best describes your relationship with your mother or maternal figure?

- Very close and supportive
- Generally good, with some tension
- Complicated
- Distant
- Strained or conflictual
- No meaningful relationship / she wasn't present

Previously: *Pick a few words for your relationship with each of your parents - and tell me the story behind them.*

### PAST-007 — **NEW ID** (format changed OPEN → MC)
`PAST-007` · MC · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: Yes · Approved

If your parents or caregivers seriously hurt you in the past, where do you feel you are with it today?

- I don't have significant hurt from them
- I've worked through it and feel largely at peace
- I've forgiven them, but what happened still affects me
- I'm actively trying to work through it
- There is significant hurt I haven't resolved
- I'm not ready to talk about it yet

Previously: *Is there anything you wish you could say to your parents that you never have?*

### PAST-008 — **NEW ID** (option count changed 4 → 7)
`PAST-008` · MC · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: Yes · Approved

Which best describes the home environment you grew up in?

- Warm, secure and affectionate
- Loving but very strict or controlled
- Emotionally distant
- Often tense or conflict-heavy
- Unpredictable or chaotic
- Unsafe or abusive
- None of the above

Previously: *What was the home you grew up in like?*
Previous options: Warm and stable | Strict | Chaotic or tense | Distant

### PAST-009 — **KEEP ID**
`PAST-009` · OPEN · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: No · Approved

What's been one of the hardest or lowest seasons of your life, and what helped you get through it?

Previously: *What's been the lowest point you've walked through, and how did you come out of it?*

### PAST-010 — **NEW ID** (format changed OPEN → MC)
`PAST-010` · MC · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: Yes · Approved

What role did you most often play in your family growing up?

- The responsible one
- The peacemaker
- The achiever
- The caregiver
- The rebel or challenger
- The quiet one who stayed out of the way
- The funny one who kept things light

Previously: *What are a few memories from childhood that still shape you today?*

### PAST-011 — **NEW ID** (option count changed 4 → 6)
`PAST-011` · MC · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: Yes · Approved

Have you ever intentionally worked through difficult parts of your past with someone?

- Yes, with a counsellor or therapist
- Yes, with a pastor, Christian mentor or through discipleship
- Yes, mainly with trusted friends or family
- Mostly on my own through prayer, reflection or study
- No — I haven't felt I needed to
- No — but there are things I know I still need to work through

Previously: *Have you worked through your past issues with a mentor, counselor, or in discipleship?*
Previous options: Yes, ongoing | Yes, in the past | No, but I'm open to it | No

### Career & Ambition — 1

### CAREER-002 — **NEW ID** (format changed OPEN → MC)
`CAREER-002` · MC · Level 2 (Everyday) · part (advisory): Career & Ambition · Guessable: Yes · Approved

Which best describes what you've wanted from your work so far?

- Stability — security, consistency and a reliable income
- Progression — growing, achieving and moving up
- Purpose — doing work that feels meaningful
- Freedom — flexibility, independence and control over my time
- Variety — learning, changing things up and trying new challenges

Previously: *Walk me through the jobs you've held - what you loved, what you didn't, and what it says about your work life.*

### Character & Self-Awareness — 13

### SELF-002 — **NEW ID** (format changed OPEN → MC)
`SELF-002` · MC · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

Which best describes how you see yourself?

- Steady — dependable, grounded and consistent
- Driven — ambitious, motivated and always pushing forward
- Caring — people-focused, supportive and empathetic
- Independent — self-reliant, private and comfortable doing my own thing
- Adventurous — curious, spontaneous and always up for something new

Previously: *If you had to describe who you really are to someone who'd never met you, what would you say?*

### SELF-003 — **NEW ID** (format changed OPEN → MC)
`SELF-003` · MC · Level 4 (Vulnerable) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

Which quality do you think you'd bring most to a marriage?

- Steadiness — I'm dependable and consistent
- Encouragement — I naturally build people up
- Care — I notice needs and look after people
- Fun — I bring energy, humour and adventure
- Commitment — I stick with people through difficult seasons

Previously: *Give five reasons someone would love sharing life with you - and three reasons they might find it hard.*

### SELF-005 — **NEW ID** (format changed OPEN → MC)
`SELF-005` · MC · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

Which area of your life are you most intentional about staying disciplined in?

- Health — exercise, food, sleep
- family time - quality time spent with family
- Time — planning, routines, getting things done
- Money — spending, saving, budgeting
- Faith — prayer, Scripture, spiritual disciplines
- Personal growth — learning, reflection, working on myself

Previously: *What are a couple of habits you're glad you have, and a couple you'd love to shake?*

### SELF-007 — **KEEP ID**
`SELF-007` · OPEN · Level 4 (Vulnerable) · part (advisory): Character & Self-Awareness · Guessable: No · Approved

What are you most afraid of in this season of your life?

Previously: *What are your biggest fears in life right now?*

### SELF-009 — **NEW ID** (option text changed)
`SELF-009` · MC · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

When someone gives you honest feedback, how do you usually respond?

- I welcome it — I appreciate being challenged
- I listen, even when it's difficult
- I find it difficult to accept
- It depends on who it's from

Previously: *When someone gives you honest feedback, how do you usually take it?*
Previous options: Welcome it | Hear it but bristle | Get defensive | Depends who it's from

### SELF-010 — **NEW ID** (format changed OPEN → MC)
`SELF-010` · MC · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

What kind of people do you feel most comfortable around?

- Warm and expressive — open, friendly and emotionally open
- Quiet and reserved — calm, private and comfortable with silence
- Fun and outgoing — energetic, social and spontaneous
- Direct and straightforward — honest, blunt and to the point
- Calm and practical — realistic, steady and focused on solutions
- Driven and ambitious — focused, motivated and goal-oriented

Previously: *What kind of people do you click with instantly, and what kind do you find hard work?*

### SELF-011 — **KEEP ID**
`SELF-011` · OPEN · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: No · Approved

Who has influenced you most in becoming the person you are today?

Previously: *Who has shaped who you are the most, and in what way?*

### SELF-014 — **NEW ID** (format changed OPEN → RANK)
`SELF-014` · RANK · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

Which character traits come most naturally to you? Rank these from strongest to weakest.

- Patience
- Kindness
- Self-control
- Gentleness
- Honesty
- Humility

Previously: *Which character traits come naturally to you - patience, kindness, self-control, gentleness - and which take real effort?*

### SELF-015 — **KEEP ID**
`SELF-015` · OPEN · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: No · Approved

What's one part of yourself you'd most like to grow or change?

Previously: *If you could change one thing about yourself, what would it be?*

### SELF-016 — **KEEP ID**
`SELF-016` · OPEN · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: No · Approved

What would the people who know you best say I should know about you?

Previously: *If I asked your parents what I should really know about you, what would they say?*

### SELF-017 — **NEW ID** (option text changed)
`SELF-017` · MC · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

When life gets hard, how do you most often cope?

- Turn to prayer or Scripture
- Talk it through with someone
- Keep busy or stay active
- Take time to think and process it on my own
- Distract myself with something enjoyable

Previously: *When life gets hard, how do you most often cope?*
Previous options: Prayer or Scripture | Talking it out with someone | Staying active or exercising | Treating myself or shopping | Going quiet and withdrawing

### SELF-019 — **NEW ID** (option text changed)
`SELF-019` · MC · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

How comfortable are you with telling a small lie to avoid hurting someone's feelings?

- Not comfortable at all
- Only in rare situations
- Sometimes, if it seems kinder
- Quite comfortable with it

Previously: *How do you feel about small 'white lies'?*
Previous options: Never okay | Okay to spare feelings | Fine in small doses | No big deal

### SELF-027 — **NEW ID** (option count changed 1 → 5)
`SELF-027` · SCALE · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

When your feelings and your values point in different directions, which do you usually follow?

- My feelings almost always
- My feelings more often
- It depends
- My values more often
- My values almost always

Previously: *When your feelings and your convictions clash, which usually wins?*
Previous options: 1 = My feelings usually win ... 5 = My convictions usually win

### Us & Compatibility — 27

### US-001 — **NEW ID** (format changed OPEN → RANK)
`US-001` · RANK · Level 2 (Everyday) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Draft

What matters most to you for two people to feel truly compatible? Rank these from most important to least important.

- How we communicate day to day
- Our energy levels and how much time we need alone
- Our sense of humour
- The pace of life and routines we each like
- How we each handle money in practice
- How we like to spend free time
- How tidy and organised we each are

Previously: *What does being 'compatible' actually mean to you?*

### US-003 — **NEW ID** (format changed OPEN → RANK)
`US-003` · RANK · Level 2 (Everyday) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Approved

Where do you think we're most alike? Rank these from most similar to least similar.

- Faith and values
- Personality
- Sense of humour
- Lifestyle and habits
- Interests and hobbies
- Ambition and goals
- How we relate to other people

Previously: *Name three ways we're alike and three ways we're different - which differences do you actually treasure?*

### US-004 — **KEEP ID**
`US-004` · OPEN · Level 3 (Deeper) · part (advisory): Us & Compatibility · The Big Picture · Guessable: No · Approved

What do you hope marriage would give or allow us to build that you don't think you could have in the same way while single?

Previously: *What would marriage give you that staying single wouldn't?*

### US-005 — **NEW ID** (format changed OPEN → RANK)
`US-005` · RANK · Level 2 (Everyday) · part (advisory): Us & Compatibility · The Big Picture · Guessable: Yes · Approved

What would make you feel that we had built a genuinely great marriage? Rank these from most important to least important.

- A strong relationship with God at the centre
- Deep friendship and emotional closeness
- Trust, loyalty and commitment
- A peaceful and loving home
- A strong sex life and physical connection
- Raising a strong family
- Growing, achieving and building things together
- Having fun and genuinely enjoying life together

Previously: *Forget 'perfect' - paint me your picture of a realistic, great marriage.*

### US-007 — **NEW ID** (option count changed 1 → 5)
`US-007` · SCALE · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

How confident are you right now that you would want to marry me and remain committed to our marriage for life?

- I have serious doubts
- I have some significant doubts
- I feel hopeful, but I'm still discerning
- I'm very confident
- I'm fully confident in choosing you for life

Previously: *How confident are you that we'd go the distance?*
Previous options: 1 = Some real doubts ... 5 = Completely confident

### US-009 — **NEW ID** (format changed OPEN → RANK)
`US-009` · RANK · Level 2 (Everyday) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Approved

What would make you feel like we're still dating each other years into marriage? Rank these from most important to least important.

- Regular dates just for us
- Flirting and playful affection
- Physical and sexual intimacy
- Thoughtful surprises or gestures
- Trying new things and having adventures
- Making time for deep conversation
- Dressing up or making an effort for each other

Previously: *How would you keep romance alive over the long haul?*

### US-013 — **NEW ID** (option count changed 4 → 5)
`US-013` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

Before getting married, how much intentional marriage preparation would you want us to do?

- Formal premarital counselling with a pastor or counsellor
- A structured Christian marriage course or counselling
- Several intentional conversations with a pastor or mentor
- Mainly work through important topics ourselves
- I don't think formal preparation is necessary

Previously: *How open are you to premarital counseling now, and marriage counseling later if we needed it?*
Previous options: Definitely | If we needed it | I'd be hesitant | Not sure

### US-014 — **NEW ID** (option count changed 5 → 6)
`US-014` · MC · Level 1 (Warm-up) · part (advisory): Us & Compatibility · The Big Picture · Guessable: Yes · Approved

What has shaped your understanding of marriage the most?

- The Bible and my Christian beliefs
- My parents or the marriage I grew up watching
- Church teaching, pastors or Christian mentors
- Other marriages I've seen around me
- Books, films, social media or wider culture
- My own relationship experiences and conclusions

Previously: *Where did most of what you believe about marriage come from?*
Previous options: My parents | Friends | Church | Books or media | Mostly figuring it out

### US-015 — **NEW ID** (format changed OPEN → SCALE)
`US-015` · SCALE · Level 3 (Deeper) · part (advisory): Us & Compatibility · Growth & Give-and-Take · Guessable: Yes · Approved

How much would you want us to rely on each other in married life?

- Very independent — I think each person should handle most of their own needs and responsibilities
- Mostly independent — support each other, but keep plenty separate
- Balanced — rely on each other for major things while still handling plenty individually
- Highly interdependent — I would want us involved in most important parts of each other's lives
- Deeply interdependent — I would want us to function as one team across almost every area of life

Previously: *In marriage, what would you want us to lean on each other for - and what would you keep as your own?*

### US-017 — **NEW ID** (format changed OPEN → MC)
`US-017` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · The Big Picture · Guessable: Yes · Approved

Once we're married, how do you think we should view our individual lives and our life as a couple?

- Marriage becomes the main priority — our individual plans should normally come second to what is best for us as a couple
- Marriage comes first, but we should still strongly protect each person's individual goals and identity
- Our shared life and individual lives should carry roughly equal weight
- Marriage should support our individual lives rather than significantly reshape them
- We should remain highly independent while choosing to share life together

Previously: *What do you picture for the future of us?*

### US-018 — **NEW ID** (option count changed 1 → 5)
`US-018` · SCALE · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Growth & Give-and-Take · Guessable: Yes · Approved · SCORING: mirror

How balanced does the give-and-take in our relationship feel to you right now?

- I feel like I give significantly more
- I feel like I give somewhat more
- It feels fairly balanced
- I feel like you give somewhat more
- I feel like you give significantly more

Previously: *How much do you feel you give up of yourself to be in this relationship?*
Previous options: 1 = Very little ... 5 = A great deal

### US-019 — **NEW ID** (option count changed 4 → 6)
`US-019` · RANK · Level 3 (Deeper) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

Whose opinion about our relationship would carry the most weight for you? Rank these from most to least.

- My parents
- Your parents
- Our pastor or church leaders
- A mature Christian couple or mentor
- My closest friends
- Our wider church community

Previously: *Whose blessing on our relationship matters most to you?*
Previous options: Our parents | A pastor or mentor | Close friends | Our small group or church

### US-020 — **NEW ID** (format changed SCALE → MC)
`US-020` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

If several people we trusted raised serious concerns about our relationship, what should we do?

- Stop moving towards marriage unless those concerns were resolved
- Pause and seriously investigate what they were seeing
- Listen carefully, but continue if we still believed the relationship was right
- Consider their advice, but make the decision mainly between us
- Our relationship is ultimately between us and God, so outside concerns should have little influence

Previously: *How much should wise counsel from people we trust shape our biggest decisions?*
Previous options: 1 = We decide on our own ... 5 = It shapes us heavily

### US-021 — **NEW ID** (format changed SCALE → RANK)
`US-021` · RANK · Level 3 (Deeper) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

When deciding whether someone is the right person to marry, what should matter most? Rank these.

- Shared faith and convictions
- Character
- Commitment and loyalty
- Attraction and chemistry
- Friendship and emotional connection
- Shared goals and direction
- How well we handle conflict and difficult seasons

Previously: *In choosing a life partner, what matters more to you?*
Previous options: 1 = Chemistry and connection ... 5 = Clarity and shared direction

### US-022 — **NEW ID** (format changed SCALE → MC)
`US-022` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If we discovered a major disagreement before marriage that neither of us was willing to change, what should we do?

- Do not marry until we genuinely agree
- Decide whether the issue is important enough to prevent marriage
- Marry if our core faith and commitment are strong and keep working on it
- Accept that spouses can hold major differences and move forward
- I would expect one person eventually to yield for the sake of unity

Previously: *How much should a couple agree on the big things before marrying, rather than working it out later?*
Previous options: 1 = Work most of it out later ... 5 = Agree on the big things first

### US-023 — **NEW ID** (option count changed 1 → 5)
`US-023` · SCALE · Level 3 (Deeper) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

How much do you believe marriage itself changes a person's character and habits?

- Very little — we should assume the person we marry is largely the person we'll live with
- Some small changes
- People can mature gradually
- Marriage can lead to major personal growth
- I expect marriage to change people significantly

Previously: *How much do you believe a person's habits and character can change after marriage?*
Previous options: 1 = People rarely change ... 5 = People can change a lot

### US-024 — **NEW ID** (format changed SCALE → MC)
`US-024` · MC · Level 5 (Hot-button) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

How much would you need me to change from who I am today for you to be happy marrying me as I am?

- Hardly at all — I can genuinely accept you as you are
- A few smaller things
- There are some meaningful areas I'd want to improve
- There are several significant things I'd need to change
- I would be relying on major changes for the marriage to work

Previously: *How much are you counting on me changing after we marry?*
Previous options: 1 = Not at all, I accept you as you are ... 5 = I'm counting on some real changes

### US-025 — **NEW ID** (format changed SCALE → MC)
`US-025` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If we had a serious recurring problem before marriage, what would you expect marriage to do to it?

- Probably make it harder unless we dealt with it first
- Mostly leave it unchanged
- Give us more opportunity to work through it together
- Marriage itself would likely make the issue easier
- It would depend entirely on the problem

Previously: *Do you think marriage will improve our current problems, or mostly reveal them?*
Previous options: 1 = Marriage will help fix things ... 5 = Marriage mainly reveals what's already there

### US-026 — **NEW ID** (format changed MC → RANK)
`US-026` · RANK · Level 3 (Deeper) · part (advisory): Us & Compatibility · Growth & Give-and-Take · Guessable: Yes · Approved

When hard seasons hit, how do you expect we'll get through them?

- Lean on God together
- Lean mainly on each other
- Push through practically
- Seek outside help and counsel

Previously: *When hard seasons hit, how do you expect we'll get through them?*
Previous options: Lean on God together | Lean mainly on each other | Push through practically | Seek outside help and counsel

### US-027 — **NEW ID** (option count changed 6 → 7)
`US-027` · RANK · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

What matters most for being ready for marriage? Rank these from most important to least important.

- Spiritual maturity
- Strong character and emotional maturity
- Shared convictions about marriage and family
- Ability to communicate and resolve conflict
- Financial responsibility
- Practical stability and ability to build a household
- Genuine certainty about choosing the person

Previously: *Rank the markers of readiness for marriage, most important first.*
Previous options: Spiritual maturity | Emotional health | Financial stability | Conflict-resolution skills | Living independently | Career direction

### US-028 — **NEW ID** (option count changed 4 → 6)
`US-028` · MC · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

What do you believe makes our marriage commitment binding?

- Our covenant before God — marriage remains binding even when feelings or circumstances change
- Our vows to God and each other — we are committed for life except where Scripture permits the marriage to end
- Our lifelong promise to each other — even without seeing it primarily as a religious covenant
- Our commitment remains while the marriage is healthy and both people continue choosing it
- Marriage is a partnership that either person should be able to end if it no longer works
- I'm still working out what I believe

Previously: *Do you see marriage more as a covenant or a contract?*
Previous options: A sacred covenant before God | A lifelong commitment | A partnership that can end if needed | Not sure

### US-031 — **NEW ID** (option count changed 4 → 5)
`US-031` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

If you were confident this was the person you wanted to marry, how long would you ideally want to wait before getting engaged?

- Less than 6 months
- Around 6–12 months
- Around 1–2 years
- More than 2 years
- I wouldn't want a set timeframe

Previously: *Once you knew it was right, how soon would you want to get married?*
Previous options: Within a year | One to two years | Two years or more | No rush at all

### US-032 — **NEW ID** (option text changed)
`US-032` · RANK · Level 3 (Deeper) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

Rank these by the priority you believe they should normally have in our life together.

- God and our relationship with Him
- Our marriage
- Our children
- Work and career
- Extended family
- Church, ministry and serving others

Previously: *Rank what should come first in our life together.*
Previous options: God | Each other | Our children | Work and career | Extended family | Ministry and serving

### US-033 — **NEW ID** (option count changed 4 → 5)
`US-033` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

What is your intention for our relationship at this stage?

- I'm intentionally pursuing marriage with you
- I'm seriously discerning whether we should marry
- I'm committed to the relationship but not ready to think about marriage yet
- I'm mainly enjoying our relationship and seeing where it goes
- I'm unsure what I want our relationship to become

Previously: *What's your goal for this season of dating?*
Previous options: Heading toward marriage | Seeing if we're compatible | Enjoying it for now | Not sure yet

### US-036 — **NEW ID** (format changed SCALE → MC)
`US-036` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

Before engagement, how emotionally invested do you think a couple should become?

- Keep strong emotional boundaries until there is a formal commitment
- Grow emotionally close gradually while still guarding against acting married before marriage
- Become deeply emotionally invested once the relationship is exclusive and serious
- Become fully emotionally invested once both people are intentionally pursuing marriage
- I don't think engagement should determine how emotionally close a couple becomes

Previously: *Early in a relationship, how much do you guard your heart versus give it fully?*
Previous options: 1 = I guard it carefully ... 5 = I give my heart fully and fast

### US-037 — **NEW ID** (format changed SCALE → MC)
`US-037` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

How comfortable are you with trusted people challenging things they see in our relationship?

- Very comfortable — I want people close to us to speak up even when it's uncomfortable
- Comfortable if they know us well and have a genuine concern
- I'd rather they raise only serious concerns
- I'd prefer people to support us rather than question the relationship
- I believe relationship problems should mainly stay between the couple

Previously: *How open are you to people close to us questioning our relationship?*
Previous options: 1 = I'd rather they stayed out of it ... 5 = I welcome their honest questions

### US-039 — **NEW ID** (option count changed 1 → 5)
`US-039` · SCALE · Level 2 (Everyday) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

How much would you want our married life to be surrounded by close friendships and Christian community?

- Mostly just us
- A small circle, but plenty of privacy
- A balance of couple life and community
- Regularly involved with close friends and church community
- Deeply connected — I would want community to be a major part of our life

Previously: *As a couple, how involved in community do you want to be?*
Previous options: 1 = Mostly just us ... 5 = Deeply involved in community

### Values & Convictions — 11

### VAL-001 — **NEW ID** (option count changed 4 → 6)
`VAL-001` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

When, if ever, do you believe abortion can be morally acceptable?

- Never, except where treatment is necessary to save the mother's life and the baby's death cannot be avoided
- Only when the mother's life is seriously at risk
- In cases such as rape, incest or severe medical circumstances
- I believe abortion can be morally acceptable in some other circumstances, especially early in pregnancy
- I believe the decision should ultimately belong to the pregnant woman
- I'm still working out what I believe

Previously: *Where do you land on abortion?*
Previous options: Always wrong | Wrong, with some exceptions | A personal or medical choice | Still working it out

### VAL-002 — **NEW ID** (option count changed 4 → 5)
`VAL-002` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

What is your personal conviction about same-sex marriage?

- I believe marriage is only between a man and a woman and same-sex marriage is morally wrong
- I believe Christian marriage is only between a man and a woman, but I accept civil same-sex marriage for others
- I personally hold a traditional view but don't believe others should be expected to follow it
- I believe same-sex marriage is morally equal to opposite-sex marriage
- I'm still working out what I believe

Previously: *What's your view on same-sex marriage?*
Previous options: Wrong | Acceptable for others, not us | Fully support it | Still working it out

### VAL-003 — **NEW ID** (option count changed 4 → 6)
`VAL-003` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

What is your overall conviction about using birth control in marriage?

- I believe we should avoid artificial contraception and remain open to children
- I would prefer natural family planning or fertility-awareness methods only
- I am comfortable with contraception, but would have moral concerns about some methods
- I am comfortable with most forms of contraception
- I believe the choice is entirely personal and don't have a moral concern about contraception
- I'm unsure

Previously: *How do you feel about birth control?*
Previous options: Avoid it entirely | Natural methods only | Most methods are fine | Whatever works for us

### VAL-004 — **NEW ID** (option count changed 4 → 6)
`VAL-004` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Draft

When, if ever, do you believe divorce can be morally or biblically acceptable?

- Never while both spouses are alive
- Only because of sexual unfaithfulness
- Sexual unfaithfulness or abandonment
- Sexual unfaithfulness, abandonment, or serious abuse or danger
- When a marriage has irretrievably broken down
- I'm still working out what I believe

Previously: *Under what circumstances, if any, is divorce acceptable to you?*
Previous options: Never | Only for abuse, adultery, or abandonment | When it's broken beyond repair | Still working it out

### VAL-005 — **NEW ID** (option count changed 4 → 5)
`VAL-005` · MC · Level 3 (Deeper) · part (advisory): Values & Convictions · Guessable: Yes · Approved

What is your conviction about the death penalty?

- I support it for the most serious crimes
- I believe it can be morally justified, but should be used very rarely
- I oppose it because life imprisonment is sufficient
- I oppose it in principle because the state should not take life as punishment
- I'm unsure

Previously: *What's your view on the death penalty?*
Previous options: Support it | Oppose it | Depends on the case | Unsure

### VAL-006 — **NEW ID** (option count changed 4 → 5)
`VAL-006` · MC · Level 3 (Deeper) · part (advisory): Values & Convictions · Guessable: Yes · Approved

Would you be comfortable with us legally keeping a firearm in our home?

- Yes — I would actively want one for protection or sport
- Yes — if it were securely stored and responsibly handled
- I would tolerate one if it mattered strongly to my partner
- No — I would not want a firearm in our home
- I'm unsure

Previously: *Would you want guns in our home?*
Previous options: Yes, comfortable | Only if secured / limited | No guns at all | Unsure

### VAL-007 — **NEW ID** (option count changed 4 → 5)
`VAL-007` · MC · Level 3 (Deeper) · part (advisory): Values & Convictions · Guessable: Yes · Approved

What do you believe about gender identity when it differs from biological sex?

- Biological sex is God-given and should not be redefined by gender identity
- People may experience gender dysphoria, but I believe they should still live according to their biological sex
- I believe adults should be free to identify differently, even though I personally hold a traditional Christian view
- I believe gender identity can legitimately differ from biological sex and should be affirmed
- I'm still working out what I believe

Previously: *Where do you lean on immigration?*
Previous options: Stricter | Moderate | More open | Unsure

### VAL-008 — **NEW ID** (option count changed 4 → 6)
`VAL-008` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

When, if ever, do you believe assisted suicide or euthanasia is morally acceptable?

- Never — intentionally ending an innocent human life is morally wrong
- I oppose it generally, including in terminal illness
- Only in exceptional cases involving terminal illness and extreme suffering
- Competent adults should have the right to choose it under strict safeguards
- Adults should generally have the right to choose the timing of their death
- I'm unsure

Previously: *What's your view on assisted dying?*
Previous options: Wrong | Acceptable in some cases | A personal right | Unsure

### VAL-010 — **NEW ID** (option count changed 4 → 6)
`VAL-010` · MC · Level 3 (Deeper) · part (advisory): Values & Convictions · Guessable: Yes · Approved

What best describes your approach to vaccinations for yourself and our future children?

- Generally follow the recommended vaccination schedule
- Generally vaccinate, but consider some vaccines individually
- Decide each vaccine case by case after doing our own research
- Prefer to avoid most vaccinations unless clearly necessary
- Opposed to routine vaccination
- I'm unsure

Previously: *Where do you stand on vaccines?*
Previous options: Fully pro-vaccine | Selective | Hesitant | Against

### VAL-011 — **NEW ID** (format changed SCALE → MC)
`VAL-011` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

If we regularly voted for different political parties or candidates, how would that affect you?

- It wouldn't bother me
- I'd prefer political agreement, but could comfortably accept the difference
- It would create real tension for me
- I would find it very difficult to marry someone whose politics were very different from mine
- Shared political convictions are important enough that major disagreement could be a deal-breaker

Previously: *How important is it that we share the same social and political convictions?*
Previous options: 1 = We can differ freely ... 5 = We need to agree

### VAL-012 — **NEW ID** (option count changed 4 → 6)
`VAL-012` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

Do you believe an unmarried Christian couple should live together before marriage?

- No — I believe living together should wait until marriage
- Generally no, even if engaged
- I would be comfortable once formally engaged and preparing to marry
- I would be comfortable if the relationship was serious and committed
- Yes — I don't see living together before marriage as morally wrong
- I'm unsure

Previously: *How do you feel about living together before marriage?*
Previous options: Wait until married | Okay once engaged | Fine if we're committed | No issue with it

## 3. Add as follow-ups (121)

Each sits under the parent named in its heading and inherits that parent's part. Three were re-parented at Dave's instruction and are marked.

### In the Home — 3

### Follows `HOME-002`
`HOME-002#fu1` · RANK · Level 1 (Warm-up) · part (advisory): In the Home · Guessable: Yes · Approved

Which household jobs would you least want to be responsible for? Rank them from least favourite to most manageable.

- Cooking
- Cleaning
- Laundry
- Grocery shopping
- Household admin
- Repairs and maintenance

### Follows `HOME-005`
`HOME-005#fu1` · SCALE · Level 2 (Everyday) · part (advisory): In the Home · Guessable: Yes · Approved

How comfortable would you be with people dropping by without much notice?

- Very uncomfortable
- Slightly uncomfortable
- It depends
- Mostly comfortable
- Completely comfortable

### Follows `HOME-009`
`HOME-009#fu1` · MC · Level 2 (Everyday) · part (advisory): In the Home · Guessable: Yes · Approved

What would personal space at home mean most to you?

- Somewhere quiet to be alone
- A workspace or desk
- Space for hobbies
- My own storage or belongings
- I don't really need a separate space

### Finances & Money — 6

### Follows `FIN-003`
`FIN-003#fu1` · MC · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

When should we check with each other before spending money?

- For most non-routine purchases
- Whenever something costs more than an amount we've agreed
- Only for major purchases
- Only when it affects our shared goals or budget
- No need if it comes from agreed personal spending money

### Follows `FIN-004`
`FIN-004#fu1` · SCALE · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

How structured would you want us to be with budgeting?

- Very flexible — I wouldn't want much of a budget
- Mostly flexible
- Some structure, with room to adapt
- Quite structured
- Very structured — I'd want us to plan and track our money closely

### Follows `FIN-005`
`FIN-005#fu1` · MC · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved · SCORING: mirror

Who would you naturally expect to take the lead on keeping track of our finances?

- Mainly me
- Mainly you
- Both of us equally
- Whoever is better at it
- I don't have a preference

### Follows `FIN-010`
`FIN-010#fu1` · SCALE · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: No · Draft

How important is it that we're aligned on money?

- Not important — we can differ freely on money
- Slightly important
- Moderately important — I'd want to agree on the big things
- Very important
- Essential — we need to agree on how we handle money

### Follows `FIN-011`
`FIN-011#fu1` · MC · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: No · Approved

What are you most likely to spend extra money on?

- Food and eating out
- Travel and experiences
- Clothes or appearance
- Hobbies, technology or entertainment
- Gifts or treating other people
- Home or lifestyle upgrades

### Follows `FIN-016`
`FIN-016#fu1` · OPEN · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: No · Approved

What do you think God wants money to be for in our lives?

### Faith & Worship practice — 2

### Follows `FAITH-012`
`FAITH-012#fu1` · MC · Level 1 (Warm-up) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

Which area of faith do you find yourself wrestling with or questioning most?

- Why God allows suffering or difficult things to happen
- Hearing God's voice and knowing His guidance
- Unanswered prayer
- Understanding the Bible or difficult teachings
- Salvation, doubt or assurance
- God's plan or purpose for my life
- I don't currently have a major faith question

### Follows `FAITH-023`
`FAITH-023#fu1` · MC · Level 4 (Vulnerable) · part (advisory): Faith & Worship practice · Guessable: Yes · Approved

When you pray together, who would you usually expect to take the lead?

- The husband
- The wife
- Either of us
- We would usually pray together without one person leading
- It would depend on the situation

### Theology & Beliefs — 5

### Follows `THEO-001`
`THEO-001#fu1` · MC · Level 3 (Deeper) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Do you believe a woman should preach or teach Scripture to a mixed congregation of men and women?

- Yes, without restriction
- Yes, but not while holding pastoral/elder authority
- Only in certain settings
- No
- I'm still working it out

### Follows `THEO-003`
`THEO-003#fu1` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

If we became convinced of different church traditions, what would you ideally want us to do?

- One of us joins the other's church
- Find a new church we can both agree on
- Attend different churches if necessary
- Keep studying and discussing until we're aligned
- I'm not sure

### Follows `THEO-005`
`THEO-005#fu1` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

How comfortable would you be attending a church where tongues or prophecy regularly happened publicly?

- Very comfortable
- Comfortable if it is orderly and biblically tested
- Unsure or cautious
- Uncomfortable
- I wouldn't want us attending that kind of church

### Follows `THEO-006`
`THEO-006#fu1` · SCALE · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

How important would it be to you that we agreed on the end times?

- Not important
- Slightly important
- Nice to agree, but not necessary
- Very important
- Essential

### Follows `THEO-009`
`THEO-009#fu1` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

How would you want us to handle baptism if we disagreed about what to do with our children?

- Baptise them as infants
- Dedicate them and let them choose baptism later
- Wait until we reach agreement
- Follow the teaching of the church we commit to
- I'm not sure

### Family & Children — 3

### Follows `FAM-003`
`FAM-003#fu1` · MC · Level 2 (Everyday) · part (advisory): Family & Children · Guessable: Yes · Approved

Would you consider adoption even if we were able to have biological children?

- Yes, I would still want to consider it
- Maybe, depending on our circumstances
- Mainly if biological children weren't possible
- No, adoption probably wouldn't be for me
- I'm unsure

### Follows `FAM-005`
`FAM-005#fu1` · RANK · Level 2 (Everyday) · part (advisory): Family & Children · Guessable: Yes · Approved

What would most influence when you feel ready to have children? Rank these from most important to least important.

- Our relationship feeling ready
- Financial stability
- Having the right home or living situation
- Career or work circumstances
- Age or fertility considerations

### Follows `FAM-010`
`FAM-010#fu1` · MC · Level 2 (Everyday) · part (advisory): Family & Children · Guessable: Yes · Approved

When it comes to parenting decisions, how much say should grandparents have?

- None — decisions are ours
- They can offer advice when asked
- Their views should be considered
- They should have meaningful input
- They should be closely involved in major decisions

### Parenting style — 7

### Follows `PAR-002`
`PAR-002#fu1` · OPEN · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: No · Approved

What's one thing from the way you were raised that you'd definitely want us to repeat, and one thing you'd want us to do differently?

### Follows `PAR-003`
`PAR-003#fu1` · MC · Level 4 (Vulnerable) · part (advisory): Parenting style · Guessable: Yes · Approved

If our teenage child said they no longer wanted to attend church, what should we do?

- Require them to attend while they're living at home
- Expect attendance but make room for discussion and questions
- Strongly encourage them, but don't force them
- Let them decide whether they attend
- It would depend on their age and circumstances

### Follows `PAR-004`
`PAR-004#fu1` · SCALE · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

How important is it to you that our children obey us promptly when we give them a clear instruction?

- Not very important — understanding and discussion matter more
- Slightly important
- Moderately important
- Very important
- Extremely important — children should normally obey their parents promptly

### Follows `PAR-005`
`PAR-005#fu1` · SCALE · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

If you personally disagreed with physical discipline, how comfortable would you be with your partner using it?

- Not comfortable at all
- Mostly uncomfortable
- We'd need to agree clear boundaries first
- Mostly comfortable
- Comfortable trusting their judgement

### Follows `PAR-006`
`PAR-006#fu1` · SCALE · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

How important is it that our children's education actively reinforces our Christian beliefs?

- Not important — faith can mainly be taught at home and church
- Slightly important
- Moderately important
- Very important
- Essential — I'd want their education to actively support our faith

### Follows `PAR-006`
`PAR-006#fu2` · MC · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

If our child's school regularly taught beliefs about sex, gender or morality that we believed contradicted Scripture, what would you want us to do?

- Keep them there and teach our beliefs clearly at home
- Challenge or opt out of particular teaching where possible
- Move them to another school
- Homeschool or choose explicitly Christian education
- Decide based on the child's age and circumstances

### Follows `PAR-007`
`PAR-007#fu1` · MC · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

How would you want us to handle celebrations like Halloween?

- Participate normally
- Participate, but avoid parts we believe conflict with our faith
- Choose Christian or alternative activities instead
- Avoid it completely
- I'm unsure

### Intimacy & Physical — 14

### Follows `INT-001`
`INT-001#fu1` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

Ideally, how often would you want us to have sex when married?

- Several times a week or more
- Around 2–3 times a week
- Around once a week
- A few times a month
- Less often than that
- I don't think frequency can be decided in advance

### Follows `INT-001`
`INT-001#fu2` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

How would you ideally want sex to be initiated between us?

- Either of us should initiate equally
- I'd naturally expect the husband to initiate more
- I'd naturally expect the wife to initiate more
- Whoever wants intimacy should feel free to initiate
- I haven't really thought about it

### Follows `INT-002`
`INT-002#fu1` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

What is your conviction about prolonged or passionate kissing before marriage?

- I believe we should avoid it completely
- I think it can be okay with strict limits
- I think it is fine as long as we stop before sexual touching
- I don't believe it is morally wrong before marriage
- I'm unsure

### Follows `INT-003`
`INT-003#fu1` · SCALE · Level 3 (Deeper) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

How important is it to you that we both continue making an effort with our physical appearance after marriage?

- Not important
- Slightly important
- Moderately important
- Very important
- Extremely important

### Follows `INT-004`
`INT-004#fu1` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

Would you consider a secret emotional relationship with someone else to be cheating even if nothing physical happened?

- Yes, definitely
- Usually yes
- It would depend on the relationship
- No, not unless it became physical
- I'm unsure

### Follows `INT-005`
`INT-005#fu1` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

If something in our sex life wasn't working for you, how would you most likely handle it?

- Tell me directly
- Wait for the right moment and talk about it gently
- Try to adjust without saying much
- Find it difficult to raise unless it became a serious problem
- Seek advice before talking to me

### Follows `INT-006`
`INT-006#fu1` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

Would you personally consider pornography use to be a form of sexual unfaithfulness?

- Yes, definitely
- In most circumstances
- It depends on the situation or frequency
- No, although it could still damage the marriage
- No, I don't see it as a major issue

### Follows `INT-006`
`INT-006#fu2` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

If one of us used pornography or was struggling with it, how much would you want disclosed?

- Tell each other immediately, even after one incident
- Tell each other if it becomes a repeated struggle
- Tell the partner and also seek accountability
- Deal with it first through a pastor, mentor or accountability partner
- I wouldn't expect every struggle to be disclosed
- I'm unsure

### Follows `INT-007`
`INT-007#fu1` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

How do you understand our responsibility to each other sexually within marriage?

- Sex should always be freely chosen, with no sense of marital obligation
- We should both intentionally prioritise each other's sexual needs, but never through pressure
- Spouses have a real mutual responsibility to maintain sexual intimacy, while still respecting when either person says no
- Regularly withholding sex without good reason would be a serious marital problem
- I'm still working out what I believe

### Follows `INT-008`
`INT-008#fu1` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

Would you want to know how many previous sexual partners your partner has had?

- Yes — I'd want to know the exact number
- I'd want a general idea, but not necessarily an exact number
- Only if there were important circumstances I needed to understand
- I'd rather not know
- It doesn't matter to me

### Follows `INT-009`
`INT-009#fu1` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

If we crossed our sexual boundary before marriage, how would you want us to respond?

- Stop and reset clear boundaries
- Stop, pray about it and seek accountability
- Reconsider our boundaries together
- Continue as long as we were committed to marrying
- I don't believe we would need to change anything

### Follows `INT-010`
`INT-010#fu1` · MC · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

How much detail about past sexual experiences would you actually want to hear?

- I would want to understand the significant details
- I would want the facts, but not graphic details
- Only what directly affects our relationship
- As little detail as possible
- I'd rather not discuss previous experiences unless necessary

### Follows `INT-011`
`INT-011#fu1` · SCALE · Level 5 (Hot-button) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

How important is it to you that we each have someone outside the marriage who can hold us accountable sexually?

- Not important
- Slightly important
- Helpful but not necessary
- Very important
- Essential

### Follows `INT-012`
`INT-012#fu1` · MC · Level 1 (Warm-up) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

Which kind of everyday physical affection makes you feel most connected?

- Hugging
- Kissing
- Cuddling
- Holding hands
- Casual touch throughout the day
- I don't need much physical affection

### Roles & Responsibilities — 1

### Follows `ROLE-002`  (re-parented)
`NEW-muvgpv54` · MC · Level 3 (Deeper) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

If we could comfortably live on the husband's income while our children were young, what would you ideally want the wife to do?

- Stay home full-time
- Mostly stay home, with some work if she wants
- Work part-time
- Continue working normally
- Whatever she personally prefers

### Conflict & Communication — 8

### Follows `CONF-001`
`CONF-001#fu1` · MC · Level 1 (Warm-up) · part (advisory): Conflict & Communication · Guessable: Yes · Draft

How do you most like to feel loved by your partner?

- Through words — being told and encouraged
- Through time — having time made for me
- Through actions — being helped and things done for me
- Through gifts — being given thoughtful things
- Through affection — being shown physically

### Follows `CONF-006`  (re-parented)
`CONF-005` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

How open should our social media be to each other?

- 1 = Keep our profiles private ... 5 = Fully open to each other

### Follows `CONF-019`
`CONF-019#fu1` · SCALE · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

In a disagreement, how important is it to you to be right?

- Not important at all
- Slightly important
- Moderately important
- Very important
- Extremely important

### Follows `CONF-019`
`CONF-019#fu2` · MC · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Draft

When you realise mid-disagreement that you're the one in the wrong, what do you usually do?

- Say so straight away and apologise
- Admit it, but only once things have calmed down
- Concede the point without really admitting I was wrong
- Keep arguing and deal with it privately afterwards
- I find it very hard to admit at all

### Follows `CONF-022`
`CONF-022#fu1` · MC · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: No · Approved

After a disagreement, what do you usually do first?

- Think about what my partner did wrong
- Think about what I could have done differently
- Try to understand both sides
- Wait for my partner to raise it
- Put it aside and move on

### Follows `CONF-023`
`CONF-023#fu1` · MC · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

If you needed advice about a relationship problem, who would you be most likely to talk to first?

- My partner — I'd try to work through it together
- A close friend
- A family member
- A pastor or Christian mentor
- A professional counsellor or therapist

### Follows `CONF-025`
`CONF-025#fu1` · MC · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

What kind of one-on-one time would make you feel most connected to your partner?

- Going out together
- Staying in and talking
- Doing an activity together
- Physical affection and intimacy
- Simply having uninterrupted time together

### Follows `CONF-027`
`CONF-027#fu1` · MC · Level 2 (Everyday) · part (advisory): Conflict & Communication · Guessable: Yes · Approved

When your partner notices something about you that you may not see yourself, how would you prefer them to raise it?

- Tell me directly, even if it's uncomfortable
- Be gentle and choose the right moment
- Ask me questions so I can notice it myself
- Wait until I ask for feedback
- It depends on the situation

### In-Laws & Extended Family — 7

### Follows `INLAW-001`
`INLAW-001#fu1` · MC · Level 2 (Everyday) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

How comfortable would you be with our parents or close family dropping by our home without arranging it first?

- Very uncomfortable — I'd want visits arranged
- Mostly uncomfortable
- It depends who it is
- Mostly comfortable
- Completely comfortable — close family should feel welcome anytime

### Follows `INLAW-002`
`INLAW-002#fu1` · MC · Level 2 (Everyday) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

If both families strongly expected us to spend the same major holiday with them, how should we decide?

- Alternate fairly
- Prioritise whichever family we saw less
- Prioritise the family for whom that tradition matters most
- Celebrate mainly as our own household and see both families separately
- The husband and wife should decide case by case together

### Follows `INLAW-003`
`INLAW-003#fu1` · SCALE · Level 4 (Vulnerable) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

How willing would you be to have one of our parents live with us permanently if they needed care?

- Not willing
- Reluctant, except in extreme circumstances
- Open to considering it
- Very willing
- I would see it as our responsibility if needed

### Follows `INLAW-003`
`INLAW-003#fu2` · SCALE · Level 4 (Vulnerable) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

How much should we be willing to change our lifestyle to care for an ageing parent?

- Very little — our household has to come first
- Some adjustment
- A meaningful amount where necessary
- Major sacrifices if genuinely needed
- Whatever is reasonably necessary to honour and care for them

### Follows `INLAW-005`
`INLAW-005#fu1` · MC · Level 2 (Everyday) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

If you loved your family but your spouse never became particularly close to them, how would you feel?

- Completely fine as long as everyone is respectful
- Slightly disappointed, but I could accept it
- It would bother me quite a lot
- I would see it as a significant relationship problem
- It would depend on why they weren't close

### Follows `INLAW-006`
`INLAW-006#fu1` · MC · Level 2 (Everyday) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

After we're married, how much influence should our parents have over our major decisions?

- Decisions should be ours; involve parents only if we choose
- Seek their advice, but make the decision ourselves
- Seek their advice and give it significant weight
- For major decisions, I'd want their blessing before we move forward
- It depends on the decision

### Follows `INLAW-006`
`INLAW-006#fu2` · RANK · Level 2 (Everyday) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

Which areas would you most value our parents' advice on? Rank them from most to least.

- Marriage and relationship issues
- Raising children
- Money and major financial decisions
- Career and where we live
- Faith and church decisions
- Caring for family members

### Fun & Icebreakers — 9

### Follows `FUN-001`
`FUN-001#fu1` · MC · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

If we had a completely free day together, how would you most want to spend it?

- Relaxing at home
- Exploring somewhere new
- Doing something active or outdoors
- Spending time with friends or family
- Working on a hobby or project together

### Follows `FUN-001`
`FUN-001#fu2` · SCALE · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

How planned or spontaneous would you want our fun together to be?

- I love having things planned well in advance
- Mostly planned
- A mixture of both
- Mostly spontaneous
- I love deciding what to do in the moment

### Follows `FUN-001`
`FUN-001#fu3` · MC · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

If we had to choose something to watch together, what would you pick first?

- Comedy
- Action or thriller
- Drama or romance
- Documentary or true story
- Fantasy, sci-fi or animation

### Follows `FUN-003`
`FUN-003#fu1` · RANK · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

When we're having fun together, what matters most to you? Rank these from most important to least important.

- Laughing together
- Relaxing
- Trying something new
- Having quality time together
- Being active
- Being around other people

### Follows `FUN-004`
`FUN-004#fu1` · MC · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

If we were choosing a trip purely for fun, which would you pick first?

- Beach and relaxation
- City, food and culture
- Nature and adventure
- A road trip exploring different places
- Somewhere completely new and unfamiliar

### Follows `FUN-004`
`FUN-004#fu2` · MC · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

If we were choosing somewhere to eat, what would excite you most?

- Going back to a favourite place
- Trying a cuisine we've never had before
- Somewhere casual with really good food
- Dressing up for somewhere special
- Staying in and cooking something together

### Follows `FUN-006`
`FUN-006#fu1` · MC · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: Yes · Approved

If we wanted to do different things with our free time, what would you usually prefer?

- Take turns choosing
- Find something we both enjoy
- Let whoever cares more choose
- Do separate things and enjoy our own interests
- Decide depending on the situation

### Follows `FUN-006`
`FUN-006#fu2` · MC · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: No · Approved

How would you most want us to celebrate something special like a birthday or anniversary?

- A thoughtful meal together
- A trip or experience
- A big celebration with other people
- A meaningful gift or surprise
- Something simple and private together

### Follows `FUN-006`
`FUN-006#fu3` · OPEN · Level 1 (Warm-up) · part (advisory): Fun & Icebreakers · Guessable: No · Approved

What's something fun you'd love for us to try together that we haven't done yet?

### Health & Lifestyle — 4

### Follows `HEALTH-003`
`HEALTH-003#fu1` · MC · Level 1 (Warm-up) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

How would you most enjoy staying active together?

- Gym or structured workouts
- Walking or hiking
- Sports
- Outdoor activities and adventures
- I'd rather exercise separately
- Staying active together isn't important to me

### Follows `HEALTH-004`
`HEALTH-004#fu1` · SCALE · Level 2 (Everyday) · part (advisory): Health & Lifestyle · Guessable: No · Approved

How important is it to you that we have similar views on alcohol?

- Not important
- Slightly important
- Moderately important
- Very important
- Essential

### Follows `HEALTH-007`
`HEALTH-007#fu1` · MC · Level 2 (Everyday) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

If I'm ill, what do you think your natural instinct would be?

- Take care of everything for me
- Check in and offer help
- Give me space unless I ask
- Stay close and keep me company
- I'd probably need you to tell me what you need

### Follows `HEALTH-008`
`HEALTH-008#fu1` · MC · Level 1 (Warm-up) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

When would you most want us to keep phones away?

- During meals
- On dates
- In bed at night
- During important conversations
- Whenever we're intentionally spending time together
- I wouldn't need specific phone-free times

### Dreams & Future — 1

### Follows `DREAM-002`
`DREAM-002#fu1` · SCALE · Level 1 (Warm-up) · part (advisory): Dreams & Future · Guessable: Yes · Approved

How open would you be to us living in another country for a season of our lives?

- Not open at all
- Possibly for a short period
- I'd seriously consider it
- Very open
- I'd actively love for us to live abroad

### Past & Baggage — 8

### Follows `PAST-001`
`PAST-001#fu1` · MC · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: Yes · Approved

Which part of relationships do you think your past affects most?

- Trust
- Conflict and how I react
- Emotional openness
- Physical or sexual intimacy
- Family relationships
- My confidence or sense of worth
- My faith
- I don't think my past affects my relationships very much

### Follows `PAST-002`
`PAST-002#fu1` · MC · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: Yes · Approved

Once we're married, what contact with previous romantic or sexual partners do you think is appropriate?

- No contact unless absolutely unavoidable
- Only polite or necessary contact
- Occasional friendship is fine if completely open with each other
- Regular friendship is fine with clear boundaries
- Close friendship is fine as long as there is trust

### Follows `PAST-003`
`PAST-003#fu1` · OPEN · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: No · Approved

What did those experiences teach you that you'd want to do differently with me?

### Follows `PAST-007`
`PAST-007#fu1` · MC · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: Yes · Approved

If a parent seriously wronged you and later apologised, what do you believe forgiveness should mean?

- Forgive them and fully restore the relationship
- Forgive them, but rebuild trust gradually
- Forgive them, while keeping firm boundaries if necessary
- Reconciliation should only happen if there is real repentance and change
- I don't believe forgiveness always requires restoring the relationship

### Follows `PAST-008`
`PAST-008#fu1` · MC · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: Yes · Approved

When adults in your home strongly disagreed, what usually happened?

- They talked it through calmly
- One person normally had the final say
- There was arguing or shouting
- People became silent or withdrew
- The issue was usually avoided
- I rarely saw disagreement between them

### Follows `PAST-009`
`PAST-009#fu1` · MC · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: Yes · Approved

When life becomes extremely difficult, who or what do you most naturally turn to first?

- God, prayer and Scripture
- My partner
- Family or close friends
- A pastor or Christian mentor
- A counsellor or therapist
- I mostly deal with things on my own

### Follows `PAST-010`
`PAST-010#fu1` · MC · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: Yes · Approved

When your family is under stress now, which role are you most likely to fall back into?

- The responsible one
- The peacemaker
- The achiever
- The caregiver
- The rebel or challenger
- The quiet one who stayed out of the way
- The funny one who kept things light

### Follows `PAST-011`
`PAST-011#fu1` · MC · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: Yes · Approved

If something from your past began seriously affecting our marriage, who would you be most willing to involve?

- A pastor or church leader
- A Christian counsellor
- A counsellor or therapist
- A mature Christian couple or mentor
- Work through it privately together
- I would strongly prefer not to involve anyone outside the marriage

### Character & Self-Awareness — 5

### Follows `SELF-002`
`SELF-002#fu1` · MC · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

What matters most to you when you think about the person you're becoming?

- Growing in character
- Deepening my faith
- Building a good family life
- Achieving something meaningful
- Living freely and authentically

### Follows `SELF-003`
`SELF-003#fu1` · OPEN · Level 4 (Vulnerable) · part (advisory): Character & Self-Awareness · Guessable: No · Approved

What's one thing about you that could be difficult to live with?

### Follows `SELF-007`
`SELF-007#fu1` · SCALE · Level 4 (Vulnerable) · part (advisory): Character & Self-Awareness · Guessable: Yes · Draft

How much do worries about the future occupy your thoughts?

- 1 = Hardly ever ... 5 = Almost constantly

### Follows `SELF-008`  (re-parented)
`SELF-005#fu1` · RANK · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

rank these areas of your life in terms of importance to you

- Health
- family
- wealth
- faith
- personal growth

### Follows `SELF-014`
`SELF-014#fu1` · RANK · Level 2 (Everyday) · part (advisory): Character & Self-Awareness · Guessable: Yes · Approved

Which of these do you most want to grow in?

- Patience
- Kindness
- Self-control
- Gentleness
- Honesty
- Humility

### Us & Compatibility — 29

### Follows `US-001`
`US-001#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Approved

Where do you think we are strongest as a couple/friends right now?

- Our faith and convictions
- Our friendship
- Our attraction and chemistry
- Our communication
- Our personalities complementing each other
- Our shared goals and direction
- The way we enjoy everyday life together

### Follows `US-002`
`US-002#fu1` · RANK · Level 3 (Deeper) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Approved

What makes you feel most confident that a relationship is built on real love? Rank these.

- Choosing each other even when feelings fluctuate
- Sacrificing for each other
- Trust and honesty
- Deep friendship
- Strong attraction and affection
- Helping each other grow
- Shared faith and commitment to God

### Follows `US-003`
`US-003#fu1` · OPEN · Level 2 (Everyday) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: No · Approved

What's one difference between us that you genuinely love, and one difference you think could be difficult for us?

### Follows `US-005`
`US-005#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · The Big Picture · Guessable: Yes · Approved

If our marriage was strong in most areas but one of these was consistently weak, which would concern you most?

- A strong relationship with God at the centre
- Deep friendship and emotional closeness
- Trust, loyalty and commitment
- A peaceful and loving home
- A strong sex life and physical connection
- Raising a strong family
- Growing, achieving and building things together
- Having fun and genuinely enjoying life together

### Follows `US-006`
`US-006#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If one of these became weak for a long season, which would worry you most about our marriage?

- Shared faith
- Trust
- Commitment
- Communication
- Friendship
- Physical and sexual intimacy
- Shared direction and goals

### Follows `US-007`
`US-007#fu1` · OPEN · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: No · Approved

What, if anything, still gives you hesitation about choosing me for life?

### Follows `US-009`
`US-009#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Approved

If life became really busy, which part of our romantic connection would you protect first?

- Date nights
- Sex and physical intimacy
- Time talking properly
- Affection and flirting
- Trips or experiences together
- Small everyday gestures

### Follows `US-010`
`US-010#fu1` · MC · Level 1 (Warm-up) · part (advisory): Us & Compatibility · The Big Picture · Guessable: Yes · Approved · SCORING: discussion-only

What do you notice first when you see a marriage you admire?

- They genuinely enjoy each other
- Their faith clearly shapes their marriage
- They communicate and handle conflict well
- They are loyal and committed to each other
- They work well as a team
- They have a strong family life
- They still show affection and romance

### Follows `US-013`
`US-013#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

Who would you most want involved in preparing us for marriage?

- Our pastor or church leaders
- A Christian counsellor
- A mature married couple we trust
- Our parents
- A marriage course or programme
- Mainly just the two of us

### Follows `US-017`
`US-017#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · The Big Picture · Guessable: Yes · Approved

Which best describes what you believe marriage should become over time?

- Two people becoming increasingly united in almost every part of life
- A deeply united couple while still keeping strong individual identities
- A partnership where we share the important things but keep plenty separate
- Two independent people who love each other without needing to merge much of their lives
- I haven't really thought about it

### Follows `US-018`
`US-018#fu1` · OPEN · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Growth & Give-and-Take · Guessable: No · Approved

Is there any area where the give-and-take between us currently feels uneven to you?

### Follows `US-019`
`US-019#fu1` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

If your parents strongly believed you should not marry me, what would you do?

- I would not marry without their blessing
- I would pause the relationship until their concerns were resolved
- I would take their concerns very seriously but could still marry if I believed they were wrong
- I would listen respectfully, but the decision would ultimately be mine before God
- My parents' objection would not significantly affect my decision

### Follows `US-020`
`US-020#fu1` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

If our pastor strongly advised us not to marry, how much weight should that carry?

- I would not marry against that advice
- I would pause until we understood and resolved the concern
- It would carry major weight, but wouldn't automatically decide for me
- I would consider it like any other advice
- I would not believe a pastor should have that level of authority over the decision

### Follows `US-021`
`US-021#fu1` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If the emotional “spark” faded for a season but everything else in the relationship was strong, how would that affect your commitment?

- It would not change my commitment
- I would be concerned, but intentionally work to rebuild it
- I would question whether something important was missing
- I would seriously reconsider the relationship
- I believe strong romantic feelings are necessary for a marriage to continue

### Follows `US-022`
`US-022#fu1` · RANK · Level 3 (Deeper) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

Which areas would you least want us to enter marriage seriously divided on? Rank them.

- Faith and theology
- Children and parenting
- Marriage roles
- Sex and intimacy
- Money
- Family and in-laws
- Career and lifestyle
- Political or moral convictions

### Follows `US-023`
`US-023#fu1` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If your partner had a habit you strongly disliked before marriage, what would be your default assumption?

- Assume it may never change and decide whether I can live with it
- Hope it changes, but don't make marriage depend on it
- Expect them to seriously work on changing it
- Expect marriage and responsibility to naturally change it
- I would struggle to marry unless they changed it first

### Follows `US-024`
`US-024#fu1` · OPEN · Level 5 (Hot-button) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: No · Approved

What's the main thing about me that you would hope changes over time?

### Follows `US-025`
`US-025#fu1` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

How serious would a recurring unresolved problem need to become before you would postpone or reconsider marriage?

- Any major recurring problem should be resolved first
- If it affected trust, faithfulness, safety or core values
- Only if it made me seriously doubt the relationship
- I would usually prefer to marry and work through problems together
- I would be very reluctant to postpone marriage once committed

### Follows `US-027`
`US-027#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

Which of these do you think we personally still need to strengthen most before marriage?

- Spiritual maturity
- Strong character and emotional maturity
- Shared convictions about marriage and family
- Ability to communicate and resolve conflict
- Financial responsibility
- Practical stability and ability to build a household
- Genuine certainty about choosing the person

### Follows `US-028`
`US-028#fu1` · MC · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If you no longer felt “in love” with your spouse, but there was no abuse, adultery or abandonment, what would you believe you should do?

- Remain married and actively work to rebuild love
- Remain married because the covenant does not depend on feelings
- Seek counselling and make every serious effort before considering separation
- Separate if the relationship remained emotionally dead for long enough
- Divorce should be an option if love is genuinely gone

### Follows `US-029`
`US-029#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

What would you ideally want our next major relationship step to be?

- Spend more time simply dating and getting to know each other
- Become more intentional about discussing marriage
- Involve family, pastors or mentors more seriously
- Move towards engagement
- Begin actively planning marriage
- I'm happy with where we are for now

### Follows `US-030`
`US-030#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

How involved would you want your partner to be with your closest friends?

- I would want us to become one close social circle
- I'd want my partner to be genuinely close with them
- I'd want everyone to get along, but separate friendships are fine
- Respectful but fairly separate is enough
- My friendships and relationship can remain largely separate

### Follows `US-030`
`US-030#fu2` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

If your closest friend and your partner really didn't like each other, what would you expect?

- My partner should come first, and I would distance myself from the friendship if necessary
- I would expect my friend to respect my relationship even if they disliked my partner
- I would try hard to preserve both relationships
- I would keep the friendship separate from my relationship
- If my friend had serious concerns, I would give their view significant weight

### Follows `US-031`
`US-031#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

Once engaged, how long would you ideally want the engagement to last?

- Less than 6 months
- Around 6–12 months
- Around 1–2 years
- More than 2 years
- However long was practically necessary

### Follows `US-033`
`US-033#fu1` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

How certain do you currently feel that you want this relationship to lead to marriage?

- Very uncertain
- I have significant questions
- I'm genuinely considering it
- Very likely
- I'm already confident that I want to marry you

### Follows `US-034`
`US-034#fu1` · MC · Level 1 (Warm-up) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

Do you believe Christians should date someone they already know they could not realistically marry?

- No — dating should only be pursued where marriage is realistically possible
- Generally no, because dating should be intentional towards marriage
- Possibly, if you're still genuinely discerning compatibility
- Yes — dating can be worthwhile even if marriage isn't currently the goal
- Yes — dating does not need to be connected to marriage at all

### Follows `US-035`
`US-035#fu1` · RANK · Level 2 (Everyday) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Approved

Which parts of our connection would you most want to remain strong throughout our marriage? Rank them.

- Deep friendship
- Romance
- Physical and sexual attraction
- Emotional closeness
- Shared faith
- Fun and laughter
- Shared purpose and goals

### Follows `US-036`
`US-036#fu1` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

When do you think it is appropriate to start speaking about each other as part of your long-term future?

- Only after engagement
- Once we've clearly agreed we're dating towards marriage
- Once the relationship becomes exclusive
- Whenever we both feel serious about each other
- Very early — talking about the future is part of finding out whether we're compatible

### Follows `US-037`
`US-037#fu1` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

If someone close to you raised a concern about me or our relationship privately, would you tell me?

- Yes, straight away
- Yes, once I'd thought through whether the concern had merit
- Only if I thought the concern was serious
- Probably not — private conversations should remain private
- No — I would deal with their concern separately from our relationship

### Values & Convictions — 9

### Follows `VAL-001`
`VAL-001#fu1` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

If we had an unexpected pregnancy at a very difficult time, what would you believe we should do?

- Continue the pregnancy regardless of the difficulty
- Continue the pregnancy unless there was a serious threat to the mother's life
- Consider abortion only in exceptional circumstances
- Consider all options together
- I believe the pregnant partner should ultimately decide

### Follows `VAL-002`
`VAL-002#fu1` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

If a close friend or family member invited us to their same-sex wedding, what would you want us to do?

- Decline because attending would feel like affirming something we believe is wrong
- Attend because loving the person doesn't mean agreeing with the marriage
- Attend and fully celebrate the marriage
- Decide individually rather than expecting us both to make the same choice
- I'm unsure

### Follows `VAL-003`
`VAL-003#fu1` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

How should we decide how many children to have or whether to delay pregnancy?

- Remain open to however many children God gives us
- Use natural family planning to space pregnancies
- Intentionally plan our family using contraception
- Make the decision mainly around health, finances and family circumstances
- I'm unsure

### Follows `VAL-003`
`VAL-003#fu2` · SCALE · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

How important would it be to you that we agree on the specific method of contraception or family planning we use?

- Not important
- Slightly important
- Moderately important
- Very important
- Essential — I could not comfortably use a method that conflicted with my convictions

### Follows `VAL-007`
`VAL-007#fu1` · MC · Level 3 (Deeper) · part (advisory): Values & Convictions · Guessable: Yes · Approved

If someone close to us transitioned and asked us to use a new name or pronouns, what would you want us to do?

- I would not use language that I believed affirmed a false gender identity
- I would use their chosen name but not language I believed denied biological sex
- I would use their requested name and pronouns as an act of respect, even if I disagreed
- I would fully affirm their gender identity
- I'm unsure

### Follows `VAL-008`
`VAL-008#fu1` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

If one of us became terminally ill and wanted medically assisted death, what would you believe the other spouse should do?

- Strongly oppose it
- Encourage other forms of care and relief, but ultimately respect their legal choice
- Support their choice if suffering was severe and death was near
- Fully support their right to decide
- I'm unsure

### Follows `VAL-010`
`VAL-010#fu1` · MC · Level 3 (Deeper) · part (advisory): Values & Convictions · Guessable: Yes · Approved

If we strongly disagreed about whether our child should receive a particular vaccine, how should we decide?

- Follow the advice of our child's doctor
- Seek several medical opinions before deciding
- The more cautious parent should be able to say no
- Both parents must agree before the child receives it
- I'm unsure

### Follows `VAL-011`
`VAL-011#fu1` · RANK · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

Which public issues would matter most to you for us to broadly agree on? Rank them from most important to least important.

- Abortion
- Sexuality and gender
- Religious freedom
- Immigration
- Poverty and welfare
- Crime and justice
- Environment and climate
- Role and size of government

### Follows `VAL-012`
`VAL-012#fu1` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

Would you be comfortable with us regularly sleeping overnight at each other's homes before marriage, even if we slept separately?

- No — I would avoid overnight stays
- Only occasionally where there was a practical reason
- Yes, if we slept separately and maintained physical boundaries
- Yes — I don't see overnight stays themselves as a problem
- I'm unsure

## 4. Add as new questions (73)

No IDs yet. "Insert after" is a placement hint, not a requirement.

### In the Home — 1

### New
`NEW-muocv7bg` · SCALE · Level 2 (Everyday) · part (advisory): In the Home · Guessable: Yes · Approved

How much would you want us to invest in making our home look and feel the way we want?

- Very little — as long as it's comfortable and functional
- A little
- A reasonable amount
- Quite a lot — our home environment would matter to me
- A lot — creating a beautiful home would be a real priority

### Finances & Money — 1

### New
`FIN-014#fu1` · MC · Level 3 (Deeper) · part (advisory): Finances & Money · Guessable: Yes · Approved

How would you rate your credit?

- Excellent
- Good
- Fair
- Poor
- Not sure

### Theology & Beliefs — 11

### New  — insert after `THEO-002`
`NEW-muvhp18s` · MC · Level 3 (Deeper) · part (advisory): Theology & Beliefs · Guessable: No · Approved

When Christians disagree about what the Bible teaches, what would you rely on most to work out what is true?

- Study the passage and wider Bible carefully
- Look at how Christians throughout history have understood it
- Seek teaching from trusted pastors or church leaders
- Pray and follow my conscience before God
- Use a combination of these
- I'm not sure

### New  — insert after `THEO-005`
`NEW-muvi9ve1` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Draft

What do you believe about speaking in tongues specifically?

- A gift some believers receive when filled with the Holy Spirit
- A gift available to all believers, though not everyone uses it
- A real gift, but widely misused in churches today
- It ceased with the apostolic era
- I'm unsure

### New  — insert after `THEO-009`
`NEW-muviovr7` · MC · Level 2 (Everyday) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

How often do you think Christians should ideally take Communion?

- Daily or almost daily
- Weekly
- A few times a month
- Monthly or occasionally
- Only at certain church services or special occasions
- I don't think there needs to be a set rhythm
- I'm not sure

### New  — insert after `THEO-009`
`NEW-muviq6iv` · MC · Level 2 (Everyday) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

What would you want Communion to look like in our life together?

- Mainly take it together when our church offers it
- Attend church Communion regularly and sometimes take it together at home
- Make taking Communion together at home a regular part of our faith
- Take it together occasionally during meaningful spiritual moments
- I wouldn't feel a need for us to take Communion privately as a couple
- I'm not sure yet

### New  — insert after `THEO-010`
`NEW-muvhskf6` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Do you believe God created us ONLY as man and woman?

- Yes — male and female are God-given realities
- Yes biologically, though someone may experience their gender differently
- I believe gender identity can differ from biological sex
- I believe anyone can identify as whatever they identify with
- I'm still working out what I believe

### New  — insert after `THEO-010`
`NEW-muvhufuw` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Do you believe a Christian should affirm someone identifying as a gender different from their biological sex?

- No — Christians should affirm biological sex as God-given
- Treat the person with love and respect, but don't affirm the changed identity
- It depends on the individual situation
- Yes — affirming their gender identity is compatible with Christian faith
- I'm still working it out

### New  — insert after `THEO-010`
`NEW-muvhuudp` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Do you believe same-sex sexual relationships can be consistent with Christian faith?

- No — Scripture reserves sex for marriage between a man and a woman
- I believe the traditional teaching, but I'm still working through how it should be applied
- Some committed same-sex relationships can be compatible with Christian faith
- Yes — same-sex relationships can be fully affirmed
- I'm still working it out

### New  — insert after `THEO-010`
`NEW-muvhvx1v` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Do you believe sex should only take place within marriage?

- Yes — sex belongs only within marriage
- Yes as the Christian ideal, though I see more complexity around failure and past choices
- It depends on the commitment between the couple
- No — marriage isn't necessary for sex to be morally right
- I'm still working it out

### New  — insert after `THEO-010`
`NEW-muvhwocj` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Do you believe marriage, as God designed it, is only between a man and a woman?

- Yes
- Yes as a Christian definition of marriage, while civil marriage can be broader
- I believe Christian marriage can include same-sex couples
- I'm still working it out

### New  — insert after `THEO-010`
`NEW-muvi2zu9` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

How do you understand predestination and free will in salvation?

- God sovereignly chooses who will be saved
- God offers salvation to everyone and people freely choose whether to respond
- God's sovereignty and human choice are both true, even if I can't fully explain how
- I don't think the distinction matters much
- I'm still working it out

### New  — insert after `THEO-010`
`NEW-muvi50d4` · MC · Level 5 (Hot-button) · part (advisory): Theology & Beliefs · Guessable: Yes · Approved

Can someone who is genuinely saved later lose their salvation?

- No — someone truly saved cannot finally be lost; anyone who permanently walks away was never truly saved
- Yes — a believer can later reject the faith and lose their salvation
- I'm not sure

### Parenting style — 5

### New  — insert after `PAR-007`
`NEW-muvjhbdp` · SCALE · Level 2 (Everyday) · part (advisory): Parenting style · Guessable: Yes · Approved

How strict should we be about what our children watch, listen to and play?

- Mostly let them choose for themselves
- Light boundaries
- Age-appropriate limits and some monitoring
- Strong boundaries around content
- Very careful — actively restrict content that conflicts with our faith and values

### New  — insert after `PAR-007`
`NEW-muvjhpaw` · MC · Level 3 (Deeper) · part (advisory): Parenting style · Guessable: Yes · Approved

How would you want our teenagers to approach dating?

- No dating until they're older or ready for marriage
- Intentional courtship with strong parental involvement
- Dating is fine with clear Christian boundaries and our involvement
- Let them date normally while teaching them our values
- Decide based on the individual child

### New  — insert after `PAR-007`
`NEW-muvjhw4w` · MC · Level 3 (Deeper) · part (advisory): Parenting style · Guessable: Yes · Approved

Who should take primary responsibility for teaching our children about sex and relationships?

- Both parents together
- Primarily the parent of the same sex
- Parents should lead, with church teaching supporting us
- School education is fine, with us discussing it at home
- Use a mixture of parents, church and school

### New  — insert after `PAR-007`
`NEW-muvjiu11` · MC · Level 5 (Hot-button) · part (advisory): Parenting style · Guessable: Yes · Approved

If one of our teenage children told us they were in a same-sex relationship, how would you want us to respond?

- Fully affirm and support the relationship
- Love and support our child while being clear we don't believe the relationship is right
- Tell them we don't permit the relationship while they're living under our authority
- I'm not sure

### New  — insert after `PAR-007`
`NEW-muvjmpje` · MC · Level 5 (Hot-button) · part (advisory): Parenting style · Guessable: Yes · Approved

If one of our children said they identified as a different gender, non-binary etc. how would you want us to respond?

- Fully affirm their gender identity, including their chosen name and pronouns
- Use their chosen name and pronouns while taking time to understand what they're experiencing
- Love and support them, but continue affirming their biological sex
- Try to help them change their mind
- I'm not sure

### Intimacy & Physical — 3

### New  — insert after `INT-002`
`NEW-muvl4int` · MC · Level 4 (Vulnerable) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

What is your conviction about touching intimate parts of each other's bodies before marriage?

- It should be completely reserved for marriage
- We should avoid it, even over clothing
- Some touching is acceptable, but intimate sexual touching is not
- I don't believe it necessarily needs to wait until marriage
- I'm unsure

### New  — insert after `INT-002`
`NEW-muvl54df` · MC · Level 4 (Vulnerable) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

Would you be comfortable with us lying in bed together or sleeping in the same bed before marriage?

- No, I would avoid it completely
- Only in exceptional circumstances, with clear boundaries
- Lying together is fine, but not sleeping overnight together
- Sleeping in the same bed is fine if we aren't having sex
- I have no issue with it

### New  — insert after `INT-002`
`NEW-muvl6yb0` · MC · Level 4 (Vulnerable) · part (advisory): Intimacy & Physical · Guessable: Yes · Approved

What is your conviction about seeing each other naked before marriage?

- It should be completely reserved for marriage
- I would strongly prefer to avoid it
- It depends on the situation
- I don't believe nudity itself needs to wait until marriage
- I'm unsure

### Roles & Responsibilities — 12

### New  — insert after `ROLE-001`
`NEW-muvgozuu` · RANK · Level 3 (Deeper) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

What responsibilities matter most when you think about leadership in marriage? Rank them from most important to least important.

- Serving and sacrificing for the family
- Making wise decisions
- Providing financially
- Protecting the family
- Leading spiritually
- Creating stability and direction

### New  — insert after `ROLE-005`
`NEW-muvgrkol` · SCALE · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

How strongly do you believe a mother should be the primary caregiver while her children are young?

- Not at all — parenting should be equally shared
- Slight preference for the mother taking more responsibility
- Ideally the mother would take the larger role if possible
- I strongly believe the mother should be the primary caregiver
- I believe caring for young children is primarily the mother's role

### New  — insert after `ROLE-005`
`NEW-muvgry18` · MC · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

If having children meant one career needed to take a back seat, whose would you normally expect it to be?

- The wife's
- The husband's
- Whoever earns less
- Whoever has the more flexible career
- Whoever most wants to focus on raising the children
- Decide entirely case by case

### New  — insert after `ROLE-005`
`NEW-muvgsfe4` · SCALE · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

If one of us works significantly more hours than the other, how should household responsibilities change?

- They should still be divided equally
- Mostly equal, with some adjustment
- The person with more time should do somewhat more
- The person with more time should do substantially more
- Responsibilities should largely reflect each person's available time

### New  — insert after `ROLE-005`
`NEW-muvgszs9` · SCALE · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

Should earning more money give someone more say in family decisions?

- No — income should never determine authority
- Very little
- Sometimes, especially on financial matters
- The main provider should usually have greater say financially
- Providing financially should come with greater decision-making responsibility

### New  — insert after `ROLE-005`
`NEW-muvguf5h` · MC · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

Who would you naturally expect to carry most of the planning and organising of family life?
Things like appointments, school dates, birthdays, forms, plans and things that need doing.

- Mostly the wife
- Mostly the husband
- Shared equally
- Divide different areas between us
- Whoever is naturally better organised

### New  — insert after `ROLE-005`
`NEW-muvguwkz` · SCALE · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

How strongly do you believe husbands and wives have different God-given roles in marriage?

- I don't believe their roles should differ because of gender
- Mostly the same roles, with a few differences
- Some distinct roles, but much is shared
- Husbands and wives have clearly different responsibilities
- I strongly believe God designed distinct roles for husbands and wives

### New  — insert after `ROLE-005`
`NEW-muvgvagk` · MC · Level 3 (Deeper) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

If the husband earns the income and the wife stays home to raise the children, how should we view their contributions to the family?

- His financial contribution carries more responsibility
- His contribution carries slightly more weight
- Their contributions are different but equally valuable
- Her role at home deserves particular honour because of the sacrifice involved
- I'm not sure

### New  — insert after `ROLE-005`
`NEW-muvgvq1q` · MC · Level 2 (Everyday) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

What would you want us to do about surnames if we married?

- Both use the husband's surname
- Each keep our own surname
- Use a double-barrelled or combined surname
- Be open to either person's surname
- I don't have a strong preference

### New  — insert after `ROLE-005`
`NEW-muvgwa3o` · MC · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

How strongly do you believe a wife should submit to her husband's leadership in marriage?

- I don't believe a wife has a distinct duty to submit to her husband
- I see submission mainly as mutual between husband and wife
- I believe wives should respect their husband's leadership, but decisions remain shared
- I believe a wife should normally follow her husband's leadership
- I strongly believe biblical marriage includes a wife's submission to her husband

### New  — insert after `ROLE-005`
`NEW-muvgwv73` · SCALE · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved

How strongly do you believe the home and family should be a wife's primary responsibility?

- I don't — responsibility should be shared without gender expectations
- Slightly — I naturally see the wife doing somewhat more
- It depends on the couple and circumstances
- Strongly — I believe the wife should normally take primary responsibility
- Very strongly — I see caring for the home and family as a central responsibility of the wife

### New  — insert after `ROLE-005`
`NEW-muvgxb0d` · SCALE · Level 4 (Vulnerable) · part (advisory): Roles & Responsibilities · Guessable: Yes · Approved · replaces ROLE-004

How strongly do you believe providing and protecting should be the husband's primary responsibility?

- I don't — those responsibilities should be equally shared
- Slightly — I naturally see the husband doing somewhat more
- It depends on the couple and circumstances
- Strongly — I believe the husband should normally carry primary responsibility
- Very strongly — I see providing and protecting as central responsibilities of the husband

### In-Laws & Extended Family — 3

### New  — insert after `INLAW-001`
`NEW-muvloeop` · MC · Level 3 (Deeper) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

If one of our families was crossing a boundary in our marriage, who should normally address it?

- The person whose family it is
- We should address it together
- Either of us should feel free to address it directly
- The husband should normally take the lead in protecting the marriage
- It depends on the situation

### New  — insert after `INLAW-002`
`NEW-muvlpdyp` · MC · Level 3 (Deeper) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

If our families have different cultural or family traditions, how should we decide which ones become part of our home?

- Mainly follow the husband's family traditions
- Mainly follow the wife's family traditions
- Blend traditions from both families
- Create mostly new traditions of our own
- Decide tradition by tradition

### New  — insert after `INLAW-004`
`NEW-muvlsli2` · MC · Level 5 (Hot-button) · part (advisory): In-Laws & Extended Family · Guessable: Yes · Approved

If one of your parents repeatedly disrespected your spouse, how far should you be willing to go to protect your marriage?

- Speak privately to my parent and ask them to stop
- Set clear boundaries with my parent
- Reduce how much contact we have if it continues
- Cut contact for a period if necessary
- My spouse should try to tolerate it because they're still my parent
- It depends on how serious the behaviour is

### Health & Lifestyle — 1

### New
`HEALTH-003#fu2` · SCALE · Level 1 (Warm-up) · part (advisory): Health & Lifestyle · Guessable: Yes · Approved

How much would you want us to protect time for rest in our normal routine?

- Not much — I like life busy and full
- A little
- A healthy balance
- Quite a lot
- A lot — regular rest should be a real priority

### Dreams & Future — 6

### New  — insert after `DREAM-002`
`NEW-muwnakva` · RANK · Level 2 (Everyday) · part (advisory): Dreams & Future · Guessable: Yes · Approved

Which parts of married life would you most want us to get right? Rank them from most important to least important.

- Our relationship with God
- Friendship and enjoying each other
- Communication and conflict
- Raising a family
- Financial stability
- Supporting each other's individual goals

### New  — insert after `DREAM-002`
`NEW-muwnb1mz` · MC · Level 1 (Warm-up) · part (advisory): Dreams & Future · Guessable: Yes · Approved

If money and work weren't limiting us, what kind of life would you most want us to build?

- A peaceful, settled family life
- A life full of travel and new experiences
- A life focused on serving God and other people
- An ambitious life building businesses, careers or projects
- A simple life with plenty of time and freedom
- A mixture of several of these

### New  — insert after `DREAM-002`
`NEW-muwnbdjk` · MC · Level 1 (Warm-up) · part (advisory): Dreams & Future · Guessable: Yes · Approved

Which future milestone would excite you most?

- Getting married
- Buying or creating our ideal home
- Having children
- Becoming financially free
- Travelling somewhere we've always dreamed of
- Building or achieving something significant together

### New  — insert after `DREAM-002`
`NEW-muwnc3p5` · RANK · Level 2 (Everyday) · part (advisory): Dreams & Future · Guessable: Yes · Approved

What kind of legacy would you most want us to leave? Rank these from most important to least important.

- Children and family who know they were deeply loved
- A strong Christian faith passed to the next generation
- People whose lives were better because we helped them
- Financial security or opportunities for future generations
- Meaningful work or something we built
- Memories of a life well enjoyed together

### New  — insert after `DREAM-002`
`NEW-muwncem8` · SCALE · Level 2 (Everyday) · part (advisory): Dreams & Future · Guessable: Yes · Approved

How much would you want us to take big risks to pursue a dream together?

- Very little — I'd strongly prefer stability
- Only small, calculated risks
- A balance of security and risk
- I'd be willing to take significant risks for the right dream
- A lot — I'd rather take the chance than wonder what could have been

### New  — insert after `DREAM-002`
`NEW-muwnen5a` · SCALE · Level 3 (Deeper) · part (advisory): Dreams & Future · Guessable: Yes · Approved

How much of your personal dreams would you be willing to give up if they conflicted with what was best for our marriage or family?

- Very little — I wouldn't want marriage to cost me my individual dreams
- Some, but I'd want to protect my main goals
- We'd need to find a balance
- Quite a lot for the good of our family
- Whatever was necessary — marriage and family would take priority

### Past & Baggage — 7

### New  — insert after `PAST-006`
`NEW-muvm9ka6` · MC · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: Yes · Approved

Which best describes your relationship with your father or paternal figure?

- Very close and supportive
- Generally good, with some tension
- Complicated
- Distant
- Strained or conflictual
- No meaningful relationship / he wasn't present

### New  — insert after `PAST-006`
`NEW-muvma6en` · OPEN · Level 3 (Deeper) · part (advisory): Past & Baggage · Guessable: No · Approved

What about your relationship with your parents or the people who raised you would you most want me to understand?

### New  — insert after `PAST-010`
`NEW-muvmkn7r` · OPEN · Level 5 (Hot-button) · part (advisory): Past & Baggage · Guessable: No · Approved

Is there anything involving abuse, violence, serious addiction or major trauma in your past that you believe I should understand before marriage?

### New  — insert after `PAST-011`
`NEW-muvmhvvj` · MC · Level 5 (Hot-button) · part (advisory): Past & Baggage · Guessable: Yes · Approved

Have you ever been unfaithful in a previous relationship?

- No
- Yes — emotionally, but not physically
- Yes — physically, but not sexually
- Yes — sexually
- Yes — in more than one of these ways
- I've never had a previous relationship where this applies

### New  — insert after `PAST-011`
`NEW-muvminyx` · MC · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: Yes · Approved

What is the most serious commitment you've had before this relationship?

- I've never had a serious romantic relationship
- A serious long-term relationship
- We lived together
- We were engaged
- I was previously married and divorced/separated
- I was previously married and widowed

### New  — insert after `PAST-011`
`NEW-muvmjt5v` · OPEN · Level 5 (Hot-button) · part (advisory): Past & Baggage · Guessable: No · Approved

Is there anything from your past that you're afraid could change how I see you if I knew the full story?

### New  — insert after `PAST-011`
`NEW-muvmk6or` · MC · Level 4 (Vulnerable) · part (advisory): Past & Baggage · Guessable: Yes · Approved

Have you ever had serious legal or criminal issues that could affect our future together?

- No
- Yes, but they are completely resolved
- Yes, and there are still some consequences or restrictions
- Yes, and there is an ongoing legal issue
- There is something I need to explain properly

### Us & Compatibility — 17

### New  — insert after `US-016`
`NEW-muwo43bb` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Approved

What makes you feel most emotionally chosen by me?

- When you prioritise time with me
- When you defend or stand up for me
- When you ask what I'm thinking or feeling
- When you show affection without me asking
- When you include me in your plans and decisions
- When you speak positively about me to other people
- When you make sacrifices for me

### New  — insert after `US-017`
`NEW-muwovpk0` · SCALE · Level 2 (Everyday) · part (advisory): Us & Compatibility · The Big Picture · Guessable: Yes · Approved

How much do you expect marriage to change the way you live your life?

- Very little — I expect most of my life to stay much the same
- Some adjustments
- A meaningful balance of continuity and change
- A lot — marriage should reshape many of my priorities
- Completely — becoming one household should fundamentally change how I make decisions and live

### New  — insert after `US-017`
`NEW-muwowe7q` · RANK · Level 2 (Everyday) · part (advisory): Us & Compatibility · The Big Picture · Guessable: Yes · Approved

Which things would you most want people to say about our marriage one day? Rank them.

- They really love God
- They genuinely love and enjoy each other
- They are completely loyal to one another
- They built a strong family
- They are generous and serve other people
- They work as an incredible team
- They built a meaningful and successful life together

### New  — insert after `US-017`
`NEW-muwoxkz6` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · The Big Picture · Guessable: Yes · Approved

If our marriage was happy and loving but never achieved the lifestyle, career or financial success we'd hoped for, would you still consider it a successful marriage?

- Yes — the quality and faithfulness of the marriage matters far more than external success
- Yes, although I would still feel disappointed about what we hadn't achieved
- Partly — I need both a strong marriage and meaningful progress in life
- I would struggle to feel successful if we hadn't built the life we'd planned
- No — achieving our wider goals is an important part of what marriage success means to me

### New  — insert after `US-032`
`NEW-muyccw9l` · MC · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If caring for our children consistently started pushing our marriage relationship into the background, what should we do?

- Our marriage should be intentionally restored as the priority under God
- Children should remain the main practical priority while they're young
- Accept that marriage naturally takes a back seat during some parenting seasons
- Protect both equally even if other areas of life have to suffer
- I haven't thought about it

### New  — insert after `US-032`
`NEW-muycddq3` · MC · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If our marriage went through a long season where you were unhappy, what would commitment mean to you?

- Stay and keep working on the marriage regardless of how long the season lasts
- Stay unless there is a biblically valid reason to end the marriage
- Stay while both people are genuinely trying to improve things
- Give it a serious period of effort, but leave if nothing changes
- Personal happiness is important enough that a persistently unhappy marriage may need to end

### New  — insert after `US-032`
`NEW-muycdmpy` · MC · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If your spouse changed significantly after marriage and became very different from the person you married, what would you believe commitment requires?

- Remain committed because marriage is a lifelong covenant regardless of how much they change
- Remain committed unless they break the marriage covenant in a biblically serious way
- Work hard to adapt and rebuild the relationship, but recognise there may be a limit
- Stay only if the new version of the relationship remained healthy
- If we became fundamentally incompatible, ending the marriage could be right

### New  — insert after `US-032`
`NEW-muycdoov` · MC · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If one of us developed a serious long-term illness or disability that radically changed our life together, what would you believe marriage requires?

- Stay fully committed and personally carry whatever responsibility marriage requires
- Stay committed while bringing in as much family or professional support as necessary
- Remain married, but recognise that caregiving may need to be largely handled by others
- I don't know how much caregiving I could realistically take on
- I would see some circumstances as potentially changing what could reasonably be expected of the marriage

### New  — insert after `US-032`
`NEW-muycdrpx` · MC · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Commitment & Reality · Guessable: Yes · Approved

If we had a major marriage problem and one of us wanted counselling but the other refused, what should happen?

- The refusing spouse should still be expected to attend for the sake of the marriage
- Keep asking and involve trusted church leadership or mentors
- The willing spouse should seek help alone first
- Counselling should never be forced; both must choose it
- Refusing all help for a serious problem would make me question the marriage

### New  — insert after `US-035`
`NEW-muwo2oxh` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Approved

When do you feel closest to me?

- When we're having a deep conversation
- When we're laughing and having fun
- When we're physically affectionate
- When we're praying, worshipping or talking about God
- When we're doing something or going somewhere together
- When you support me through something difficult
- When we're simply relaxing together

### New  — insert after `US-035`
`NEW-muwo39l1` · MC · Level 1 (Warm-up) · part (advisory): Us & Compatibility · Heart & Connection · Guessable: Yes · Approved

Which version of “us” do you enjoy most?

- Us on a proper date
- Us travelling or exploring somewhere
- Us at home doing absolutely nothing
- Us laughing and being silly
- Us having a deep conversation
- Us worshipping, praying or serving together
- Us working towards a goal together

### New  — insert after `US-036`
`NEW-muyctgpj` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

How soon into dating do you think a relationship should become exclusive?

- From the beginning — if we're dating, we shouldn't date other people
- After a few dates once there's clear mutual interest
- Once we've had an explicit conversation about exclusivity
- Only once the relationship becomes serious
- Dating multiple people is fine until there's a formal commitment

### New  — insert after `US-036`
`NEW-muyctwfk` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

How long do you think a couple should ideally know each other before getting engaged?

- Less than 6 months can be enough
- Around 6–12 months
- At least 1–2 years
- More than 2 years
- Time matters less than what the couple has actually worked through together

### New  — insert after `US-036`
`NEW-muycuhc8` · RANK · Level 3 (Deeper) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

What would you most want us to experience together before getting engaged? Rank these

- A serious disagreement or difficult conversation
- Spending significant time with each other's families
- Seeing each other under stress
- Travelling or spending extended time together
- Working through money and future plans
- Serving or being involved in church together
- Going through premarital counselling or mentoring

### New  — insert after `US-036`
`NEW-muycvodl` · MC · Level 3 (Deeper) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

When should we start having serious conversations about marriage?

- Very early — if marriage is the goal of dating, we should talk about it from the beginning
- Once we know there is strong mutual interest
- Once we're exclusive
- Once the relationship has become clearly serious
- Only when one of us is seriously thinking about engagement
- I prefer relationships to develop naturally without much marriage talk early on

### New  — insert after `US-036`
`NEW-muycxb21` · SCALE · Level 4 (Vulnerable) · part (advisory): Us & Compatibility · Pace & Intentions · Guessable: Yes · Approved

How comfortable would you be ending a good relationship if, after enough time, it wasn't clearly moving towards marriage?

- Very uncomfortable — I'd keep giving it time
- I'd find it difficult to walk away
- It would depend how much potential I still saw
- I would be prepared to end it rather than stay indefinitely
- Very comfortable — if marriage is the goal and we're not moving towards it, I wouldn't want to waste either person's time

### New  — insert after `US-039`
`NEW-muydvpmp` · MC · Level 2 (Everyday) · part (advisory): Us & Compatibility · Our Circle · Guessable: Yes · Approved

After marriage, how important is it to you that we build friendships with other couples?

- Very important — I'd want close couple friendships
- Important, but not essential
- Nice to have, but individual friendships matter more
- I don't particularly need couple friends
- I'd prefer most of our social life to stay separate rather than shared

### Values & Convictions — 6

### New  — insert after `VAL-004`
`NEW-muwli61l` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

If a spouse was abusive, what do you believe the other spouse should be free to do?

- Separate immediately for safety, but I would not see divorce as biblically permitted
- Separate and pursue repentance, accountability and possible reconciliation
- Divorce is morally justified in serious abuse
- Divorce and eventual remarriage can both be justified
- I'm unsure

### New  — insert after `VAL-004`
`NEW-muwli831` · MC · Level 5 (Hot-button) · part (advisory): Values & Convictions · Guessable: Yes · Approved

After divorce, when do you believe remarriage is morally or biblically acceptable?

- Never while the former spouse is alive
- Only if the divorce happened on biblically permitted grounds
- If the former spouse has remarried or permanently moved on
- After genuine healing and repentance, regardless of why the marriage ended
- Remarriage is generally acceptable after divorce
- I'm unsure

### New  — insert after `VAL-012`
`NEW-muwlyt9p` · MC · Level 4 (Vulnerable) · part (advisory): Values & Convictions · Guessable: Yes · Approved

How do you feel about IVF if we struggled to conceive naturally?

- I would be against IVF on moral or Christian grounds
- I would only consider IVF if every embryo created was intended to be given a chance at life
- I would consider IVF but have ethical concerns about how embryos are created, selected or stored
- I am broadly comfortable with IVF
- I'm unsure

### New  — insert after `VAL-012`
`NEW-muwlzsgd` · MC · Level 4 (Vulnerable) · part (advisory): Values & Convictions · Guessable: Yes · Approved

Would you be comfortable using donor sperm or donor eggs to have a child?

- No — I believe a child should be biologically connected to both spouses
- No personally, though I don't believe it is always morally wrong
- I would consider it only if no other route worked
- Yes — I would be comfortable with donor sperm or eggs
- I'm unsure

### New  — insert after `VAL-012`
`NEW-muwm1euz` · MC · Level 4 (Vulnerable) · part (advisory): Values & Convictions · Guessable: Yes · Approved

Would you be comfortable using a surrogate to have our child?

- No — I would be morally opposed
- No personally, though I don't believe all surrogacy is morally wrong
- Only in exceptional medical circumstances
- Yes, if the arrangement was ethical and carefully regulated
- Yes — I would be comfortable with surrogacy
- I'm unsure

### New  — insert after `VAL-012`
`NEW-muwm1vc0` · SCALE · Level 3 (Deeper) · part (advisory): Values & Convictions · Guessable: Yes · Approved

How important is modesty in how you believe we should dress and present ourselves after marriage?

- Not particularly important
- Slightly important
- Moderately important
- Very important
- Extremely important — I believe Christians should have clear standards of modesty

## 5. Unchanged (80)

Text and options untouched. Their `guessable` and `status` values may still change per the
decisions above.

`CAREER-001`, `CAREER-003`, `CAREER-004`, `CAREER-005`, `CAREER-006`, `CAREER-007`, `CAREER-008`, `CAREER-009`, `CAREER-010`, `CONF-002`, `CONF-006`, `CONF-012`, `CONF-015`, `CONF-016`, `CONF-021`, `DEAL-004`, `DEAL-006`, `DEAL-007`, `DEAL-008`, `DREAM-001`, `DREAM-003`, `DREAM-004`, `FAITH-001`, `FAITH-003`, `FAITH-004`, `FAITH-007`, `FAITH-015`, `FAITH-016`, `FAITH-017`, `FAITH-018`, `FAITH-020`, `FAITH-021`, `FAITH-022`, `FAITH-024`, `FAITH-025`, `FAITH-026`, `FAITH-028`, `FAITH-030`, `FAITH-031`, `FAITH-033`, `FAM-001`, `FAM-004`, `FIN-004`, `FIN-011`, `HEALTH-009`, `HOME-006`, `HOME-007`, `HOME-008`, `HOME-009`, `INLAW-006`, `INT-001`, `INT-008`, `INT-012`, `SELF-001`, `SELF-004`, `SELF-006`, `SELF-008`, `SELF-012`, `SELF-013`, `SELF-018`, `SELF-020`, `SELF-021`, `SELF-022`, `SELF-023`, `SELF-024`, `SELF-025`, `SELF-026`, `THEO-007`, `US-002`, `US-006`, `US-008`, `US-010`, `US-011`, `US-016`, `US-029`, `US-030`, `US-034`, `US-035`, `US-038`, `US-040`

## Final shape

| Workbook category (map onto repo parts) | Active |
|---|---|
| In the Home | 13 |
| Finances & Money | 24 |
| Faith & Worship practice | 36 |
| Theology & Beliefs | 25 |
| Family & Children | 13 |
| Parenting style | 19 |
| Intimacy & Physical | 29 |
| Roles & Responsibilities | 17 |
| Conflict & Communication | 33 |
| In-Laws & Extended Family | 16 |
| Fun & Icebreakers | 15 |
| Deal-breakers | 9 |
| Health & Lifestyle | 15 |
| Dreams & Future | 13 |
| Past & Baggage | 26 |
| Career & Ambition | 10 |
| Character & Self-Awareness | 32 |
| Us & Compatibility | 85 |
| Values & Convictions | 26 |
| **Total** | **456** |

Formats: MC 250 · SCALE 132 · RANK 41 · OPEN 31 · HHB 2

Guessable: Yes 416 · No 40

Levels: 1 (Warm-up) 58 · 2 (Everyday) 175 · 3 (Deeper) 87 · 4 (Vulnerable) 63 · 5 (Hot-button) 73