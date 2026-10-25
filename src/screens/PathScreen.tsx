import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { get, ref } from "firebase/database";
import { db } from "../firebase";
import type { Role } from "../lib/scoring";
import type { Session } from "../types";
import {
  pathReady,
  pathPartial,
  orderedSteps,
  stepMeta,
  journeyStats,
  journeyDeck,
  type Waypoint as JourneyWaypoint,
} from "../lib/path";
import { INTAKE, VERSES, type IntakeQuestion } from "../data/path.generated";
import { writeIntake } from "../lib/session";
import { readIntakeDraft, writeIntakeDraft, clearIntakeDraft } from "../lib/local";
import { generatePath } from "../lib/functions";
import { Mark } from "../brand/Mark";
import { ShareCard } from "./CoreScore";
import { shareTopic } from "../lib/shareTopic";
import { useLang, useT } from "../lib/i18n";
import PathStep from "./PathStep";
import { PathMap } from "./PathMap";
import RevealScreen from "./RevealScreen";
import { PathScene } from "../components/PathScene";
import { ScoreRings } from "../components/ScoreRings";
import { IconClose } from "../components/icons";
import { Loading } from "../components/Loading";

type T = (en: string, fr: string) => string;

// The Path tab. Routes: private intake → waiting for the path to lay → the trail
// map → a step → The Lookout. Generation runs server-side (generatePath); this
// screen only triggers it and reads the result live via the session listener.
export default function PathScreen({
  code,
  session,
  role,
  user,
  partnerName,
  onBrowseDecks,
  onOpenStep,
}: {
  code: string;
  session: Session;
  role: Role;
  user: User;
  partnerName: string;
  onBrowseDecks: () => void;
  // Opening a step hands off to a full-screen flow in SessionApp (no bottom nav),
  // the same way deck play/reveal do.
  onOpenStep: (index: number) => void;
}) {
  const t = useT();
  const [intakeDone, setIntakeDone] = useState<boolean | null>(null);
  const ready = pathReady(session);

  // My own intake is author-only (rules) so I read it directly, not via the
  // session. I never read my partner's — the path's mere existence tells me
  // they're done, nothing about what they answered.
  useEffect(() => {
    let live = true;
    get(ref(db, `intake/${user.uid}`))
      .then((snap) => live && setIntakeDone(!!snap.val()))
      .catch(() => live && setIntakeDone(false));
    return () => {
      live = false;
    };
  }, [user.uid]);

  // Once my intake is in but the path isn't laid (or only its Trailhead is),
  // nudge the generator. It's generate-once and reads both intakes
  // server-side, so calling it whenever either partner lands here is safe:
  // whoever finishes second lays the rest of the path.
  const partial = pathPartial(session);
  useEffect(() => {
    if (intakeDone && (!ready || partial)) void generatePath({ code }).catch(() => {});
  }, [intakeDone, ready, partial, code]);

  if (intakeDone === null) {
    return <Loading label={t("Checking your path", "Vérification de votre chemin")} />;
  }

  if (!intakeDone) {
    return (
      <PathIntake
        uid={user.uid}
        code={code}
        // Onboarding already asked where you are as a couple (item 14).
        skipStage={!!session.stage}
        onBrowseDecks={onBrowseDecks}
        onDone={() => setIntakeDone(true)}
        t={t}
      />
    );
  }

  // Your path questions are in: the server lays the Trailhead at once (and the
  // rest once your partner's are in too), so this is only ever a moment.
  if (!ready) {
    return <Loading label={t("Laying your path", "Votre chemin se trace")} onBack={onBrowseDecks} backLabel={t("Browse the conversations", "Parcourir les conversations")} />;
  }

  return (
    <PathMap
      session={session}
      role={role}
      partnerName={partnerName}
      onOpen={onOpenStep}
      t={t}
    />
  );
}

// The full-screen step flow, rendered by SessionApp (no bottom nav). Resolves a
// waypoint index to its step, or The Lookout finale when the index has no data.
export function PathFlow({
  code,
  role,
  session,
  index,
  myName,
  partnerName,
  onExit,
}: {
  code: string;
  role: Role;
  session: Session;
  index: number;
  myName: string;
  partnerName: string;
  onExit: () => void;
}) {
  const t = useT();
  const found = orderedSteps(session).find((s) => s.index === index);
  if (found) {
    return (
      <PathStep
        code={code}
        role={role}
        session={session}
        index={found.index}
        step={found.data}
        myName={myName}
        partnerName={partnerName}
        onExit={onExit}
      />
    );
  }
  return (
    <Lookout
      code={code}
      session={session}
      role={role}
      myName={myName}
      partnerName={partnerName}
      onBack={onExit}
      t={t}
    />
  );
}

