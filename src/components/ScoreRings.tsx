import { useEffect, useRef, useState, type ReactNode } from "react";
import { PctRing } from "./Ring";
import { HowScores } from "./HowScores";
import { useT } from "../lib/i18n";

// Where you stand (design refresh, items 10 and 13): two separate rings, Agree
// in honey and Known in claret (rose on a claret ground), each with its count
// underneath. As you scroll past them they shrink into a slim bar that stays
// at the top with whatever sits under it (the review's filters), so the score
// is always in view. Used by "Your answers, side by side" and Together.
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
  const [slim, setSlim] = useState(false);
  const rings = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rings.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setSlim(!e.isIntersecting && e.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
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
        <PctRing pct={pct} size={124} color={colour} label="" ink={ink} track={track} />
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

  return (
    <>
      <div ref={rings} className={`srings${claret ? " on-claret" : ""}`}>
        {ring(agree, agreeColour, t("Agree", "D’accord"), t(`based on ${basis} question${basis === 1 ? "" : "s"}`, `sur ${basis} question${basis === 1 ? "" : "s"}`))}
        {ring(
          known,
          knownColour,
          t("Known", "Connus"),
          made ? t(`${right} of ${made} guesses`, `${right} intuitions sur ${made}`) : t("no guesses yet", "pas encore d’intuitions"),
        )}
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
      {(sticky || slim) && (
        <div className="sbarwrap">
          {slim && (
            <div className="sbarslim" aria-hidden="true">
              <span className="sbarslim-item">
                <PctRing pct={agree ?? 0} size={40} color="var(--app-honey)" label="" />
                <b>{agree ?? "—"}%</b>
                <i>{t("Agree", "D’accord")}</i>
              </span>
              <span className="sbarslim-item">
                <PctRing pct={known ?? 0} size={40} color="var(--ta-claret)" label="" />
                <b>{known ?? "—"}%</b>
                <i>{t("Known", "Connus")}</i>
              </span>
              {label && <span className="sbarslim-label">{label}</span>}
            </div>
          )}
          {sticky}
        </div>
      )}
    </>
  );
}
