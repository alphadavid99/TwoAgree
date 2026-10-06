// Typed, obviously-fictional fixture data. Every person here is a placeholder
// ("Sarah Placeholder", "Judah Placeholder"), every address is @example.invalid
// (a reserved TLD that can never resolve), and every free-text answer says it
// is a sample. No value is derived from a real account or a real session.
import type { User } from 'firebase/auth'
import { DECKS, ORDER, type Question } from '../lib/questions'
import { lvlQs, nLevels } from '../lib/leveling'
import type { DeckData, AnswerValue } from '../lib/scoring'
import { STARTER_QIDS } from '../lib/onboarding'
import type { Profile, Session, Stage } from '../types'

export const HOST_NAME = 'Sarah Placeholder'
export const GUEST_NAME = 'Judah Placeholder'
export const HOST_EMAIL = 'sarah.placeholder@example.invalid'
export const GUEST_EMAIL = 'judah.placeholder@example.invalid'

export const fixtureUser = (
  uid: string,
  o: { anonymous?: boolean; name?: string; email?: string } = {},
): User =>
  ({
    uid,
    isAnonymous: !!o.anonymous,
    displayName: o.anonymous ? null : (o.name ?? HOST_NAME),
    email: o.anonymous ? null : (o.email ?? HOST_EMAIL),
    photoURL: null,
  }) as unknown as User

export const profileOf = (name: string, email: string): Profile => ({
  name,
  email,
  bio: 'Sample bio (fixture): coffee, long walks and a standing Sunday call with my sister.',
  created: 1_700_000_000_000,
  updated: 1_700_000_000_000,
})

// ---- Decks the gallery leans on --------------------------------------------
export const MULTI = ORDER.find((s) => nLevels(s) >= 3) ?? ORDER[0] // mid-deck, several parts
export const FULL = ORDER[1] // fully answered by both
export const FIRST = ORDER[0]
export const SINGLE = ORDER.find((s) => nLevels(s) === 1 && s !== FULL) ?? ORDER[2]
export const STARTER_SLUG = 'fun-icebreakers'

// ---- Answer builders (host and guest deliberately differ a little) ---------
const SAMPLE_OPEN: Record<'host' | 'guest', string> = {
  host: 'Sample answer (fixture): a shared rhythm of prayer matters to me.',
  guest: 'Sample answer (fixture): I want us to keep a weekly habit of reading together.',
}

export function answerFor(
  q: Pick<Question, 'type' | 'opts'>,
  who: 'host' | 'guest',
  i: number,
): AnswerValue {
  if (q.type === 'scale') return who === 'host' ? 4 : i % 3 === 0 ? 4 : 5
  if (q.type === 'mc')
    return who === 'host' ? 0 : i % 2 === 0 ? 0 : Math.min(1, (q.opts?.length ?? 1) - 1)
  if (q.type === 'rank') {
    const n = q.opts?.length ?? 3
    const base = Array.from({ length: n }, (_, k) => k)
    if (who === 'guest' && n > 1) [base[0], base[1]] = [base[1], base[0]]
    return base.join(',')
  }
  return SAMPLE_OPEN[who]
}

/** `levels` parts fully answered by both; optionally the host part-way into the next. */
export function fakeDeck(
  slug: string,
  levels: number,
  hostPartialNext = 0,
  perfect = false,
): DeckData {
  const deck: Required<Pick<DeckData, 'answers' | 'guesses' | 'done'>> = {
    answers: {},
    guesses: {},
    done: {},
  }
  for (let l = 0; l < levels; l++) {
    lvlQs(slug, l).forEach((q, i) => {
      const host = answerFor(q, 'host', i)
      deck.answers[q.id] = { host, guest: perfect ? host : answerFor(q, 'guest', i) }
      if (q.guessable && q.type !== 'rank' && i % 2 === 0) {
        deck.guesses[q.id] = {
          host: deck.answers[q.id].guest!,
          guest: i % 4 === 0 ? deck.answers[q.id].host! : 99,
        }
      }
    })
    deck.done[l] = { host: true, guest: true }
  }
  if (hostPartialNext > 0 && levels < nLevels(slug)) {
    lvlQs(slug, levels)
      .slice(0, hostPartialNext)
      .forEach((q, i) => {
        deck.answers[q.id] = { host: answerFor(q, 'host', i) }
      })
  }
  return deck
}

/** Host finished part 1 of a deck; the guest answered nothing. */
export function hostOnlyDeck(slug: string, level = 0): DeckData {
  const deck: Required<Pick<DeckData, 'answers' | 'done'>> = { answers: {}, done: {} }
  lvlQs(slug, level).forEach((q, i) => {
    deck.answers[q.id] = { host: answerFor(q, 'host', i) }
  })
  deck.done[level] = { host: true }
  return deck
}

