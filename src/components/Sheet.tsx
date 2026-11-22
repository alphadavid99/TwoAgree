import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useT } from "../lib/i18n";
import { prefersStill, spring, Velocity } from "../lib/motion";

// A bottom sheet (How scores work, Share your score, the conversation guide).
// Rendered into the phone container, not in place: a screen's entry motion
// makes its own stacking layer, which would put the tab bar over the sheet.
// The dialog itself takes focus (not the ×), so screen readers land in it
// without a focus ring appearing on a touch open; Escape closes it.
//
// Motion (rules 1 and 9): it rises from the bottom edge and falls back on
// close. The grip and the header can be dragged: let go past 40% of the way
// down, or flick, and it closes; otherwise it springs home. Release speed sets
// how it settles. The body keeps its own scroll, so the drag lives on the top
// only (on iOS a pull on a scroll view turns into its bounce).
export function Sheet({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const t = useT();
  const sheet = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLSpanElement>(null);
  const [host, setHost] = useState<Element | null>(null);
  const closing = useRef(false);
  const stop = useRef<(() => void) | null>(null);
  const drag = useRef<{ from: number; y: number; vel: Velocity } | null>(null);
  const y = useRef(0);

  // Where the sheet sits (0 = open) and how dark the scrim is because of it.
  const place = useCallback((at: number) => {
    y.current = at;
    const el = sheet.current;
    if (!el) return;
    el.style.transform = at ? `translateY(${at}px)` : "";
    const h = el.offsetHeight || 1;
    scrim.current?.style.setProperty("--shade", String(Math.max(0, 1 - Math.max(at, 0) / h)));
  }, []);

  // Close with the sheet falling back down. Where the browser can't animate
  // (or motion is off) it simply closes.
  const dismiss = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    stop.current?.();
    const el = sheet.current;
    if (!el || prefersStill() || typeof el.animate !== "function") return onClose();
    const h = el.offsetHeight;
    scrim.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-in", fill: "forwards" });
    el.animate([{ transform: `translateY(${y.current}px)` }, { transform: `translateY(${h}px)` }], {
      duration: 200,
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      fill: "forwards",
    }).finished.then(onClose, onClose);
  }, [onClose]);

  useEffect(() => {
    setHost(anchor.current?.closest(".phone") ?? document.body);
  }, []);
  useEffect(() => {
    sheet.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss, host]);
  useEffect(() => () => stop.current?.(), []);

  const down = (e: RPointerEvent<HTMLDivElement>) => {
    if (closing.current || (e.target as Element).closest("button")) return;
    stop.current?.();
    const vel = new Velocity();
    vel.reset(y.current);
    drag.current = { from: e.clientY - y.current, y: y.current, vel };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const raw = e.clientY - d.from;
    // A little give upward, never past the top.
    const at = raw < 0 ? Math.max(raw * 0.3, -16) : raw;
    d.vel.push(at);
    place(at);
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !sheet.current) return;
    const v = d.vel.get();
    const h = sheet.current.offsetHeight;
    const at = y.current;
    if (v > 500 || (at > h * 0.4 && v > -200)) {
      closing.current = true;
      stop.current = spring(at, h, Math.max(v, 900), place, onClose);
    } else {
      stop.current = spring(at, 0, v, place);
    }
  };

  if (!host) return <span ref={anchor} hidden />;
  return createPortal(
    <div ref={scrim} className="sheet-scrim" onClick={dismiss}>
      <div
        ref={sheet}
        tabIndex={-1}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sheet-drag"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          <div className="sheet-grip" aria-hidden="true" />
          <div className="sheet-head">
            <div>
              {eyebrow && <div className="eyebrow">{eyebrow}</div>}
              <h2 className="sheet-title">{title}</h2>
            </div>
            <button className="iconbtn" type="button" onClick={dismiss} aria-label={t("Close", "Fermer")}>
              ×
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>,
    host,
  );
}
