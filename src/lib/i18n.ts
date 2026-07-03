// Lightweight UI internationalisation.
//
// Deliberately keyless: call t("English", "Français") at each site so the two
// languages sit side by side and stay in sync when copy changes. This suits a
// solo build far better than a key registry, and it's Capacitor-friendly (no
// dependency on anything but localStorage). Language is a device-level choice,
// remembered across sessions.
//
// Scope note: this localises the app *chrome*. The 270-question bank is content
// (maintained in the canonical .xlsx per CLAUDE.md §9) and stays English until
// a proper translated bank ships — see the plan in the PR notes.
import { useSyncExternalStore } from "react";

export type Lang = "en" | "fr";
export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "fr", label: "French", native: "Français" },
];

const KEY = "aligned_lang";

function detect(): Lang {
  const saved = localStorage.getItem(KEY);
  if (saved === "en" || saved === "fr") return saved;
  return typeof navigator !== "undefined" && navigator.language?.startsWith("fr")
    ? "fr"
    : "en";
}

let current: Lang = detect();
if (typeof document !== "undefined") document.documentElement.lang = current;

const listeners = new Set<() => void>();

export function getLang(): Lang {
  return current;
}

export function setLang(l: Lang): void {
  if (l === current) return;
  current = l;
  localStorage.setItem(KEY, l);
  if (typeof document !== "undefined") document.documentElement.lang = l;
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Reactive current language — re-renders subscribers when it changes. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang);
}

/**
 * Translator hook. `const t = useT()` then `t("Start", "Démarrer")`.
 * Returns the French string when the language is French, else the English one.
 */
export function useT(): (en: string, fr: string) => string {
  const lang = useLang();
  return (en, fr) => (lang === "fr" ? fr : en);
}
