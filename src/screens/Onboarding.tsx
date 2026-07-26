import { useEffect, useRef, useState } from "react";
import {
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "../firebase";
import {
  linkWithGoogleSmart,
  linkWithAppleSmart,
  appleAuthAvailable,
} from "../lib/device/auth";
import {
  createSession,
  writeAnswer,
  writeGuess,
  markLevelDone,
  recordConsent,
  writeProfile,
} from "../lib/session";
import { redeemInvite, joinByCode, createInvite } from "../lib/functions";
import type { Invite } from "../lib/invite";
import {
  getOnbCheckpoint,
  setOnbCheckpoint,
  clearOnbCheckpoint,
  setActiveCode,
} from "../lib/local";
import { prettyError } from "../lib/errors";
import { fileToAvatarDataUrl } from "../lib/device/photo";
import { DECKS, type Question } from "../lib/questions";
import { ONB_STAGES, STARTER_QIDS, type OnbStage } from "../lib/onboarding";
import type { Stage } from "../types";
import { Mark } from "../brand/Mark";
import { Wordmark } from "../brand/Wordmark";
import { TopBar } from "../components/TopBar";
import StartMenu from "./StartMenu";
import RevealScreen from "./RevealScreen";
import AuthScreen from "./AuthScreen";
import type { DeckData } from "../lib/scoring";
import { useT } from "../lib/i18n";

// The onboarding starter: a hand-picked set of warm "Who's more likely to…?"
// questions (STARTER_QIDS in ../lib/onboarding — chosen so every couple fits an
// option). Each guessable question is answered, then you predict your partner's
// answer (the "predict your partner" layer, same as the main play flow). Both
// partners answer the SAME questions so the reveal overlaps. The ids live in
// fun-icebreakers' level-0 slice, so marking that level done reveals exactly them.
const STARTER_SLUG = "fun-icebreakers";
const STARTER_BY_ID = new Map(
  DECKS[STARTER_SLUG].questions.map((q) => [q.id, q]),
);
const STARTER_QS: Question[] = STARTER_QIDS.map((id) => STARTER_BY_ID.get(id)).filter(
  (q): q is Question => !!q && (q.type === "mc" || q.type === "scale"),
);

// The eight-child stagger is an ARRIVAL gesture — it takes ~0.9s to settle.
// Onboarding replayed it on every one of its ~15 steps, so each tap was
// followed by the whole screen re-assembling itself. The first screen a flow
// shows is a genuine arrival; each step after it gets the quick pane rise.
// Cached per step, so a re-render (typing in a field) can't swap the class
// mid-screen and restart the motion.
function useStepEnter(stepKey: string): string {
  const seen = useRef<Record<string, string>>({});
  if (!seen.current[stepKey]) {
    seen.current[stepKey] =
      Object.keys(seen.current).length === 0 ? "screen-enter" : "pane-in";
  }
  return seen.current[stepKey];
}

type T = (en: string, fr: string) => string;
type AStep =
  | "welcome"
  | "names"
  | "stage"
  | "consent"
  | "questions"
  | "profile"
  | "invite"
  | "menu";
type BStep =
  | "arrive"
  | "name"
  | "consent"
  | "questions"
  | "reveal"
  | "account"
  | "path";

// Onboarding = recruitment (spec v2). Flow A: the person who arrives first —
// answers, then creates their profile at the invite gate, then invites. Flow B:
// the person they bring — reaches the reveal without ever needing an account.
// Anonymous auth carries the pre-account state; the account is layered on at the
// exact moment it earns its keep (the invite / the notification channel).
export default function Onboarding({
  invite,
  onDone,
}: {
  invite: Invite | null;
  // The conversation picked on the closing menu rides along, so the app can
  // open it — the pick used to be dropped on the floor.
  onDone: (code: string, slug?: string) => void;
}) {
  const t = useT();

  // A checkpoint from an interrupted run on this device, read once at mount.
  // Only trusted while the same anonymous user is still signed in — the seat
  // and the consent behind it were written under that uid.
  const [saved] = useState(() => {
    const u = auth.currentUser;
    return u ? getOnbCheckpoint(u.uid) : null;
  });

  // A resumed invitee is still joining even though the spent token has been
  // stripped from the URL — otherwise a reload would drop them into flow A and
  // start them a second, separate session.
  const joining = !!invite || saved?.flow === "b";

  const [myName, setMyName] = useState(saved?.myName ?? "");
  const [partnerName, setPartnerName] = useState(saved?.partnerName ?? "");
  const [stage, setStage] = useState<OnbStage | null>(
    (saved?.stage as OnbStage) ?? null,
  );
  const [code, setCode] = useState(saved?.code ?? "");
  const [role, setRole] = useState<"host" | "guest">(saved?.role ?? "host");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [fallback, setFallback] = useState(false);
  // Deliberately asking to sign in (front door link) — same screen as the
  // anonymous-auth fallback, different framing, and it has a way back.
  const [signIn, setSignIn] = useState(false);

  const [stepA, setStepA] = useState<AStep>(
    saved?.flow === "a" ? (saved.step as AStep) : "welcome",
  );
  const [stepB, setStepB] = useState<BStep>(
    saved?.flow === "b" ? (saved.step as BStep) : "arrive",
  );
  const [initiatorName, setInitiatorName] = useState(saved?.initiatorName ?? "");
  const [bankedCount, setBankedCount] = useState(0);

  const partner = partnerName.trim() || t("your partner", "votre partenaire");

  const enter = useStepEnter(`${stage}|${stepA}|${stepB}|${signIn}|${fallback}`);

  // Save where we are, so a reload picks the flow back up instead of starting
  // a second session (initiator) or hitting a burnt token (invitee).
  const checkpoint = (
    flow: "a" | "b",
    step: string,
    extra: Partial<Parameters<typeof setOnbCheckpoint>[1]> = {},
  ) => {
    const u = auth.currentUser;
    if (!u) return;
    setOnbCheckpoint(u.uid, {
      flow,
      step,
      code: code || undefined,
      role,
      myName: myName.trim() || undefined,
      partnerName: partnerName.trim() || undefined,
      stage: stage ?? undefined,
      initiatorName: initiatorName || undefined,
      ...extra,
    });
  };

  // Onboarding is over: the session is the app's now, so the checkpoint goes.
  const finish = (slug?: string) => {
    const u = auth.currentUser;
    if (u) clearOnbCheckpoint(u.uid);
    onDone(code, slug);
  };

  // Anonymous sign-in with a timeout backstop; on failure, degrade to the
  // account screen rather than stranding anyone.
  const ensureUser = async () => {
    if (auth.currentUser) return auth.currentUser;
    try {
      const cred = await Promise.race([
        signInAnonymously(auth),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 12000)),
      ]);
      return cred.user;
    } catch {
      setFallback(true);
      return null;
    }
  };

  // Flow A: consent → create the session (answers need somewhere to live).
  const startFlowA = async () => {
    if (busy) return;
    setBusy(true);
    setErr("");
    const user = await ensureUser();
    if (!user) return setBusy(false);
    try {
      await recordConsent(user.uid);
      const c = await createSession(user.uid, myName.trim(), (stage ?? undefined) as Stage);
      setCode(c);
      setRole("host");
      // The seat exists from here on — record it immediately so a reload can
      // never strand these answers in an orphaned session.
      setActiveCode(user.uid, c);
      checkpoint("a", "questions", { code: c, role: "host" });
      setStepA("questions");
    } catch (e) {
      setErr(prettyError(e));
    } finally {
      setBusy(false);
    }
  };

  // Flow B: consent → join → read the initiator's banked count → answer.
  const startFlowB = async () => {
    if (busy || !invite) return;
    setBusy(true);
    setErr("");
    const user = await ensureUser();
    if (!user) return setBusy(false);
    try {
      await recordConsent(user.uid);
      // A /?t= link redeems a single-use token; the /?c= fallback link seats
      // by bare code. Both land the guest in the same seat.
      const res =
        invite.kind === "token"
          ? await redeemInvite({ token: invite.value })
          : await joinByCode({ code: invite.value });
      const c = res.data.code;
      setCode(c);
      setRole("guest");
      try {
        const snap = await get(ref(db, `sessions/${c}`));
        const val = snap.val() ?? {};
        setInitiatorName(val?.members?.host?.name ?? "");
        // The path screen after the reveal is stage-keyed — inherit the stage
        // the initiator set so the invitee sees the same tailored conversations.
        if (val?.stage) setStage(val.stage as OnbStage);
        const decks = (val.decks ?? {}) as Record<string, { answers?: Record<string, { host?: unknown }> }>;
        let n = 0;
        for (const s in decks)
          for (const qid in decks[s].answers ?? {})
            if (decks[s].answers![qid].host != null) n++;
        setBankedCount(n);
      } catch {
        /* count is a nicety */
      }
      setActiveCode(user.uid, c);
      checkpoint("b", "questions", { code: c, role: "guest" });
      // The token is single-use and now spent — drop it from the URL so a
      // reload can't re-enter the flow and fail on "already used".
      window.history.replaceState({}, "", window.location.pathname);
      setStepB("questions");
    } catch (e) {
      setErr(prettyError(e));
    } finally {
      setBusy(false);
    }
  };

  const shell = (children: React.ReactNode, onExit?: () => void, cls?: string) => (
    <section className={cls ? `${enter} ${cls}` : enter}>
      {onExit ? (
        <TopBar onExit={onExit} />
      ) : (
        <div className="brandhead">
          <Wordmark size={32} />
        </div>
      )}
      {children}
      {err && <div className="err">{err}</div>}
    </section>
  );

  if (fallback || signIn) {
    return (
      <section className={enter}>
        {signIn ? (
          <TopBar onExit={() => setSignIn(false)} />
        ) : (
          <div className="brandhead">
            <Wordmark size={32} />
          </div>
        )}
        <p className="sub center" style={{ margin: "14px 24px 0" }}>
          {signIn
            ? t("Welcome back: sign in to pick up where you left off.", "Bon retour, connectez-vous pour reprendre où vous en étiez.")
            : t(
                "Let's set up a quick account to save your answers.",
                "Créons un compte rapide pour enregistrer vos réponses.",
              )}
        </p>
        <AuthScreen />
      </section>
    );
  }

  // =========================================================================
  // FLOW B — the joiner: arrive → name → consent → answer → reveal
  // =========================================================================
  if (joining) {
    if (stepB === "arrive") {
      return shell(
        <>
          <div className="eyebrow center" style={{ marginTop: 30 }}>
            {t("You've been invited", "Vous êtes invité·e")}
          </div>
          <h1 className="h1 center" style={{ margin: "10px 24px 6px" }}>
            {t("Someone has started something.", "Quelqu'un a commencé quelque chose.")}
          </h1>
          <p className="sub serif center" style={{ fontStyle: "italic", margin: "10px 24px 26px" }}>
            {t(
              "It doesn't work without you. Answer the same questions and you'll see where you two land.",
              "Ça ne marche pas sans vous. Répondez aux mêmes questions et vous verrez où vous en êtes.",
            )}
          </p>
          <button className="btn pill" type="button" onClick={() => setStepB("name")}>
            {t("Catch up →", "Rattraper →")}
          </button>
        </>,
      );
    }
    if (stepB === "name") {
      return shell(
        <>
          <h1 className="h1 center" style={{ marginTop: 24 }}>
            {t("What should we call you?", "Comment doit-on vous appeler ?")}
          </h1>
          <label htmlFor="nm">{t("Your name", "Votre nom")}</label>
          <input
            className="input"
            id="nm"
            maxLength={20}
            value={myName}
            onChange={(e) => setMyName(e.target.value)}
            placeholder={t("e.g. Judah", "p. ex. Judah")}
          />
          <button className="btn pill" type="button" disabled={!myName.trim()} onClick={() => setStepB("consent")}>
            {t("Continue →", "Continuer →")}
          </button>
        </>,
        () => setStepB("arrive"),
      );
    }
    if (stepB === "consent") {
      return shell(
        <ConsentBody partner={partner} busy={busy} onStart={startFlowB} t={t} />,
        () => setStepB("name"),
      );
    }
    // questions → reveal → account → path (§ invitee, journey together)
    if (stepB === "questions") {
      return (
        <OnbQuestions
          code={code}
          role={role}
          t={t}
          partnerName={initiatorName || partner}
          heading={
            bankedCount > 0
              ? t(
                  `${initiatorName || partner} answered ${bankedCount}. Your turn.`,
                  `${initiatorName || partner} a répondu à ${bankedCount}. À vous.`,
                )
              : t("Your turn.", "À vous.")
          }
          onDone={() => (setStepB("reveal"), checkpoint("b", "reveal"))}
        />
      );
    }
    if (stepB === "reveal") {
      return (
        <RevealStep
          code={code}
          role={role}
          myName={myName.trim() || t("You", "Vous")}
          partnerName={initiatorName || partner}
          onDone={() => (setStepB("account"), checkpoint("b", "account"))}
          t={t}
        />
      );
    }
    if (stepB === "account") {
      // The account earns its keep here: they've seen the reveal, now they make
      // it theirs so the two of them can carry on together. NOT framed as
      // notifications — this is a shared journey, not solo pings (§collaborative).
      return (
        <ProfileStep
          partner={initiatorName || partner}
          name={myName.trim()}
          code={code}
          t={t}
          heading={t(
            "You're on this journey together now.",
            "Vous avancez ensemble désormais.",
          )}
          sub={t(
            "Set up your account so the two of you can carry on, choose where to go next and pick it back up any time.",
            "Créez votre compte pour continuer tous les deux, choisissez la suite et reprenez quand vous voulez.",
          )}
          onDone={() => (setStepB("path"), checkpoint("b", "path"))}
          onFallback={() => setFallback(true)}
        />
      );
    }
    // path — the same "Where would you like to start?" chooser the initiator gets
    return (
      <StartMenu
        stage={stage ?? "dating"}
        onPick={(slug) => finish(slug)}
        onSeeAll={() => finish()}
      />
    );
  }

  // =========================================================================
  // FLOW A — the initiator
  // =========================================================================
  if (stepA === "welcome") {
    return shell(
      <>
        <div className="obwelcome">
          <p className="verse serif center" style={{ marginTop: 24 }}>
            {t(
              "“Can two walk together, unless they are agreed?”",
              "« Deux hommes marchent-ils ensemble, sans s'être concertés ? »",
            )}
            <span className="verse-ref">Amos 3:3</span>
          </p>
          {/* Know, talk, walk. Three outcomes, ending where the verse above
              starts: the two of you moving toward agreement with Christ at the
              centre. Earlier versions sold the MECHANICS instead — turn-taking,
              answering apart, nothing opening until you both had. All true, and
              none of it a reason to start; framing separate answers as the draw
              made a collaborative app sound like a locked diary. */}
          <ul className="obfacts">
            <li>{t("Get to know each other better.", "Apprenez à mieux vous connaître.")}</li>
            <li>{t("Talk through the things that matter most.", "Parlez de ce qui compte le plus.")}</li>
            <li>{t("Walk toward agreement together, with Christ at the centre.", "Avancez ensemble vers l'accord, avec le Christ au centre.")}</li>
          </ul>
        </div>
        <button className="btn pill" type="button" onClick={() => setStepA("names")}>
          {t("Start", "Commencer")}
        </button>
        {/* The way back in. Without this an existing user on a new device could
            only press Start, which mints a fresh anonymous user and a second
            session — their real one unreachable, and the account gate later
            failing with "that email already has an account" and nowhere to go. */}
        <button className="btn ghost" type="button" onClick={() => setSignIn(true)}>
          {t("Already have an account? Sign in", "Vous avez déjà un compte ? Connectez-vous")}
        </button>
      </>,
      undefined,
      "obwel",
    );
  }

  if (stepA === "names") {
    return shell(
      <>
        <h1 className="h1 center" style={{ marginTop: 22 }}>
          {t("What should we call you?", "Comment doit-on vous appeler ?")}
        </h1>
        <label htmlFor="me">{t("Your name", "Votre nom")}</label>
        <input className="input" id="me" maxLength={20} value={myName} onChange={(e) => setMyName(e.target.value)} placeholder={t("e.g. Sarah", "p. ex. Sarah")} />
        <label htmlFor="them">{t("And who are you doing this with?", "Et avec qui faites-vous ceci ?")}</label>
        <input className="input" id="them" maxLength={20} value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder={t("e.g. Judah", "p. ex. Judah")} />
        <button className="btn pill" type="button" disabled={!myName.trim() || !partnerName.trim()} onClick={() => setStepA("stage")}>
          {t("Continue →", "Continuer →")}
        </button>
      </>,
      () => setStepA("welcome"),
    );
  }

  if (stepA === "stage") {
    return shell(
      <>
        <h1 className="h1 center" style={{ marginTop: 24 }}>
          {t("Where are you two right now?", "Où en êtes-vous tous les deux ?")}
        </h1>
        <div className="stagegrid" style={{ marginTop: 20, gridTemplateColumns: "1fr" }}>
          {ONB_STAGES.map((s) => (
            <button key={s.key} type="button" className={`stagechip ${stage === s.key ? "on" : ""}`} onClick={() => setStage(s.key)} aria-pressed={stage === s.key}>
              {t(s.en, s.fr)}
            </button>
          ))}
        </div>
        <button className="btn pill" type="button" disabled={!stage} onClick={() => setStepA("consent")}>
          {t("Continue →", "Continuer →")}
        </button>
      </>,
      () => setStepA("names"),
    );
  }

  if (stepA === "consent") {
    return shell(
      <ConsentBody partner={partner} busy={busy} onStart={startFlowA} t={t} />,
      () => setStepA("stage"),
    );
  }

  if (stepA === "questions") {
    return (
      <OnbQuestions
        code={code}
        role={role}
        t={t}
        partnerName={partner}
        heading={t("A few to start with.", "Quelques-unes pour commencer.")}
        onDone={() => (setStepA("profile"), checkpoint("a", "profile"))}
      />
    );
  }

  if (stepA === "profile") {
    return (
      <ProfileStep
        partner={partner}
        name={myName.trim()}
        code={code}
        t={t}
        onDone={() => (setStepA("invite"), checkpoint("a", "invite"))}
        onFallback={() => setFallback(true)}
      />
    );
  }

  if (stepA === "invite") {
    return (
      <InviteStep
        code={code}
        partner={partner}
        myName={myName.trim()}
        t={t}
        onContinue={() => (setStepA("menu"), checkpoint("a", "menu"))}
      />
    );
  }

  // A7 — "where would you like to start?" (spec §A7 / decision #3: reuse this as
  // the Path). It renders alternatives with real questions; picking one enters
  // the app.
  return (
    <StartMenu
      stage={stage ?? "dating"}
      onPick={(slug) => finish(slug)}
      onSeeAll={() => finish()}
    />
  );
}

