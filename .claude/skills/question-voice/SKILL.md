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

Partly approved: "Which character traits come most naturally to you?" He liked
the simpler rewrite ("Which of these are you naturally best at?") and also
wanted to keep "character traits". Use both: "Which of these character traits
come most naturally to you?"

## Still to learn

- Voice per stage (friends, in a relationship, engaged, married).
- Voice for the guess wording and for open "at the table" questions.
