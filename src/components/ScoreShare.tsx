import { useEffect, useState } from "react";
import { renderScoreCard, shareCardImage, type ScoreCardFields } from "../lib/sharecard";
import { useT } from "../lib/i18n";
import { Sheet } from "./Sheet";

// "Share your score" from the reveal (design refresh, item 2): a preview of
// the exact image that will be shared, and names only if you switch them on.
// The topic comes from shareTopic(), so sensitive topics are never named.
export function ScoreShare({
  fields,
  names,
  onClose,
}: {
  fields: Omit<ScoreCardFields, "names">;
  /** "Sarah & Judah" — shown on the card only when switched on. */
  names: string;
  onClose: () => void;
}) {
  const t = useT();
  const [withNames, setWithNames] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let live = true;
    void renderScoreCard({ ...fields, ...(withNames ? { names } : {}) })
      .catch(() => null)
      .then((b) => {
        if (!live) return;
        setBlob(b);
        setUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return b ? URL.createObjectURL(b) : null;
        });
      });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withNames]);

  const share = async () => {
    if (!blob) return;
    const out = await shareCardImage(blob, "twoagree-score.png", t("How in step are you two? twoagree.app", "Êtes-vous en phase ? twoagree.app"));
    setStatus(
      out === "downloaded"
        ? t("Saved to your downloads.", "Enregistrée dans vos téléchargements.")
        : out === "failed"
          ? t("We couldn’t share it. Try again.", "Le partage a échoué. Réessayez.")
          : "",
    );
  };

  return (
    <Sheet title={t("Share your score", "Partager votre score")} onClose={onClose}>
      <div className="sharepreview">
        {url ? (
          <img src={url} alt={t("Your score card", "Votre carte de score")} />
        ) : (
          <div className="sharepreview-wait">{t("Preparing your card…", "Préparation de la carte…")}</div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={withNames}
        className="switchrow"
        onClick={() => setWithNames((v) => !v)}
      >
        <span>{t("Include our names", "Inclure nos prénoms")}</span>
        <span className={`switch${withNames ? " on" : ""}`} aria-hidden="true">
          <i />
        </span>
      </button>
      <p className="helper" style={{ margin: "4px 0 0" }}>
        {t(
          "Only the score, its line and the conversation go on the card. Your answers never do.",
          "Seuls le score, sa phrase et la conversation figurent sur la carte. Jamais vos réponses.",
        )}
      </p>
      <button className="btn pill" type="button" disabled={!blob} onClick={share}>
        {t("Share", "Partager")}
      </button>
      {status && (
        <p className="helper center" role="status" style={{ marginTop: 8 }}>
          {status}
        </p>
      )}
      <button className="btn ghost" type="button" onClick={onClose}>
        {t("Not now", "Pas maintenant")}
      </button>
    </Sheet>
  );
}