// ---- Article 9 consent — two ticks, never one (spec v2 §2) ----------------
function ConsentBody({
  partner,
  busy,
  onStart,
  t,
}: {
  partner: string;
  busy: boolean;
  onStart: () => void;
  t: T;
}) {
  const [terms, setTerms] = useState(false);
  const [faith, setFaith] = useState(false);
  return (
    <>
      <h1 className="h1 center" style={{ marginTop: 22 }}>
        {t("Before we start.", "Avant de commencer.")}
      </h1>
      <p className="sub center" style={{ margin: "8px 24px 4px" }}>
        {t(
          "Because TwoAgree is about faith and marriage, we need your clear okay before we keep anything you write.",
          "Comme TwoAgree touche à la foi et au mariage, nous avons besoin de votre accord clair avant de conserver ce que vous écrivez.",
        )}
      </p>
      <p className="sub serif center" style={{ fontStyle: "italic", margin: "10px 24px 14px", color: "var(--berry)" }}>
        {t(
          "This won't tell you whether to get married. It'll tell you what you haven't talked about.",
          "Ceci ne vous dira pas s'il faut vous marier. Cela vous dira ce dont vous n'avez pas parlé.",
        )}
      </p>
      <label className="consent">
        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
        <span>
          {t("I accept the ", "J'accepte les ")}
          <a className="link" href="/terms.html" target="_blank" rel="noreferrer">
            {t("Terms & Conditions", "Conditions générales")}
          </a>
        </span>
      </label>
      <label className="consent">
        <input type="checkbox" checked={faith} onChange={(e) => setFaith(e.target.checked)} />
        <span>
          {t(
            `I agree TwoAgree can save my answers about my faith and my relationship, so that ${partner} and I can see where we align once we've both answered.`,
            `J'accepte que TwoAgree conserve mes réponses sur ma foi et ma relation, afin que ${partner} et moi puissions voir où nous nous rejoignons une fois que nous aurons tous deux répondu.`,
          )}
        </span>
      </label>
      <button
        className={busy ? "btn pill busy" : "btn pill"}
        type="button"
        disabled={!terms || !faith || busy}
        onClick={onStart}
      >
        {busy ? t("One moment…", "Un instant…") : t("Start →", "Commencer →")}
      </button>
    </>
  );
}

