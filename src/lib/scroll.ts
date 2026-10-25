// Where a screen scrolls, and moving it. The screens are swapped in place (no
// router), so the page kept whatever scroll the last screen left it at: a part
// opened from far down the Talk list arrived scrolled past its own header, and
// coming back landed at the top or the bottom instead of where you were.
//
// The scroller is the page in the app (and in the Capacitor web view), or the
// nearest scrolling ancestor, which is the phone frame in the gallery.
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

const pageScroller = () =>
  (document.scrollingElement as HTMLElement | null) ?? document.documentElement;

export function scrollerOf(el: Element | null | undefined): HTMLElement {
  for (let n = el?.parentElement; n; n = n.parentElement) {
    if (n === document.body || n === document.documentElement) break;
    const o = getComputedStyle(n).overflowY;
    if (o === "auto" || o === "scroll") return n;
  }
  return pageScroller();
}

const isPage = (s: HTMLElement) => s === pageScroller();

// Move instantly: a screen should simply be at the right place when it
// appears, not glide there.
export function jumpTo(s: HTMLElement, y: number) {
  s.scrollTop = y;
}

// A short glide, for moving within a screen (more below, the importance row
// opening). Instant under reduce-motion.
export function glideBy(s: HTMLElement, dy: number) {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const opts: ScrollToOptions = { top: dy, behavior: reduced ? "auto" : "smooth" };
  if (isPage(s)) window.scrollBy?.(opts);
  else if (s.scrollBy) s.scrollBy(opts);
  else s.scrollTop += dy;
}

/**
 * Remembers the scroll position of each view and sets it when the view
 * changes: a new view opens at the top; `restore(from, to)` says when going
 * to `to` is a step back, which returns to where that view was left.
 *
 * `anchor` is any element beside or inside the screen, used to find what
 * scrolls; without one it's the page.
 */
export function useScrollMemory(
  key: string,
  restore: (from: string, to: string) => boolean = () => false,
  anchor?: RefObject<Element | null>,
) {
  const saved = useRef(new Map<string, number>());
  const prev = useRef(key);
  // The position as of the last scroll event. Read before the browser clamps
  // it to a shorter new view, which it does during layout, before any scroll
  // event for the clamp is delivered.
  const y = useRef(0);
  const scroller = () => scrollerOf(anchor?.current);

  useEffect(() => {
    y.current = scroller().scrollTop;
    // Scroll events don't bubble, but they can be caught on the way down.
    const fn = (e: Event) => {
      const s = scroller();
      const from = e.target === document ? pageScroller() : e.target;
      if (from === s) y.current = s.scrollTop;
    };
    document.addEventListener("scroll", fn, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", fn, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const from = prev.current;
    if (from === key) return;
    prev.current = key;
    saved.current.set(from, y.current);
    const to = restore(from, key) ? (saved.current.get(key) ?? 0) : 0;
    jumpTo(scroller(), to);
    y.current = to;
    // `restore` is a rule, not state; a new function each render is fine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
