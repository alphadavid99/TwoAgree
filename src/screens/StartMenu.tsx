import { a7Cards, type OnbStage } from "../lib/onboarding";
import { useT, useLang } from "../lib/i18n";
import { deckName } from "../lib/questions.fr";

// A7 (brief 2 §A7) — "Where would you like to start?" Five stage-keyed
// conversations, each showing a REAL question from inside it (the hook), so the
// screen is a table of contents, not a menu. A label is a folder; a question is
// a conversation they can already feel. Ordered Warm-up → Hardest.
export default function StartMenu({
  stage,
  onPick,
  onSeeAll,
}: {
  stage: OnbStage;
  onPick: (slug: string) => void;
  onSeeAll: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const cards = a7Cards(stage);
  return (
    <section className="screen-enter">
      <div className="eyebrow center" style={{ marginTop: 26 }}>
        {t("The two of you", "Vous deux")}
      </div>
      <h1 className="h1 center" style={{ margin: "8px 24px 16px" }}>
        {t("Where would you like to start?", "Par où aimeriez-vous commencer ?")}
      </h1>

      <div className="menucards">
        {cards.map((c) => (
          <button key={c.slug} type="button" className="menucard" onClick={() => onPick(c.slug)}>
            <div className="menucard-top">
              <span className="menucard-nm">{deckName(c.slug, lang)}</span>
              <span className="menucard-depth">{t(...c.depth)}</span>
            </div>
            <div className="menucard-hook">“{c.hook}”</div>
            <div className="menucard-count">
              {t(`${c.count} questions`, `${c.count} questions`)}
            </div>
          </button>
        ))}
      </div>

      <button className="btn ghost" type="button" onClick={onSeeAll}>
        {t("See all 21", "Voir les 21")}
      </button>
    </section>
  );
}
