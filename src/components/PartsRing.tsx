// A conversation's progress as a ring (Dave, Nov 2026): one segment per part,
// starting at twelve o'clock and running clockwise. One colour fills each
// segment as you answer it, over a pale track; a soft disc sits inside for
// the topic's icon. Drawn on a 120 grid so every stroke lands on the same
// circle and the gaps between segments are exactly equal.
const C = 60; // centre
const R = 54; // the ring's radius, to the middle of its stroke
const SW = 6; // stroke width

const at = (a: number) => `${(C + R * Math.cos(a)).toFixed(3)} ${(C + R * Math.sin(a)).toFixed(3)}`;

export function PartsRing({ fills }: { fills: number[] }) {
  const n = Math.max(1, fills.length);
  const clamp = (f: number) => Math.max(0, Math.min(1, f || 0));
  // The gap you see between two segments. Round caps reach half a stroke past
  // each end of a path, so the paths themselves stop a stroke further apart.
  const seen = n > 6 ? 5 : 7;
  const gap = n === 1 ? 0 : (seen + SW) / R;
  const span = (2 * Math.PI) / n - gap;
  const arcs = Array.from({ length: n }, (_, k) => {
    const a0 = -Math.PI / 2 + gap / 2 + (k * 2 * Math.PI) / n;
    return `M ${at(a0)} A ${R} ${R} 0 ${span > Math.PI ? 1 : 0} 1 ${at(a0 + span)}`;
  });
  return (
    <svg className="pring" viewBox="0 0 120 120" aria-hidden="true">
      <circle className="pring-disc" cx={C} cy={C} r={42} />
      {n === 1 ? (
        <>
          <circle className="pring-track" cx={C} cy={C} r={R} />
          {clamp(fills[0]) > 0 && (
            <circle
              className="pring-fill"
              cx={C}
              cy={C}
              r={R}
              pathLength={1}
              strokeDasharray={clamp(fills[0]) >= 1 ? undefined : `${clamp(fills[0])} 2`}
              transform={`rotate(-90 ${C} ${C})`}
            />
          )}
        </>
      ) : (
        arcs.map((d, k) => {
          const f = clamp(fills[k]);
          return (
            <g key={k}>
              <path className="pring-track" d={d} />
              {f > 0 && <path className="pring-fill" d={d} pathLength={1} strokeDasharray={f >= 1 ? undefined : `${f} 2`} />}
            </g>
          );
        })
      )}
    </svg>
  );
}
