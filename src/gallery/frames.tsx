// The frame catalogue: every routed screen and major state, in user-journey
// order. Most frames mount the app's REAL top-level components (App,
// SessionApp, Onboarding…) against a fixture database, then script the same
// taps a person would make to reach the state — so what's reviewed is what
// ships, not a redrawn imitation.
import type { ReactNode } from 'react'
import App from '../App'
import Onboarding from '../screens/Onboarding'
import RevealScreen from '../screens/RevealScreen'
import PlayScreen from '../screens/PlayScreen'
import PathStep from '../screens/PathStep'
import { PathFlow } from '../screens/PathScreen'
import SessionApp from '../screens/SessionApp'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ORDER, DECKS, type Question } from '../lib/questions'
import { lvlQs, nLevels } from '../lib/leveling'
import { revealKey } from '../lib/progress'
import type { DeckData } from '../lib/scoring'
import {
  markRevealSeen,
  setActiveCode,
  setLastDeck,
  setOnbCheckpoint,
  type OnbCheckpoint,
} from '../lib/local'
import type { Session } from '../types'
import type { Step } from './actions'
import type { Ctx, FrameDef } from './Frame'
import { CODE } from './Frame'
import type { FrameRuntime } from './mock/runtime'
import {
  FIRST, FULL, GUEST_EMAIL, GUEST_NAME, HOST_EMAIL, HOST_NAME, MULTI, PATH_KEYS, SINGLE,
  STARTER_SLUG, answerFor, fakeDeck, flagDeck, hostOnlyDeck, pathOf, profileOf, sessionOf,
  starterDeck, talkDeck, tunedReveal,
} from './fixtures'

const never = () => new Promise<never>(() => {})
const fail = (code: string, message = code) => () => {
  throw Object.assign(new Error(message), { code })
}

// ---- database helpers -------------------------------------------------------
const people = (c: Ctx) => ({
  [c.uid]: profileOf(HOST_NAME, HOST_EMAIL),
  [c.partnerUid]: profileOf(GUEST_NAME, GUEST_EMAIL),
})
const seat = (c: Ctx) => ({ host: c.uid, guest: c.partnerUid })
const dbWith =
  (mk: (c: Ctx) => Session | null, extra?: (c: Ctx) => Record<string, unknown>) =>
  (c: Ctx) => ({
    users: people(c),
    ...(mk(c) ? { sessions: { [c.code]: mk(c) } } : {}),
    ...extra?.(c),
  })

// A joined couple part-way through: one deck mid-way, one finished, one part in.
const couple = (c: Ctx, o: Parameters<typeof sessionOf>[1] = {}) =>
  sessionOf(seat(c), {
    decks: { [MULTI]: fakeDeck(MULTI, 1, 4), [FULL]: fakeDeck(FULL, nLevels(FULL)), [FIRST]: fakeDeck(FIRST, 1) },
    ...o,
  })

// ---- App-hosted frames (signed in, in a session) ----------------------------
type AppOpts = Partial<Omit<FrameDef, 'render' | 'bare' | 'db'>> & {
  id: string
  title: string
  flow: string
  session?: (c: Ctx) => Session | null
  tab?: 'Talk' | 'Together' | 'You' | 'Path'
  /** Reveals not marked "seen" show the herald card on Home. */
  heraldFor?: boolean
  extraDb?: (c: Ctx) => Record<string, unknown>
  openSlug?: string
  lastDeck?: string
}

function inSession(o: AppOpts): FrameDef {
  const { session, tab, heraldFor, extraDb, openSlug, lastDeck, steps, seed, ...rest } = o
  return {
    ...rest,
    db: dbWith((c) => (session ? session(c) : couple(c)), extraDb),
    seed: (c) => {
      setActiveCode(c.uid, c.code)
      if (lastDeck) setLastDeck(c.uid, c.code, lastDeck)
      if (!heraldFor)
        for (const slug of ORDER)
          for (let l = 0; l < nLevels(slug); l++) markRevealSeen(c.uid, c.code, revealKey(slug, l))
      seed?.(c)
    },
    steps: [...(tab ? ([{ wait: 150 }, { click: tab }] as Step[]) : []), ...(steps ?? [])],
    bare: !openSlug,
    render: (c) =>
      openSlug ? (
        <div className="phone">
          <SessionApp code={c.code} user={c.user!} onLeave={() => {}} openSlug={openSlug} />
        </div>
      ) : (
        <App />
      ),
  }
}

