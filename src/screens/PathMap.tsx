import { useEffect, useRef, useState } from "react";
import type { Role } from "../lib/scoring";
import type { Session } from "../types";
import { orderedSteps, currentIndex, lampLit, pathPartial, SHORT_THEME, stepQuestions } from "../lib/path";
import { PATH_STEPS } from "../data/path.generated";
import { Landmark } from "../components/PathScene";

type T = (en: string, fr: string) => string;

// The Path map (design refresh, item 14): one illustrated road from the
// Trailhead at the bottom to the Lookout under the sun, every landmark on it.
// It opens where you are, with a card pinned at the bottom. The drawing is
// decoration; each step is a real button, so the map works by keyboard and
// screen reader as well as touch. Walked steps keep a small lit lamp.

const W = 360;
const GAP = 150;
const N = PATH_STEPS.length; // ten: nine steps and the Lookout
const H = 170 + GAP * (N - 1) + 150;
const nodeX = (i: number) => (i % 2 === 0 ? 108 : 252);
const nodeY = (i: number) => H - 150 - GAP * i;

function road(): string {
  let d = `M ${nodeX(0)} ${H}`;
  d += ` L ${nodeX(0)} ${nodeY(0)}`;
  for (let i = 1; i < N; i++) {
    const my = (nodeY(i - 1) + nodeY(i)) / 2;
    d += ` C ${nodeX(i - 1)} ${my}, ${nodeX(i)} ${my}, ${nodeX(i)} ${nodeY(i)}`;
  }
  return d;
}

// A few trees, placed by hand away from the road and the labels.
const TREES: [number, number][] = [
  [40, 1540], [330, 1440], [40, 1190], [330, 900], [40, 760], [330, 470], [40, 320], [330, 200],
];

