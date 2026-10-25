import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { ORDER } from "../lib/questions";
import { lvlQs, nLevels } from "../lib/leveling";
import {
  curLevel,
  levelDone,
  levelComplete,
  catComplete,
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
            <DecksScreen session={session} role={role} onPlay={openDeck} />
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
}
