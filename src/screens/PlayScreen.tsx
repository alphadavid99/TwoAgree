import { useMemo, useState } from "react";
import { lvlQs, nLevels } from "../lib/leveling";
import { writeAnswer, writeGuess, writeImportance, markLevelDone } from "../lib/session";
import { type Question } from "../lib/questions";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { NOT_YET, isNotYet, type DeckData, type Role, type AnswerValue } from "../lib/scoring";
import { TopBar } from "../components/TopBar";
import { useT, useLang } from "../lib/i18n";

// Intensity words for the 1–5 scale. The endpoints are already labelled per
// question (q.lo / q.hi); these name the position so the middle is never
// ambiguous. Direction is carried by which orb the label sits under.
const SCALE_WORDS = [
  "Strongly",
  "Leaning",
  "Right in the middle",
  "Leaning",
  "Strongly",
];
const SCALE_WORDS_FR = [
  "Fortement",
  "Plutôt",
  "Pile au milieu",
  "Plutôt",
  "Fortement",
];

// Importance is asked only where a gap would actually cost the couple: the
// tier-3 questions and the deal-breaker set. Everything else silently rides the
// tier default so the user isn't taxed on every question (brief §2b). Open
// questions never score, so they're never asked.
const asksImportance = (q: Question): boolean =>
  q.type !== "open" && (Number(q.depth) >= 4 || q.id.startsWith("DEAL-"));

