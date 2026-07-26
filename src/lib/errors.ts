// Friendlier text for Firebase auth / database errors.
// Ported from aligned-accounts.html's pretty(); now bilingual. Reads the
// current language non-reactively (errors surface at action time, so a live
// subscription isn't needed).
import { getLang } from "./i18n";

const MESSAGES: Record<string, { en: string; fr: string }> = {
  "auth/email-already-in-use": {
    en: "That email already has an account, try signing in.",
    fr: "Cet e-mail a déjà un compte, essayez de vous connecter.",
  },
  "auth/invalid-email": {
    en: "That email doesn’t look right.",
    fr: "Cet e-mail semble incorrect.",
  },
  "auth/weak-password": {
    en: "Use at least 6 characters.",
    fr: "Utilisez au moins 6 caractères.",
  },
  "auth/wrong-password": {
    en: "That password doesn’t match.",
    fr: "Ce mot de passe ne correspond pas.",
  },
  "auth/user-not-found": {
    en: "No account with that email yet.",
    fr: "Aucun compte avec cet e-mail pour l’instant.",
  },
  "auth/invalid-credential": {
    en: "Email or password is incorrect.",
    fr: "E-mail ou mot de passe incorrect.",
  },
  "auth/too-many-requests": {
    en: "Too many attempts: wait a moment and try again.",
    fr: "Trop de tentatives, patientez un instant et réessayez.",
  },
  "auth/popup-closed-by-user": {
    en: "Sign-in was closed before finishing.",
    fr: "La connexion a été fermée avant la fin.",
  },
  // Was "…isn't enabled in your Firebase console yet" — a couple has no console.
  "auth/operation-not-allowed": {
    en: "That way of signing in isn’t available right now.",
    fr: "Cette façon de se connecter n’est pas disponible pour le moment.",
  },
  // Was "Database rules blocked that — check your security rules."
  PERMISSION_DENIED: {
    en: "That didn’t save. Try signing in again.",
    fr: "L’enregistrement a échoué. Reconnectez-vous et réessayez.",
  },
  "auth/network-request-failed": {
    en: "You look offline: check your connection and try again.",
    fr: "Vous semblez hors ligne, vérifiez votre connexion et réessayez.",
  },
  // The linking flows throw these when the person already has an account.
  "auth/credential-already-in-use": {
    en: "That account already exists: sign in with it instead.",
    fr: "Ce compte existe déjà, connectez-vous avec celui-ci.",
  },
  "auth/account-exists-with-different-credential": {
    en: "That email is already used with a different sign-in method.",
    fr: "Cet e-mail est déjà utilisé avec une autre méthode de connexion.",
  },
  "auth/provider-already-linked": {
    en: "That account is already connected.",
    fr: "Ce compte est déjà connecté.",
  },
  "auth/popup-blocked": {
    en: "Your browser blocked the sign-in window, allow pop-ups and try again.",
    fr: "Votre navigateur a bloqué la fenêtre de connexion, autorisez les pop-ups et réessayez.",
  },
  "auth/cancelled-popup-request": {
    en: "Sign-in was closed before finishing.",
    fr: "La connexion a été fermée avant la fin.",
  },
  "auth/user-disabled": {
    en: "That account has been disabled.",
    fr: "Ce compte a été désactivé.",
  },
  "auth/requires-recent-login": {
    en: "For your security, sign in again before making this change.",
    fr: "Pour votre sécurité, reconnectez-vous avant de faire ce changement.",
  },
};

// Machine text that must never reach a couple. Firebase stamps every error
// message with "Firebase: …", and our callables surface as "functions/…" —
// an unmapped one used to be printed verbatim, so the capture in the UX review
// shows "Firebase: Error (auth/internal-error)." sitting under the password
// field at the invite gate, the single highest-trust moment in the flow.
const MACHINE = /^Firebase:|^FirebaseError|INTERNAL|^\[?functions\//i;

export function prettyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const message = (err as { message?: string })?.message?.trim();
  const known = MESSAGES[code];
  const fr = getLang() === "fr";
  if (known) return fr ? known.fr : known.en;
  // Our own Cloud Functions throw HttpsError with human-written messages, so
  // those still pass through — anything that smells of a stack trace doesn't.
  if (message && !MACHINE.test(message) && !code.startsWith("auth/")) {
    return message;
  }
  if (code) console.warn("[twoagree] unmapped error code:", code, message);
  return fr ? "Une erreur s’est produite." : "Something went wrong: please try again.";
}