export function PathMap({
  session,
  partnerName,
  onOpen,
  t,
}: {
  session: Session;
  role: Role;
  partnerName: string;
  onOpen: (index: number) => void;
  t: T;
}) {
  const steps = orderedSteps(session);
  const partial = pathPartial(session);
  const cur = currentIndex(session);
  const atLookout = !partial && cur >= N - 1;
  const here = Math.min(cur, N - 1);
  const [toast, setToast] = useState("");
  const curBtn = useRef<HTMLButtonElement>(null);
  const them = partnerName.trim().split(/\s+/)[0] || partnerName;

  // Open where you are.
  useEffect(() => {
    curBtn.current?.scrollIntoView?.({ block: "center" });
  }, []);

  const laid = (i: number) => i === N - 1 ? !partial && steps.length > 0 : steps.some((s) => s.index === i);
  const walked = (i: number) => lampLit(session, i);
  const open = (i: number) => walked(i) || (i === here && laid(i));

  const tap = (i: number) => {
    if (open(i)) return onOpen(i);
    setToast(
      partial && i > 0
        ? t(
            `This step is chosen once ${them} has answered the path questions too.`,
            `Cette étape sera choisie quand ${them} aura répondu aux questions du chemin.`,
          )
        : t("The path opens one step at a time.", "Le chemin s’ouvre une étape à la fois."),
    );
    setTimeout(() => setToast(""), 2600);
  };

  const meta = PATH_STEPS[here];
  const step = steps.find((s) => s.index === here);
  const count = step ? stepQuestions(step.data).length : 0;
  const trailheadWalked = partial && walked(0);

  return (
    <section className="screen-enter pmap-screen">
      <p className="eyebrow" style={{ marginTop: 18 }}>
        {t("The Path", "Le Chemin")}
      </p>
      <h1 className="h1" style={{ margin: "4px 0 14px" }}>
        {partial && !walked(0)
          ? t("Ten steps, walked together", "Dix étapes, parcourues ensemble")
          : atLookout
            ? t("The Lookout", "Le Belvédère")
            : trailheadWalked
              ? t("Step 2 · The Fork", "Étape 2 · La Bifurcation")
              : t(`Step ${here + 1} · ${meta.name}`, `Étape ${here + 1} · ${meta.name}`)}
      </h1>

      <div className="pmap">
        <svg viewBox={`0 0 ${W} ${H}`} className="pmap-art" aria-hidden="true">
          <defs>
            <linearGradient id="pmap-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--scene-sky-top)" }} />
              <stop offset="0.16" style={{ stopColor: "var(--scene-sky-bot)" }} />
              <stop offset="0.5" style={{ stopColor: "var(--scene-hill-far)" }} />
              <stop offset="1" style={{ stopColor: "var(--scene-hill-mid)" }} />
            </linearGradient>
            <radialGradient id="pmap-sun">
              <stop offset="0" style={{ stopColor: "var(--scene-sun)", stopOpacity: 0.95 }} />
              <stop offset="1" style={{ stopColor: "var(--scene-sun)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#pmap-sky)" />
          <circle cx={W / 2} cy={70} r={150} fill="url(#pmap-sun)" />
          {[0.32, 0.55, 0.78].map((f) => (
            <path
              key={f}
              d={`M0 ${H * f} C 90 ${H * f - 30}, 220 ${H * f + 30}, ${W} ${H * f - 10} V ${H * f + 60} H 0z`}
              style={{ fill: "var(--scene-hill-mid)", opacity: 0.35 }}
            />
          ))}
          {TREES.map(([x, y], i) => (
            <g key={i}>
              <line x1={x} y1={y} x2={x} y2={y + 14} style={{ stroke: "var(--scene-wood)", strokeWidth: 2 }} />
              <circle cx={x} cy={y} r={10} style={{ fill: "var(--scene-leaf)" }} />
            </g>
          ))}
          <path d={road()} style={{ fill: "none", stroke: "var(--kit-card-base)", strokeWidth: 34, strokeLinecap: "round" }} />
          <path d={road()} style={{ fill: "none", stroke: "var(--scene-road)", strokeWidth: 28, strokeLinecap: "round" }} />
          <path d={road()} style={{ fill: "none", stroke: "var(--app-honey)", strokeWidth: 2.4, strokeDasharray: "7 8" }} />
          {PATH_STEPS.map((m, i) => {
            const x = nodeX(i);
            const y = nodeY(i);
            const ahead = !walked(i) && i !== here;
            const s = 0.55;
            return (
              <g key={m.key} style={{ opacity: ahead ? 0.45 : 1 }}>
                {i === here && !atLookout && (
                  <circle cx={x} cy={y - 8} r={52} style={{ fill: "var(--scene-sun)", opacity: 0.5, stroke: "var(--app-honey)", strokeWidth: 2, strokeDasharray: "4 6" }} />
                )}
                <g transform={`translate(${x - 370 * s} ${y - 118 * s}) scale(${s})`}>
                  <Landmark stepKey={m.key} />
                </g>
                {walked(i) && (
                  <g>
                    <circle cx={x + (i % 2 ? 42 : -42)} cy={y - 2} r={9} style={{ fill: "var(--scene-lamp)", opacity: 0.35 }} />
                    <line x1={x + (i % 2 ? 42 : -42)} y1={y + 16} x2={x + (i % 2 ? 42 : -42)} y2={y + 2} style={{ stroke: "var(--scene-post)", strokeWidth: 2 }} />
                    <circle cx={x + (i % 2 ? 42 : -42)} cy={y - 2} r={4.5} style={{ fill: "var(--scene-lamp)" }} />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <ol className="pmap-stops">
          {PATH_STEPS.map((m, i) => {
            const isHere = i === here && laid(i);
            const state = walked(i)
              ? t("walked", "parcourue")
              : isHere
                ? t("you are here", "vous êtes ici")
                : t("not open yet", "pas encore ouverte");
            return (
              <li
                key={m.key}
                style={{ top: `${(nodeY(i) / H) * 100}%`, ...(i % 2 === 0 ? { left: "47%" } : { right: "47%" }) }}
              >
                <button
                  ref={isHere ? curBtn : undefined}
                  type="button"
                  className={`pmap-stop${isHere ? " here" : walked(i) ? " walked" : " ahead"}`}
                  onClick={() => tap(i)}
                  aria-current={isHere ? "step" : undefined}
                  aria-label={`${t(`Step ${i + 1}`, `Étape ${i + 1}`)}, ${m.name}, ${m.theme}: ${state}`}
                >
                  <b>{m.name}</b>
                  <span>{t(`Step ${i + 1} · ${SHORT_THEME[m.key] ?? m.theme}`, `Étape ${i + 1} · ${SHORT_THEME[m.key] ?? m.theme}`)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {toast && (
        <div className="path-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

      {/* The pinned card: where you are and the one thing to do. */}
      <div className="card pmap-card">
        {partial && !walked(0) ? (
          <>
            <h2 className="ktitle">{t("Start with The Trailhead", "Commencez par le Départ")}</h2>
            <p className="helper">
              {t(
                `It’s the same for every couple. The questions in the steps after it are chosen from both your answers, once ${them} has answered the path questions too.`,
                `Elle est la même pour chaque couple. Les questions des étapes suivantes seront choisies à partir de vos deux réponses, quand ${them} aura répondu aux questions du chemin.`,
              )}
            </p>
            <button className="btn pill" type="button" onClick={() => onOpen(0)}>
              {t("Take the first step", "Faire le premier pas")}
            </button>
          </>
        ) : trailheadWalked ? (
          <>
            <h2 className="ktitle">{t("Next: The Fork", "Ensuite : la Bifurcation")}</h2>
            <p className="helper">
              {t(
                `The rest of the path is chosen from both your answers. It opens once ${them} has answered the path questions too.`,
                `La suite du chemin est choisie à partir de vos deux réponses. Elle s’ouvre quand ${them} aura répondu aux questions du chemin.`,
              )}
            </p>
          </>
        ) : (
          <div className="pmap-card-row">
            <span>
              <span className="pmap-card-nm">
                {atLookout ? t("The Lookout", "Le Belvédère") : t(`Step ${here + 1} · ${meta.name}`, `Étape ${here + 1} · ${meta.name}`)}
              </span>
              <span className="helper">
                {atLookout
                  ? t("Journey’s end", "Fin du voyage")
                  : `${meta.theme} · ${t(`${count} question${count === 1 ? "" : "s"}`, `${count} question${count === 1 ? "" : "s"}`)}`}
              </span>
            </span>
            <button className="btn pill" type="button" onClick={() => onOpen(here)}>
              {t("Continue", "Continuer")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
