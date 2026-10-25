import { useState } from "react";
import { Sheet } from "../components/Sheet";
import { NOTE_MAX } from "../lib/session";
import type { Question } from "../lib/questions";

type T = (en: string, fr: string) => string;

// Talk it through (design refresh, item 13): three short steps, an optional
// note you both can read, and "We talked about this". In person or on a call;
// nobody has to agree for it to count.
export function TalkGuide({
  q,
  topic,
  partnerName,
  t,
  onDone,
  onClose,
}: {
  q: Question;
  /** The conversation's name, for the eyebrow. */
  topic: string;
  partnerName: string;
  t: T;
  /** Ticks "We talked about this", with the note if one was written. */
  onDone: (note: string) => Promise<void>;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const them = partnerName.trim().split(/\s+/)[0] || partnerName;
  const steps: [string, string, string, string][] = [
    ["Listen", "Écouter", "What shaped your answer? Take it in turns.", "Qu’est-ce qui a forgé votre réponse ? Chacun son tour."],
    ["Understand", "Comprendre", "What did you hear that you didn’t expect?", "Qu’avez-vous entendu d’inattendu ?"],
    ["A next step", "Un pas suivant", "Is there one thing you’d like to try?", "Y a-t-il une chose que vous aimeriez essayer ?"],
  ];
  const done = async () => {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await onDone(note);
      onClose();
    } catch {
      setFailed(true);
      setBusy(false);
    }
  };
  return (
    <Sheet
      eyebrow={`${t("Talk it through", "En parler")} · ${topic}`}
      title={q.q}
      onClose={onClose}
    >
      <ol className="guide-steps">
        {steps.map(([en, fr, pen, pfr], i) => (
          <li key={en}>
            <span className="guide-n" aria-hidden="true">
              {i + 1}
            </span>
            <span>
              <b>{t(en, fr)}</b>
              <span className="helper">{t(pen, pfr)}</span>
            </span>
          </li>
        ))}
      </ol>
      <label className="guide-note">
        <span className="guide-note-lb">
          {t(`One thing we’ll try · optional, shared with ${them}`, `Une chose à essayer · facultatif, partagé avec ${them}`)}
        </span>
        <textarea
          className="input"
          rows={2}
          maxLength={NOTE_MAX}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("e.g. one small thing to try this week", "p. ex. une petite chose à essayer cette semaine")}
        />
      </label>
      <p className="helper center" style={{ margin: "12px 0 0" }}>
        {t("In person or on a call. You don’t have to agree to finish.", "En personne ou par appel. Pas besoin d’être d’accord pour terminer.")}
      </p>
      {failed && (
        <p className="helper center" role="alert" style={{ color: "var(--kit-red)" }}>
          {t("That didn’t save. Check your connection and try again.", "Cela n’a pas été enregistré. Vérifiez votre connexion et réessayez.")}
        </p>
      )}
      <button className={`btn${busy ? " busy" : ""}`} type="button" onClick={done} disabled={busy}>
        {t("We talked about this", "Nous en avons parlé")}
      </button>
      <button className="btn ghost" type="button" onClick={onClose}>
        {t("Not now", "Pas maintenant")}
      </button>
    </Sheet>
  );
}
