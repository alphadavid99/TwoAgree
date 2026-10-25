import { useState, type ReactNode } from "react";
import { useT } from "../lib/i18n";

// Pieces of the sign-in and account screens (design refresh, item 9).

/** A password input with a show/hide eye, so you can check what you typed. */
export function PasswordField({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: "current-password" | "new-password";
  placeholder: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const t = useT();
  const [show, setShow] = useState(false);
  return (
    <div className="pwfield">
      <input
        className="input"
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      <button
        type="button"
        className="pweye"
        onClick={() => setShow((s) => !s)}
        aria-pressed={show}
        aria-label={show ? t("Hide password", "Masquer le mot de passe") : t("Show password", "Afficher le mot de passe")}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          {show && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
        </svg>
      </button>
    </div>
  );
}

/** The error that belongs to one field, right under it. */
export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="fielderr" role="alert">
      {children}
    </p>
  );
}

/** An error panel: what happened, and the way forward, in one place. */
export function ErrorPanel({ children }: { children: ReactNode }) {
  return (
    <div className="errpanel" role="alert">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
      </svg>
      <div>{children}</div>
    </div>
  );
}

// Tidy an email the way people type them on phones: stray spaces, a capital.
export const cleanEmail = (raw: string) => raw.trim();
export const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
