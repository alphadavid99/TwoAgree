import { useState } from "react";
import { DECKS } from "../lib/questions";
import { nLevels, lvlQs, partName, deckDepthWord } from "../lib/leveling";
import { catComplete, curLevel, doneInLevel, levelComplete } from "../lib/progress";
import { revealedRows } from "../lib/results";
import { type Role } from "../lib/scoring";
import { SUBJECTS } from "../lib/subjects";
import type { Session } from "../types";
import { DeckIcon } from "../components/icons";
import { deckName } from "../lib/questions.fr";
import { useT, useLang } from "../lib/i18n";

// Conversations (design refresh, item 11): "Pick up where you left off" first,
// then every topic grouped by subject. Each row talks in parts, with a small
// bar per part, never question counts or time estimates.
export default function DecksScreen({
  session,
  role,
  onPlay,
  current,
}: {
  session: Session;
  role: Role;
  onPlay: (slug: string) => void;
  /** The conversation you were last in, for "Pick up where you left off". */
  current?: string;
}) {
  const t = useT();
  const lang = useLang();
  const [query, setQuery] = useState("");
  const { rows } = revealedRows(session.decks, role);
  const pctOf = (slug: string) => rows.find((r) => r.slug === slug)?.pct;

  const started = (slug: string) =>
    DECKS[slug].questions.some((q) => session.decks?.[slug]?.answers?.[q.id]?.[role] != null);
  const pick = current && DECKS[current] && started(current) && !catComplete(current, session.decks?.[current], role) ? current : undefined;

  // Accept messy input: case, accents and stray spaces don't matter.
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const q = norm(query);
  const matches = (slug: string) => !q || norm(deckName(slug, lang)).includes(q) || norm(DECKS[slug].name).includes(q);

  return (
    <section>
      <h1 className="h1" style={{ margin: "20px 2px 2px" }}>
        {t("Conversations", "Conversations")}
      </h1>
      <p className="helper" style={{ margin: "0 2px 14px" }}>
        {t("Short parts, answered on your own, opened together.", "De courtes parties, répondues chacun de son côté, ouvertes ensemble.")}
      </p>
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
        />
      </label>

      {pick && !q && <PickUp slug={pick} session={session} role={role} onPlay={onPlay} />}

      {SUBJECTS.map((g) => {
        const slugs = g.slugs.filter((s) => DECKS[s] && matches(s));
        if (!slugs.length) return null;
        return (
          <div key={g.key}>
            <div className="cv-group">
              <h2>{t(g.en, g.fr)}</h2>
              <span>{t(g.tagEn, g.tagFr)}</span>
            </div>
            {slugs.map((slug) => (
              <DeckRow key={slug} slug={slug} session={session} role={role} pct={pctOf(slug)} onPlay={onPlay} />
            ))}
          </div>
        );
      })}
      {q && !SUBJECTS.some((g) => g.slugs.some((s) => DECKS[s] && matches(s))) && (
        <p className="helper center" style={{ marginTop: 24 }}>
          {t("No conversation by that name.", "Aucune conversation de ce nom.")}
        </p>
      )}
    </section>
  );
}

function PickUp({ slug, session, role, onPlay }: { slug: string; session: Session; role: Role; onPlay: (slug: string) => void }) {
  const t = useT();
  const lang = useLang();
  const deck = session.decks?.[slug];
  const lvl = curLevel(slug, deck, role);
  const total = lvlQs(slug, lvl).length;
  const mine = doneInLevel(slug, lvl, deck, role);
  const L = nLevels(slug);
  return (
    <div className="card cv-pick">
      <span className="eyebrow">{t("Pick up where you left off", "Reprenez là où vous en étiez")}</span>
      <div className="cv-pick-nm">
        {deckName(slug, lang)} · {partName(slug, lvl)}
      </div>
      <div className="helper">
        {L > 1 ? t(`Part ${lvl + 1} of ${L} · `, `Partie ${lvl + 1} sur ${L} · `) : ""}
        {t(`${mine} of ${total} answered`, `${mine} sur ${total} répondues`)}
      </div>
      <div className="qprog featprog" aria-hidden="true">
        <i style={{ width: `${total ? Math.round((mine / total) * 100) : 0}%` }} />
      </div>
      <button className="btn pill" type="button" onClick={() => onPlay(slug)}>
        {t("Continue", "Continuer")}
      </button>
    </div>
  );
}

function DeckRow({
  slug,
  session,
  role,
  pct,
  onPlay,
}: {
  slug: string;
  session: Session;
  role: Role;
  pct: number | undefined;
  onPlay: (slug: string) => void;
}) {
  const t = useT();
  const lang = useLang();
  const d = DECKS[slug];
  const deck = session.decks?.[slug];
  const L = nLevels(slug);
  const complete = catComplete(slug, deck, role);
  const lvl = curLevel(slug, deck, role);
  const mine = doneInLevel(slug, lvl, deck, role);
  const total = lvlQs(slug, lvl).length;
  // Depth words stay (Hardest included); only the deeper ones earn a tag.
  const depth = deckDepthWord(slug);
  const tag = depth[0] === "Hardest" || depth[0] === "Vulnerable" ? t(...depth) : null;
  const sub = complete
    ? pct != null
      ? t(`Complete · ${pct}% agree`, `Terminé · ${pct} % d’accord`)
      : t("Complete", "Terminé")
    : mine > 0
      ? t(`Part ${lvl + 1} · ${mine} of ${total} answered`, `Partie ${lvl + 1} · ${mine} sur ${total} répondues`)
      : t(`${L} part${L === 1 ? "" : "s"}`, `${L} partie${L === 1 ? "" : "s"}`);
  return (
    <button type="button" className="cv-row" onClick={() => onPlay(slug)}>
      <span className="tg-icon" aria-hidden="true">
        <DeckIcon icon={d.icon} size={22} />
      </span>
      <span className="cv-row-main">
        <span className="cv-row-nm">
          {deckName(slug, lang)}
          {tag && <span className="kbadge close">{tag}</span>}
        </span>
        <span className="cv-row-sub">{sub}</span>
        <span className="cv-bars" aria-hidden="true">
          {Array.from({ length: L }, (_, i) => {
            const n = lvlQs(slug, i).length;
            const f = levelComplete(deck, i, role) ? 1 : n ? doneInLevel(slug, i, deck, role) / n : 0;
            return (
              <span key={i} className="cv-bar">
                <i style={{ width: `${Math.round(f * 100)}%` }} />
              </span>
            );
          })}
        </span>
      </span>
      <span className="cv-go" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
