import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useT } from "../lib/i18n";

// A bottom sheet (How scores work, Share your score, the conversation guide).
// Rendered into the phone container, not in place: a screen's entry motion
// makes its own stacking layer, which would put the tab bar over the sheet.
// The dialog itself takes focus (not the ×), so screen readers land in it
// without a focus ring appearing on a touch open; Escape closes it.
export function Sheet({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const t = useT();
  const sheet = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLSpanElement>(null);
  const [host, setHost] = useState<Element | null>(null);
  useEffect(() => {
    setHost(anchor.current?.closest(".phone") ?? document.body);
  }, []);
  useEffect(() => {
    sheet.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, host]);
  if (!host) return <span ref={anchor} hidden />;
  return createPortal(
    <div className="sheet-scrim" onClick={onClose}>
      <div
        ref={sheet}
        tabIndex={-1}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-grip" aria-hidden="true" />
        <div className="sheet-head">
          <div>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            <h2 className="sheet-title">{title}</h2>
          </div>
          <button className="iconbtn" type="button" onClick={onClose} aria-label={t("Close", "Fermer")}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    host,
  );
}