// ---- Answer + predict-your-partner sequence --------------------------------
function OnbQuestions({
  code,
  role,
  heading,
  partnerName,
  onDone,
  t,
}: {
  code: string;
  role: "host" | "guest";
  heading: string;
  partnerName: string;
  onDone: () => void;
  t: T;
}) {
  const [idx, setIdx] = useState(0);
  const [pend, setPend] = useState<number | null>(null);
  const [pendGuess, setPendGuess] = useState<number | null>(null);
  const [guessing, setGuessing] = useState(false);
  const [busy, setBusy] = useState(false);
  const q = STARTER_QS[idx];
  const last = idx + 1 >= STARTER_QS.length;
  const guessable = !!q && q.guessable && q.type !== "open";
  // Arrival on the first question only; the other ~9 answer/guess screens are
  // steps, and the question card carries its own glide.
  const enter = useStepEnter(`${idx}|${guessing}`);

  // Move to the next question, or finish the level. Called from the answer step
  // (non-guessable questions) and from the guess step (lock or skip).
  const advance = async () => {
    if (last) {
      setBusy(true);
      await markLevelDone(code, STARTER_SLUG, 0, role);
      onDone();
      return;
    }
    setPend(null);
    setPendGuess(null);
    setGuessing(false);
    setIdx((i) => i + 1);
  };

  const submitAnswer = async () => {
    if (pend == null || busy || !q) return;
    setBusy(true);
    await writeAnswer(code, STARTER_SLUG, q.id, role, pend);
    setBusy(false);
    // Guessable → predict the partner before advancing; otherwise move on.
    if (guessable) {
      setPendGuess(null);
      setGuessing(true);
    } else {
      await advance();
    }
  };

  const lockGuess = async () => {
    if (pendGuess == null || busy || !q) return;
    setBusy(true);
    await writeGuess(code, STARTER_SLUG, q.id, role, pendGuess);
    setBusy(false);
    await advance();
  };

  if (!q) {
    onDone();
    return null;
  }

  // Shared input — the scale orbs / MC options, reused by answer and guess steps.
  const input = (value: number | null, onPick: (i: number) => void, guess?: boolean) =>
    q.type === "scale" ? (
      <>
        <div className="slabels">
          <span>{q.lo}</span>
          <span style={{ textAlign: "right" }}>{q.hi}</span>
        </div>
        <div className="scale">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              aria-pressed={value === i}
              className={`orb ${value === i ? "sel" : ""}`}
              onClick={() => onPick(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </>
    ) : (
      <div style={{ marginTop: 4 }} role="group" aria-label={q.q}>
        {q.opts?.map((o, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={value === i}
            className={`opt ${guess ? "guess" : ""} ${value === i ? "sel" : ""}`}
            onClick={() => onPick(i)}
          >
            {o}
            <span className="dot" />
          </button>
        ))}
      </div>
    );

  const progress = (
    <div className="qprog">
      <i style={{ width: `${Math.round(((idx + 1) / STARTER_QS.length) * 100)}%` }} />
    </div>
  );

  // ---- Guess step: predict the partner's answer ----
  if (guessing) {
    const yourText = q.type === "scale" ? `${pend} / 5` : q.opts?.[pend as number];
    return (
      <section className={enter}>
        <div className="brandhead">
          <Mark height={30} title="TwoAgree" colour="var(--berry)" />
        </div>
        {progress}
        <div
          key={`${q.id}-guess`}
          className="qcard pane-in"
          style={{ marginTop: 12, borderColor: "var(--app-honey-line)" }}
        >
          <div className="qrow">
            <div className="eyebrow">{t("YOUR GUESS", "VOTRE INTUITION")}</div>
            <span className="badge honey">&#10022; {t("GUESS", "DEVINEZ")}</span>
          </div>
          <div className="qtext">{q.q}</div>
          <div className="yousaid">
            <div>
              <div className="eyebrow" style={{ fontSize: 10 }}>
                {t("YOU SAID", "VOUS AVEZ DIT")}
              </div>
              <div className="yousaid-val">{yourText}</div>
            </div>
          </div>
          <p style={{ margin: "18px 0 14px", fontWeight: 600 }}>
            {t("Now: what will ", "Maintenant : que va répondre ")}
            <span style={{ color: "var(--amber)" }}>{partnerName}</span>
            {t(" say?", " ?")}
          </p>
          {input(pendGuess, setPendGuess, true)}
        </div>
        <button
          className="btn honey"
          type="button"
          disabled={pendGuess == null || busy}
          onClick={lockGuess}
        >
          {t("Lock it in →", "Je valide →")}
        </button>
        <button className="btn ghost" type="button" onClick={() => void advance()} disabled={busy}>
          {t("Skip", "Passer")}
        </button>
      </section>
    );
  }

  // ---- Answer step ----
  return (
    <section className={enter}>
      <div className="brandhead">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>
      {progress}
      <p className="muted center" style={{ fontSize: 13, marginTop: 12 }}>{heading}</p>
      <div key={q.id} className="qcard glide-in" style={{ marginTop: 12 }}>
        <div className="qtext">{q.q}</div>
        {input(pend, setPend)}
      </div>
      <button className="btn" type="button" disabled={pend == null || busy} onClick={submitAnswer}>
        {guessable
          ? t("Next →", "Suivant →")
          : last
            ? t("Done →", "Terminé →")
            : t("Next →", "Suivant →")}
      </button>
      <div className="hint">{t(`${idx + 1} OF ${STARTER_QS.length}`, `${idx + 1} SUR ${STARTER_QS.length}`)}</div>
    </section>
  );
}

// ---- Flow B reveal: the invitee sees where the two of them landed on the
// warm-ups (the payoff), before being asked to make it theirs with an account.
// Both partners have answered by now, so the level-0 ceremony is ready; we read
// the warm-up deck once and hand it to the shared RevealScreen.
function RevealStep({
  code,
  role,
  myName,
  partnerName,
  onDone,
  t,
}: {
  code: string;
  role: "host" | "guest";
  myName: string;
  partnerName: string;
  onDone: () => void;
  t: T;
}) {
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let live = true;
    get(ref(db, `sessions/${code}/decks/${STARTER_SLUG}`))
      .then((snap) => {
        if (!live) return;
        setDeck((snap.val() ?? {}) as DeckData);
        setLoaded(true);
      })
      .catch(() => {
        if (live) setLoaded(true);
      });
    return () => {
      live = false;
    };
  }, [code]);

  if (!loaded) {
    return (
      <section className="pane-in">
        <div className="spin" />
        <p className="muted center" style={{ fontSize: 14 }}>
          {t("Bringing it together…", "On rassemble tout…")}
        </p>
      </section>
    );
  }
  return (
    <RevealScreen
      slug={STARTER_SLUG}
      level={0}
      role={role}
      deck={deck ?? {}}
      myName={myName}
      partnerName={partnerName}
      onDone={onDone}
    />
  );
}

