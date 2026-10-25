import { nLevels, lvlQs, partName, deckDepthWord } from "../lib/leveling";
import { levelDone, levelComplete, curLevel, doneInLevel, revealedQs } from "../lib/progress";
import { startedLevel } from "../lib/privacy";
import { other, overall, knowScore, type DeckData, type Role } from "../lib/scoring";
import { deckName } from "../lib/questions.fr";
import { TopBar } from "../components/TopBar";
import { Avatar, toneFor } from "../components/Avatar";
import { Discoveries } from "./Discoveries";
import type { Session } from "../types";
import { useT, useLang } from "../lib/i18n";

// Choose a part (design refresh, item 11; brief 2 §A7d). Couples may open any
// part, never gated in order. A part opens once you've BOTH finished it, so
// each row shows both of you as small avatars: ticked when finished, dashed
// when not started. Named parts, small numbers, no icon at the top. Once a
// part is open, this conversation's Known score and what surprised you sit
// underneath (moved here from Together, item 3).
export default function PartPicker({
  slug,
  deck,
  role,
  myName,
  partnerName,
  members,
  onSelect,
  onExit,
}: {
  slug: string;
  deck: DeckData | undefined;
  role: Role;
  myName: string;
  partnerName: string;
  members?: Session["members"];
  onSelect: (lvl: number) => void;
  onExit: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const n = nLevels(slug);
  const here = curLevel(slug, deck, role);
  const them = partnerName.trim().split(/\s+/)[0] || partnerName;
  const opened = revealedQs(slug, deck, role);
  const known = opened.length ? knowScore(opened, deck ?? {}, role) : null;

  const who = (name: string, r: Role, i: number) => {
    const done = levelDone(deck, i, r);
    const started = r === role ? doneInLevel(slug, i, deck, role) > 0 : startedLevel(deck, i, r);
    return <Avatar name={name} tone={toneFor(r)} size={32} ring={false} done={done} pending={!done && !started} />;
  };

  return (
    <section>
      <TopBar onExit={onExit} />
      <h1 className="h1 center" style={{ margin: "10px 0 4px" }}>
        {deckName(slug, lang)}
      </h1>
      <p className="helper center" style={{ margin: "0 24px 18px" }}>
        {t(...deckDepthWord(slug))} · {t(`${n} part${n === 1 ? "" : "s"}`, `${n} partie${n === 1 ? "" : "s"}`)}
      </p>

      <div className="pp-list">
        {Array.from({ length: n }, (_, i) => {
          const youDone = levelDone(deck, i, role);
          const themDone = levelDone(deck, i, other(role));
          const both = levelComplete(deck, i, role);
          const total = lvlQs(slug, i).length;
          const mine = doneInLevel(slug, i, deck, role);
          const theyStarted = startedLevel(deck, i, other(role));
          const theirs = themDone
            ? t(`${them} has finished`, `${them} a terminé`)
            : theyStarted
              ? t(`${them} has started`, `${them} a commencé`)
              : t(`${them} hasn’t started yet`, `${them} n’a pas encore commencé`);
          const state = both
            ? t(`Opened together · ${overall(lvlQs(slug, i), deck ?? {}, role)}% agree`, `Ouverte ensemble · ${overall(lvlQs(slug, i), deck ?? {}, role)} % d’accord`)
            : youDone
              ? t(`You’ve finished · ${theirs}`, `Vous avez terminé · ${theirs}`)
              : mine > 0 || themDone || theyStarted
                ? t(`You: ${mine} of ${total} · ${theirs}`, `Vous : ${mine} sur ${total} · ${theirs}`)
                : t(`${total} questions`, `${total} questions`);
          return (
            <button
              key={i}
              type="button"
              className={`pp-row${i === here && !both ? " here" : ""}`}
              onClick={() => onSelect(i)}
            >
              <span className={`pp-n${both ? " done" : i === here ? " here" : ""}`}>{i + 1}</span>
              <span className="pp-main">
                <span className="pp-nm">{partName(slug, i)}</span>
                <span className="pp-sub">{state}</span>
              </span>
              <span className="pp-avs">
                {who(myName, role, i)}
                {who(partnerName, other(role), i)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="helper center" style={{ margin: "14px 24px 0" }}>
        {t("Start anywhere. A part opens once you’ve both finished it.", "Commencez où vous voulez. Une partie s’ouvre quand vous l’avez tous deux terminée.")}
      </p>

      {known && known.pct != null && (
        <p className="pp-known">
          <b>{known.pct}%</b> {t("Known", "Connus")} ·{" "}
          {t(`${known.right} of ${known.made} guesses right`, `${known.right} intuitions justes sur ${known.made}`)}
        </p>
      )}
      {members && opened.length > 0 && (
        <Discoveries session={{ members, decks: { [slug]: deck ?? {} } } as Session} role={role} partnerName={partnerName} t={t} />
      )}
    </section>
  );
}
