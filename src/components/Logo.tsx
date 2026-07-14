// The TwoAgree mark (TWOAGREE-MARK.md v5.1). Two cuts of one skeleton:
// the DISPLAY cut stands alone (icons, in-flow headers); the TEXT cut is
// inlined as the A of the live-type wordmark, its geometry measured from
// Questrial by scripts/measure-questrial.mjs — do not edit the numbers.

// Display cut — H/x 7.0964, constrained by the 32px raster.
const D_L = "M 324.92 0 L 473.087 0 L 148.168 1000 L 0 1000 Z";
const D_R = "M 526.913 0 L 675.08 0 L 1000 1000 L 851.832 1000 Z";
const D_BAR = "M 349.933 553.213 L 650.067 553.213 L 692.191 682.855 L 307.809 682.855 Z";

// Text cut — measured from Questrial (S/cap 11.31%, H/x 9.4488, H/W 1.0955).
const VBW = 912.825;
const T_L = "M 324.92 0 L 436.2 0 L 111.28 1000 L 0 1000 Z";
const T_R = "M 476.625 0 L 587.905 0 L 912.825 1000 L 801.545 1000 Z";
const T_BAR = "M 293.712 569.35 L 619.113 569.35 L 650.749 666.718 L 262.076 666.718 Z";

export function Logo({
  size = 34,
  word = true,
}: {
  size?: number;
  word?: boolean;
}) {
  if (!word) {
    return (
      <div className="logo">
        <svg
          width={size}
          height={size}
          viewBox="0 0 1000 1000"
          role="img"
          aria-label="TwoAgree"
        >
          <path fill="currentColor" d={D_L} />
          <path fill="currentColor" d={D_R} />
          <path className="bar" fill="currentColor" d={D_BAR} />
        </svg>
      </div>
    );
  }
  return (
    <span
      className="logo twoagree-lockup"
      role="img"
      aria-label="TwoAgree"
      style={{ fontSize: Math.round(size * 0.8) }}
    >
      <span className="twoagree-wordmark" aria-hidden="true">
        Two
        <svg viewBox={`0 0 ${VBW} 1000`}>
          <path d={T_L} />
          <path d={T_R} />
          <path className="bar" d={T_BAR} />
        </svg>
        gree
      </span>
    </span>
  );
}
