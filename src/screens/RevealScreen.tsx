import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { lvlQs, nLevels } from "../lib/leveling";
import {
  overall,
  knowScore,
  agreeBasis,
  isNotYet,
  other,
  scoreQ,
  inMyFrame,
  isMirror,
  jointQuestions,
  type DeckData,
  type Role,
  type Verdict,
  type AnswerValue,
  type ScoreResult,
} from "../lib/scoring";
import { type Question } from "../lib/questions";
import { celebrationTier, PETAL_COUNT, type CelebrationTier } from "../lib/celebrate";
import { revealWords, type Pick } from "../lib/reveal";
import { PctRing } from "../components/Ring";
import { ScoreShare } from "../components/ScoreShare";
import { shareTopic } from "../lib/shareTopic";
import { talkStateOf, type TalkState } from "../lib/talks";
import { ScoreRings } from "../components/ScoreRings";
import { scaleText, scaleWord } from "../lib/answerWords";
import { partName } from "../lib/leveling";
import { answerText } from "../lib/discoveries";
import { deckOf } from "../lib/path";
import { writeTalkPin } from "../lib/session";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { optText, withNames } from "../lib/who";
import { TopBar } from "../components/TopBar";
import { Avatar, toneFor } from "../components/Avatar";
import { useT, useLang } from "../lib/i18n";

// Display labels for each verdict when the language is French.
const VERDICT_FR: Record<Verdict, string> = {
  Agreed: "D’accord",
  Close: "Proche",
  "Worth a chat": "À discuter",
  Complementary: "Complémentaire",
  Shared: "Partagé",
};

// The kit's badge for each verdict: words in brand colours (item 13/16).
const VERDICT_BADGE: Record<Verdict, string> = {
  Agreed: "agreed",
  Close: "close",
  "Worth a chat": "chat",
  Complementary: "comp",
  Shared: "shared",
};

type Filter = "all" | "different" | "agreed" | "talk";