// ---- The Path intro: claret hero → a journey that ends at the payoff -------
// Three waypoints on a lit trail: what it is, what makes it theirs, and — the
// destination — the alignment they walk away with. Collaborative by design
// (a shared alignment, never "you beat your partner"; brief §1 "no winner").
const NodeStart = () => (
  <svg viewBox="0 0 40 40" width={38} height={38} aria-hidden="true">
    <circle cx={20} cy={20} r={19} fill="var(--honey)" opacity={0.14} />
    <circle cx={20} cy={20} r={14} fill="var(--honey)" stroke="var(--honey)" strokeWidth={2} />
    <path d="M20 12.5a4.6 4.6 0 0 0-2.4 8.5v2h4.8v-2A4.6 4.6 0 0 0 20 12.5Z" fill="none" stroke="var(--berry)" strokeWidth={1.6} />
    <path d="M17.9 25.4h4.2" stroke="var(--berry)" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);
const NodeStep = () => (
  <svg viewBox="0 0 40 40" width={38} height={38} aria-hidden="true">
    <circle cx={20} cy={20} r={13.5} fill="#fff" stroke="var(--app-orb-line)" strokeWidth={2} />
    <circle cx={20} cy={20} r={3.4} fill="var(--app-orb-line)" />
  </svg>
);
const NodeEnd = () => (
  <svg viewBox="0 0 40 40" width={38} height={38} aria-hidden="true">
    <circle cx={20} cy={20} r={19} fill="var(--ta-honey)" opacity={0.18} />
    <circle cx={20} cy={20} r={14} fill="var(--berry)" stroke="var(--ta-honey)" strokeWidth={2} />
    <path d="M20 13v14" stroke="var(--ta-honey)" strokeWidth={1.7} strokeLinecap="round" />
    <path d="M20 13.5c2.6 0 3.2 1.8 5.4 1.8v4.2c-2.2 0-2.8-1.8-5.4-1.8Z" fill="var(--ta-honey)" />
  </svg>
);

export function PathIntro({
  onBegin,
  onBrowseDecks,
  t,
}: {
  onBegin: () => void;
  onBrowseDecks: () => void;
  t: T;
}) {
  const steps: { node: ReactNode; end?: boolean; h: string; s: string }[] = [
    {
      node: <NodeStart />,
      h: t("A journey together", "Un chemin à deux"),
      s: t(
        "Ten steps, side by side, from light ground to the deepest questions.",
        "Dix étapes, côte à côte, du terrain léger aux questions les plus profondes.",
      ),
    },
    {
      node: <NodeStep />,
      h: t("Shaped by the two of you", "Façonné par vous deux"),
      s: t(
        "Each step is drawn from what you both say matters, tailored to where you are now.",
        "Chaque étape naît de ce qui compte pour vous deux, adaptée à là où vous en êtes.",
      ),
    },
    {
      node: <NodeEnd />,
      end: true,
      h: t("Where the two of you land", "Où vous vous retrouvez"),
      s: t(
        "You arrive at your alignment, how much you agree, how well you know each other, and what's worth talking about.",
        "Vous arrivez à votre accord, à quel point vous vous rejoignez, vous vous connaissez, et ce qui mérite d'être discuté.",
      ),
    },
  ];

  return (
    // Airy layout, sized to the viewport so the "Begin" button is in view
    // without scrolling (min-height fills the tab area; the CTA sits at the
    // bottom via margin-top:auto).
    <section className="screen-enter path-intro">
      <div className="pi-head">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>

      <div className="pi-top">
        <h1 className="pi-title">{t("The Path", "Le Chemin")}</h1>
        <p className="pi-verse">
          {t("“Can two walk together, unless they are agreed?”", "« Deux marchent-ils ensemble sans s'être accordés ? »")}
        </p>
        <p className="pi-vref">Amos 3:3</p>
      </div>

      <ol className="pi-trail">
        {steps.map((st, i) => (
          <li key={i} className={`pi-step${st.end ? " pi-end" : ""}`}>
            <span className="pi-node">{st.node}</span>
            <span className="pi-txt">
              <b>{st.h}</b>
              <i>{st.s}</i>
            </span>
          </li>
        ))}
      </ol>

      {/* This was a padlock and "neither of you sees the other's until you
          land". It sold separateness as the feature on the screen that sells
          the Path. The line still has to explain why the CTA says "my part",
          so it says the collaborative version of the same thing. */}
      <p className="pi-privacy">
        {t(
          `You each shape it from your side, then walk it together.`,
          `Vous le façonnez chacun de votre côté, puis vous le parcourez ensemble.`,
        )}
      </p>

      <div className="pi-cta">
        <button className="btn pill" type="button" onClick={onBegin}>
          {t("Begin my part", "Commencer ma part")}
        </button>
        <button className="btn ghost" type="button" onClick={onBrowseDecks}>
          {t("Browse the conversations instead", "Parcourir les conversations plutôt")}
        </button>
      </div>
    </section>
  );
}

