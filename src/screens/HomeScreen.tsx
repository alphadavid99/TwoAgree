import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { nLevels, lvlQs, partName } from "../lib/leveling";
import { curLevel, doneInLevel, catComplete, levelDone, levelComplete } from "../lib/progress";
import { startedLevel } from "../lib/privacy";
import { inviteLink } from "../lib/invite";
import { revealedRows, answersWaiting } from "../lib/results";
import { DECKS, ORDER } from "../lib/questions";
import { other, type DeckData, type Role } from "../lib/scoring";
import { createInvite } from "../lib/functions";
import { prettyError } from "../lib/errors";
import type { Session } from "../types";
import { SUBJECTS } from "../lib/subjects";
import { toneFor } from "../components/Avatar";
import { TalkCard } from "../components/TalkCard";
import { PartsRing } from "../components/PartsRing";
import { DeckIcon } from "../components/icons";
import { deckName } from "../lib/questions.fr";
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
  pending = [],
  onOpenReveal,
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

  // What you've opened together: only to choose what to suggest next. No
  // score is shown on Home.
  const { rows } = revealedRows(session.decks, role);
  const talk = talkNext(session.decks, role).next[0];
  const names = namesFor(session.members, role, myName, partnerName);
  // Solo-first: answers you've banked that your partner hasn't matched yet.
  const waiting = answersWaiting(session.decks, role);
  const myPhoto = session.members?.[role]?.photo;
  const partnerPhoto = partner?.photo;

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


  // The cards, in order. Each appears only when it applies.
  const cards: { key: string; node: ReactNode }[] = [];
  const shown = new Set<string>();
  const card = (key: string, node: ReactNode, s?: string) => {
    cards.push({ key, node });
    if (s) shown.add(s);
  };
  // Before your partner joins: inviting them is the one thing that matters.
  if (!joined) {
    card(
      "invite",
      <div className="card hhero">
        <span className="hkind">{t("Invite your partner", "Invitez votre partenaire")}</span>
        <span className="hero-body">
          <h2 className="hero-nm hero-nm-sm">{t("Do this together", "Faites-le à deux")}</h2>
          <span className="hero-sub">
            {t("Share your code so they can join. Your answers stay private until you've both finished a part.", "Partagez votre code pour qu’il ou elle vous rejoigne. Vos réponses restent privées jusqu’à ce que vous ayez tous deux terminé une partie.")}
          </span>
          <button className={`codechip${copied ? " copied" : ""}`} type="button" onClick={share} aria-label={t(`Copy the code ${code}`, `Copier le code ${code}`)}>
            {copied ? t("Copied ✓", "Copié ✓") : code}
          </button>
          <button className="btn pill hero-go" type="button" onClick={sendInviteLink} disabled={inviteBusy}>
            {inviteBusy ? t("Creating link…", "Création du lien…") : t("Send an invite link", "Envoyer un lien d’invitation")}
          </button>
          {inviteMsg ? (
            <span className="hero-them" role="status">{inviteMsg}</span>
          ) : waiting > 0 ? (
            <span className="hero-them">
              {t(
                `${waiting} ${waiting === 1 ? "answer" : "answers"} saved, waiting for your partner`,
                `${waiting} réponse${waiting === 1 ? "" : "s"} enregistrée${waiting === 1 ? "" : "s"}, en attente de votre partenaire`,
              )}
            </span>
          ) : null}
        </span>
      </div>,
    );
  }
  // A reveal waiting for you both.
  const ready = pending[0];
  if (ready && onOpenReveal) {
    card(
      `ready:${ready.slug}:${ready.level}`,
      <div className="card hhero hready">
        <span className="hkind warm">{t("Ready to open", "Prêt à ouvrir")}</span>
        <span className="hero-body">
          <span className="hready-pair" aria-hidden="true">
            <span className={`revdisc ${toneFor(role)}`}>{myPhoto ? <img src={myPhoto} alt="" /> : firstName(myName)[0]}</span>
            <span className={`revdisc ${toneFor(other(role))}`}>{partnerPhoto ? <img src={partnerPhoto} alt="" /> : firstName(partnerName)[0]}</span>
          </span>
          <h2 className="hero-nm">{deckName(ready.slug, lang)}</h2>
          <span className="hero-sub">
            {nLevels(ready.slug) > 1 ? `${partName(ready.slug, ready.level)} · ` : ""}
            {t("you’ve both finished", "vous avez tous deux terminé")}
          </span>
          <button className="btn pill hero-go" type="button" onClick={() => onOpenReveal(ready.slug, ready.level)}>
            {t("Open the reveal →", "Ouvrir la révélation →")}
          </button>
        </span>
      </div>,
    );
  }
  // Your partner finished a part you haven't.
  const turn = joined ? yourTurn(slug, session.decks, role) : null;
  if (turn) {
    card(
      `turn:${turn.slug}`,
      <div className="card hhero">
        <span className="hkind warm">{t("Your turn", "À vous")}</span>
        <span className="hero-body">
          <span className="hready-pair one" aria-hidden="true">
            <span className={`revdisc ${toneFor(other(role))}`}>{partnerPhoto ? <img src={partnerPhoto} alt="" /> : firstName(partnerName)[0]}</span>
          </span>
          <h2 className="hero-nm hero-nm-sm">
            {t(`${partnerName} finished ${deckName(turn.slug, lang)}`, `${partnerName} a terminé ${deckName(turn.slug, lang)}`)}
          </h2>
          <span className="hero-sub">
            {nLevels(turn.slug) > 1 ? `${partName(turn.slug, turn.level)} · ` : ""}
            {t("answer it too and see where you landed", "répondez aussi et voyez où vous en êtes")}
          </span>
          <button className="btn pill hero-go" type="button" onClick={() => onPlay(turn.slug)}>
            {nLevels(turn.slug) > 1 ? t(`Answer Part ${turn.level + 1} →`, `Répondre à la partie ${turn.level + 1} →`) : t("Answer it →", "Répondre →")}
          </button>
        </span>
      </div>,
      turn.slug,
    );
  }
  // The conversation you're in.
  if (!shown.has(slug)) {
    card(
      `cont:${slug}`,
      <HeroCard kind={t("Continue", "Continuer")} slug={slug} deck={session.decks?.[slug]} role={role} joined={joined} partnerName={partnerName} onPlay={onPlay} onBrowse={onBrowse} />,
      slug,
    );
  }
  // Somewhere you saw it differently, ready to talk about: the guide, or
  // "Have you talked this through yet?" (moved here from Together).
  if (talk) {
    card(
      `talk:${talk.q.id}`,
      <TalkCard
        s={talk}
        code={code}
        role={role}
        lang={lang}
        names={names}
        me={{ name: myName, photo: myPhoto, tone: toneFor(role) }}
        them={{ name: partnerName, photo: partnerPhoto, tone: toneFor(other(role)) }}
        t={t}
        kind={t("Talk about this", "À aborder")}
      />,
    );
  }
  // What to do next, picked from what you've just done.
  const rec = recommend(rows, session.decks, role, shown);
  if (rec) {
    card(
      `next:${rec.slug}`,
      <HeroCard
        kind={t("For you two next", "Pour vous deux, ensuite")}
        reason={
          rec.from
            ? t(`A good next step after ${deckName(rec.from.slug, lang)}`, `Une bonne suite après ${deckName(rec.from.slug, lang)}`)
            : t("A good next one for you two", "Une bonne suite pour vous deux")
        }
        slug={rec.slug}
        deck={session.decks?.[rec.slug]}
        role={role}
        joined={joined}
        partnerName={partnerName}
        onPlay={onPlay}
        onBrowse={onBrowse}
      />,
      rec.slug,
    );
  }
  // Then the other conversations you've started, up to six cards in all.
  for (const s of startedElsewhere(session.decks, role, shown)) {
    if (cards.length >= 6) break;
    card(
      `cont:${s}`,
      <HeroCard kind={t("Continue", "Continuer")} slug={s} deck={session.decks?.[s]} role={role} joined={joined} partnerName={partnerName} onPlay={onPlay} onBrowse={onBrowse} />,
      s,
    );
  }

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

      {/* Home is just the cards (Dave, Nov 2026): one for each thing worth
          doing now, the most useful first, nothing under them. Swipe for
          the next. */}
      <HeroStack slugs={cards.map((c) => c.key)} render={(k) => cards.find((c) => c.key === k)?.node ?? null} />
    </section>
  );
}

