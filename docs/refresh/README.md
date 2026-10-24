# Design refresh: handoff for the build

Everything a build session needs, in one place.

| File | What it is |
|---|---|
| `../DESIGN-REFRESH-PLAN.md` | The order of work: seven phases, each item with "Done when". |
| `../design-system.md` | The rules every screen follows. |
| `DECISIONS.md` | Every decision from the walkthrough (items 1–17 and the UX laws review), with what was rejected and why. The **Decided** box at the end of each item wins. |
| `mockups/` | The approved mockups referenced in DECISIONS.md. Match them. |
| `part-names.json` | The 56 approved part names, by deck slug, in today's part order (item 11). |
| `reveal-library.json` | The 35 encouragement lines and 15 verses by range (item 2). |

## Dave's answers to every "Needs you" (given 24 Oct)

1. **CLAUDE.md points to `docs/design-system.md`.** Done.
2. **Avatar colours follow the role:** the host is always claret, the guest always honey, on both phones.
3. **Last-question line:** "Once you've both finished this part, you're ready to talk it through together."
4. **Importance:** three buttons, A little / Somewhat / A lot (stored as 1, 3, 5). **Scale labels:** bigger and darker. Both yes.
5. **Data migrations** (unopened answers into private spaces; re-asking the 18 Him/Her questions): write them and test them in the emulator only. Don't run them against the live database. Dave runs them after checking.
6. **ESV:** build with the ESV verses and a copyright notice on the About page. Dave confirms Crossway's terms before release.
7. **Path illustrations:** ship the code-drawn landmarks; Dave's illustrations drop in later.
8. **Reviews** (emulator results, About page wording, phone checks) go in the morning report. They don't stop the build.

## Rules for the build

- Work on `claude/design-refresh`. Never deploy to twoagree.app or any Firebase project, never run anything against the live database, never invite testers.
- Phase 1 first, in plan order. Commit after every item that's green, with a clear message, and push.
- Every change passes `npm test`, the type check, `npm run build` (which includes the gallery leak check), the rules/emulator tests where the backend changes, and `npm run build:gallery`.
- After each phase, re-capture the gallery screens (`npm run capture:gallery`) and refresh `review/` so Dave can see the result.
- If something can't be made to work and proven, stop that item at a clean commit, note it in the report, and move to the next item that doesn't depend on it.
- Finish with `docs/refresh/REPORT.md`: what's done per phase, test results, what's left, anything Dave should check, and links to the regenerated screens.
