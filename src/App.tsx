import { app } from "./firebase";
import "./App.css";

// Phase 0 smoke test. No features — this only proves the pipeline:
// React + Vite renders, and the Firebase web config loaded from env
// (we read the live projectId straight off the initialized app).
export default function App() {
  const projectId = app.options.projectId ?? "(missing config)";

  return (
    <main className="smoke">
      <svg
        className="mark"
        viewBox="-60 -60 120 120"
        role="img"
        aria-label="Aligned"
      >
        <path
          d="M-46,40 L0,-46 L46,40 L20,40 L0,2.6 L-20,40 Z"
          fill="var(--berry)"
        />
      </svg>

      <h1>Aligned</h1>
      <p className="tagline">surface, don&rsquo;t settle</p>

      <div className="status">
        <span className="dot" />
        Firebase connected &mdash; project <code>{projectId}</code>
      </div>

      <p className="phase">Phase&nbsp;0 &middot; toolchain smoke test</p>
    </main>
  );
}
