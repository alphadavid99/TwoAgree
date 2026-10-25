import { useState } from "react";
import { PctRing } from "./Ring";
import { HowScores } from "./HowScores";

// The two axes of a reveal, side by side at equal weight (brief §3a): agreement
// (how close your answers are) and Known (how well you predicted each other).
// When nothing was guessable yet, Known has no value — we show agreement alone
// rather than a hollow "—", so the pair never implies a missing score.
export function ScorePair({
  agreed,
  known,
  size = 132,
  t,
  ceremony = false,
  basis,
  right = 0,
  made = 0,
}: {
  agreed: number;
  known: number | null;
  /** Questions the Agree score stands on (scoring version 2: always shown). */
  basis?: number;
  /** Known's count: guesses right, of guesses made. */
  right?: number;
  made?: number;
  size?: number;
  t: (en: string, fr: string) => string;
  // In the ceremony the rings are the show: they draw slower and Known follows
  // Agreed as a second beat. Elsewhere (the answers screen, reviews) they settle
  // at the quicker default so reopening a reveal isn't a performance.
  ceremony?: boolean;
}) {
  const drawMs = ceremony ? 1400 : undefined;
  const [how, setHow] = useState(false);
  // Every score carries its count, and a way to find out what's in it.
  const counts =
    basis == null ? null : (
      <>
        <p className="score-basis">
          {t(
            `Based on ${basis} question${basis === 1 ? "" : "s"} you both answered`,
            `Sur ${basis} question${basis === 1 ? "" : "s"} auxquelles vous avez tous deux répondu`,
          )}
          {known != null && made > 0 && (
            <>
              <br />
              {t(`${right} of ${made} guesses right`, `${right} intuitions justes sur ${made}`)}
            </>
          )}
        </p>
        <button className="howlink" type="button" onClick={() => setHow(true)}>
          {t("How scores work", "Comment fonctionnent les scores")}
        </button>
        {how && (
          <HowScores
            agree={{ pct: agreed, basis }}
            known={{ pct: known, right, made }}
            onClose={() => setHow(false)}
          />
        )}
      </>
    );
  if (known == null) {
    return (
      <>
        <div className="center" style={{ margin: "16px 0 6px" }}>
          <PctRing
            pct={agreed}
            size={size + 28}
            label={t("agreed", "d’accord")}
            drawMs={drawMs}
          />
        </div>
        {counts}
      </>
    );
  }
  return (
    <>
    <div className="scorepair">
      <PctRing
        pct={agreed}
        size={size}
        color="var(--honey)"
        label={t("agreed", "d’accord")}
        drawMs={drawMs}
      />
      <PctRing
        pct={known}
        size={size}
        color="var(--berry)"
        label={t("known", "connus")}
        drawMs={drawMs}
        delayMs={ceremony ? 620 : 0}
      />
    </div>
    {counts}
    </>
  );
}
