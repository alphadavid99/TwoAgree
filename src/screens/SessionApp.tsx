import { useEffect, useRef, useState, type RefObject } from "react";
import type { User } from "firebase/auth";
import { ORDER } from "../lib/questions";
import { lvlQs, nLevels, partName } from "../lib/leveling";
import {
  curLevel,
  levelDone,
  levelComplete,
  catComplete,
  revealedQs,
  readyReveals,
  revealKey,
  doneInLevel,
} from "../lib/progress";
import { jointQuestions, other, type Role } from "../lib/scoring";
import { useSession } from "../hooks/useSession";
import { useProfile } from "../hooks/useProfile";
import { renameInSession } from "../lib/session";
import {
  getLastDeck,
  setLastDeck,
  getSeenReveals,
  markRevealSeen,
} from "../lib/local";
import HomeScreen from "./HomeScreen";
import DecksScreen from "./DecksScreen";
import ResultsScreen from "./ResultsScreen";
import ProfileScreen from "./ProfileScreen";
import PlayScreen from "./PlayScreen";
import PartPicker from "./PartPicker";
import RevealScreen from "./RevealScreen";
import PathScreen, { PathFlow } from "./PathScreen";
import { TopBar } from "../components/TopBar";
import { Loading } from "../components/Loading";
import { Mark } from "../brand/Mark";
import { Avatar, toneFor } from "../components/Avatar";
import { deckName } from "../lib/questions.fr";
import { talkEventIcs, icsHref } from "../lib/calendar";
import { Wordmark } from "../brand/Wordmark";
import { PillNav } from "../components/PillNav";
import type { Session } from "../types";
import { IconHome, IconDecks, IconResults, IconProfile } from "../components/icons";
import { Route } from "lucide-react";
import { useLang, useT } from "../lib/i18n";
import { track } from "../lib/observability";
import { useScrollMemory } from "../lib/scroll";
import { askLive, replyLive, incoming, isOpen, LIVE_OPEN_MS, type LiveRequest } from "../lib/live";
import { Sheet } from "../components/Sheet";

type Tab = "home" | "decks" | "path" | "results" | "profile";
type Flow = null | "picker" | "play" | "review" | "reviewDeck" | "liveWait";

const TABS: {
  key: Tab;
  en: string;
  fr: string;
  Icon: (p: { size?: number }) => React.JSX.Element;
}[] = [
  { key: "home", en: "Home", fr: "Accueil", Icon: IconHome },
  { key: "decks", en: "Talk", fr: "Parler", Icon: IconDecks },
  // The Path ships behind a flag (VITE_PATH_ENABLED) — it needs the generatePath
  // Cloud Function deployed, and touches live users, so it stays dark by default.
  ...(import.meta.env.VITE_PATH_ENABLED === "true"
    ? [
        {
          key: "path" as Tab,
          en: "Path",
          fr: "Chemin",
          Icon: ({ size }: { size?: number }) => <Route size={size} strokeWidth={2} />,
        },
      ]
    : []),
  { key: "results", en: "Together", fr: "Ensemble", Icon: IconResults },
  { key: "profile", en: "You", fr: "Vous", Icon: IconProfile },
];

const PATH_ENABLED = import.meta.env.VITE_PATH_ENABLED === "true";

// Where opening a conversation should land: the full breakdown if it's
// finished, the part picker if it has several parts, otherwise straight into
// (or back to) the current part. Shared by the tap handler and the
// open-on-arrival effect, which can't call each other — the effect has to be
// declared before the loading guards, the handler after them.
function deckEntry(
  slug: string,
  session: Session,
  role: Role,
): { flow: Flow; level: number } {
  const d = session.decks?.[slug];
  if (catComplete(slug, d, role)) return { flow: "reviewDeck", level: 0 };
  if (nLevels(slug) > 1) return { flow: "picker", level: 0 };
  const lvl = curLevel(slug, d, role);
  return { flow: levelDone(d, lvl, role) ? "review" : "play", level: lvl };
}

type Props = {
  code: string;
  user: User;
  onLeave: () => void;
  // A conversation to open on arrival — the one picked at the end of
  // onboarding. Without it that choice was silently discarded.
  openSlug?: string;
};

