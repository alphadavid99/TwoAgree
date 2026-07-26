/**
 * "Your reveal is ready."
 *
 * TwoAgree is an async two-player product with no way to say it's your turn —
 * no push, no email, no badge. Every waiting screen was an unbounded wait, and
 * two screens had to be rewritten because they promised a notification the app
 * could not send. This is the lightest honest channel: one email, at the one
 * moment that is genuinely news — your partner has finished their side, so the
 * reveal you were waiting on is now open.
 *
 * Deliberately NOT sent for: a partner starting, a partner answering some but
 * not all, or anything on a schedule. Nothing here is a nudge, a streak or a
 * reminder that you owe something (CLAUDE.md §1 rules those out). One event,
 * one email, and only when the other person did something for you.
 *
 * The decision logic is pure so the "should this send?" rules are testable
 * without a mail provider or a database.
 */

export type Role = "host" | "guest";

export interface NotifyInput {
  /** Who just finished, i.e. whose write triggered this. */
  finisher: Role;
  /** Had the OTHER partner already finished this level? */
  otherAlreadyDone: boolean;
  /** The recipient's stored preference. Absent/false means no. */
  recipientOptedIn: boolean;
  recipientEmail?: string | null;
  /** Epoch ms of the last email we sent this recipient, if any. */
  lastNotifiedMs?: number | null;
  nowMs: number;
}

export type NotifyDecision =
  | { send: false; reason: string }
  | { send: true; to: string; recipient: Role };

/** A couple blitzing five decks in one sitting should get one email, not five. */
export const QUIET_MS = 6 * 60 * 60 * 1000;

export function shouldNotify(i: NotifyInput): NotifyDecision {
  // The reveal only opens when BOTH have finished. If the other partner hasn't,
  // nothing has become available to anyone and there is no news to send.
  if (!i.otherAlreadyDone) return { send: false, reason: "partner not finished" };

  // The recipient is the one who was waiting — the partner who finished first.
  const recipient: Role = i.finisher === "host" ? "guest" : "host";

  // Opt-in is explicit. Emailing about special-category activity because a
  // checkbox defaulted to on is not consent.
  if (!i.recipientOptedIn) return { send: false, reason: "not opted in" };
  if (!i.recipientEmail) return { send: false, reason: "no email on file" };

  if (i.lastNotifiedMs != null && i.nowMs - i.lastNotifiedMs < QUIET_MS) {
    return { send: false, reason: "within quiet window" };
  }

  return { send: true, to: i.recipientEmail, recipient };
}

export interface MailCopy {
  subject: string;
  text: string;
  html: string;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/**
 * The email itself. It names no question and no answer — only that the other
 * person has finished and the reveal is open. An inbox is not a private place,
 * and the subject line may show on a lock screen in front of anyone.
 */
export function revealReadyEmail(opts: {
  partnerName: string;
  appUrl: string;
}): MailCopy {
  const who = opts.partnerName.trim().split(/\s+/)[0] || "Your partner";
  const subject = `${who} has answered — your reveal is ready`;
  const line = `${who} has finished their side. Whenever the two of you are together, it's there waiting.`;
  const text = [
    subject,
    "",
    line,
    "",
    `Open it: ${opts.appUrl}`,
    "",
    "— TwoAgree",
    "“Can two walk together, unless they are agreed?” Amos 3:3",
    "",
    `To stop these emails, turn them off in the app under You → When ${who} answers.`,
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#F8E9EC">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8E9EC">
<tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="max-width:480px;background:#FFFFFF;border-radius:22px;padding:32px 28px;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
                color:#2A1120">
    <tr><td>
      <div style="font-size:12px;font-weight:700;letter-spacing:.18em;color:#8F5A12;
                  text-transform:uppercase">TwoAgree</div>
      <h1 style="margin:14px 0 0;font-size:22px;line-height:1.3;color:#3E1A2E">
        ${esc(who)} has answered.</h1>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#6B5A61">${esc(line)}</p>
      <p style="margin:26px 0 0">
        <a href="${esc(opts.appUrl)}"
           style="display:inline-block;background:#E5A93C;color:#3A2410;text-decoration:none;
                  font-weight:700;font-size:15px;padding:14px 26px;border-radius:999px">
          Open your reveal</a>
      </p>
      <p style="margin:28px 0 0;font-size:13px;font-style:italic;color:#6B5A61">
        &ldquo;Can two walk together, unless they are agreed?&rdquo; &middot; Amos 3:3</p>
      <p style="margin:20px 0 0;padding-top:16px;border-top:1px solid #EADFD8;
                font-size:12px;color:#6B5A61">
        You're getting this because you asked to hear when ${esc(who)} answers.
        Turn it off any time in the app under <strong>You</strong>.</p>
    </td></tr>
  </table>
</td></tr></table></body></html>`;

  return { subject, text, html };
}
