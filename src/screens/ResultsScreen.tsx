import { DECKS, ORDER } from "../lib/questions";
import { catComplete } from "../lib/progress";
import { overall, jointQuestions, type DeckData, type Role } from "../lib/scoring";
import type { Session } from "../types";
import { PctRing } from "../components/Ring";

// Overall alignment across every deck both partners have fully finished.
export default function ResultsScreen({
  session,
  role,
}: {
  session: Session;
  role: Role;
}) {
  const completed = ORDER.filter((slug) =>
    catComplete(slug, session.decks?.[slug], role),
  );

  // Overall = average of all scoreable joint answers across completed decks.
  let sum = 0;
  let n = 0;
  const rows: { slug: string; pct: number }[] = [];
  for (const slug of completed) {
    const deck: DeckData | undefined = session.decks?.[slug];
    const qs = DECKS[slug].questions;
    const joint = jointQuestions(qs, deck ?? {}).filter((q) => q.type !== "open");
    if (!joint.length) continue;
    rows.push({ slug, pct: overall(qs, deck ?? {}, role) });
    // fold into overall
    sum += overall(qs, deck ?? {}, role) * joint.length;
    n += joint.length;
  }
  const overallPct = n ? Math.round(sum / n) : null;

  // Surface the signal, don't bury it: the lowest deck IS the product — the
  // topic most worth a conversation. Rank ascending so the eye lands on it
  // first, and call out the closest + the one worth talking about by name.
  const ranked = [...rows].sort((a, b) => a.pct - b.pct);
  const lowest = ranked[0];
  const closest = ranked[ranked.length - 1];
  const showSynth = ranked.length >= 2 && lowest.slug !== closest.slug;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        The two of you
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 4px" }}>
        Where you landed
      </h1>

      {overallPct == null ? (
        <p className="sub serif center" style={{ fontStyle: "italic", margin: "20px 24px" }}>
          Finish a deck together and your shared alignment appears here — not to
          judge, but to open the conversation.
        </p>
      ) : (
        <>
          <div className="center" style={{ margin: "16px 0 6px" }}>
            <PctRing pct={overallPct} size={190} />
          </div>
          <p className="sub serif center" style={{ fontStyle: "italic", margin: "0 24px 20px" }}>
            Across {rows.length} completed {rows.length === 1 ? "deck" : "decks"}.
          </p>

          {showSynth && (
            <div className="synth">
              <div className="scall">
                <div>
                  <div className="lb">Closest alignment</div>
                  <div className="nm">{DECKS[closest.slug].name}</div>
                </div>
                <div className="pc">{closest.pct}%</div>
              </div>
              <div className="scall warm">
                <div>
                  <div className="lb">Most worth a conversation</div>
                  <div className="nm">{DECKS[lowest.slug].name}</div>
                </div>
                <div className="pc">{lowest.pct}%</div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 14 }}>
            {ranked.map(({ slug, pct }) => (
              <div
                key={slug}
                className={`resrow${showSynth && slug === lowest.slug ? " hot" : ""}`}
              >
                <span style={{ flex: 1, fontWeight: 600 }}>{DECKS[slug].name}</span>
                <span style={{ color: "var(--berry)", fontWeight: 700 }}>{pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
