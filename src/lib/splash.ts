// The launch screen (feedback, Nov 2026). index.html paints the wordmark,
// centred, before any script runs; it stays over the app while the app is
// still booting (signing in, the profile, the session: each a <Loading>), and
// fades once the first real screen is up. One calm screen, not three
// skeletons in a row.
//
// Every <Loading> counts itself in and out (components/Loading.tsx). When none
// has been mounted for a moment, the app is showing something real, so the
// launch screen goes. It stays at least MIN_MS so a fast load doesn't blink,
// and never more than MAX_MS: past that, the loading screen underneath (with
// its "Still loading…" and Try again) takes over.
// Long enough for the wordmark's 0.6s entrance to land and rest a beat.
const MIN_MS = 900;
const MAX_MS = 8000;
const SETTLE_MS = 150;

let loading = 0;
let settle: ReturnType<typeof setTimeout> | undefined;
let gone = false;

const el = () => (typeof document === "undefined" ? null : document.getElementById("splash"));

/** Is the launch screen still covering the app? */
export const splashUp = (): boolean => !gone && !!el();

export function hideSplash(): void {
  if (gone) return;
  gone = true;
  const s = el();
  if (!s) return;
  const wait = Math.max(0, MIN_MS - (typeof performance === "undefined" ? MIN_MS : performance.now()));
  setTimeout(() => {
    s.classList.add("out");
    // Removed after its fade (or at once with reduced motion, no transition).
    s.addEventListener("transitionend", () => s.remove(), { once: true });
    setTimeout(() => s.remove(), 700);
  }, wait);
}

function check(): void {
  clearTimeout(settle);
  settle = setTimeout(() => {
    if (loading === 0) hideSplash();
  }, SETTLE_MS);
}

export function loadingIn(): void {
  loading++;
  clearTimeout(settle);
}

export function loadingOut(): void {
  loading = Math.max(0, loading - 1);
  check();
}

/** Call once the app has rendered: starts the watch, and the upper limit. */
export function watchSplash(): void {
  if (!el()) return;
  check();
  setTimeout(hideSplash, MAX_MS);
}
