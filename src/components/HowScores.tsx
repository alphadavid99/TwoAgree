import { useT } from "../lib/i18n";
import { Sheet } from "./Sheet";

// "How scores work" (design refresh, item 4). The Agree score stays weighted,
// so it can't be written as "x of y agreed"; this sheet says plainly what goes
// into it, with the real numbers, and what's left out. Known is a straight
// count, so it says so.
export function HowScores({
  agree,
  known,
  onClose,
}: {
  agree: { pct: number | null; basis: number };
  known: { pct: number | null; right: number; made: number };
  onClose: () => void;
}) {
  const t = useT();
  return (
    <Sheet title={t("How scores work", "Comment fonctionnent les scores")} onClose={onClose}>
        <div className="kcard">
          <div className="kcard-row">
            <span className="kcard-label">{t("Agree", "D’accord")}</span>
            {agree.pct != null && <span className="kcard-num">{agree.pct}%</span>}
          </div>
          <p>
            {t(
              `How close your answers are, on the ${agree.basis} question${agree.basis === 1 ? "" : "s"} you’ve both answered.`,
              `À quel point vos réponses sont proches, sur ${agree.basis} question${agree.basis === 1 ? "" : "s"} auxquelles vous avez tous deux répondu.`,
            )}
          </p>
          <ul>
            <li>{t("The same answer counts fully.", "La même réponse compte entièrement.")}</li>
            <li>
              {t(
                "On a 1–5 scale, close answers count partly: one point apart counts ¾, two apart counts half.",
                "Sur une échelle de 1 à 5, des réponses proches comptent en partie : un point d’écart compte ¾, deux points la moitié.",
              )}
            </li>
            <li>
              {t(
                "On rankings, the closer your orders, the more it counts.",
                "Pour les classements, plus vos ordres sont proches, plus cela compte.",
              )}
            </li>
            <li>
              {t(
                "Deeper questions count more. A question either of you marks as important counts more too.",
                "Les questions plus profondes comptent davantage. Une question que l’un de vous juge importante aussi.",
              )}
            </li>
          </ul>
        </div>

        <div className="kcard">
          <div className="kcard-row">
            <span className="kcard-label amber">{t("Known", "Connus")}</span>
            {known.pct != null && <span className="kcard-num amber">{known.pct}%</span>}
          </div>
          <p>
            {known.made
              ? t(
                  `How often you guessed each other’s answer exactly: ${known.right} of your ${known.made} guesses. Skipped guesses don’t count against you.`,
                  `À quelle fréquence vous avez deviné exactement la réponse de l’autre : ${known.right} sur ${known.made}. Les intuitions passées ne comptent pas contre vous.`,
                )
              : t(
                  "How often you guess each other’s answer exactly. No guesses yet; skipped guesses don’t count against you.",
                  "À quelle fréquence vous devinez exactement la réponse de l’autre. Pas encore d’intuitions ; celles passées ne comptent pas contre vous.",
                )}
          </p>
        </div>

        <p className="sheet-note">
          {t(
            "Left out: written answers, questions only one of you answered, and anything marked “Not yet”.",
            "Non comptés : les réponses écrites, les questions auxquelles un seul de vous a répondu, et tout ce qui est marqué « Pas encore ».",
          )}
        </p>
        <p className="sheet-close-line">
          {t(
            "These numbers describe your answers, not your relationship. They’re a place to start talking.",
            "Ces chiffres décrivent vos réponses, pas votre relation. Ils sont un point de départ pour discuter.",
          )}
        </p>
    </Sheet>
  );
}
