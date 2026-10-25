import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { lvlQs, partName } from "../lib/leveling";
import { writeAnswer, writeGuess, writeImportance, markLevelDone } from "../lib/session";
import { optIndex, optValue, withNames, type Names } from "../lib/who";
import { type Question } from "../lib/questions";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { NOT_YET, isNotYet, type DeckData, type Role, type AnswerValue } from "../lib/scoring";
import { TopBar } from "../components/TopBar";
import { useT, useLang } from "../lib/i18n";
import { scalePoint, shortEnd } from "../lib/scaleLabels";
import { glideBy, scrollerOf, useScrollMemory } from "../lib/scroll";

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

// The answering flow for one part (item 12): a calm header with the part's
// name, "3 of 6" and the save state; the question; and the main button pinned
// in the same place at the bottom, with room kept for Skip or Not yet so it
// never moves. Guessable questions get a guess on their own screen.
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
  const partnerFirst = partnerName.trim().split(/\s+/)[0] || partnerName;

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
  const [pendGuess, setPendGuess] = useState<AnswerValue | null>(null);
  const [finishing, setFinishing] = useState(false);

  // Questions already answered in this visit, so advancing never depends on
  // the save having landed yet.
  const done = useRef(new Set<string>());
  const answered = (q: Question) => done.current.has(q.id) || deck?.answers?.[q.id]?.[role] != null;

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
    setGuessPhase(false);
    setPendAns(null);
    setPendImp(null);
    setPendGuess(null);
    let n = fromIdx + 1;
    while (n < qs.length && answered(qs[n])) n++;
    if (n >= qs.length) {
      void finish();
      return;
    }
    setIdx(n);
  };

  // Each question opens at the top of the screen.
  const screen = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  useScrollMemory(`${idx}:${guessPhase}`, undefined, screen);
  const below = useMoreBelow(card, foot, `${idx}:${guessPhase}`);
  // Choosing an answer opens "How much does this matter?" under it. If that
  // lands behind the pinned button, bring it up into view.
  const cur = qs[idx];
  const impOpen = !!cur && !guessPhase && pendAns != null && asksImportance(cur);
  const imp = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!impOpen) return;
    const id = requestAnimationFrame(() => {
      const el = imp.current;
      const f = foot.current;
      if (!el || !f) return;
      const ft = f.getBoundingClientRect();
      const hidden = el.getBoundingClientRect().bottom + 16 - ft.top;
      if (hidden > 0 && ft.height > 0) glideBy(scrollerOf(el), hidden);
    });
    return () => cancelAnimationFrame(id);
  }, [impOpen, idx]);

  if (idx >= qs.length) return null;
  const localized = localizeQuestion(qs[idx], lang);
  const q = names ? withNames(localized, names) : localized;
  // An mc pick is held as its position; it's stored as who was picked on a
  // "which of you" question (lib/who.ts).
  const stored = (v: AnswerValue): AnswerValue => (q.type === "mc" ? optValue(q, v as number) : v);
  const last = (() => {
    let n = idx + 1;
    while (n < qs.length && answered(qs[n])) n++;
    return n >= qs.length;
  })();

  const submitAnswer = () => {
    if (pendAns == null || finishing) return;
    const value = stored(pendAns);
    const imp = asksImportance(q) ? pendImp : null;
    saves.run(async () => {
      await writeAnswer(code, slug, q.id, role, value);
      if (imp != null) await writeImportance(code, slug, q.id, role, imp);
    });
    done.current.add(q.id);
    if (q.guessable && q.type !== "open") {
      setGuessPhase(true);
      setPendGuess(null);
    } else {
      advance(idx);
    }
  };

  // "Not yet" — a deliberate, unscored answer (only on flagged questions). It
  // banks a sentinel and moves on: there's nothing to weight or predict.
  const answerNotYet = () => {
    saves.run(() => writeAnswer(code, slug, q.id, role, NOT_YET));
    done.current.add(q.id);
    advance(idx);
  };

  const lockGuess = () => {
    if (pendGuess == null) return;
    const value = stored(pendGuess);
    saves.run(() => writeGuess(code, slug, q.id, role, value));
    advance(idx);
  };

  const eyebrow = [deckName(slug, lang), partName(slug, level)].filter(Boolean).join(" · ").toUpperCase();

  // The calm header: one stone per question, "3 of 6", and what happened to
  // the last answer.
  const header = (
    <>
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
    </>
  );

  if (guessPhase) {
    // Say the answer the way it reads, not as a number.
    const yourText = q.type === "scale" ? scaleSaid(q, Number(pendAns), lang) : q.opts?.[pendAns as number];
    return (
      <section ref={screen} className="screenfill playscreen">
        {header}
        <div key={`${q.id}-guess`} ref={card} className="qcard pane-in guesscard">
          <div className="qrow">
            <div className="eyebrow">{eyebrow}</div>
            <span className="badge honey">&#10022; {t("GUESS", "DEVINEZ")}</span>
          </div>
          <div className={qtextClass(q.q)}>{q.q}</div>
          {/* Not shared until the part opens, so a mis-tap can still be put
              right here. */}
          <div className="yousaid yousaid-edit">
            <div>
              <div className="eyebrow">{t("YOU SAID", "VOUS AVEZ DIT")}</div>
              <div className="yousaid-val">{yourText}</div>
            </div>
            <button type="button" className="yousaid-change" onClick={() => setGuessPhase(false)}>
              {t("change", "modifier")}
            </button>
          </div>
          <p className="guessask">
            {t("Now: what will ", "Maintenant : que va répondre ")}
            <span className="guessname">{partnerFirst}</span>
            {t(" say?", " ?")}
          </p>
          <QuestionInput q={q} value={pendGuess} guess onPick={setPendGuess} />
        </div>
        <div ref={foot} className={`playfoot${below.hidden ? " covering" : ""}`}>
          <MoreBelow below={below} />
          <button className="btn pill" type="button" disabled={pendGuess == null} onClick={lockGuess}>
            {t("That’s my guess →", "Je valide →")}
          </button>
          <div className="playfoot-slot">
            <button className="btn ghost" type="button" onClick={() => advance(idx)}>
              {t("Skip", "Passer")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={screen} className="screenfill playscreen">
      {header}
      <div key={q.id} ref={card} className="qcard glide-in">
        <div className="eyebrow">{eyebrow}</div>
        <div className={qtextClass(q.q)}>{q.q}</div>
        <QuestionInput q={q} value={pendAns} onPick={setPendAns} />

        {/* Importance, on the same card as the answer it weights; it opens
            once they've chosen. Leaving it is a valid skip. */}
        {asksImportance(q) && pendAns != null && (
          <div ref={imp} className="impinline">
            <div className="impinline-head">
              <span>{t("How much does this matter to you?", "À quel point est-ce important pour vous ?")}</span>
              <span className="impinline-opt">{t("Optional", "Facultatif")}</span>
            </div>
            <div className="impbtns" role="group">
              {IMPORTANCE.map(([v, en, fr]) => (
                <button
                  key={v}
                  type="button"
                  className={`impbtn${pendImp === v ? " on" : ""}`}
                  aria-pressed={pendImp === v}
                  onClick={() => setPendImp(pendImp === v ? null : v)}
                >
                  {t(en, fr)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div ref={foot} className={`playfoot${below.hidden ? " covering" : ""}`}>
        <MoreBelow below={below} />
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
        {/* Always the same height, so the main button never moves when a
            question offers Skip or Not yet. */}
        <div className="playfoot-slot">
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
        </div>
      </div>
    </section>
  );
}

function QuestionInput({
  q,
  value,
  guess,
  onPick,
}: {
  q: Question;
  value: AnswerValue | null;
  guess?: boolean;
  onPick: (v: AnswerValue | null) => void;
}) {
  const t = useT();
  const lang = useLang();
  if (q.type === "scale") {
    const said = value != null ? scalePoint(q, Number(value), lang) : null;
    const side = value == null ? "" : Number(value) < 3 ? " lo" : Number(value) > 3 ? " hi" : " mid";
    return (
      <>
        <div className="slabels">
          <span>{shortEnd(q.lo)}</span>
          <span style={{ textAlign: "right" }}>{shortEnd(q.hi)}</span>
        </div>
        <div className="scale" role="group" aria-label={q.q}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              className={`orb ${value === i ? "sel" : ""}`}
              onClick={() => onPick(i)}
              aria-pressed={value === i}
              aria-label={`${i}: ${i >= 4 ? q.hi : i <= 2 ? q.lo : t("in the middle", "au milieu")}`}
            >
              {i}
            </button>
          ))}
        </div>
        {/* What the chosen point means, pointing up at its orb: the
            question's own words for it, or how strongly plus the end's full
            sentence. It leans to the side that was picked. */}
        <div className="orbsay" aria-live="polite">
          <div className="orbsay-carets" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="orbsay-cell">
                {value === i && <span className="caret" />}
              </span>
            ))}
          </div>
          {said && (
            <p key={String(value)} className={`orbsay-text${side}`}>
              <b>{said.word}</b>
              {said.detail && <span>{said.detail}</span>}
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
  if (q.type === "rank") return <RankInput q={q} onPick={onPick} />;
  // mc
  return (
    <div style={{ marginTop: 4 }} role="group" aria-label={q.q}>
      {q.opts?.map((o, i) => (
        <button
          key={i}
          type="button"
          className={`opt ${guess ? "guess" : ""} ${value === i ? "sel" : ""}`}
          onClick={() => onPick(i)}
          aria-pressed={value === i}
        >
          {o}
          <span className="dot" />
        </button>
      ))}
    </div>
  );
}

// Rank (item 12): a numbered list moved with up and down, confirmed with
// "This is my order". Fixing one item never means starting over. Stored as the
// option positions in order, most important first ("2,0,1,3").
function RankInput({ q, onPick }: { q: Question; onPick: (v: AnswerValue) => void }) {
  const t = useT();
  const n = q.opts?.length ?? 0;
  const [order, setOrder] = useState(() => Array.from({ length: n }, (_, i) => i));
  const [moved, setMoved] = useState<number | null>(null);
  useEffect(() => {
    onPick(order.join(","));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);
  const move = (at: number, by: -1 | 1) => {
    const to = at + by;
    if (to < 0 || to >= n) return;
    const next = [...order];
    [next[at], next[to]] = [next[to], next[at]];
    setOrder(next);
    setMoved(next[to]);
  };
  return (
    <>
      {/* A question that sets its own order ("Put your least favourite
          first") isn't contradicted by the usual one. */}
      {!/ first\.$/.test(q.q) && (
        <p className="helper rankhelp">
          {t("Put these in order, most important first.", "Classez-les, le plus important en premier.")}
        </p>
      )}
      <ol className="ranklist">
        {order.map((oi, pos) => {
          const label = q.opts![oi];
          return (
            <li key={oi} className={`opt rankrow${moved === oi ? " moved" : ""}`}>
              <span className="rankno on" aria-hidden="true">
                {pos + 1}
              </span>
              <span className="rankrow-t">{label}</span>
              <button
                type="button"
                className="rankmove"
                disabled={pos === 0}
                onClick={() => move(pos, -1)}
                aria-label={t(`Move ${label} up`, `Monter ${label}`)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="rankmove"
                disabled={pos === n - 1}
                onClick={() => move(pos, 1)}
                aria-label={t(`Move ${label} down`, `Descendre ${label}`)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}

// Long questions step down a size so the answers still fit on the screen.
function qtextClass(text: string): string {
  return text.length > 120 ? "qtext qtext-longer" : text.length > 90 ? "qtext qtext-long" : "qtext";
}

// A scale answer read back the way it reads on the scale, not as a number.
function scaleSaid(q: Question, i: number, lang: string): string {
  const { word, detail } = scalePoint(q, i, lang);
  if (q.steps?.length === 5 && lang === "en") return detail ? `${word}: ${detail}` : word;
  const end = detail ?? (i < 3 ? q.lo : i > 3 ? q.hi : "");
  return end ? `${word} — ${end}` : word;
}

type Below = { hidden: boolean; reveal: () => void };

// Is part of the question card hidden behind the pinned button? Checked as the
// screen scrolls, resizes, or the card grows (the importance row opening).
function useMoreBelow(
  card: RefObject<HTMLElement | null>,
  foot: RefObject<HTMLElement | null>,
  key: string,
): Below {
  const [hidden, setHidden] = useState(false);
  const overlap = () => {
    const c = card.current;
    const f = foot.current;
    if (!c || !f) return 0;
    return c.getBoundingClientRect().bottom - f.getBoundingClientRect().top;
  };
  useLayoutEffect(() => {
    const check = () => setHidden(overlap() > 8);
    check();
    document.addEventListener("scroll", check, { capture: true, passive: true });
    window.addEventListener("resize", check);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(check) : null;
    if (card.current) ro?.observe(card.current);
    return () => {
      document.removeEventListener("scroll", check, { capture: true });
      window.removeEventListener("resize", check);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return {
    hidden,
    reveal: () => {
      const d = overlap();
      if (d > 0 && card.current) glideBy(scrollerOf(card.current), d + 16);
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
