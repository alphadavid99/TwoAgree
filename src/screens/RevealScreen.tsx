import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { lvlQs, nLevels } from "../lib/leveling";
import {
  overall,
  knowScore,
  scoreQ,
  jointQuestions,
  type DeckData,
  type Role,
  type Verdict,
  type AnswerValue,
  type ScoreResult,
} from "../lib/scoring";
import { type Question } from "../lib/questions";
import { collectFlagRows } from "../lib/flags";
import { celebrationTier, PETAL_COUNT, type CelebrationTier } from "../lib/celebrate";
import { talkStateOf, type TalkState } from "../lib/talks";
import { deckOf } from "../lib/path";
import { writeTalkPin } from "../lib/session";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { ScorePair } from "../components/ScorePair";
import FlagsReview, { FlagBox } from "./FlagsReview";
import { TopBar } from "../components/TopBar";
import { Avatar } from "../components/Avatar";
import { useT, useLang } from "../lib/i18n";

// Display labels for each verdict when the language is French.
const VERDICT_FR: Record<Verdict, string> = {
  Agreed: "D’accord",
  Close: "Proche",
  "Worth a chat": "À discuter",
  Complementary: "Complémentaire",
  Shared: "Partagé",
};

// "Worth a chat" is deliberately a calm, neutral ink — not alarm-red. Difference
// here is an invitation to talk, never a failure state (see the subline below).
const VERDICT_COLOR: Record<Verdict, string> = {
  Agreed: "var(--app-guess-ok)",
  Close: "var(--honeyD)",
  "Worth a chat": "var(--app-verdict-grey)",
  Complementary: "var(--app-complement)",
  Shared: "var(--sub)",
};

function optLabel(q: Question, v: AnswerValue | undefined): string {
  if (v == null) return "—";
  if (q.type === "scale") return `${v} / 5`;
  if (q.type === "open") return String(v);
  return q.opts?.[Number(v)] ?? String(v);
}

// Tiered copy for the guess-accuracy capsule. Always encouraging (no guilt
// mechanics): only a genuinely high score claims "you know each other well";
// lower scores frame the gap as discovery still ahead, never as failure.
function knowLine(pct: number, t: (en: string, fr: string) => string): string {
  if (pct >= 70) return t("You know each other well", "Vous vous connaissez bien");
  if (pct >= 40)
    return t("Still discovering each other", "Vous continuez à vous découvrir");
  return t("So much still to discover", "Encore tant à découvrir");
}

