import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { lvlQs, partName } from "../lib/leveling";
import { writeAnswer, writeGuess, writeImportance, clearImportance, markLevelDone } from "../lib/session";
import { optIndex, optValue, withNames, type Names } from "../lib/who";
import { type Question } from "../lib/questions";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { NOT_YET, isNotYet, type DeckData, type Role, type AnswerValue } from "../lib/scoring";
import { TopBar } from "../components/TopBar";
import { useT, useLang } from "../lib/i18n";
import { scaleSay } from "../lib/scaleLabels";
import { glideBy, useScrollMemory } from "../lib/scroll";

// Importance is asked only where a gap would actually cost the couple: the
// tier-3 questions and the deal-breaker set. Everything else silently rides the
// tier default so the user isn't taxed on every question (brief §2b). Open
// questions never score, so they're never asked.
const asksImportance = (q: Question): boolean =>
  q.type !== "open" && (Number(q.depth) >= 4 || q.id.startsWith("DEAL-"));

// Importance as three plain choices (item 12), stored as 1, 3 and 5 so the
// weighting in scoring.ts is unchanged.
const IMPORTANCE: [number, string, string][] = [
  [1, "A little", "Un peu"],
  [3, "Somewhat", "Assez"],
  [5, "A lot", "Beaucoup"],
];

type SaveState = "idle" | "saving" | "saved" | "failed";

// Saving never blocks moving on (UX laws: Doherty). Each write runs in the
// background; the header says "Saving…", then "✓ Saved", or "Not saved" with
// Try again. A failed write is kept and retried, never dropped: finishing the
// part waits until every answer is in.
function useSaveQueue() {
  const [state, setState] = useState<SaveState>("idle");
  const pending = useRef(new Set<Promise<void>>());
  const failed = useRef<(() => Promise<void>)[]>([]);

  const settle = () =>
    setState(failed.current.length ? "failed" : pending.current.size ? "saving" : "saved");

  const run = (job: () => Promise<void>) => {
    setState("saving");
    const p = job().catch(() => {
      failed.current.push(job);
    });
    pending.current.add(p);
    void p.finally(() => {
      pending.current.delete(p);
      settle();
    });
  };

  const retry = () => {
    const jobs = failed.current;
    failed.current = [];
    jobs.forEach(run);
  };

  // Resolves true once everything queued so far has saved.
  const flush = async (): Promise<boolean> => {
    while (pending.current.size) await Promise.allSettled([...pending.current]);
    return failed.current.length === 0;
  };

  return { state, run, retry, flush };
}

