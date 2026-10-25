// The last line of defence. Without this a render error unmounts the whole
// tree and the tester gets a white screen — no message, no way back, and (until
// observability.ts) no report either. React only catches render errors via a
// class component, so this is the one class in the app.
import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportError } from "../lib/observability";
import { Mark } from "../brand/Mark";

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
    // Short, calm, two ways forward (UX laws: Peak-End). "Your saved answers
    // are safe" is exactly true: the question screen says when each one saved.
    return (
      <section className="screen-enter crashscreen">
        <Mark height={56} title="TwoAgree" colour="var(--berry)" />
        <h1 className="h1 center" style={{ marginTop: 24 }}>
          We couldn’t open this screen
        </h1>
        <p className="sub center" style={{ margin: "10px 16px 0" }}>
          Your saved answers are safe. Try again to carry on from where you were.
        </p>
        <button className="btn pill" type="button" onClick={() => this.setState({ failed: false })}>
          Try again
        </button>
        <button className="btn out" type="button" onClick={() => window.location.reload()}>
          Reload the app
        </button>
        <a className="btn ghost" href="mailto:hello@twoagree.app?subject=TwoAgree%3A%20a%20screen%20wouldn%E2%80%99t%20open">
          Still stuck? Contact us
        </a>
      </section>
    );
  }
}