/** Shows every flag shape: mutual blind spot, one-sided, and uneven stakes. */
export function flagDeck(slug: string): DeckData {
  const qs0 = lvlQs(slug, 0)
  const mcqs = qs0.filter((q) => q.type === 'mc')
  const scaleqs = qs0.filter((q) => q.type === 'scale')
  const answers: NonNullable<DeckData['answers']> = {}
  const guesses: NonNullable<DeckData['guesses']> = {}
  const importance: NonNullable<DeckData['importance']> = {}
  if (scaleqs[0]) {
    answers[scaleqs[0].id] = { host: 3, guest: 3 }
    importance[scaleqs[0].id] = { host: 5, guest: 1 }
  }
  if (mcqs[0]) {
    answers[mcqs[0].id] = { host: 0, guest: 1 }
    guesses[mcqs[0].id] = { host: 0, guest: 1 }
  }
  if (mcqs[1]) {
    answers[mcqs[1].id] = { host: 0, guest: 1 }
    guesses[mcqs[1].id] = { host: 0 }
  }
  qs0.forEach((q) => {
    if (answers[q.id]) return
    const v = q.type === 'scale' ? 3 : q.type === 'rank' ? q.opts!.map((_, i) => i).join(',') : 0
    answers[q.id] = { host: v, guest: v }
  })
  return { answers, guesses, importance, done: { 0: { host: true, guest: true } } }
}

/** A part pinned to ≈`hit`% agreement, for each rung of the celebration ladder. */
export function tunedReveal(slug: string, hit: number): { deck: DeckData; qs: Question[] } {
  const qs = DECKS[slug].questions.filter((q) => q.type === 'mc')
  const answers: NonNullable<DeckData['answers']> = {}
  qs.forEach((q, i) => {
    const last = (q.opts?.length ?? 2) - 1
    const match = i < Math.round((hit / 100) * qs.length)
    answers[q.id] = { host: 0, guest: match ? 0 : Math.min(1, last) }
  })
  return { deck: { answers, done: { 0: { host: true, guest: true } } }, qs }
}

/** The starter set both partners answer in onboarding (and see revealed). */
export function starterDeck(): DeckData {
  const answers: NonNullable<DeckData['answers']> = {}
  const guesses: NonNullable<DeckData['guesses']> = {}
  const byId = new Map(DECKS[STARTER_SLUG].questions.map((q) => [q.id, q]))
  STARTER_QIDS.forEach((id, i) => {
    const q = byId.get(id)
    if (!q || (q.type !== 'mc' && q.type !== 'scale')) return
    const host = answerFor(q, 'host', i)
    answers[id] = { host, guest: answerFor(q, 'guest', i) }
    guesses[id] = { host: answers[id].guest!, guest: host }
  })
  return { answers, guesses, done: { 0: { host: true, guest: true } } }
}

/** A deck with the talk loop populated (one open, one half-closed, one closed). */
export function talkDeck(slug: string): DeckData {
  const d = fakeDeck(slug, nLevels(slug))
  const mcs = DECKS[slug].questions.filter((q) => q.type === 'mc').slice(0, 3)
  const guesses = { ...(d.guesses ?? {}) }
  mcs.forEach((q) => {
    if (d.answers?.[q.id]?.guest != null) guesses[q.id] = { ...guesses[q.id], host: 99 }
  })
  return {
    ...d,
    guesses,
    talks: {
      [mcs[0].id]: { pinned: { host: true } },
      [mcs[1].id]: { pinned: { guest: true }, talked: { guest: true } },
      [mcs[2].id]: { pinned: { host: true }, talked: { host: true, guest: true } },
    },
  }
}

// ---- The Path ---------------------------------------------------------------
export const PATH_KEYS = [
  'trailhead', 'fork', 'storehouse', 'table', 'garden', 'valley', 'hilltop', 'horizon', 'summit',
]

export const pathOf = (qcount = 63): NonNullable<Session['path']> => ({
  generatedAt: 1,
  version: 1,
  questionCount: qcount,
  steps: Object.fromEntries(
    PATH_KEYS.map((key, i) => [i, { key, mechanic: 'guess' as const, qids: [] as string[] }]),
  ),
})

// ---- Sessions ---------------------------------------------------------------
export type Seat = { host: string; guest?: string }

export function sessionOf(
  seat: Seat,
  o: { stage?: Stage; decks?: Record<string, DeckData>; path?: boolean; lamps?: number } = {},
): Session {
  const s: Session = {
    created: 1_700_000_000_000,
    stage: o.stage ?? 'dating',
    members: {
      host: { name: HOST_NAME, uid: seat.host },
      ...(seat.guest ? { guest: { name: GUEST_NAME, uid: seat.guest } } : {}),
    },
    uids: { [seat.host]: true, ...(seat.guest ? { [seat.guest]: true } : {}) },
    decks: o.decks ?? {},
  }
  if (o.path) {
    s.path = pathOf()
    s.pathLamps = Object.fromEntries(
      Array.from({ length: o.lamps ?? 3 }, (_, i) => [i, true]),
    )
  }
  return s
}

// ---- Default callable behaviour ---------------------------------------------
export const exportFixture = (uid: string) => ({
  exportedAt: '2026-01-01T00:00:00.000Z',
  uid,
  profile: { name: HOST_NAME, email: HOST_EMAIL, bio: 'Sample bio (fixture)', created: 1_700_000_000_000 },
  intake: null,
  consent: null,
  sessions: {},
})
