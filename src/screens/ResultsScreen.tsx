import { revealedRows, overallAll, knownAll, isCore } from "../lib/results";
import { other, scoreQ, type Role } from "../lib/scoring";
import type { Session } from "../types";
import { CoreScore } from "./CoreScore";
import { TalkList } from "./TalkList";
import { Discoveries } from "./Discoveries";
import { revealedQs, catComplete } from "../lib/progress";
import { ORDER } from "../lib/questions";
import { DeckIcon } from "../components/icons";
import { collectFlagRows } from "../lib/flags";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { useT, useLang } from "../lib/i18n";

// Overall alignment across every mutually-revealed level — a deck counts as
// soon as the two of you have finished any level of it, not only when the
// whole deck is done. Partial decks show which levels are in.
export default function ResultsScreen({
  session,
  role,
  code,
  onOpen,
  onOpenFlags,
}: {
  session: Session;
  role: Role;
  code?: string;
  onOpen?: (slug: string) => void;
  onOpenFlags?: () => void;
}) {
  const t = useT();
  const lang = useLang();

  // The headline is the fixed Core, computed over the 70 and nothing else
  // (brief 2 §C6). It exists from question one — a finished Fun barely moves it,
  // and the denominator on screen keeps a big number honest.
  const coreAgreed = overallAll(session.decks, role, isCore);
  const coreKnown = knownAll(session.decks, role, isCore);
  const myName = session.members?.[role]?.name ?? t("You", "Vous");
  const partnerName =
    session.members?.[other(role)]?.name ?? t("your partner", "votre partenaire");

  // Per-conversation rows stay local (not Core) — the lowest deck is the topic
  // most worth a conversation, so rank ascending and name it.
  const { rows } = revealedRows(session.decks, role);
  const ranked = [...rows].sort((a, b) => a.pct - b.pct);
  const lowest = ranked[0];
  const closest = ranked[ranked.length - 1];
  const showSynth = ranked.length >= 2 && lowest.slug !== closest.slug;
  const completeCount = ORDER.filter((s) =>
    catComplete(s, session.decks?.[s], role),
  ).length;

  // The two or three questions behind "most worth a conversation".
  const gaps = showSynth
    ? revealedQs(lowest.slug, session.decks?.[lowest.slug], role)
        .map((q) => ({ q: localizeQuestion(q, lang), r: scoreQ(q, session.decks?.[lowest.slug] ?? {}, role) }))
        .filter(({ q, r }) => r.verdict === "Worth a chat" && q.type === "mc")
        .slice(0, 2)
        .map(({ q, r }) => ({
          q,
          a: q.opts?.[Number(r.me)] ?? "—",
          b: q.opts?.[Number(r.th)] ?? "—",
        }))
    : [];

  // Flags across every revealed question, not just one deck's reveal.
  const allFlags = rows.reduce(
    (n, r) =>
      n +
      collectFlagRows(
        revealedQs(r.slug, session.decks?.[r.slug], role),
        session.decks?.[r.slug] ?? {},
        role,
      ).length,
    0,
  );

  // Day zero. Before the first reveal this tab was machinery with nothing in
  // it: two rings reading "—%", an empty agenda, an empty discoveries list.
  // A new couple's first impression of the thing the whole app is FOR should
  // be the promise, not an empty instrument panel.
  if (coreAgreed.done === 0 && rows.length === 0) {
    const previews: [string, string, string, string][] = [
      [
        "star",
        "Two numbers",
        "How much you agree, and how well you actually know each other.",
        "À quel point vous êtes d’accord, et à quel point vous vous connaissez vraiment.",
      ],
      [
        "heart",
        "What surprised you",
        "Every answer one of you didn't see coming, kept in one place.",
        "Chaque réponse que l’un de vous n’avait pas vue venir, réunie en un seul endroit.",
      ],
      [
        "chat",
        "Your agenda",
        "The questions you both pinned as worth a proper conversation.",
        "Les questions que vous avez tous deux marquées comme méritant une vraie conversation.",
      ],
    ];
    const names: [string, string] = [
      `This is where ${myName.split(/\s+/)[0]} and ${partnerName.split(/\s+/)[0]} meet.`,
      `C’est ici que ${myName.split(/\s+/)[0]} et ${partnerName.split(/\s+/)[0]} se retrouvent.`,
    ];
    return (
      <section>
        <div className="eyebrow center" style={{ marginTop: 24 }}>
          {t("The two of you", "Vous deux")}
        </div>
        <h1 className="h1 center" style={{ margin: "8px 0 10px" }}>
          {t(...names)}
        </h1>
        <p className="sub center" style={{ margin: "0 18px 20px" }}>
          {t(
            "Nothing here yet: it fills in the moment you've both answered your first conversation.",
            "Rien ici pour l’instant, cela se remplit dès que vous avez tous deux répondu à votre première conversation.",
          )}
        </p>
        <div className="daycard">
          {previews.map(([glyph, h, en, fr]) => (
            <div className="dayrow" key={h}>
              <span className="dayglyph" aria-hidden="true">
                <DeckIcon icon={glyph} size={17} />
              </span>
              <span className="daytxt">
                <b>{t(h, h === "Two numbers" ? "Deux chiffres" : h === "Your agenda" ? "Votre ordre du jour" : "Ce qui vous a surpris")}</b>
                <i>{t(en, fr)}</i>
              </span>
            </div>
          ))}
        </div>
        {onOpen && (
          <button className="btn pill" type="button" onClick={() => onOpen(ORDER[0])}>
            {t("Start your first conversation →", "Commencer votre première conversation →")}
          </button>
        )}
      </section>
    );
  }

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        {t("The two of you", "Vous deux")}
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 12px" }}>
        {t("Where you landed", "Où vous en êtes")}
      </h1>

      <CoreScore
        agreed={coreAgreed}
        known={coreKnown}
        myName={myName}
        partnerName={partnerName}
        conversations={{ done: completeCount, total: ORDER.length }}
        closest={closest ? deckName(closest.slug, lang) : undefined}
        t={t}
      />

      {/* The couple's agenda: what they said they'd talk about, and what they
          have. Nothing carried a couple from "worth a chat" to an actual chat
          before this, and nothing marked the talking as having happened. */}
      {code && (
        <TalkList
          session={session}
          role={role}
          code={code}
          partnerName={partnerName}
          t={t}
        />
      )}

      <Discoveries session={session} role={role} partnerName={partnerName} t={t} />

      {/* Flags only ever existed inside one deck's reveal — the couple could
          never see "the things we didn't know about each other" in one place. */}
      {allFlags > 0 && onOpenFlags && (
        <button className="flagbox" type="button" onClick={onOpenFlags}>
          <span className="flagbox-n">{allFlags}</span>
          <span>
            <b>{t("Worth a closer look", "À regarder de plus près")}</b>
            <span className="flagbox-sub">
              {t(
                "Across everything you've revealed together.",
                "Sur tout ce que vous avez révélé ensemble.",
              )}
            </span>
          </span>
        </button>
      )}

      {rows.length > 0 && (
        <>
          <div className="shead" style={{ marginTop: 24 }}>
            {t("By conversation", "Par conversation")}
          </div>

          {showSynth && (
            <div className="synth">
              <div className="scall">
                <div>
                  <div className="lb">{t("Closest agreement", "Accord le plus fort")}</div>
                  <div className="nm">{deckName(closest.slug, lang)}</div>
                </div>
                <div className="pc">{closest.pct}%</div>
              </div>
              <button
                className="scall warm"
                type="button"
                onClick={() => onOpen?.(lowest.slug)}
              >
                <div>
                  <div className="lb">
                    {t("Most worth a conversation", "À aborder en priorité")}
                  </div>
                  <div className="nm">{deckName(lowest.slug, lang)}</div>
                </div>
                <div className="pc">{lowest.pct}%</div>
              </button>
              {/* Naming a topic gave the couple nothing to SAY. The screen was
                  eight percentages and not one question — a scoreboard, on the
                  tab that exists to start conversations. Show the actual gaps. */}
              {gaps.length > 0 && (
                <div className="gaps">
                  {gaps.map(({ q, a, b }) => (
                    <button
                      key={q.id}
                      className="gap"
                      type="button"
                      onClick={() => onOpen?.(lowest.slug)}
                    >
                      <div className="gap-q">{q.q}</div>
                      <div className="gap-chips">
                        <span className="mcchip s">{a}</span>
                        <span className="mcchip j">{b}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 14 }}>
            {ranked.map(({ slug, pct, known, lvls, of }) => (
              <div
                key={slug}
                className={`resrow${showSynth && slug === lowest.slug ? " hot" : ""}`}
                onClick={() => onOpen?.(slug)}
                style={onOpen ? { cursor: "pointer" } : undefined}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, display: "block" }}>
                    {deckName(slug, lang)}
                  </span>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {lvls === of
                      ? t("Complete", "Terminé")
                      : t(
                          `${lvls} of ${of} parts revealed`,
                          `${lvls} partie${lvls === 1 ? "" : "s"} sur ${of} révélée${lvls === 1 ? "" : "s"}`,
                        )}
                  </span>
                </span>
                <span className="resrow-scores">
                  <span className="rs">
                    <b>{pct}%</b>
                    <i>{t("agreed", "d’accord")}</i>
                  </span>
                  {known != null && (
                    <span className="rs kn">
                      <b>{known}%</b>
                      <i>{t("known", "connus")}</i>
                    </span>
                  )}
                </span>
                {onOpen && (
                  <span style={{ color: "var(--mut)", marginLeft: 10 }}>&#8250;</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
