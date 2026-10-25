import { useState } from "react";
import { revealedRows } from "../lib/results";
import { other, type Role } from "../lib/scoring";
import type { Session } from "../types";
import { ShareCard } from "./CoreScore";
import { TalkGuide } from "./TalkGuide";
import { catComplete } from "../lib/progress";
import { DECKS, ORDER } from "../lib/questions";
import { DeckIcon, IconShare } from "../components/icons";
import { Avatar, toneFor } from "../components/Avatar";
import { ScoreRings } from "../components/ScoreRings";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { namesFor } from "../lib/who";
import { answerText } from "../lib/discoveries";
import { shareTopic } from "../lib/shareTopic";
import { revealWords } from "../lib/reveal";
import { talkNext, type NextTalk, type TalkedTalk } from "../lib/talkNext";
import { writeTalked, writeTalkPin } from "../lib/session";
import { useT, useLang } from "../lib/i18n";

type T = (en: string, fr: string) => string;
const firstOf = (n: string) => n.trim().split(/\s+/)[0] || n;

// Together (design refresh, items 3 and 13), four sections: who; where you
// stand (one claret card with the two rings); what to talk about next, with
// the screen's only honey button; and your conversations as tiles.
export default function ResultsScreen({
  session,
  role,
  code,
  onOpen,
  onBrowse,
}: {
  session: Session;
  role: Role;
  code?: string;
  onOpen?: (slug: string) => void;
  /** "See all" and "Start another conversation": the Conversations tab. */
  onBrowse?: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const [sharing, setSharing] = useState(false);
  const [guide, setGuide] = useState<NextTalk | null>(null);
  const [pick, setPick] = useState(0);
  const [showList, setShowList] = useState(false);
  const [notYet, setNotYet] = useState<Set<string>>(() => new Set());
  const [cheer, setCheer] = useState(false);

  const myName = session.members?.[role]?.name ?? t("You", "Vous");
  const partnerName = session.members?.[other(role)]?.name ?? t("your partner", "votre partenaire");
  const names = namesFor(session.members, role, myName, partnerName);

  const { rows, overallPct, knownPct, basis, right, made } = revealedRows(session.decks, role);
  const ranked = [...rows].sort((a, b) => a.pct - b.pct);
  const closest = ranked.length >= 2 ? ranked[ranked.length - 1] : undefined;
  const { next, talked } = talkNext(session.decks, role);
  const featured = next[Math.min(pick, next.length - 1)];
  const onListBySlug = new Set(next.filter((n) => !n.suggested).map((n) => n.slug));
  const completeCount = ORDER.filter((s) => catComplete(s, session.decks?.[s], role)).length;

  // Day zero. Before the first reveal this tab was machinery with nothing in
  // it: two rings reading "—%", an empty agenda, an empty discoveries list.
  // A new couple's first impression of the thing the whole app is FOR should
  // be the promise, not an empty instrument panel.
  if (rows.length === 0) {
    const previews: [string, string, string, string][] = [
      [
        "star",
        "Two numbers",
        "How much you agree, and how well you actually know each other.",
        "À quel point vous êtes d’accord, et à quel point vous vous connaissez vraiment.",
      ],
      [
        "heart",
        "What surprised you",
        "Every answer one of you didn't see coming, kept in one place.",
        "Chaque réponse que l’un de vous n’avait pas vue venir, réunie en un seul endroit.",
      ],
      [
        "chat",
        "Your agenda",
        "The questions you both pinned as worth a proper conversation.",
        "Les questions que vous avez tous deux marquées comme méritant une vraie conversation.",
      ],
    ];
    const names: [string, string] = [
      `This is where ${myName.split(/\s+/)[0]} and ${partnerName.split(/\s+/)[0]} meet.`,
      `C’est ici que ${myName.split(/\s+/)[0]} et ${partnerName.split(/\s+/)[0]} se retrouvent.`,
    ];
    return (
      <section>
        <div className="eyebrow center" style={{ marginTop: 24 }}>
          {t("The two of you", "Vous deux")}
        </div>
        <h1 className="h1 center" style={{ margin: "8px 0 10px" }}>
          {t(...names)}
        </h1>
        <p className="sub center" style={{ margin: "0 18px 20px" }}>
          {t(
            "Nothing here yet: it fills in the moment you've both answered your first conversation.",
            "Rien ici pour l’instant, cela se remplit dès que vous avez tous deux répondu à votre première conversation.",
          )}
        </p>
        <div className="daycard">
          {previews.map(([glyph, h, en, fr]) => (
            <div className="dayrow" key={h}>
              <span className="dayglyph" aria-hidden="true">
                <DeckIcon icon={glyph} size={17} />
              </span>
              <span className="daytxt">
                <b>{t(h, h === "Two numbers" ? "Deux chiffres" : h === "Your agenda" ? "Votre ordre du jour" : "Ce qui vous a surpris")}</b>
                <i>{t(en, fr)}</i>
              </span>
            </div>
          ))}
        </div>
        {onOpen && (
          <button className="btn pill" type="button" onClick={() => onOpen(ORDER[0])}>
            {t("Start your first conversation →", "Commencer votre première conversation →")}
          </button>
        )}
      </section>
    );
  }

  const tick = async (s: NextTalk, note = "") => {
    if (!code) return;
    // Ticking a suggestion puts it on the list too, so it shows for both of you.
    if (s.suggested) await writeTalkPin(code, s.slug, s.q.id, role, true);
    if (s.talkedByThem) setCheer(true);
    await writeTalked(code, s.slug, s.q.id, role, true, note);
    if (s.talkedByThem) setTimeout(() => setCheer(false), 2600);
  };

  const words = overallPct != null ? revealWords(overallPct, null, `${code ?? ""}|together`) : null;
  const me = { name: myName, tone: toneFor(role) };
  const them = { name: partnerName, tone: toneFor(other(role)) };

  return (
    <section>
      <header className="tg-head">
        <span className="tg-avs">
          <Avatar name={me.name} tone={me.tone} size={42} />
          <Avatar name={them.name} tone={them.tone} size={42} />
        </span>
        <span className="tg-title">
          <span className="eyebrow">{t("Together", "Ensemble")}</span>
          <h1 className="h1">
            {firstOf(myName)} &amp; {firstOf(partnerName)}
          </h1>
        </span>
        <button
          className="roundbtn tg-share"
          type="button"
          onClick={() => setSharing(true)}
          aria-label={t("Share your card", "Partager votre carte")}
        >
          <IconShare size={22} />
        </button>
      </header>

      <div className="kcard-claret tg-score">
        <ScoreRings
          claret
          agree={overallPct}
          basis={basis}
          known={knownPct}
          right={right}
          made={made}
          label={t("Together", "Ensemble")}
          foot={
            <span className="tg-foot">
              {t(
                `${rows.length} conversation${rows.length === 1 ? "" : "s"}`,
                `${rows.length} conversation${rows.length === 1 ? "" : "s"}`,
              )}
              {talked.length > 0 &&
                t(` · ${talked.length} talked through`, ` · ${talked.length} abordée${talked.length === 1 ? "" : "s"}`)}
            </span>
          }
        >
          {words && <p className="tg-line">{words.line}</p>}
        </ScoreRings>
      </div>

      {featured && (
        <>
          <h2 className="tg-h">{t("Talk about next", "À aborder ensuite")}</h2>
          <NextCard
            s={featured}
            lang={lang}
            names={names}
            me={me}
            them={them}
            t={t}
            asked={!notYet.has(featured.q.id)}
            onGuide={() => setGuide(featured)}
            onYes={() => void tick(featured)}
            onNotYet={() => setNotYet(new Set([...notYet, featured.q.id]))}
            more={next.length - 1}
            showList={showList}
            onMore={() => setShowList(!showList)}
          />
          {showList && next.length > 1 && (
            <ul className="tg-more">
              {next.map((s, i) =>
                s === featured ? null : (
                  <li key={s.q.id}>
                    <button
                      type="button"
                      className="tg-more-q"
                      onClick={() => {
                        setPick(i);
                        setShowList(false);
                      }}
                    >
                      <span className="eyebrow">{deckName(s.slug, lang)}</span>
                      <span>{localizeQuestion(s.q, lang, names).q}</span>
                    </button>
                  </li>
                ),
              )}
            </ul>
          )}
        </>
      )}

      {cheer && (
        <div className="talkcheer" role="status">
          <span className="talkcheer-mark" aria-hidden="true">
            ✓
          </span>
          {t("You talked about it. That's the whole point.", "Vous en avez parlé. C'est tout l'objectif.")}
        </div>
      )}

      {talked.length > 0 && (
        <>
          <h2 className="tg-h">{t("Talked about together", "Abordé ensemble")}</h2>
          <Talked items={talked} lang={lang} names={names} t={t} />
        </>
      )}

      <div className="tg-hrow">
        <h2 className="tg-h">{t("Your conversations", "Vos conversations")}</h2>
        {onBrowse && (
          <button className="btn ghost tg-all" type="button" onClick={onBrowse}>
            {t("See all", "Tout voir")}
          </button>
        )}
      </div>
      <div className="tg-tiles">
        {rows.map(({ slug, pct, lvls, of }) => (
          <button key={slug} type="button" className="tg-tile" onClick={() => onOpen?.(slug)}>
            <span className="tg-tile-top">
              <span className="tg-icon" aria-hidden="true">
                <DeckIcon icon={DECKS[slug]?.icon ?? "star"} size={22} />
              </span>
              <span className="tg-pct">
                <b>{pct}%</b>
                <i>{t("Agree", "D’accord")}</i>
              </span>
            </span>
            <span className="tg-tile-name">{deckName(slug, lang)}</span>
            <span className="tg-tile-sub">
              {lvls === of
                ? t("Complete", "Terminé")
                : t(`${lvls} of ${of} parts`, `${lvls} partie${lvls === 1 ? "" : "s"} sur ${of}`)}
            </span>
            {closest?.slug === slug ? (
              <span className="kbadge chat">{t("Closest", "Le plus proche")}</span>
            ) : onListBySlug.has(slug) ? (
              <span className="kbadge agreed">{t("To talk about", "À aborder")}</span>
            ) : null}
          </button>
        ))}
        {onBrowse && completeCount < ORDER.length && (
          <button type="button" className="tg-tile tg-new" onClick={onBrowse}>
            <span className="tg-plus" aria-hidden="true">
              +
            </span>
            {t("Start another conversation", "Commencer une autre conversation")}
          </button>
        )}
      </div>

      {guide && (
        <TalkGuide
          q={localizeQuestion(guide.q, lang, names)}
          topic={deckName(guide.slug, lang)}
          partnerName={partnerName}
          t={t}
          onDone={(note) => tick(guide, note)}
          onClose={() => setGuide(null)}
        />
      )}

      {sharing && (
        <ShareCard
          agreed={{ pct: overallPct, done: basis, total: basis }}
          known={{ pct: knownPct, done: made, total: made, right, made }}
          myName={myName}
          partnerName={partnerName}
          conversations={{ done: completeCount, total: ORDER.length }}
          // A shared card never names a sensitive topic (lib/shareTopic.ts).
          closest={closest ? shareTopic(closest.slug, lang) : undefined}
          t={t}
          onClose={() => setSharing(false)}
        />
      )}
    </section>
  );
}

type Who = { name: string; tone: "berry" | "honey" };

// What the eyebrow says about where you landed on this one.
function landed(s: NextTalk, t: T): string {
  switch (s.r.verdict) {
    case "Worth a chat":
      return t("You saw this differently", "Vous l’avez vu différemment");
    case "Close":
      return t("Close, not quite the same", "Proche, pas tout à fait pareil");
    case "Complementary":
      return t("Different, and it works", "Différent, et ça se complète");
    case "Agreed":
      return t("You agreed", "Vous étiez d’accord");
    default:
      return t("On your list", "Sur votre liste");
  }
}

// The one conversation to have now. Its state is asked, never reported: if
// your partner ticked it you see "Have you talked this through yet?", not who
// ticked first (design system, Never).
function NextCard({
  s,
  lang,
  names,
  me,
  them,
  t,
  asked,
  onGuide,
  onYes,
  onNotYet,
  more,
  showList,
  onMore,
}: {
  s: NextTalk;
  lang: ReturnType<typeof useLang>;
  names: ReturnType<typeof namesFor>;
  me: Who;
  them: Who;
  t: T;
  asked: boolean;
  onGuide: () => void;
  onYes: () => void;
  onNotYet: () => void;
  more: number;
  showList: boolean;
  onMore: () => void;
}) {
  const q = localizeQuestion(s.q, lang, names);
  const say = (v: unknown) => (v == null ? "—" : cap(answerText(q, v as never)));
  return (
    <div className="card tg-next">
      <span className="kbadge agreed tg-next-tag">
        {deckName(s.slug, lang)} · {landed(s, t)}
      </span>
      <div className="qtext tg-next-q">{q.q}</div>
      {q.type !== "open" && q.type !== "rank" && (
        <>
          <Row who={me} text={say(s.r.me)} />
          <Row who={them} text={say(s.r.th)} />
        </>
      )}
      {s.talkedByMe ? (
        <div className="tg-ticked">
          <span className="tg-check" aria-hidden="true">
            ✓
          </span>
          {t(
            `You’ve ticked this. It moves to “Talked about together” once ${firstOf(them.name)} ticks it too.`,
            `Vous l’avez coché. Elle passera dans « Abordé ensemble » quand ${firstOf(them.name)} l’aura cochée aussi.`,
          )}
        </div>
      ) : s.talkedByThem && asked ? (
        <div className="tg-ask">
          <p>{t("Have you talked this through yet?", "En avez-vous déjà parlé ensemble ?")}</p>
          <div className="tg-ask-btns">
            <button className="btn pill" type="button" onClick={onYes}>
              {t("Yes, we have", "Oui, c’est fait")}
            </button>
            <button className="btn out" type="button" onClick={onNotYet}>
              {t("Not yet", "Pas encore")}
            </button>
          </div>
        </div>
      ) : (
        <button className="btn pill" type="button" onClick={onGuide}>
          {t("Talk it through", "En parler")}
        </button>
      )}
      {more > 0 && (
        <button className="btn ghost" type="button" onClick={onMore} aria-expanded={showList}>
          {t(`${more} more on your list`, `${more} de plus sur votre liste`)} {showList ? "▴" : "›"}
        </button>
      )}
    </div>
  );
}

const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

function Row({ who, text }: { who: Who; text: string }) {
  return (
    <div className="ansrow">
      <Avatar name={who.name} tone={who.tone} size={30} ring={false} />
      <span>{text}</span>
    </div>
  );
}

// The conversations you've had: kept as a record that you did the thing, with
// when, and what you said you'd try.
function Talked({
  items,
  lang,
  names,
  t,
}: {
  items: TalkedTalk[];
  lang: ReturnType<typeof useLang>;
  names: ReturnType<typeof namesFor>;
  t: T;
}) {
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
