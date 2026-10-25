import { useState } from "react";
import { createSession } from "../lib/session";
import { joinByCode, redeemInvite } from "../lib/functions";
import { parseCodeInput } from "../lib/invite";
import { setActiveCode } from "../lib/local";
import { prettyError } from "../lib/errors";
import { useT } from "../lib/i18n";
import type { Stage } from "../types";

// Relationship stage, captured on the couple at pairing (brief §8). The order
// mirrors a rough journey; "blended" sits apart as a family shape, not a step.
const STAGES: { key: Stage; en: string; fr: string }[] = [
  { key: "dating", en: "Dating", fr: "En couple" },
  { key: "engaged", en: "Engaged", fr: "Fiancés" },
  { key: "married", en: "Married", fr: "Mariés" },
  { key: "blended", en: "Blended family", fr: "Famille recomposée" },
];

// Create a new session or join a partner's by code. The signed-in user's
// profile name rides into the member slot (the account graft).
export default function StartScreen({
  uid,
  name,
  onEnter,
}: {
  uid: string;
  name: string;
  onEnter: (code: string) => void;
}) {
  const t = useT();
  const [mode, setMode] = useState<"choose" | "join">("choose");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<Stage | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const enter = (c: string) => {
    setActiveCode(uid, c);
    onEnter(c);
  };

  const create = async () => {
    setErr("");
    setBusy(true);
    try {
      const c = await createSession(uid, name, stage ?? undefined);
      enter(c);
    } catch (e) {
      setErr(prettyError(e));
      setBusy(false);
    }
  };

  const parsed = parseCodeInput(code);
  const join = async () => {
    setErr("");
    // A pasted single-use invite link is redeemed as the invite it is.
    if (parsed.kind === "token") {
      setBusy(true);
      try {
        const res = await redeemInvite({ token: parsed.token });
        enter(res.data.code);
      } catch (e) {
        setErr(prettyError(e));
        setBusy(false);
      }
      return;
    }
    const c = parsed.kind === "code" ? parsed.code : "";
    if (c.length < 4) {
      setErr(
        t(
          "Enter the 4-character code your partner shared.",
          "Saisissez le code à 4 caractères partagé par votre partenaire.",
        ),
      );
      return;
    }
    setBusy(true);
    try {
      const res = await joinByCode({ code: c });
      enter(res.data.code);
    } catch (e) {
      setErr(prettyError(e));
      setBusy(false);
    }
  };

  return (
    <section className="screen-enter">
      <div className="eyebrow center" style={{ marginTop: 30 }}>
        {t("The two of you", "Vous deux")}
      </div>
      <h1 className="h1 center" style={{ marginTop: 8 }}>
        {t("Start a session", "Démarrer une session")}
      </h1>
      {/* One white card, per brand RULE 2 — the steps, the stage chips and the
          code field were blush wells on a blush ground with nothing to sit on. */}
      <div className="card authcard">
      {mode === "choose" ? (
        <ol className="steps">
          <li className="step">
            <span className="stepn">1</span>
            <span className="stept">
              {/* No {" "} before the comma: the explicit space rendered as
                  "You create a code , it takes one tap". */}
              <b>{t("You create a code", "Vous créez un code")}</b>
              {t(", it takes one tap", ", un seul appui suffit")}
            </span>
          </li>
          <li className="step">
            <span className="stepn">2</span>
            <span className="stept">
              <b>{t("Share it", "Partagez-le")}</b>{" "}
              {t("with your partner", "avec votre partenaire")}
            </span>
          </li>
          <li className="step">
            <span className="stepn">3</span>
            <span className="stept">
              <b>{t("You each answer", "Vous répondez chacun")}</b>{" "}
              {t("the same questions, then talk it through", "aux mêmes questions, puis vous en parlez")}
            </span>
          </li>
        </ol>
      ) : (
        <p
          className="sub serif center"
          style={{ fontStyle: "italic", margin: "10px 20px 26px" }}
        >
          {t(
            "Enter the 4-character code your partner shared with you.",
            "Saisissez le code à 4 caractères que votre partenaire vous a partagé.",
          )}
        </p>
      )}

      {mode === "choose" ? (
        <>
          <div className="stagepick">
            <div className="stagepick-q">
              {t("Where are the two of you?", "Où en êtes-vous tous les deux ?")}
            </div>
            <div className="stagegrid">
              {STAGES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`stagechip ${stage === s.key ? "on" : ""}`}
                  onClick={() => setStage(stage === s.key ? null : s.key)}
                  aria-pressed={stage === s.key}
                >
                  {t(s.en, s.fr)}
                </button>
              ))}
            </div>
          </div>
          <button className={busy ? "btn pill busy" : "btn pill"} type="button" onClick={create} disabled={busy}>
            {busy
              ? t("One moment…", "Un instant…")
              : t("Create a session →", "Créer une session →")}
          </button>
          <button
            className="btn out"
            type="button"
            onClick={() => {
              setErr("");
              setMode("join");
            }}
          >
            {t("I have a code", "J’ai un code")}
          </button>
          {err && <div className="err">{err}</div>}
        </>
      ) : (
        <>
          <label htmlFor="code">{t("Partner’s code", "Code du partenaire")}</label>
          {/* No maxLength: "ab-cd" or a whole pasted link must fit, then be
              tidied (lib/invite.ts parseCodeInput). */}
          <input
            className="input"
            id="code"
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="ABCD"
            style={{ letterSpacing: 4 }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-describedby="code-read"
          />
          <p id="code-read" className="codeinfo" aria-live="polite">
            {parsed.kind === "code" && parsed.how === "tidied" && parsed.code.length > 0 && (
              <>
                <span className="codeinfo-tick" aria-hidden="true">✓</span>
                {t(
                  `You typed ${code.trim()}, we’ve read it as ${parsed.code}.`,
                  `Vous avez saisi ${code.trim()}, nous l’avons lu comme ${parsed.code}.`,
                )}
              </>
            )}
            {parsed.kind === "code" && parsed.how === "from-link" && (
              <>
                <span className="codeinfo-tick" aria-hidden="true">✓</span>
                {t(`Found the code in your invite link: ${parsed.code}`, `Code trouvé dans votre lien : ${parsed.code}`)}
              </>
            )}
            {parsed.kind === "token" && (
              <>
                <span className="codeinfo-tick" aria-hidden="true">✓</span>
                {t("That’s an invite link: Join will use it.", "C’est un lien d’invitation : Rejoindre l’utilisera.")}
              </>
            )}
          </p>
          {err && <div className="err">{err}</div>}
          <button className={busy ? "btn pill busy" : "btn pill"} type="button" onClick={join} disabled={busy}>
            {busy ? t("Joining…", "Connexion…") : t("Join →", "Rejoindre →")}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setErr("");
              setMode("choose");
            }}
          >
            {t("← Back", "← Retour")}
          </button>
        </>
      )}
      </div>
    </section>
  );
}