// The answering flow for one level: answer each question, and for guessable
// (non-open) questions, predict your partner. Ported from the legacy question
// flow. When the level is exhausted, mark it done and hand back to the shell.
export default function PlayScreen({
  code,
  slug,
  level,
  role,
  deck,
  partnerName,
  onFinish,
  onExit,
}: {
  code: string;
  slug: string;
  level: number;
  role: Role;
  deck: DeckData | undefined;
  partnerName: string;
  onFinish: () => void;
  onExit: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const qs = useMemo(() => lvlQs(slug, level), [slug, level]);

  // Start at the first question this role hasn't answered.
  const firstUnanswered = useMemo(() => {
    let i = 0;
    while (i < qs.length && deck?.answers?.[qs[i].id]?.[role] != null) i++;
    return i;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, level]);

  // Leaving between banking an answer and locking the guess used to forfeit
  // that guess for good: resume position is computed from answers alone, and
  // advance() skips anything answered — so the Known score quietly lost a data
  // point with no trace. If the question just before the resume point is
  // answered but unguessed, resume INTO its guess step.
  const resumeGuess = useMemo(() => {
    const q = qs[firstUnanswered - 1];
    if (!q || !q.guessable || q.type === "open") return null;
    const mine = deck?.answers?.[q.id]?.[role];
    if (mine == null || isNotYet(mine)) return null;
    if (deck?.guesses?.[q.id]?.[role] != null) return null;
    return { at: firstUnanswered - 1, answer: mine };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, level]);

  const [idx, setIdx] = useState(resumeGuess ? resumeGuess.at : firstUnanswered);
  const [guessPhase, setGuessPhase] = useState(!!resumeGuess);
  // Seeded on a guess-resume so the "YOU SAID" recap has the banked answer.
  const [pendAns, setPendAns] = useState<AnswerValue | null>(resumeGuess?.answer ?? null);
  const [pendImp, setPendImp] = useState<number | null>(null);
  const [pendGuess, setPendGuess] = useState<AnswerValue | null>(null);
  const [rankOrder, setRankOrder] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  const advance = async (fromIdx: number) => {
    setGuessPhase(false);
    setPendAns(null);
    setPendImp(null);
    setPendGuess(null);
    setRankOrder([]);
    let n = fromIdx + 1;
    while (n < qs.length && deck?.answers?.[qs[n].id]?.[role] != null) n++;
    if (n >= qs.length) {
      setBusy(true);
      await markLevelDone(code, slug, level, role);
      onFinish();
      return;
    }
    setIdx(n);
  };

  if (idx >= qs.length) return null;
  const q = localizeQuestion(qs[idx], lang);

  // After the answer is banked: qualifying questions get the importance ask
  // first, then (if guessable) the guess step, then advance. Non-qualifying
  // questions skip straight to the guess step or the next question.
  const afterAnswer = () => {
    if (q.guessable && q.type !== "open") {
      setGuessPhase(true);
      setPendGuess(null);
    } else {
      advance(idx);
    }
  };

  const submitAnswer = async () => {
    if (pendAns == null || busy) return;
    setBusy(true);
    await writeAnswer(code, slug, q.id, role, pendAns);
    // Importance used to be its own screen, shown AFTER the answer with no
    // reference to the question — on Deal-breakers all 23 questions produced
    // the same context-free card, so people rated on muscle memory, and those
    // ratings weight the headline score. It now rides on the answer card, which
    // also removes a third of the screens from the heaviest decks.
    if (asksImportance(q) && pendImp != null) {
      await writeImportance(code, slug, q.id, role, pendImp);
    }
    setBusy(false);
    afterAnswer();
  };

  // "Not yet" — a deliberate, unscored answer (only on flagged questions). It
  // banks a sentinel and moves on, skipping the importance and guess steps
  // entirely: there's nothing to weight and nothing to predict.
  const answerNotYet = async () => {
    if (busy) return;
    setBusy(true);
    await writeAnswer(code, slug, q.id, role, NOT_YET);
    setBusy(false);
    advance(idx);
  };

  const lockGuess = async () => {
    if (pendGuess == null || busy) return;
    setBusy(true);
    await writeGuess(code, slug, q.id, role, pendGuess);
    setBusy(false);
    advance(idx);
  };

  const multi = nLevels(slug) > 1;
  const eyebrow =
    deckName(slug, lang).toUpperCase() +
    (multi
      ? t(
          ` · PART ${level + 1} OF ${nLevels(slug)}`,
          ` · PARTIE ${level + 1} SUR ${nLevels(slug)}`,
        )
      : "");

  // One stone per question in this part, present in EVERY phase. The old bar
  // unmounted during the guess step — and 336 of 399 questions are guessable,
  // so couples spent roughly half the loop with no sense of where they were.
  // It also filled on arrival (~17% before the first answer, 100% during the
  // last question); a stone only fills once its answer is actually banked.
  const stones = (
    <div className="qstones" aria-hidden="true">
      {qs.map((_, i) => (
        <i
          key={i}
          className={
            i < idx ? "full" : i === idx ? (guessPhase ? "half cur" : "cur") : ""
          }
        />
      ))}
    </div>
  );

  if (guessPhase) {
    // A bare "4 / 5" made people re-decode their own answer before predicting
    // their partner's. Say it the way the orb label does.
    const yourText =
      q.type === "scale"
        ? `${t(SCALE_WORDS[Number(pendAns) - 1], SCALE_WORDS_FR[Number(pendAns) - 1])} — ${
            Number(pendAns) >= 4 ? q.hi : Number(pendAns) <= 2 ? q.lo : ""
          }`.replace(/ — $/, "")
        : q.opts?.[pendAns as number];
    return (
      <section>
        <TopBar onExit={onExit} />
        {stones}
        <div
          key={`${q.id}-guess`}
          className="qcard pane-in"
          style={{ marginTop: 18, borderColor: "var(--app-honey-line)" }}
        >
          <div className="qrow">
            <div className="eyebrow">{deckName(slug, lang).toUpperCase()}</div>
            <span className="badge honey">&#10022; {t("GUESS", "DEVINEZ")}</span>
          </div>
          <div className="qtext">{q.q}</div>
          {/* Writes are immediate and the flow is forward-only, so a mis-tap
              used to be permanent — discovered here, one screen too late, with
              nothing to do about it. Re-submitting overwrites by path. */}
          <button
            type="button"
            className="yousaid yousaid-edit"
            onClick={() => setGuessPhase(false)}
          >
            <div>
              <div className="eyebrow" style={{ fontSize: 10 }}>
                {t("YOU SAID", "VOUS AVEZ DIT")}
              </div>
              <div className="yousaid-val">{yourText}</div>
            </div>
            <span className="yousaid-change">{t("change", "modifier")}</span>
          </button>
          <p style={{ margin: "18px 0 14px", fontWeight: 600 }}>
            {t("Now — what will ", "Maintenant — que va répondre ")}
            <span style={{ color: "var(--amber)" }}>{partnerName}</span>
            {t(" say?", " ?")}
          </p>
          <QuestionInput
            q={q}
            value={pendGuess}
            guess
            onPick={setPendGuess}
            rankOrder={rankOrder}
            setRankOrder={setRankOrder}
            setPend={setPendGuess}
          />
        </div>
        <button
          className={busy ? "btn honey busy" : "btn honey"}
          type="button"
          disabled={pendGuess == null || busy}
          onClick={lockGuess}
        >
          {/* "Lock it in" was the one game-show idiom in a devotional app —
              and the French already said the calmer thing. */}
          {t("That’s my guess →", "Je valide →")}
        </button>
        <button className="btn ghost" type="button" onClick={() => advance(idx)}>
          {t("Skip", "Passer")}
        </button>
      </section>
    );
  }

  return (
    <section>
      <TopBar onExit={onExit} />
      {stones}
      <div key={q.id} className="qcard glide-in" style={{ marginTop: 18 }}>
        <div className="qrow">
          <div className="eyebrow">{eyebrow}</div>
          {/* The numeric TIER badge is gone (brief 2 §A7c) — depth is never a
              number in the UI. The eyebrow's Part label carries the ramp. */}
        </div>
        <div className="qtext">{q.q}</div>
        <QuestionInput
          q={q}
          value={pendAns}
          onPick={setPendAns}
          rankOrder={rankOrder}
          setRankOrder={setRankOrder}
          setPend={setPendAns}
        />

        {/* Importance, on the same card as the answer it weights — it opens
            once they've chosen, so it never greets an empty question. Leaving
            it untouched is a valid skip; the tier default rides underneath. */}
        {asksImportance(q) && pendAns != null && (
          <div className="impinline">
            <div className="impinline-q">
              {t("How much does this matter to you?", "À quel point est-ce important pour vous ?")}
            </div>
            <div className="impinline-row">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`impdot${pendImp === i ? " on" : ""}`}
                  onClick={() => setPendImp(i)}
                  aria-pressed={pendImp === i}
                  aria-label={t(`Matters ${i} of 5`, `Importance ${i} sur 5`)}
                >
                  {i}
                </button>
              ))}
              <span className="impinline-ends">
                {pendImp == null
                  ? t("Not much → a great deal", "Peu → énormément")
                  : pendImp >= 4
                    ? t("A great deal", "Énormément")
                    : pendImp <= 2
                      ? t("Not much", "Peu")
                      : t("Somewhat", "Moyennement")}
              </span>
            </div>
          </div>
        )}
      </div>
      <button
        className={busy ? "btn busy" : "btn"}
        type="button"
        disabled={pendAns == null || busy}
        onClick={submitAnswer}
      >
        {idx + 1 === qs.length
          ? t("Finish part →", "Terminer la partie →")
          : t("Next →", "Suivant →")}
      </button>
      {q.notYet && (
        <button
          className="btn ghost"
          type="button"
          onClick={answerNotYet}
          disabled={busy}
        >
          {t("Not yet", "Pas encore")}
        </button>
      )}
      {/* Open questions demand typed text to advance, and not one of them
          carries the "Not yet" flag — so someone who isn't ready to write about
          their past had no way forward but the ×, which abandons the whole
          part. They never score (scoring.ts), so skipping costs nothing. */}
      {q.type === "open" && !q.notYet && (
        <button
          className="btn ghost"
          type="button"
          onClick={() => advance(idx)}
          disabled={busy}
        >
          {t("Skip for now", "Passer pour l’instant")}
        </button>
      )}
      <div className="hint">
        {t(`${idx + 1} OF ${qs.length}`, `${idx + 1} SUR ${qs.length}`)}
        {pendAns != null
          ? t(" · TAP NEXT WHEN READY", " · APPUYEZ SUR SUIVANT")
          : q.type === "open"
            ? t(" · OPEN REFLECTION", " · RÉFLEXION LIBRE")
            : q.type === "rank"
              ? // Ranking is the one input where "how far along am I?" isn't
                // obvious, and Next just sat dead until the last tap.
                rankOrder.length > 0
                ? t(
                    ` · RANKED ${rankOrder.length} OF ${q.opts?.length ?? 0}`,
                    ` · ${rankOrder.length} SUR ${q.opts?.length ?? 0} CLASSÉS`,
                  )
                : t(" · RANK YOUR ORDER", " · CLASSEZ PAR ORDRE")
              : t(" · TAP TO ANSWER", " · APPUYEZ POUR RÉPONDRE")}
      </div>
    </section>
  );
}

