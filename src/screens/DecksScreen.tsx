import { DECKS, ORDER } from "../lib/questions";
import { stageOf, STAGES, deckDepthWord } from "../lib/leveling";
import { catComplete } from "../lib/progress";
import { revealedRows } from "../lib/results";
import { type DeckData, type Role } from "../lib/scoring";
import type { Session } from "../types";
import { ProgressRing } from "../components/Ring";
import { DeckIcon } from "../components/icons";
import { deckName } from "../lib/questions.fr";
import { useT, useLang } from "../lib/i18n";

// French labels for the three stages (parallel to STAGES in leveling.ts).
const STAGES_FR: [string, string][] = [
  ["Échauffement", "Des débuts légers et simples"],
  ["Cœur", "L’essentiel du quotidien"],
  ["Profond et honnête", "Convictions et vérités plus difficiles"],
];

// Depth words that add nothing inside their own stage bucket — the row would
// just repeat the heading two lines above it. Keyed by stage index, matched
// against the English word (deckDepthWord's canonical side).
const SAYS_NOTHING: string[][] = [
  ["Warm-up"], // under "Warm-up · Light, easy openers"
  ["Everyday"], // under "Core · The everyday substance"
  ["Vulnerable", "Hardest"], // under "Deep & honest · Convictions and harder truths"
];

export default function DecksScreen({
  session,
  role,
  onPlay,
}: {
  session: Session;
  role: Role;
  onPlay: (slug: string) => void;
}) {
  const t = useT();
  const lang = useLang();
  const buckets: string[][] = [[], [], []];
  ORDER.forEach((slug) => buckets[stageOf(slug)].push(slug));

  // Within a stage: what you're in the middle of, then what you haven't opened,
  // then what's finished. A static bank of 13 rows put a completed Money above
  // an in-progress Faith — the list gave no answer to "where was I?".
  const rank = (slug: string) => {
    const deck = session.decks?.[slug];
    if (catComplete(slug, deck, role)) return 2;
    return DECKS[slug].questions.some((q) => deck?.answers?.[q.id]?.[role] != null) ? 0 : 1;
  };
  // Stable within a rank, so the bank's curated order still shows through.
  const ordered = (bucket: string[]) =>
    bucket.map((s, i) => ({ s, i })).sort((a, b) => rank(a.s) - rank(b.s) || a.i - b.i).map((x) => x.s);

  const answered = (slug: string, deck: DeckData | undefined) =>
    DECKS[slug].questions.filter((q) => deck?.answers?.[q.id]?.[role] != null).length;

  // Completed decks wear their alignment score right in the list.
  const { rows, overallPct } = revealedRows(session.decks, role);
  const pctOf = (slug: string) => rows.find((r) => r.slug === slug)?.pct;
  const done = ORDER.filter((s) => catComplete(s, session.decks?.[s], role)).length;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        {t("Conversations", "Les conversations")}
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 4px" }}>
        {t("Where to go next", "Où aller ensuite")}
      </h1>
      <p className="muted center" style={{ fontSize: 13, margin: "0 0 14px" }}>
        {t(`${done} of ${ORDER.length} complete`, `${done} sur ${ORDER.length} terminées`)}
        {overallPct != null &&
          t(` · ${overallPct}% agreed so far`, ` · ${overallPct}% d’accord jusqu’ici`)}
      </p>

      {buckets.map((bucket, i) =>
        bucket.length ? (
          <div key={i}>
            <div className="stagelabel">
              <span>{t(STAGES[i][0], STAGES_FR[i][0])}</span>
              <span className="muted">{t(STAGES[i][1], STAGES_FR[i][1])}</span>
            </div>
            {ordered(bucket).map((slug) => {
              const d = DECKS[slug];
              const deck = session.decks?.[slug];
              const total = d.questions.length;
              const mine = answered(slug, deck);
              const complete = catComplete(slug, deck, role);
              // The deck's depth word — "what this is like" (brief 2 §A7c).
              // Suppressed when it merely restates the bucket it's sitting in:
              // "Warm-up · Warm-up · 23 questions" is noise, while "Vulnerable"
              // under Core is the useful warning it was meant to be.
              const raw = deckDepthWord(slug);
              const word = SAYS_NOTHING[i].includes(raw[0]) ? null : t(...raw);
              const lead = word ? `${word} · ` : "";
              const sub = complete
                ? t(`${lead}complete`, `${lead}terminé`)
                : mine > 0
                  ? t(
                      `${lead}${mine} of ${total} answered`,
                      `${lead}${mine} sur ${total} répondues`,
                    )
                  : t(`${lead}${total} questions`, `${lead}${total} questions`);
              const pct = complete ? pctOf(slug) : undefined;
              return (
                <button
                  key={slug}
                  type="button"
                  className="row"
                  onClick={() => onPlay(slug)}
                >
                  <div className="catico" style={{ background: `${d.color}1A`, color: d.color }}>
                    <DeckIcon icon={d.icon} size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{deckName(slug, lang)}</div>
                    <div className="muted" style={{ fontSize: 12.5 }}>
                      {sub}
                    </div>
                  </div>
                  {pct != null ? (
                    <span className="pctpill">{pct}%</span>
                  ) : (
                    <ProgressRing done={mine} total={total} size={44} />
                  )}
                </button>
              );
            })}
          </div>
        ) : null,
      )}
    </section>
  );
}
