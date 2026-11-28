import { useState } from "react";
import { Mark } from "../brand/Mark";
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
import { celebrationTier } from "../lib/celebrate";
import { defaultFinish, shareFinishes } from "../lib/ceremony";
import { RevealCeremony, type CeremonyRow } from "./RevealCeremony";
import { revealWords, type Pick } from "../lib/reveal";
import { ScoreShare } from "../components/ScoreShare";
import { shareTopic } from "../lib/shareTopic";
import { talkStateOf, type TalkState } from "../lib/talks";
import { useEdgeFade } from "../hooks/useEdgeFade";
import { ScoreRings } from "../components/ScoreRings";
import { scaleText, scaleWord } from "../lib/answerWords";
import { partName } from "../lib/leveling";
import { answerText } from "../lib/discoveries";
import { deckOf } from "../lib/path";
import { writeTalkPin } from "../lib/session";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { asTheirs, optText, withNames } from "../lib/who";
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
  myPhoto,
  partnerPhoto,
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
  /** Each of your photos, when you have one (shared in the session). */
  myPhoto?: string;
  partnerPhoto?: string;
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
  const fadePills = useEdgeFade<HTMLDivElement>();
  const qs = questions ?? lvlQs(slug, level);
  const data = deck ?? {};
  const pct = overall(qs, data, role);
  const basis = agreeBasis(qs, data);
  // Both names by role for "which of you" questions (same order on both phones).
  const names = {
    host: role === "host" ? myName : partnerName,
    guest: role === "guest" ? myName : partnerName,
    me: role,
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
  const ceremony = !review && hasScore;
  const [phase, setPhase] = useState<"ceremony" | "answers">(
    ceremony ? "ceremony" : "answers",
  );
  const tier = celebrationTier(pct);
  // The same line and verse for both of you (picked when the part opened).
  const words = revealWords(pct, pick, `${code ?? ""}|${slug}|${level}`);
  const [sharing, setSharing] = useState(false);

  const where =
    (title ?? deckName(slug, lang)) +
    (review
      ? t(" · Review", " · Récap")
      : multi
        ? t(` · Part ${level + 1} of ${nLevels(slug)}`, ` · Partie ${level + 1} sur ${nLevels(slug)}`)
        : "");

  if (phase === "ceremony") {
    // The same verdict words the answers screen uses; "Not yet" is shown, unscored.
    const agreedKind = (v: Verdict) => v === "Agreed" || v === "Complementary" || v === "Shared";
    const scoredQs = joint.filter((q) => q.type !== "open");
    const rows: CeremonyRow[] = [
      ...scoredQs.map((q) => {
        const v = scoreQ(q, data, role).verdict;
        return { id: q.id, text: withNames(localizeQuestion(q, lang), names).q, label: t(v, VERDICT_FR[v]), agreed: agreedKind(v) };
      }),
      ...notYet.map((q) => ({ id: q.id, text: withNames(localizeQuestion(q, lang), names).q, label: t("Not yet", "Pas encore"), agreed: false })),
    ];
    const nAgreed = scoredQs.filter((q) => agreedKind(scoreQ(q, data, role).verdict)).length;
    const topic = title ?? (multi ? partName(slug, level) : deckName(slug, lang));
    return (
      <>
        <RevealCeremony
          where={where}
          topic={topic}
          me={{ name: myName, photo: myPhoto, tone: toneFor(role) }}
          them={{ name: partnerName, photo: partnerPhoto, tone: toneFor(other(role)) }}
          pct={pct}
          rows={rows}
          agreed={nAgreed}
          toTalk={scoredQs.length - nAgreed}
          guesses={know.made ? { right: know.right, made: know.made } : null}
          finish={defaultFinish(pct)}
          status={`${t(`You agreed ${pct} percent.`, `Vous êtes d’accord à ${pct} pour cent.`)} ${words.line}`}
          onExit={onDone}
          onSeeAnswers={() => setPhase("answers")}
          onShare={() => setSharing(true)}
        />
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
            finishes={shareFinishes(pct)}
            defaultFinish={defaultFinish(pct)}
            onClose={() => setSharing(false)}
          />
        )}
      </>
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
    <div ref={fadePills} className="fpills" role="group" aria-label={t("Show", "Afficher")}>
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
        {partLabel}
      </div>
      <h1 className="h1 center" style={{ margin: "4px 0 0" }}>
        {hasScore ? t("Your answers, side by side", "Vos réponses, face à face") : t("What you each said", "Ce que chacun a dit")}
      </h1>
      {/* Fresh from the ceremony: the range's line and verse, the first-reveal
          line, and the reminder that used to sit on the reveal itself. */}
      {ceremony && (
        <div className="rc-words">
          <p className="rc-words-line">{words.line}</p>
          <p className="rc-words-verse">
            “{words.verse.text}” <span>{words.verse.ref}</span>
          </p>
          {firstEver && (
            <p className="rc-words-note">
              {t(
                "Your first reveal: this is where the two of you meet.",
                "Votre première révélation, c’est ici que vous vous retrouvez.",
              )}
            </p>
          )}
          <p className="rc-words-note">
            {t(
              `Based on ${basis} question${basis === 1 ? "" : "s"} you both answered`,
              `Sur ${basis} question${basis === 1 ? "" : "s"} auxquelles vous avez tous deux répondu`,
            )}
          </p>
          {pct < 100 && (
            <p className="rc-words-note">
              {t("Not a verdict: a place to start talking.", "Pas un verdict, un point de départ pour discuter.")}
            </p>
          )}
        </div>
      )}
      {hasScore && (
        <ScoreRings
          agree={pct}
          basis={basis}
          known={know.pct}
          right={know.right}
          made={know.made}
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
                    ○ {t("You guessed", "Vous pensiez")} <b>{guessWords(asTheirs(q), r.guess, t)}</b>
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
  // Their answer in their own words ("I'd choose Sarah for life"); one shared
  // line only when you both said the same thing in the same words.
  const theirs = asTheirs(q);
  const same = mv === tv && !isMirror(q) && scaleText(q, mv, t) === scaleText(theirs, tv, t);
  return (
    <div className="atrack">
      <div className="atrack-steps" role="img" aria-label={`${me.name}: ${scaleText(q, mv, t)}. ${them.name}: ${scaleText(theirs, tv, t)}.`}>
        {[1, 2, 3, 4, 5].map((n) => {
          const here = [n === mv ? me : null, n === tvHere ? them : null].filter((x): x is Who => !!x);
          return (
            <span key={n} className="atrack-step">
              {here.length === 2 ? (
                // The same point: one circle wearing the mark, not two
                // avatars jostling for one step (feedback 24).
                <span className="atrack-both">
                  {/* On a light disc the mark is one ink, claret (gold only
                      ever sits on claret: TWOAGREE-MARK.md rule 2). */}
                  <Mark height={16} colour="var(--ta-claret)" />
                </span>
              ) : here.length ? (
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
          <AnswerRow who={them} text={scaleText(theirs, tv, t)} />
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
  const text = (v: AnswerValue | undefined, as = q) => (v == null ? "—" : (optText(as, v) ?? "—"));
  const theirs = asTheirs(q);
  if (r.me === r.th && text(r.me) === text(r.th, theirs)) {
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
      <AnswerRow who={them} text={text(r.th, theirs)} />
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

// An open answer: who said it (the same soft avatar as everywhere, with
// their photo when they have one), then what they wrote.
function Quote({ name, tone, text, photo }: { name: string; tone: "s" | "j"; text: string; photo?: string }) {
  return (
    <div className="oq">
      <Avatar name={name} photo={photo} tone={tone === "s" ? "berry" : "honey"} size={30} ring={false} />
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
  const side = (name: string, v: AnswerValue | undefined, as = q) =>
    isNotYet(v) ? (
      <div className="ny-side ny-wait">
        <span className="ny-name">{first(name)}</span>
        <b>{t("Not yet", "Pas encore")}</b>
      </div>
    ) : (
      <div className="ny-side">
        <span className="ny-name">{first(name)}</span>
        <b>{v == null ? "—" : cap(answerText(as, v))}</b>
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
        {side(partnerName, theirs, asTheirs(q))}
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

