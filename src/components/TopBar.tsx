import type { ReactNode } from "react";
import { IconClose } from "./icons";

// In-flow header, full screen (Dave, Nov 2026, after Dateasy): no mark, just
// close in a glass circle on the left, so the user is never stranded, and an
// optional title in the middle. Answers are saved as you go, so leaving is
// always safe.
export function TopBar({ onExit, title }: { onExit?: () => void; title?: ReactNode }) {
  if (!onExit && !title) return <div className="topbar topbar-none" />;
  return (
    <div className="topbar">
      <span className="topbar-slot">
        {onExit && (
          <button className="pcircle" type="button" onClick={onExit} aria-label="Close and go home">
            <IconClose size={20} />
          </button>
        )}
      </span>
      {title ? <span className="topbar-title">{title}</span> : <span />}
      <span className="topbar-slot" />
    </div>
  );
}
