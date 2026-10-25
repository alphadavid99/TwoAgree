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
import { parseInvite, setInvite } from "../invite";
import { isNativePlatform } from "./platform";

// Both invite shapes (/?t=TOKEN and the bare-code fallback /?c=CODE) are
// universal links, plus the inviter's first name (n), parsed exactly as the web
// querystring is.
function inviteFromUrl(url: string) {
  try {
    return parseInvite(new URL(url).search);
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
      const invite = inviteFromUrl(url);
      if (invite) setInvite(invite);
    };
    void App.getLaunchUrl().then((res) => route(res?.url));
    // Warm: a link tapped while the app is already running/backgrounded.
    void App.addListener("appUrlOpen", (event) => route(event.url));
  });
}