// ---- Onboarding-hosted frames -------------------------------------------------
const cp = (o: Partial<OnbCheckpoint> & Pick<OnbCheckpoint, 'flow' | 'step'>) => (c: Ctx) =>
  setOnbCheckpoint(c.uid, {
    code: c.code,
    role: o.flow === 'a' ? 'host' : 'guest',
    myName: o.flow === 'a' ? 'Sarah' : 'Judah',
    partnerName: o.flow === 'a' ? 'Judah' : 'Sarah',
    initiatorName: o.flow === 'b' ? 'Sarah' : undefined,
    stage: 'dating',
    ...o,
  })

const INVITE = { kind: 'token', value: 'FIXTURE-TOKEN' } as const
const starterDb = (c: Ctx) => ({
  users: people(c),
  sessions: {
    [c.code]: sessionOf(seat(c), { decks: { [STARTER_SLUG]: starterDeck() } }),
  },
})
const onboarding = (invite: boolean, extra: Partial<FrameDef> & Pick<FrameDef, 'id' | 'title'> & { flow?: string }): FrameDef => ({
  flow: invite ? 'join' : 'welcome',
  user: 'anon',
  db: starterDb,
  render: () => <Onboarding invite={invite ? INVITE : null} onDone={() => {}} />,
  ...extra,
})

const toConsent: Step[] = [
  { click: /^Start$/ },
  { type: '#me', value: 'Sarah' },
  { type: '#them', value: 'Judah' },
  { click: /^Continue/ },
  { click: /In a relationship/ },
  { click: /^Continue/ },
]
const tick: Step[] = [{ sel: 'input[type=checkbox]', nth: 0 }, { sel: 'input[type=checkbox]', nth: 1 }]

// Find the first question matching a predicate, then answer everything before it
// so a PlayScreen opens exactly there.
function playAt(pred: (q: Question) => boolean): { slug: string; level: number; deck: DeckData } | null {
  for (const slug of ORDER)
    for (let level = 0; level < nLevels(slug); level++) {
      const qs = lvlQs(slug, level)
      const i = qs.findIndex(pred)
      if (i < 0) continue
      // Earlier questions are fully done (answer + guess) so the screen opens
      // on this one rather than resuming into a half-finished guess.
      const answers: NonNullable<DeckData['answers']> = {}
      const guesses: NonNullable<DeckData['guesses']> = {}
      qs.slice(0, i).forEach((q, n) => {
        answers[q.id] = { host: answerFor(q, 'host', n) }
        if (q.guessable && q.type !== 'open') guesses[q.id] = { host: answerFor(q, 'guest', n) }
      })
      return { slug, level, deck: { answers, guesses } }
    }
  return null
}
const asksImportance = (q: Question) => q.type !== 'open' && (Number(q.depth) >= 4 || q.id.startsWith('DEAL-'))
const playFrame = (
  id: string,
  title: string,
  at: ReturnType<typeof playAt>,
  steps: Step[] = [],
  note?: string,
): FrameDef =>
  at
    ? {
        id, flow: 'play', title, note, steps,
        db: dbWith((c) => sessionOf(seat(c))),
        render: (c) => (
          <PlayScreen code={c.code} slug={at.slug} level={at.level} role="host" deck={at.deck}
            partnerName="Judah" onFinish={() => {}} onExit={() => {}} />
        ),
      }
    : { id, flow: 'play', title, render: () => null, unrenderable: 'No such question type in the bank.' }

