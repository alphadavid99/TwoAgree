import { PctRing } from "./Ring";

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
}: {
  agreed: number;
  known: number | null;
  size?: number;
  t: (en: string, fr: string) => string;
  // In the ceremony the rings are the show: they draw slower and Known follows
  // Agreed as a second beat. Elsewhere (the answers screen, reviews) they settle
  // at the quicker default so reopening a reveal isn't a performance.
  ceremony?: boolean;
}) {
  const drawMs = ceremony ? 1400 : undefined;
  if (known == null) {
    return (
      <div className="center" style={{ margin: "16px 0 6px" }}>
        <PctRing
          pct={agreed}
          size={size + 28}
          label={t("agreed", "d’accord")}
          drawMs={drawMs}
        />
      </div>
    );
  }
  return (
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
  );
}
