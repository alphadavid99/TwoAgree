// @vitest-environment jsdom
//
// The scrubbing is the whole safety argument for shipping error reporting from
// an app that holds Article 9 answers. If it silently regresses, a couple's
// answer about intimacy leaves the device inside an error report — so it gets
// tested rather than trusted.
import { describe, it, expect, beforeEach, vi } from "vitest";

// The module reads import.meta.env at load time, so the DSN has to be stubbed
// before the import — hence the dynamic import inside each block.
async function loadWith(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v as string);
  return await import("./observability");
}

describe("observability — off by default", () => {
  beforeEach(() => vi.unstubAllEnvs());

  it("injects no analytics script when no domain is configured", async () => {
    document.head.innerHTML = "";
    const o = await loadWith({ VITE_SENTRY_DSN: "", VITE_PLAUSIBLE_DOMAIN: "" });
    o.initObservability();
    expect(document.head.querySelector("script")).toBeNull();
  });

  it("track() is a safe no-op when nothing is wired up", async () => {
    const o = await loadWith({ VITE_PLAUSIBLE_DOMAIN: "" });
    expect(() => o.track("session created")).not.toThrow();
  });

  it("reportError does nothing without a DSN", async () => {
    const o = await loadWith({ VITE_SENTRY_DSN: "" });
    expect(() => o.reportError(new Error("boom"), "test")).not.toThrow();
  });
});

describe("observability — analytics", () => {
  beforeEach(() => vi.unstubAllEnvs());

  it("loads Plausible with the configured domain and no cookies", async () => {
    document.head.innerHTML = "";
    const o = await loadWith({ VITE_PLAUSIBLE_DOMAIN: "twoagree.app", VITE_SENTRY_DSN: "" });
    o.initObservability();
    const s = document.head.querySelector("script")!;
    expect(s).not.toBeNull();
    expect(s.dataset.domain).toBe("twoagree.app");
    expect(s.src).toContain("plausible.io");
    expect(s.defer).toBe(true);
  });

  it("forwards a milestone to plausible, names only", async () => {
    const calls: unknown[][] = [];
    (window as unknown as { plausible: (...a: unknown[]) => void }).plausible = (...a) =>
      calls.push(a);
    const o = await loadWith({ VITE_PLAUSIBLE_DOMAIN: "twoagree.app" });
    o.track("part finished", { deck: "finances-money", part: 2 });
    expect(calls).toEqual([["part finished", { props: { deck: "finances-money", part: 2 } }]]);
  });
});

describe("observability — the Sentry payload never carries an answer", () => {
  beforeEach(() => vi.unstubAllEnvs());

  // Capture the options Sentry.init was called with, then exercise beforeSend
  // exactly the way the SDK would.
  async function beforeSendOf() {
    vi.resetModules();
    vi.stubEnv("VITE_SENTRY_DSN", "https://k@o1.ingest.de.sentry.io/1");
    let opts: Record<string, unknown> = {};
    vi.doMock("@sentry/react", () => ({
      init: (o: Record<string, unknown>) => {
        opts = o;
      },
      captureException: () => {},
    }));
    const o = await import("./observability");
    o.initObservability();
    // initSentry is deferred to idle; jsdom has no requestIdleCallback, so the
    // setTimeout fallback runs it.
    await vi.waitFor(() => expect(Object.keys(opts).length).toBeGreaterThan(0), {
      timeout: 4000,
    });
    return opts;
  }

  it("disables replay, tracing and PII outright", async () => {
    const opts = await beforeSendOf();
    expect(opts.tracesSampleRate).toBe(0);
    expect(opts.sendDefaultPii).toBe(false);
    // Session Replay would literally record someone answering about their sex
    // life. It must never be in the integration list.
    const filter = opts.integrations as (d: { name: string }[]) => { name: string }[];
    const kept = filter([
      { name: "Replay" },
      { name: "ReplayCanvas" },
      { name: "Breadcrumbs" },
      { name: "BrowserTracing" },
      { name: "GlobalHandlers" },
    ]);
    expect(kept.map((i) => i.name)).toEqual(["GlobalHandlers"]);
  });

  it("drops breadcrumbs, headers, cookies, request bodies and the user", async () => {
    const opts = await beforeSendOf();
    const beforeSend = opts.beforeSend as (e: Record<string, unknown>) => Record<string, unknown>;
    const out = beforeSend({
      request: {
        url: "https://twoagree.app/?c=ABCD",
        headers: { Cookie: "x" },
        cookies: { s: "1" },
        data: { answer: 3 },
      },
      user: { id: "uid-123", email: "sarah@example.com" },
      breadcrumbs: [{ message: "clicked: I want children" }],
    });
    const req = out.request as Record<string, unknown>;
    expect(req.headers).toBeUndefined();
    expect(req.cookies).toBeUndefined();
    expect(req.data).toBeUndefined();
    expect(out.user).toBeUndefined();
    expect(out.breadcrumbs).toBeUndefined();
  });

  it("redacts the session code from the URL — it is a join secret", async () => {
    const opts = await beforeSendOf();
    const beforeSend = opts.beforeSend as (e: Record<string, unknown>) => Record<string, unknown>;
    const out = beforeSend({ request: { url: "https://twoagree.app/?c=ABCD&t=tok123" } });
    const url = (out.request as { url: string }).url;
    expect(url).not.toContain("ABCD");
    expect(url).not.toContain("tok123");
    expect(url).toContain("redacted");
  });

  it("redacts answer-shaped keys at any depth in extra context", async () => {
    const opts = await beforeSendOf();
    const beforeSend = opts.beforeSend as (e: Record<string, unknown>) => Record<string, unknown>;
    const out = beforeSend({
      extra: {
        deck: "intimacy-physical",
        state: { answers: { "INT-019": 5 }, bio: "something private", part: 2 },
      },
    });
    const extra = out.extra as Record<string, Record<string, unknown>>;
    expect(extra.deck).toBe("intimacy-physical"); // a deck slug is not an answer
    expect(extra.state.answers).toBe("[redacted]");
    expect(extra.state.bio).toBe("[redacted]");
    expect(extra.state.part).toBe(2);
  });
});
