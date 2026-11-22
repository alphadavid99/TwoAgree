import { useCallback, useRef } from "react";

/**
 * Fade a sideways scroller's edge only where there's more to see (design
 * hack 6). Returns a callback ref: put it on the scrolling element. At the
 * start only the right edge fades, in the middle both, at the end only the
 * left, so the first item is never faded before you've scrolled.
 * The mask itself is `.fade-x` in index.css.
 */
export function useEdgeFade<T extends HTMLElement>(): (el: T | null) => void {
  const undo = useRef<(() => void) | null>(null);
  return useCallback((el: T | null) => {
    undo.current?.();
    undo.current = null;
    if (!el) return;
    el.classList.add("fade-x");
    const set = () => {
      el.classList.toggle("more-l", el.scrollLeft > 2);
      el.classList.toggle("more-r", el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };
    set();
    el.addEventListener("scroll", set, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(set) : null;
    ro?.observe(el);
    const mo = typeof MutationObserver !== "undefined" ? new MutationObserver(set) : null;
    mo?.observe(el, { childList: true });
    undo.current = () => {
      el.removeEventListener("scroll", set);
      ro?.disconnect();
      mo?.disconnect();
    };
  }, []);
}
