# Security rules — status & verification

`database.rules.json` implements the write side of the onboarding spec v2 §9.
**These rules do not auto-deploy** (the GitHub Action deploys Hosting only). They
take effect only when someone runs `firebase deploy --only database`, so this
change is safe to merge — production keeps its current rules until you deploy.

Per CLAUDE.md §7 and spec v2 §9, **verify on a dev target with two test accounts
before deploying.**

## What's enforced now (deployable)

- **Write-once answers / guesses / importance.** `!data.exists()` at
  `sessions/{code}/decks/{slug}/{answers|guesses|importance}/{qid}/{role}`.
  Nobody can change an answer after the fact.
- **Role integrity.** A member can only write their *own* role's leaf — you
  can't write your partner's answer. Enforced by matching
  `members/{role}/uid === auth.uid`.
- **Create-once sessions.** `sessions/{code}` is writable only when it doesn't
  exist yet (the host skeleton); all subsequent member writes go through the leaf
  rules above. Guest join stays server-side (the `joinByCode` / `redeemInvite`
  Cloud Functions run with admin and bypass rules).
- **Consent node.** `consents/{uid}` — own read/write only (unbundled per §2).

### The two manual checks before `firebase deploy --only database`
1. A second write to an answer that already exists is **rejected**.
2. A member cannot write the other role's answer leaf.
Plus a regression pass: create a session, join by code, answer, mark a part done,
reveal — all still work.

## Answers private until you've both finished a part (design refresh, item 5)

Built and emulator-tested (`npm run test:rules`, `src/lib/privacy.rules.test.ts`).
This replaces the per-answer read gate that used to be staged here.

- **Your answers, guesses and importance ratings** are written to
  `private/{uid}/{code}/decks/{slug}/{answers|guesses|importance}/{qid}`.
  Only you can read or write it; entries are scalars, only for a session
  you're a member of, and you can revise them until the part opens (the guess
  screen's "change").
- **The shared session holds no answers until a part opens.** No client can
  write `sessions/{code}/decks/{slug}/{answers|guesses|importance}` at all, nor
  the `published` / `pathPublished` stamps, nor create a session that already
  carries answers, flags, a path or a guest.
- **A part opens when both "done" flags are in.** The `publishPart` callable
  (and the reveal-email trigger, once that's deployed) copies exactly that
  part's entries for both partners into the shared session and stamps it
  published, in one atomic update. An entry already in the shared session is
  never rewritten, so once a part opens its answers can't change. Each partner can only write their own role's
  `done` / `started` / `pathDone` flag, so neither can open the other's answers
  early. Path steps use `pathDone/{step}/{role}` and `pathPublished/{step}`.
- **Partner status** ("Judah hasn't started this part yet") reads only the
  shared `started` and `done` flags.
- **Export and delete** include and purge the private space.
- **Existing sessions** need the one-off move in
  `scripts/migrate-private-answers.mjs` (dry run by default; emulator-tested).

### Deploy order (Dave)

1. `firebase deploy --only functions` (adds `publishPart`).
2. `firebase deploy --only database` (the new rules).
3. Deploy Hosting (the client that writes to the private space).
4. Run the migration dry run against live, check it, then `--apply`.

Between 2 and 3, a client still on the old build cannot save answers (the old
write path is closed), so do 2 and 3 back to back.

## Superseded: the both-answered READ gate (kept for history)


The spec also wants a partner's answer to be **unreadable until both roles have
answered it** — enforced server-side, not in the client. That is intentionally
**not active** in this file, because it cannot ship without a client change:

- RTDB read rules cascade — a `.read` granted at `sessions/{code}` grants read to
  the whole subtree, so a per-answer gate can only work if the session-level read
  is **removed** and reads move to the leaves.
- The current client (`useSession`) reads the whole session in one `onValue`.
  Under a leaf-level read gate that call is denied outright, so the client must be
  reworked to read metadata + per-answer paths.

Target read rule (enable together with the `useSession` rework, then re-verify):

```
sessions/{code}/decks/{slug}/answers/{qid}
  ".read": "member && (data.numChildren() >= 2
             || data.child(<my role>).exists())"
```

with the session-level `.read` narrowed to metadata only. This is the one
remaining piece of §9 and should be built and verified against a dev target with
two accounts, not shipped blind — it reworks the live reveal read path.
