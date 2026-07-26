// The last line of defence. Without this a render error unmounts the whole
// tree and the tester gets a white screen — no message, no way back, and (until
// observability.ts) no report either. React only catches render errors via a
// class component, so this is the one class in the app.
import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportError } from "../lib/observability";
import { Wordmark } from "../brand/Wordmark";

type Props = { children: ReactNode };
type State = { failed: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // The component stack is names of our own components — no user content.
    reportError(error, `render:${(info.componentStack ?? "").trim().split("\n")[0] ?? "?"}`);
    console.error("[twoagree] render failed", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="screen-enter" style={{ textAlign: "center" }}>
        <div className="brandhead" style={{ marginTop: 40 }}>
          <Wordmark size={28} />
        </div>
        <h1 className="h1 center" style={{ marginTop: 28 }}>
          Something went wrong on our side.
        </h1>
        {/* No blame, no jargon, and the reassurance that matters most here:
            their answers are written per question, so nothing is lost. */}
        <p className="sub center" style={{ margin: "12px 24px 0", maxWidth: 340 }}>
          Nothing you answered has been lost — every answer is saved the moment
          you tap. Try again, and if it keeps happening, tell Dave what you were
          doing.
        </p>
        <div style={{ marginTop: 28 }}>
          <button
            className="btn pill"
            type="button"
            onClick={() => this.setState({ failed: false })}
          >
            Try again
          </button>
          <button className="btn ghost" type="button" onClick={() => window.location.reload()}>
            Reload the app
          </button>
        </div>
      </section>
    );
  }
}