// The same courtesy for the axis couples actually worry about. Agreement had no
// interpretive line at any score, so a hard number landed bare. Honest, never
// softened: difference is named as the reason the app exists, not as a failure.
function agreedLine(pct: number, t: (en: string, fr: string) => string): string {
  if (pct >= 100) return t("Of one mind", "D’un même esprit");
  if (pct >= 90) return t("Of one mind on so much", "D’un même esprit sur tant de choses");
  if (pct >= 75) return t("Closely agreed", "Très proches");
  if (pct >= 60) return t("Walking well together", "Vous avancez bien ensemble");
  if (pct >= 40)
    return t(
      "Plenty shared, and real differences",
      "Beaucoup en commun, et de vraies différences",
    );
  return t(
    "You differ on real things, that’s what this is for",
    "Vous différez sur de vraies choses, c’est à cela que ça sert",
  );
}


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
}: {
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
  const know = knowScore(qs, data, role);
  const jointRaw = jointQuestions(qs, data);
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
  // "Before you walk on" — the flagged questions worth a closer look (§4/§5).
  const flagRows = collectFlagRows(qs, data, role);
  const [showFlags, setShowFlags] = useState(false);

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
  const tier = celebrationTier(pct, know.pct);
  // The claret room is the celebration's ground, so it has to be there from the
  // first frame of the ceremony — not swept in after the score lands.
  const lit = ceremony && tier > 0;

  useEffect(() => {
    if (phase !== "ceremony" || reduced || tier === 0) return;
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

  if (showFlags) {
    return (
      <FlagsReview
        rows={flagRows}
        myName={myName}
        partnerName={partnerName}
        onClose={() => setShowFlags(false)}
      />
    );
  }

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
              <Avatar name={myName} tone="berry" size={58} />
              <Avatar name={partnerName} tone="honey" size={58} />
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
            {/* 100% only: the two of them walk back in and settle together over
                the full ring — the one beat no other band gets. */}
            {tier >= 4 && (
              <div className="meetpair oneheart lvlup-rise r2">
                <Avatar name={myName} tone="berry" size={40} />
                <Avatar name={partnerName} tone="honey" size={40} />
              </div>
            )}
            {/* The two axes at equal weight — agreement and Known — are the
                whole point of the reveal (brief §3a). They draw in view now:
                the count-up IS the entrance, not something that plays behind
                an invisible layer. */}
            <div className="lvlup-rise r1">
              <ScorePair agreed={pct} known={know.pct} t={t} size={140} ceremony />
            </div>
            {/* The whole ceremony is staged in motion, so without this a blind
                partner — or one holding the phone between them with VoiceOver
                on — gets none of the arc the animation carries. */}
            <p className="sr-only" role="status">
              {t(
                `You agreed ${pct} percent.`,
                `Vous êtes d’accord à ${pct} pour cent.`,
              )}
              {know.pct != null &&
                t(
                  ` You knew each other’s answers ${know.pct} percent.`,
                  ` Vous avez deviné les réponses de l’autre à ${know.pct} pour cent.`,
                )}
              {" "}
              {agreedLine(pct, t)}.
            </p>
            {firstEver && (
              <p className="firstline lvlup-rise r2">
                {t(
                  "Your first reveal: this is where the two of you meet.",
                  "Votre première révélation, c’est ici que vous vous retrouvez.",
                )}
              </p>
            )}
            <p className="agreedline lvlup-rise r2">{agreedLine(pct, t)}</p>
            {know.pct != null && (
              <p className="knowline lvlup-rise r2">{knowLine(know.pct, t)}</p>
            )}
            <p
              className="sub serif center lvlup-rise r3"
              style={{ fontStyle: "italic", margin: "10px 24px 0" }}
            >
              {tier >= 4
                ? t(
                    "“Can two walk together, unless they are agreed?”",
                    "« Deux hommes marchent-ils ensemble, sans en être convenus ? »",
                  )
                : t(
                    "Not a verdict: a place to start talking.",
                    "Pas un verdict, un point de départ pour discuter.",
                  )}
            </p>
            <div className="lvlup-cta lvlup-rise r4">
              <button
                className="btn pill"
                type="button"
                onClick={() => setPhase("answers")}
              >
                {/* Below 60% the honest next step isn't admiring a number, it's
                    finding the conversation the number is pointing at. */}
                {tier === 0 && flagRows.length > 0
                  ? t("See where to start talking →", "Voir par où commencer →")
                  : t("See your answers →", "Voir vos réponses →")}
              </button>
              <button className="btn ghost" type="button" onClick={onDone}>
                {t("Done for now", "Terminé pour l’instant")}
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section>
      <TopBar onExit={onDone} />
      {eyebrow}

      {hasScore ? (
        <ScorePair agreed={pct} known={know.pct} t={t} size={120} />
      ) : (
        <h1 className="h1 center" style={{ margin: "16px 0 6px" }}>
          {t("What you each said", "Ce que chacun a dit")}
        </h1>
      )}

      {/* The berry box — renders only when there are flags (no empty state). */}
      {flagRows.length > 0 && (
        <FlagBox count={flagRows.length} onOpen={() => setShowFlags(true)} t={t} />
      )}

      {/* Called as a plain function (not <RevealBody/>) so re-renders don't
          remount the body and replay its animations. */}
      {RevealBody()}
    </section>
  );

  // Afterglow content — extracted so the stages above stay readable.
  function RevealBody() {
    return (
      <>
      {know.pct != null && (
        <p className="knowline reveal-rise">
          {knowLine(know.pct, t)}
          {/* "0 of 3 right" is test vocabulary, and it sat directly beside the
              line meant to soften the moment. At zero the tally says nothing
              the sentence hasn't; above zero, phrase it as noticing rather
              than marking. */}
          {know.right > 0 &&
            t(
              ` · you saw ${know.right} of ${know.made} coming`,
              ` · vous en avez vu venir ${know.right} sur ${know.made}`,
            )}
        </p>
      )}
      <p className="sub serif center reveal-rise" style={{ fontStyle: "italic", margin: "0 24px 6px" }}>
        {t(
          "Not a verdict: a place to start talking.",
          "Pas un verdict, un point de départ pour discuter.",
        )}
      </p>

      <div className="qbreak" style={{ marginTop: 20 }}>
        {joint.map((q, i) => {
          const r = scoreQ(q, data, role);
          const lq = localizeQuestion(q, lang);
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
              delay={Math.min(i * 50, 500)}
              talk={code ? talkStateOf(talkSlug, q, data, role) : undefined}
              onPin={
                code
                  ? (on) => void writeTalkPin(code, talkSlug, q.id, role, on)
                  : undefined
              }
            />
          );
        })}
        {joint.length === 0 && (
          <div className="qc" style={{ borderLeftColor: "var(--sub)" }}>
            <div className="muted" style={{ fontSize: 13 }}>
              {t(
                "Open reflections here: compare them together.",
                "Des réflexions libres ici, comparez-les ensemble.",
              )}
            </div>
          </div>
        )}
      </div>

      <button className="btn pill" type="button" onClick={onDone}>
        {t("Done", "Terminé")}
      </button>
      </>
    );
  }
}

