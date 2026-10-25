import { useEffect, useRef, useState, type ReactNode } from "react";
import { signOut, type User } from "firebase/auth";
import { auth } from "../firebase";
import { useProfile } from "../hooks/useProfile";
import { fileToAvatarDataUrl } from "../lib/device/photo";
import { prettyError } from "../lib/errors";
import { exportMyData, deleteMyAccount } from "../lib/functions";
import { renderReadableExport, type ExportPayload } from "../lib/dataexport";
import { useT, useLang, setLang, LANGS } from "../lib/i18n";
import BuildStamp from "../components/BuildStamp";
import { Avatar } from "../components/Avatar";
import { Sheet } from "../components/Sheet";
import { Loading } from "../components/Loading";
import { ErrorPanel } from "../components/AuthBits";
import {
  IconBack,
  IconBell,
  IconChevron,
  IconDoc,
  IconDoorIn,
  IconDoorOut,
  IconDownload,
  IconEye,
  IconGlobe,
  IconLink,
} from "../components/icons";
import type { Profile } from "../types";

type T = (en: string, fr: string) => string;
type View = "main" | "edit" | "sees" | "data" | "delete";
// A name at the start of a sentence ("your partner" when there is none yet).
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// You (design refresh, item 15): a settings list in the thick-card style, you at
// the top with Edit; Preferences; You and your partner; Privacy and data; Sign
// out; and Delete my account on its own at the bottom. Edit profile, What they
// see, Download my data and Delete each get their own screen.
export default function ProfileScreen({
  user,
  onLeave,
  code,
  partnerName,
  myNameHere,
}: {
  user: User;
  onLeave?: () => void;
  /** Named in the settings, so they read as a person, not a feature. */
  partnerName?: string;
  // The session's code. Once a partner has joined, Home stops showing it, so
  // this is the only place it exists in the UI.
  code?: string;
  /** Your name as this session shows it to your partner. */
  myNameHere?: string;
}) {
  const t = useT();
  const lang = useLang();
  const { profile, loading, saveProfile } = useProfile(user.uid);
  const [view, setView] = useState<View>("main");
  const [closing, setClosing] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");

  // The notification opt-in. Mirrored locally so the switch responds at once
  // rather than waiting for the round trip through the profile listener.
  const [notify, setNotify] = useState(false);
  const [notifyBusy, setNotifyBusy] = useState(false);
  useEffect(() => {
    if (!loading) setNotify(profile?.notify === true);
  }, [loading, profile?.notify]);

  const them = (partnerName ?? "").trim().split(/\s+/)[0] || t("your partner", "votre partenaire");

  const toggleNotify = async () => {
    const next = !notify;
    setNotify(next);
    setNotifyBusy(true);
    setErr("");
    try {
      await saveProfile({ notify: next, email: user.email ?? "" });
    } catch (e) {
      setNotify(!next); // put the switch back if the write didn't land
      setErr(prettyError(e));
    } finally {
      setNotifyBusy(false);
    }
  };

  const copyCode = () => {
    if (!code) return;
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {},
    );
  };

  if (loading) return <Loading label={t("Loading your profile", "Chargement de votre profil")} />;

  const back = () => setView("main");
  if (view === "edit")
    return <EditProfile user={user} profile={profile} saveProfile={saveProfile} nameHere={myNameHere} them={them} onBack={back} t={t} />;
  if (view === "sees") return <WhatTheySee them={them} nameHere={myNameHere} onBack={back} t={t} />;
  if (view === "data") return <DownloadData them={them} onBack={back} t={t} />;
  if (view === "delete") return <DeleteAccount them={them} onBack={back} onExport={() => setView("data")} t={t} />;

  const name = profile?.name || user.displayName || t("You", "Vous");
  const langName = LANGS.find((l) => l.code === lang)?.native ?? lang;

  return (
    <section>
      <h1 className="h1" style={{ margin: "20px 2px 14px" }}>
        {t("You", "Vous")}
      </h1>

      <div className="card you-head">
        <Avatar name={name} photo={profile?.photo} size={64} />
        <span className="you-head-txt">
          <b>{name}</b>
          {user.email && <span>{user.email}</span>}
        </span>
        <button className="you-edit" type="button" onClick={() => setView("edit")}>
          {t("Edit", "Modifier")}
        </button>
      </div>

      <h2 className="you-group">{t("Preferences", "Préférences")}</h2>
      <div className="card you-list">
        {/* The app's only notification, and the only one planned. Off unless
            asked for: emailing someone about special-category activity because
            a switch defaulted to on is not consent. Needs an email address. */}
        {user.email && (
          <button type="button" role="switch" aria-checked={notify} className="you-row" onClick={toggleNotify} disabled={notifyBusy}>
            <RowIcon>
              <IconBell size={20} />
            </RowIcon>
            <span className="you-row-txt">
              <b>{t("Email me when a reveal is ready", "M’écrire quand une révélation est prête")}</b>
              <span>
                {t(
                  `Once you’ve both finished a part. Never a reminder to ${them}.`,
                  `Quand vous avez tous deux terminé une partie. Jamais un rappel à ${them}.`,
                )}
              </span>
            </span>
            <span className={`switch${notify ? " on" : ""}`} aria-hidden="true">
              <i />
            </span>
          </button>
        )}
        <button type="button" className="you-row" onClick={() => setLangOpen(true)}>
          <RowIcon>
            <IconGlobe size={20} />
          </RowIcon>
          <span className="you-row-txt">
            <b>{t("Language", "Langue")}</b>
          </span>
          <span className="you-row-val">{langName}</span>
          <Chevron />
        </button>
      </div>
      {err && <ErrorPanel>{err}</ErrorPanel>}

      {code && (
        <>
          <h2 className="you-group">{t(`You and ${them}`, `Vous et ${them}`)}</h2>
          <div className="card you-list">
            <button type="button" className="you-row" onClick={copyCode} aria-label={t(`Your session code ${code}: copy it`, `Votre code de session ${code} : le copier`)}>
              <RowIcon>
                <IconLink size={20} />
              </RowIcon>
              <span className="you-row-txt">
                <b>{t("Your session code", "Votre code de session")}</b>
                <span>
                  {copied
                    ? t("Copied ✓", "Copié ✓")
                    : t(`${code} · share it to invite or come back`, `${code} · pour inviter ou revenir`)}
                </span>
              </span>
              <Chevron />
            </button>
            {onLeave && (
              <button type="button" className="you-row" onClick={() => setClosing(true)}>
                <RowIcon>
                  <IconDoorIn size={20} />
                </RowIcon>
                <span className="you-row-txt">
                  <b>{t("Close this session on this device", "Fermer cette session sur cet appareil")}</b>
                  <span>{t("Your answers stay saved", "Vos réponses restent enregistrées")}</span>
                </span>
                <Chevron />
              </button>
            )}
          </div>
        </>
      )}

      <h2 className="you-group">{t("Privacy and data", "Confidentialité et données")}</h2>
      <div className="card you-list">
        <button type="button" className="you-row" onClick={() => setView("sees")}>
          <RowIcon>
            <IconEye size={20} />
          </RowIcon>
          <span className="you-row-txt">
            <b>{t(`What ${them} sees`, `Ce que voit ${them}`)}</b>
            <span>{t("Your name, and your answers once a part opens", "Votre nom, et vos réponses quand une partie s’ouvre")}</span>
          </span>
          <Chevron />
        </button>
        <button type="button" className="you-row" onClick={() => setView("data")}>
          <RowIcon>
            <IconDownload size={20} />
          </RowIcon>
          <span className="you-row-txt">
            <b>{t("Download my data", "Télécharger mes données")}</b>
            <span>{t("A copy of your profile and answers", "Une copie de votre profil et de vos réponses")}</span>
          </span>
          <Chevron />
        </button>
        <a className="you-row" href="/privacy.html" target="_blank" rel="noreferrer">
          <RowIcon>
            <IconDoc size={20} />
          </RowIcon>
          <span className="you-row-txt">
            <b>{t("Privacy policy", "Politique de confidentialité")}</b>
          </span>
          <Chevron />
        </a>
      </div>

      <div className="card you-list" style={{ marginTop: 24 }}>
        <button type="button" className="you-row" onClick={() => signOut(auth)}>
          <RowIcon>
            <IconDoorOut size={20} />
          </RowIcon>
          <span className="you-row-txt">
            <b>{t("Sign out", "Se déconnecter")}</b>
          </span>
        </button>
      </div>

      <button className="btn you-delete" type="button" onClick={() => setView("delete")}>
        {t("Delete my account", "Supprimer mon compte")}
      </button>

      <div className="foot">
        {t("Signed in as", "Connecté en tant que")} {user.email || t("your Google account", "votre compte Google")}
      </div>
      <BuildStamp />

      {closing && onLeave && (
        <Sheet title={t("Close this session on this device?", "Fermer cette session sur cet appareil ?")} onClose={() => setClosing(false)}>
          <p className="helper" style={{ marginTop: 0 }}>
            {t(
              `Your answers stay saved, and it stays open for ${them}. Come back any time with your code:`,
              `Vos réponses restent enregistrées, et elle reste ouverte pour ${them}. Revenez quand vous voulez avec votre code :`,
            )}
          </p>
          {code && (
            <div className="you-code">
              <span className="codebig">{code}</span>
              <button className="btn out" type="button" onClick={copyCode}>
                {copied ? t("Copied ✓", "Copié ✓") : t("Copy", "Copier")}
              </button>
            </div>
          )}
          <button className="btn" type="button" onClick={onLeave}>
            {t("Close session", "Fermer la session")}
          </button>
          <button className="btn ghost" type="button" onClick={() => setClosing(false)}>
            {t("Keep it open", "La garder ouverte")}
          </button>
        </Sheet>
      )}

      {langOpen && (
        <Sheet title={t("Language", "Langue")} onClose={() => setLangOpen(false)}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`opt${lang === l.code ? " sel" : ""}`}
              aria-pressed={lang === l.code}
              onClick={() => {
                setLang(l.code);
                setLangOpen(false);
              }}
            >
              {l.native}
              <span className="dot" />
            </button>
          ))}
        </Sheet>
      )}
    </section>
  );
}

