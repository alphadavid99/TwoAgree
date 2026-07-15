import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "./hooks/useAuth";
import { useProfile } from "./hooks/useProfile";
import { getActiveCode, setActiveCode, clearActiveCode } from "./lib/local";
import { redeemInvite } from "./lib/functions";
import { prettyError } from "./lib/errors";
import ProfileScreen from "./screens/ProfileScreen";
import StartScreen from "./screens/StartScreen";
import SessionApp from "./screens/SessionApp";
import Onboarding from "./screens/Onboarding";
import { Logo } from "./components/Logo";
import { IconSettings, IconBack } from "./components/icons";
import { useT } from "./lib/i18n";

const Wordmark = () => (
  <div className="brandhead brand-enter">
    <Logo size={40} />
  </div>
);

const Boot = ({ label }: { label: string }) => (
  <>
    <div className="spin" />
    <p className="muted center" style={{ fontSize: 14 }}>
      {label}
    </p>
  </>
);

// The signed-in-but-no-session landing: Start a session, with a settings gear
// that opens Profile (language, account, data controls, sign out) so this
// screen is never a dead end before a session exists.
function NoSession({
  user,
  name,
  inviteErr,
  onEnter,
}: {
  user: User;
  name: string;
  inviteErr: string;
  onEnter: (code: string) => void;
}) {
  const t = useT();
  const [view, setView] = useState<"start" | "profile">("start");
  const showProfile = view === "profile";
  return (
    <>
      <div className="landinghead brand-enter">
        <Logo size={30} />
        <button
          className="iconbtn landinghead-action"
          type="button"
          onClick={() => setView(showProfile ? "start" : "profile")}
          aria-label={showProfile ? t("Back", "Retour") : t("Settings", "Réglages")}
        >
          {showProfile ? <IconBack size={22} /> : <IconSettings size={22} />}
        </button>
      </div>
      {showProfile ? (
        <ProfileScreen user={user} />
      ) : (
        <>
          {inviteErr && (
            <div className="banner" style={{ marginTop: 16 }}>
              {inviteErr}
            </div>
          )}
          <StartScreen uid={user.uid} name={name} onEnter={onEnter} />
        </>
      )}
    </>
  );
}

// An invite link is /?t=<token>. Grab it once at load so it survives the
// sign-in / onboarding steps before we redeem it.
const inviteToken = new URLSearchParams(window.location.search).get("t");

function SignedIn({ user }: { user: User }) {
  const t = useT();
  const { profile, loading } = useProfile(user.uid);
  const [code, setCode] = useState<string | null>(() => getActiveCode(user.uid));
  const [redeeming, setRedeeming] = useState(!!inviteToken);
  const [inviteErr, setInviteErr] = useState("");

  // Redeem an invite link once the user is signed in and has a name.
  useEffect(() => {
    if (!inviteToken || code || !profile?.name) return;
    let cancelled = false;
    setRedeeming(true);
    redeemInvite({ token: inviteToken })
      .then((res) => {
        if (cancelled) return;
        setActiveCode(user.uid, res.data.code);
        setCode(res.data.code);
      })
      .catch((e) => !cancelled && setInviteErr(prettyError(e)))
      .finally(() => {
        if (cancelled) return;
        setRedeeming(false);
        window.history.replaceState({}, "", window.location.pathname);
      });
    return () => {
      cancelled = true;
    };
  }, [profile?.name, code, user.uid]);

  if (loading)
    return (
      <Boot label={t("Loading your profile…", "Chargement de votre profil…")} />
    );

  // First run: no profile name yet → must complete the profile before playing.
  if (!profile?.name) {
    return (
      <>
        <Wordmark />
        <ProfileScreen user={user} />
      </>
    );
  }

  if (redeeming)
    return (
      <Boot
        label={t(
          "Joining your partner’s session…",
          "Connexion à la session de votre partenaire…",
        )}
      />
    );

  if (!code) {
    return (
      <NoSession
        user={user}
        name={profile.name}
        inviteErr={inviteErr}
        onEnter={setCode}
      />
    );
  }

  return (
    <SessionApp
      code={code}
      user={user}
      onLeave={() => {
        clearActiveCode(user.uid);
        setCode(null);
      }}
    />
  );
}

// The no-account front door (brief 2 Part B §5). Whoever isn't signed into a
// REAL account lands in onboarding, which signs them in anonymously along the
// way — so a session code plus a first name reaches a reveal, no sign-up. When
// onboarding hands back a code we drop into the app; a real account can be
// linked later, additively, at the first moment they'd lose something.
function OnboardingGate({ user }: { user: User | null }) {
  const [code, setCode] = useState<string | null>(null);
  if (code && user) {
    return (
      <SessionApp code={code} user={user} onLeave={() => setCode(null)} />
    );
  }
  return (
    <Onboarding inviteToken={inviteToken} onEnter={(c) => setCode(c)} />
  );
}

export default function App() {
  const { user, loading } = useAuth();
  const t = useT();

  return (
    <div className="phone">
      {loading ? (
        <>
          <Wordmark />
          <Boot label={t("Checking your account…", "Vérification de votre compte…")} />
        </>
      ) : user && !user.isAnonymous ? (
        // Returning real-account users keep the existing create/join flow.
        <SignedIn user={user} />
      ) : (
        <OnboardingGate user={user} />
      )}
    </div>
  );
}
