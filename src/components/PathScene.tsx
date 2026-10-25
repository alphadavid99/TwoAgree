import { useId, type ReactNode } from "react";

// The Path's scene (design refresh, items 10 and 14): one sky, the same hills
// and road in every step, lamps along the way, and the step's landmark where the
// road leads. Code-drawn so it's crisp at any size; Dave's illustrated
// landmarks can later drop into the same spot. Static: no motion, and no text
// sits on it. Colours are the --scene-* tokens (tokens.css).

const fill = (token: string) => ({ fill: `var(--${token})` });
const stroke = (token: string, width: number) => ({ stroke: `var(--${token})`, strokeWidth: width, fill: "none" });

// Lamps, nearest first. The ones you've lit glow; the rest wait along the road.
const LAMPS: [number, number][] = [
  [104, 236],
  [252, 282],
  [184, 190],
  [318, 232],
  [262, 165],
  [314, 198],
  [326, 150],
  [360, 172],
];

function Lamp({ x, y, lit }: { x: number; y: number; lit: boolean }) {
  // Further up the road reads smaller.
  const s = 0.55 + ((y - 140) / 160) * 0.65;
  return (
    <g>
      {lit && <circle cx={x} cy={y - 16 * s} r={13 * s} style={{ ...fill("scene-lamp"), opacity: 0.35 }} />}
      <line x1={x} y1={y} x2={x} y2={y - 14 * s} style={stroke("scene-post", 2.4 * s)} strokeLinecap="round" />
      <circle cx={x} cy={y - 16 * s} r={4.4 * s} style={fill(lit ? "scene-lamp" : "scene-lamp-off")} />
    </g>
  );
}

const LANDMARKS: Record<string, ReactNode> = {
  // A gate to set out through.
  trailhead: (
    <g>
      <line x1={338} y1={146} x2={338} y2={86} style={stroke("scene-wood", 6)} strokeLinecap="round" />
      <line x1={402} y1={146} x2={402} y2={86} style={stroke("scene-wood", 6)} strokeLinecap="round" />
      <path d="M330 92 Q370 62 410 92" style={stroke("scene-wood", 6)} strokeLinecap="round" />
      <rect x={352} y={92} width={36} height={14} rx={3} style={fill("app-honey")} />
    </g>
  ),
  // A signpost where the road splits.
  fork: (
    <g>
      <path d="M290 150 C 330 140, 360 132, 372 128 C 400 120, 440 118, 480 116" style={stroke("scene-road", 5)} />
      <line x1={372} y1={150} x2={372} y2={66} style={stroke("scene-wood", 5)} strokeLinecap="round" />
      <path d="M338 76 h34 v14 h-34 l-9 -7z" style={fill("app-honey")} />
      <path d="M372 96 h34 l9 7 -9 7 h-34z" style={fill("scene-rose")} />
    </g>
  ),
  // A storehouse.
  storehouse: (
    <g>
      <rect x={342} y={96} width={56} height={50} style={fill("scene-rose")} />
      <path d="M332 99 L370 66 L408 99z" style={fill("ta-claret")} />
      <rect x={362} y={118} width={16} height={28} style={fill("app-honey")} />
      <circle cx={370} cy={86} r={5} style={fill("app-honey")} />
      <ellipse cx={420} cy={140} rx={12} ry={8} style={fill("app-honey")} />
    </g>
  ),
  // A table under a tree.
  table: (
    <g>
      <line x1={418} y1={150} x2={418} y2={92} style={stroke("scene-wood", 6)} />
      <circle cx={408} cy={80} r={22} style={fill("scene-leaf")} />
      <circle cx={428} cy={92} r={16} style={fill("scene-leaf-deep")} />
      <rect x={336} y={112} width={64} height={7} rx={2} style={fill("app-honey")} />
      <line x1={344} y1={119} x2={344} y2={146} style={stroke("scene-wood", 4)} />
      <line x1={392} y1={119} x2={392} y2={146} style={stroke("scene-wood", 4)} />
      <path d="M326 100 V146 M326 124 H336 M336 124 V146" style={stroke("ta-claret", 4)} strokeLinecap="round" />
      <path d="M410 100 V146 M410 124 H400 M400 124 V146" style={stroke("ta-claret", 4)} strokeLinecap="round" />
      <circle cx={356} cy={108} r={4} style={fill("ta-white")} />
      <circle cx={380} cy={108} r={4} style={fill("ta-white")} />
    </g>
  ),
  // A rose arbour.
  garden: (
    <g>
      <ellipse cx={330} cy={142} rx={18} ry={10} style={fill("scene-leaf")} />
      <ellipse cx={412} cy={142} rx={18} ry={10} style={fill("scene-leaf")} />
      <path d="M338 148 V108 A33 33 0 0 1 404 108 V148" style={stroke("scene-leaf-deep", 7)} />
      {[
        [338, 112],
        [344, 88],
        [360, 77],
        [382, 77],
        [398, 88],
        [404, 112],
        [338, 132],
        [404, 132],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} style={fill(i % 2 ? "app-honey" : "scene-rose")} />
      ))}
    </g>
  ),
  // A bridge over a stream.
  valley: (
    <g>
      <path d="M270 142 C 330 126, 400 150, 480 132" style={stroke("scene-water", 14)} strokeLinecap="round" />
      <path d="M344 142 Q370 112 396 142" style={stroke("ta-claret", 7)} strokeLinecap="round" />
      <path d="M318 132 l9 -28 l9 28z" style={fill("scene-leaf-deep")} />
      <path d="M428 128 l8 -24 l8 24z" style={fill("scene-leaf-deep")} />
    </g>
  ),
  // A chapel on the hill.
  hilltop: (
    <g>
      <ellipse cx={370} cy={148} rx={64} ry={14} style={fill("scene-hill-mid")} />
      <rect x={350} y={102} width={40} height={42} style={{ ...fill("ta-white"), stroke: "var(--ta-claret)", strokeWidth: 3 }} />
      <path d="M344 104 L370 82 L396 104z" style={fill("ta-claret")} />
      <rect x={364} y={122} width={12} height={22} rx={6} style={fill("app-honey")} />
      <line x1={370} y1={82} x2={370} y2={58} style={stroke("app-honey", 4)} />
      <line x1={361} y1={67} x2={379} y2={67} style={stroke("app-honey", 4)} />
    </g>
  ),
  // Sunrise over the sea.
  horizon: (
    <g>
      <path d="M352 122 A22 22 0 0 1 396 122z" style={fill("app-honey")} />
      {[-60, -30, 0, 30, 60].map((a) => (
        <line
          key={a}
          x1={374 + Math.sin((a * Math.PI) / 180) * 30}
          y1={122 - Math.cos((a * Math.PI) / 180) * 30}
          x2={374 + Math.sin((a * Math.PI) / 180) * 42}
          y2={122 - Math.cos((a * Math.PI) / 180) * 42}
          style={stroke("app-honey", 3)}
          strokeLinecap="round"
        />
      ))}
      <rect x={290} y={122} width={190} height={24} style={fill("scene-water")} />
      <line x1={320} y1={132} x2={350} y2={132} style={stroke("ta-white", 2)} strokeLinecap="round" />
      <line x1={400} y1={138} x2={440} y2={138} style={stroke("ta-white", 2)} strokeLinecap="round" />
    </g>
  ),
  // The peak, with the mark's gold bar.
  summit: (
    <g>
      <path d="M296 150 L370 54 L444 150z" style={fill("scene-peak")} />
      <path d="M352 77 L370 54 L388 77 L379 72 L370 80 L361 72z" style={fill("ta-white")} />
      <rect x={350} y={30} width={40} height={8} rx={4} style={fill("ta-honey")} />
    </g>
  ),
  // A bench at the lookout.
  lookout: (
    <g>
      <circle cx={440} cy={58} r={16} style={fill("scene-sun")} />
      <rect x={316} y={134} width={108} height={6} style={fill("scene-wood")} />
      <line x1={322} y1={140} x2={322} y2={152} style={stroke("scene-wood", 4)} />
      <line x1={418} y1={140} x2={418} y2={152} style={stroke("scene-wood", 4)} />
      <line x1={318} y1={118} x2={422} y2={118} style={stroke("scene-wood", 3)} />
      <rect x={350} y={98} width={40} height={6} rx={2} style={fill("app-honey")} />
      <rect x={350} y={112} width={40} height={6} rx={2} style={fill("app-honey")} />
      <line x1={354} y1={118} x2={354} y2={134} style={stroke("ta-claret", 3)} />
      <line x1={386} y1={118} x2={386} y2={134} style={stroke("ta-claret", 3)} />
    </g>
  ),
};

