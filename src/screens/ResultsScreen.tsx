import { useState } from "react";
import { revealedRows } from "../lib/results";
import { other, type Role } from "../lib/scoring";
import type { Session } from "../types";
import { ShareCard } from "./CoreScore";
import DecksScreen from "./DecksScreen";
import { catComplete } from "../lib/progress";
import { ORDER } from "../lib/questions";
import { DeckIcon, IconShare } from "../components/icons";
import { toneFor } from "../components/Avatar";
import { HowScores } from "../components/HowScores";
import { Talked } from "../components/TalkCard";
import { namesFor } from "../lib/who";
import { shareTopic } from "../lib/shareTopic";
import { revealWords } from "../lib/reveal";
import { talkNext } from "../lib/talkNext";
import { useT, useLang } from "../lib/i18n";

const firstOf = (n: string) => n.trim().split(/\s+/)[0] || n;

// Together (Dave, Nov 2026): just what you've built so far, as one big card
// (the two of you, the number front and centre, what you've done), then Past
// conversations to search and review, and Share. Talk about next moved to
// Home's cards; your conversations live on the Conversations tab.
export default function ResultsScreen({
  session,
  role,
  code,
  onOpen,
  onPart,
}: {
  session: Session;
  role: Role;
  code?: string;
  onOpen?: (slug: string) => void;
  /** "See all" and "Start another conversation": the Conversations tab. */
  onBrowse?: () => void;
  /** Open one part you've both done, to review it. */
  onPart?: (slug: string, level: number) => void;
}) {
  const t = useT();
  const lang = useLang();
  const [sharing, setSharing] = useState(false);
  const [how, setHow] = useState(false);
  const [past, setPast] = useState(rememberPast);

  const myName = session.members?.[role]?.name ?? t("You", "Vous");
  const partnerName = session.members?.[other(role)]?.name ?? t("your partner", "votre partenaire");
  const names = namesFor(session.members, role, myName, partnerName);

  const { rows, overallPct, knownPct, basis, right, made } = revealedRows(session.decks, role);
  const ranked = [...rows].sort((a, b) => a.pct - b.pct);
  const closest = ranked.length >= 2 ? ranked[ranked.length - 1] : undefined;
  const { talked } = talkNext(session.decks, role);
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

  const words = overallPct != null ? revealWords(overallPct, null, `${code ?? ""}|together`) : null;
  const partsOpened = rows.reduce((n, r) => n + r.lvls, 0);
  const myPhoto = session.members?.[role]?.photo;
  const partnerPhoto = session.members?.[other(role)]?.photo;
  const initial = (n: string) => (n.trim()[0] ?? "?").toUpperCase();

  // Past conversations: the ones you've both opened, to search and review,
  // with what you've talked about as the first circle.
  if (past) {
    return (
      <DecksScreen
        session={session}
        role={role}
        past
        onBack={() => {
          rememberPast = false;
          setPast(false);
        }}
        onPlay={(s) => onOpen?.(s)}
        onPart={(s, l) => {
          rememberPast = true;
          onPart?.(s, l);
        }}
        forYou={talked.length ? <Talked items={talked} lang={lang} names={names} t={t} /> : undefined}
        firstLabel={t("Talked about", "Abordé")}
        firstIcon={<DeckIcon icon="chat" size={28} />}
      />
    );
  }

  return (
    <section>
      <h1 className="pagetitle">{t("Together", "Ensemble")}</h1>

      {/* What you've built so far, as one big card (Dave, Nov 2026): the two
          of you across the top, the number front and centre, then where to
          go from here. */}
      <div className="revcard tgcard">
        {knownPct != null && (
          <span className="revcard-pill">
            <span aria-hidden="true">&#9825;</span> {t(`${knownPct}% known`, `${knownPct} % connus`)}
          </span>
        )}
        <span className="revtop" aria-hidden="true">
          <span className={`revdisc ${toneFor(role)}`}>{myPhoto ? <img src={myPhoto} alt="" /> : initial(myName)}</span>
          <span className={`revdisc ${toneFor(other(role))}`}>{partnerPhoto ? <img src={partnerPhoto} alt="" /> : initial(partnerName)}</span>
        </span>
        <span className="revcard-body">
          <span className="bignum-lb">
            {t(`You and ${firstOf(partnerName)} agree on`, `${firstOf(partnerName)} et vous êtes d’accord sur`)}
          </span>
          <span className="bignum">
            {overallPct ?? "–"}
            <span className="bignum-pc">%</span>
          </span>
          <span className="revcard-basis">
            {t(`Based on ${basis} question${basis === 1 ? "" : "s"} you both answered`, `Sur ${basis} question${basis === 1 ? "" : "s"} auxquelles vous avez tous deux répondu`)}
          </span>
          <span className="tgstats">
            <span><b>{rows.length}</b> {t(rows.length === 1 ? "conversation" : "conversations", rows.length === 1 ? "conversation" : "conversations")}</span>
            <span><b>{partsOpened}</b> {t(partsOpened === 1 ? "part opened" : "parts opened", partsOpened === 1 ? "partie ouverte" : "parties ouvertes")}</span>
            <span><b>{talked.length}</b> {t("talked about", "abordées")}</span>
          </span>
        </span>
        {words && <span className="revcard-line">{words.line}</span>}
        <span className="revcard-acts">
          <button
            className="btn pill"
            type="button"
            onClick={() => {
              rememberPast = true;
              setPast(true);
            }}
          >
            {t("Past conversations →", "Conversations passées →")}
          </button>
          <button className="pcircle revshare" type="button" onClick={() => setSharing(true)} aria-label={t("Share your card", "Partager votre carte")}>
            <IconShare size={20} />
          </button>
        </span>
      </div>
      <button className="linkbtn hero-alt tg-how" type="button" onClick={() => setHow(true)}>
        {t("How scores work", "Comment fonctionnent les scores")}
      </button>

      {how && <HowScores agree={{ pct: overallPct, basis }} known={{ pct: knownPct, right, made }} onClose={() => setHow(false)} />}

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

// Coming back from reviewing a past part returns to the list, not the score.
let rememberPast = false;
