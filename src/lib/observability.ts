// Error monitoring and analytics — both OFF unless their env var is set.
//
// Why this exists: before this, if a tester hit a white screen the only way
// Dave found out was if they said so, and there was nothing to debug from.
// You cannot fix what you cannot see, and the app is about to meet strangers.
//
// Why it is paranoid: TwoAgree holds special-category answers — faith, sex,
// health — about real people in the UK. A stock error-monitoring install
// happily ships DOM text, URLs and form values to a third party, which would
// mean a couple's answer about intimacy leaving the app inside a breadcrumb.
// So the Sentry client here runs with everything that could carry an answer
// switched off, and a beforeSend that drops anything that slipped through.
//
// Both integrations load lazily: with no env var set nothing is imported,
// nothing is requested, and the bundle does not carry them.

/** Set to a Sentry DSN to turn error reporting on. Prefer an EU-region DSN. */
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
/** Set to the site domain to turn Plausible on (cookieless, no consent needed). */
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const PLAUSIBLE_SRC =
  (import.meta.env.VITE_PLAUSIBLE_SRC as string | undefined) ??
  "https://plausible.io/js/script.js";

// Anything whose value could be, or could contain, an answer. Matched against
// breadcrumb/extra keys before an event leaves the device.
const SENSITIVE_KEY = /answer|guess|importance|intake|bio|photo|email|name|talk|q$|qid/i;

/** A session code is a shared secret — it lets anyone join. Never report one. */
function scrubUrl(url: string): string {
  try {
    const u = new URL(url, window.location.origin);
    // /?c=ABCD (join by code) and /?t=<token> (single-use invite).
    for (const k of ["c", "t"]) if (u.searchParams.has(k)) u.searchParams.set(k, "[redacted]");
    return u.toString();
  } catch {
    return "[unparseable]";
  }
}

function scrubDeep(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[deep]";
  if (Array.isArray(value)) return value.map((v) => scrubDeep(v, depth + 1));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEY.test(k) ? "[redacted]" : scrubDeep(v, depth + 1);
    }
    return out;
  }
  return value;
}

async function initSentry(): Promise<void> {
  if (!SENTRY_DSN) return;
  const Sentry = await import("@sentry/react");
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_BUILD_SHA as string | undefined,
    // No performance tracing and no session replay: replay in particular would
    // record the couple answering questions about their sex life.
    tracesSampleRate: 0,
    sendDefaultPii: false,
    // The default integration set includes ones that harvest content.
    integrations: (defaults) =>
      defaults.filter(
        (i) =>
          ![
            "Breadcrumbs", // DOM text, clicks, fetch bodies
            "BrowserSession",
            "Replay",
            "ReplayCanvas",
            "BrowserTracing",
          ].includes(i.name),
      ),
    beforeBreadcrumb: () => null, // belt and braces — the integration is gone too
    beforeSend(event) {
      if (event.request?.url) event.request.url = scrubUrl(event.request.url);
      delete event.request?.headers;
      delete event.request?.cookies;
      delete event.request?.data;
      delete event.user; // uid is enough of an identifier to be worth not sending
      if (event.extra) event.extra = scrubDeep(event.extra) as typeof event.extra;
      if (event.contexts) event.contexts = scrubDeep(event.contexts) as typeof event.contexts;
      event.breadcrumbs = undefined;
      return event;
    },
  });
}

function initPlausible(): void {
  if (!PLAUSIBLE_DOMAIN) return;
  // Plausible over a vendor with cookies: no cookies, no cross-site identifier,
  // no consent banner required, and the payload is a URL and a referrer — it
  // never sees a question or an answer.
  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = PLAUSIBLE_DOMAIN;
  s.src = PLAUSIBLE_SRC;
  document.head.appendChild(s);
}

export function initObservability(): void {
  // Sentry is a ~475 kB chunk (~150 kB gzipped) — worth it for grouped,
  // source-mapped stack traces, but not worth a slower first paint on the
  // low-end Android that Capacitor will eventually target. It is lazy (absent
  // entirely from a build with no DSN) and deferred to idle, so the couple sees
  // the app before the monitoring loads. Errors thrown before it arrives are
  // still caught by the ErrorBoundary and logged to the console.
  const start = () =>
    void initSentry().catch(() => {
      /* monitoring must never be the thing that breaks the app */
    });
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void })
    .requestIdleCallback;
  if (ric) ric(start);
  else setTimeout(start, 2000);

  initPlausible();
}

type Plausible = (event: string, opts?: { props?: Record<string, string | number> }) => void;

/**
 * A milestone worth counting. Names only — never a question, an answer, or a
 * code. No-op until Plausible is configured, so call sites need no guard.
 */
export function track(event: string, props?: Record<string, string | number>): void {
  const w = window as unknown as { plausible?: Plausible };
  try {
    w.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* analytics is never load-bearing */
  }
}

/** Report a handled error we'd otherwise swallow (a failed write, a dead sync). */
export function reportError(err: unknown, where: string): void {
  if (!SENTRY_DSN) return;
  void import("@sentry/react")
    .then((S) => S.captureException(err, { tags: { where } }))
    .catch(() => {});
}
