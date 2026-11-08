// The floating nav (Dave, Nov 2026): a frosted capsule of five icons, no
// words, as Revolut, Shop and IMDb do on Mobbin. Each tab still carries its
// name for screen readers (aria-label). The honey pill is a single indicator
// that SLIDES to whichever tab you pick, laid out in CSS from its index.
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
  // Which tab is on, for the pill's place: laid out in CSS from this index
  // (--i of --n equal tabs), so there's nothing to measure.
  const at = Math.max(0, items.findIndex((i) => i.key === active));

  return (
    <nav
      className="bnav"
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
          </button>
        );
      })}
    </nav>
  );
}
