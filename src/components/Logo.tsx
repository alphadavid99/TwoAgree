// The C3 caret mark (brand logo). Optional "aligned" wordmark beside it.
export function Logo({
  size = 34,
  word = true,
}: {
  size?: number;
  word?: boolean;
}) {
  return (
    <div className="logo">
      <svg
        width={size}
        height={size}
        viewBox="-60 -60 120 120"
        role="img"
        aria-label="Aligned"
      >
        <path
          d="M-46,40 L0,-46 L46,40 L20,40 L0,2.6 L-20,40 Z"
          fill="var(--berry)"
        />
      </svg>
      {word && <span className="logo-word">Aligned</span>}
    </div>
  );
}
