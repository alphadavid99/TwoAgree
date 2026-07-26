// Native deep-link bridge. On web this is a no-op — the querystring already
// carries the invite token. On native iOS, a universal link (the partner-invite
// link from the Cloud Function, or an auth callback) opens the installed app
// instead of Safari; Capacitor delivers that URL here, and we pull the invite
// token out of it and hand it to the shared store so App.tsx can redeem it.
//
// The web fallback stays intact: users WITHOUT the app installed just open the
// same https link in the browser, which is the existing flow. Associated
// Domains (Dave configures these in Xcode/portal — see docs/IOS.md) are what
// route the link into the app in the first place.
import { setInvite, setInviteToken } from "../invite";
import { isNativePlatform } from "./platform";

function tokenFromUrl(url: string): string | null {
  try {
    return new URL(url).searchParams.get("t");
  } catch {
    return null;
  }
}

// The bare-code fallback link (/?c=CODE) is a universal link too, so the native
// shell has to recognise it or a tapped fallback invite opens the app at the
// front door with no join context.
function codeFromUrl(url: string): string | null {
  try {
    return new URL(url).searchParams.get("c")?.trim().toUpperCase() || null;
  } catch {
    return null;
  }
}

export function initNativeDeepLinks(): void {
  if (!isNativePlatform()) return;
  void import("@capacitor/app").then(({ App }) => {
    // Cold start: the app was launched BY the link.
    const route = (url: string | undefined) => {
      if (!url) return;
      const t = tokenFromUrl(url);
      if (t) return setInviteToken(t);
      const c = codeFromUrl(url);
      if (c) setInvite({ kind: "code", value: c });
    };
    void App.getLaunchUrl().then((res) => route(res?.url));
    // Warm: a link tapped while the app is already running/backgrounded.
    void App.addListener("appUrlOpen", (event) => route(event.url));
  });
}