const begun = (decks: Session["decks"], s: string, role: Role) =>
  Object.values(decks?.[s]?.answers ?? {}).some((a) => a?.[role] != null);

// A part your partner has finished and you haven't: the one you're in first.
function yourTurn(slug: string, decks: Session["decks"], role: Role): { slug: string; level: number } | null {
  for (const s of [slug, ...ORDER.filter((x) => x !== slug)]) {
    if (!DECKS[s]) continue;
    for (let l = 0; l < nLevels(s); l++) {
      if (levelDone(decks?.[s], l, other(role)) && !levelDone(decks?.[s], l, role)) return { slug: s, level: l };
    }
  }
  return null;
}

// A good next conversation: one you haven't begun in the same subject as the
// last one you both opened (lowest score first, where there's most to talk
// about); otherwise the first you haven't begun.
function recommend(
  rows: { slug: string; pct: number | null }[],
  decks: Session["decks"],
  role: Role,
  shown: Set<string>,
): { slug: string; from: { slug: string; pct: number } | null } | null {
  const fresh = (s: string) => DECKS[s] && !shown.has(s) && !begun(decks, s, role);
  const opened = rows.filter((r) => r.pct != null).sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0));
  for (const r of opened) {
    const group = SUBJECTS.find((g) => g.slugs.includes(r.slug));
    const pick = group?.slugs.find(fresh);
    if (pick) return { slug: pick, from: { slug: r.slug, pct: r.pct as number } };
  }
  const any = ORDER.find(fresh);
  return any ? { slug: any, from: null } : null;
}