const RowIcon = ({ children }: { children: ReactNode }) => (
  <span className="you-row-ic" aria-hidden="true">
    {children}
  </span>
);
const Chevron = () => (
  <span className="you-row-go" aria-hidden="true">
    <IconChevron size={18} />
  </span>
);

function SubHead({ title, onBack, t }: { title: string; onBack: () => void; t: T }) {
  return (
    <>
      <button className="you-back" type="button" onClick={onBack}>
        <IconBack size={20} />
        {t("You", "Vous")}
      </button>
      <h1 className="h1" style={{ margin: "8px 2px 14px" }}>
        {title}
      </h1>
    </>
  );
}

// ---- Edit profile: its own screen, saying who sees what -------------------
function EditProfile({
  user,
  profile,
  saveProfile,
  nameHere,
  them,
  onBack,
  t,
}: {
  user: User;
  profile: Profile | null;
  saveProfile: (p: Partial<Profile>) => Promise<void>;
  nameHere?: string;
  them: string;
  onBack: () => void;
  t: T;
}) {
  const [name, setName] = useState(profile?.name ?? user.displayName ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setSaved(false);
    try {
      setPhoto(await fileToAvatarDataUrl(file));
    } catch (e2) {
      setErr(prettyError(e2));
    }
  };

  const save = async () => {
    setErr("");
    setSaved(false);
    if (!name.trim()) {
      setErr(t("Add your name: it’s how you appear in a session.", "Ajoutez votre nom : c’est ainsi que vous apparaissez dans une session."));
      return;
    }
    setBusy(true);
    const data: Partial<Profile> = { name: name.trim(), bio: bio.trim(), email: user.email ?? "" };
    if (!profile?.created) data.created = Date.now();
    if (photo) data.photo = photo; // only overwrite if newly chosen
    try {
      await saveProfile(data);
      setPhoto(null);
      setSaved(true);
    } catch (e2) {
      setErr(prettyError(e2));
    } finally {
      setBusy(false);
    }
  };

  const shown = photo ?? profile?.photo ?? null;
  return (
    <section>
      <SubHead title={t("Edit profile", "Modifier le profil")} onBack={onBack} t={t} />
      <div className="you-photo">
        <Avatar name={name || "?"} photo={shown} size={104} />
        <button className="btn out you-photo-btn" type="button" onClick={() => fileInput.current?.click()}>
          {t("Change photo", "Changer la photo")}
        </button>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={onPhoto} />
      </div>

      <label className="you-label" htmlFor="name">
        {t("Name", "Nom")}
      </label>
      <input
        className="input"
        id="name"
        maxLength={20}
        placeholder={t("e.g. Sarah", "p. ex. Sarah")}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setSaved(false);
        }}
      />
      {/* The session keeps the name you had when it started, so say so: a
          change here doesn't reach a session that's already running. */}
      <p className="helper you-hint">
        {nameHere
          ? t(
              `Used when you start or join a session. ${cap(them)} sees you as “${nameHere}” in this one.`,
              `Utilisé quand vous commencez ou rejoignez une session. ${cap(them)} vous voit comme « ${nameHere} » dans celle-ci.`,
            )
          : t("Used when you start or join a session.", "Utilisé quand vous commencez ou rejoignez une session.")}
      </p>

      <label className="you-label" htmlFor="bio">
        {t("A line about you", "Une ligne sur vous")} <span>· {t("optional, just for you", "facultatif, pour vous seul")}</span>
      </label>
      <textarea
        className="input"
        id="bio"
        maxLength={140}
        placeholder={t("Something honest and short.", "Quelque chose d’honnête et de court.")}
        value={bio}
        onChange={(e) => {
          setBio(e.target.value);
          setSaved(false);
        }}
      />
      <p className="helper you-hint">
        {t(`Your photo and this line stay on your account. ${cap(them)} doesn’t see them.`, `Votre photo et cette ligne restent sur votre compte. ${cap(them)} ne les voit pas.`)}
      </p>

      {err && <ErrorPanel>{err}</ErrorPanel>}
      {saved && (
        <p className="you-saved" role="status">
          ✓ {t("Saved", "Enregistré")}
        </p>
      )}
      <button className={`btn pill${busy ? " busy" : ""}`} type="button" onClick={save} disabled={busy}>
        {busy ? t("Saving…", "Enregistrement…") : t("Save changes", "Enregistrer")}
      </button>
    </section>
  );
}

