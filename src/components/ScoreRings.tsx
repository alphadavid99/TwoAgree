import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PctRing } from "./Ring";
import { HowScores } from "./HowScores";
import { useT } from "../lib/i18n";
import { scrollerOf } from "../lib/scroll";

// Where you stand (design refresh, items 10 and 13): two separate rings, Agree
// in honey and Known in claret (rose on a claret ground), each with its count
// underneath. As you scroll past them they shrink into a slim bar that stays
// at the top with whatever sits under it (the review's filters), so the score
// is always in view. Used by "Your answers, side by side" and Together.
//
// The slim bar follows the scroll rather than snapping in (feedback 25): the
// rings ease down and fade as they leave, and the bar slides in over the same
// stretch, so it reads as the rings minimising. The bar is fixed to the phone
// (portalled, like Sheet) so a card it sits in can't trap it, and it never
// takes part in layout, so nothing below jumps or widens the page.
export function ScoreRings({
  agree,
  basis,
  known,
  right,
  made,
  label,
  claret = false,
  sticky,
  foot,
  children,
}: {
  agree: number | null;
  basis: number;
  known: number | null;
  right: number;
  made: number;
  /** Shown in the slim bar ("MONEY · SHARING MONEY"). */
  label?: string;
  /** On the claret card (Together). */
  claret?: boolean;
  /** Rides in the sticky bar under the slim scores (the filters). */
  sticky?: ReactNode;
  /** Sits beside "How scores work" at the foot (Together's counts). */
  foot?: ReactNode;
  children?: ReactNode;
}) {
  const t = useT();
  const [how, setHow] = useState(false);
  // 0 while the rings are in view, 1 once they've scrolled away.
  const [p, setP] = useState(0);
  const [host, setHost] = useState<Element | null>(null);
  const zone = useRef<HTMLDivElement>(null);
  const [barH, setBarH] = useState(0);

  useEffect(() => {
    const el = zone.current;
    if (!el) return;
    setHost(el.closest(".phone") ?? document.body);
    let raf = 0;
    const measure = () => {
      raf = 0;
      // The top of whatever scrolls: the page, or the gallery's phone frame.
      const s = scrollerOf(el);
      const page = s === document.scrollingElement || s === document.documentElement;
      const top = page ? 0 : s.getBoundingClientRect().top;
      const r = el.getBoundingClientRect();
      const gone = r.height ? (top - r.top) / r.height : 0;
      const next = Math.min(1, Math.max(0, (gone - 0.35) / 0.55));
      setP((cur) => (Math.abs(cur - next) < 0.01 ? cur : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const agreeColour = claret ? "var(--ta-honey)" : "var(--app-honey)";
  const knownColour = claret ? "var(--app-rose-light)" : "var(--ta-claret)";
  const ink = claret ? "var(--ta-white)" : "var(--ta-ink)";
  const track = claret ? "rgba(243,222,214,0.18)" : "var(--track)";

  const ring = (pct: number | null, colour: string, name: string, count: string) => (
    <div className="sring">
      {pct == null ? (
        <div className="sring-none" aria-hidden="true">—</div>
      ) : (
        <PctRing pct={pct} size={108} color={colour} label="" ink={ink} track={track} />
      )}
      <div className="sring-name">{name}</div>
      <div className="sring-count">{count}</div>
    </div>
  );

  const howBtn = (
    <button className={`howlink${claret ? " on-claret" : ""}`} type="button" onClick={() => setHow(true)}>
      {t("How scores work", "Comment fonctionnent les scores")}
    </button>
  );

  const slimBar = (
    <div
      ref={(n) => {
        if (n) setBarH(n.offsetHeight);
      }}
      className="sbarslim"
      aria-hidden="true"
      style={{ "--p": p, pointerEvents: p > 0.5 ? "auto" : "none" } as CSSProperties}
    >
      <div className="sbarslim-card">
        <span className="sbarslim-item">
          <PctRing pct={agree ?? 0} size={26} color="var(--app-honey)" label="" />
          <b>{agree ?? "—"}%</b>
          <i>{t("Agree", "D’accord")}</i>
        </span>
        <span className="sbarslim-item">
          <PctRing pct={known ?? 0} size={26} color="var(--ta-claret)" label="" />
          <b>{known ?? "—"}%</b>
          <i>{t("Known", "Connus")}</i>
        </span>
        {label && <span className="sbarslim-label">{label}</span>}
      </div>
    </div>
  );

  return (
    <>
      <div ref={zone} className="srings-zone">
        <div
          className={`srings${claret ? " on-claret" : ""}`}
          style={{ "--q": Math.min(1, p * 1.4) } as CSSProperties}
        >
          {ring(agree, agreeColour, t("Agree", "D’accord"), t(`based on ${basis} question${basis === 1 ? "" : "s"}`, `sur ${basis} question${basis === 1 ? "" : "s"}`))}
          {ring(
            known,
            knownColour,
            t("Known", "Connus"),
            made ? t(`${right} of ${made} guesses`, `${right} intuitions sur ${made}`) : t("no guesses yet", "pas encore d’intuitions"),
          )}
        </div>
      </div>
      {children}
      {foot ? (
        <div className="srings-foot">
          {foot}
          {howBtn}
        </div>
      ) : (
        howBtn
      )}
      {how && <HowScores agree={{ pct: agree, basis }} known={{ pct: known, right, made }} onClose={() => setHow(false)} />}
      {sticky && (
        <div className="sbarwrap" style={{ top: `${Math.round(barH * p)}px` }}>
          {sticky}
        </div>
      )}
      {host && p > 0 && createPortal(slimBar, host)}
    </>
  );
}
