// The gallery's stand-in for the publishPart Cloud Function (functions/src/
// publish.ts): once both partners have marked a part done, copy both private
// spaces' entries for that part into the shared session and stamp it
// published. Same rule as the server, over this frame's in-memory database.
import { levelsOf } from '../../lib/leveling'
import { PRIVATE_KINDS } from '../../lib/privacy'
import { deckOf, AT_TABLE_SLUG } from '../../lib/path'
import { DECKS } from '../../lib/questions'
import { get, ref, update } from './database'

type Tree = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
const both = (f: Tree | undefined) => f?.host === true && f?.guest === true

/** Fixtures model parts that are already open: stamp them as the server would. */
export function stampPublished(tree: Tree): Tree {
  for (const s of Object.values((tree.sessions ?? {}) as Tree)) {
    for (const d of Object.values((s?.decks ?? {}) as Tree)) {
      for (const [lvl, f] of Object.entries((d?.done ?? {}) as Tree)) {
        if (both(f)) d.published = { ...(d.published ?? {}), [lvl]: true }
      }
    }
    for (const [i, f] of Object.entries((s?.pathDone ?? {}) as Tree)) {
      if (both(f)) s.pathPublished = { ...(s.pathPublished ?? {}), [i]: true }
    }
  }
  return tree
}

export async function publishInFrame(data: { code: string; slug?: string; level?: number; step?: number }) {
  const s = (await get(ref(null, `sessions/${data.code}`))).val() as Tree | null
  if (!s) return { status: 'waiting', reason: 'not-both-done' }
  let slots: { slug: string; qid: string }[]
  let marker: string
  if (typeof data.step === 'number') {
    const step = s.path?.steps?.[data.step]
    if (!step || !both(s.pathDone?.[data.step])) return { status: 'waiting', reason: 'not-both-done' }
    slots = (step.qids as string[]).flatMap((qid) => (deckOf(qid) ? [{ slug: deckOf(qid)!, qid }] : []))
    slots.push({ slug: AT_TABLE_SLUG, qid: step.key })
    marker = `sessions/${data.code}/pathPublished/${data.step}`
  } else {
    const slug = data.slug!
    if (!DECKS[slug] || !both(s.decks?.[slug]?.done?.[data.level!])) return { status: 'waiting', reason: 'not-both-done' }
    slots = (levelsOf(slug)[data.level!] ?? []).map((q) => ({ slug, qid: q.id }))
    marker = `sessions/${data.code}/decks/${slug}/published/${data.level}`
  }
  const patch: Record<string, unknown> = { [marker]: true }
  for (const role of ['host', 'guest'] as const) {
    const uid = s.members?.[role]?.uid
    if (!uid) continue
    const mine = (await get(ref(null, `private/${uid}/${data.code}/decks`))).val() as Tree | null
    for (const { slug, qid } of slots)
      for (const kind of PRIVATE_KINDS) {
        const v = mine?.[slug]?.[kind]?.[qid]
        if (v != null) patch[`sessions/${data.code}/decks/${slug}/${kind}/${qid}/${role}`] = v
      }
  }
  await update(ref(null, ''), patch)
  return { status: 'published' }
}
