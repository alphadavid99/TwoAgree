import { useEffect, useLayoutEffect, useRef, useState } from "react";

// The floating pill nav: five tabs, always labelled (item 10), so none has to
// be learned by its icon. The honey pill is a single indicator element that
// SLIDES to whichever tab you pick, measured after layout from the active
// tab's icon: it sits behind the icon only, one size for every tab, and the
// active label turns bold. Buttons sit above it on their own layer.
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
  const navRef = useRef<HTMLElement>(null);
  const [ind, setInd] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // Re-measure whenever the active tab or the labels (language) change, and
  // on resize — the active button's width isn't known until it has grown.
  const labels = items.map((i) => i.label).join("|");
  useLayoutEffect(() => {
    const measure = () => {
      const el = navRef.current?.querySelector<HTMLElement>(".bnav-item.on");
      const ic = el?.querySelector<HTMLElement>(".bnav-ic");
      if (el && ic)
        setInd({ left: el.offsetLeft + ic.offsetLeft, top: el.offsetTop + ic.offsetTop, width: ic.offsetWidth, height: ic.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, labels]);

  // Revolut-style (feedback, Nov 2026): the labels fold away as you scroll
  // down and come back as you scroll up or reach the top, so the dock takes
  // less of the screen while you read. The icons, and the pill behind the
  // active one, never move. Each new tab opens with its labels showing.
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
    <nav className={`bnav${folded ? " folded" : ""}`} ref={navRef}>
      {ind && <span className="bnav-ind" style={ind} aria-hidden="true" />}
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