// Petal colours read against the claret room: gold, paper and blush carry, the
// deep claret tones give the fall depth without muddying into the ground.
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

// One airy card per question, with a body tailored to the question type:
// scale → a 1–5 alignment bar; mc → matched/split chips; rank → paired ordered
// lists with matching positions highlighted; open → quoted blocks with avatars.
function QCard({
  q,
  r,
  t,
  myName,
  partnerName,
  delay,
  talk,
  onPin,
}: {
  q: Question;
  r: ScoreResult;
  t: (en: string, fr: string) => string;
  myName: string;
  partnerName: string;
  delay: number;
  // The talk loop. Absent in contexts with no session to write to (the
  // onboarding preview reveal), where the card is read-only.
  talk?: TalkState;
  onPin?: (on: boolean) => void;
}) {
  const vcol = VERDICT_COLOR[r.verdict];
  const pinned = talk ? talk.pinnedByMe || talk.pinnedByThem : false;
  return (
    <div
      className="qc row-rise"
      style={{ borderLeftColor: vcol, animationDelay: `${delay}ms` }}
    >
      <div className="qc-head">
        <div className="qc-q">{q.q}</div>
        {q.type !== "open" && (
          <span className="qc-badge" style={{ color: vcol, borderColor: vcol }}>
            {t(r.verdict, VERDICT_FR[r.verdict])}
          </span>
        )}
      </div>

      {q.type === "scale" && <ScaleBar q={q} r={r} myName={myName} partnerName={partnerName} />}

      {q.type === "mc" && <McBody q={q} r={r} t={t} myName={myName} partnerName={partnerName} />}

      {q.type === "rank" && r.A && r.B && (
        <RankBody q={q} r={r} t={t} myName={myName} partnerName={partnerName} />
      )}

      {q.type === "open" && (
        <div className="openq">
          <Quote name={myName} tone="s" text={String(r.me ?? "—")} />
          <Quote name={partnerName} tone="j" text={String(r.th ?? "—")} />
        </div>
      )}

      {r.verdict === "Complementary" && (
        <div className="qc-note comp">
          {t(
            "Different, and that works well together.",
            "Différent, et cela se complète bien.",
          )}
        </div>
      )}
      {r.verdict === "Worth a chat" && (
        <div className="qc-note">
          {t("Worth a conversation.", "Un sujet à aborder ensemble.")}
        </div>
      )}

      {/* 110 questions carry a verse anchor and it only ever appeared inside
          the flags walkthrough — on a difference, a shared anchor is neutral
          ground to start from. */}
      {q.ref && r.verdict === "Worth a chat" && (
        <div className="qc-ref">{q.ref}</div>
      )}

      {(r.guessed || r.theyGuessed) && (
        <div className="guessrow">
          {/* ✦ for a miss, not ✗. A wrong prediction is a surprise about the
              person you love, not a mark against you — and the French said
              "ton pari" (tu, and betting) inside otherwise-vous chrome. */}
          {r.guessed && (
            <span className={`gtag ${r.guessRight ? "gok" : "gno"}`}>
              {r.guessRight ? "✓" : "✦"}{" "}
              {t("You guessed they'd pick", "Vous pensiez qu’ils diraient")}:{" "}
              <b>{optLabel(q, r.guess)}</b>
            </span>
          )}
          {r.theyGuessed && (
            <span className={`gtag ${r.theyGuessRight ? "gok" : "gno"}`}>
              {r.theyGuessRight ? "✓" : "✦"} {partnerName}{" "}
              {t("guessed you'd pick", "pensait que vous diriez")}:{" "}
              <b>{optLabel(q, r.theirGuess)}</b>
            </span>
          )}
        </div>
      )}

      {/* "Worth a conversation." used to be a dead note. Now it can become an
          actual conversation: either partner pins it to the couple's agenda. */}
      {talk && onPin && (
        <button
          type="button"
          className={`pinbtn${pinned ? " on" : ""}`}
          onClick={() => onPin(!talk.pinnedByMe)}
          aria-pressed={pinned}
        >
          <span aria-hidden="true">{pinned ? "♥" : "♡"}</span>
          {pinned
            ? talk.pinnedByMe
              ? t("On your talk list", "Sur votre liste")
              : t("They want to talk about this", "Il/elle veut en parler")
            : t("Talk about this", "En parler")}
        </button>
      )}
    </div>
  );
}

