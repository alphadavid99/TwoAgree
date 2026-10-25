import { useEffect, useState, type ReactNode } from "react";
import { useT } from "../lib/i18n";

// The loading rule (design refresh, item 16; UX laws: Doherty). Show the shape
// of the screen, not a spinner, and say what's loading. After 5 seconds add
// "Still loading…"; after 10, say so plainly and offer Try again and a way back.
export function Loading({
  label,
  shape = "page",
  onBack,
  backLabel,
}: {
  /** What is loading, for screen readers and the 5-second line. */
  label: string;
  /** The outline to draw: Home's cards, or a plain page. */
  shape?: "home" | "page";
  onBack?: () => void;
  backLabel?: string;
}) {
  const t = useT();
  const [waited, setWaited] = useState(0);
  useEffect(() => {
    const a = setTimeout(() => setWaited(5), 5000);
    const b = setTimeout(() => setWaited(10), 10000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  return (
    <section className="skel" aria-busy="true">
      <p className="sr-only" role="status">
        {label}
      </p>
      {shape === "home" ? <HomeShape /> : <PageShape />}
      {waited === 5 && (
        <p className="skel-still" aria-live="polite">
          {t("Still loading…", "Toujours en chargement…")}
        </p>
      )}
      {waited >= 10 && (
        <div className="card skel-slow" role="alert">
          <h2 className="ktitle">{t("This is taking longer than usual", "Cela prend plus de temps que d’habitude")}</h2>
          <p className="helper">
            {t(
              "Check your connection. Nothing you’ve saved is lost.",
              "Vérifiez votre connexion. Rien de ce que vous avez enregistré n’est perdu.",
            )}
          </p>
          <button className="btn pill" type="button" onClick={() => window.location.reload()}>
            {t("Try again", "Réessayer")}
          </button>
          {onBack && (
            <button className="btn ghost" type="button" onClick={onBack}>
              {backLabel ?? t("Back to the start", "Retour au début")}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

const Bar = ({ w, h = 14 }: { w: string; h?: number }): ReactNode => (
  <span className="skel-bar" style={{ width: w, height: h }} />
);

function HomeShape() {
  return (
    <div aria-hidden="true">
      <div className="skel-row">
        <span className="skel-dot" />
        <span className="skel-dot" />
        <Bar w="45%" h={16} />
      </div>
      <Bar w="60%" h={36} />
      <div className="card skel-card">
        <Bar w="40%" />
        <div className="skel-row">
          <span className="skel-ring" />
          <span className="skel-lines">
            <Bar w="60%" />
            <Bar w="90%" />
          </span>
          <span className="skel-ring" />
          <span className="skel-lines">
            <Bar w="60%" />
            <Bar w="90%" />
          </span>
        </div>
      </div>
      <div className="card skel-card">
        <div className="skel-row">
          <span className="skel-tile" />
          <span className="skel-lines">
            <Bar w="50%" />
            <Bar w="80%" />
          </span>
        </div>
        <Bar w="100%" />
        <Bar w="100%" h={52} />
      </div>
    </div>
  );
}

function PageShape() {
  return (
    <div aria-hidden="true">
      <Bar w="55%" h={36} />
      <div className="card skel-card">
        <Bar w="70%" />
        <Bar w="100%" />
        <Bar w="85%" />
      </div>
      <div className="card skel-card">
        <Bar w="60%" />
        <Bar w="100%" h={52} />
      </div>
    </div>
  );
}