// ---- Private intake (8 questions) ------------------------------------------
function PathIntake({
  uid,
  code,
  skipStage,
  onBrowseDecks,
  onDone,
  t,
}: {
  uid: string;
  code: string;
  skipStage: boolean;
  onBrowseDecks: () => void;
  onDone: () => void;
  t: T;
}) {
  // The intake lives below a `key={tab}` remount, so switching to Decks and
  // back silently threw away every answer — eight private questions, gone,
  // with no warning. Draft state is mirrored into sessionStorage so a tab
  // switch (or a reload mid-intake) resumes exactly where they were.
  const QS = useMemo(() => (skipStage ? INTAKE.filter((q) => q.id !== "stage") : INTAKE), [skipStage]);
  const draft = useMemo(() => {
    const d = readIntakeDraft(uid);
    // A draft from before the stage question was skipped doesn't line up.
    return d && d.ans.length === QS.length ? d : null;
  }, [uid, QS]);
  const [started, setStarted] = useState(draft != null);
  const [idx, setIdx] = useState(draft?.idx ?? 0);
  const [ans, setAns] = useState<(number | number[] | null)[]>(
    draft?.ans ?? QS.map((q) => (q.type === "multi" ? [] : null)),
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (started) writeIntakeDraft(uid, { idx, ans });
  }, [uid, started, idx, ans]);

  if (!started) {
    return <PathIntro onBegin={() => setStarted(true)} onBrowseDecks={onBrowseDecks} t={t} />;
  }

  const q: IntakeQuestion = QS[idx];
  const a = ans[idx];
  const canNext = q.type === "multi" ? (a as number[]).length > 0 : a !== null;

  const pick = (oi: number) => {
    setAns((prev) => {
      const next = [...prev];
      if (q.type === "single") {
        next[idx] = oi;
      } else {
        let arr = [...((prev[idx] as number[]) ?? [])];
        const label = q.opts[oi];
        if (q.excl && label === q.excl) {
          arr = arr.includes(oi) ? [] : [oi];
        } else {
          arr = arr.filter((x) => q.opts[x] !== q.excl);
          if (arr.includes(oi)) arr = arr.filter((x) => x !== oi);
          else if (!(q.cap && arr.length >= q.cap)) arr.push(oi);
        }
        next[idx] = arr;
      }
      return next;
    });
  };

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    const answers: Record<string, number | number[]> = {};
    QS.forEach((iq, i) => {
      const v = ans[i];
      if (v != null) answers[iq.id] = v;
    });
    await writeIntake(uid, answers);
    clearIntakeDraft(uid);
    // Kick generation now that my part is in (it waits for both intakes).
    void generatePath({ code }).catch(() => {});
    setBusy(false);
    onDone();
  };

  return (
    <section className="screen-enter">
      <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
        {/* .badge is nowrap by design (so "TIER 2" can't blob), but this one
            carries a sentence and the French runs longer than a 375px phone.
            Wrap it, and drop the pill tracking so two lines read as prose. */}
        <span
          className="badge"
          style={{
            background: "var(--blush)",
            color: "var(--berry)",
            fontWeight: 700,
            whiteSpace: "normal",
            letterSpacing: 0.2,
            lineHeight: 1.35,
            maxWidth: 300,
            textAlign: "center",
          }}
        >
          {/* Was a padlock and "{partner} won't see this". The intake really is
              author-only, but leading with a lock made a shared journey look
              like a secret kept from the person you're walking it with. Same
              fact, told as its purpose: it's what the Path is built from. */}
          {t("Just for you: this shapes the path you walk together", "Rien que pour vous : cela façonne le chemin que vous parcourez ensemble")}
        </span>
      </div>
      {/* (idx+1)/, not idx/ — the bar sat at 0% while the label already said
          "1 of 8", so the first question looked like nothing had started. */}
      <div className="qprog" style={{ marginTop: 14 }}>
        <i style={{ width: `${Math.round(((idx + 1) / QS.length) * 100)}%` }} />
      </div>
      <p className="hint">{t(`${idx + 1} of ${QS.length}`, `${idx + 1} sur ${QS.length}`)}</p>
      <h1 className="h1" style={{ marginTop: 14, fontSize: 24 }}>{q.q}</h1>
      {q.hint && <p className="sub" style={{ marginTop: 6 }}>{q.hint}</p>}
      <div style={{ marginTop: 16 }}>
        {q.opts.map((o, oi) => {
          const sel = q.type === "multi" ? (a as number[]).includes(oi) : a === oi;
          return (
            <button
              key={oi}
              type="button"
              aria-pressed={sel}
              className={`opt ${sel ? "sel" : ""}`}
              onClick={() => pick(oi)}
            >
              {o}
              <span className="dot" />
            </button>
          );
        })}
      </div>
      <button
        className={busy ? "btn busy" : "btn"}
        type="button"
        disabled={!canNext || busy}
        onClick={() => (idx === QS.length - 1 ? finish() : setIdx((i) => i + 1))}
      >
        {idx === QS.length - 1 ? t("Finish my part", "Terminer ma part") : t("Next →", "Suivant →")}
      </button>
      {idx > 0 && (
        <button className="btn ghost" type="button" onClick={() => setIdx((i) => i - 1)}>
          {t("Back", "Retour")}
        </button>
      )}
    </section>
  );
}