// ---- What your partner sees: a plain list ---------------------------------
function WhatTheySee({ them, nameHere, onBack, t }: { them: string; nameHere?: string; onBack: () => void; t: T }) {
  return (
    <section>
      <SubHead title={t(`What ${them} sees`, `Ce que voit ${them}`)} onBack={onBack} t={t} />
      <div className="card">
        <h2 className="ktitle">{t(`${cap(them)} sees`, `${cap(them)} voit`)}</h2>
        <ul className="you-bullets">
          <li>
            {nameHere
              ? t(`Your name in this session: “${nameHere}”.`, `Votre nom dans cette session : « ${nameHere} ».`)
              : t("Your name in your session.", "Votre nom dans votre session.")}
          </li>
          <li>{t("That you’ve started or finished a part, never what you answered before then.", "Que vous avez commencé ou terminé une partie, jamais ce que vous avez répondu avant.")}</li>
          <li>
            {t(
              "Your answers, guesses and how much each one matters to you, for each part once you’ve both finished it.",
              "Vos réponses, intuitions et l’importance de chacune pour vous, pour chaque partie une fois que vous l’avez tous deux terminée.",
            )}
          </li>
          <li>{t("What you add to talk about, and any note you share there.", "Ce que vous ajoutez à aborder, et toute note partagée.")}</li>
        </ul>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h2 className="ktitle">{t(`${cap(them)} never sees`, `${cap(them)} ne voit jamais`)}</h2>
        <ul className="you-bullets">
          <li>{t("Your email, your photo or your line about you.", "Votre e-mail, votre photo ou votre ligne sur vous.")}</li>
          <li>{t("Your path questions, only the path they helped choose.", "Vos questions du chemin, seulement le chemin qu’elles ont aidé à choisir.")}</li>
          <li>{t("An answer in a part they haven’t finished too.", "Une réponse dans une partie qu’il ou elle n’a pas aussi terminée.")}</li>
        </ul>
      </div>
    </section>
  );
}

