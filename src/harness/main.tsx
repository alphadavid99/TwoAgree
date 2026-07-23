// Harness entry — same styles/fonts as the real app, but mounts the screen
// switcher instead of <App/>, and skips initNative (Capacitor bridge).
import { createRoot } from "react-dom/client";
import "../brand/tokens.css";
import "@fontsource/hanken-grotesk/400.css";
import "@fontsource/hanken-grotesk/500.css";
import "@fontsource/hanken-grotesk/600.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "../index.css";
import Harness from "./Harness";

createRoot(document.getElementById("root")!).render(<Harness />);
