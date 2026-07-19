// Waypoint glyphs for the trail map. PLACEHOLDERS — ported from the prototype so
// the map is walkable now; Dave's designer replaces this whole map with a proper
// asset set. Swapping is a one-file change: replace the entries in GLYPHS (keyed
// by the `glyph` id in data/path.json) or point them at imported SVG assets.
// 32×32 viewBox, 2.2 round stroke, currentColor — matches the app icon language.

const GLYPHS: Record<string, React.ReactNode> = {
  "g-trailhead": (
    <>
      <path d="M16 27 V7" />
      <path d="M16 9 H24.5 L27 12 L24.5 15 H16" />
      <path d="M16 17 H8.5 L6 20 L8.5 23 H16" />
    </>
  ),
  "g-fork": (
    <>
      <path d="M16 27 V18" />
      <path d="M16 18 C16 12 9.5 12.5 8.5 6.5" />
      <path d="M16 18 C16 12 22.5 12.5 23.5 6.5" />
      <path d="M6.2 8.8 L8.5 6.5 L11 8" />
      <path d="M21 8 L23.5 6.5 L25.8 8.8" />
    </>
  ),
  "g-storehouse": (
    <>
      <path d="M6 27 V14 L16 6 L26 14 V27" />
      <path d="M6 27 H26" />
      <path d="M13 27 V19 H19 V27" />
    </>
  ),
  "g-table": (
    <>
      <path d="M5 15 H27" />
      <path d="M8 15 V26 M24 15 V26" />
      <path d="M11.5 11 A2.6 2.6 0 0 1 16.7 11 Z" />
      <path d="M18.5 11 A2.2 2.2 0 0 1 22.9 11 Z" />
    </>
  ),
  "g-garden": (
    <>
      <path d="M16 27 V13" />
      <path d="M16 13 C16 8 12 6 8 6 C8 11 11 13 16 13 Z" />
      <path d="M16 19 C16 15 19.5 13.5 23 13.5 C23 18 20 19.5 16 19 Z" />
    </>
  ),
  "g-valley": (
    <>
      <path d="M4 8 L16 24 L28 8" />
      <path d="M16 24 V27" />
      <path d="M14.5 6 C15 7.5 15 9 16 9 C17 9 17 7.5 17.5 6" />
    </>
  ),
  "g-hilltop": (
    <>
      <path d="M4 27 C8 18 12 14 16 14 C20 14 24 18 28 27" />
      <path d="M16 12 V4" />
      <path d="M12.8 7 H19.2" />
    </>
  ),
  "g-horizon": (
    <>
      <path d="M4 22 H28" />
      <path d="M10 22 A6 6 0 0 1 22 22" />
      <path d="M16 10 V7 M8.5 13 L6.5 11 M23.5 13 L25.5 11" />
    </>
  ),
  "g-summit": (
    <>
      <path d="M4 27 L13 8 L18 17 L21.5 11 L28 27 Z" />
      <path d="M10.5 13.5 L13 16 L15.2 13.8" />
    </>
  ),
  "g-lookout": (
    <>
      <path d="M4 26 H28" />
      <path d="M7.5 26 C11 15.5 21 15.5 24.5 26" />
      <circle cx="16" cy="8.6" r="3.1" />
      <path d="M10.9 4.9 L9.5 3.5 M21.1 4.9 L22.5 3.5 M16 3.2 V1.8" />
    </>
  ),
  "g-lamp": (
    <>
      <path d="M13.2 5.4 A2.9 2.6 0 0 1 18.8 5.4" />
      <rect x="10" y="7.6" width="12" height="16.4" rx="4.2" />
      <path d="M16 12.4 C14.1 15 14.7 17.5 16 17.5 C17.3 17.5 17.9 15 16 12.4 Z" />
      <path d="M12.6 27 H19.4" />
    </>
  ),
};

export function PathGlyph({
  id,
  size = 28,
  color = "currentColor",
}: {
  id: string;
  size?: number;
  color?: string;
}) {
  return (
    // Colour via `style` + currentColor: CSS var() works in style, not in the
    // SVG stroke attribute, so callers can pass "var(--honey)" etc.
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color }}
      aria-hidden="true"
    >
      {GLYPHS[id] ?? GLYPHS["g-trailhead"]}
    </svg>
  );
}
