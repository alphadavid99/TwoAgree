import { useMemo, useState } from "react";
import type { Question } from "../lib/questions";
import type { Role } from "../lib/scoring";
import type { Session, PathStepData } from "../types";
import {
  stepMeta,
  stepQuestions,
  stepDeckData,
  stepRevealable,
  deckOf,
  AT_TABLE_SLUG,
  orderedSteps,
  lampLit,
  pathPartial,
} from "../lib/path";
import { writeAnswer, writeGuess, lightLamp } from "../lib/session";
import { scaleText } from "../lib/answerWords";
import { PathScene } from "../components/PathScene";
import { IconClose } from "../components/icons";
import { PATH_STEPS } from "../data/path.generated";
import { optValue, withNames, type Names } from "../lib/who";
import type { AnswerValue } from "../lib/scoring";
import { PathGlyph } from "../components/PathGlyph";
import { TopBar } from "../components/TopBar";
import RevealScreen from "./RevealScreen";
import { useT } from "../lib/i18n";

type Phase = "arrival" | "play" | "reveal" | "walked";
type T = (en: string, fr: string) => string;

// One waypoint of the Path: arrival → play (the existing answer/guess engine) →
// reveal (the existing RevealScreen) → "You've walked it together" (item 14,
// in place of "Light the lamp"). A step is a sequencer;
// answers are written to each question's real deck, so nothing here is a new
// scoring path.
export default function PathStep({
  code,
  role,
  session,
  index,
  step,
  myName,
  partnerName,
  onExit,
}: {
  code: string;
  role: Role;
  session: Session;
  index: number;
  step: PathStepData;
  myName: string;
  partnerName: string;
  onExit: () => void;
}) {
  const t = useT();
  const meta = stepMeta(step.key);
  const qs = useMemo(() => stepQuestions(step), [step]);

  const answeredByMe = (q: Question): boolean => {
    if (q.type === "open") {
      return session.decks?.[AT_TABLE_SLUG]?.answers?.[step.key]?.[role] != null;
    }
    const slug = deckOf(q.id);
    return slug ? session.decks?.[slug]?.answers?.[q.id]?.[role] != null : false;
  };

  // Questions I still owe, frozen at step entry so my own answers don't shift the
  // list mid-play (the session updates live as I write). If none, I've already
  // walked this stretch → straight to the reveal.
  const [todo] = useState<Question[]>(() => qs.filter((q) => !answeredByMe(q)));
  const [phase, setPhase] = useState<Phase>(todo.length ? "arrival" : "reveal");

  if (!meta) return null;

  if (phase === "arrival") {
    return (
      <ArrivalScreen
        index={index}
        stepKey={step.key}
        name={meta.name}
        theme={meta.theme}
        verse={meta.verse}
        vref={meta.ref}
        frame={meta.frame}
        count={qs.length}
        guess={step.mechanic === "guess"}
        talk={qs.some((q) => q.type === "open")}
        lit={orderedSteps(session).filter((x) => lampLit(session, x.index)).length}
        onTake={() => setPhase("play")}
        onBack={onExit}
        t={t}
      />
    );
  }

  if (phase === "play") {
    return (
      <StepPlay
        code={code}
        role={role}
        step={step}
        stepName={meta.name}
        guessLayer={step.mechanic === "guess"}
        todo={todo}
        partnerName={partnerName}
        names={{
          host: role === "host" ? myName : partnerName,
          guest: role === "guest" ? myName : partnerName,
        }}
        onDone={() => setPhase("reveal")}
        onExit={onExit}
        t={t}
      />
    );
  }

  if (phase === "reveal") {
    if (!stepRevealable(session, step, role)) {
      return (
        <WaitingForPartner
          partnerName={partnerName}
          glyph={meta.glyph}
          onBack={onExit}
          t={t}
        />
      );
    }
    return (
      <RevealScreen
        slug={step.key}
        level={0}
        role={role}
        deck={stepDeckData(session, step)}
        pick={session.pathPick?.[String(index)]}
        shareKey={step.key}
        questions={qs}
        title={meta.name}
        myName={myName}
        partnerName={partnerName}
        code={code}
        onDone={() => {
          // Walked together: the step's lamp is the map's quiet marker.
          void lightLamp(code, index);
          setPhase("walked");
        }}
      />
    );
  }

  // walked
  const next = PATH_STEPS[index + 1];
  const nextLaid = orderedSteps(session).some((x) => x.index === index + 1) || (next?.key === "lookout" && !pathPartial(session));
  return (
    <WalkedScreen
      index={index}
      stepKey={step.key}
      name={meta.name}
      lit={orderedSteps(session).filter((x) => lampLit(session, x.index) || x.index === index).length}
      next={next ? { index: index + 1, key: next.key, name: next.name, theme: next.theme, laid: nextLaid } : null}
      partnerName={partnerName}
      onDone={onExit}
      t={t}
    />
  );
}