// ---- Create your profile at the invite gate (email/pw or Google + photo) --
function ProfileStep({
  partner,
  name,
  code,
  onDone,
  onFallback,
  t,
  heading,
  sub,
}: {
  partner: string;
  name: string;
  code: string;
  onDone: () => void;
  onFallback: () => void;
  t: T;
  heading?: string;
  sub?: string;
}) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const finish = async (emailUsed?: string) => {
    const u = auth.currentUser;
    if (u) await writeProfile(u.uid, { name, email: emailUsed, photo: photo ?? undefined });
    onDone();
  };

  const withEmail = async () => {
    if (!email.trim() || pw.length < 6 || busy) return;
    setBusy(true);
    setErr("");
    try {
      const u = auth.currentUser;
      if (!u) return onFallback();
      await linkWithCredential(u, EmailAuthProvider.credential(email.trim(), pw));
      await finish(email.trim());
    } catch (e) {
      setErr(prettyError(e));
      setBusy(false);
    }
  };

  // Link the anonymous onboarding user onto an OAuth provider — Google, or
  // Apple on native iOS. Same graft either way: the anonymous uid is kept, so
  // the session seat and consent already written under it stay valid.
  const withProvider = async (link: (u: import("firebase/auth").User) => Promise<import("firebase/auth").UserCredential>) => {
    if (busy) return;
    setBusy(true);
    setErr("");
    try {
      const u = auth.currentUser;
      if (!u) return onFallback();
      const res = await link(u);
      await finish(res.user.email ?? undefined);
    } catch (e) {
      setErr(prettyError(e));
      setBusy(false);
    }
  };

  const withGoogle = () => withProvider(linkWithGoogleSmart);
  const withApple = () => withProvider(linkWithAppleSmart);

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await fileToAvatarDataUrl(file));
    } catch {
      /* ignore — photo is optional */
    }
  };

  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  void code;
  return (
    <section className="pane-in">
      <div className="brandhead">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>
      <h1 className="h1 center" style={{ marginTop: 16 }}>
        {heading ??
          t(`Set up your profile to invite ${partner}.`, `Créez votre profil pour inviter ${partner}.`)}
      </h1>
      {/* This promised "this is how we let you know when they answer" — there
          is no notification channel in the app: no push, no email, no badge.
          The account's real job here is keeping the answers, which is true. */}
      <p className="sub center" style={{ margin: "8px 24px 10px" }}>
        {sub ??
          t(
            "It keeps your answers safe and lets you pick this back up on any device.",
            "Il garde vos réponses en sécurité et vous permet de reprendre sur n’importe quel appareil.",
          )}
      </p>

      <div className="avatarwrap" style={{ marginTop: 6 }}>
        <div className="avatar" style={{ width: 76, height: 76 }}>
          {photo ? <img src={photo} alt="" /> : initial}
        </div>
        <label className="photobtn" style={{ cursor: "pointer" }}>
          {photo ? t("Change photo", "Changer la photo") : t("Add a photo (optional)", "Ajouter une photo (facultatif)")}
          <input type="file" accept="image/*" hidden onChange={onPhoto} />
        </label>
      </div>

      <button className="btn out google" type="button" onClick={withGoogle} disabled={busy} style={{ marginTop: 14 }}>
        {t("Continue with Google", "Continuer avec Google")}
      </button>
      {/* Apple linking — native iOS only (App Review 4.8 when Google is shown). */}
      {appleAuthAvailable() && (
        <button className="btn out apple" type="button" onClick={withApple} disabled={busy} style={{ marginTop: 12 }}>
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

      <label htmlFor="oe">{t("Email", "E-mail")}</label>
      <input className="input" id="oe" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <label htmlFor="op">{t("Password", "Mot de passe")}</label>
      <input className="input" id="op" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder={t("At least 6 characters", "Au moins 6 caractères")} />
      {err && <div className="err">{err}</div>}
      <button className={busy ? "btn pill busy" : "btn pill"} type="button" disabled={!email.trim() || pw.length < 6 || busy} onClick={withEmail}>
        {busy ? t("One moment…", "Un instant…") : t("Create profile →", "Créer le profil →")}
      </button>
    </section>
  );
}

// ---- The invite: editable draft + share link (spec v2 §A4) ----------------
function InviteStep({
  code,
  partner,
  myName,
  onContinue,
  t,
}: {
  code: string;
  partner: string;
  myName: string;
  onContinue: () => void;
  t: T;
}) {
  const [msg, setMsg] = useState(
    t(
      `${partner}, I've started something for the two of us on TwoAgree. We each answer the same questions honestly, then talk through where we landed. It only works with you in it, about five minutes: `,
      `${partner}, j'ai commencé quelque chose pour nous deux sur TwoAgree. On répond chacun aux mêmes questions, honnêtement, puis on parle de là où on en est. Ça ne marche qu'avec toi, environ cinq minutes : `,
    ),
  );
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const send = async () => {
    setBusy(true);
    setStatus("");
    let link = "";
    try {
      const res = await createInvite({ code });
      link = `${window.location.origin}/?t=${res.data.token}`;
    } catch {
      // Fallback: the bare-code link. This used to be a dead URL — nothing in
      // the app read `c`, so the partner landed on the front door with no join
      // context and could start a SECOND session. invite.ts reads it now.
      link = `${window.location.origin}/?c=${code}`;
    }
    const text = `${msg}${link}`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        setStatus(t("Invitation sent.", "Invitation envoyée."));
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setStatus(t("Copied: paste it to ", "Copié : collez-le à ") + partner);
      }
    } catch {
      // The share sheet was dismissed — say nothing rather than claim it sent.
    }
    setBusy(false);
  };

  void myName;
  return (
    <section className="pane-in">
      <div className="brandhead">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>
      <h1 className="h1 center" style={{ marginTop: 16 }}>
        {t(`Now bring ${partner} in.`, `Faites venir ${partner}.`)}
      </h1>
      <p className="sub center" style={{ margin: "8px 24px 6px" }}>
        {t("You've answered: now they can see where you two land. Send them this:", "Vous avez répondu, ils peuvent maintenant voir où vous en êtes. Envoyez-leur ceci :")}
      </p>
      <textarea className="input" style={{ minHeight: 96 }} value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={220} />
      <button className={busy ? "btn pill busy" : "btn pill"} type="button" onClick={send} disabled={busy}>
        {busy ? t("One moment…", "Un instant…") : t(`Send ${partner} the link →`, `Envoyer le lien à ${partner} →`)}
      </button>
      {status && <div className="ok center">{status}</div>}
      <button className="btn ghost" type="button" onClick={onContinue}>
        {t("I'll do that in a moment", "Je le ferai dans un instant")}
      </button>
    </section>
  );
}

