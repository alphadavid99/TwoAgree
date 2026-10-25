import { useEffect, useState } from "react";
import { renderShareCard, shareCardImage } from "../lib/sharecard";
import { revealWords } from "../lib/reveal";

type T = (en: string, fr: string) => string;
type Stat = { pct: number | null; done: number; total: number; right?: number; made?: number };

// The share card (brief 2 §C9). Leads with Known; denominator shown; no
// leaderboard, ever (the no-competition constant). A couple screenshots this.
// Exported because the Path's Lookout hands the couple the same keepsake — one
// card renderer, so the two milestones can't drift into two different objects.
export function ShareCard({
  agreed,
  known,
  myName,
  partnerName,
  conversations,
  story,
  closest,
  t,
  onClose,
}: {
  agreed: Stat;
  known: Stat;
  myName: string;
  partnerName: string;
  conversations: { done: number; total: number };
  /** Overrides the card's story line (the Lookout writes its own). */
  story?: string;
  closest?: string;
  t: T;
  onClose: () => void;
}) {
  // What goes on the card is the couple's choice. Agreement is OFF by default:
  // a percentage about how much two people agree is the most private number
  // here, and it should never leave the app because a button was easy to tap.
  const [withKnown, setWithKnown] = useState(known.pct != null);
  const [withAgreed, setWithAgreed] = useState(false);
  const [withClosest, setWithClosest] = useState(!!closest);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const fields = {
    myName,
    partnerName,
    conversationsDone: conversations.done,
    conversationsTotal: conversations.total,
    story,
    known:
      withKnown && known.pct != null
        ? { pct: known.pct, done: known.done, total: known.total, right: known.right, made: known.made }
        : undefined,
    agreed: withAgreed && agreed.pct != null ? { pct: agreed.pct, done: agreed.done, total: agreed.total } : undefined,
    closest: withClosest ? closest : undefined,
    // The encouragement line and verse ride only with the Agree score (item 2).
    words:
      withAgreed && agreed.pct != null
        ? revealWords(agreed.pct, null, `${myName}|${partnerName}|card`)
        : undefined,
  };
  const key = JSON.stringify(fields);

  // Re-render the card whenever a choice changes, so the preview IS the artifact
  // — what they see is exactly the PNG that leaves the app.
  useEffect(() => {
    let dead = false;
    let url = "";
    void renderShareCard(fields).then((blob) => {
      if (dead || !blob) return;
      url = URL.createObjectURL(blob);
      setPreview(url);
    });
    return () => {
      dead = true;
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const share = async () => {
    if (busy) return;
    setBusy(true);
    setNote("");
    const blob = await renderShareCard(fields);
    if (!blob) {
      setBusy(false);
      setNote(t("Couldn’t make the card: try again.", "Impossible de créer la carte, réessayez."));
      return;
    }
    const outcome = await shareCardImage(
      blob,
      `twoagree-${myName.trim().split(/\s+/)[0].toLowerCase()}-and-${partnerName.trim().split(/\s+/)[0].toLowerCase()}.png`,
      t(
        `${myName} & ${partnerName} on TwoAgree`,
        `${myName} & ${partnerName} sur TwoAgree`,
      ),
    );
    setBusy(false);
    // Only ever claim what actually happened — a dismissed sheet says nothing.
    if (outcome === "downloaded") setNote(t("Saved to your device.", "Enregistré sur votre appareil."));
    if (outcome === "failed") setNote(t("Couldn’t share that: try again.", "Partage impossible, réessayez."));
  };

  // A dialog you can't dismiss from the keyboard isn't a dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const Toggle = ({
    on,
    set,
    label,
  }: {
    on: boolean;
    set: (v: boolean) => void;
    label: string;
  }) => (
    <button
      type="button"
      className={`cardopt${on ? " on" : ""}`}
      onClick={() => set(!on)}
      aria-pressed={on}
    >
      {label}
    </button>
  );

  return (
    <div
      className="sharewrap"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("Share your card", "Partager votre carte")}
    >
      <div className="sharesheet" onClick={(e) => e.stopPropagation()}>
        {preview ? (
          <img className="sharepreview" src={preview} alt="" />
        ) : (
          <div className="sharepreview loading" />
        )}

        <div className="cardopts">
          {known.pct != null && (
            <Toggle
              on={withKnown}
              set={setWithKnown}
              label={t("How well you know each other", "Ce que vous savez l’un de l’autre")}
            />
          )}
          {closest && (
            <Toggle
              on={withClosest}
              set={setWithClosest}
              label={t(`Closest on ${closest}`, `Plus proches sur ${closest}`)}
            />
          )}
          {agreed.pct != null && (
            <Toggle
              on={withAgreed}
              set={setWithAgreed}
              label={t("How much you agree", "Votre niveau d’accord")}
            />
          )}
        </div>

        <button
          className={busy ? "btn pill busy" : "btn pill"}
          type="button"
          onClick={share}
          disabled={busy}
        >
          {busy ? t("One moment…", "Un instant…") : t("Share this card", "Partager cette carte")}
        </button>
        {note && <div className="ok center">{note}</div>}
        <button className="btn ghost" type="button" onClick={onClose}>
          {t("Close", "Fermer")}
        </button>
      </div>
    </div>
  );
}