function QuestionInput({
  q,
  value,
  guess,
  onPick,
  rankOrder,
  setRankOrder,
  setPend,
}: {
  q: Question;
  value: AnswerValue | null;
  guess?: boolean;
  onPick: (v: AnswerValue) => void;
  rankOrder: number[];
  setRankOrder: (v: number[]) => void;
  setPend: (v: AnswerValue | null) => void;
}) {
  const t = useT();
  if (q.type === "scale") {
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
              className={`orb ${value === i ? "sel" : ""}`}
              onClick={() => onPick(i)}
              aria-pressed={value === i}
              aria-label={`${i} — ${i >= 4 ? q.hi : i <= 2 ? q.lo : t("in the middle", "au milieu")}`}
            >
              {i}
            </button>
          ))}
        </div>
        {/* Live label anchored under the chosen orb — names the middle so the
            user never has to work out "is 3 neutral or a lean?" (Pillar 3). */}
        <div className="orblabels" aria-hidden={value == null}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="orblabel-cell">
              {value === i && (
                <>
                  <span className="caret" />
                  <span className="orblabel">
                    {t(SCALE_WORDS[i - 1], SCALE_WORDS_FR[i - 1])}
                  </span>
                </>
              )}
            </div>
          ))}
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
        onChange={(e) => setPend(e.target.value.trim() === "" ? null : e.target.value)}
      />
    );
  }
  if (q.type === "rank") {
    return (
      <>
        <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
          {t(
            "Tap in order of priority — 1 = most important. Tap a number again to remove it.",
            "Appuyez par ordre de priorité — 1 = le plus important. Appuyez à nouveau pour retirer.",
          )}
        </div>
        {q.opts?.map((o, i) => {
          const pos = rankOrder.indexOf(i);
          const ranked = pos >= 0;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={ranked}
              aria-label={
                ranked
                  ? t(`${o}, ranked ${pos + 1}`, `${o}, classé ${pos + 1}`)
                  : t(`${o}, not ranked`, `${o}, non classé`)
              }
              className={`opt rankopt ${ranked ? "sel" : ""}`}
              onClick={() => {
                const next = [...rankOrder];
                const p = next.indexOf(i);
                if (p >= 0) next.splice(p, 1);
                else next.push(i);
                // The final tap was pure ceremony — with one option left there
                // is only one possible order, so complete it for them.
                const total = q.opts!.length;
                if (next.length === total - 1) {
                  const last = q.opts!.findIndex((_, k) => !next.includes(k));
                  if (last >= 0) next.push(last);
                }
                setRankOrder(next);
                setPend(next.length === total ? next.join(",") : null);
              }}
            >
              <span className="rankno" key={pos}>
                {ranked ? pos + 1 : ""}
              </span>
              <span style={{ flex: 1 }}>{o}</span>
            </button>
          );
        })}
      </>
    );
  }
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
