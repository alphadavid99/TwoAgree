import { DECKS, ORDER } from "../lib/questions";
import { stageOf, STAGES, nLevels } from "../lib/leveling";
import { curLevel, catComplete } from "../lib/progress";
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

  const answered = (slug: string, deck: DeckData | undefined) =>
    DECKS[slug].questions.filter((q) => deck?.answers?.[q.id]?.[role] != null).length;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        {t("The decks", "Les thèmes")}
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 20px" }}>
        {t("Where to go next", "Où aller ensuite")}
      </h1>

      {buckets.map((bucket, i) =>
        bucket.length ? (
          <div key={i}>
            <div className="stagelabel">
              <span>{t(STAGES[i][0], STAGES_FR[i][0])}</span>
              <span className="muted">{t(STAGES[i][1], STAGES_FR[i][1])}</span>
            </div>
            {bucket.map((slug) => {
              const d = DECKS[slug];
              const deck = session.decks?.[slug];
              const total = d.questions.length;
              const mine = answered(slug, deck);
              const L = nLevels(slug);
              const lvl = curLevel(slug, deck, role);
              const sub =
                L > 1
                  ? catComplete(slug, deck, role)
                    ? t(
                        `All ${L} levels done · ${total} questions`,
                        `Les ${L} niveaux terminés · ${total} questions`,
                      )
                    : t(
                        `Level ${lvl + 1} of ${L} · ${total} questions`,
                        `Niveau ${lvl + 1} sur ${L} · ${total} questions`,
                      )
                  : mine > 0
                    ? t(
                        `${mine} of ${total} answered`,
                        `${mine} sur ${total} répondues`,
                      )
                    : t(`${total} questions`, `${total} questions`);
              return (
                <div key={slug} className="row" onClick={() => onPlay(slug)}>
                  <div className="catico" style={{ background: `${d.color}1A`, color: d.color }}>
                    <DeckIcon icon={d.icon} size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 600 }}>{deckName(slug, lang)}</div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {sub}
                    </div>
                  </div>
                  <ProgressRing done={mine} total={total} size={46} />
                </div>
              );
            })}
          </div>
        ) : null,
      )}
      <p className="muted center" style={{ fontSize: 12, marginTop: 18 }}>
        {(() => {
          const done = ORDER.filter((s) =>
            catComplete(s, session.decks?.[s], role),
          ).length;
          return t(
            `${done} of ${ORDER.length} decks complete`,
            `${done} thèmes terminés sur ${ORDER.length}`,
          );
        })()}
      </p>
    </section>
  );
}
