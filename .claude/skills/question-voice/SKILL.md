---
name: question-voice
description: The voice for TwoAgree questions and answer choices. Load before writing, rewording or reviewing any question in data/questions.json, or any stage wording of one.
---

# TwoAgree question voice

Dave's taste, learned from his own corrections. Every rule below comes from a
change he made or approved. When he corrects a new batch, add the correction
here as a rule or an example.

The target is how someone would ask the question out loud, across a table, to a
person they care about. It also has to read easily for someone whose first
language isn't English.

## Rules

1. **Everyday words, not specialist ones.** Say "beliefs about God", not
   "theology". Say "slept at different times", not "sleep schedules".
2. **Say the thing plainly.** "Sex", not "slept with". "Porn", not "pornography
   use". "Cheating", not "sexual unfaithfulness". No euphemisms, and no softening
   of hard topics (CLAUDE.md §1).
3. **Literal, not clever.** Don't write a question to sound punchy or
   provocative. Ask what it actually means.
4. **Ask for their view.** "Do you think…", "What shaped your…", "Which of
   these…". It is a personal question, not a survey item.
5. **Specific beats short.** A longer question that says exactly what is being
   asked is better than a short vague one. (The build's 100-character limit
   still applies.)
6. **Simple is not the same as casual.** Keep a plain, precise word when it
   carries the meaning: "character traits" and "responsibility" are fine.
7. **Avoid words with a second literal meaning.** "Job" for a duty reads as paid
   work to a non-native speaker; say "responsibility". The same goes for idioms
   ("hire it out", "hold me to it").
8. **Answer choices carry the voice too.** Apply every rule to them. Write them
   the way the person would say their answer.
9. **If a reworded question flips or shifts the answers, rewrite the choices to
   match.** A reword of an existing question otherwise keeps the number, order
   and meaning of its choices, because stored answers are positions.

10. **Simplify the words, never the meaning.** Don't narrow or shift what is
    asked while rewording. "Advice about a relationship problem" became "a
    problem in our relationship" and lost the point: it doesn't have to be a
    problem, and the question was about advice.
11. **For a duty, say "responsible for".** Better than "handle", and much better
    than "look after" or "job".

## Approved examples

| Before | After |
|---|---|
| Where did your theology mostly come from? | What shaped your beliefs about God? |
| If our sleep schedules were different, what would matter most to you? | If we slept at different times, what would matter the most to you? |
| Can you fully know someone you've never slept with? | Do you think sex with your partner is needed before you can feel you know them fully? |
| What have we avoided talking about? | Are there any important topics you think we have avoided talking about, that we need to? |
| What legacy would you most want us to leave? | What would you most want the two of us to be remembered for? |
| How strongly do you believe the home and family should be a wife's primary responsibility? | Do you think looking after the home and family is mainly the wife's responsibility? |
| Which parts of our connection would you most want to stay strong through our marriage? | Which of these would you most want us to keep strong once we're married? |
| Would you personally consider pornography use to be a form of sexual unfaithfulness? | Do you think watching porn is a form of cheating? |
| Who should handle home repairs and maintenance? | Who should be responsible for repairs around the home? ("We'd hire it out" → "We'd pay someone to do it") |
| How important is it that your work feels meaningful, versus just paying well? | Which matters more to you in your work: that it pays well, or that it means something to you? (scale: "Pays well" → "Means something to me") |
| If you needed advice about a relationship problem, who would you be most likely to talk to first? | If you wanted advice about our relationship, who would you talk to first? ("{P}, so we could work it out together") |
| How would you ideally want us to educate our children? | How would you want our children to be educated? (Teach them at home / A Christian school / A state school / A private school that isn't faith-based / Whatever suits each child) |
| Which areas would you most value our parents' advice on? | Where would you most want advice from our parents? Rank from most to least. |
| If you changed your mind about wanting children after you married, what would you expect of {P}? | If you stopped wanting children after we married, what would you expect {P} to do? ("Be sad with me, and accept it" / "Expect me to keep to what we agreed") |
| When life becomes extremely difficult, who or what do you most naturally turn to first? | When life gets really hard, who or what do you turn to first? ("Scripture" → "the Bible") |
| How should we decide how many children to have or whether to delay pregnancy? | How should we decide how many children to have, and when? (Have as many children as God gives us / Space them out using natural family planning / Plan our family using contraception / Decide based on our health, money and family life / I'm not sure) |
| How disciplined are you with a monthly budget? | How closely do you keep to a monthly budget? (scale: "I don't really follow one" → "I track everything I spend") |
| (choices) I would think about my faith, but it wouldn't always decide | My faith would matter, but not always decide. Choices use contractions and stay short: "I'd usually follow my faith", "My faith comes first, every time". |

Already right, left alone: "Who's more likely to pray out loud first?"

Partly approved: "Which character traits come most naturally to you?" He liked
the simpler rewrite ("Which of these are you naturally best at?") and also
wanted to keep "character traits". Use both: "Which of these character traits
come most naturally to you?"

## Still to learn

- Voice per stage (friends, in a relationship, engaged, married).
- Voice for the guess wording and for open "at the table" questions.
