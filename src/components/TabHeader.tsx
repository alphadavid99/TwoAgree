import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar, toneFor } from "./Avatar";
import { other, type Role } from "../lib/scoring";

// The one header every tab shares (Dave, Nov 2026): the two of you on the
// left, then on the right the screen's own button (search, share), if it has
// one, and the bell, always last. Same height and place on every tab, so the
// bell is always where you left it. It sits under the phone's notch or
// Dynamic Island: the page's top padding includes the safe-area inset.
export function TabHeader({
  role,
  myName,
  partnerName,
  joined,
  myPhoto,
  partnerPhoto,
  slotRef,
  bell,
}: {
  role: Role;
  myName: string;
  partnerName: string;
  joined: boolean;
  myPhoto?: string;
  partnerPhoto?: string;
  /** Where a screen puts its own button, left of the bell. */
  slotRef: (el: HTMLSpanElement | null) => void;
  bell: ReactNode;
}) {
  // The partner's avatar slides in the moment they join, while you watch.
  const prev = useRef(joined);
  const [joinNow, setJoinNow] = useState(false);
  useEffect(() => {
    if (joined && !prev.current) setJoinNow(true);
    prev.current = joined;
  }, [joined]);
  return (
    <header className="tabhdr">
      <span className={`avchip${joinNow ? " joinnow" : ""}`}>
        <span className="avchip-stack">
          <Avatar name={myName} photo={myPhoto} tone={toneFor(role)} size={34} />
          {joined ? (
            <span className="joinpop">
              <Avatar name={partnerName} photo={partnerPhoto} tone={toneFor(other(role))} size={34} />
            </span>
          ) : (
            <span className="avatar-disc avatar-wait" style={{ width: 34, height: 34 }}>
              ?
            </span>
          )}
        </span>
        <i>
          {myName} &amp; {joined ? partnerName : "…"}
        </i>
      </span>
      <span className="tabhdr-acts">
        <span ref={slotRef} className="tabhdr-slot" />
        {bell}
      </span>
    </header>
  );
}