function ScaleBar({
  q,
  r,
  myName,
  partnerName,
}: {
  q: Question;
  r: ScoreResult;
  myName: string;
  partnerName: string;
}) {
  const mv = Number(r.me);
  const tv = Number(r.th);
  const posMe = ((mv - 1) / 4) * 100;
  const posTh = ((tv - 1) / 4) * 100;
  const same = mv === tv;
  const lo = Math.min(posMe, posTh);
  const hi = Math.max(posMe, posTh);
  return (
    <div className="sbar">
      <div className="sbar-track">
        {!same && <span className="sbar-fill" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />}
        {same ? (
          <span className="sbar-dot both" style={{ left: `${posMe}%` }}>
            ♥
          </span>
        ) : (
          <>
            <span className="sbar-dot s" style={{ left: `${posMe}%` }}>
              {initialOf(myName)}
            </span>
            <span className="sbar-dot j" style={{ left: `${posTh}%` }}>
              {initialOf(partnerName)}
            </span>
          </>
        )}
      </div>
      <div className="sbar-ends">
        <span>{q.lo}</span>
        <span>{q.hi}</span>
      </div>
    </div>
  );
}

function McBody({
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
  if (r.me === r.th) {
    return (
      <div className="mcboth">
        <span className="mccheck">✓</span> {t("You both said", "Vous avez tous deux dit")}{" "}
        <b>{optLabel(q, r.me)}</b>
      </div>
    );
  }
  return (
    <div className="mctwo">
      <span className="mcchip s">
        <i>{myName}</i>
        <b>{optLabel(q, r.me)}</b>
      </span>
      <span className="mcchip j">
        <i>{partnerName}</i>
        <b>{optLabel(q, r.th)}</b>
      </span>
    </div>
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
