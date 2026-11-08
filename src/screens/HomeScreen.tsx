import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { nLevels, lvlQs, partName } from "../lib/leveling";
import { curLevel, doneInLevel, catComplete, levelDone } from "../lib/progress";
import { startedLevel } from "../lib/privacy";
import { inviteLink } from "../lib/invite";
import { revealedRows, answersWaiting } from "../lib/results";
import { DECKS, ORDER } from "../lib/questions";
import { other, type DeckData, type Role } from "../lib/scoring";
import { createInvite } from "../lib/functions";
import { prettyError } from "../lib/errors";
import type { Session } from "../types";
import { pathReady, currentIndex, orderedSteps, lampLit } from "../lib/path";
import { PATH_STEPS } from "../data/path.generated";
import { PathScene } from "../components/PathScene";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { talkNext } from "../lib/talkNext";
import { namesFor } from "../lib/who";
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

  // The scores card shares Together's maths, so the numbers agree.
  const { rows, overallPct, knownPct, basis, right, made } = revealedRows(session.decks, role);
  // The cards on Home: the conversation you're in on top, then the others
  // you've started, then the rest, so a swipe brings up what's next.
  const stack = heroStack(slug, session.decks, role);
  const talk = talkNext(session.decks, role).next[0];
  const names = namesFor(session.members, role, myName, partnerName);
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
      <h1 className="pagetitle">
        {greeting} {myName}
      </h1>
      {justJoined && (
        <div className="joinnote" style={{ margin: "6px 2px 0" }}>
          {partnerName} {t("joined ✓", "vous a rejoint ✓")}
        </div>
      )}

      {/* Your next step, as one big card with the others stacked behind it
          (Dave, Nov 2026, after Dateasy): swipe for another conversation. */}
      <HeroStack
        slugs={stack}
        render={(s) => (
          <HeroCard
            slug={s}
            deck={session.decks?.[s]}
            role={role}
            joined={joined}
            partnerName={partnerName}
            pct={rows.find((r) => r.slug === s)?.pct ?? null}
            onPlay={onPlay}
            onBrowse={onBrowse}
          />
        )}
      />

      {/* The reveal that's waiting, before anything else below. */}
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
                {t("Ready to open", "Prêt à ouvrir")}
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

      {/* Label over value: where you stand, and the next thing to talk about.
          Both open Together, where the full scores and the list live. */}
      {rows.length > 0 && (
        <button className="card irow" type="button" onClick={onTogether} aria-label={t("Between the two of you: open Together", "Entre vous deux : ouvrir Ensemble")}>
          <span className="irow-txt">
            <span className="irow-lb">{t("Between the two of you", "Entre vous deux")}</span>
            <span className="irow-val">
              {[
                overallPct == null ? t("No scores yet", "Pas encore de scores") : t(`${overallPct}% agree`, `${overallPct} % d’accord`),
                knownPct != null ? t(`${knownPct}% known`, `${knownPct} % connus`) : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
            <span className="irow-meta">
              {t(`${basis} question${basis === 1 ? "" : "s"}`, `${basis} question${basis === 1 ? "" : "s"}`)}
              {made ? t(` · ${right} of ${made} guesses right`, ` · ${right} intuitions justes sur ${made}`) : ""}
            </span>
          </span>
          <span className="irow-go" aria-hidden="true">&#8250;</span>
        </button>
      )}
      {talk && (
        <button className="card irow" type="button" onClick={onTogether}>
          <span className="irow-txt">
            <span className="irow-lb">{t("Talk about next", "À aborder ensuite")}</span>
            <span className="irow-val">{localizeQuestion(talk.q, lang, names).q}</span>
          </span>
          <span className="irow-go" aria-hidden="true">&#8250;</span>
        </button>
      )}

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

// The conversation you're in, then the others you've started and not
// finished, then the ones not yet begun; five at most.
function heroStack(slug: string, decks: Session["decks"], role: Role): string[] {
  const begun = (s: string) => !!decks?.[s]?.answers && Object.values(decks[s]?.answers ?? {}).some((a) => a?.[role] != null);
  const open = ORDER.filter((s) => s !== slug && DECKS[s] && !catComplete(s, decks?.[s], role));
  return [slug, ...open.filter(begun), ...open.filter((s) => !begun(s))].slice(0, 5);
}

// A real deck (Dave, Nov 2026). The card on top; the next one waiting
// underneath, peeking out at the foot; the one you've already swiped past
// waiting just off the left edge. Swipe left and the top card goes off to
// the left, where it waits; swipe right and that card comes back in from the
// left, over the top, and the one it covers settles underneath. Every card
// is the same element wherever it goes, so it always returns from where it
// left, and nothing is rebuilt or faded. A tap still presses its buttons.
function HeroStack({ slugs, render }: { slugs: string[]; render: (slug: string) => ReactNode }) {
  const t = useT();
  const n = slugs.length;
  const [i, setI] = useState(0);
  const [dx, setDx] = useState(0);
  const [held, setHeld] = useState(false);
  const from = useRef<{ x: number; y: number; t: number } | null>(null);
  const dragging = useRef(false);
  const at = (k: number) => slugs[(k + n) % n];

  const down = (e: RPointerEvent<HTMLDivElement>) => {
    if (n < 2) return;
    from.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    dragging.current = false;
  };
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const f = from.current;
    if (!f) return;
    const x = e.clientX - f.x;
    if (!dragging.current) {
      if (Math.abs(x) < 8 || Math.abs(x) < Math.abs(e.clientY - f.y)) return;
      dragging.current = true;
      setHeld(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    setDx(x);
  };
  const up = () => {
    const f = from.current;
    from.current = null;
    setHeld(false);
    if (!f || !dragging.current) return;
    const quick = performance.now() - f.t < 260 && Math.abs(dx) > 36;
    if (Math.abs(dx) > 80 || quick) setI((v) => (v + (dx < 0 ? 1 : -1) + n) % n);
    setDx(0);
  };

  // Where each card sits, from how far you've pulled (p, 0 to 1).
  const p = Math.min(1, Math.abs(dx) / 260);
  const place = (role: "top" | "under" | "left"): CSSProperties | undefined => {
    if (role === "top") {
      if (dx < 0) return { transform: `translateX(${dx}px) rotate(${dx / 28}deg)` };
      if (dx > 0) return { transform: `scale(${1 - 0.06 * p})` };
      return undefined;
    }
    if (role === "under") {
      if (dx < 0) return { transform: `translateY(${11 * (1 - p)}px) scale(${0.94 + 0.06 * p})` };
      return undefined;
    }
    if (dx > 0) return { transform: `translateX(calc(-100% - 140px + ${dx * 1.45}px)) rotate(${Math.min(0, -10 + dx / 22)}deg)` };
    return undefined;
  };

  return (
    <div className="hstack" aria-roledescription={t("cards", "cartes")}>
      {n > 2 && <span className="hstack-back b2" aria-hidden="true" />}
      {slugs.map((s) => {
        const role: "top" | "under" | "left" | null =
          s === at(i) ? "top" : n > 2 && s === at(i - 1) ? "left" : n > 1 && s === at(i + 1) ? "under" : n === 2 && s === at(i - 1) ? "under" : null;
        if (!role) return null;
        const top = role === "top";
        return (
          <div
            key={s}
            className={`hs-card ${role}${held ? " held" : ""}`}
            style={place(role)}
            aria-hidden={top ? undefined : true}
            inert={top ? undefined : true}
            onPointerDown={top ? down : undefined}
            onPointerMove={top ? move : undefined}
            onPointerUp={top ? up : undefined}
            onPointerCancel={top ? up : undefined}
            onClickCapture={(e) => {
              if (dragging.current) {
                e.stopPropagation();
                e.preventDefault();
                dragging.current = false;
              }
            }}
          >
            {render(s)}
          </div>
        );
      })}
      {n > 1 && (
        <span className="hstack-dots" aria-hidden="true">
          {slugs.map((s, k) => (
            <i key={s} className={k === i ? "on" : ""} />
          ))}
        </span>
      )}
    </div>
  );
}

function HeroCard({
  slug,
  deck,
  role,
  joined,
  partnerName,
  pct,
  onPlay,
  onBrowse,
}: {
  slug: string;
  deck: DeckData | undefined;
  role: Role;
  joined: boolean;
  partnerName: string;
  pct: number | null;
  onPlay: (slug: string) => void;
  onBrowse: () => void;
}) {
  const t = useT();
  const lang = useLang();
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
  return (
    <div className="card hhero">
      {pct != null && (
        <span className="hero-pill">
          <span aria-hidden="true">&#9825;</span> {t(`${pct}% agree`, `${pct} % d’accord`)}
        </span>
      )}
      <span className="hero-body">
        <span className="hero-up">
          {allDone
            ? t("All parts revealed", "Toutes les parties révélées")
            : L > 1
              ? t(`Up next · Part ${lvl + 1} of ${L}`, `À suivre · Partie ${lvl + 1} sur ${L}`)
              : t("Up next", "À suivre")}
        </span>
        <h2 className="hero-nm">{deckName(slug, lang)}</h2>
        {!allDone && (
          <span className="hero-sub">
            {L > 1 ? `${partName(slug, lvl)} · ` : ""}
            {mine > 0
              ? t(`${mine} of ${lvlTotal} answered`, `${mine} sur ${lvlTotal} répondues`)
              : t(`${lvlTotal} questions`, `${lvlTotal} questions`)}
          </span>
        )}
        {joined && !allDone && (
          <span className="hero-them">
            {!theyStarted
              ? t(`${partnerName} hasn’t started this part yet`, `${partnerName} n’a pas encore commencé cette partie`)
              : theyFinished
                ? t(`${partnerName} has finished this part`, `${partnerName} a terminé cette partie`)
                : t(`${partnerName} has started this part`, `${partnerName} a commencé cette partie`)}
          </span>
        )}
        <button className="btn pill hero-go" type="button" onClick={() => onPlay(slug)}>
          {cta}
        </button>
        <button className="linkbtn hero-alt" type="button" onClick={onBrowse}>
          {t("Choose another conversation", "Choisir une autre conversation")}
        </button>
      </span>
    </div>
  );
}