// The answering flow for one part (items 12, 15, 17): the top of the screen
// (bar, stones, "3 of 6", the question) and the bottom (importance, the main
// button) stay put; only the answers scroll between them. Guessable questions
// get a guess on their own screen. Back steps through earlier questions with
// your answers filled in, so any of them can be changed before the part is
// finished.
export default function PlayScreen({
  code,
  slug,
  level,
  role,
  deck,
  partnerName,
  names,
  onFinish,
  onExit,
}: {
  code: string;
  slug: string;
  level: number;
  role: Role;
  deck: DeckData | undefined;
  partnerName: string;
  /** Both first names by role, for "which of you" questions. */
  names?: Names;
  onFinish: () => void;
  onExit: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const qs = useMemo(() => lvlQs(slug, level), [slug, level]);
  const saves = useSaveQueue();
  // "Judah", or the whole fallback ("your partner") before they've joined:
  // its first word alone read "what will your say?".
  const partnerFirst = /^(your partner|votre partenaire)$/i.test(partnerName.trim())
    ? partnerName.trim()
    : partnerName.trim().split(/\s+/)[0] || partnerName;

  // Start at the first question this role hasn't answered.
  const firstUnanswered = useMemo(() => {
    let i = 0;
    while (i < qs.length && deck?.answers?.[qs[i].id]?.[role] != null) i++;
    return i;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, level]);

  // Leaving between banking an answer and locking the guess used to forfeit
  // that guess for good. If the question just before the resume point is
  // answered but unguessed, resume INTO its guess step.
  const resumeGuess = useMemo(() => {
    const q = qs[firstUnanswered - 1];
    if (!q || !q.guessable || q.type === "open") return null;
    const mine = deck?.answers?.[q.id]?.[role];
    if (mine == null || isNotYet(mine)) return null;
    if (deck?.guesses?.[q.id]?.[role] != null) return null;
    // Recap state holds the option position, so map a stored who-answer back.
    return { at: firstUnanswered - 1, answer: q.type === "mc" ? (optIndex(q, mine) ?? mine) : mine };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, level]);

  const [idx, setIdx] = useState(resumeGuess ? resumeGuess.at : firstUnanswered);
  const [guessPhase, setGuessPhase] = useState(!!resumeGuess);
  const [pendAns, setPendAns] = useState<AnswerValue | null>(resumeGuess?.answer ?? null);
  const [pendImp, setPendImp] = useState<number | null>(null);
  // The importance shown came from an earlier visit, not a tap just now.
  const [impEarlier, setImpEarlier] = useState(false);
  const [pendGuess, setPendGuess] = useState<AnswerValue | null>(null);
  const [finishing, setFinishing] = useState(false);

  // What was given in this visit, so stepping back and forth never depends on
  // a save having landed yet. Falls back to what's already in the session.
  const given = useRef(new Map<string, { a?: AnswerValue; imp?: number | null; g?: AnswerValue }>());
  const was = (q: Question) => {
    const v = given.current.get(q.id) ?? {};
    return {
      a: v.a ?? deck?.answers?.[q.id]?.[role] ?? null,
      imp: v.imp !== undefined ? v.imp : (deck?.importance?.[q.id]?.[role] ?? null),
      g: v.g ?? deck?.guesses?.[q.id]?.[role] ?? null,
    };
  };
  const remember = (q: Question, v: { a?: AnswerValue; imp?: number | null; g?: AnswerValue }) =>
    given.current.set(q.id, { ...given.current.get(q.id), ...v });
  // A stored answer as the screen holds it: an mc pick by position, "Not yet"
  // as nothing picked.
  const asPick = (q: Question, v: AnswerValue | null): AnswerValue | null =>
    v == null || isNotYet(v) ? null : q.type === "mc" ? (optIndex(q, v) ?? null) : v;

  // Open question `i`, on its answer or its guess, with what was given before.
  const open = (i: number, guess: boolean) => {
    const q = qs[i];
    const w = was(q);
    setIdx(i);
    setGuessPhase(guess);
    setPendAns(asPick(q, w.a));
    setPendImp(w.imp);
    setImpEarlier(w.imp != null);
    setPendGuess(asPick(q, w.g));
  };

  const finish = async () => {
    setFinishing(true);
    // Every answer must be in before the part is marked done: finishing is
    // what shares them.
    if (!(await saves.flush())) {
      setFinishing(false);
      return;
    }
    try {
      await markLevelDone(code, slug, level, role, { wait: false });
      onFinish();
    } catch {
      setFinishing(false);
      saves.run(() => markLevelDone(code, slug, level, role, { wait: false }));
    }
  };

  const advance = (fromIdx: number) => {
    if (fromIdx + 1 >= qs.length) {
      void finish();
      return;
    }
    open(fromIdx + 1, false);
  };

  // Back: from a guess to its own answer; from an answer to the screen before
  // it, which is the previous question's guess when it had one.
  const canBack = guessPhase || idx > 0;
  const back = () => {
    if (guessPhase) {
      setGuessPhase(false);
      return;
    }
    if (idx === 0) return;
    const p = qs[idx - 1];
    const a = was(p).a;
    open(idx - 1, !!p.guessable && p.type !== "open" && a != null && !isNotYet(a));
  };

  const screen = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const view = `${idx}:${guessPhase}`;
  // If the screen is ever taller than the phone (very large text), each
  // question still opens at the top.
  useScrollMemory(view, undefined, screen);
  const below = useMoreBelow(body, view);

  // Choosing an answer opens "How much does this matter?" above the button,
  // which shortens the answer area: keep the answer just chosen in view.
  const cur = qs[idx];
  const impOpen = !!cur && !guessPhase && pendAns != null && asksImportance(cur);
  useEffect(() => {
    if (!impOpen) return;
    const id = requestAnimationFrame(() => {
      const b = body.current;
      const sel = b?.querySelector(".sel, .orbsay-text");
      if (!b || !sel) return;
      const hidden = sel.getBoundingClientRect().bottom + 8 - b.getBoundingClientRect().bottom;
      if (hidden > 0 && b.clientHeight > 0) glideBy(b, hidden);
    });
    return () => cancelAnimationFrame(id);
  }, [impOpen, idx]);

  if (idx >= qs.length) return null;
  const localized = localizeQuestion(qs[idx], lang);
  const q = names ? withNames(localized, names) : localized;
  // An mc pick is held as its position; it's stored as who was picked on a
  // "which of you" question (lib/who.ts).
  const stored = (v: AnswerValue): AnswerValue => (q.type === "mc" ? optValue(q, v as number) : v);
  const last = idx === qs.length - 1;

  const submitAnswer = () => {
    if (pendAns == null || finishing) return;
    const value = stored(pendAns);
    const imp = asksImportance(q) ? pendImp : null;
    const hadImp = was(q).imp != null;
    saves.run(async () => {
      await writeAnswer(code, slug, q.id, role, value);
      if (imp != null) await writeImportance(code, slug, q.id, role, imp);
      else if (hadImp) await clearImportance(code, slug, q.id);
    });
    remember(q, { a: value, imp });
    if (q.guessable && q.type !== "open") {
      setGuessPhase(true);
      setPendGuess(asPick(q, was(q).g));
    } else {
      advance(idx);
    }
  };

  // "Not yet": a deliberate, unscored answer (only on flagged questions). It
  // banks a sentinel and moves on: there's nothing to weight or predict.
  const answerNotYet = () => {
    saves.run(() => writeAnswer(code, slug, q.id, role, NOT_YET));
    remember(q, { a: NOT_YET });
    advance(idx);
  };

  const lockGuess = () => {
    if (pendGuess == null) return;
    const value = stored(pendGuess);
    saves.run(() => writeGuess(code, slug, q.id, role, value));
    remember(q, { g: value });
    advance(idx);
  };

  // Back sits at the bottom left, beside the main button, where the thumb is.
  const backBtn = canBack ? (
    <button className="btn out backsq" type="button" onClick={back} aria-label={t("Back to the previous question", "Revenir à la question précédente")}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M14.5 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  ) : null;

  const eyebrow = [deckName(slug, lang), partName(slug, level)].filter(Boolean).join(" · ").toUpperCase();

  // The calm header: back and close, one stone per question, "3 of 6", and
  // what happened to the last answer.
  const header = (
    <div className="phead">
      <TopBar onExit={onExit} />
      <div className="qstones" aria-hidden="true">
        {qs.map((_, i) => (
          <i
            key={i}
            className={i < idx ? "full" : i === idx ? (guessPhase ? "half cur" : "cur") : ""}
          />
        ))}
      </div>
      <div className="qstatus">
        <span>{t(`${idx + 1} of ${qs.length}`, `${idx + 1} sur ${qs.length}`)}</span>
        <span className={`savestate ${saves.state}`} role="status">
          {saves.state === "saving"
            ? t("Saving…", "Enregistrement…")
            : saves.state === "saved"
              ? t("✓ Saved", "✓ Enregistré")
              : saves.state === "failed"
                ? t("! Not saved", "! Non enregistré")
                : ""}
        </span>
      </div>
      {saves.state === "failed" && (
        <div className="savefail" role="alert">
          <span>
            {t(
              "Your last answer didn’t save. You can keep going.",
              "Votre dernière réponse n’a pas été enregistrée. Vous pouvez continuer.",
            )}
          </span>
          <button className="btn out" type="button" onClick={saves.retry}>
            {t("Try again", "Réessayer")}
          </button>
        </div>
      )}
    </div>
  );

  if (guessPhase) {
    return (
      <section ref={screen} className="playscreen pfix">
        {header}
        <div key={`${q.id}-guess`} className="qcard qframe pane-in guesscard">
          <div className="qhead">
            <div className="guesshead">
              <span className="badge honey">&#10022; {t("GUESS", "DEVINEZ")}</span>
              <span>
                {t("What will ", "Que va répondre ")}
                <span className="guessname">{partnerFirst}</span>
                {t(" say?", " ?")}
              </span>
            </div>
            <div className={qtextClass(q.q)}>{q.q}</div>
          </div>
          {/* Your own answer is marked in place ("You"), so the guess is made
              beside it; Back changes it. */}
          <div ref={body} className={bodyClass(below)}>
            <QuestionInput q={q} value={pendGuess} guess mine={pendAns} onPick={setPendGuess} />
          </div>
          <MoreBelow below={below} />
        </div>
        <div className="playfoot">
          <div className="playfoot-row">
            {backBtn}
            <button className="btn ghost" type="button" onClick={() => advance(idx)}>
              {t("Skip", "Passer")}
            </button>
            <button className="btn pill" type="button" disabled={pendGuess == null} onClick={lockGuess}>
              {t("That’s my guess →", "Je valide →")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={screen} className="playscreen pfix">
      {header}
      <div key={q.id} className="qcard qframe glide-in">
        <div className="qhead">
          <div className="eyebrow">{eyebrow}</div>
          <div className={qtextClass(q.q)}>{q.q}</div>
        </div>
        <div ref={body} className={bodyClass(below)}>
          <QuestionInput q={q} value={pendAns} onPick={setPendAns} />
        </div>
        <MoreBelow below={below} />
      </div>
      <div className="playfoot">
        {/* Importance sits with the button, so it's always in view; it opens
            once they've chosen. Leaving it is a valid skip. */}
        {impOpen && (
          <div className="impfoot">
            <div className="impinline-head">
              <span>{t("How much does this matter to you?", "À quel point est-ce important pour vous ?")}</span>
              <span className="impinline-opt">
                {pendImp != null && impEarlier
                  ? t("Your earlier answer", "Votre réponse précédente")
                  : t("Optional", "Facultatif")}
              </span>
            </div>
            {/* A soft segmented control, so it never reads as a second main
                button. Tapping the chosen one clears it. */}
            <div className="impseg" role="group">
              {IMPORTANCE.map(([v, en, fr]) => (
                <button
                  key={v}
                  type="button"
                  className={pendImp === v ? "on" : ""}
                  aria-pressed={pendImp === v}
                  onClick={() => {
                    setImpEarlier(false);
                    setPendImp(pendImp === v ? null : v);
                  }}
                >
                  {t(en, fr)}
                </button>
              ))}
            </div>
          </div>
        )}
        {last && (
          <p className="lastline">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M4 5h16v10H9l-5 4V5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            {t(
              "Once you’ve both finished this part, you’re ready to talk it through together.",
              "Une fois que vous aurez tous deux terminé cette partie, vous serez prêts à en parler ensemble.",
            )}
          </p>
        )}
        <div className="playfoot-row">
          {backBtn}
          {q.notYet ? (
            <button className="btn ghost" type="button" onClick={answerNotYet} disabled={finishing}>
              {t("Not yet", "Pas encore")}
            </button>
          ) : q.type === "open" ? (
            // Open questions never score, so skipping costs nothing; without
            // this the only way past one was the ×, abandoning the part.
            <button className="btn ghost" type="button" onClick={() => advance(idx)} disabled={finishing}>
              {t("Skip for now", "Passer pour l’instant")}
            </button>
          ) : null}
          <button
            className={finishing ? "btn busy" : "btn"}
            type="button"
            disabled={pendAns == null || finishing}
            onClick={submitAnswer}
          >
            {finishing
              ? t("Saving your answers…", "Enregistrement de vos réponses…")
              : last
                ? t("Finish part →", "Terminer la partie →")
                : q.type === "rank"
                  ? t("This is my order →", "C’est mon ordre →")
                  : t("Next →", "Suivant →")}
          </button>
        </div>
      </div>
    </section>
  );
}

function QuestionInput({
  q,
  value,
  guess,
  mine,
  onPick,
}: {
  q: Question;
  value: AnswerValue | null;
  guess?: boolean;
  /** On a guess: your own answer, marked "You" in place. */
  mine?: AnswerValue | null;
  onPick: (v: AnswerValue | null) => void;
}) {
  const t = useT();
  const lang = useLang();
  const you = t("You", "Vous");
  if (q.type === "scale") {
    const n = value == null ? null : Number(value);
    const m = mine == null ? null : Number(mine);
    return (
      <>
        <div className="slabels">
          <span>{q.lo}</span>
          <span style={{ textAlign: "right" }}>{q.hi}</span>
        </div>
        <div className="scale" role="group" aria-label={q.q}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              className={`orb${value === i ? " sel" : ""}${m === i ? " mine" : ""}`}
              onClick={() => onPick(i)}
              aria-pressed={value === i}
              aria-label={`${i}: ${scaleSay(q, i, lang)}${m === i ? ` (${you})` : ""}`}
            >
              {i}
            </button>
          ))}
        </div>
        {m != null && (
          <div className="orbyou" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i}>{m === i ? you : ""}</span>
            ))}
          </div>
        )}
        {/* What the chosen point means, in one line, in a bubble sized to its
            words that points up at its orb. */}
        <div className="orbsay" aria-live="polite">
          <div className="orbsay-carets" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="orbsay-cell">
                {value === i && <span className="caret" />}
              </span>
            ))}
          </div>
          {n != null && (
            <p key={n} className={`orbsay-text p${n}`}>
              {scaleSay(q, n, lang)}
            </p>
          )}
        </div>
      </>
    );
  }
  if (q.type === "open") {
    return (
      <textarea
        className="ta"
        aria-label={q.q}
        placeholder={t(
          "Write as much or as little as you like…",
          "Écrivez autant ou aussi peu que vous le souhaitez…",
        )}
        value={(value as string) ?? ""}
        onChange={(e) => onPick(e.target.value.trim() === "" ? null : e.target.value)}
      />
    );
  }
  if (q.type === "rank") return <RankInput q={q} initial={value as string | null} onPick={onPick} />;
  // mc
  return (
    <div role="group" aria-label={q.q}>
      {q.opts?.map((o, i) => (
        <button
          key={i}
          type="button"
          className={`opt${guess ? " guess" : ""}${value === i ? " sel" : ""}${mine === i ? " mine" : ""}`}
          onClick={() => onPick(i)}
          aria-pressed={value === i}
        >
          <span className="opt-t">
            {o}
            {mine === i && <span className="youtag">{you}</span>}
          </span>
          <span className="dot" />
        </button>
      ))}
    </div>
  );
}

