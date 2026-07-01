import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "./hooks/useAuth";
import { useProfile } from "./hooks/useProfile";
import { getActiveCode, setActiveCode, clearActiveCode } from "./lib/local";
import { redeemInvite } from "./lib/functions";
import { prettyError } from "./lib/errors";
import AuthScreen from "./screens/AuthScreen";
import ProfileScreen from "./screens/ProfileScreen";
import StartScreen from "./screens/StartScreen";
import SessionApp from "./screens/SessionApp";
import { Logo } from "./components/Logo";

const Wordmark = () => (
  <div className="brandhead">
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

// An invite link is /?t=<token>. Grab it once at load so it survives the
// sign-in / onboarding steps before we redeem it.
const inviteToken = new URLSearchParams(window.location.search).get("t");

function SignedIn({ user }: { user: User }) {
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

  if (loading) return <Boot label="Loading your profile…" />;

  // First run: no profile name yet → must complete the profile before playing.
  if (!profile?.name) {
    return (
      <>
        <Wordmark />
        <ProfileScreen user={user} />
      </>
    );
  }

  if (redeeming) return <Boot label="Joining your partner’s session…" />;

  if (!code) {
    return (
      <>
        <Wordmark />
        {inviteErr && (
          <div className="banner" style={{ marginTop: 16 }}>
            {inviteErr}
          </div>
        )}
        <StartScreen uid={user.uid} name={profile.name} onEnter={setCode} />
      </>
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

export default function App() {
  const { user, loading } = useAuth();

  return (
    <div className="phone">
      {loading ? (
        <>
          <Wordmark />
          <Boot label="Checking your account…" />
        </>
      ) : user ? (
        <SignedIn user={user} />
      ) : (
        <>
          <Wordmark />
          <AuthScreen />
        </>
      )}
    </div>
  );
}
