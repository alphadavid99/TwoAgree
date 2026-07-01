// Small line icons. Stroke uses currentColor so callers set the colour.
type P = { size?: number };

const svg = (size: number, children: React.ReactNode) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconHome = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ));

export const IconDecks = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <rect x="3" y="4" width="14" height="16" rx="2" />
      <path d="M7 8h6M7 12h6" />
      <path d="M20 7v11a2 2 0 0 1-2 2" />
    </>
  ));

export const IconResults = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 3v9h9" opacity="0.9" />
    </>
  ));

export const IconProfile = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </>
  ));

export const IconBack = ({ size = 24 }: P) =>
  svg(size, <path d="M15 5l-7 7 7 7" />);

export const IconClose = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ));