export const SCENE_KEYS = Object.keys(LANDMARKS);

export function PathScene({
  stepKey,
  lit,
  label,
  className,
}: {
  /** The step whose landmark the road leads to (path.json key). */
  stepKey: string;
  /** How many steps you've walked: that many lamps glow. */
  lit: number;
  /** What a screen reader hears ("Step 4, The Table"). */
  label: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 480 308" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--scene-sky-top)" }} />
          <stop offset="1" style={{ stopColor: "var(--scene-sky-bot)" }} />
        </linearGradient>
        <radialGradient id={`sun${id}`}>
          <stop offset="0" style={{ stopColor: "var(--scene-sun)", stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: "var(--scene-sun)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <rect width={480} height={308} fill={`url(#sky${id})`} />
      <circle cx={372} cy={78} r={120} fill={`url(#sun${id})`} />
      <path d="M0 150 C 80 112, 160 122, 240 136 S 400 108, 480 122 V308 H0z" style={fill("scene-hill-far")} />
      {LANDMARKS[stepKey]}
      <path d="M0 202 C 90 172, 200 178, 300 192 S 420 166, 480 178 V308 H0z" style={fill("scene-hill-mid")} />
      <path d="M0 254 C 100 228, 200 238, 300 248 S 420 232, 480 240 V308 H0z" style={fill("scene-hill-near")} />
      <path d="M86 308 C 150 236, 270 204, 362 150 L374 153 C 300 212, 236 252, 236 308z" style={fill("scene-road")} />
      <path d="M162 308 C 214 244, 300 204, 368 152" style={{ ...stroke("app-honey", 2.4), strokeDasharray: "7 8" }} />
      {LAMPS.map(([x, y], i) => (
        <Lamp key={i} x={x} y={y} lit={i < lit} />
      ))}
    </svg>
  );
}
