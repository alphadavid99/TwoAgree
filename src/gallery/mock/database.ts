// Fake firebase/database: an in-memory tree per frame, with the same
// path/update/onValue semantics the app relies on (multi-path update, null
// deletes, live listeners). Nothing here touches the network.
import { activeFrame, requireFrame, GalleryFirebaseError, type FrameRuntime } from './runtime'

type Json = unknown
type Tree = Record<string, Json>

export const getDatabase = (_app?: unknown) => ({ __gallery: true })
export const connectDatabaseEmulator = (..._a: unknown[]) => {}

type Ref = { path: string; frame: FrameRuntime }
const segs = (p: string) => p.split('/').filter(Boolean)

export function ref(_db: unknown, path = ''): Ref {
  return { path: segs(path).join('/'), frame: requireFrame('ref') }
}
export const child = (r: Ref, p: string): Ref => ({
  path: segs(`${r.path}/${p}`).join('/'),
  frame: r.frame,
})

function readAt(frame: FrameRuntime, path: string): Json {
  let cur: Json = frame.db
  for (const s of segs(path)) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Tree)[s]
  }
  return cur === undefined ? null : structuredClone(cur)
}

function writeAt(frame: FrameRuntime, path: string, value: Json): void {
  const parts = segs(path)
  if (!parts.length) throw new GalleryFirebaseError('write to the database root')
  let cur = frame.db as Tree
  for (const s of parts.slice(0, -1)) {
    if (cur[s] == null || typeof cur[s] !== 'object') cur[s] = {}
    cur = cur[s] as Tree
  }
  const last = parts[parts.length - 1]
  if (value == null) delete cur[last]
  else cur[last] = structuredClone(value)
}

const snap = (path: string, value: Json) => ({
  key: segs(path).pop() ?? null,
  val: () => value,
  exists: () => value != null,
})

const blocked = (list: string[], path: string) =>
  list.some((p) => path === p || path.startsWith(`${p}/`))

export function onValue(
  r: Ref,
  cb: (s: ReturnType<typeof snap>) => void,
  errCb?: (e: Error) => void,
): () => void {
  const { frame } = r
  if (blocked(frame.pending, r.path)) return () => {} // never answers: a loading state
  if (blocked(frame.denied, r.path)) {
    setTimeout(
      () => errCb?.(Object.assign(new Error('PERMISSION_DENIED'), { code: 'PERMISSION_DENIED' })),
      0,
    )
    return () => {}
  }
  let live = true
  const fire = () => live && cb(snap(r.path, readAt(frame, r.path)))
  frame.listeners.add(fire)
  setTimeout(fire, 0)
  return () => {
    live = false
    frame.listeners.delete(fire)
  }
}

export async function get(r: Ref) {
  const { frame } = r
  if (blocked(frame.pending, r.path)) return new Promise<never>(() => {})
  if (blocked(frame.denied, r.path)) {
    throw Object.assign(new Error('PERMISSION_DENIED'), { code: 'PERMISSION_DENIED' })
  }
  return snap(r.path, readAt(frame, r.path))
}

const notify = (frame: FrameRuntime) => [...frame.listeners].forEach((fn) => fn())

function guardWrite(r: Ref) {
  if (blocked(r.frame.deniedWrites, r.path))
    throw Object.assign(new Error('PERMISSION_DENIED'), { code: 'PERMISSION_DENIED' })
}

export async function update(r: Ref, patch: Record<string, Json>): Promise<void> {
  guardWrite(r)
  for (const [k, v] of Object.entries(patch)) writeAt(r.frame, `${r.path}/${k}`, v)
  notify(r.frame)
}
export async function set(r: Ref, value: Json): Promise<void> {
  guardWrite(r)
  writeAt(r.frame, r.path, value)
  notify(r.frame)
}
export async function remove(r: Ref): Promise<void> {
  guardWrite(r)
  writeAt(r.frame, r.path, null)
  notify(r.frame)
}

// Referenced so a stray import of activeFrame is never tree-shaken into a lie.
void activeFrame