// A deck just finished by the host, partner not yet: the waiting screen.
const partnerFinishes = (slug: string) => (rt: FrameRuntime) => {
  const s = (rt.db.sessions as Record<string, Session>)[CODE]
  const d = fakeDeck(slug, nLevels(slug))
  s.decks![slug] = d
  rt.listeners.forEach((fn) => fn())
}
const deckLabel = (slug: string) => new RegExp(DECKS[slug].name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

// ---- Reveal ladder ------------------------------------------------------------
const revealTier = (id: string, title: string, hit: number, note: string, firstEver = false): FrameDef => {
  const tuned = tunedReveal('fun-icebreakers', hit)
  return {
    id, flow: 'reveal', title, note,
    db: dbWith((c) => sessionOf(seat(c))),
    steps: [{ wait: 3800 }],
    render: (c) => (
      <RevealScreen slug="fun-icebreakers" level={0} role="host" deck={tuned.deck} myName="Sarah"
        partnerName="Judah" questions={tuned.qs} firstEver={firstEver} code={c.code} onDone={() => {}} />
    ),
  }
}

// NOTE: no synthetic 'at-table' deck here when the session goes through
// SessionApp. readyReveals() walks every key of session.decks and calls
// nLevels(slug), which throws for 'at-table' (not in the question bank), so a
// real session in that state crashes the whole app shell. See the report.
const pathSession = (c: Ctx, lamps = 9): Session =>
  sessionOf(seat(c), { path: true, lamps })

const intakeDone = (c: Ctx) => ({ intake: { [c.uid]: { updated: 1, answers: { fixture: 0 } } } })

const FLOW_TITLES: [string, string][] = [
  ['boot', '1 · Boot & errors'],
  ['welcome', '2 · Welcome & onboarding (the person who arrives first)'],
  ['join', '3 · Joining by invite (the person they bring)'],
  ['auth', '4 · Sign in & account'],
  ['start', '5 · Signed in, no session yet'],
  ['sessionstate', '6 · Session loading & access'],
  ['home', '7 · Home'],
  ['talk', '8 · Talk (conversations)'],
  ['play', '9 · Answering'],
  ['wait', '10 · Waiting & unlocking'],
  ['reveal', '11 · Reveal'],
  ['together', '12 · Together (results)'],
  ['path', '13 · The Path'],
  ['profile', '14 · Profile & settings'],
]
export const FLOWS = FLOW_TITLES.map(([id, title]) => ({ id, title }))

const Boom = (): ReactNode => {
  throw new Error('Fixture render error (intentional, to show the fallback screen)')
}

export const FRAMES: FrameDef[] = [
  // ============ 1 · Boot & errors ============
  { id: 'boot-checking', flow: 'boot', title: 'Checking your account', authPending: true, bare: true, render: () => <App /> },
  {
    id: 'boot-crash', flow: 'boot', title: 'Render-error fallback (ErrorBoundary)',
    note: 'The app’s last line of defence. console.error is expected here.',
    render: () => (<ErrorBoundary><Boom /></ErrorBoundary>),
  },

  // ============ 2 · Welcome & onboarding (initiator) ============
  onboarding(false, { id: 'onb-welcome', title: 'Welcome', user: null }),
  onboarding(false, { id: 'onb-names', title: 'Names', steps: [{ click: /^Start$/ }] }),
  onboarding(false, { id: 'onb-stage', title: 'Relationship stage', steps: [{ click: /^Start$/ }, { type: '#me', value: 'Sarah' }, { type: '#them', value: 'Judah' }, { click: /^Continue/ }] }),
  onboarding(false, { id: 'onb-consent', title: 'Consent (two ticks)', steps: toConsent }),
  onboarding(false, { id: 'onb-consent-ticked', title: 'Consent, both ticked', steps: [...toConsent, ...tick] }),
  onboarding(false, {
    id: 'onb-consent-error', title: 'Consent: save failed',
    note: 'Database write denied → friendly error.',
    denyWrites: ['consents'], steps: [...toConsent, ...tick, { click: /Start →/ }, { wait: 150 }],
  }),
  onboarding(false, { id: 'onb-q-answer', title: 'Starter question: answer', seed: cp({ flow: 'a', step: 'questions' }), steps: [{ sel: '.opt' }] }),
  onboarding(false, { id: 'onb-q-guess', title: 'Starter question: guess your partner', seed: cp({ flow: 'a', step: 'questions' }), steps: [{ sel: '.opt' }, { click: /Next/ }, { wait: 200 }, { sel: '.opt', nth: 1 }] }),
  onboarding(false, { id: 'onb-profile', title: 'Create your profile (account)', seed: cp({ flow: 'a', step: 'profile' }) }),
  onboarding(false, {
    id: 'onb-profile-error', title: 'Create your profile: email taken',
    seed: cp({ flow: 'a', step: 'profile' }), authError: 'auth/email-already-in-use',
    steps: [{ type: '#oe', value: 'sarah.placeholder@example.invalid' }, { type: '#op', value: 'fixture-password' }, { click: /Create profile/ }, { wait: 150 }],
  }),
  onboarding(false, { id: 'onb-invite', title: 'Invite your partner', seed: cp({ flow: 'a', step: 'invite' }) }),
  onboarding(false, { id: 'onb-menu', title: 'Where would you like to start?', seed: cp({ flow: 'a', step: 'menu' }) }),

  // ============ 3 · Joining by invite ============
  onboarding(true, { id: 'join-arrive', title: 'You’ve been invited' }),
  onboarding(true, { id: 'join-name', title: 'Your name', steps: [{ click: /Catch up/ }] }),
  onboarding(true, { id: 'join-consent', title: 'Consent', steps: [{ click: /Catch up/ }, { type: '#nm', value: 'Judah' }, { click: /^Continue/ }] }),
  onboarding(true, { id: 'join-questions', title: 'Their turn to answer', seed: cp({ flow: 'b', step: 'questions' }) }),
  onboarding(true, { id: 'join-reveal', title: 'First reveal', note: 'The warm-up reveal the invitee sees before making an account.', seed: cp({ flow: 'b', step: 'reveal' }), steps: [{ wait: 3800 }] }),
  onboarding(true, { id: 'join-account', title: 'Make it yours (account)', seed: cp({ flow: 'b', step: 'account' }) }),
  onboarding(true, { id: 'join-menu', title: 'Where would you like to start?', seed: cp({ flow: 'b', step: 'path' }) }),
  {
    id: 'join-redeeming', flow: 'join', title: 'Joining your partner’s session…',
    render: () => null,
    unrenderable: 'Driven by the invite link in the page URL, which is module-level state shared by every frame (src/lib/invite.ts). Showing it here would put every other frame in "joining" too.',
  },
  {
    id: 'join-invite-failed', flow: 'join', title: 'Invite link failed (banner)',
    render: () => null,
    unrenderable: 'Same cause as the frame above: it needs a real ?t= link on the page URL.',
  },

  // ============ 4 · Sign in & account ============
  ...(
    [
      ['auth-signup', 'Create account', false, [], undefined],
      ['auth-signup-validation', 'Create account: validation', false, [{ click: /Create account →/ }], undefined],
      ['auth-signin', 'Sign in', true, [], undefined],
      ['auth-signin-error', 'Sign in: wrong password', true, [{ type: '#email', value: 'sarah.placeholder@example.invalid' }, { type: '#pw', value: 'fixture-wrong' }, { click: /Sign in →/ }, { wait: 150 }], { authError: 'auth/invalid-credential' }],
      ['auth-signin-busy', 'Sign in: waiting on the server', true, [{ type: '#email', value: 'sarah.placeholder@example.invalid' }, { type: '#pw', value: 'fixture-password' }, { click: /Sign in →/ }], { authHang: true }],
      ['auth-reset', 'Password reset sent', true, [{ type: '#email', value: 'sarah.placeholder@example.invalid' }, { click: /Forgot password/ }, { wait: 150 }], undefined],
    ] as [string, string, boolean, Step[], Partial<FrameDef> | undefined][]
  ).map(([id, title, returning, steps, extra]): FrameDef => ({
    id, flow: 'auth', title, user: null,
    note: id === 'auth-signup' ? 'Reached via “Already have an account? Sign in” on Welcome.' : undefined,
    // AuthScreen reads the "has signed in here before" flag when it mounts,
    // i.e. at the click below, so set it immediately before the click.
    steps: [
      [
        { run: () => (returning ? localStorage.setItem('aligned_returning', '1') : localStorage.removeItem('aligned_returning')) },
        { click: /Already have an account/ },
      ],
      ...steps,
    ],
    render: () => <Onboarding invite={null} onDone={() => {}} />,
    ...extra,
  })),

  // ============ 5 · Signed in, no session yet ============
  { id: 'start-profile-loading', flow: 'start', title: 'Loading your profile', pending: (c) => [`users/${c.uid}`], db: dbWith(() => null), bare: true, render: () => <App /> },
  { id: 'start-firstrun', flow: 'start', title: 'First run: set up your profile', db: () => ({}), bare: true, render: () => <App /> },
  { id: 'start-choose', flow: 'start', title: 'Start a session', db: dbWith(() => null), bare: true, render: () => <App /> },
  { id: 'start-stage', flow: 'start', title: 'Start a session: stage picked', db: dbWith(() => null), steps: [{ wait: 150 }, { click: /In a relationship|Engaged|Married/ }], bare: true, render: () => <App /> },
  { id: 'start-join', flow: 'start', title: 'Join with a code', db: dbWith(() => null), steps: [{ wait: 150 }, { click: /I have a code/ }], bare: true, render: () => <App /> },
  {
    id: 'start-join-error', flow: 'start', title: 'Join with a code: not found',
    db: dbWith(() => null), callables: { joinByCode: fail('functions/not-found', 'No session with that code.') },
    steps: [{ wait: 150 }, { click: /I have a code/ }, { type: '#code', value: 'ZZZZ' }, { click: /Join →/ }, { wait: 150 }],
    bare: true, render: () => <App />,
  },
  { id: 'start-settings', flow: 'start', title: 'Settings from the landing screen', db: dbWith(() => null), steps: [{ wait: 150 }, { click: /Settings/ }], bare: true, render: () => <App /> },

  // ============ 6 · Session loading & access ============
  inSession({ id: 'session-loading', flow: 'sessionstate', title: 'Opening your session', pending: ['sessions'] }),
  inSession({ id: 'session-denied', flow: 'sessionstate', title: 'Session unavailable', denied: ['sessions'], note: 'Wrong code, closed session, or not a member.' }),

  // ============ 7 · Home ============
  inSession({ id: 'home-new', flow: 'home', title: 'Partner not yet joined', session: (c) => sessionOf({ host: c.uid }) }),
  inSession({
    id: 'home-invite-busy', flow: 'home', title: 'Partner not yet joined: creating invite link',
    session: (c) => sessionOf({ host: c.uid }), callables: { createInvite: never },
    steps: [{ click: /Send an invite link/ }],
  }),
  inSession({
    id: 'home-solo', flow: 'home', title: 'Partner not yet joined: answers banked',
    session: (c) => sessionOf({ host: c.uid }, { decks: { [FIRST]: hostOnlyDeck(FIRST) } }), lastDeck: FIRST,
  }),
  inSession({ id: 'home-joined', flow: 'home', title: 'Both joined, mid-way', lastDeck: MULTI }),
  inSession({ id: 'home-herald', flow: 'home', title: 'A reveal is ready (herald card)', heraldFor: true, lastDeck: MULTI }),
  inSession({ id: 'home-path', flow: 'home', title: 'Home with the Path card', session: (c) => couple(c, { path: true, lamps: 3 }), lastDeck: MULTI }),

  // ============ 8 · Talk ============
  inSession({ id: 'talk-decks', flow: 'talk', title: 'All conversations', tab: 'Talk' }),
  inSession({
    id: 'talk-picker', flow: 'talk', title: 'Choose a part (multi-part deck)',
    session: (c) => sessionOf(seat(c), { decks: { [MULTI]: { ...fakeDeck(MULTI, 1), done: { 0: { host: true, guest: true }, 1: { host: true } } } } }),
    openSlug: MULTI,
  }),

  // ============ 9 · Answering ============
  playFrame('play-scale', 'Scale question', playAt((q) => q.type === 'scale' && !q.guessable) ?? playAt((q) => q.type === 'scale'), [{ sel: '.orb', nth: 3 }]),
  playFrame('play-mc', 'Multiple choice', playAt((q) => q.type === 'mc' && !asksImportance(q)), [{ sel: '.opt', nth: 1 }]),
  playFrame('play-guess', 'Guess your partner', playAt((q) => q.type === 'mc' && !!q.guessable && !asksImportance(q)), [{ sel: '.opt', nth: 0 }, { click: /Next/ }, { wait: 250 }, { sel: '.opt', nth: 1 }]),
  playFrame('play-rank', 'Rank question', playAt((q) => q.type === 'rank')),
  playFrame('play-open', 'Open question', playAt((q) => q.type === 'open'), [{ sel: 'textarea', nth: 0 }].slice(0, 0)),
  playFrame('play-importance', 'Answer + importance (tier-3 / deal-breaker)', playAt(asksImportance), [{ sel: '.opt', nth: 0 }]),

  // ============ 10 · Waiting & unlocking ============
  inSession({
    id: 'wait-partner', flow: 'wait', title: 'All yours are in (waiting on partner)',
    session: (c) => sessionOf(seat(c), { decks: { [SINGLE]: hostOnlyDeck(SINGLE) } }), openSlug: SINGLE,
  }),
  inSession({
    id: 'wait-unlock', flow: 'wait', title: 'Ready to open (partner just finished)',
    note: 'Scripted: open the deck, wait, then the fixture partner finishes live.',
    session: (c) => sessionOf(seat(c), { decks: { [SINGLE]: hostOnlyDeck(SINGLE) } }),
    steps: [{ click: 'Talk' }, { wait: 200 }, { click: deckLabel(SINGLE) }, { wait: 200 }, { run: partnerFinishes(SINGLE) }, { wait: 300 }],
  }),

  // ============ 11 · Reveal ============
  revealTier('reveal-t0', 'Reveal: low agreement (no celebration)', 34, '27% agreed: plain'),
  revealTier('reveal-t1', 'Reveal: warm (claret room)', 72, '65% agreed'),
  revealTier('reveal-t2', 'Reveal: strong (petals)', 84, '76% agreed'),
  revealTier('reveal-t3', 'Reveal: grand bloom', 98, '100% agreed'),
  revealTier('reveal-first', 'Reveal: the couple’s first ever', 84, 'Adds the first-reveal line', true),
  inSession({ id: 'reveal-answers', flow: 'reveal', title: 'Every answer, side by side (review)', session: (c) => sessionOf(seat(c), { decks: { [FULL]: fakeDeck(FULL, nLevels(FULL)) } }), openSlug: FULL, steps: [{ wait: 500 }] }),
  {
    id: 'reveal-flags', flow: 'reveal', title: 'Worth a closer look (flags)',
    db: dbWith((c) => sessionOf(seat(c))),
    render: (c) => (
      <RevealScreen slug={FULL} level={0} role="host" deck={flagDeck(FULL)} myName="Sarah" partnerName="Judah"
        questions={lvlQs(FULL, 0)} review code={c.code} onDone={() => {}} />
    ),
  },

  // ============ 12 · Together ============
  inSession({ id: 'together-empty', flow: 'together', title: 'Nothing revealed yet', session: (c) => sessionOf(seat(c)), tab: 'Together' }),
  inSession({ id: 'together-results', flow: 'together', title: 'Where you agree', tab: 'Together' }),
  inSession({ id: 'together-talk', flow: 'together', title: 'Your agenda & discoveries', session: (c) => sessionOf(seat(c), { decks: { [FULL]: talkDeck(FULL), [FIRST]: fakeDeck(FIRST, 1) } }), tab: 'Together' }),

  // ============ 13 · The Path ============
  inSession({ id: 'path-loading', flow: 'path', title: 'Path: checking your progress', pending: (c) => [`intake/${c.uid}`], tab: 'Path' }),
  inSession({ id: 'path-intro', flow: 'path', title: 'Path: intro', session: (c) => sessionOf(seat(c)), tab: 'Path' }),
  inSession({ id: 'path-intake', flow: 'path', title: 'Path: private intake', session: (c) => sessionOf(seat(c)), tab: 'Path', steps: [{ click: /Begin my part/ }] }),
  inSession({ id: 'path-waiting', flow: 'path', title: 'Path: waiting for your partner', session: (c) => sessionOf(seat(c)), extraDb: intakeDone, callables: { generatePath: () => ({ status: 'waiting', reason: 'partner-missing' }) }, tab: 'Path' }),
  inSession({ id: 'path-map', flow: 'path', title: 'Path: the map', session: (c) => pathSession(c, 3), extraDb: intakeDone, tab: 'Path' }),
  {
    id: 'path-step-arrival', flow: 'path', title: 'Path: arriving at a waypoint',
    db: dbWith((c) => pathSession(c, 1)),
    render: (c) => (
      <PathStep code={c.code} role="host" session={pathSession(c, 1)} index={1} step={{ key: 'fork', mechanic: 'guess', qids: ['CONF-001', 'CONF-002'] }}
        myName="Sarah" partnerName="Judah" onExit={() => {}} />
    ),
  },
  {
    id: 'path-step-play', flow: 'path', title: 'Path: a waypoint question',
    db: dbWith((c) => pathSession(c, 1)), steps: [{ click: /Take the step/ }],
    render: (c) => (
      <PathStep code={c.code} role="host" session={pathSession(c, 1)} index={1} step={{ key: 'fork', mechanic: 'guess', qids: ['CONF-001', 'CONF-002'] }}
        myName="Sarah" partnerName="Judah" onExit={() => {}} />
    ),
  },
  {
    id: 'path-lookout', flow: 'path', title: 'Path: The Lookout (finale)',
    db: dbWith((c) => pathSession(c)),
    render: (c) => (
      <PathFlow code={c.code} role="host" session={lookoutSession(c)} index={PATH_KEYS.length} myName="Sarah" partnerName="Judah" onExit={() => {}} />
    ),
  },

  // ============ 14 · Profile & settings ============
  inSession({
    id: 'profile-loading', flow: 'profile', title: 'Profile: loading',
    note: 'Profile reads stall after the app shell has loaded.',
    steps: [{ wait: 150 }, { run: (rt) => rt.pending.push(`users/${rt.user!.uid}`) }, { click: 'You' }],
  }),
  inSession({ id: 'profile-main', flow: 'profile', title: 'Profile & settings', tab: 'You' }),
  inSession({ id: 'profile-leave', flow: 'profile', title: 'Leave this session? (confirm)', tab: 'You', steps: [{ click: /Leave/ }, { scrollToText: /Leave this session\?/ }] }),
  inSession({ id: 'profile-delete', flow: 'profile', title: 'Delete account (confirm)', tab: 'You', steps: [{ click: /Delete my account/ }, { scrollToText: /Here is precisely what happens/ }] }),
  inSession({ id: 'profile-delete-busy', flow: 'profile', title: 'Delete account: deleting…', tab: 'You', callables: { deleteMyAccount: never }, steps: [{ click: /Delete my account/ }, { click: /Yes, delete everything/ }, { scrollToText: /Here is precisely what happens/ }] }),
  inSession({
    id: 'profile-export-error', flow: 'profile', title: 'Data export: offline error',
    note: 'The success state triggers a real file download, so it is not shown.',
    tab: 'You', callables: { exportMyData: fail('auth/network-request-failed') },
    steps: [{ click: /Download the raw data/ }, { wait: 150 }, { scrollToText: /offline/i }],
  }),
]

// A finished journey: real answers behind every waypoint so the finale's numbers
// are the real scoring, not a mock.
function lookoutSession(c: Ctx): Session {
  const SRC = ['fun-icebreakers', 'conflict-communication', 'finances-money', 'in-the-home', 'intimacy-physical', 'past-baggage', 'faith-worship-practice', 'dreams-future', 'values-convictions']
  const decks: Record<string, DeckData> = { 'at-table': { answers: {}, guesses: {} } }
  const steps: Record<string, { key: string; mechanic: 'guess' | 'noguess'; qids: string[] }> = {}
  PATH_KEYS.forEach((key, i) => {
    const slug = SRC[i]
    const qs = (DECKS[slug]?.questions ?? []).filter((q) => q.type !== 'open').slice(0, 5)
    decks[slug] ??= { answers: {}, guesses: {} }
    qs.forEach((q, n) => {
      const apart = i >= 5 && n % 2 === 0
      const hi = q.type === 'scale' ? 5 : (q.opts?.length ?? 2) - 1
      decks[slug].answers![q.id] = { host: q.type === 'scale' ? 3 : 0, guest: apart ? hi : q.type === 'scale' ? 3 : 0 }
      if (q.guessable) decks[slug].guesses![q.id] = { host: q.type === 'scale' ? 3 : 0, guest: q.type === 'scale' ? 3 : 0 }
    })
    decks['at-table'].answers![key] = { host: 'Sample answer (fixture)', guest: 'Sample answer (fixture)' }
    steps[i] = { key, mechanic: i === 8 ? 'noguess' : 'guess', qids: qs.map((q) => q.id) }
  })
  return {
    ...sessionOf(seat(c)),
    decks,
    path: { ...pathOf(45), steps },
    pathLamps: Object.fromEntries(PATH_KEYS.map((_, i) => [i, true])),
  }
}
