// Screenshot harness — renders any single screen in isolation from mock props,
// selected by ?screen=<key>. Firebase is stubbed at the module boundary (see
// vite.harness.config.ts), so every screen renders offline with no backend.
import { useT } from "../lib/i18n";
import { DECKS } from "../lib/questions";
import { collectFlagRows } from "../lib/flags";
import {
  MOCK_SESSION,
  MOCK_USER,
  PRIMARY_SLUG,
  MY_ROLE,
  HOST_NAME,
  GUEST_NAME,
  PATH_STEPS,
} from "./mocks";

import AuthScreen from "../screens/AuthScreen";
import Onboarding from "../screens/Onboarding";
import StartScreen from "../screens/StartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import DecksScreen from "../screens/DecksScreen";
import PlayScreen from "../screens/PlayScreen";
import PartPicker from "../screens/PartPicker";
import RevealScreen from "../screens/RevealScreen";
import ResultsScreen from "../screens/ResultsScreen";
import { CoreScore } from "../screens/CoreScore";
import FlagsReview from "../screens/FlagsReview";
import PathScreen from "../screens/PathScreen";
import PathStep from "../screens/PathStep";
import StartMenu from "../screens/StartMenu";
import SessionApp from "../screens/SessionApp";

const noop = () => {};

// The list drives both the switcher and the Playwright capture loop (exposed on
// window for the driver to read).
export const SCREENS: string[] = [
  "app", // full SessionApp shell with bottom nav (drive tabs via clicks)
  "auth",
  "onboarding",
  "startmenu",
  "start",
  "profile",
  "home",
  "decks",
  "play",
  "partpicker",
  "reveal",
  "reveal-review",
  "results",
  "corescore",
  "flags",
  "path",
  "pathstep",
];

export default function Harness() {
  const t = useT();
  const session = MOCK_SESSION;
  const deck = session.decks?.[PRIMARY_SLUG];
  const primaryQs = DECKS[PRIMARY_SLUG].questions;
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen") ?? "app";

  const common = {
    role: MY_ROLE,
    myName: HOST_NAME,
    partnerName: GUEST_NAME,
  };

  let body: React.ReactNode;
  switch (screen) {
    case "app":
      body = <SessionApp code="DEMO42" user={MOCK_USER} onLeave={noop} />;
      break;
    case "auth":
      body = <AuthScreen />;
      break;
    case "onboarding":
      body = <Onboarding inviteToken={null} onDone={noop} />;
      break;
    case "startmenu":
      body = <StartMenu stage="engaged" onPick={noop} onSeeAll={noop} />;
      break;
    case "start":
      body = <StartScreen uid={MOCK_USER.uid} name={HOST_NAME} onEnter={noop} />;
      break;
    case "profile":
      body = <ProfileScreen user={MOCK_USER} onLeave={noop} />;
      break;
    case "home":
      body = (
        <HomeScreen
          code="DEMO42"
          session={session}
          role={MY_ROLE}
          slug={PRIMARY_SLUG}
          onPlay={noop}
          onBrowse={noop}
          onReview={noop}
          onProfile={noop}
        />
      );
      break;
    case "decks":
      body = <DecksScreen session={session} role={MY_ROLE} onPlay={noop} />;
      break;
    case "play":
      // Fresh (empty) deck so play starts at question 1 of the level.
      body = (
        <PlayScreen
          code="DEMO42"
          slug={PRIMARY_SLUG}
          level={0}
          role={MY_ROLE}
          deck={{}}
          partnerName={GUEST_NAME}
          onFinish={noop}
          onExit={noop}
        />
      );
      break;
    case "partpicker":
      body = (
        <PartPicker
          slug={PRIMARY_SLUG}
          deck={deck}
          role={MY_ROLE}
          partnerName={GUEST_NAME}
          onSelect={noop}
          onExit={noop}
        />
      );
      break;
    case "reveal":
      body = (
        <RevealScreen
          slug={PRIMARY_SLUG}
          level={0}
          role={MY_ROLE}
          deck={deck}
          onDone={noop}
          myName={HOST_NAME}
          partnerName={GUEST_NAME}
        />
      );
      break;
    case "reveal-review":
      body = (
        <RevealScreen
          slug={PRIMARY_SLUG}
          level={0}
          role={MY_ROLE}
          deck={deck}
          onDone={noop}
          myName={HOST_NAME}
          partnerName={GUEST_NAME}
          questions={primaryQs}
          review
          title="Home"
        />
      );
      break;
    case "results":
      body = <ResultsScreen session={session} role={MY_ROLE} onOpen={noop} />;
      break;
    case "corescore":
      body = (
        <CoreScore
          agreed={{ pct: 78, done: 52, total: 70 }}
          known={{ pct: 64, done: 48, total: 70 }}
          myName={HOST_NAME}
          partnerName={GUEST_NAME}
          t={t}
        />
      );
      break;
    case "flags": {
      const rows = collectFlagRows(primaryQs, deck ?? {}, MY_ROLE);
      body = (
        <FlagsReview
          rows={rows}
          myName={HOST_NAME}
          partnerName={GUEST_NAME}
          onClose={noop}
        />
      );
      break;
    }
    case "path":
      body = (
        <PathScreen
          code="DEMO42"
          session={session}
          user={MOCK_USER}
          partnerName={GUEST_NAME}
          onBrowseDecks={noop}
          onOpenStep={noop}
        />
      );
      break;
    case "pathstep":
      body = (
        <PathStep
          code="DEMO42"
          role={MY_ROLE}
          session={session}
          index={0}
          step={PATH_STEPS[0]}
          myName={HOST_NAME}
          partnerName={GUEST_NAME}
          onExit={noop}
        />
      );
      break;
    default:
      body = <div style={{ padding: 24 }}>Unknown screen: {screen}</div>;
  }

  void common;
  return <div className="phone">{body}</div>;
}