// ---- Arrival: a light screen with the step's scene (item 14) ----------------
// What it's about and what to expect, then the verse, then Take the step.
function ArrivalScreen({
  index,
  stepKey,
  name,
  theme,
  verse,
  vref,
  frame,
  count,
  guess,
  talk,
  lit,
  onTake,
  onBack,
  t,
}: {
  index: number;
  stepKey: string;
  name: string;
  theme: string;
  verse: string;
  vref: string;
  frame: string;
  count: number;
  guess: boolean;
  talk: boolean;
  lit: number;
  onTake: () => void;
  onBack: () => void;
  t: T;
}) {
  return (
    <section className="screen-enter pstep">
      <div className="pstep-top">
        <span />
        <span className="pstep-of">{t(`Step ${index + 1} of 10`, `Étape ${index + 1} sur 10`)}</span>
        <button className="iconbtn" type="button" onClick={onBack} aria-label={t("Back to the Path", "Retour au Chemin")}>
          <IconClose size={22} />
        </button>
      </div>
      <PathScene stepKey={stepKey} lit={lit} label={`${name}: ${theme}`} className="pstep-scene" />
      <p className="eyebrow pstep-eyebrow">{theme}</p>
      <h1 className="h1" style={{ margin: "2px 0 8px" }}>{name}</h1>
      <p className="pstep-frame">{frame}</p>
      <ul className="pstep-chips">
        <li>{t(`${count} question${count === 1 ? "" : "s"}`, `${count} question${count === 1 ? "" : "s"}`)}</li>
        {guess && <li>{t("A guess after each", "Une intuition après chacune")}</li>}
        {talk && <li>{t("One to talk about together", "Une à aborder ensemble")}</li>}
      </ul>
      <blockquote className="pstep-verse">
        <p>“{verse}”</p>
        <cite>{vref}</cite>
      </blockquote>
      <button className="btn pill" type="button" onClick={onTake}>
        {t("Take the step", "Faire ce pas")}
      </button>
      <button className="btn ghost" type="button" onClick={onBack}>
        {t("Back to the Path", "Retour au Chemin")}
      </button>
    </section>
  );
}

