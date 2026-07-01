import { useState } from "react";
import type { User } from "firebase/auth";
import { ORDER } from "../lib/questions";
import { lvlQs } from "../lib/leveling";
import { curLevel, levelDone, levelComplete, catComplete, doneInLevel } from "../lib/progress";
import { jointQuestions, other } from "../lib/scoring";
import { useSession } from "../hooks/useSession";
import HomeScreen from "./HomeScreen";
import DecksScreen from "./DecksScreen";
import ResultsScreen from "./ResultsScreen";
import ProfileScreen from "./ProfileScreen";
import PlayScreen from "./PlayScreen";
import RevealScreen from "./RevealScreen";
import { TopBar } from "../components/TopBar";
import { Logo } from "../components/Logo";
import { IconHome, IconDecks, IconResults, IconProfile } from "../components/icons";

type Tab = "home" | "decks" | "results" | "profile";
type Flow = null | "play" | "review";

const TABS: { key: Tab; label: string; Icon: (p: { size?: number }) => React.JSX.Element }[] = [
  { key: "home", label: "Home", Icon: IconHome },
  { key: "decks", label: "Decks", Icon: IconDecks },
  { key: "results", label: "Results", Icon: IconResults },
  { key: "profile", label: "Profile", Icon: IconProfile },
];

export default function SessionApp({
  code,
  user,
  onLeave,
}: {
  code: string;
  user: User;
  onLeave: () => void;
}) {
  const { session, role, loading, denied } = useSession(code, user.uid);
  const [tab, setTab] = useState<Tab>("home");
  const [slug, setSlug] = useState(ORDER[0]);
  const [level, setLevel] = useState(0);
  const [flow, setFlow] = useState<Flow>(null);
  // Which tab the play/reveal flow was entered from, so × returns there.
  const [flowReturn, setFlowReturn] = useState<Tab>("home");

  if (loading) {
    return (
      <>
        <div className="spin" />
        <p className="muted center" style={{ fontSize: 14 }}>
          Opening your session…
        </p>
      </>
    );
  }

  if (denied || !session || !role) {
    return (
      <section>
        <TopBar />
        <div className="banner" style={{ marginTop: 24 }}>
          This session isn’t available on your account. It may have been closed,
          or the code is wrong.
        </div>
        <button className="btn out" type="button" onClick={onLeave}>
          Back to start
        </button>
      </section>
    );
  }

  const deck = session.decks?.[slug];
  const partnerName = session.members?.[other(role)]?.name ?? "your partner";

  // Leave the play/reveal flow, returning to whichever tab it was opened from.
  const exitFlow = () => {
    setFlow(null);
    setTab(flowReturn);
  };

  const openDeck = (s: string) => {
    setFlowReturn(tab); // remember where we came from (Home or Decks)
    setSlug(s);
    const d = session.decks?.[s];
    if (catComplete(s, d, role)) {
      setFlow(null);
      setTab("results");
      return;
    }
    const lvl = curLevel(s, d, role);
    setLevel(lvl);
    setFlow(levelDone(d, lvl, role) ? "review" : "play");
  };

  // ---- In-flow screens (bottom nav hidden) ----
  if (flow === "play") {
    return (
      <PlayScreen
        code={code}
        slug={slug}
        level={level}
        role={role}
        deck={deck}
        partnerName={partnerName}
        onFinish={() => setFlow("review")}
        onExit={exitFlow}
      />
    );
  }

  if (flow === "review") {
    const ready =
      levelComplete(deck, level, role) &&
      jointQuestions(lvlQs(slug, level), deck ?? {}).length > 0;
    if (ready) {
      return (
        <RevealScreen
          slug={slug}
          level={level}
          role={role}
          deck={deck}
          onDone={exitFlow}
        />
      );
    }
    const total = lvlQs(slug, level).length;
    return (
      <section>
        <TopBar onExit={exitFlow} />
        <div className="spin" />
        <h2 className="h1 center" style={{ fontSize: 24 }}>
          All yours are in.
        </h2>
        <p className="sub center" style={{ margin: "10px 24px 20px" }}>
          Your alignment unlocks once you’ve <b>both</b> finished — so you always
          see the same score.
        </p>
        <p className="center" style={{ fontSize: 15 }}>
          <span style={{ color: "var(--berry)" }}>
            <b>You</b> {doneInLevel(slug, level, deck, role)}/{total}
          </span>
          <span style={{ margin: "0 14px", color: "var(--amber)" }}>
            <b>{partnerName}</b> {doneInLevel(slug, level, deck, other(role))}/{total}
          </span>
        </p>
        <button className="btn out" type="button" onClick={exitFlow}>
          Keep exploring
        </button>
      </section>
    );
  }

  // ---- Tab screens (bottom nav shown) ----
  return (
    <>
      <div className="tabwrap">
        <div className="brandhead" style={{ padding: "2px 0 10px" }}>
          {/* Full wordmark on Home + Profile; caret only on Decks + Results. */}
          <Logo size={30} word={tab === "home" || tab === "profile"} />
        </div>
        {tab === "home" && (
          <HomeScreen
            code={code}
            session={session}
            role={role}
            slug={slug}
            onPlay={openDeck}
            onBrowse={() => setTab("decks")}
          />
        )}
        {tab === "decks" && (
          <DecksScreen session={session} role={role} onPlay={openDeck} />
        )}
        {tab === "results" && <ResultsScreen session={session} role={role} />}
        {tab === "profile" && <ProfileScreen user={user} onLeave={onLeave} />}
      </div>

      <nav className="bnav">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            className={`bnav-item ${tab === key ? "on" : ""}`}
            onClick={() => setTab(key)}
            aria-label={label}
            aria-current={tab === key ? "page" : undefined}
          >
            <Icon size={23} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
