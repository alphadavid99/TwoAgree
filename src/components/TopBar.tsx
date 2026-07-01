import { Logo } from "./Logo";
import { IconClose } from "./icons";

// In-flow header: the caret logo centred, with an optional close button so the
// user is never stranded (e.g. mid-questions). Answers are saved as you go, so
// leaving is always safe.
export function TopBar({ onExit }: { onExit?: () => void }) {
  return (
    <div className="topbar">
      <span className="topbar-slot" />
      <Logo size={26} />
      <span className="topbar-slot topbar-slot--right">
        {onExit && (
          <button
            className="iconbtn"
            type="button"
            onClick={onExit}
            aria-label="Close and go home"
          >
            <IconClose size={22} />
          </button>
        )}
      </span>
    </div>
  );
}
