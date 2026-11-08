import { useState } from "react";
import { Avatar, toneFor } from "./Avatar";
import { Sheet } from "./Sheet";
import { IconBell, IconChevron } from "./icons";
import { other, type Role } from "../lib/scoring";
import type { ForYouItem } from "../lib/foryou";
import type { Invite } from "../lib/invites";
import { useT } from "../lib/i18n";

// For you (feedback 28): invites waiting for you, what your partner has
// started or finished, and the invites you've sent. Calm by design: a list of
// what's there, a dot for anything new, never a count or a nudge.

export type ForYouProps = {
  items: ForYouItem[];
  role: Role;
  partnerName: string;
  /** "Money · Who does what" */
  label: (slug: string, level: number) => string;
  onOpen: (slug: string, level: number, invite?: Invite) => void;
  onTakeBack: (invite: Invite) => void;
};

export function ForYouList({ items, role, partnerName, label, onOpen, onTakeBack }: ForYouProps) {
  const t = useT();
  const them = partnerName.trim().split(/\s+/)[0] || partnerName;
  const partner = <Avatar name={partnerName} tone={toneFor(other(role))} size={36} ring={false} />;
  return (
    <ul className="fy-list">
      {items.map((it) => {
        const part = label(it.slug, it.level);
        if (it.kind === "sent") {
          return (
            <li key={it.id} className="fy-row">
              <span className="fy-av fy-av-out" aria-hidden="true">{partner}</span>
              <span className="fy-txt">
                <b>{t(`You invited ${them}`, `Vous avez invité ${them}`)}</b>
                <span>
                  {part} ·{" "}
                  {it.invite.status === "later"
                    ? t(`${them} will do it later`, `${them} le fera plus tard`)
                    : t("not started yet", "pas encore commencé")}
                </span>
              </span>
              <button
                className="fy-act fy-act-ghost"
                type="button"
                onClick={() => onTakeBack(it.invite)}
                aria-label={t(`Cancel your invite to ${them}`, `Annuler votre invitation à ${them}`)}
              >
                {t("Cancel", "Annuler")}
              </button>
            </li>
          );
        }
        const [head, sub, act] =
          it.kind === "invite"
            ? [
                t(`${them} invited you`, `${them} vous a invité`),
                `${part} · ${t("together, at your own pace", "ensemble, à votre rythme")}`,
                t("Start", "Commencer"),
              ]
            : it.kind === "theyFinished"
              ? [
                  t(`${them} has finished`, `${them} a terminé`),
                  `${part} · ${t("opens when you’ve done it too", "s’ouvre quand vous l’aurez fait aussi")}`,
                  null,
                ]
              : [t(`${them} has started`, `${them} a commencé`), `${part} · ${t("part way through", "en cours")}`, null];
        return (
          <li key={it.id}>
            <button
              className={`fy-row fy-tap${it.kind === "invite" ? " fy-invite" : ""}`}
              type="button"
              onClick={() => onOpen(it.slug, it.level, it.kind === "invite" ? it.invite : undefined)}
            >
              <span className="fy-av" aria-hidden="true">{partner}</span>
              <span className="fy-txt">
                <b>{head}</b>
                <span>{sub}</span>
              </span>
              {act ? (
                <span className="fy-act">{act}</span>
              ) : (
                <span className="fy-chev" aria-hidden="true">
                  <IconChevron size={18} />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** The bell: a quiet dot when something's new, the list in a sheet. */
export function ForYouBell(props: ForYouProps & { fresh: boolean; onSeen: () => void }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const { fresh, onSeen, ...list } = props;
  return (
    <>
      <button
        className="fy-bell"
        type="button"
        aria-label={fresh ? t("For you: something new", "Pour vous : du nouveau") : t("For you", "Pour vous")}
        onClick={() => {
          setOpen(true);
          onSeen();
        }}
      >
        <IconBell size={22} />
        {fresh && <span className="fy-dot" aria-hidden="true" />}
      </button>
      {open && (
        <Sheet title={t("For you", "Pour vous")} onClose={() => setOpen(false)}>
          {list.items.length ? (
            <ForYouList
              {...list}
              onOpen={(s, l, i) => {
                setOpen(false);
                list.onOpen(s, l, i);
              }}
            />
          ) : (
            <p className="sub fy-empty">
              {t(
                "Nothing waiting. Invites and what your partner starts will show here.",
                "Rien en attente. Les invitations et ce que votre partenaire commence s’afficheront ici.",
              )}
            </p>
          )}
        </Sheet>
      )}
    </>
  );
}