// Level reveal: the shared alignment score plus a per-question breakdown.
// Both partners see the same number (it only unlocks once both have finished).
export default function RevealScreen({
  slug,
  level,
  role,
  deck,
  onDone,
  myName,
  partnerName,
  questions,
  review = false,
  firstEver = false,
  code,
  talkFirst = false,
  title,
  pick,
  shareKey,
}: {
  /** The line and verse the server picked when this part opened (lib/reveal.ts). */
  pick?: Pick;
  /** For a Path step: its key, so a shared card names it safely. */
  shareKey?: string;
  slug: string;
  level: number;
  role: Role;
  deck: DeckData | undefined;
  onDone: () => void;
  myName: string;
  partnerName: string;
  // Review mode passes the whole deck's questions so a finished deck can be
  // reopened to see the full per-question breakdown (what each of you answered).
  questions?: Question[];
  review?: boolean;
  // The couple's very first reveal. It's the moment they decide the core loop
  // is worth it, so it earns one line the hundredth reveal doesn't get.
  firstEver?: boolean;
  // The session code enables the talk loop on each card. Omitted where there's
  // no session to write to (the onboarding preview reveal).
  code?: string;
  // Opened from Together to see where you differ — lead with the differences
  // instead of making the couple hunt through the agreed cards for them.
  talkFirst?: boolean;
  // The Path reuses this screen with a custom question list that spans decks, so
  // it passes an explicit eyebrow title instead of a single deck name.
  title?: string;
}) {
  const t = useT();
  const lang = useLang();
  const qs = questions ?? lvlQs(slug, level);
  const data = deck ?? {};
  const pct = overall(qs, data, role);
  const basis = agreeBasis(qs, data);
  // Both names by role for "which of you" questions (same order on both phones).
  const names = {
    host: role === "host" ? myName : partnerName,
    guest: role === "guest" ? myName : partnerName,
  };
  const know = knowScore(qs, data, role);
  const jointRaw = jointQuestions(qs, data);
  // Both answered, at least one with "Not yet": shown, never scored.
  const notYet = qs.filter((q) => {
    const a = data.answers?.[q.id];
    return a?.host != null && a?.guest != null && (isNotYet(a.host) || isNotYet(a.guest));
  });
  const VERDICT_ORDER: Record<Verdict, number> = {
    "Worth a chat": 0,
    Close: 1,
    Complementary: 2,
    Agreed: 3,
    Shared: 4,
  };
  const joint = talkFirst
    ? [...jointRaw].sort(
        (a, b) =>
          VERDICT_ORDER[scoreQ(a, data, role).verdict] -
          VERDICT_ORDER[scoreQ(b, data, role).verdict],
      )
    : jointRaw;
  // A custom question list (review or Path) is single-part, so never touch the
  // deck-leveling helpers with a slug that may not be a real deck.
  const multi = questions ? false : nLevels(slug) > 1;
  // Reflection-only decks have nothing to score — show the answers, not a 0% ring.
  const hasScore = joint.some((q) => q.type !== "open");
  // Filters open on All (item 13).
  const [filter, setFilter] = useState<Filter>("all");

  // ---- The Level-Up moment (fresh reveals only) ----
  // The reveal and the review are now distinct screens. A fresh reveal is a
  // full-screen ceremony: the avatars meet, then the score owns the whole
  // screen (confetti >75%, denser >90%) with the know-each-other capsule —
  // and only a deliberate "See your answers" step opens the breakdown.
  // Reopening from Results/Decks goes straight to the breakdown.
  const reduced =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const ceremony = !review && hasScore;
  const [phase, setPhase] = useState<"ceremony" | "answers">(
    ceremony ? "ceremony" : "answers",
  );
  // Within the ceremony: 1 = the two of you meet, 2 = the score takes over.
  // Reduced-motion users get stage 2 immediately, statically.
  const [stage, setStage] = useState(reduced ? 2 : 1);
  const [party, setParty] = useState(false);
  const skipped = useRef(false);
  const tier = celebrationTier(pct);
  // The claret room is for every score (item 2), and the celebration's ground,
  // so it is there from the first frame of the ceremony.
  const lit = ceremony;
  // The same line and verse for both of you (picked when the part opened).
  const words = revealWords(pct, pick, `${code ?? ""}|${slug}|${level}`);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (phase !== "ceremony" || reduced) return;
    // The celebration lands with the number, not before it: stage 2 mounts at
    // 1.15s and the rings draw for ~1.4s.
    const ts = [
      setTimeout(() => setParty(true), 2500),
      setTimeout(() => setParty(false), 11000),
    ];
    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "ceremony" || reduced) return;
    const t1 = setTimeout(() => setStage((s) => Math.max(s, 2)), 1150);
    return () => clearTimeout(t1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Skipping the meet fast-forwards; it must never confiscate the celebration.
  // The excited partner who taps is exactly the one who wants the petals.
  const skipMeet = () => {
    skipped.current = true;
    setStage(2);
  };

  const eyebrow = (
    <div className="eyebrow center" style={{ marginTop: 10 }}>
      {(title ?? deckName(slug, lang)).toUpperCase()}
      {review
        ? t(" · REVIEW", " · RÉCAP")
        : multi
          ? t(
              ` · PART ${level + 1} OF ${nLevels(slug)}`,
              ` · PARTIE ${level + 1} SUR ${nLevels(slug)}`,
            )
          : ""}
    </div>
  );

  if (phase === "ceremony") {
    return (
      <section
        className={`ceremony${lit ? " lit" : ""}`}
        onClick={stage < 2 ? skipMeet : undefined}
      >
        {/* The claret room. Full-bleed behind the notch and the home indicator —
            grounds bleed, content stays inside the safe area. */}
        {lit && <div className="ceremony-ground" aria-hidden="true" />}
        <TopBar onExit={onDone} />
        {party && <Celebration tier={tier} />}
        {eyebrow}

        {stage === 1 && (
          <div className="meetstage tall">
            <div className="meetpair">
              <Avatar name={myName} tone={toneFor(role)} size={58} />
              <Avatar name={partnerName} tone={toneFor(other(role))} size={58} />
            </div>
            <div className="meetnames">
              <span>{myName}</span>
              <span>{partnerName}</span>
            </div>
            <div className="meetline">
              {t("You've both answered.", "Vous avez tous les deux répondu.")}
            </div>
          </div>
        )}

        {stage >= 2 && (
          <div className="levelup">
            {/* 100% only: the two of them settle together above the medallion,
                the one beat no other range gets. */}
            {tier >= 4 && (
              <div className="meetpair oneheart lvlup-rise r2">
                <Avatar name={myName} tone={toneFor(role)} size={40} />
                <Avatar name={partnerName} tone={toneFor(other(role))} size={40} />
              </div>
            )}
            <div className="lvlup-rise r1">
              {tier >= 4 ? (
                <div className="medal">
                  <span className="medal-badge">{t("Complete alignment", "Accord complet")}</span>
                  <div className="medal-ring">
                    <span className="medal-num">
                      100<span className="medal-pc">%</span>
                    </span>
                    <span className="medal-lb">{t("agreed", "d’accord")}</span>
                  </div>
                </div>
              ) : (
                <div className="center" style={{ margin: "8px 0 0" }}>
                  <PctRing pct={pct} size={190} color="var(--ta-honey)" label={t("agreed", "d’accord")} drawMs={1400} />
                </div>
              )}
              <p className="score-basis">
                {t(
                  `Based on ${basis} question${basis === 1 ? "" : "s"} you both answered`,
                  `Sur ${basis} question${basis === 1 ? "" : "s"} auxquelles vous avez tous deux répondu`,
                )}
              </p>
            </div>
            {/* The whole ceremony is staged in motion, so without this a blind
                partner gets none of the arc the animation carries. */}
            <p className="sr-only" role="status">
              {t(`You agreed ${pct} percent.`, `Vous êtes d’accord à ${pct} pour cent.`)} {words.line}
            </p>
            {firstEver && (
              <p className="firstline lvlup-rise r2">
                {t(
                  "Your first reveal: this is where the two of you meet.",
                  "Votre première révélation, c’est ici que vous vous retrouvez.",
                )}
              </p>
            )}
            {/* The range's encouragement and its verse (ESV): the same for both
                of you, never the same as your last reveal. */}
            <p className="reveal-line lvlup-rise r2">{words.line}</p>
            <p className="reveal-verse lvlup-rise r3">
              “{words.verse.text}”
              <span className="reveal-ref">{words.verse.ref}</span>
            </p>
            <div className="lvlup-cta lvlup-rise r4">
              <button className="btn pill" type="button" onClick={() => setPhase("answers")}>
                {t("See your answers →", "Voir vos réponses →")}
              </button>
              <button className="btn onclaret" type="button" onClick={() => setSharing(true)}>
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("Share your score", "Partager votre score")}
              </button>
              <button className="btn ghost" type="button" onClick={onDone}>
                {t("Done for now", "Terminé pour l’instant")}
              </button>
            </div>
            {sharing && (
              <ScoreShare
                fields={{
                  pct,
                  basis,
                  line: words.line,
                  tier,
                  topic: shareTopic(title ? (shareKey ?? slug) : slug, lang, title ? undefined : level),
                }}
                names={`${myName.trim().split(/\s+/)[0]} & ${partnerName.trim().split(/\s+/)[0]}`}
                onClose={() => setSharing(false)}
              />
            )}
            {tier < 4 && (
              <p className="notverdict lvlup-rise r4">
                {t("Not a verdict: a place to start talking.", "Pas un verdict, un point de départ pour discuter.")}
              </p>
            )}
          </div>
        )}
      </section>
    );
  }

  // ---- Your answers, side by side (item 13) ----
  // Filters open on All. "Different" is everything you didn't agree on (Close
  // and Worth a chat); "To talk" is what either of you has put on the list.
  const scored = joint.map((q) => ({ q, r: scoreQ(q, data, role), talk: code ? talkStateOf(deckOf(q.id) ?? slug, q, data, role) : undefined }));
  const onList = (x: { talk?: TalkState }) => !!x.talk && (x.talk.pinnedByMe || x.talk.pinnedByThem) && !x.talk.closed;
  const isAgreed = (x: { r: ScoreResult }) => x.r.verdict === "Agreed" || x.r.verdict === "Complementary" || x.r.verdict === "Shared";
  const counts = {
    all: scored.length + notYet.length,
    different: scored.filter((x) => !isAgreed(x)).length,
    agreed: scored.filter(isAgreed).length,
    talk: scored.filter(onList).length,
  };
  const shown = scored.filter((x) =>
    filter === "all" ? true : filter === "different" ? !isAgreed(x) : filter === "agreed" ? isAgreed(x) : onList(x),
  );
  const partLabel = [title ?? deckName(slug, lang), !review && multi ? partName(slug, level) : ""]
    .filter(Boolean)
    .join(" · ");
  const FILTERS: [Filter, string, string][] = [
    ["all", "All", "Tout"],
    ["different", "Different", "Différent"],
    ["agreed", "Agreed", "D’accord"],
    ["talk", "To talk", "À aborder"],
  ];
  const filters = hasScore ? (
    <div className="fpills" role="group" aria-label={t("Show", "Afficher")}>
      {FILTERS.map(([k, en, fr]) => (
        <button key={k} type="button" className="fpill" aria-pressed={filter === k} onClick={() => setFilter(k)}>
          {t(en, fr)}
          <span className="n">{counts[k]}</span>
        </button>
      ))}
    </div>
  ) : null;

  return (
    <section>
      <TopBar onExit={onDone} />
      <div className="eyebrow center" style={{ marginTop: 10 }}>
        {partLabel.toUpperCase()}
      </div>
      <h1 className="h1 center" style={{ margin: "4px 0 0" }}>
        {hasScore ? t("Your answers, side by side", "Vos réponses, face à face") : t("What you each said", "Ce que chacun a dit")}
      </h1>
      {hasScore && (
        <ScoreRings
          agree={pct}
          basis={basis}
          known={know.pct}
          right={know.right}
          made={know.made}
          label={partLabel}
          sticky={filters}
        />
      )}

      <div className="qbreak" style={{ marginTop: 12 }}>
        {shown.map(({ q, r, talk }, i) => {
          const lq = withNames(localizeQuestion(q, lang), names);
          // Talks live on the question's real deck — for the Path, that isn't
          // the slug this screen was opened with.
          const talkSlug = deckOf(q.id) ?? slug;
          return (
            <QCard
              key={q.id}
              q={lq}
              r={r}
              t={t}
              myName={myName}
              partnerName={partnerName}
              role={role}
              delay={Math.min(i * 50, 500)}
              talk={talk}
              onPin={code ? (on) => void writeTalkPin(code, talkSlug, q.id, role, on) : undefined}
            />
          );
        })}
        {/* "Not yet" is shown, unscored (item 12): your partner sees it was
            set aside, and it can still be talked about. */}
        {filter === "all" &&
          notYet.map((q) => {
            const lq = withNames(localizeQuestion(q, lang), names);
            const talkSlug = deckOf(q.id) ?? slug;
            return (
              <NotYetCard
                key={q.id}
                q={lq}
                mine={data.answers?.[q.id]?.[role]}
                theirs={data.answers?.[q.id]?.[other(role)]}
                myName={myName}
                partnerName={partnerName}
                t={t}
                talk={code ? talkStateOf(talkSlug, q, data, role) : undefined}
                onPin={code ? (on) => void writeTalkPin(code, talkSlug, q.id, role, on) : undefined}
              />
            );
          })}
        {shown.length === 0 && !(filter === "all" && notYet.length) && (
          <div className="qc" style={{ borderLeftColor: "var(--sub)" }}>
            <div className="helper">
              {filter === "all"
                ? t("Open reflections here: compare them together.", "Des réflexions libres ici, comparez-les ensemble.")
                : t("Nothing here yet.", "Rien ici pour l’instant.")}
            </div>
          </div>
        )}
      </div>

      <button className="btn pill" type="button" onClick={onDone}>
        {t("Done", "Terminé")}
      </button>
    </section>
  );
}

