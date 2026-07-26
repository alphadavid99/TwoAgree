import { useState } from "react";
import { discoveries, answerText } from "../lib/discoveries";
import { localizeQuestion } from "../lib/questions.fr";
import type { Session } from "../types";
import type { Role } from "../lib/scoring";
import { useLang } from "../lib/i18n";

type T = (en: string, fr: string) => string;
const SHOWN = 3;

// What you've learned about them (UX review §6). Every wrong guess is counted
// as a miss by the Known score — which is backwards. A prediction you got wrong
// is the moment you found something out about the person you may marry, and
// that is the product's actual yield. Same data, read the right way round: it
// gives the percentage a substance layer, and makes a low Known score feel like
// riches rather than a deficit ("So much still to discover" — now shown).
export function Discoveries({
  session,
  role,
  partnerName,
  t,
}: {
  session: Session;
  role: Role;
  partnerName: string;
  t: T;
}) {
  const lang = useLang();
  const [all, setAll] = useState(false);
  const found = discoveries(session.decks, role);
  if (!found.length) return null;

  const them = partnerName.trim().split(/\s+/)[0] || partnerName;
  const shown = all ? found : found.slice(0, SHOWN);

  return (
    <div className="discwrap">
      <div className="shead" style={{ marginTop: 26 }}>
        {t(`What you've learned about ${them}`, `Ce que vous avez appris sur ${them}`)}
      </div>
      {shown.map((d) => {
        const q = localizeQuestion(d.q, lang);
        return (
          <div key={d.q.id} className="disc">
            <div className="disc-q">{q.q}</div>
            <div className="disc-learn">
              <span className="disc-tag">{t("You learned", "Vous avez appris")}</span>
              {answerText(q, d.theirAnswer)}
            </div>
            <div className="disc-thought">
              {t("You'd thought", "Vous pensiez")}: {answerText(q, d.yourGuess)}
            </div>
          </div>
        );
      })}
      {found.length > SHOWN && (
        <button className="btn ghost" type="button" onClick={() => setAll(!all)}>
          {all
            ? t("Show fewer", "Afficher moins")
            : t(`See all ${found.length}`, `Voir les ${found.length}`)}
        </button>
      )}
    </div>
  );
}
