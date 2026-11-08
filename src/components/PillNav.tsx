import { useLayoutEffect, useRef, useState } from "react";

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

  return (
    <nav className="bnav" ref={navRef}>
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
          >
            <span className="bnav-ic">
              <Icon size={22} />
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
