// A tiny scripting layer so a frame can be driven into a state the real app
// only reaches by interaction (a typed email that fails, a confirm dialog, the
// second half of a question). Each step acts on real DOM inside the frame, so
// what is captured is the app's own behaviour, not a re-drawn imitation.
import { setActiveFrame, type FrameRuntime } from './mock/runtime'

export type Step =
  | { click: RegExp | string; nth?: number }
  | { sel: string; nth?: number } // click by CSS selector (answer orbs, options…)
  | { type: string; value: string } // CSS selector, e.g. "#nm"
  | { wait: number }
  | { run: (rt: FrameRuntime) => void }
  | { scrollToText: RegExp } // bring the part of the screen that changed into view
  | Step[] // an atomic group: no other frame acts in between

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// The fake providers are module singletons shared by every frame, and "which
// frame is calling" is a global. So anything that touches a frame (first
// render, each scripted tap) runs one at a time, and holds the lock long enough
// for the mocks' async work to settle before the next frame becomes active.
// Pure waits (animations) deliberately don't hold it.
let tail: Promise<unknown> = Promise.resolve()
export function exclusive<T>(fn: () => Promise<T> | T): Promise<T> {
  const run = tail.then(fn, fn)
  tail = run.catch(() => {})
  return run
}

const label = (el: Element) =>
  (el.getAttribute('aria-label') ?? el.textContent ?? '').replace(/\s+/g, ' ').trim()

function matches(el: Element, want: RegExp | string) {
  const l = label(el)
  return typeof want === 'string' ? l === want : want.test(l)
}

function perform(host: HTMLElement, rt: FrameRuntime, step: Exclude<Step, { wait: number } | Step[]>) {
  if ('run' in step) {
    step.run(rt)
  } else if ('scrollToText' in step) {
    const hits = [...host.querySelectorAll('*')].filter((e) => step.scrollToText.test(e.textContent ?? ''))
    const deepest = hits.find((e) => !hits.some((o) => o !== e && e.contains(o)))
    if (!deepest) throw new Error(`[${rt.id}] no text ${String(step.scrollToText)} to scroll to`)
    host.scrollTop +=
      deepest.getBoundingClientRect().top - host.getBoundingClientRect().top - 90
  } else if ('sel' in step) {
    const el = host.querySelectorAll<HTMLElement>(step.sel)[step.nth ?? 0]
    if (!el) throw new Error(`[${rt.id}] nothing matches ${step.sel} in frame`)
    el.click()
  } else if ('click' in step) {
    const hits = [...host.querySelectorAll('button, a, [role="button"], label')].filter(
      (el) => matches(el, step.click) && !(el as HTMLButtonElement).disabled,
    )
    const el = hits[step.nth ?? 0]
    if (!el) throw new Error(`[${rt.id}] no clickable "${String(step.click)}" in frame`)
    ;(el as HTMLElement).click()
  } else {
    const el = host.querySelector<HTMLInputElement | HTMLTextAreaElement>(step.type)
    if (!el) throw new Error(`[${rt.id}] no field ${step.type} in frame`)
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement
    Object.getOwnPropertyDescriptor(proto.prototype, 'value')!.set!.call(el, step.value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

export async function runSteps(host: HTMLElement, rt: FrameRuntime, steps: Step[]) {
  for (const step of steps) {
    if (!Array.isArray(step) && 'wait' in step) {
      await sleep(step.wait)
      continue
    }
    await exclusive(async () => {
      setActiveFrame(rt)
      for (const one of Array.isArray(step) ? step : [step]) {
        if ('wait' in one) await sleep(one.wait)
        else if (!Array.isArray(one)) perform(host, rt, one)
        await sleep(60)
      }
      await sleep(80)
    })
  }
}