const PETAL_COLOURS = [
  "var(--ce-gold)",
  "var(--ce-blush)",
  "var(--app-spark)",
  "var(--app-petal-pink)",
  "var(--ta-honey)",
  "var(--ce-ink)",
];

// Full-screen celebration overlay, constrained to the app column and layered by
// tier (see celebrationTier). Every layer is transform/opacity only so the whole
// thing composites on the GPU; pointer-events pass through so a tap always
// reaches the CTA underneath. The parent unmounts it after ~8.5s.
const FIREWORKS: { x: number; y: number; size: number; delay: number; tone: "gold" | "blush" }[] = [
  { x: 14, y: 6, size: 110, delay: 0, tone: "gold" },
  { x: 36, y: 2, size: 60, delay: 0.5, tone: "gold" },
  { x: 70, y: 5, size: 66, delay: 0.25, tone: "blush" },
  { x: 86, y: 12, size: 104, delay: 0.8, tone: "gold" },
  { x: 30, y: 16, size: 70, delay: 1.1, tone: "blush" },
];

function Celebration({ tier }: { tier: CelebrationTier }) {
  const count = PETAL_COUNT[tier];
  // Randomised per mount: the old formulaic left/delay produced petals falling
  // in visible diagonal chains. Each petal now carries its own sway and spin.
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        i,
        left: Math.random() * 102 - 1,
        delay: Math.random() * (tier >= 3 ? 3.4 : 2.6),
        dur: 3.6 + Math.random() * 3.8,
        w: 7 + Math.random() * 7,
        h: 10 + Math.random() * 9,
        sway: Math.round((Math.random() * 2 - 1) * 46),
        spin: Math.round(140 + Math.random() * 300),
        opacity: (0.7 + Math.random() * 0.3).toFixed(2),
        colour: PETAL_COLOURS[Math.floor(Math.random() * PETAL_COLOURS.length)],
      })),
    [count, tier],
  );

  // Sparks burst outward from the score as the number lands (tier 3+).
  const sparks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const d = 78 + Math.random() * 46;
        return {
          i,
          dx: `${Math.round(Math.cos(a) * d)}px`,
          dy: `${Math.round(Math.sin(a) * d)}px`,
          delay: `${(i % 4) * 0.06}s`,
        };
      }),
    [],
  );

  return (
    <div className={`celebrate tier${tier}`} aria-hidden="true">
      {/* tier 1+ — the room itself: breathing ripples, rising motes, one pass
          of light across the screen. */}
      <span className="ce-ripple" />
      <span className="ce-ripple d2" />
      <span className="ce-sweep" />
      {Array.from({ length: tier >= 3 ? 14 : 8 }, (_, i) => (
        <span
          key={`m${i}`}
          className="ce-mote"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${7 + Math.random() * 5}s`,
          }}
        />
      ))}

      {/* tier 3+ — the grand bloom: gold rays wheel behind the score, the wash
          pulses, and sparks burst as the number settles. */}
      {tier >= 3 && (
        <>
          <span className="ce-rays" />
          <span className="ce-goldwash" />
          {sparks.map((s) => (
            <span
              key={`s${s.i}`}
              className="ce-spark"
              style={
                {
                  "--dx": s.dx,
                  "--dy": s.dy,
                  animationDelay: s.delay,
                } as CSSProperties
              }
            />
          ))}
        </>
      )}

      {/* tier 4 — 100%: gold and blush fireworks across the top. */}
      {tier >= 4 &&
        FIREWORKS.map((f, i) => (
          <span
            key={`f${i}`}
            className={`ce-firework ${f.tone}`}
            style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.size, height: f.size, animationDelay: `${f.delay}s` }}
          >
            {Array.from({ length: 12 }, (_, k) => (
              <i key={k} style={{ transform: `rotate(${k * 30}deg)` }} />
            ))}
          </span>
        ))}

      {/* tier 2+ — the fall */}
      {petals.map((p) => (
        <span
          key={p.i}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.h,
              background: p.colour,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              "--sway": `${p.sway}px`,
              "--spin": `${p.spin}deg`,
              "--o": p.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

const initialOf = (n: string) => (n || "?").trim().charAt(0).toUpperCase() || "?";
const firstOf = (n: string) => n.trim().split(/\s+/)[0] || n;

// Why a card is worth a closer look (item 13): said inside the card, with its
// reason, never as a banner. Null when nothing stands out.
function closerLook(r: ScoreResult, partnerName: string, t: (en: string, fr: string) => string): string | null {
  const agreed = r.verdict === "Agreed" || r.verdict === "Complementary";
  if (!agreed && (r.impMe ?? 0) >= 4 && (r.impTh ?? 0) >= 4)
    return t("you both said this matters a lot", "vous avez tous deux dit que cela compte beaucoup");
  if (r.flags.includes("unevenStakes")) {
    return (r.impMe ?? 0) > (r.impTh ?? 0)
      ? t("it matters a lot more to you", "cela compte bien plus pour vous")
      : t(`it matters a lot more to ${firstOf(partnerName)}`, `cela compte bien plus pour ${firstOf(partnerName)}`);
  }
  if (r.flags.includes("blindSpot")) {
    const iMissed = !!r.guessed && !r.guessRight;
    const theyMissed = !!r.theyGuessed && !r.theyGuessRight;
    if (iMissed && theyMissed) return t("neither of you saw this coming", "aucun de vous ne s’y attendait");
    if (iMissed) return t("you didn’t see this coming", "vous ne vous y attendiez pas");
    return t(`${firstOf(partnerName)} didn’t see this coming`, `${firstOf(partnerName)} ne s’y attendait pas`);
  }
  return null;
}

// A guess in words, from the answer itself (scale → "Strongly", choice → its
// text), so a bad stored value is never shown as a number.
function guessWords(q: Question, v: AnswerValue | undefined, t: (en: string, fr: string) => string): string {
  if (v == null) return "—";
  if (q.type === "scale") return scaleWord(v, t);
  return optText(q, v) ?? "—";
}

// One card per question (item 13): the badge in brand colours, the answers as
// the question screen showed them (an answer track for a scale, named rows for
// a choice), "Worth a closer look" with its reason, guesses in words and a
// quiet "+ Add to talk about".
function QCard({
  q,
  r,
  t,
  myName,
  partnerName,
  role,
  delay,
  talk,
  onPin,
}: {
  q: Question;
  r: ScoreResult;
  t: (en: string, fr: string) => string;
  myName: string;
  partnerName: string;
  role: Role;
  delay: number;
  // The talk loop. Absent in contexts with no session to write to (the
  // onboarding preview reveal), where the card is read-only.
  talk?: TalkState;
  onPin?: (on: boolean) => void;
}) {
  const me = { name: myName, tone: toneFor(role) };
  const them = { name: partnerName, tone: toneFor(other(role)) };
  const look = q.type === "open" ? null : closerLook(r, partnerName, t);
  const pName = firstOf(partnerName);
  return (
    <div className="qc row-rise" style={{ animationDelay: `${delay}ms` }}>
      <div className="qc-head">
        <div className="qc-q">{q.q}</div>
        {q.type !== "open" && (
          <span className={`kbadge ${VERDICT_BADGE[r.verdict]}`}>
            {t(r.verdict, VERDICT_FR[r.verdict])}
          </span>
        )}
      </div>

      {look && (
        <div className="qc-look">
          <span aria-hidden="true">✦</span>
          <span>
            {t("Worth a closer look", "À regarder de plus près")}: {look}
          </span>
        </div>
      )}

      {q.type === "scale" && <AnswerTrack q={q} r={r} t={t} me={me} them={them} />}

      {q.type === "mc" && <McBody q={q} r={r} t={t} me={me} them={them} />}

      {q.type === "rank" && r.A && r.B && (
        <RankBody q={q} r={r} t={t} myName={myName} partnerName={partnerName} />
      )}

      {q.type === "open" && (
        <div className="openq">
          <Quote name={myName} tone={me.tone === "berry" ? "s" : "j"} text={String(r.me ?? "—")} />
          <Quote name={partnerName} tone={them.tone === "berry" ? "s" : "j"} text={String(r.th ?? "—")} />
        </div>
      )}

      {r.verdict === "Complementary" && (
        <div className="qc-note comp">
          {t("Different, and that works well together.", "Différent, et cela se complète bien.")}
        </div>
      )}

      {/* 110 questions carry a verse anchor: on a difference, shared ground
          to start from. */}
      {q.ref && r.verdict === "Worth a chat" && <div className="qc-ref">{q.ref}</div>}

      {(r.guessed || r.theyGuessed) && (
        <div className="guessrow">
          {r.guessRight && r.theyGuessRight ? (
            <span className="gtag gok">✓ {t("You both guessed right", "Vous avez tous deux deviné juste")}</span>
          ) : (
            <>
              {/* ○ for a miss, not ✗: a surprise about the person you love,
                  not a mark against you. */}
              {r.guessed &&
                (r.guessRight ? (
                  <span className="gtag gok">✓ {t("You guessed right", "Vous avez deviné juste")}</span>
                ) : (
                  <span className="gtag">
                    ○ {t("You guessed", "Vous pensiez")} <b>{guessWords(q, r.guess, t)}</b>
                  </span>
                ))}
              {r.theyGuessed &&
                (r.theyGuessRight ? (
                  <span className="gtag gok">
                    ✓ {t(`${pName} guessed right`, `${pName} a deviné juste`)}
                  </span>
                ) : (
                  <span className="gtag">
                    ○ {t(`${pName} guessed`, `${pName} pensait`)} <b>{guessWords(q, r.theirGuess, t)}</b>
                  </span>
                ))}
            </>
          )}
        </div>
      )}

      {talk && onPin && <TalkLink talk={talk} onPin={onPin} t={t} />}
    </div>
  );
}

// "+ Add to talk about" as a quiet link; once on the couple's list, a chip.
// The list is shared, so it reads the same whoever added it; only the person
// who added it can take it off again.
function TalkLink({
  talk,
  onPin,
  t,
}: {
  talk: TalkState;
  onPin: (on: boolean) => void;
  t: (en: string, fr: string) => string;
}) {
  const on = talk.pinnedByMe || talk.pinnedByThem;
  const label = on
    ? `✓ ${t("On your list to talk about", "Sur votre liste à aborder")}`
    : `+ ${t("Add to talk about", "Ajouter à aborder")}`;
  return (
    <div className="qc-talk">
      {on && !talk.pinnedByMe ? (
        <span className="talkchip">{label}</span>
      ) : (
        <button
          type="button"
          className="talklink"
          aria-pressed={on}
          onClick={() => onPin(!talk.pinnedByMe)}
        >
          {on ? <span className="talkchip">{label}</span> : label}
        </button>
      )}
    </div>
  );
}

type Who = { name: string; tone: "berry" | "honey" };

// The scale as an answer track (item 13): the same five steps as the question
// screen, each of you as an avatar on your step, then your answers in words.
function AnswerTrack({
  q,
  r,
  t,
  me,
  them,
}: {
  q: Question;
  r: ScoreResult;
  t: (en: string, fr: string) => string;
  me: Who;
  them: Who;
}) {
  const mv = Number(r.me);
  const tv = Number(r.th);
  // On a mirrored scale the partner's dot sits where their answer lands from
  // your side; the rows below still quote each of you in your own words.
  const tvHere = inMyFrame(q, r.th);
  const same = mv === tv && !isMirror(q);
  return (
    <div className="atrack">
      <div className="atrack-steps" role="img" aria-label={`${me.name}: ${scaleText(q, mv, t)}. ${them.name}: ${scaleText(q, tv, t)}.`}>
        {[1, 2, 3, 4, 5].map((n) => {
          const here = [n === mv ? me : null, n === tvHere ? them : null].filter((x): x is Who => !!x);
          return (
            <span key={n} className="atrack-step">
              {here.length ? (
                <span className="atrack-pair">
                  {here.map((w) => (
                    <Avatar key={w.tone} name={w.name} tone={w.tone} size={30} ring={false} />
                  ))}
                </span>
              ) : (
                <span className="atrack-dot" />
              )}
            </span>
          );
        })}
      </div>
      <div className="sbar-ends">
        <span>{q.lo}</span>
        <span>{q.hi}</span>
      </div>
      {same ? (
        <div className="ansrow both">
          <span className="atrack-pair">
            <Avatar name={me.name} tone={me.tone} size={30} ring={false} />
            <Avatar name={them.name} tone={them.tone} size={30} ring={false} />
          </span>
          <span>
            {t("You both said", "Vous avez tous deux dit")} {scaleText(q, mv, t)}
          </span>
        </div>
      ) : (
        <>
          <AnswerRow who={me} text={scaleText(q, mv, t)} />
          <AnswerRow who={them} text={scaleText(q, tv, t)} />
        </>
      )}
    </div>
  );
}

function AnswerRow({ who, text }: { who: Who; text: string }) {
  return (
    <div className="ansrow">
      <Avatar name={who.name} tone={who.tone} size={30} ring={false} />
      <span>{text}</span>
    </div>
  );
}

// A choice: "You both chose …" on one line when you match, two named rows when
// you don't.
function McBody({
  q,
  r,
  t,
  me,
  them,
}: {
  q: Question;
  r: ScoreResult;
  t: (en: string, fr: string) => string;
  me: Who;
  them: Who;
}) {
  const text = (v: AnswerValue | undefined) => (v == null ? "—" : (optText(q, v) ?? "—"));
  if (r.me === r.th) {
    return (
      <div className="ansrow both">
        <span className="atrack-pair">
          <Avatar name={me.name} tone={me.tone} size={30} ring={false} />
          <Avatar name={them.name} tone={them.tone} size={30} ring={false} />
        </span>
        <span>
          {t("You both chose", "Vous avez tous deux choisi")} {text(r.me)}
        </span>
      </div>
    );
  }
  return (
    <>
      <AnswerRow who={me} text={text(r.me)} />
      <AnswerRow who={them} text={text(r.th)} />
    </>
  );
}

function RankBody({
  q,
  r,
  t,
  myName,
  partnerName,
}: {
  q: Question;
  r: ScoreResult;
  t: (en: string, fr: string) => string;
  myName: string;
  partnerName: string;
}) {
  const A = r.A ?? [];
  const B = r.B ?? [];
  return (
    <>
      <div className="rank2">
        <div className="rank2-col">
          <div className="rank2-h s">{myName}</div>
          <ol>
            {A.map((idx, k) => (
              <li key={k} className={B[k] === idx ? "rmatch" : ""}>
                {q.opts?.[idx] ?? idx}
              </li>
            ))}
          </ol>
        </div>
        <div className="rank2-col">
          <div className="rank2-h j">{partnerName}</div>
          <ol>
            {B.map((idx, k) => (
              <li key={k} className={A[k] === idx ? "rmatch" : ""}>
                {q.opts?.[idx] ?? idx}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {A[0] != null && A[0] === B[0] && (
        <div className="qc-note ok">
          ✓ {t("You agree on your top priority", "Vous êtes d’accord sur votre priorité n°1")}
        </div>
      )}
    </>
  );
}

function Quote({ name, tone, text }: { name: string; tone: "s" | "j"; text: string }) {
  return (
    <div className="oq">
      <span className={`oav ${tone}`}>{initialOf(name)}</span>
      <div>
        <span className="oq-who">{name}</span>
        <div className="oq-text">{text}</div>
      </div>
    </div>
  );
}

// A question one of you answered "Not yet" (item 12): shown, unscored, open to
// talk about. Never a verdict or a badge colour, just the plain fact.
function NotYetCard({
  q,
  mine,
  theirs,
  myName,
  partnerName,
  t,
  talk,
  onPin,
}: {
  q: Question;
  mine: AnswerValue | undefined;
  theirs: AnswerValue | undefined;
  myName: string;
  partnerName: string;
  t: (en: string, fr: string) => string;
  talk?: TalkState;
  onPin?: (on: boolean) => void;
}) {
  const first = (n: string) => n.trim().split(/\s+/)[0] || n;
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
  const side = (name: string, v: AnswerValue | undefined) =>
    isNotYet(v) ? (
      <div className="ny-side ny-wait">
        <span className="ny-name">{first(name)}</span>
        <b>{t("Not yet", "Pas encore")}</b>
      </div>
    ) : (
      <div className="ny-side">
        <span className="ny-name">{first(name)}</span>
        <b>{v == null ? "—" : cap(answerText(q, v))}</b>
      </div>
    );
  const who = isNotYet(mine) && isNotYet(theirs) ? null : isNotYet(theirs) ? first(partnerName) : first(myName);
  return (
    <div className="qc row-rise nycard">
      <div className="qc-head">
        <div className="qc-q">{q.q}</div>
        <span className="kbadge shared">{t("Not yet", "Pas encore")}</span>
      </div>
      <div className="ny-pair">
        {side(myName, mine)}
        {side(partnerName, theirs)}
      </div>
      <p className="helper" style={{ margin: "10px 0 0" }}>
        {who
          ? t(
              `${who} chose “Not yet” for this one. It isn’t scored. You can ask about it when you talk.`,
              `${who} a choisi « Pas encore » pour celle-ci. Elle n’est pas comptée. Vous pourrez en parler ensemble.`,
            )
          : t(
              "You both chose “Not yet” for this one. It isn’t scored.",
              "Vous avez tous deux choisi « Pas encore ». Elle n’est pas comptée.",
            )}
      </p>
      {talk && onPin && <TalkLink talk={talk} onPin={onPin} t={t} />}
    </div>
  );
}
