import { useEffect, useState } from "react";

// The floating pill nav: five tabs, always labelled (item 10), so none has to
// be learned by its icon. The honey pill is a single indicator element that
// SLIDES to whichever tab you pick: it sits behind the icon only, one size for
// every tab, and the active label turns bold. Buttons sit above it on their
// own layer. Scrolling down folds the labels away and the bar narrows to a
// capsule round its icons (as Revolut, Shop and IMDb do on Mobbin).
export type NavItem = {
  key: string;
  label: string;
  Icon: (p: { size?: number }) => React.JSX.Element;
};

export function PillNav({
  items,
  active,
  onSelect,
}: {
  items: NavItem[];
  active: string;
  onSelect: (key: string) => void;
}) {
  // Which tab is on, for the pill's place. The pill is laid out in CSS from
  // this index (--i of --n equal tabs), so it follows the bar as it narrows.
  const at = Math.max(0, items.findIndex((i) => i.key === active));

  // Revolut-style (feedback, Nov 2026): the labels fold away as you scroll
  // down and the bar narrows round its icons; scrolling up, or reaching the
  // top, brings them back. Each new tab opens unfolded.
  const [folded, setFolded] = useState(false);
  useEffect(() => {
    setFolded(false);
    const seen = new WeakMap<EventTarget, number>();
    const onScroll = (e: Event) => {
      const el = e.target === document ? document.scrollingElement : e.target;
      if (!(el instanceof HTMLElement)) return;
      const y = el.scrollTop;
      const from = seen.get(el) ?? y;
      if (y < 24) {
        setFolded(false);
        seen.set(el, y);
      } else if (y > from + 16) {
        setFolded(true);
        seen.set(el, y);
      } else if (y < from - 16) {
        setFolded(false);
        seen.set(el, y);
      } else if (!seen.has(el)) seen.set(el, y);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, [active]);

  return (
    <nav
      className={`bnav${folded ? " folded" : ""}`}
      style={{ "--i": at, "--n": items.length } as React.CSSProperties}
    >
      <span className="bnav-ind" aria-hidden="true" />
      {items.map(({ key, label, Icon }) => {
        const on = active === key;
        return (
          <button
            key={key}
            type="button"
            className={`bnav-item ${on ? "on" : ""}`}
            onClick={() => onSelect(key)}
            aria-current={on ? "page" : undefined}
            aria-label={label}
          >
            <span className="bnav-ic">
              <Icon size={22} />
            </span>
            <span className="bnav-lbl" aria-hidden="true">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
