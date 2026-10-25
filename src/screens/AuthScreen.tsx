import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  signInWithGoogleSmart,
  signInWithAppleSmart,
  appleAuthAvailable,
} from "../lib/device/auth";
import { prettyError } from "../lib/errors";
import { hasReturned } from "../lib/local";
import { useT } from "../lib/i18n";
import { PasswordField, FieldError, ErrorPanel, cleanEmail, looksLikeEmail } from "../components/AuthBits";

export type AuthMode = "signup" | "signin";
type Mode = AuthMode;

type Errors = {
  email?: string;
  pw?: string;
  consent?: string;
  /** The panel: what happened and the way forward. */
  panel?: "signin" | "taken" | "other";
  other?: string;
};

const codeOf = (e: unknown) => String((e as { code?: string })?.code ?? "");

// Email/password + Google + password reset (design refresh, item 9). One
// heading per screen; show-password; "Forgot password?" under the field;
// errors that say what to do next, under the field they belong to; a "Check
// your email" screen of its own; and the email you typed is kept after any
// error. On success, the top-level onAuthStateChanged (useAuth) swaps the view.
export default function AuthScreen({
  initialMode,
  initialEmail = "",
}: { initialMode?: Mode; initialEmail?: string } = {}) {
  const t = useT();
  // The caller's intent wins: "Sign in" must open sign-in even on a phone
  // that has never signed in before (it used to open Create there, because
  // only the device's history was consulted). With no stated intent,
  // returning devices land on "Sign in" and new visitors on "Create".
  const [mode, setMode] = useState<Mode>(
    initialMode ?? (hasReturned() ? "signin" : "signup"),
  );
  const [email, setEmail] = useState(initialEmail);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [errs, setErrs] = useState<Errors>({});
  const [resetSent, setResetSent] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const isSignup = mode === "signup";

  const switchTo = (m: Mode) => {
    setMode(m);
    setErrs({});
    setPw("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const addr = cleanEmail(email);
    const next: Errors = {};
    if (!addr) next.email = t("Enter your email.", "Saisissez votre e-mail.");
    else if (!looksLikeEmail(addr))
      next.email = t("That doesn’t look like an email address.", "Cela ne ressemble pas à une adresse e-mail.");
    if (!pw) next.pw = t("Enter your password.", "Saisissez votre mot de passe.");
    else if (isSignup && pw.length < 6)
      next.pw = t("Use at least 6 characters.", "Utilisez au moins 6 caractères.");
    if (isSignup && !agreed)
      next.consent = t(
        "Tick this to create your account.",
        "Cochez cette case pour créer votre compte.",
      );
    setErrs(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      if (isSignup) await createUserWithEmailAndPassword(auth, addr, pw);
      else await signInWithEmailAndPassword(auth, addr, pw);
    } catch (e2) {
      const code = codeOf(e2);
      if (code === "auth/email-already-in-use") setErrs({ panel: "taken" });
      else if (code === "auth/invalid-email") setErrs({ email: prettyError(e2) });
      else if (code === "auth/weak-password") setErrs({ pw: prettyError(e2) });
      else if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(code))
        setErrs({ panel: "signin" });
      else setErrs({ panel: "other", other: prettyError(e2) });
      setBusy(false);
    }
  };

  // Guard the consent gate on sign-up, then run whichever OAuth flow the
  // platform supports (native sheet on iOS, popup on web).
  const oauth = async (run: () => Promise<unknown>) => {
    setErrs({});
    if (isSignup && !agreed) {
      setErrs({
        consent: t("Tick this to create your account.", "Cochez cette case pour créer votre compte."),
      });
      return;
    }
    try {
      await run();
    } catch (e2) {
      setErrs({ panel: "other", other: prettyError(e2) });
    }
  };

  const google = () => oauth(() => signInWithGoogleSmart(auth));
  const apple = () => oauth(() => signInWithAppleSmart(auth));

  const resetPw = async () => {
    const addr = cleanEmail(email);
    if (!addr || !looksLikeEmail(addr)) {
      setErrs({
        email: t(
          "Enter your email first, then tap Forgot password.",
          "Saisissez d’abord votre e-mail, puis appuyez sur Mot de passe oublié.",
        ),
      });
      return;
    }
    setErrs({});
    try {
      await sendPasswordResetEmail(auth, addr);
      setResetSent(addr);
    } catch (e2) {
      // Never say whether an account exists; only real failures land here.
      setErrs({ panel: "other", other: prettyError(e2) });
    }
  };

  // ---- Check your email (its own calm screen) ----
  if (resetSent) {
    return (
      <section className="screen-enter center">
        <div className="mailicon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30">
            <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="h1 center">{t("Check your email", "Consultez vos e-mails")}</h1>
        <p className="sub center" style={{ margin: "8px 16px 0" }}>
          {t("If an account uses ", "Si un compte utilise ")}
          <b>{resetSent}</b>
          {t(
            ", we’ve sent a link to reset your password.",
            ", nous avons envoyé un lien pour réinitialiser votre mot de passe.",
          )}
        </p>
        <p className="helper center" style={{ margin: "6px 16px 0" }}>
          {t("It can take a minute. Check your spam folder too.", "Cela peut prendre une minute. Vérifiez aussi vos indésirables.")}
        </p>
        <button
          className="btn pill"
          type="button"
          onClick={() => {
            setResetSent(null);
            switchTo("signin");
          }}
        >
          {t("Back to sign in", "Retour à la connexion")}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            setResetSent(null);
            setEmail("");
            switchTo("signin");
          }}
        >
          {t("Use a different email", "Utiliser une autre adresse")}
        </button>
      </section>
    );
  }

  return (
    <section className="screen-enter">
      <h1 className="h1 center" style={{ marginTop: 16 }}>
        {isSignup ? t("Create your account", "Créez votre compte") : t("Welcome back", "Bon retour")}
      </h1>
      <p className="sub serif center" style={{ fontStyle: "italic", margin: "8px 20px 20px" }}>
        {isSignup
          ? t(
              "One profile that stays with you across every session.",
              "Un seul profil qui vous suit à chaque session.",
            )
          : t("Continue where you left off.", "Reprenez où vous en étiez.")}
      </p>

      {/* The white-card rule (brand pack RULE 2): one card, the way every
          other surface in the app works. */}
      <div className="card authcard">
        {isSignup && (
          <>
            <label className="consent" style={{ marginTop: 0 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setErrs((x) => ({ ...x, consent: undefined }));
                }}
                aria-describedby="consent-err"
              />
              <span>
                {t("I agree to the", "J’accepte la")}{" "}
                <a className="link" href="/privacy.html" target="_blank" rel="noreferrer">
                  {t("Privacy Policy", "politique de confidentialité")}
                </a>
                {t(
                  ". TwoAgree collects sensitive answers (faith, values, intimacy) to show the two of you where you align.",
                  ". TwoAgree recueille des réponses sensibles (foi, valeurs, intimité) pour vous montrer, à tous les deux, où vous vous rejoignez.",
                )}
              </span>
            </label>
            <FieldError id="consent-err">{errs.consent}</FieldError>
          </>
        )}

        <button className="btn out google" type="button" onClick={google} style={{ marginTop: 16 }}>
          {/* Google's official "G" mark: brand colours are fixed by Google's
              guidelines and must NOT be tokenised or recoloured. */}
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          {t("Continue with Google", "Continuer avec Google")}
        </button>

        {/* Sign in with Apple — native iOS only. Mandatory (App Review 4.8)
            whenever Google is offered. */}
        {appleAuthAvailable() && (
          <button className="btn out apple" type="button" onClick={apple} style={{ marginTop: 12 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M16.36 12.86c-.02-2.16 1.76-3.2 1.84-3.25-1-1.47-2.56-1.67-3.12-1.69-1.33-.13-2.59.78-3.26.78-.67 0-1.71-.76-2.81-.74-1.45.02-2.79.84-3.53 2.14-1.5 2.61-.38 6.47 1.08 8.59.71 1.04 1.56 2.2 2.68 2.16 1.07-.04 1.48-.69 2.78-.69 1.29 0 1.66.69 2.79.67 1.15-.02 1.88-1.06 2.59-2.1.81-1.21 1.15-2.38 1.17-2.44-.03-.01-2.24-.86-2.26-3.41zM14.2 6.6c.59-.72.99-1.71.88-2.7-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.61.95.07 1.92-.48 2.51-1.19z"
              />
            </svg>
            {t("Continue with Apple", "Continuer avec Apple")}
          </button>
        )}

        <div className="authdiv">{t("or use email", "ou par e-mail")}</div>

        <form onSubmit={submit} noValidate>
          <label htmlFor="email">{t("Email", "E-mail")}</label>
          <input
            className="input"
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errs.email || undefined}
            aria-describedby="email-err"
          />
          <FieldError id="email-err">{errs.email}</FieldError>

          <label htmlFor="pw">{t("Password", "Mot de passe")}</label>
          <PasswordField
            id="pw"
            value={pw}
            onChange={setPw}
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder={isSignup ? t("At least 6 characters", "Au moins 6 caractères") : t("Your password", "Votre mot de passe")}
            invalid={!!errs.pw}
            describedBy="pw-err"
          />
          <FieldError id="pw-err">{errs.pw}</FieldError>
          {!isSignup && (
            <div className="forgot">
              <button className="linkbtn" type="button" onClick={resetPw}>
                {t("Forgot password?", "Mot de passe oublié ?")}
              </button>
            </div>
          )}

          {errs.panel === "signin" && (
            <ErrorPanel>
              {t(
                "We couldn’t sign you in. Check your email and password, or ",
                "Connexion impossible. Vérifiez votre e-mail et votre mot de passe, ou ",
              )}
              <button className="inlinebtn" type="button" onClick={resetPw}>
                {t("reset your password", "réinitialisez votre mot de passe")}
              </button>
              .
            </ErrorPanel>
          )}
          {errs.panel === "taken" && (
            <ErrorPanel>
              {t("That email already has a TwoAgree account. ", "Cette adresse a déjà un compte TwoAgree. ")}
              <button className="inlinebtn" type="button" onClick={() => switchTo("signin")}>
                {t("Sign in instead", "Se connecter")}
              </button>
              .
            </ErrorPanel>
          )}
          {errs.panel === "other" && <ErrorPanel>{errs.other}</ErrorPanel>}

          <button className={busy ? "btn pill busy" : "btn pill"} type="submit" disabled={busy}>
            {busy
              ? t("One moment…", "Un instant…")
              : isSignup
                ? t("Create account →", "Créer le compte →")
                : t("Sign in →", "Se connecter →")}
          </button>
        </form>
      </div>

      <p className="muted center" style={{ fontSize: 14, marginTop: 8 }}>
        {isSignup ? t("Already have an account? ", "Vous avez déjà un compte ? ") : t("New here? ", "Nouveau ici ? ")}
        <button className="link" type="button" onClick={() => switchTo(isSignup ? "signin" : "signup")}>
          {isSignup ? t("Sign in", "Se connecter") : t("Create one", "Créer un compte")}
        </button>
      </p>
    </section>
  );
}
