import { useState } from "react";
import { Avatar } from "./Avatar";
import { TalkGuide } from "../screens/TalkGuide";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { asTheirs, type namesFor } from "../lib/who";
import { answerText } from "../lib/discoveries";
import { writeTalked, writeTalkPin } from "../lib/session";
import type { NextTalk, TalkedTalk } from "../lib/talkNext";
import type { Role } from "../lib/scoring";
import type { useLang } from "../lib/i18n";

type T = (en: string, fr: string) => string;
type Lang = ReturnType<typeof useLang>;
type Names = ReturnType<typeof namesFor>;
export type Who = { name: string; photo?: string; tone: "berry" | "honey" };

const firstOf = (n: string) => n.trim().split(/\s+/)[0] || n;
const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

// What the label says about where you landed on this one.
function landed(s: NextTalk, t: T): { text: string; tone: string } {
  switch (s.r.verdict) {
    case "Worth a chat":
      return { text: t("Saw it differently", "Vu différemment"), tone: "chat" };
    case "Close":
      return { text: t("Close", "Proche"), tone: "close" };
    case "Complementary":
      return { text: t("Different, and it works", "Différent, et ça se complète"), tone: "comp" };
    case "Agreed":
      return { text: t("Agreed", "D’accord"), tone: "agreed" };
    default:
      return { text: t("On your list", "Sur votre liste"), tone: "agreed" };
  }
}

// The one conversation to have now, as a card on Home (moved from Together,
// Nov 2026). Its state is asked, never reported: if your partner ticked it
// you see "Have you talked this through yet?", not who ticked first (design
// system, Never). Talk it through opens the guide.
export function TalkCard({
  s,
  code,
  role,
  lang,
  names,
  me,
  them,
  t,
  kind,
}: {
  s: NextTalk;
  code?: string;
  role: Role;
  lang: Lang;
  names: Names;
  me: Who;
  them: Who;
  t: T;
  /** The card's label, top left. */
  kind: string;
}) {
  const [guide, setGuide] = useState(false);
  const [notYet, setNotYet] = useState(false);
  const [cheer, setCheer] = useState(false);
  const q = localizeQuestion(s.q, lang, names);
  const say = (v: unknown, as = q) => (v == null ? "—" : cap(answerText(as, v as never)));
  const verdict = landed(s, t);
  const tick = async (note = "") => {
    if (!code) return;
    // Ticking a suggestion puts it on the list too, so it shows for both of you.
    if (s.suggested) await writeTalkPin(code, s.slug, s.q.id, role, true);
    if (s.talkedByThem) setCheer(true);
    await writeTalked(code, s.slug, s.q.id, role, true, note);
  };
  return (
    <div className="card hhero htalk">
      <span className="hkind">{kind}</span>
      <span className="hero-body htalk-body">
        <span className="htalk-top">
          <span className="hero-up">{deckName(s.slug, lang)}</span>
          <span className={`kbadge ${verdict.tone}`}>{verdict.text}</span>
        </span>
        <h2 className="hero-q">{q.q}</h2>
        {q.type !== "open" && q.type !== "rank" && (
          <span className="htalk-ans">
            <AnsRow who={me} text={say(s.r.me)} />
            <AnsRow who={them} text={say(s.r.th, asTheirs(q))} />
          </span>
        )}
        {cheer ? (
          <span className="hero-them" role="status">
            {t("You talked about it. That's the whole point.", "Vous en avez parlé. C'est tout l'objectif.")}
          </span>
        ) : s.talkedByMe ? (
          <span className="hero-them">
            {t(
              `You’ve ticked this. It moves to “Talked about together” once ${firstOf(them.name)} ticks it too.`,
              `Vous l’avez coché. Elle passera dans « Abordé ensemble » quand ${firstOf(them.name)} l’aura cochée aussi.`,
            )}
          </span>
        ) : s.talkedByThem && !notYet ? (
          <span className="htalk-ask">
            <span className="hero-sub">{t("Have you talked this through yet?", "En avez-vous déjà parlé ensemble ?")}</span>
            <span className="htalk-btns">
              <button className="btn pill" type="button" onClick={() => void tick()}>
                {t("Yes, we have", "Oui, c’est fait")}
              </button>
              <button className="btn out" type="button" onClick={() => setNotYet(true)}>
                {t("Not yet", "Pas encore")}
              </button>
            </span>
          </span>
        ) : (
          <button className="btn pill hero-go" type="button" onClick={() => setGuide(true)}>
            {t("Talk it through", "En parler")}
          </button>
        )}
      </span>
      {guide && (
        <TalkGuide
          q={q}
          topic={deckName(s.slug, lang)}
          partnerName={them.name}
          t={t}
          onDone={(note) => tick(note)}
          onClose={() => setGuide(false)}
        />
      )}
    </div>
  );
}

function AnsRow({ who, text }: { who: Who; text: string }) {
  return (
    <span className="ansrow">
      <Avatar name={who.name} photo={who.photo} tone={who.tone} size={30} ring={false} />
      <span>{text}</span>
    </span>
  );
}

// The conversations you've had: kept as a record that you did the thing, with
// when, and what you said you'd try.
export function Talked({ items, lang, names, t }: { items: TalkedTalk[]; lang: Lang; names: Names; t: T }) {
  const when = (ms: number) =>
    new Date(ms).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "short" });
  return (
    <ul className="tg-talked">
      {items.map((s) => (
        <li key={s.q.id} className="card">
          <span className="eyebrow">
            {deckName(s.slug, lang)}
            {s.at != null && <> · {when(s.at)}</>}
          </span>
          <div className="tg-talked-q">{localizeQuestion(s.q, lang, names).q}</div>
          {s.notes.map((n, i) => (
            <p key={i} className="helper tg-talked-note">
              <b>{t("One thing we’ll try", "Une chose à essayer")}:</b> {n}
            </p>
          ))}
        </li>
      ))}
    </ul>
  );
}