// ---- Download my data: what's in it, two formats, a real error -------------
function DownloadData({ them, onBack, t }: { them: string; onBack: () => void; t: T }) {
  const lang = useLang();
  const [readable, setReadable] = useState(true);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");
  const [done, setDone] = useState("");

  // Two doors on the same data. The right of access isn't honoured by a file
  // nobody can read, so the readable copy is the default; the raw JSON stays
  // for moving your data to another service.
  const download = (body: string, type: string, name: string) => {
    const url = URL.createObjectURL(new Blob([body], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const go = async () => {
    setBusy(true);
    setFailed("");
    setDone("");
    try {
      const res = await exportMyData();
      if (readable) {
        download(renderReadableExport(res.data as ExportPayload, lang), "text/html;charset=utf-8", "twoagree-my-data.html");
        setDone(t("Downloaded. Open it in any browser, it prints to PDF too.", "Téléchargé. Ouvrez-le dans un navigateur, il s’imprime aussi en PDF."));
      } else {
        download(JSON.stringify(res.data, null, 2), "application/json", "twoagree-my-data.json");
        setDone(t("Your data file has been downloaded.", "Votre fichier de données a été téléchargé."));
      }
    } catch (e) {
      setFailed(prettyError(e));
    } finally {
      setBusy(false);
    }
  };

  const choice = (on: boolean, en: string, fr: string, subEn: string, subFr: string) => (
    <button
      type="button"
      className={`opt you-format${readable === on ? " sel" : ""}`}
      aria-pressed={readable === on}
      onClick={() => setReadable(on)}
    >
      <span>
        <b>{t(en, fr)}</b>
        <span>{t(subEn, subFr)}</span>
      </span>
      <span className="dot" />
    </button>
  );

  return (
    <section>
      <SubHead title={t("Download my data", "Télécharger mes données")} onBack={onBack} t={t} />
      <p className="pstep-frame">
        {t(
          `Your profile, every answer, guess and note you’ve given, your path questions and your consent record. ${cap(them)}’s answers aren’t included.`,
          `Votre profil, chaque réponse, intuition et note que vous avez données, vos questions du chemin et votre consentement. Les réponses de ${them} ne sont pas incluses.`,
        )}
      </p>
      {choice(true, "A readable copy", "Une copie lisible", "A page you can read or print", "Une page à lire ou imprimer")}
      {choice(false, "A data file (JSON)", "Un fichier de données (JSON)", "For moving your data to another service", "Pour transférer vos données ailleurs")}
      {failed && (
        <ErrorPanel>
          <b>{t("We couldn’t create your download.", "Nous n’avons pas pu créer votre téléchargement.")}</b> {failed}
        </ErrorPanel>
      )}
      {done && (
        <p className="you-saved" role="status">
          ✓ {done}
        </p>
      )}
      <button className={`btn pill${busy ? " busy" : ""}`} type="button" onClick={go} disabled={busy}>
        {busy ? t("Preparing your download…", "Préparation…") : failed ? t("Try again", "Réessayer") : t("Download", "Télécharger")}
      </button>
    </section>
  );
}

// ---- Delete your account and answers: its own screen, honest about what's kept
function DeleteAccount({ them, onBack, onExport, t }: { them: string; onBack: () => void; onExport: () => void; t: T }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  const go = async () => {
    setBusy(true);
    setFailed("");
    try {
      await deleteMyAccount();
      await signOut(auth); // App swaps to the sign-in screen
    } catch (e) {
      setFailed(prettyError(e));
      setBusy(false);
    }
  };

  return (
    <section>
      {!busy && (
        <button className="you-back" type="button" onClick={onBack}>
          <IconBack size={20} />
          {t("You", "Vous")}
        </button>
      )}
      <h1 className="h1" style={{ margin: "8px 2px 14px" }}>
        {t("Delete your account and answers?", "Supprimer votre compte et vos réponses ?")}
      </h1>
      {/* Exactly what deleteMyAccount does (functions/src/index.ts), including
          the part that affects the other person. */}
      <ul className="you-bullets">
        <li>{t("Your profile, photo and path questions are deleted.", "Votre profil, votre photo et vos questions du chemin sont supprimés.")}</li>
        <li>
          {t(
            "Every answer, guess, rating and talk-list note you gave is removed from every session you’re in.",
            "Chaque réponse, intuition, évaluation et note que vous avez données est retirée de toutes vos sessions.",
          )}
        </li>
        <li>
          {t(
            `${cap(them)} keeps their own answers, but your side of every reveal disappears from their app too, and the scores between you go with it.`,
            `${cap(them)} garde ses propres réponses, mais votre côté de chaque révélation disparaît aussi de son application, et les scores entre vous avec.`,
          )}
        </li>
        <li>{t("A session with no one else in it is removed entirely.", "Une session où il n’y a personne d’autre est entièrement supprimée.")}</li>
      </ul>
      <div className="you-keep">
        <b>{t("What we keep:", "Ce que nous gardons :")}</b>{" "}
        {t(
          "your consent record. It shows we were allowed to hold your data, and it has no answers in it.",
          "votre enregistrement de consentement. Il montre que nous pouvions détenir vos données, et il ne contient aucune réponse.",
        )}
      </div>
      <p className="you-final">{t("This can’t be undone. You can download your data first.", "C’est irréversible. Vous pouvez d’abord télécharger vos données.")}</p>
      {failed && (
        <ErrorPanel>
          <b>{t("Your account wasn’t deleted.", "Votre compte n’a pas été supprimé.")}</b> {failed}{" "}
          {t("It’s safe to try again.", "Vous pouvez réessayer sans risque.")}
        </ErrorPanel>
      )}
      <button className={`btn red${busy ? " busy" : ""}`} type="button" onClick={go} disabled={busy}>
        {busy ? t("Deleting your account…", "Suppression de votre compte…") : failed ? t("Try again", "Réessayer") : t("Delete my account", "Supprimer mon compte")}
      </button>
      {/* Once deletion starts it can't be stopped, so there's nothing to cancel. */}
      {!busy && (
        <>
          <button className="btn ghost" type="button" onClick={onExport}>
            {t("Download my data first", "Télécharger mes données d’abord")}
          </button>
          <button className="btn ghost" type="button" onClick={onBack}>
            {t("Cancel", "Annuler")}
          </button>
        </>
      )}
    </section>
  );
}
