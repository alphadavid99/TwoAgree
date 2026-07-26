import { useState } from "react";
import { talkList, type TalkState } from "../lib/talks";
import { writeTalked, writeTalkPin } from "../lib/session";
import type { Session } from "../types";
import type { Role } from "../lib/scoring";
import { localizeQuestion } from "../lib/questions.fr";
import { useLang } from "../lib/i18n";

type T = (en: string, fr: string) => string;

// The couple's agenda (UX review §6). The app's whole purpose is to feed
// conversation, but the loop ended at reading: "Worth a conversation." was a
// dead note, and the same differences resurfaced identically forever. Here the
// things they pinned are gathered in one place — and, crucially, can be closed:
// both partners confirming turns a topic from a standing item into something
// they did. That confirmation is the one moment worth celebrating, because
// talking is the behaviour the product exists to create.
export function TalkList({
  session,
  role,
  code,
  partnerName,
  t,
}: {
  session: Session;
  role: Role;
  code: string;
  partnerName: string;
  t: T;
}) {
  const lang = useLang();
  // First names only — these strings are sentences, and "Judah Michael says
  // you've talked" reads like a summons.
  const them = partnerName.trim().split(/\s+/)[0] || partnerName;
  const { open, closed } = talkList(session.decks, role);
  // The topic that just closed, so the moment is marked rather than the row
  // silently vanishing.
  const [justClosed, setJustClosed] = useState<string | null>(null);

  if (!open.length && !closed.length) return null;

  const confirm = async (s: TalkState) => {
    // Both sides in means it closes on this tap — hold the moment first.
    if (s.talkedByThem) setJustClosed(s.q.id);
    await writeTalked(code, s.slug, s.q.id, role, true);
    setTimeout(() => setJustClosed(null), 2600);
  };

  return (
    <div className="talkwrap">
      <div className="shead" style={{ marginTop: 26 }}>
        {t("What you said you'd talk about", "Ce dont vous vouliez parler")}
      </div>

      {open.map((s) => {
        const q = localizeQuestion(s.q, lang);
        return (
          <div key={s.q.id} className="talkrow">
            <div className="talkrow-q">{q.q}</div>
            {s.talkedByMe ? (
              <div className="talkrow-wait">
                {t(
                  `You've marked this talked about, waiting for ${them}.`,
                  `Vous avez marqué en avoir parlé, en attente de ${them}.`,
                )}
              </div>
            ) : s.talkedByThem ? (
              <button className="talkbtn go" type="button" onClick={() => confirm(s)}>
                {t(
                  `${them} says you've talked: agree?`,
                  `${them} dit que vous en avez parlé, d'accord ?`,
                )}
              </button>
            ) : (
              <button className="talkbtn" type="button" onClick={() => confirm(s)}>
                {t("We talked about it", "Nous en avons parlé")}
              </button>
            )}
            <button
              className="talkdrop"
              type="button"
              onClick={() => void writeTalkPin(code, s.slug, s.q.id, role, false)}
            >
              {t("Remove", "Retirer")}
            </button>
          </div>
        );
      })}

      {closed.length > 0 && (
        <div className="talkdone">
          {/* Closed topics stay as evidence they did the thing, rather than
              vanishing as though the conversation never happened. */}
          <span className="talkdone-n">{closed.length}</span>
          {t(
            closed.length === 1 ? "conversation you've had" : "conversations you've had",
            closed.length === 1 ? "conversation que vous avez eue" : "conversations que vous avez eues",
          )}
        </div>
      )}

      {justClosed && (
        <div className="talkcheer" role="status">
          <span className="talkcheer-mark" aria-hidden="true">
            ✓
          </span>
          {t("You talked about it. That's the whole point.", "Vous en avez parlé. C'est tout l'objectif.")}
        </div>
      )}
    </div>
  );
}