// ---- The Lookout — journey's end (item 14) ---------------------------------
// The same light scene as every step, the whole road's two rings, where you
// were closest and what's most worth a conversation, one verse, then Review
// our answers and the keepsake.
function Lookout({
  code,
  session,
  role,
  myName,
  partnerName,
  onBack,
  t,
}: {
  code: string;
  session: Session;
  role: Role;
  myName: string;
  partnerName: string;
  onBack: () => void;
  t: T;
}) {
  const lang = useLang();
  const meta = stepMeta("lookout");
  const verse = (VERSES["lookout"] ?? [])[0];
  const j = useMemo(() => journeyStats(session, role), [session, role]);
  const [keepsake, setKeepsake] = useState(false);
  const [review, setReview] = useState(false);

  if (review) {
    const { deck, qs } = journeyDeck(session);
    return (
      <RevealScreen
        slug="path"
        level={0}
        role={role}
        deck={deck}
        questions={qs}
        title={meta?.name ?? "The Lookout"}
        myName={myName}
        partnerName={partnerName}
        code={code}
        review
        onDone={() => setReview(false)}
      />
    );
  }

  return (
    <section className="screen-enter pstep">
      <div className="pstep-top">
        <span />
        <span />
        <button className="iconbtn" type="button" onClick={onBack} aria-label={t("Back to the Path", "Retour au Chemin")}>
          <IconClose size={22} />
        </button>
      </div>
      <PathScene stepKey="lookout" lit={j.walked} label={meta?.name ?? "The Lookout"} className="pstep-scene" />
      <p className="eyebrow center pstep-eyebrow">
        {t("Step 10 · Journey’s end", "Étape 10 · Fin du voyage")}
      </p>
      <h1 className="h1 center" style={{ margin: "2px 0 6px" }}>
        {meta?.name ?? "The Lookout"}
      </h1>
      <p className="helper center" style={{ margin: "0 12px" }}>
        {t(
          "You’ve walked the whole path together. Here’s where it brought you.",
          "Vous avez parcouru tout le chemin ensemble. Voici où il vous a menés.",
        )}
      </p>

      <ScoreRings agree={j.agreed} basis={j.scored} known={j.known} right={j.right} made={j.guesses} />

      {j.brightest && j.hardest && (
        <div className="lk-cards">
          <Waypoint wp={j.brightest} lb={t("Where you were closest", "Là où vous étiez le plus proches")} />
          <Waypoint wp={j.hardest} lb={t("Most worth a conversation", "À aborder en priorité")} />
        </div>
      )}

      {verse && (
        <blockquote className="pstep-verse">
          <p>“{verse.v}”</p>
          <cite>{verse.ref}</cite>
        </blockquote>
      )}

      <button className="btn pill" type="button" onClick={() => setReview(true)}>
        {t("Review our answers", "Revoir nos réponses")}
      </button>
      <button className="btn out" type="button" onClick={() => setKeepsake(true)}>
        {t("Take a keepsake", "Emporter un souvenir")}
      </button>

      {keepsake && (
        <ShareCard
          agreed={{ pct: j.agreed, done: j.scored, total: j.scoredTotal }}
          known={{ pct: j.known, done: j.right, total: j.guesses }}
          myName={myName}
          partnerName={partnerName}
          conversations={{ done: j.walked, total: j.total }}
          story={t("have walked the whole Path together", "ont parcouru tout le Chemin ensemble")}
          // A shared card never names a sensitive step (lib/shareTopic.ts).
          closest={j.brightest ? shareTopic(j.brightest.key, lang) : undefined}
          t={t}
          onClose={() => setKeepsake(false)}
        />
      )}
    </section>
  );
}

function Waypoint({ wp, lb }: { wp: JourneyWaypoint; lb: string }) {
  return (
    <div className="card lk-card">
      <span>
        <span className="eyebrow">{lb}</span>
        <span className="lk-card-nm">{wp.name}</span>
      </span>
      <span className="lk-card-pct">{wp.pct}%</span>
    </div>
  );
}
