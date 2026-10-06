// Fake firebase/functions. Each callable resolves from a per-frame handler
// (fixtures supply sensible defaults). A callable with no handler throws —
// loudly — rather than quietly succeeding.
import { GalleryFirebaseError, requireFrame } from './runtime'

export const getFunctions = (_app?: unknown, _region?: string) => ({ __gallery: true })
export const connectFunctionsEmulator = (..._a: unknown[]) => {}

export function httpsCallable<Req = unknown, Res = unknown>(_fns: unknown, name: string) {
  return async (data?: Req): Promise<{ data: Res }> => {
    const frame = requireFrame(`httpsCallable(${name})`)
    const handler = frame.callables[name]
    if (!handler) throw new GalleryFirebaseError(`callable "${name}" has no fixture handler`)
    return { data: (await (handler as (d: unknown) => unknown)(data)) as Res }
  }
}
