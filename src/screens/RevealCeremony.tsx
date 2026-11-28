import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TopBar } from "../components/TopBar";
import { Avatar } from "../components/Avatar";
import { useT } from "../lib/i18n";
import { prefersStill } from "../lib/motion";
import { ARRIVAL_LEAD, LEVELS, arrivalFor, ceremonyLevel, type CardFinish } from "../lib/ceremony";
import { CeremonyFx } from "../lib/ceremonyFx";

// The reveal as a moment (docs/split/DECISIONS.md, "Design"): full screen, in
// the claret room, in three beats.
//   1  the two of you come together and the part is named
//   2  each question lands one at a time, its tick drawing itself
//   3  the result card arrives face down, turns over, and the score counts up
//      from zero while the room celebrates BEHIND it
// GSAP moves the elements; the light show is a canvas (lib/ceremonyFx.ts).
// A tap skips ahead: beats 1 and 2 jump to the card, and a tap during the card's
// arrival lands the count at once. Skipping never confiscates the celebration.
// With reduce-motion on, the finished card is simply shown.
export interface CeremonyRow {
  id: string;
  text: string;
  /** The app's own verdict word, already in the reader's language. */
  label: string;
  agreed: boolean;
}
type Person = { name: string; photo?: string; tone: "berry" | "honey" };

const firstOf = (n: string) => n.trim().split(/\s+/)[0] || n;
const MAX_ROWS = 7;

