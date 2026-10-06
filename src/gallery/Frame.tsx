import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot, type Root } from 'react-dom/client'
import type { User } from 'firebase/auth'
import { exclusive, runSteps, sleep, type Step } from './actions'
import { setActiveFrame, type CallableHandler, type FrameRuntime } from './mock/runtime'
import { exportFixture, fixtureUser } from './fixtures'

export type Ctx = {
  uid: string
  partnerUid: string
  user: User | null
  /** The one session code every frame uses; each frame has a private database. */
  code: string
}

export type FrameDef = {
  id: string
  flow: string
  title: string
  note?: string
  /** Who is signed in. Default 'host'. */
  user?: 'host' | 'anon' | null
  /** This frame's database (copied fresh on every mount). */
  db?: (c: Ctx) => Record<string, unknown>
  pending?: string[] | ((c: Ctx) => string[])
  denied?: string[] | ((c: Ctx) => string[])
  denyWrites?: string[] | ((c: Ctx) => string[])
  callables?: Record<string, CallableHandler>
  authError?: string
  authHang?: boolean
  authPending?: boolean
  /** localStorage seeds, keyed by this frame's own uid so frames never collide. */
  seed?: (c: Ctx) => void
  steps?: Step[]
  /** Return the screen. `bare: true` when it already supplies its own .phone. */
  render: (c: Ctx) => ReactNode
  bare?: boolean
  /** Why this frame can't be rendered (shown in place of the phone). */
  unrenderable?: string
}

export const CODE = 'TEST'

const defaultCallables = (c: Ctx): Record<string, CallableHandler> => ({
  joinByCode: ((d: { code: string }) => ({ code: d.code })) as CallableHandler,
  redeemInvite: (() => ({ code: c.code })) as CallableHandler,
  createInvite: (() => ({ token: 'FIXTURE-TOKEN' })) as CallableHandler,
  generatePath: (() => ({ status: 'ready' })) as CallableHandler,
  exportMyData: (() => exportFixture(c.uid)) as CallableHandler,
  deleteMyAccount: (() => ({ ok: true, sessionsUpdated: 1, sessionsDeleted: 0 })) as CallableHandler,
})

export function ctxFor(def: FrameDef): Ctx {
  const uid = `fx-${def.id}-host`
  const user =
    def.user === null
      ? null
      : def.user === 'anon'
        ? fixtureUser(uid, { anonymous: true })
        : fixtureUser(uid)
  return { uid, partnerUid: `fx-${def.id}-guest`, user, code: CODE }
}

const resolve = (v: string[] | ((c: Ctx) => string[]) | undefined, c: Ctx) =>
  typeof v === 'function' ? v(c) : (v ?? [])

function runtimeFor(def: FrameDef, c: Ctx): FrameRuntime {
  const tree = def.db?.(c) ?? {}
  return {
    id: def.id,
    user: c.user,
    db: structuredClone(tree),
    listeners: new Set(),
    pending: resolve(def.pending, c),
    denied: resolve(def.denied, c),
    deniedWrites: resolve(def.denyWrites, c),
    callables: { ...defaultCallables(c), ...def.callables },
    authError: def.authError,
    authHang: def.authHang,
    authPending: def.authPending,
  }
}

// A gallery-level boundary, separate from the app's own ErrorBoundary: if a
// screen throws, the frame says so in red instead of blanking the page.
class FrameBoundary extends Component<{ id: string; children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null }
  static getDerivedStateFromError(err: Error) {
    return { err }
  }
  render() {
    if (!this.state.err) return this.props.children
    return (
      <div className="gframe-crash" role="alert">
        <b>This frame crashed</b>
        <pre>{this.state.err.message}</pre>
      </div>
    )
  }
}

export function Frame({ def, index, eager }: { def: FrameDef; index: number; eager: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const state = useRef<{ root: Root; cleanup: () => void } | null>(null)
  const cancelled = useRef(false)
  const [gen, setGen] = useState(0)
  const [seen, setSeen] = useState(eager)

  useEffect(() => {
    if (seen || !host.current) return
    const io = new IntersectionObserver(
      (es) => es.some((e) => e.isIntersecting) && setSeen(true),
      { rootMargin: '900px' },
    )
    io.observe(host.current)
    return () => io.disconnect()
  }, [seen])

  const mount = useCallback(async () => {
    const el = host.current
    if (!el || def.unrenderable) return
    const c = ctxFor(def)
    const rt = runtimeFor(def, c)
    el.dataset.gready = 'false'
    const grab = () => setActiveFrame(rt) // whoever the person touches is "active"
    const evs = ['pointerdown', 'focusin', 'keydown'] as const
    let root: Root | null = null
    cancelled.current = false
    // First render happens under the global lock and OUTSIDE any React
    // lifecycle (flushSync is a no-op inside one), so the screen's mount
    // effects subscribe while this frame is the active one.
    await exclusive(async () => {
      await sleep(0)
      if (cancelled.current) return
      setActiveFrame(rt)
      def.seed?.(c)
      root = createRoot(el)
      for (const ev of evs) el.addEventListener(ev, grab, true)
      state.current = {
        root,
        cleanup: () => {
          for (const ev of evs) el.removeEventListener(ev, grab, true)
          root!.unmount()
          rt.listeners.clear()
        },
      }
      flushSync(() =>
        root!.render(
          <FrameBoundary id={def.id}>
            {def.bare ? def.render(c) : <div className="phone">{def.render(c)}</div>}
          </FrameBoundary>,
        ),
      )
      await sleep(60)
    })
    if (cancelled.current || !root) return
    try {
      await runSteps(el, rt, def.steps ?? [])
    } catch (e) {
      el.dataset.gerror = String((e as Error).message)
      console.error(e)
    }
    el.dataset.gready = 'true'
  }, [def])

  useEffect(() => {
    if (!seen) return
    void mount()
    return () => {
      cancelled.current = true
      state.current?.cleanup()
      state.current = null
    }
  }, [seen, gen, mount])

  return (
    <figure className="gcell" id={`f-${def.id}`}>
      <figcaption>
        <span className="gnum">{String(index + 1).padStart(2, '0')}</span>
        <span className="gtitle">{def.title}</span>
        <button type="button" className="greset" onClick={() => setGen((g) => g + 1)} title="Reset this frame">
          ↻
        </button>
        {def.note && <span className="gnote">{def.note}</span>}
      </figcaption>
      <div className="gbezel">
        <div className="gframe" ref={host} data-frame={def.id} />
        {def.unrenderable && (
          <div className="gnorender">
            <b>Not rendered</b>
            <span>{def.unrenderable}</span>
          </div>
        )}
      </div>
    </figure>
  )
}

