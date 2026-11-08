import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { DECKS } from "../lib/questions";
import { nLevels, lvlQs, partName, deckDepthWord } from "../lib/leveling";
import { catComplete, curLevel, doneInLevel, levelComplete, levelDone } from "../lib/progress";
import { startedLevel } from "../lib/privacy";
import { other, overall, type Role } from "../lib/scoring";
import { SUBJECTS } from "../lib/subjects";
import type { Session } from "../types";
import { DeckIcon, IconBell } from "../components/icons";
import { Avatar, toneFor } from "../components/Avatar";
import { deckName } from "../lib/questions.fr";
import { useT, useLang } from "../lib/i18n";

// Every conversation, subject by subject, in display order.
const ALL: string[] = SUBJECTS.flatMap((g) => g.slugs).filter((s) => DECKS[s]);

type Ring = "turn" | "going" | "done" | "new";

// The For you circle's key in the row.
const FY = "__for-you";

// Conversations (Dave, Nov 2026, after Dateasy's chat list): every
// conversation as a big circle in one sideways row, its ring saying where
// you are (honey: your partner is waiting on you; mauve: under way; deep:
// finished; pale: not started). Tap one and its parts list below, each a
// rounded row you can open straight away. It talks in parts, never question
// counts or time estimates.
export default function DecksScreen({
  session,
  role,
  onPlay,
  onPart,
  current,
  forYou,
  forYouFresh = false,
  firstLabel,
  firstIcon,
  past = false,
  onBack,
  actSlot,
}: {
  session: Session;
  role: Role;
  /** Open a conversation the usual way (its whole review once finished). */
  onPlay: (slug: string) => void;
  /** Open one part of a conversation straight away. */
  onPart?: (slug: string, level: number) => void;
  /** The conversation you were last in: chosen when the screen opens. */
  current?: string;
  /** For you: invites and your partner's progress, as the first circle. */
  forYou?: ReactNode;
  /** Something new in For you since you last looked. */
  forYouFresh?: boolean;
  /** The first circle's name and icon, when it isn't For you. */
  firstLabel?: string;
  firstIcon?: ReactNode;
  /** Past conversations (Together): only what you've both opened, to review. */
  past?: boolean;
  /** Past conversations: back to the score. */
  onBack?: () => void;
  /** The shared header's button spot, left of the bell. */
  actSlot?: HTMLElement | null;
}) {
  const t = useT();
  const lang = useLang();
  const [query, setQuery] = useState("");
  // Search opens from the round button in the header (Dave, Nov 2026).
  const [searching, setSearching] = useState(false);
  const decks = session.decks;
  const me = session.members?.[role];
  const them = session.members?.[other(role)];
  const myName = me?.name ?? t("You", "Vous");
  const partnerName = them?.name ?? t("your partner", "votre partenaire");
  const theirFirst = partnerName.trim().split(/\s+/)[0] || partnerName;

  const begun = (s: string) => Object.values(decks?.[s]?.answers ?? {}).some((a) => a?.[role] != null);
  // Past conversations: only the ones with a part you've both opened.
  const opened = (s: string) => Array.from({ length: nLevels(s) }, (_, l) => levelComplete(decks?.[s], l, role)).some(Boolean);
  const POOL = past ? ALL.filter(opened) : ALL;
  const ring = (s: string): Ring => {
    const d = decks?.[s];
    if (past) return catComplete(s, d, role) ? "done" : "going";
    for (let l = 0; l < nLevels(s); l++) if (levelDone(d, l, other(role)) && !levelDone(d, l, role)) return "turn";
    if (catComplete(s, d, role)) return "done";
    return begun(s) ? "going" : "new";
  };

  // Chosen when the screen opens: the one you were last in, else the first
  // where your partner is waiting, else the first under way, else the first.
  const [sel, setSel] = useState<string>(() => {
    if (forYou && forYouFresh) return FY;
    if (current && DECKS[current] && POOL.includes(current)) return current;
    return POOL.find((s) => ring(s) === "turn") ?? POOL.find((s) => ring(s) === "going") ?? POOL[0] ?? ALL[0];
  });

  // Accept messy input: case, accents and stray spaces don't matter.
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const q = norm(query);
  const matches = (s: string) => !q || norm(deckName(s, lang)).includes(q) || norm(DECKS[s].name).includes(q);
  const shown = POOL.filter(matches);
  // A search that hides the chosen one chooses the first it finds.
  useEffect(() => {
    if (sel === FY && !q) return;
    if (shown.length && !shown.includes(sel)) setSel(shown[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Keep the chosen circle in view in the sideways row.
  // At once when the screen opens, gently after a tap; only the row
  // scrolls, never the page.
  const row = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    const r = row.current;
    const el = r?.querySelector<HTMLElement>(`[data-slug="${sel}"]`);
    if (r && el) {
      const left = el.offsetLeft - (r.clientWidth - el.offsetWidth) / 2;
      r.scrollTo?.({ left, behavior: first.current ? "auto" : "smooth" });
    }
    first.current = false;
  }, [sel]);

  const searchBtn = (
    <button
      className="pcircle"
      type="button"
      aria-expanded={searching}
      aria-label={t("Search conversations", "Rechercher une conversation")}
      onClick={() => {
        if (searching) setQuery("");
        setSearching(!searching);
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </button>
  );

  // The conversation whose parts show (For you has none of its own).
  const ds = sel === FY ? (shown[0] ?? POOL[0] ?? ALL[0]) : sel;
  const d = decks?.[ds];
  const n = nLevels(ds);
  const openedCount = Array.from({ length: n }, (_, i) => levelComplete(d, i, role)).filter(Boolean).length;
  const here = curLevel(ds, d, role);
  const selRing = ring(ds);

  const ringWord: Record<Ring, string> = {
    turn: t(`${theirFirst} is waiting on you`, `${theirFirst} vous attend`),
    going: t("Under way", "En cours"),
    done: t("Finished", "Terminée"),
    new: t("Not started", "Pas commencée"),
  };

  return (
    <section>
      {past ? (
        <div className="past-head">
          {onBack && (
            <button className="pcircle" type="button" onClick={onBack} aria-label={t("Back to Together", "Retour à Ensemble")}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M14.5 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <h1 className="pagetitle">{t("Past conversations", "Conversations passées")}</h1>
        </div>
      ) : (
        <>
          {actSlot ? createPortal(searchBtn, actSlot) : searchBtn}
          <h1 className="pagetitle">{t("Conversations", "Conversations")}</h1>
        </>
      )}
      {(searching || past) && (
        <label className="cv-search">
          <span className="sr-only">{t("Search conversations", "Rechercher une conversation")}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search conversations", "Rechercher une conversation")}
            autoFocus={!past}
          />
        </label>
      )}

      {/* Every conversation as a big circle; its ring says where you are. */}
      <div ref={row} className="cv-circles" role="group" aria-label={t("Conversations", "Conversations")}>
        {/* For you first: invites and your partner's progress. */}
        {forYou && !q && (
          <button
            type="button"
            data-slug={FY}
            className={`cv-circ fy turn${sel === FY ? " on" : ""}`}
            aria-pressed={sel === FY}
            aria-label={firstLabel ?? t("For you", "Pour vous")}
            onClick={() => setSel(FY)}
          >
            <span className="cv-circ-disc" aria-hidden="true">
              {firstIcon ?? <IconBell size={28} />}
              {forYouFresh && <span className="cv-circ-new" />}
            </span>
            <span className="cv-circ-nm">{firstLabel ?? t("For you", "Pour vous")}</span>
          </button>
        )}
        {shown.map((s) => {
          const r = ring(s);
          return (
            <button
              key={s}
              type="button"
              data-slug={s}
              className={`cv-circ ${r}${s === sel ? " on" : ""}`}
              aria-pressed={s === sel}
              aria-label={`${deckName(s, lang)}: ${ringWord[r]}`}
              onClick={() => setSel(s)}
            >
              <span className="cv-circ-disc" aria-hidden="true">
                <DeckIcon icon={DECKS[s].icon} size={30} />
              </span>
              <span className="cv-circ-nm">{deckName(s, lang)}</span>
            </button>
          );
        })}
      </div>
      {past && !POOL.length && (
        <p className="helper center" style={{ marginTop: 24 }}>
          {t("Nothing opened together yet.", "Rien d’ouvert ensemble pour l’instant.")}
        </p>
      )}
      {q && !shown.length && (
        <p className="helper center" style={{ marginTop: 24 }}>
          {t("No conversation by that name.", "Aucune conversation de ce nom.")}
        </p>
      )}

      {sel === FY && forYou && !q ? (
        <>
          <div className="cv-parts-h">
            <h2>{firstLabel ?? t("For you", "Pour vous")}</h2>
          </div>
          {past ? forYou : <div className="card fy-card cv-fy">{forYou}</div>}
        </>
      ) : shown.length > 0 && (
        <>
          <div className="cv-parts-h">
            <h2>{deckName(ds, lang)}</h2>
            <span className={selRing === "turn" ? "turn" : undefined}>
              {selRing === "turn"
                ? ringWord.turn
                : n > 1
                  ? t(`${openedCount} of ${n} parts opened`, `${openedCount} parties ouvertes sur ${n}`)
                  : t(...deckDepthWord(ds))}
            </span>
          </div>
          <div className="cv-parts">
            {Array.from({ length: n }, (_, i) => {
              if (past && !levelComplete(d, i, role)) return null;
              const youDone = levelDone(d, i, role);
              const themDone = levelDone(d, i, other(role));
              const both = levelComplete(d, i, role);
              const mine = doneInLevel(ds, i, d, role);
              const theyStarted = startedLevel(d, i, other(role));
              const turn = themDone && !youDone;
              const pct = both ? overall(lvlQs(ds, i), d ?? {}, role) : null;
              const theirs = themDone
                ? t(`${theirFirst} has finished`, `${theirFirst} a terminé`)
                : theyStarted
                  ? t(`${theirFirst} has started`, `${theirFirst} a commencé`)
                  : t(`${theirFirst} hasn’t started`, `${theirFirst} n’a pas commencé`);
              const sub = both
                ? t(`Opened together · ${pct}% agree`, `Ouverte ensemble · ${pct} % d’accord`)
                : turn
                  ? t(`${theirFirst} finished · your turn`, `${theirFirst} a terminé · à vous`)
                  : youDone
                    ? t(`You’ve finished · ${theirs}`, `Vous avez terminé · ${theirs}`)
                    : mine > 0
                      ? t(`You’re part way through · ${theirs}`, `Vous êtes en cours · ${theirs}`)
                      : theyStarted
                        ? theirs
                        : t("Not started yet", "Pas encore commencée");
              return (
                <button
                  key={i}
                  type="button"
                  className={`cv-part${i === here && !both ? " here" : ""}`}
                  onClick={() => (onPart ? onPart(ds, i) : onPlay(ds))}
                >
                  <span className={`cv-part-n${both ? " done" : turn ? " turn" : ""}`} aria-hidden="true">
                    {both ? "✓" : i + 1}
                  </span>
                  <span className="cv-part-txt">
                    <span className="cv-part-nm">{n > 1 ? partName(ds, i) : deckName(ds, lang)}</span>
                    <span className="cv-part-sub">{sub}</span>
                  </span>
                  {both ? (
                    <span className="cv-part-pct">{pct}%</span>
                  ) : turn ? (
                    <span className="cv-part-dot" aria-hidden="true" />
                  ) : youDone || mine > 0 || theyStarted ? (
                    <span className="cv-part-avs" aria-hidden="true">
                      <Avatar name={myName} photo={me?.photo} tone={toneFor(role)} size={28} ring={false} done={youDone} pending={!youDone && mine === 0} />
                      <Avatar name={partnerName} photo={them?.photo} tone={toneFor(other(role))} size={28} ring={false} done={themDone} pending={!themDone && !theyStarted} />
                    </span>
                  ) : (
                    <span className="cv-part-go" aria-hidden="true">&#8250;</span>
                  )}
                </button>
              );
            })}
          </div>
          {catComplete(ds, d, role) && (
            <button className="linkbtn hero-alt cv-all" type="button" onClick={() => onPlay(ds)}>
              {t("See every answer side by side", "Voir toutes les réponses côte à côte")}
            </button>
          )}
        </>
      )}
    </section>
  );
}
