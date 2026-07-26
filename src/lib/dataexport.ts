// A readable copy of your data.
//
// exportMyData returns the raw RTDB records — correct for portability, and
// unreadable for a human: `{"FAITH-019":{"host":3}}` tells a person nothing
// about what they were asked or what they said. For an app holding
// special-category answers about real couples, "here is everything we hold"
// has to actually be legible, or the right of access is technically satisfied
// and practically denied. So the raw JSON stays available and this renders the
// same data as a plain document.
//
// SCOPE, deliberately: only the subject's OWN answers, guesses and importance.
// The raw session records also carry the partner's answers (they share the
// node), but re-typesetting another person's special-category data into a
// tidy document is a different act from handing back a database dump —
// see the note in ProfileScreen. Flagged for Dave; the conservative reading
// is the one implemented here.
import { DECKS, ORDER } from "./questions";
import { deckName } from "./questions.fr";
import { questionOf, AT_TABLE_SLUG, stepMeta } from "./path";
import { INTAKE } from "../data/path.generated";
import type { Lang } from "./i18n";

type Role = "host" | "guest";

// The shape exportMyData returns (kept loose: it is a wire payload, and a
// missing branch must degrade to "nothing to show", never to a crash).
export type ExportPayload = {
  exportedAt?: string;
  uid?: string;
  profile?: { name?: string; bio?: string; email?: string; created?: number } | null;
  intake?: { answers?: Record<string, number | number[]> } | null;
  consent?: Record<string, unknown> | null;
  sessions?: Record<string, RawSession> | null;
};

type RoleMap = Partial<Record<Role, unknown>>;
type RawSession = {
  created?: number;
  members?: Partial<Record<Role, { name?: string; uid?: string }>>;
  decks?: Record<
    string,
    {
      answers?: Record<string, RoleMap>;
      guesses?: Record<string, RoleMap>;
      importance?: Record<string, RoleMap>;
    }
  >;
};

const esc = (s: unknown): string =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

const date = (ms?: number): string =>
  ms ? new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

// A stored answer back into the words the person actually saw.
function answerText(qid: string, v: unknown): string {
  const q = questionOf(qid);
  if (v == null) return "—";
  if (!q) return String(v);
  if (q.type === "scale") {
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v);
    return `${n} of 5${q.lo && q.hi ? ` (${q.lo} → ${q.hi})` : ""}`;
  }
  if (q.type === "rank") {
    return String(v)
      .split(",")
      .map((i) => q.opts?.[Number(i)] ?? i)
      .join(" › ");
  }
  if (q.type === "open") return String(v);
  const n = Number(v);
  return q.opts?.[n] ?? String(v);
}

/**
 * Render the export payload as a self-contained HTML document — no scripts, no
 * network, opens in any browser and prints to PDF.
 */
