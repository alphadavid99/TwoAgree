import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { ORDER } from "../lib/questions";
import { lvlQs, nLevels } from "../lib/leveling";
import {
  curLevel,
  levelDone,
  levelComplete,
  catComplete,
  doneInLevel,
  revealedQs,
  readyReveals,
  revealKey,
} from "../lib/progress";
import { jointQuestions, other, type Role } from "../lib/scoring";
import { useSession } from "../hooks/useSession";
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
import { Mark } from "../brand/Mark";
import { Avatar } from "../components/Avatar";
import { Wordmark } from "../brand/Wordmark";
import { PillNav } from "../components/PillNav";
import type { Session } from "../types";
import { IconHome, IconDecks, IconResults, IconProfile } from "../components/icons";
import { Route } from "lucide-react";
import { useT } from "../lib/i18n";

type Tab = "home" | "decks" | "path" | "results" | "profile";
type Flow = null | "picker" | "play" | "review" | "reviewDeck";

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

export default function SessionApp({
  code,
  user,
  onLeave,
  openSlug,
}: {
  code: string;
  user: User;
  onLeave: () => void;
  // A conversation to open on arrival — the one picked at the end of
  // onboarding. Without it that choice was silently discarded.
  openSlug?: string;
}) {
  const t = useT();
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

  if (loading) {
    return (
      <>
        <div className="spin" />
        <p className="muted center" style={{ fontSize: 14 }}>
          {t("Opening your session…", "Ouverture de votre session…")}
        </p>
      </>
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

  const enterFlow = (f: Flow, s: string, lvl: number) => {
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

  if (flow === "picker") {
    return (
      <PartPicker
        slug={slug}
        deck={deck}
        role={role}
        partnerName={partnerName}
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
              <div className="unlock-pair">
                <Avatar name={myName} tone="berry" size={46} />
                <Avatar name={partnerName} tone="honey" size={46} />
              </div>
              <div className="eyebrow center">{t("READY TO OPEN", "PRÊT À OUVRIR")}</div>
              <h2 className="h1 center" style={{ fontSize: 26, marginTop: 6 }}>
                {t(`${partnerName} just finished.`, `${partnerName} vient de terminer.`)}
              </h2>
              <p className="sub center" style={{ margin: "10px 24px 0" }}>
                {t(
                  "Your reveal is waiting — it's best opened side by side.",
                  "Votre révélation vous attend — mieux vaut l’ouvrir côte à côte.",
                )}
              </p>
              <button
                className="btn pill"
                type="button"
                onClick={() => setOpenReveal(true)}
              >
                {t("Open it together →", "Ouvrir ensemble →")}
              </button>
              <button className="btn ghost" type="button" onClick={exitFlow}>
                {t("In a moment", "Dans un instant")}
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
          myName={myName}
          partnerName={partnerName}
          firstEver={seen.length === 0}
          code={code}
          onDone={exitFlow}
        />
      );
    }
    const total = lvlQs(slug, level).length;
    return (
      <section>
        <TopBar onExit={exitFlow} />
        {/* Waiting on the partner: a breathing caret, not an error-ish spinner. */}
        <div className="bwrap">
          <span className="bring" />
          <span className="bring b2" />
          <Mark height={42} title="TwoAgree" colour="var(--berry)" />
        </div>
        <h2 className="h1 center" style={{ fontSize: 24 }}>
          {t("All yours are in.", "Les vôtres sont enregistrées.")}
        </h2>
        {/* The wait reads better as something SEALED than as something missing:
            the answers already exist, they're just closed until you've both
            finished. Same constraint, told as anticipation. */}
        <p className="sub center" style={{ margin: "10px 24px 20px" }}>
          {doneInLevel(slug, level, deck, other(role)) > 0
            ? t(
                `${partnerName}'s answers are sealed until you've both finished — then you'll see the same score, together.`,
                `Les réponses de ${partnerName} restent scellées jusqu’à ce que vous ayez tous deux terminé — vous verrez alors le même score, ensemble.`,
              )
            : t(
                `Sealed until ${partnerName} has answered too — then you'll both see the same score.`,
                `Scellé jusqu’à ce que ${partnerName} ait répondu aussi — vous verrez alors le même score tous les deux.`,
              )}
        </p>
        {/* Two counts side by side in team colours read as a scoreboard — the
            one framing the design values forbid. Stack them as statuses. */}
        <div className="waitstat">
          <p>
            <b>{t("Yours", "Les vôtres")}</b>
            <span>{t("all in ✓", "toutes enregistrées ✓")}</span>
          </p>
          <p>
            <b>{partnerName}</b>
            <span>
              {t(
                `${doneInLevel(slug, level, deck, other(role))} of ${total} so far`,
                `${doneInLevel(slug, level, deck, other(role))} sur ${total} pour l’instant`,
              )}
            </span>
          </p>
        </div>
        <button className="btn out" type="button" onClick={exitFlow}>
          {t("Keep exploring", "Continuer d’explorer")}
        </button>
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
              onReview={openReview}
              onProfile={() => setTab("profile")}
              pending={pending}
              onOpenReveal={openPendingReveal}
            />
          )}
          {tab === "decks" && (
            <DecksScreen session={session} role={role} onPlay={openDeck} />
          )}
          {PATH_ENABLED && tab === "path" && (
            <PathScreen
              code={code}
              session={session}
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
            />
          )}
          {tab === "profile" && (
            <ProfileScreen user={user} onLeave={onLeave} code={code} />
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
}