// Conversations you've started and not finished, not already on a card.
function startedElsewhere(decks: Session["decks"], role: Role, shown: Set<string>): string[] {
  return ORDER.filter((s) => DECKS[s] && !shown.has(s) && begun(decks, s, role) && !catComplete(s, decks?.[s], role));
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

// A conversation's card on Home (Dave, Nov 2026, final): the topic's big
// circle, its ring one segment per part and filling in one colour as you
// answer; under it, how much you've explored together; then the name, the
// part you're on, and one filled button. No score here: Home is about what
// you've explored together, and the numbers live on Together.
function HeroCard({
  kind,
  reason,
  slug,
  deck,
  role,
  joined,
  partnerName,
  onPlay,
  onBrowse,
}: {
  /** What this card is for, as a small pill top left. */
  kind: string;
  /** Why it's suggested, under the circle, when nothing's been answered yet. */
  reason?: string;
  slug: string;
  deck: DeckData | undefined;
  role: Role;
  joined: boolean;
  partnerName: string;
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

  // The ring: each part by how much of it you've answered.
  const parts = Array.from({ length: L }, (_, i) => i);
  const fills = parts.map((i) => {
    const n = lvlQs(slug, i).length;
    return levelDone(deck, i, role) ? 1 : n ? doneInLevel(slug, i, deck, role) / n : 0;
  });
  const answered = parts.filter((i) => levelDone(deck, i, role)).length;
  const together = parts.filter((i) => levelComplete(deck, i, role)).length;
  const begun = fills.some((f) => f > 0);
  // Under the circle: what the ring is showing, in words.
  const legend: ReactNode = allDone ? (
    L > 1 ? (
      <>
        <b>{t(`All ${L} parts`, `Les ${L} parties`)}</b> {t("explored together", "explorées ensemble")}
      </>
    ) : (
      t("Explored together", "Explorée ensemble")
    )
  ) : !begun && reason ? (
    reason
  ) : L === 1 ? (
    mine > 0 ? (
      <>
        <b>{t(`${mine} of ${lvlTotal} questions`, `${mine} questions sur ${lvlTotal}`)}</b> {t("answered", "répondues")}
      </>
    ) : (
      <>
        <b>{t(`${lvlTotal} questions`, `${lvlTotal} questions`)}</b> {t("to explore together", "à explorer ensemble")}
      </>
    )
  ) : answered > together ? (
    <>
      <b>{t(`${answered} of ${L}${together ? "" : " parts"}`, `${answered} ${together ? "" : `partie${answered === 1 ? "" : "s"} `}sur ${L}`)}</b>{" "}
      {t("answered", answered === 1 ? "répondue" : "répondues")}
      {together > 0 && (
        <>
          {" · "}
          <b>{together}</b> {t("opened together", together === 1 ? "ouverte ensemble" : "ouvertes ensemble")}
        </>
      )}
    </>
  ) : together > 0 ? (
    <>
      <b>{t(`${together} of ${L} parts`, `${together} partie${together === 1 ? "" : "s"} sur ${L}`)}</b>{" "}
      {t("explored together", together === 1 ? "explorée ensemble" : "explorées ensemble")}
    </>
  ) : (
    <>
      <b>{t(`${L} parts`, `${L} parties`)}</b> {t("to explore together", "à explorer ensemble")}
    </>
  );
  const name = deckName(slug, lang);
  // The name as large as it fits on one line; long names step down.
  const size = name.length <= 7 ? "lg" : name.length <= 10 ? "md" : "sm";
  return (
    <div className={`card hhero hcirc${size === "sm" ? " tight" : ""}`}>
      <span className="hkind">{kind}</span>
      <span className="hring" aria-hidden="true">
        <PartsRing fills={fills} />
        <span className="hring-ic">
          <DeckIcon icon={DECKS[slug]?.icon ?? "star"} size={44} stroke={1.6} />
        </span>
      </span>
      <span className="hring-legend">{legend}</span>
      <span className="hero-body">
        <h2 className={`hero-nm ${size}`}>{name}</h2>
        {!allDone && (
          <span className="hero-sub">
            {L > 1 && (
              <>
                <b>{t(`Part ${lvl + 1}`, `Partie ${lvl + 1}`)}</b> ·{" "}
              </>
            )}
            {partName(slug, lvl)}
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