// ---- Play: answer + (optionally) predict, over the step's questions ---------
function StepPlay({
  code,
  role,
  step,
  stepName,
  guessLayer,
  todo,
  partnerName,
  names,
  onDone,
  onExit,
  t,
}: {
  code: string;
  role: Role;
  step: PathStepData;
  stepName: string;
  guessLayer: boolean;
  todo: Question[];
  partnerName: string;
  names: Names;
  onDone: () => void;
  onExit: () => void;
  t: T;
}) {
  const [idx, setIdx] = useState(0);
  const [pend, setPend] = useState<number | null>(null);
  const [pendText, setPendText] = useState("");
  const [pendGuess, setPendGuess] = useState<number | null>(null);
  const [guessing, setGuessing] = useState(false);
  const [busy, setBusy] = useState(false);

  // "Which of you" options carry both names; picks are stored as who (lib/who.ts).
  const q = todo[idx] ? withNames(todo[idx], names) : undefined;
  const stored = (v: number): AnswerValue => (q && q.type === "mc" ? optValue(q, v) : v);
  const last = idx + 1 >= todo.length;
  const isOpen = q?.type === "open";
  const guessable = !!q && guessLayer && q.guessable === true && !isOpen;

  const reset = () => {
    setPend(null);
    setPendText("");
    setPendGuess(null);
    setGuessing(false);
  };

  const advance = () => {
    if (last) return onDone();
    reset();
    setIdx((i) => i + 1);
  };

  const submitAnswer = async () => {
    if (busy || !q) return;
    if (isOpen) {
      if (!pendText.trim()) return;
      setBusy(true);
      await writeAnswer(code, AT_TABLE_SLUG, step.key, role, pendText.trim());
      setBusy(false);
      return advance();
    }
    if (pend == null) return;
    setBusy(true);
    const slug = deckOf(q.id)!;
    await writeAnswer(code, slug, q.id, role, stored(pend));
    setBusy(false);
    if (guessable) {
      setPendGuess(null);
      setGuessing(true);
    } else {
      advance();
    }
  };

  const lockGuess = async () => {
    if (pendGuess == null || busy || !q) return;
    setBusy(true);
    await writeGuess(code, deckOf(q.id)!, q.id, role, stored(pendGuess));
    setBusy(false);
    advance();
  };

  if (!q) {
    onDone();
    return null;
  }

  const progress = (
    <div className="qprog">
      <i style={{ width: `${Math.round(((idx + 1) / todo.length) * 100)}%` }} />
    </div>
  );

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
      <div style={{ marginTop: 4 }}>
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

  const header = (
    <>
      {/* A step can run to ~11 questions, doubled by the guess layer — and the
          Path hides the bottom nav. Without this the only way out of The Garden
          (intimacy) mid-sitting was killing the app. Answers are written per
          question, so leaving is loss-free and re-entry resumes here. */}
      <TopBar onExit={onExit} />
      {progress}
      <p className="eyebrow" style={{ marginTop: 12 }}>
        {stepName} &middot; {t(`${idx + 1} of ${todo.length}`, `${idx + 1} sur ${todo.length}`)}
      </p>
    </>
  );

  // Guess step
  if (guessing) {
    const yourText = q.type === "scale" ? scaleText(q, pend, t) : q.opts?.[pend as number];
    return (
      <section className="screen-enter screenfill">
        {header}
        <div
          key={`${q.id}-guess`}
          className="qcard pane-in"
          style={{ borderColor: "var(--app-honey-line)" }}
        >
          <div className="qrow">
            <div className="eyebrow">{t("YOUR GUESS", "VOTRE INTUITION")}</div>
            <span className="badge honey">&#10022; {t("GUESS", "DEVINEZ")}</span>
          </div>
          <div className="qtext">{q.q}</div>
          <div className="yousaid">
            <div>
              <div className="eyebrow">{t("YOU SAID", "VOUS AVEZ DIT")}</div>
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
        <button className="btn honey" type="button" disabled={pendGuess == null || busy} onClick={lockGuess}>
          {t("Lock it in →", "Je valide →")}
        </button>
        <button className="btn ghost" type="button" onClick={advance} disabled={busy}>
          {t("Skip", "Passer")}
        </button>
      </section>
    );
  }

  // Answer step
  return (
    <section className="screen-enter screenfill">
      {header}
      {isOpen ? (
        <div key={q.id} className="qcard glide-in" style={{ background: "var(--blush)", border: "none" }}>
          <div className="eyebrow" style={{ color: "var(--berry)" }}>{t("At the table", "À table")}</div>
          <div className="qtext" style={{ marginTop: 8 }}>{q.q}</div>
          <p className="sub" style={{ marginTop: 10 }}>
            {t(
              `Share something you want the two of you to address. ${partnerName} shares theirs, you'll see both sides together.`,
              `Partagez ce que vous voulez aborder à deux. ${partnerName} partage de son côté, vous verrez les deux ensemble.`,
            )}
          </p>
          <textarea
            className="input"
            style={{ minHeight: 120, marginTop: 14 }}
            value={pendText}
            onChange={(e) => setPendText(e.target.value)}
            placeholder={t("A few honest lines is plenty…", "Quelques lignes sincères suffisent…")}
          />
        </div>
      ) : (
        <div key={q.id} className="qcard glide-in">
          <div className="qtext">{q.q}</div>
          {input(pend, setPend)}
        </div>
      )}
      <button
        className="btn"
        type="button"
        disabled={busy || (isOpen ? !pendText.trim() : pend == null)}
        onClick={submitAnswer}
      >
        {isOpen ? t("Share my side →", "Partager →") : guessable ? t("Next →", "Suivant →") : last ? t("Done →", "Terminé →") : t("Next →", "Suivant →")}
      </button>
    </section>
  );
}