export function RevealCeremony({
  where,
  topic,
  me,
  them,
  pct,
  rows,
  agreed,
  toTalk,
  guesses,
  finish,
  status,
  onExit,
  onSeeAnswers,
  onShare,
}: {
  /** The top bar's title: the conversation and part. */
  where: string;
  /** What the card says you agreed on: the part or step's name. */
  topic: string;
  me: Person;
  them: Person;
  pct: number;
  rows: CeremonyRow[];
  agreed: number;
  toTalk: number;
  guesses: { right: number; made: number } | null;
  finish: CardFinish;
  /** The line read to a screen reader once the card is up. */
  status: string;
  onExit: () => void;
  onSeeAnswers: () => void;
  onShare: () => void;
}) {
  const t = useT();
  const [still] = useState(prefersStill);
  const [beat, setBeat] = useState<1 | 2 | 3>(still ? 3 : 1);
  const [settled, setSettled] = useState(still);
  const [shown, setShown] = useState(still ? pct : 0);
  const [dawn, setDawn] = useState(still && pct >= 100);
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const fx = useRef<CeremonyFx | null>(null);
  const moves = useRef<gsap.Context | null>(null);

  const shownRows = rows.slice(0, MAX_ROWS);
  const more = rows.length - shownRows.length;

  // Beat 1: the two of you come together.
  useLayoutEffect(() => {
    if (beat !== 1) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".rc-meet .rc-a", { x: -170, opacity: 0, rotation: -40 }, { x: 9, opacity: 1, rotation: 0, duration: 1, delay: 0.1, ease: "elastic.out(1,0.6)" });
      gsap.fromTo(".rc-meet .rc-b", { x: 170, opacity: 0, rotation: 40 }, { x: -9, opacity: 1, rotation: 0, duration: 1, delay: 0.1, ease: "elastic.out(1,0.6)" });
      gsap.fromTo(".rc-meet .rc-sub", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.75, ease: "power3.out" });
      gsap.fromTo(".rc-meet h1", { opacity: 0, y: 30, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.95, ease: "back.out(1.8)" });
      gsap.delayedCall(2.4, () => setBeat(rows.length ? 2 : 3));
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  // Beat 2: each question lands, and its tick draws itself.
  useLayoutEffect(() => {
    if (beat !== 2) return;
    const n = shownRows.length + (more > 0 ? 1 : 0);
    const step = Math.max(0.18, Math.min(0.38, 2.6 / Math.max(1, n)));
    const ctx = gsap.context(() => {
      gsap.fromTo(".rc-rows h2", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".rc-row").forEach((r, i) => {
        const at = 0.3 + i * step;
        gsap.fromTo(r, { opacity: 0, x: i % 2 ? 70 : -70, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 0.55, delay: at, ease: "back.out(1.6)" });
        const mark = r.querySelector(".rc-mark");
        if (mark) gsap.fromTo(mark, { opacity: 0, scale: 0, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, delay: at + 0.2, ease: "elastic.out(1,0.5)" });
        const tick = r.querySelector("path");
        if (tick) gsap.fromTo(tick, { strokeDashoffset: 22 }, { strokeDashoffset: 0, duration: 0.3, delay: at + 0.42, ease: "power2.out" });
        const word = r.querySelector(".rc-word");
        if (word) gsap.fromTo(word, { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.3, delay: at + 0.5 });
      });
      gsap.delayedCall(0.3 + n * step + 1.5, () => setBeat(3));
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  // Beat 3: the card arrives, turns over, and the score counts up.
  useLayoutEffect(() => {
    if (beat !== 3 || still) return;
    const el = card.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const level = ceremonyLevel(pct);
    const arrival = arrivalFor(pct);
    const lead = ARRIVAL_LEAD[arrival];
    const end = lead + LEVELS[level].count;
    const H = window.innerHeight || 800;
    const rel = (node: HTMLElement | null) => {
      const a = cv.getBoundingClientRect();
      const b = (node ?? cv).getBoundingClientRect();
      return { x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height };
    };
    const engine = new CeremonyFx(cv, {
      level,
      pct,
      lead,
      box: () => rel(slot.current),
      liveBox: () => rel(card.current),
      onCount: setShown,
      onShake: (dx, dy) => {
        if (stage.current) stage.current.style.translate = dx || dy ? `${dx.toFixed(1)}px ${dy.toFixed(1)}px` : "";
      },
      onDawn: () => setDawn(true),
    });
    fx.current = engine;
    const faceUp = () => el.classList.remove("flip3d");
    const ctx = gsap.context(() => {
      el.classList.add("flip3d");
      gsap.set(".rc-aft", { opacity: 0, y: 12 });
      if (arrival === "soft") {
        // The fade is on the slot, not the card: opacity on the card itself would
        // flatten it and show the face mirrored through the back.
        gsap.fromTo(slot.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power2.out" });
        gsap.fromTo(el, { y: H * 0.45, rotationY: 180, rotation: -2.5 }, { y: 0, duration: 1.5, ease: "power2.out" });
        gsap.to(el, { rotationY: 0, duration: 1.2, delay: 1.55, ease: "power2.inOut", onComplete: faceUp });
      } else if (arrival === "flip") {
        gsap.fromTo(el, { y: H * 0.75, rotationY: 180, rotation: 10, opacity: 1 }, { y: 0, rotation: -2.5, duration: 0.95, ease: "back.out(1.2)" });
        gsap.to(el, { rotationY: 0, duration: 0.85, delay: 1.15, ease: "power2.inOut", onComplete: faceUp });
      } else {
        engine.rocket(1);
        gsap.fromTo(el, { y: H * 0.95, rotationY: 180, rotation: -14, scale: 0.8, opacity: 1 }, { y: 0, rotation: -2.5, scale: 1, duration: 1, ease: "back.out(1.5)" });
        gsap.to(el, { rotationY: 0, duration: 0.7, delay: 1.25, ease: "power3.inOut", onComplete: faceUp });
        gsap.to(el, { scale: 1.12, duration: 0.35, delay: 1.25, yoyo: true, repeat: 1, ease: "power2.out" });
      }
      // The count lands: the card answers the flash with one spring.
      if (level >= 3) gsap.fromTo(el, { scale: 1.1 }, { scale: 1, duration: 0.9, delay: end, ease: "elastic.out(1,0.45)", immediateRender: false });
      gsap.to(".rc-aft", { opacity: 1, y: 0, duration: 0.5, stagger: 0.14, delay: end + 0.45, ease: "power2.out" });
      gsap.delayedCall(end + 1.5, () => setSettled(true));
    }, root);
    moves.current = ctx;
    engine.start();
    window.addEventListener("resize", engine.resize);
    return () => {
      window.removeEventListener("resize", engine.resize);
      ctx.revert();
      faceUp();
      engine.stop();
      fx.current = null;
      moves.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  // A tap skips ahead. The celebration still plays: only the waiting goes.
  const skip = useCallback(() => {
    if (beat < 3) {
      setBeat(3);
      return;
    }
    if (settled) return;
    moves.current?.revert();
    card.current?.classList.remove("flip3d");
    fx.current?.land();
    setShown(pct);
    setSettled(true);
  }, [beat, settled, pct]);

  const names = `${firstOf(me.name)} & ${firstOf(them.name)}`;
  const pair = (size: number) => (
    <div className="rc-pair" aria-hidden="true">
      <div className="rc-a">
        <Avatar name={me.name} photo={me.photo} tone={me.tone} size={size} />
      </div>
      <div className="rc-b">
        <Avatar name={them.name} photo={them.photo} tone={them.tone} size={size} />
      </div>
    </div>
  );

  return (
    <section ref={root} className={`rc${dawn ? " dawn" : ""}`} onClick={settled ? undefined : skip}>
      <div className="rc-ground" aria-hidden="true" />
      <div className="rc-dawn" aria-hidden="true" />
      <canvas ref={canvas} className="rc-fx" aria-hidden="true" />
      <TopBar onExit={onExit} title={where} />

      <div ref={stage} className="rc-stage">
        {beat === 1 && (
          <div className="rc-meet">
            {pair(64)}
            <p className="rc-sub">{t("You've both answered.", "Vous avez tous les deux répondu.")}</p>
            <h1>{topic}</h1>
          </div>
        )}

        {beat === 2 && (
          <div className="rc-rows">
            <h2>{t("Where you landed", "Où vous en êtes")}</h2>
            {shownRows.map((r) => (
              <div key={r.id} className={`rc-row${r.agreed ? " yes" : ""}`}>
                <span className="rc-mark" aria-hidden="true">
                  {r.agreed ? (
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <i />
                  )}
                </span>
                <span className="rc-q">{r.text}</span>
                <span className="rc-word">{r.label}</span>
              </div>
            ))}
            {more > 0 && (
              <div className="rc-row rc-more">
                <span className="rc-q">{t(`and ${more} more`, `et ${more} de plus`)}</span>
              </div>
            )}
          </div>
        )}

        {beat === 3 && (
          <div ref={slot} className="rc-slot">
            <div ref={card} className={`rc-card ${finish}${pct >= 100 ? " wide" : ""}${settled ? " rest" : ""}`}>
              <div className="rc-back" aria-hidden="true">
                {pair(44)}
              </div>
              <div className="rc-face">
                <div className="rc-bgl" aria-hidden="true">
                  <span className="rc-sheen" />
                </div>
                {pair(40)}
                <div className="rc-who">{names}</div>
                <div className="rc-num" aria-hidden="true">
                  {shown}
                  <span>%</span>
                </div>
                <div className="rc-on rc-aft">{t(`agreed on ${topic}`, `d’accord sur ${topic}`)}</div>
                <div className="rc-bar rc-aft" aria-hidden="true" />
                <div className="rc-meta rc-aft">
                  <span>
                    {toTalk === 0
                      ? t(`All ${agreed} agreed`, `${agreed} sur ${agreed} en accord`)
                      : t(`${agreed} agreed · ${toTalk} to talk about`, `${agreed} en accord · ${toTalk} à aborder`)}
                  </span>
                  {guesses && guesses.made > 0 && (
                    <span>
                      {t(`${guesses.right} of ${guesses.made} guesses right`, `${guesses.right} réponses devinées sur ${guesses.made}`)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {beat === 3 && (
        <p className="sr-only" role="status">
          {status}
        </p>
      )}
      {settled && (
        <div className="rc-foot">
          <button className="btn pill" type="button" onClick={onSeeAnswers}>
            {t("See your answers →", "Voir vos réponses →")}
          </button>
          <button className="pcircle rc-share" type="button" onClick={onShare} aria-label={t("Share your score", "Partager votre score")}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
