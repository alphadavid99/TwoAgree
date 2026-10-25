import { useEffect, useRef, useState } from "react";
import { DECKS } from "../lib/questions";
import { nLevels, lvlQs, partName } from "../lib/leveling";
import { curLevel, doneInLevel, catComplete, levelDone } from "../lib/progress";
import { startedLevel } from "../lib/privacy";
import { inviteLink } from "../lib/invite";
import { revealedRows, answersWaiting } from "../lib/results";
import { other, type DeckData, type Role } from "../lib/scoring";
import { createInvite } from "../lib/functions";
import { prettyError } from "../lib/errors";
import type { Session } from "../types";
import { pathReady, currentIndex, orderedSteps, lampLit } from "../lib/path";
import { PATH_STEPS } from "../data/path.generated";
import { Avatar, toneFor } from "../components/Avatar";
import { PathScene } from "../components/PathScene";
import { PctRing } from "../components/Ring";
import { DeckIcon } from "../components/icons";
import { deckName } from "../lib/questions.fr";
import { track } from "../lib/observability";
import { useT, useLang } from "../lib/i18n";

export default function HomeScreen({
  code,
  session,
  role,
  slug,
  onPlay,
  onBrowse,
  onTogether,
  pending = [],
  onOpenReveal,
  onPath,
}: {
  code: string;
  session: Session;
  role: Role;
  slug: string;
  onPlay: (slug: string) => void;
  onBrowse: () => void;
  /** The scores card opens Together. */
  onTogether: () => void;
  // Reveals that are ready and this person hasn't opened yet, newest last.
  pending?: { slug: string; level: number }[];
  onOpenReveal?: (slug: string, level: number) => void;
  // Undefined when the Path is behind its flag — Home simply omits the card.
  onPath?: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const deck: DeckData | undefined = session.decks?.[slug];
  // Home speaks in first names — full names elongate the chip and greeting.
  const firstName = (n: string) => n.trim().split(/\s+/)[0] || n;
  const myName = firstName(session.members?.[role]?.name ?? t("You", "Vous"));
  const partner = session.members?.[other(role)];
  const partnerName = firstName(
    partner?.name ?? t("your partner", "votre partenaire"),
  );
  const joined = !!partner;

  // Celebrate the moment the partner arrives while we're watching — their
  // avatar slides in and a short note settles. No replay on later visits.
  const prevJoined = useRef(joined);
  const [justJoined, setJustJoined] = useState(false);
  useEffect(() => {
    if (joined && !prevJoined.current) {
      setJustJoined(true);
      track("partner joined");
    }
    prevJoined.current = joined;
  }, [joined]);

  const h = new Date().getHours();
  const greeting =
    h < 12
      ? t("Good morning,", "Bonjour,")
      : h < 18
        ? t("Good afternoon,", "Bon après-midi,")
        : t("Good evening,", "Bonsoir,");

  const L = nLevels(slug);
  const lvl = curLevel(slug, deck, role);
  const lvlTotal = lvlQs(slug, lvl).length;
  const mine = doneInLevel(slug, lvl, deck, role);
  // Their answers are private until you've both finished, so partner status
  // comes from the shared started/done flags only.
  const theyStarted = startedLevel(deck, lvl, other(role));
  const theyFinished = levelDone(deck, lvl, other(role));
  const allDone = catComplete(slug, deck, role);

  const cta = allDone
    ? t("See where you agree →", "Voir où vous êtes d’accord →")
    : L > 1
      ? mine > 0
        ? t(`Continue Part ${lvl + 1} →`, `Continuer la partie ${lvl + 1} →`)
        : t(`Start Part ${lvl + 1} →`, `Commencer la partie ${lvl + 1} →`)
      : mine > 0
        ? t("Continue →", "Continuer →")
        : t("Start answering →", "Commencer à répondre →");

  // The scores card shares Together's maths, so the numbers agree.
  const { rows, overallPct, knownPct, basis, right, made } = revealedRows(session.decks, role);
  // Solo-first: answers you've banked that your partner hasn't matched yet.
  const waiting = answersWaiting(session.decks, role);

  // Where the couple stands on the Path, for the hero card below.
  const pathCur = currentIndex(session);
  const pathStep = PATH_STEPS[pathCur];
  const atLookout = pathCur >= PATH_STEPS.length - 1;
  const lamps = orderedSteps(session).filter((s) => lampLit(session, s.index)).length;

  const [inviteMsg, setInviteMsg] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  // Copy feedback: the chip itself confirms the copy (micro-interaction —
  // feedback the static chip can't give). Share-sheet devices skip it.
  const [copied, setCopied] = useState(false);

  const share = () => {
    const txt = t(
      `Come do this with me on TwoAgree, we each answer the same questions, then see where the two of us land. Our code is ${code}`,
      `Fais-le avec moi sur TwoAgree, on répond chacun aux mêmes questions, puis on voit où on se retrouve tous les deux. Notre code est ${code}`,
    );
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else if (navigator.clipboard) {
      // Copy the whole invitation, not the bare code: a desktop host used to
      // paste "ABCD" to their partner with no context, while the chip still
      // said "Copied ✓" as though the warm message had gone.
      navigator.clipboard.writeText(txt).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      });
    }
  };

  const sendInviteLink = async () => {
    setInviteBusy(true);
    setInviteMsg("");
    try {
      const res = await createInvite({ code });
      const link = inviteLink(window.location.origin, { token: res.data.token }, myName);
      const txt = t(
        `Come do this with me on TwoAgree, we each answer the same questions, then see where the two of us land: ${link}`,
        `Fais-le avec moi sur TwoAgree, on répond chacun aux mêmes questions, puis on voit où on se retrouve tous les deux : ${link}`,
      );
      // Only claim it went if it actually went. navigator.share rejects when
      // the user cancels the sheet, and that rejection was swallowed while the
      // success line rendered regardless.
      const viaSheet = !!navigator.share;
      let sent = false;
      if (viaSheet) {
        sent = await navigator.share({ text: txt }).then(
          () => true,
          () => false,
        );
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(txt);
        sent = true;
      }
      if (sent) {
        setInviteMsg(
          viaSheet
            ? t("Invitation sent.", "Invitation envoyée.")
            : t("Invitation copied: paste it to them.", "Invitation copiée, collez-la-leur."),
        );
      }
    } catch (e) {
      setInviteMsg(prettyError(e));
    } finally {
      setInviteBusy(false);
    }
  };

  // The Path card's scene: the step you're on, its landmark, the lamps lit.
  const sceneKey = atLookout ? "lookout" : (pathStep?.key ?? "trailhead");

  return (
    <section>
      <div className="homehdr">
        <span className={`avchip${justJoined ? " joinnow" : ""}`}>
          <span className="avchip-stack">
            <Avatar name={myName} tone={toneFor(role)} size={34} />
            {joined ? (
              <span className="joinpop">
                <Avatar name={partnerName} tone={toneFor(other(role))} size={34} />
              </span>
            ) : (
              <span className="avatar-disc avatar-wait" style={{ width: 34, height: 34, fontSize: 14 }}>
                ?
              </span>
            )}
          </span>
          <i>
            {myName} &amp; {joined ? partnerName : "…"}
          </i>
        </span>
      </div>

      <h1 className="greet serif">
        {greeting} {myName}
      </h1>
      {justJoined && (
        <div className="joinnote" style={{ margin: "6px 2px 0" }}>
          {partnerName} {t("joined ✓", "vous a rejoint ✓")}
        </div>
      )}

      {/* Between the two of you: soft, light, two small rings kept apart. The
          encouragement line stays on the reveal and Together. */}
      {rows.length > 0 && (
        <button className="card hscores" type="button" onClick={onTogether} aria-label={t("Between the two of you: open Together", "Entre vous deux : ouvrir Ensemble")}>
          <span className="hscores-top">
            <span className="eyebrow">{t("Between the two of you", "Entre vous deux")}</span>
            <span aria-hidden="true">&#8250;</span>
          </span>
          <span className="hscores-rings">
            <SoftRing pct={overallPct} colour="var(--app-honey)" name={t("Agree", "D’accord")} count={t(`based on ${basis} question${basis === 1 ? "" : "s"}`, `sur ${basis} question${basis === 1 ? "" : "s"}`)} />
            <SoftRing
              pct={knownPct}
              colour="var(--app-rose-soft)"
              name={t("Known", "Connus")}
              count={made ? t(`${right} of ${made} guesses`, `${right} intuitions sur ${made}`) : t("no guesses yet", "pas encore d’intuitions")}
            />
          </span>
        </button>
      )}

      {/* The reveal that's waiting: the one claret moment, before your next
          step. */}
      {pending.length > 0 && onOpenReveal && (
        <button
          className="readycard"
          type="button"
          onClick={() => onOpenReveal(pending[0].slug, pending[0].level)}
        >
          <span className="readycard-top">
            <span className="readyseal" aria-hidden="true">&#10022;</span>
            <span>
              <span className="readycard-eyebrow">
                {t("READY TO OPEN", "PRÊT À OUVRIR")}
              </span>
              <span className="readycard-nm">
                {deckName(pending[0].slug, lang)}
                {nLevels(pending[0].slug) > 1 && ` · ${partName(pending[0].slug, pending[0].level)}`}
              </span>
            </span>
          </span>
          <span className="readycard-sub">
            {t("You’ve both finished. Open it whenever suits you both.", "Vous avez tous deux terminé. Ouvrez-la quand cela vous convient.")}
          </span>
          <span className="readycard-cta">
            {t("Open the reveal →", "Ouvrir la révélation →")}
          </span>
        </button>
      )}

      {/* Your next step: the part you're in, one honey button. */}
      <div className="card hnext">
        <div className="hnext-top">
          <span className="tg-icon" aria-hidden="true">
            <DeckIcon icon={DECKS[slug]?.icon ?? "star"} size={24} />
          </span>
          <span>
            <span className="hnext-nm">{deckName(slug, lang)}</span>
            <span className="hnext-sub">
              {allDone
                ? t("All parts revealed", "Toutes les parties révélées")
                : L > 1
                  ? t(`Part ${lvl + 1} of ${L} · ${partName(slug, lvl)}`, `Partie ${lvl + 1} sur ${L} · ${partName(slug, lvl)}`)
                  : partName(slug, lvl)}
            </span>
          </span>
        </div>
        {!allDone && (
          <>
            <div className="qprog featprog" aria-hidden="true">
              <i style={{ width: `${lvlTotal ? Math.round((mine / lvlTotal) * 100) : 0}%` }} />
            </div>
            <div className="capline">
              <b>{t(`${mine} of ${lvlTotal}`, `${mine} sur ${lvlTotal}`)}</b> {t("answered", "répondues")}
              {joined && (
                <>
                  {" · "}
                  {!theyStarted
                    ? t(`${partnerName} hasn’t started this part yet`, `${partnerName} n’a pas encore commencé cette partie`)
                    : theyFinished
                      ? t(`${partnerName} has finished this part`, `${partnerName} a terminé cette partie`)
                      : t(`${partnerName} has started this part`, `${partnerName} a commencé cette partie`)}
                </>
              )}
            </div>
          </>
        )}
        <button className="btn pill" type="button" onClick={() => onPlay(slug)}>
          {cta}
        </button>
        <button className="btn ghost" type="button" onClick={onBrowse}>
          {t("Choose another conversation", "Choisir une autre conversation")}
        </button>
      </div>

      {/* Before your partner joins: one card, the code and one link. */}
      {!joined && (
        <div className="card hinvite">
          <h2 className="ktitle">{t("Invite your partner", "Invitez votre partenaire")}</h2>
          <p className="helper">
            {t("Share your code so they can join. Your answers stay private until you've both finished a part.", "Partagez votre code pour qu’il ou elle vous rejoigne. Vos réponses restent privées jusqu’à ce que vous ayez tous deux terminé une partie.")}
          </p>
          <button className={`codechip${copied ? " copied" : ""}`} type="button" onClick={share} aria-label={t(`Copy the code ${code}`, `Copier le code ${code}`)}>
            {copied ? t("Copied ✓", "Copié ✓") : code}
          </button>
          <button className="btn out" type="button" onClick={sendInviteLink} disabled={inviteBusy}>
            {inviteBusy ? t("Creating link…", "Création du lien…") : t("Send an invite link", "Envoyer un lien d’invitation")}
          </button>
          {inviteMsg && <p className="helper" role="status">{inviteMsg}</p>}
          {waiting > 0 && (
            <p className="helper">
              {t(
                `${waiting} ${waiting === 1 ? "answer" : "answers"} saved, waiting for your partner`,
                `${waiting} réponse${waiting === 1 ? "" : "s"} enregistrée${waiting === 1 ? "" : "s"}, en attente de votre partenaire`,
              )}
            </p>
          )}
        </div>
      )}

      {/* The Path: its scene, the road leading to this step's landmark. Its
          button is white: Continue above is the screen's one honey action. */}
      {onPath && pathReady(session) && (
        <div className="hpath">
          <PathScene
            stepKey={sceneKey}
            lit={lamps}
            className="hpath-scene"
            label={atLookout ? t("The Lookout", "Le Belvédère") : t(`Step ${pathCur + 1}, ${pathStep?.name ?? ""}`, `Étape ${pathCur + 1}, ${pathStep?.name ?? ""}`)}
          />
          <span className="hpath-txt">
            <span className="eyebrow">{t("The Path", "Le Chemin")}</span>
            <span className="hpath-nm">
              {atLookout
                ? t("The Lookout", "Le Belvédère")
                : t(`Step ${pathCur + 1} · ${pathStep?.name ?? ""}`, `Étape ${pathCur + 1} · ${pathStep?.name ?? ""}`)}
            </span>
          </span>
          <button className="btn out hpath-go" type="button" onClick={onPath}>
            {t("Continue the Path", "Continuer le Chemin")}
          </button>
        </div>
      )}
    </section>
  );
}

function SoftRing({ pct, colour, name, count }: { pct: number | null; colour: string; name: string; count: string }) {
  return (
    <span className="softring">
      {pct == null ? (
        <span className="softring-none" aria-hidden="true">—</span>
      ) : (
        <PctRing pct={pct} size={72} sw={7} color={colour} label="" ink="var(--ta-ink)" />
      )}
      <span className="softring-txt">
        <b>{name}</b>
        <span>{count}</span>
      </span>
    </span>
  );
}
