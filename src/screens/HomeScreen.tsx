import { useState } from "react";
import { DECKS } from "../lib/questions";
import { nLevels, lvlQs } from "../lib/leveling";
import { curLevel, doneInLevel, catComplete } from "../lib/progress";
import { other, type DeckData, type Role } from "../lib/scoring";
import { createInvite } from "../lib/functions";
import { prettyError } from "../lib/errors";
import type { Session } from "../types";
import { ProgressRing } from "../components/Ring";
import { Avatar } from "../components/Avatar";

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning." : h < 18 ? "Good afternoon." : "Good evening.";
}

export default function HomeScreen({
  code,
  session,
  role,
  slug,
  onPlay,
  onBrowse,
}: {
  code: string;
  session: Session;
  role: Role;
  slug: string;
  onPlay: (slug: string) => void;
  onBrowse: () => void;
}) {
  const deck: DeckData | undefined = session.decks?.[slug];
  const myName = session.members?.[role]?.name ?? "You";
  const partner = session.members?.[other(role)];
  const partnerName = partner?.name ?? "your partner";
  const joined = !!partner;

  const L = nLevels(slug);
  const lvl = curLevel(slug, deck, role);
  const lvlTotal = lvlQs(slug, lvl).length;
  const mine = doneInLevel(slug, lvl, deck, role);
  const theirs = doneInLevel(slug, lvl, deck, other(role));
  const allDone = catComplete(slug, deck, role);

  const cta = allDone
    ? "See your alignment →"
    : L > 1
      ? mine > 0
        ? `Continue Level ${lvl + 1} →`
        : `Start Level ${lvl + 1} →`
      : mine > 0
        ? "Continue →"
        : "Start answering →";

  const [inviteMsg, setInviteMsg] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);

  const share = () => {
    const txt = `Join me on aligned — our code is ${code}`;
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(code);
  };

  const sendInviteLink = async () => {
    setInviteBusy(true);
    setInviteMsg("");
    try {
      const res = await createInvite({ code });
      const link = `${window.location.origin}/?t=${res.data.token}`;
      const txt = `Join me on aligned — ${link}`;
      if (navigator.share) await navigator.share({ text: txt }).catch(() => {});
      else if (navigator.clipboard) await navigator.clipboard.writeText(link);
      setInviteMsg("Invite link ready — sent to your share sheet or copied.");
    } catch (e) {
      setInviteMsg(prettyError(e));
    } finally {
      setInviteBusy(false);
    }
  };

  return (
    <section>
      <p className="muted center" style={{ marginTop: 20, fontSize: 14 }}>
        {greeting()}
      </p>

      {!joined && (
        <div className="banner" style={{ marginTop: 16 }}>
          Share your code so your partner can join:{" "}
          <button className="codechip" type="button" onClick={share}>
            {code}
          </button>
          <button
            className="btn out"
            type="button"
            style={{ marginTop: 14 }}
            onClick={sendInviteLink}
            disabled={inviteBusy}
          >
            {inviteBusy ? "Creating link…" : "Send an invite link instead"}
          </button>
          {inviteMsg && (
            <div style={{ marginTop: 8, fontSize: 13 }}>{inviteMsg}</div>
          )}
        </div>
      )}

      <div className="qcard" style={{ textAlign: "center", padding: "32px 26px 36px", marginTop: 16 }}>
        <div className="avstack">
          <Avatar name={myName} tone="berry" />
          {joined ? (
            <Avatar name={partnerName} tone="honey" />
          ) : (
            <div className="avatar-disc avatar-wait" style={{ width: 46, height: 46 }}>
              ?
            </div>
          )}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, margin: "8px 0 14px" }}>
          {myName} &amp; {joined ? partnerName : "…"}
        </div>
        <button className="badge tap" type="button" onClick={onBrowse}>
          {DECKS[slug].name} &#9662;
        </button>
        {L > 1 && (
          <div className="muted" style={{ fontSize: 13, marginTop: 8, letterSpacing: 1 }}>
            LEVEL {lvl + 1} OF {L}
          </div>
        )}
        <div style={{ marginTop: 18 }}>
          <ProgressRing done={mine} total={lvlTotal} size={116} />
        </div>
        <div style={{ margin: "16px 0 22px", fontSize: 15, color: "var(--sub)" }}>
          {joined ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Avatar name={partnerName} tone="honey" size={26} ring={false} />
              <span>
                <b style={{ color: "var(--ink)" }}>{partnerName}</b> {theirs}/{lvlTotal}
                {L > 1 ? " this level" : ""}
              </span>
            </span>
          ) : (
            <span className="muted">Waiting for your partner to join…</span>
          )}
        </div>
        <button className="btn" type="button" onClick={() => onPlay(slug)}>
          {cta}
        </button>
        <div className="link" style={{ marginTop: 18, fontSize: 14 }} onClick={onBrowse}>
          Browse all decks
        </div>
      </div>
    </section>
  );
}