// Rank (feedback 19): tap the options in order and each takes the next
// number; the last one left is numbered for you. Tap a numbered one to take it
// out (the rest close up), or start again. Stored as the option positions in
// order, most important first ("2,0,1,3"); coming back shows the order given.
function RankInput({
  q,
  initial,
  onPick,
}: {
  q: Question;
  initial: string | null;
  onPick: (v: AnswerValue | null) => void;
}) {
  const t = useT();
  const n = q.opts?.length ?? 0;
  const [order, setOrder] = useState<number[]>(() => {
    const prev = (initial ?? "").split(",").map(Number);
    const ok = prev.length === n && [...prev].sort((a, b) => a - b).every((v, i) => v === i);
    return ok ? prev : [];
  });
  useEffect(() => {
    onPick(order.length === n ? order.join(",") : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);
  const tap = (oi: number) =>
    setOrder((o) => {
      if (o.includes(oi)) return o.filter((x) => x !== oi);
      const next = [...o, oi];
      if (next.length === n - 1) next.push(...Array.from({ length: n }, (_, i) => i).filter((i) => !next.includes(i)));
      return next;
    });
  // A question that sets its own order ("Put your least favourite first")
  // isn't contradicted by the usual one.
  const ownOrder = q.q.endsWith(" first.");
  return (
    <>
      <div className="rankhelp">
        <p className="helper">
          {ownOrder
            ? t("Tap them in order.", "Touchez-les dans l’ordre.")
            : t("Tap them in order, most important first.", "Touchez-les dans l’ordre, le plus important en premier.")}
        </p>
        {order.length > 0 && (
          <button type="button" className="rankreset" onClick={() => setOrder([])}>
            {t("Start again", "Recommencer")}
          </button>
        )}
      </div>
      <div role="group" aria-label={q.q}>
        {q.opts?.map((label, oi) => {
          const pos = order.indexOf(oi);
          return (
            <button
              key={oi}
              type="button"
              className={`opt rankpick${pos >= 0 ? " ranked" : ""}`}
              onClick={() => tap(oi)}
              aria-pressed={pos >= 0}
              aria-label={pos >= 0 ? t(`${label}: number ${pos + 1}`, `${label} : numéro ${pos + 1}`) : label}
            >
              <span key={pos} className={`rankno${pos >= 0 ? " on" : ""}`} aria-hidden="true">
                {pos >= 0 ? pos + 1 : ""}
              </span>
              <span className="opt-t">{label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

// Longer questions step down a size so the answers keep most of the screen.
function qtextClass(text: string): string {
  return text.length > 90 ? "qtext qtext-long" : "qtext";
}

type Below = { hidden: boolean; up: boolean; reveal: () => void };

// The answers' scrolling area fades at whichever edge has more beyond it:
// the bottom while there's more below (with "More below"), the top once
// you've scrolled down.
const bodyClass = (b: Below) => `qbody${b.hidden ? " more" : ""}${b.up ? " up" : ""}`;

// Do the answers run on past the edges of their scrolling area? Checked as it
// scrolls, resizes, or its contents change.
function useMoreBelow(body: RefObject<HTMLElement | null>, key: string): Below {
  const [hidden, setHidden] = useState(false);
  const [up, setUp] = useState(false);
  useLayoutEffect(() => {
    const b = body.current;
    if (!b) return;
    const check = () => {
      setHidden(b.scrollHeight - b.scrollTop - b.clientHeight > 8);
      setUp(b.scrollTop > 8);
    };
    check();
    b.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(check) : null;
    ro?.observe(b);
    for (const c of Array.from(b.children)) ro?.observe(c);
    return () => {
      b.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return {
    hidden,
    up,
    reveal: () => {
      const b = body.current;
      if (b) glideBy(b, Math.round(b.clientHeight * 0.7));
    },
  };
}

function MoreBelow({ below }: { below: Below }) {
  const t = useT();
  if (!below.hidden) return null;
  return (
    <button type="button" className="morebelow" onClick={below.reveal}>
      {t("More below", "Voir la suite")}
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