export function renderReadableExport(data: ExportPayload, lang: Lang = "en"): string {
  const T = (en: string, fr: string) => (lang === "fr" ? fr : en);
  const out: string[] = [];
  const uid = data.uid;

  out.push(`<h1>${T("Your TwoAgree data", "Vos données TwoAgree")}</h1>`);
  out.push(
    `<p class="lede">${T(
      "Everything TwoAgree holds that belongs to you, written out in full.",
      "Tout ce que TwoAgree conserve vous concernant, écrit en toutes lettres.",
    )}</p>`,
  );
  out.push(
    `<p class="meta">${T("Prepared", "Établi le")} ${esc(
      data.exportedAt ? new Date(data.exportedAt).toLocaleString() : "—",
    )}</p>`,
  );

  // ---- Profile
  out.push(`<h2>${T("Your profile", "Votre profil")}</h2>`);
  if (data.profile) {
    out.push("<dl>");
    out.push(`<dt>${T("Name", "Nom")}</dt><dd>${esc(data.profile.name) || "—"}</dd>`);
    out.push(`<dt>${T("About you", "À propos de vous")}</dt><dd>${esc(data.profile.bio) || "—"}</dd>`);
    out.push(`<dt>${T("Email", "E-mail")}</dt><dd>${esc(data.profile.email) || "—"}</dd>`);
    out.push(`<dt>${T("Joined", "Inscrit le")}</dt><dd>${esc(date(data.profile.created))}</dd>`);
    out.push("</dl>");
  } else {
    out.push(`<p class="none">${T("No profile stored.", "Aucun profil enregistré.")}</p>`);
  }

  // ---- Consent. Retained past erasure, so it must be visible here.
  out.push(`<h2>${T("Your consent", "Votre consentement")}</h2>`);
  if (data.consent) {
    out.push(
      `<p>${T(
        "You agreed to TwoAgree holding sensitive answers (faith, intimacy, health). This record is kept even if you delete your account — it is the evidence we were permitted to hold your data.",
        "Vous avez accepté que TwoAgree conserve des réponses sensibles (foi, intimité, santé). Cet enregistrement est conservé même après la suppression du compte — c’est la preuve que nous étions autorisés à détenir vos données.",
      )}</p>`,
    );
    out.push(`<pre>${esc(JSON.stringify(data.consent, null, 2))}</pre>`);
  } else {
    out.push(`<p class="none">${T("No consent record.", "Aucun enregistrement de consentement.")}</p>`);
  }

  // ---- Path intake (private to its author — never shown to the partner)
  out.push(`<h2>${T("Your private Path answers", "Vos réponses privées du Chemin")}</h2>`);
  const ia = data.intake?.answers;
  if (ia && Object.keys(ia).length) {
    out.push(
      `<p>${T(
        "These shaped your Path. Your partner has never seen them.",
        "Elles ont façonné votre Chemin. Votre partenaire ne les a jamais vues.",
      )}</p>`,
    );
    out.push("<dl>");
    for (const q of INTAKE) {
      const v = ia[q.id];
      if (v == null) continue;
      const said = Array.isArray(v)
        ? v.map((i) => q.opts[i] ?? i).join(", ")
        : (q.opts[v as number] ?? String(v));
      out.push(`<dt>${esc(q.q)}</dt><dd>${esc(said)}</dd>`);
    }
    out.push("</dl>");
  } else {
    out.push(`<p class="none">${T("You haven’t started the Path.", "Vous n’avez pas commencé le Chemin.")}</p>`);
  }

  // ---- Sessions: the answers themselves
  const sessions = Object.entries(data.sessions ?? {});
  out.push(`<h2>${T("Your answers", "Vos réponses")}</h2>`);
  if (!sessions.length) {
    out.push(`<p class="none">${T("No sessions.", "Aucune session.")}</p>`);
  }
  for (const [code, s] of sessions) {
    const role: Role | null =
      s.members?.host?.uid === uid ? "host" : s.members?.guest?.uid === uid ? "guest" : null;
    const partner = role
      ? s.members?.[role === "host" ? "guest" : "host"]?.name
      : undefined;
    out.push(`<h3>${T("Session", "Session")} ${esc(code)}</h3>`);
    out.push(
      `<p class="meta">${T("Started", "Commencée le")} ${esc(date(s.created))}${
        partner ? ` · ${T("with", "avec")} ${esc(partner)}` : ""
      }</p>`,
    );
    if (!role) {
      out.push(`<p class="none">${T("You are not a member of this session.", "Vous n’êtes pas membre de cette session.")}</p>`);
      continue;
    }

    // The Path's "At the table" prompts live under a synthetic slug keyed by
    // step, not by question id — handled separately so they aren't dropped.
    const table = s.decks?.[AT_TABLE_SLUG]?.answers ?? {};
    const tableRows = Object.entries(table)
      .filter(([, v]) => v?.[role] != null)
      .map(([stepKey, v]) => {
        const meta = stepMeta(stepKey);
        return `<tr><td>${esc(meta?.atTable ?? stepKey)}<span class="q-src">${esc(
          meta?.name ?? stepKey,
        )}</span></td><td>${esc(v[role])}</td><td>—</td></tr>`;
      });

    let any = tableRows.length > 0;
    const body: string[] = [];
    for (const slug of ORDER) {
      const deck = s.decks?.[slug];
      if (!deck) continue;
      const rows: string[] = [];
      for (const q of DECKS[slug].questions) {
        const mine = deck.answers?.[q.id]?.[role];
        const guess = deck.guesses?.[q.id]?.[role];
        const imp = deck.importance?.[q.id]?.[role];
        if (mine == null && guess == null && imp == null) continue;
        rows.push(
          `<tr><td>${esc(q.q)}</td><td>${esc(answerText(q.id, mine))}${
            imp != null ? `<span class="q-src">${T("matters", "importance")} ${esc(imp)}/5</span>` : ""
          }</td><td>${guess == null ? "—" : esc(answerText(q.id, guess))}</td></tr>`,
        );
      }
      if (!rows.length) continue;
      any = true;
      body.push(`<h4>${esc(deckName(slug, lang))}</h4>`);
      body.push(
        `<table><thead><tr><th>${T("Question", "Question")}</th><th>${T(
          "You said",
          "Vous avez dit",
        )}</th><th>${T("You guessed they'd say", "Vous pensiez qu’ils diraient")}</th></tr></thead><tbody>${rows.join(
          "",
        )}</tbody></table>`,
      );
    }
    if (tableRows.length) {
      body.push(`<h4>${T("At the table", "À table")}</h4>`);
      body.push(
        `<table><thead><tr><th>${T("Prompt", "Invitation")}</th><th>${T(
          "You said",
          "Vous avez dit",
        )}</th><th></th></tr></thead><tbody>${tableRows.join("")}</tbody></table>`,
      );
    }
    out.push(
      any
        ? body.join("")
        : `<p class="none">${T("You haven’t answered anything here yet.", "Vous n’avez encore rien répondu ici.")}</p>`,
    );
  }

  out.push(
    `<p class="foot">${T(
      "This document lists your own answers. Your partner's answers belong to them and are not reproduced here. The machine-readable export contains the full session records.",
      "Ce document liste vos propres réponses. Les réponses de votre partenaire lui appartiennent et ne sont pas reproduites ici. L’export lisible par machine contient les enregistrements complets.",
    )}</p>`,
  );

  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8">
<title>${T("Your TwoAgree data", "Vos données TwoAgree")}</title>
<style>
  :root { color-scheme: light }
  body { max-width: 46rem; margin: 3rem auto; padding: 0 1.25rem;
         font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
         color: #2A1120; background: #FBF6F0 }
  h1 { font-size: 1.75rem; margin: 0 0 .25rem }
  h2 { font-size: 1.25rem; margin: 2.5rem 0 .5rem; padding-bottom: .35rem; border-bottom: 2px solid #EADFD8 }
  h3 { font-size: 1.05rem; margin: 1.75rem 0 .25rem }
  h4 { font-size: .95rem; margin: 1.5rem 0 .4rem; color: #5C2E45 }
  .lede { margin: 0 0 .25rem; color: #5C2E45 }
  .meta, .foot { color: #6B5A61; font-size: .85rem }
  .foot { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #EADFD8 }
  .none { color: #6B5A61; font-style: italic }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: .3rem 1.25rem; margin: .5rem 0 }
  dt { color: #6B5A61 }
  dd { margin: 0 }
  table { width: 100%; border-collapse: collapse; margin-bottom: .5rem }
  th, td { text-align: left; vertical-align: top; padding: .5rem .6rem; border-bottom: 1px solid #EADFD8 }
  th { font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; color: #6B5A61 }
  td:first-child { width: 46% }
  .q-src { display: block; font-size: .75rem; color: #6B5A61 }
  pre { background: #fff; border: 1px solid #EADFD8; padding: .75rem; overflow-x: auto; font-size: .8rem }
  @media print { body { margin: 0; background: #fff } }
</style></head><body>
${out.join("\n")}
</body></html>`;
}