// ---- You're done; your partner hasn't walked this stretch yet --------------
function WaitingForPartner({
  partnerName,
  glyph,
  onBack,
  t,
}: {
  partnerName: string;
  glyph: string;
  onBack: () => void;
  t: T;
}) {
  return (
    <section className="screen-enter">
      <TopBar onExit={onBack} />
      <div className="center" style={{ minHeight: "60dvh", textAlign: "center" }}>
        <div style={{ color: "var(--berry)", opacity: 0.5 }}>
          <PathGlyph id={glyph} size={64} />
        </div>
        <h1 className="h1 center" style={{ marginTop: 18 }}>
          {t("You've walked this stretch.", "Vous avez parcouru cette étape.")}
        </h1>
        {/* This used to promise "we'll let you know when Judah has walked it
            too". There is no notification mechanism — no push, no email — so
            that was a promise the app cannot keep. Say what's true instead. */}
        <p className="sub center" style={{ margin: "10px 24px 0", maxWidth: 320 }}>
          {t(
            `It opens for you both once ${partnerName} has walked it too. Your answers are saved.`,
            `Elle s’ouvre pour vous deux dès que ${partnerName} l’aura parcourue aussi. Vos réponses sont enregistrées.`,
          )}
        </p>
        <button className="btn pill" type="button" onClick={onBack} style={{ marginTop: 26 }}>
          {t("Back to the path", "Retour au chemin")}
        </button>
      </div>
    </section>
  );
}

// ---- After a step: walked together, and what's next (item 14) -------------
export function WalkedScreen({
  index,
  stepKey,
  name,
  lit,
  next,
  partnerName,
  onDone,
  t,
}: {
  index: number;
  stepKey: string;
  name: string;
  lit: number;
  next: { index: number; key: string; name: string; theme: string; laid: boolean } | null;
  partnerName: string;
  onDone: () => void;
  t: T;
}) {
  const them = partnerName.trim().split(/\s+/)[0] || partnerName;
  return (
    <section className="screen-enter pstep">
      <div className="pstep-top">
        <span />
        <span />
        <button className="iconbtn" type="button" onClick={onDone} aria-label={t("Back to the Path", "Retour au Chemin")}>
          <IconClose size={22} />
        </button>
      </div>
      <PathScene stepKey={stepKey} lit={lit} label={name} className="pstep-scene" />
      <p className="eyebrow center pstep-eyebrow">{t(`Step ${index + 1} complete`, `Étape ${index + 1} terminée`)}</p>
      <h1 className="h1 center" style={{ margin: "2px 0 8px" }}>
        {t(`You’ve walked ${name} together`, `Vous avez parcouru ${name} ensemble`)}
      </h1>
      <p className="helper center" style={{ margin: "0 12px 18px" }}>
        {t(
          "Your answers for this step are in Together, whenever you want to look back.",
          "Vos réponses pour cette étape sont dans Ensemble, quand vous voudrez y revenir.",
        )}
      </p>
      {next && (
        <div className="card pstep-next">
          <PathScene stepKey={next.key} lit={lit} label={next.name} className="pstep-next-scene" />
          <span>
            <span className="eyebrow">{t("Next on the path", "Ensuite sur le chemin")}</span>
            <span className="pstep-next-nm">
              {t(`Step ${next.index + 1} · ${next.name}`, `Étape ${next.index + 1} · ${next.name}`)}
            </span>
            <span className="helper">
              {next.laid
                ? next.theme
                : t(
                    `Chosen once ${them} has answered the path questions`,
                    `Choisie quand ${them} aura répondu aux questions du chemin`,
                  )}
            </span>
          </span>
        </div>
      )}
      <button className="btn pill" type="button" onClick={onDone}>
        {t("Back to the Path", "Retour au Chemin")}
      </button>
    </section>
  );
}
