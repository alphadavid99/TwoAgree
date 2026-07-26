import { useEffect, useState } from "react";
import { renderShareCard, shareCardImage } from "../lib/sharecard";

type T = (en: string, fr: string) => string;
type Stat = { pct: number | null; done: number; total: number };

// The Core headline (brief 2 §C). Two numbers computed over the fixed 70-question
// instrument, each with its denominator on screen (§C7) — a 71% over 70 is a
// brag, a 94% over 9 is not, and the denominator keeps them apart. Known is the
// hero (§C8): Agreed has a ceiling problem (100% = two identical people), Known
// doesn't. So Known leads, larger and warmer.
export function CoreScore({
  agreed,
  known,
  myName,
  partnerName,
  conversations,
  closest,
  t,
}: {
  agreed: Stat;
  known: Stat;
  myName: string;
  partnerName: string;
  /** Conversations finished / total — the card's headline, never a score. */
  conversations?: { done: number; total: number };
  closest?: string;
  t: T;
}) {
  const [sharing, setSharing] = useState(false);
  const complete = agreed.done >= agreed.total;
  return (
    <div className="core">
      <div className="core-stats">
        <div className="corestat hero known">
          <div className="corenum">
            {known.pct ?? "—"}
            <span>%</span>
          </div>
          <div className="corelb">{t("Known", "Connus")}</div>
          <div className="coredenom">
            {known.done} / {known.total}
          </div>
        </div>
        <div className="corestat agreed">
          <div className="corenum">
            {agreed.pct ?? "—"}
            <span>%</span>
          </div>
          <div className="corelb">{t("Agreed", "D’accord")}</div>
          <div className="coredenom">
            {agreed.done} / {agreed.total}
          </div>
        </div>
      </div>

      {/* Coverage is the flex, not a hedge. It used to read "it isn't yours
          until you finish it" — telling a couple that something they've partly
          earned is being withheld is loss-aversion, which CLAUDE.md §1 rules
          out. Same pull, phrased as an invitation. */}
      <p className="core-pull">
        {complete
          ? t("You’ve finished the Core together.", "Vous avez terminé le Cœur ensemble.")
          : t(
              `${agreed.done} of ${agreed.total} — the picture fills in as you answer.`,
              `${agreed.done} sur ${agreed.total} — le tableau se complète à mesure que vous répondez.`,
            )}
      </p>

      {agreed.done > 0 && (
        <button className="btn out" type="button" onClick={() => setSharing(true)}>
          {t("Share your card", "Partager votre carte")}
        </button>
      )}

      {sharing && (
        <ShareCard
          agreed={agreed}
          known={known}
          myName={myName}
          partnerName={partnerName}
          conversations={conversations ?? { done: 0, total: 21 }}
          closest={closest}
          t={t}
          onClose={() => setSharing(false)}
        />
      )}
    </div>
  );
}

// The share card (brief 2 §C9). Core only — a number earned over anything else
// is a lie the moment two couples compare. Leads with Known; denominator shown;
// no leaderboard, ever (the no-competition constant). A couple screenshots this.
function ShareCard({
  agreed,
  known,
  myName,
  partnerName,
  conversations,
  closest,
  t,
  onClose,
}: {
  agreed: Stat;
  known: Stat;
  myName: string;
  partnerName: string;
  conversations: { done: number; total: number };
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
    known: withKnown && known.pct != null ? { pct: known.pct, done: known.done, total: known.total } : undefined,
    agreed: withAgreed && agreed.pct != null ? { pct: agreed.pct, done: agreed.done, total: agreed.total } : undefined,
    closest: withClosest ? closest : undefined,
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
      setNote(t("Couldn’t make the card — try again.", "Impossible de créer la carte — réessayez."));
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
    if (outcome === "failed") setNote(t("Couldn’t share that — try again.", "Partage impossible — réessayez."));
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