// The anchor sits beside every screen this renders, so the scroll memory can
// find what scrolls before any screen has mounted.
export default function SessionApp(props: Props) {
  const anchor = useRef<HTMLElement>(null);
  return (
    <>
      <i ref={anchor} hidden />
      <SessionScreens {...props} anchor={anchor} />
    </>
  );
}

function SessionScreens({
  code,
  user,
  onLeave,
  openSlug,
  anchor,
}: Props & { anchor: RefObject<HTMLElement | null> }) {
  const t = useT();
  const lang = useLang();
  const { session, role, loading, denied } = useSession(code, user.uid);
  const [tab, setTab] = useState<Tab>("home");
  // Where the couple actually is, remembered across app opens. Defaulting to
  // ORDER[0] meant Home pointed at the first deck in the bank on every reload,
  // under a greeting that promises "Where you left off, together".
  const [slug, setSlug] = useState(
    () => openSlug ?? getLastDeck(user.uid, code) ?? ORDER[0],
  );
  const [level, setLevel] = useState(0);
  const [flow, setFlow] = useState<Flow>(null);
  // Was this reveal already unlocked when we arrived? If it unlocks WHILE the
  // partner is watching the waiting screen, that's an event worth holding on —
  // see the threshold card below. Opening a finished part deliberately (from
  // the picker) is not, so it goes straight in.
  const lockedOnEntry = useRef(false);
  const [openReveal, setOpenReveal] = useState(false);
  // Reveals already opened on this device, so the herald only ever points at
  // something genuinely new. Kept in state so opening one clears the card.
  const [seen, setSeen] = useState<string[]>(() => getSeenReveals(user.uid, code));

  // Open the picked conversation once, after the session has loaded.
  const opened = useRef(false);
  useEffect(() => {
    if (!openSlug || opened.current || !session || !role) return;
    opened.current = true;
    const { flow: f, level: l } = deckEntry(openSlug, session, role);
    setSlug(openSlug);
    setLevel(l);
    setFlow(f);
  }, [openSlug, session, role]);

  // A reveal counts as seen once its ceremony is actually on screen — that's
  // what retires the herald card on Home.
  useEffect(() => {
    if (flow !== "review" || !session || !role) return;
    const d = session.decks?.[slug];
    const ready =
      levelComplete(d, level, role) &&
      jointQuestions(lvlQs(slug, level), d ?? {}).length > 0;
    if (!ready) return;
    if (lockedOnEntry.current && !openReveal) return; // still on the threshold
    const key = revealKey(slug, level);
    markRevealSeen(user.uid, code, key);
    setSeen((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, [flow, slug, level, openReveal, session, role, user.uid, code]);
  // Which tab the play/reveal flow was entered from, so × returns there.
  const [flowReturn, setFlowReturn] = useState<Tab>("home");
  // The Path step being walked (full-screen, no bottom nav), or null on the map.
  const [pathStep, setPathStep] = useState<number | null>(null);

  // Your name in the session follows your profile: someone who joined as
  // "Guest" and then set their name shows as that name to their partner.
  const { profile } = useProfile(user.uid);
  const profileName = profile?.name?.trim();
  const sessionName = role ? session?.members?.[role]?.name : undefined;
  useEffect(() => {
    if (!role || !profileName || profileName === sessionName) return;
    void renameInSession(code, role, profileName).catch(() => {});
  }, [code, role, profileName, sessionName]);

  // Doing a part together, now (lib/live.ts). A ticking clock while a request
  // is open, so it lapses on screen after ten minutes.
  const liveReq: LiveRequest | undefined = session?.live;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (liveReq?.status !== "asked") return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, [liveReq?.status, liveReq?.at]);
  // The part you've just picked, while you choose: with your partner, or alone.
  const [choose, setChoose] = useState<{ slug: string; level: number } | null>(null);
  // Asking: the moment your partner says yes, you're both in.
  useEffect(() => {
    if (flow !== "liveWait" || !liveReq || !role) return;
    if (liveReq.from === role && liveReq.status === "accepted" && liveReq.slug === slug && liveReq.level === level)
      setFlow("play");
  }, [flow, liveReq, role, slug, level]);
  const [linkCopied, setLinkCopied] = useState(false);

  // Every screen opens at the top. Coming back out of a conversation returns
  // the tab to where you left it, like closing a card; switching tabs starts
  // each one fresh.
  const view =
    pathStep != null ? `step:${pathStep}` : flow ? `${flow}:${slug}:${level}` : `tab:${tab}`;
  useScrollMemory(view, (from, to) => !from.startsWith("tab:") && to.startsWith("tab:"), anchor);

  if (loading) {
    return (
      <Loading
        shape="home"
        label={t("Opening your session…", "Ouverture de votre session…")}
        onBack={onLeave}
      />
    );
  }

  if (denied || !session || !role) {
    return (
      <section>
        <TopBar />
        <div className="banner" style={{ marginTop: 24 }}>
          {t(
            "This session isn’t available on your account. It may have been closed, or the code is wrong.",
            "Cette session n’est pas disponible sur votre compte. Elle a peut-être été fermée, ou le code est incorrect.",
          )}
        </div>
        <button className="btn out" type="button" onClick={onLeave}>
          {t("Back to start", "Retour au début")}
        </button>
      </section>
    );
  }

  const deck = session.decks?.[slug];
  const myName = session.members?.[role]?.name ?? t("You", "Vous");
  const partnerName =
    session.members?.[other(role)]?.name ?? t("your partner", "votre partenaire");
  // Both names by role, for "which of you" questions: the same order on both
  // phones, whoever is looking (lib/who.ts).
  const names = {
    host: role === "host" ? myName : partnerName,
    guest: role === "guest" ? myName : partnerName,
  };

  // Leave the play/reveal flow, returning to whichever tab it was opened from.
  const exitFlow = () => {
    setFlow(null);
    setTab(flowReturn);
  };

  const pending = readyReveals(session.decks, role).filter(
    (r) =>
      !seen.includes(revealKey(r.slug, r.level)) &&
      jointQuestions(lvlQs(r.slug, r.level), session.decks?.[r.slug] ?? {}).length > 0,
  );

  const openPendingReveal = (s: string, lvl: number) => {
    track("reveal opened", { deck: s });
    setFlowReturn("home");
    setSlug(s);
    setLastDeck(user.uid, code, s);
    lockedOnEntry.current = false; // a deliberate tap — no threshold beat needed
    setOpenReveal(true);
    setLevel(lvl);
    setFlow("review");
  };

  const revealReady = (s: string, lvl: number) =>
    levelComplete(session.decks?.[s], lvl, role) &&
    jointQuestions(lvlQs(s, lvl), session.decks?.[s] ?? {}).length > 0;

  // Starting a part you haven't begun, with your partner in the session:
  // offer to do it together, now, first.
  const canAskLive = (s: string, lvl: number) =>
    !!session.members?.guest?.uid &&
    !levelDone(session.decks?.[s], lvl, role) &&
    !levelDone(session.decks?.[s], lvl, other(role)) &&
    doneInLevel(s, lvl, session.decks?.[s], role) === 0;

  const enterFlow = (f: Flow, s: string, lvl: number, offerLive = true) => {
    if (f === "play" && offerLive && canAskLive(s, lvl)) {
      setChoose({ slug: s, level: lvl });
      return;
    }
    lockedOnEntry.current = f === "review" && !revealReady(s, lvl);
    setOpenReveal(false);
    setLevel(lvl);
    setFlow(f);
  };

  const openDeck = (s: string) => {
    setFlowReturn(tab); // remember where we came from (Home or Decks)
    setSlug(s);
    setLastDeck(user.uid, code, s);
    // Finished decks reopen as the full breakdown; multi-part decks open the
    // picker so a couple can choose any part and see both partners' per-part
    // state (brief 2 §A7d); single-part decks go straight in.
    const { flow: f, level: l } = deckEntry(s, session, role);
    enterFlow(f, s, l);
  };

  // From the part picker: play a not-yet-finished part, or open the waiting/
  // reveal screen for one you've already done.
  const selectPart = (lvl: number) => {
    enterFlow(levelDone(session.decks?.[slug], lvl, role) ? "review" : "play", slug, lvl);
  };

  const partnerFirst = partnerName.trim().split(/\s+/)[0] || partnerName;
  const partLabel = (s: string, lvl: number) =>
    nLevels(s) > 1 ? `${deckName(s, lang)} · ${partName(s, lvl)}` : deckName(s, lang);

  const askTogether = (s: string, lvl: number) => {
    track("live asked", { deck: s });
    setChoose(null);
    setLinkCopied(false);
    void askLive(code, role, s, lvl).catch(() => {});
    setSlug(s);
    setLevel(lvl);
    setOpenReveal(false);
    setFlow("liveWait");
  };

  // Your partner said yes, or you're starting on your own after all.
  const startAlone = (s: string, lvl: number) => {
    setChoose(null);
    enterFlow("play", s, lvl, false);
  };

  // Saying yes to your partner's request: straight into that part.
  const acceptLive = (r: LiveRequest) => {
    track("live accepted", { deck: r.slug });
    void replyLive(code, r, "accepted").catch(() => {});
    setPathStep(null);
    setChoose(null);
    if (!flow) setFlowReturn(tab);
    setSlug(r.slug);
    setLastDeck(user.uid, code, r.slug);
    enterFlow(levelDone(session.decks?.[r.slug], r.level, role) ? "review" : "play", r.slug, r.level, false);
  };

  // The link for when your partner's app isn't open: opening it shows them
  // the request.
  const shareLive = async () => {
    const text = t(
      `${myName.trim().split(/\s+/)[0]} would like to start ${partLabel(slug, level)} with you on TwoAgree.`,
      `${myName.trim().split(/\s+/)[0]} aimerait commencer ${partLabel(slug, level)} avec vous sur TwoAgree.`,
    );
    const url = window.location.origin;
    if (navigator.share) {
      await navigator.share({ text, url }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(`${text} ${url}`).then(() => setLinkCopied(true), () => {});
  };

  // From Results: always open the deck's revealed levels as a review, even if
  // the deck isn't finished yet (a row only exists once a level is revealed).
  const openReview = (s: string) => {
    if (!revealedQs(s, session.decks?.[s], role).length) {
      openDeck(s);
      return;
    }
    setFlowReturn(tab);
    setSlug(s);
    setFlow("reviewDeck");
  };

  // The sheets that can open over any screen: choosing how to start a part,
  // and your partner's request to start one now.
  const req = liveReq;
  const showIncoming = incoming(req, role, now);
  const sheets = (
    <>
      {choose && !showIncoming && (
        <Sheet
          eyebrow={nLevels(choose.slug) > 1 ? t(`${deckName(choose.slug, lang)} · Part ${choose.level + 1}`, `${deckName(choose.slug, lang)} · Partie ${choose.level + 1}`).toUpperCase() : undefined}
          title={nLevels(choose.slug) > 1 ? partName(choose.slug, choose.level) : deckName(choose.slug, lang)}
          onClose={() => setChoose(null)}
        >
          <button className="livechoice live" type="button" onClick={() => askTogether(choose.slug, choose.level)}>
            <span className="livechoice-avs" aria-hidden="true">
              <Avatar name={myName} tone={toneFor(role)} size={40} ring={false} />
              <Avatar name={partnerName} tone={toneFor(other(role))} size={40} ring={false} />
            </span>
            <span>
              <b>{t(`Do it with ${partnerFirst} now`, `Le faire avec ${partnerFirst} maintenant`)}</b>
              <span>
                {t(
                  `We’ll ask ${partnerFirst} to start this part too. You each answer on your own phone.`,
                  `Nous demanderons à ${partnerFirst} de commencer aussi. Chacun répond sur son téléphone.`,
                )}
              </span>
            </span>
          </button>
          <button className="livechoice" type="button" onClick={() => startAlone(choose.slug, choose.level)}>
            <span className="livechoice-avs" aria-hidden="true">
              <Avatar name={myName} tone={toneFor(role)} size={40} ring={false} />
            </span>
            <span>
              <b>{t("Answer on my own", "Répondre seul")}</b>
              <span>{t(`${partnerFirst} can do it whenever suits them.`, `${partnerFirst} pourra le faire quand cela lui convient.`)}</span>
            </span>
          </button>
          <p className="helper center livechoice-note">
            {t(
              "Either way, your answers stay private until you’ve both finished.",
              "Dans les deux cas, vos réponses restent privées jusqu’à ce que vous ayez tous deux terminé.",
            )}
          </p>
        </Sheet>
      )}
      {showIncoming && req && (
        <Sheet
          eyebrow={t(`A request from ${partnerFirst}`, `Une demande de ${partnerFirst}`).toUpperCase()}
          title={t(
            `${partnerFirst} wants to start ${partLabel(req.slug, req.level)} with you`,
            `${partnerFirst} veut commencer ${partLabel(req.slug, req.level)} avec vous`,
          )}
          onClose={() => void replyLive(code, req, "declined").catch(() => {})}
        >
          <p className="sub livereq-text">
            {t(
              "You each answer on your own phone, at your own pace. Your answers stay private until you’ve both finished.",
              "Chacun répond sur son téléphone, à son rythme. Vos réponses restent privées jusqu’à ce que vous ayez tous deux terminé.",
            )}
          </p>
          <button className="btn pill" type="button" onClick={() => acceptLive(req)}>
            {t("Start now", "Commencer")}
          </button>
          <button className="btn ghost" type="button" onClick={() => void replyLive(code, req, "declined").catch(() => {})}>
            {t("Not right now", "Pas maintenant")}
          </button>
        </Sheet>
      )}
    </>
  );

  const renderView = (): React.JSX.Element => {
    // ---- In-flow screens (bottom nav hidden) ----
    if (pathStep != null) {
      return (
        <PathFlow
          code={code}
          role={role}
          session={session}
          index={pathStep}
          myName={myName}
          partnerName={partnerName}
          onExit={() => setPathStep(null)}
        />
      );
    }

    // Asking your partner to start this part now: waiting for their answer.
    if (flow === "liveWait") {
      const r = liveReq && liveReq.from === role && liveReq.slug === slug && liveReq.level === level ? liveReq : null;
      const state = !r
        ? "lapsed"
        : r.status === "declined"
          ? "declined"
          : r.status === "asked" && !isOpen(r, now)
            ? "lapsed"
            : r.status === "cancelled"
              ? "lapsed"
              : "asking";
      const cancel = () => {
        if (r && r.status === "asked") void replyLive(code, r, "cancelled").catch(() => {});
      };
      return (
        <section key={state} className="screen-enter">
          <TopBar
            onExit={() => {
              cancel();
              exitFlow();
            }}
          />
          <div className="unlock">
            <div className={state === "asking" ? "liveglow" : "pair-apart"}>
              <span className="pair-apart">
                <Avatar name={myName} tone={toneFor(role)} size={46} />
                <Avatar name={partnerName} tone={toneFor(other(role))} size={46} pending />
              </span>
            </div>
            {state === "asking" ? (
              <>
                <h2 className="h1 center" style={{ fontSize: 26 }}>
                  {t(`Asking ${partnerFirst}…`, `Demande envoyée à ${partnerFirst}…`)}
                </h2>
                <p className="sub center" style={{ margin: "10px 24px 0" }}>
                  {t(
                    `We’ve asked ${partnerFirst} to start ${partLabel(slug, level)} with you. You’ll go in as soon as they say yes.`,
                    `Nous avons demandé à ${partnerFirst} de commencer ${partLabel(slug, level)} avec vous. Vous entrerez dès qu’il ou elle aura accepté.`,
                  )}
                </p>
                <button className="btn out" type="button" onClick={() => void shareLive()}>
                  {linkCopied
                    ? t("Link copied: paste it to them", "Lien copié : collez-le-lui")
                    : t(`Send ${partnerFirst} a link`, `Envoyer un lien à ${partnerFirst}`)}
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    cancel();
                    startAlone(slug, level);
                  }}
                >
                  {t("Start on my own instead", "Commencer seul")}
                </button>
                <p className="helper center">
                  {t(
                    `The request stays open for ${LIVE_OPEN_MS / 60000} minutes.`,
                    `La demande reste ouverte ${LIVE_OPEN_MS / 60000} minutes.`,
                  )}
                </p>
              </>
            ) : (
              <>
                <h2 className="h1 center" style={{ fontSize: 26 }}>
                  {state === "declined"
                    ? t(`${partnerFirst} can’t right now`, `${partnerFirst} ne peut pas maintenant`)
                    : t(`No answer from ${partnerFirst} yet`, `Pas encore de réponse de ${partnerFirst}`)}
                </h2>
                <p className="sub center" style={{ margin: "10px 24px 0" }}>
                  {t(
                    `You can start it on your own, and ${partnerFirst} can do it whenever suits them.`,
                    `Vous pouvez commencer seul, et ${partnerFirst} pourra le faire quand cela lui convient.`,
                  )}
                </p>
                <button className="btn pill" type="button" onClick={() => startAlone(slug, level)}>
                  {t("Start on my own", "Commencer seul")}
                </button>
                {state === "lapsed" && (
                  <button className="btn out" type="button" onClick={() => askTogether(slug, level)}>
                    {t(`Ask ${partnerFirst} again`, `Redemander à ${partnerFirst}`)}
                  </button>
                )}
                <button className="btn ghost" type="button" onClick={exitFlow}>
                  {t("Choose another time", "Choisir un autre moment")}
                </button>
              </>
            )}
          </div>
        </section>
      );
    }

    if (flow === "picker") {
      return (
        <PartPicker
          slug={slug}
          deck={deck}
          role={role}
          myName={myName}
          partnerName={partnerName}
          members={session.members}
          onSelect={selectPart}
          onExit={exitFlow}
        />
      );
    }

    if (flow === "play") {
      return (
        <PlayScreen
          code={code}
          slug={slug}
          level={level}
          role={role}
          deck={deck}
          partnerName={partnerName}
          names={names}
          onFinish={() => {
            lockedOnEntry.current = !revealReady(slug, level);
            setOpenReveal(false);
            setFlow("review");
          }}
          onExit={exitFlow}
        />
      );
    }

    // Reopen a deck's breakdown — every question from the levels the two of you
    // have both finished (the whole deck once it's complete).
    if (flow === "reviewDeck") {
      return (
        <RevealScreen
          slug={slug}
          level={0}
          role={role}
          deck={deck}
          myName={myName}
          partnerName={partnerName}
          questions={revealedQs(slug, deck, role)}
          review
          code={code}
          talkFirst={flowReturn === "results"}
          onDone={exitFlow}
        />
      );
    }

    if (flow === "review") {
      const ready =
        levelComplete(deck, level, role) &&
        jointQuestions(lvlQs(slug, level), deck ?? {}).length > 0;
      if (ready) {
        // If it became ready while they were sitting here, hold the moment. The
        // live listener used to swap the waiting screen straight into the
        // ceremony mid-read — the app's most anticipated event arriving as a
        // screen that changed under them, with no "Judah just finished" beat.
        if (lockedOnEntry.current && !openReveal) {
          return (
            <section className="screen-enter">
              <TopBar onExit={exitFlow} />
              <div className="unlock">
                <div className="pair-apart">
                  <Avatar name={session.members?.host?.name} tone="berry" size={46} />
                  <Avatar name={session.members?.guest?.name} tone="honey" size={46} />
                </div>
                <div className="eyebrow center">{t("READY TO OPEN", "PRÊT À OUVRIR")}</div>
                <h2 className="h1 center" style={{ fontSize: 26, marginTop: 6 }}>
                  {t("You’ve both finished this part.", "Vous avez tous deux terminé cette partie.")}
                </h2>
                <p className="sub center" style={{ margin: "10px 24px 0" }}>
                  {t(
                    "Your reveal is ready. It’s best opened together, whenever suits you both.",
                    "Votre révélation est prête. Mieux vaut l’ouvrir ensemble, quand cela vous convient à tous les deux.",
                  )}
                </p>
                <button
                  className="btn pill"
                  type="button"
                  onClick={() => setOpenReveal(true)}
                >
                  {t("Open the reveal →", "Ouvrir la révélation →")}
                </button>
                <button className="btn ghost" type="button" onClick={exitFlow}>
                  {t("Later", "Plus tard")}
                </button>
              </div>
            </section>
          );
        }
        return (
          <RevealScreen
            slug={slug}
            level={level}
            role={role}
            deck={deck}
            pick={deck?.pick?.[level]}
            myName={myName}
            partnerName={partnerName}
            firstEver={seen.length === 0}
            code={code}
            onDone={exitFlow}
          />
        );
      }
      // You've finished, they haven't (item 1): both of you, one quiet line, two
      // ways on, and an optional calendar link. No counts, no blame.
      const partLabel =
        nLevels(slug) > 1
          ? t(
              `${deckName(slug, lang)} · Part ${level + 1}`,
              `${deckName(slug, lang)} · Partie ${level + 1}`,
            )
          : deckName(slug, lang);
      const ics = talkEventIcs(
        t(`TwoAgree: ${partLabel}`, `TwoAgree : ${partLabel}`),
        t(
          `Open the reveal for ${partLabel} together, in person or on a call. https://twoagree.app`,
          `Ouvrez ensemble la révélation de ${partLabel}, en personne ou par appel. https://twoagree.app`,
        ),
      );
      return (
        <section className="screen-enter">
          <TopBar onExit={exitFlow} />
          <div className="unlock">
            <div className="pair-apart">
              {(["host", "guest"] as const).map((r) =>
                r === role ? (
                  <Avatar key={r} name={session.members?.[r]?.name} tone={toneFor(r)} size={56} done />
                ) : (
                  <Avatar key={r} name={session.members?.[r]?.name ?? partnerName} tone={toneFor(r)} size={56} pending />
                ),
              )}
            </div>
            <h2 className="h1 center" style={{ fontSize: 26 }}>
              {t("Your answers are saved.", "Vos réponses sont enregistrées.")}
            </h2>
            <p className="sub center" style={{ margin: "10px 24px 0" }}>
              {t(
                `${partLabel} opens when ${partnerName.trim().split(/\s+/)[0]} has answered too.`,
                `${partLabel} s’ouvrira quand ${partnerName.trim().split(/\s+/)[0]} aura répondu aussi.`,
              )}
            </p>
            <p className="sub serif center" style={{ fontStyle: "italic", margin: "14px 24px 6px", color: "var(--ink)" }}>
              {t(
                "It’s a journey for two. Open it together when you can.",
                "C’est un chemin à deux. Ouvrez-la ensemble quand vous pourrez.",
              )}
            </p>
            <button
              className="btn pill"
              type="button"
              onClick={() => {
                setFlow(null);
                setTab("home");
              }}
            >
              {t("Back to Home", "Retour à l’accueil")}
            </button>
            <button
              className="btn out"
              type="button"
              onClick={() => {
                setFlow(null);
                setTab("decks");
              }}
            >
              {t("Try another conversation", "Essayer une autre conversation")}
            </button>
            <a
              className="btn ghost callink"
              href={icsHref(ics)}
              download="twoagree-conversation.ics"
            >
              {t("Add a time to your calendar", "Ajouter un moment à votre agenda")}
            </a>
          </div>
        </section>
      );
    }

    // ---- Tab screens (bottom nav shown) ----
    return (
      <>
        <div className="tabwrap">
          {/* Home wears its own header (avatar chip + settings); other tabs keep
              the brand mark up top. */}
          {tab !== "home" && tab !== "path" && (
            <div className="brandhead" style={{ padding: "2px 0 10px" }}>
              {tab === "profile" ? (
                <Wordmark size={24} />
              ) : (
                <Mark height={30} title="TwoAgree" colour="var(--berry)" />
              )}
            </div>
          )}
          {/* keyed per tab so each pane rises in on switch */}
          <div key={tab} className="pane-in">
            {tab === "home" && (
              <HomeScreen
                code={code}
                session={session}
                role={role}
                slug={slug}
                onPlay={openDeck}
                onBrowse={() => setTab("decks")}
                onTogether={() => setTab("results")}
                pending={pending}
                onOpenReveal={openPendingReveal}
                onPath={PATH_ENABLED ? () => setTab("path") : undefined}
              />
            )}
            {tab === "decks" && (
              <DecksScreen session={session} role={role} onPlay={openDeck} current={slug} />
            )}
            {PATH_ENABLED && tab === "path" && (
              <PathScreen
                code={code}
                session={session}
                role={role}
                user={user}
                partnerName={partnerName}
                onBrowseDecks={() => setTab("decks")}
                onOpenStep={setPathStep}
              />
            )}
            {tab === "results" && (
              <ResultsScreen
                session={session}
                role={role}
                code={code}
                onOpen={openReview}
                onBrowse={() => setTab("decks")}
              />
            )}
            {tab === "profile" && (
              <ProfileScreen
                user={user}
                onLeave={onLeave}
                code={code}
                partnerName={partnerName}
                myNameHere={session.members?.[role]?.name}
              />
            )}
          </div>
        </div>

        {/* Floating pill nav — the honey pill slides to whichever tab you pick. */}
        <PillNav
          items={TABS.map(({ key, en, fr, Icon }) => ({ key, label: t(en, fr), Icon }))}
          active={tab}
          onSelect={(k) => setTab(k as Tab)}
        />
      </>
    );
  };

  return (
    <>
      {renderView()}
      {sheets}
    </>
  );
}
