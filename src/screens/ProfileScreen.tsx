import { useEffect, useRef, useState } from "react";
import { signOut, type User } from "firebase/auth";
import { auth } from "../firebase";
import { useProfile } from "../hooks/useProfile";
import { fileToAvatarDataUrl } from "../lib/device/photo";
import { prettyError } from "../lib/errors";
import { exportMyData, deleteMyAccount } from "../lib/functions";
import { renderReadableExport, type ExportPayload } from "../lib/dataexport";
import { useT, useLang, setLang, LANGS } from "../lib/i18n";
import BuildStamp from "../components/BuildStamp";
import type { Profile } from "../types";

export default function ProfileScreen({
  user,
  onLeave,
  code,
}: {
  user: User;
  onLeave?: () => void;
  // The session's code, shown before leaving and kept visible here — once a
  // partner has joined, Home stops showing it, so this is the only place it
  // exists in the UI.
  code?: string;
}) {
  const t = useT();
  const lang = useLang();
  const { profile, loading, saveProfile } = useProfile(user.uid);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Hydrate the form once from the stored profile (or the Google displayName),
  // then leave it alone so live snapshots don't clobber in-progress edits.
  useEffect(() => {
    if (!loading && !hydrated) {
      setName(profile?.name ?? user.displayName ?? "");
      setBio(profile?.bio ?? "");
      setHydrated(true);
    }
  }, [loading, hydrated, profile, user.displayName]);

  const [dataBusy, setDataBusy] = useState(false);
  const [dataMsg, setDataMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const clear = () => {
    setErr("");
    setOk("");
  };

  // Two doors on the same data. The right of access isn't honoured by a file
  // nobody can read: `{"FAITH-019":{"host":3}}` tells a person nothing about
  // what they were asked or what they said. The readable copy is the default;
  // the raw JSON stays for portability into another service.
  const download = (body: string, type: string, name: string) => {
    const url = URL.createObjectURL(new Blob([body], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const doExport = async (readable: boolean) => {
    setDataBusy(true);
    setDataMsg("");
    try {
      const res = await exportMyData();
      if (readable) {
        download(
          renderReadableExport(res.data as ExportPayload, lang),
          "text/html;charset=utf-8",
          "twoagree-my-data.html",
        );
        setDataMsg(
          t(
            "Downloaded. Open it in any browser — it prints to PDF too.",
            "Téléchargé. Ouvrez-le dans un navigateur — il s’imprime aussi en PDF.",
          ),
        );
      } else {
        download(
          JSON.stringify(res.data, null, 2),
          "application/json",
          "twoagree-my-data.json",
        );
        setDataMsg(t("Your data has been downloaded.", "Vos données ont été téléchargées."));
      }
    } catch (e) {
      setDataMsg(prettyError(e));
    } finally {
      setDataBusy(false);
    }
  };

  const doDelete = async () => {
    setDataBusy(true);
    setDataMsg("");
    try {
      await deleteMyAccount();
      await signOut(auth); // App swaps to the sign-in screen
    } catch (e) {
      setDataMsg(prettyError(e));
      setDataBusy(false);
    }
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    clear();
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setPendingPhoto(dataUrl);
      setOk(
        t(
          "Photo ready — tap Save profile to keep it.",
          "Photo prête — appuyez sur Enregistrer pour la garder.",
        ),
      );
    } catch (e2) {
      setErr(prettyError(e2));
    }
  };

  const save = async () => {
    clear();
    if (!name.trim()) {
      setErr(
        t(
          "Your name is needed — your partner sees it.",
          "Votre nom est requis — votre partenaire le voit.",
        ),
      );
      return;
    }
    setBusy(true);
    const data: Partial<Profile> = {
      name: name.trim(),
      bio: bio.trim(),
      email: user.email ?? "",
    };
    if (!profile?.created) data.created = Date.now();
    if (pendingPhoto) data.photo = pendingPhoto; // only overwrite if newly chosen
    try {
      await saveProfile(data);
      setPendingPhoto(null);
      setOk(t("Saved.", "Enregistré."));
    } catch (e2) {
      setErr(prettyError(e2));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="spin" />
        <p className="muted center" style={{ fontSize: 14 }}>
          {t("Loading your profile…", "Chargement de votre profil…")}
        </p>
      </>
    );
  }

  const photo = pendingPhoto ?? profile?.photo ?? null;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 30 }}>
        {t("Your profile", "Votre profil")}
      </div>

      <div className="card" style={{ marginTop: 16, textAlign: "center" }}>
        <div className="avatarwrap">
          <div className="avatar">
            {/* No photo → the branded blush/claret placeholder, not initials
                (brand pack §6). Identity avatars elsewhere keep their initials. */}
            <img src={photo ?? "/avatar-placeholder-256.png"} alt="" />
          </div>
          <button
            className="photobtn"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            {t("Change photo", "Changer la photo")}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={onPhoto}
          />
        </div>

        <div style={{ textAlign: "left" }}>
          <label htmlFor="name">
            {t("Name", "Nom")}{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              {t("(your partner sees this)", "(votre partenaire le voit)")}
            </span>
          </label>
          <input
            className="input"
            id="name"
            maxLength={20}
            placeholder={t("e.g. Sarah", "p. ex. Sarah")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="bio">
            {t("A line about you", "Une ligne sur vous")}{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              {t("(optional)", "(facultatif)")}
            </span>
          </label>
          <textarea
            className="input"
            id="bio"
            maxLength={140}
            placeholder={t("Something honest and short.", "Quelque chose d’honnête et de court.")}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {err && <div className="err">{err}</div>}
        {ok && <div className="ok">{ok}</div>}

        <button className={busy ? "btn pill busy" : "btn pill"} type="button" onClick={save} disabled={busy}>
          {busy ? t("Saving…", "Enregistrement…") : t("Save profile", "Enregistrer le profil")}
        </button>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="eyebrow">{t("Language", "Langue")}</div>
        <p className="muted" style={{ fontSize: 13, margin: "8px 0 14px" }}>
          {t(
            "Choose the language for the app.",
            "Choisissez la langue de l’application.",
          )}
        </p>
        <div className="langrow">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`langopt ${lang === l.code ? "on" : ""}`}
              onClick={() => setLang(l.code)}
              aria-pressed={lang === l.code}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>

      {onLeave &&
        (leaving ? (
          // Leaving used to be one unconfirmed tap sitting directly above the
          // identically-styled Sign out — and afterwards the code appears
          // nowhere in the app, so a mis-tap cost the couple their shared
          // history until the partner dug the code out.
          <div className="card" style={{ marginTop: 16 }}>
            <div className="eyebrow">{t("Leave this session?", "Quitter cette session ?")}</div>
            <p className="muted" style={{ fontSize: 13, margin: "8px 0 4px" }}>
              {t(
                "Nothing is deleted — you can come back any time with your code:",
                "Rien n’est supprimé — vous pouvez revenir à tout moment avec votre code :",
              )}
            </p>
            {code && <div className="codebig">{code}</div>}
            <button className="btn out" type="button" onClick={onLeave}>
              {t("Yes, leave", "Oui, quitter")}
            </button>
            <button className="btn ghost" type="button" onClick={() => setLeaving(false)}>
              {t("Stay", "Rester")}
            </button>
          </div>
        ) : (
          <button className="btn out" type="button" onClick={() => setLeaving(true)}>
            {t("Leave this session", "Quitter cette session")}
          </button>
        ))}
      <button className="btn out" type="button" onClick={() => signOut(auth)}>
        {t("Sign out", "Se déconnecter")}
      </button>

      {/* The trust surface. This app holds what a couple said about faith, sex
          and money — the data controls ARE product, not a legal footnote, so
          they say plainly what is held, what leaves, and what deletion costs. */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="eyebrow">{t("Your data", "Vos données")}</div>
        <p className="muted" style={{ fontSize: 13, margin: "8px 0 4px" }}>
          {t(
            "TwoAgree holds your answers about faith, intimacy, health and money. They are yours. Take a copy whenever you like, or erase everything.",
            "TwoAgree conserve vos réponses sur la foi, l’intimité, la santé et l’argent. Elles vous appartiennent. Prenez-en une copie quand vous voulez, ou effacez tout.",
          )}
        </p>

        <div className="datarow">
          <button className="btn out" type="button" onClick={() => doExport(true)} disabled={dataBusy}>
            {dataBusy ? t("Working…", "En cours…") : t("Download a readable copy", "Télécharger une copie lisible")}
          </button>
          <p className="datahint">
            {t(
              "Every question you were asked and what you answered, as a page you can read or print.",
              "Chaque question posée et votre réponse, sous forme de page lisible ou imprimable.",
            )}
          </p>
        </div>
        <div className="datarow">
          <button className="btn ghost" type="button" onClick={() => doExport(false)} disabled={dataBusy}>
            {t("Download the raw data (JSON)", "Télécharger les données brutes (JSON)")}
          </button>
          <p className="datahint">
            {t(
              "The machine-readable record, for moving your data to another service.",
              "L’enregistrement lisible par machine, pour transférer vos données ailleurs.",
            )}
          </p>
        </div>
        {dataMsg && <div className="ok">{dataMsg}</div>}
      </div>

      <div className="card danger" style={{ marginTop: 16 }}>
        <div className="eyebrow">{t("Erase everything", "Tout effacer")}</div>
        {!confirmDelete ? (
          <>
            <p className="muted" style={{ fontSize: 13, margin: "8px 0 4px" }}>
              {t(
                "Deleting is permanent and immediate. Take a copy first if you want one.",
                "La suppression est définitive et immédiate. Prenez une copie d’abord si vous en voulez une.",
              )}
            </p>
            <button
              className="btn ghost"
              type="button"
              style={{ color: "var(--danger)" }}
              onClick={() => setConfirmDelete(true)}
              disabled={dataBusy}
            >
              {t("Delete my account", "Supprimer mon compte")}
            </button>
          </>
        ) : (
          <>
            {/* Exactly what deleteMyAccount does — including the part that
                affects the other person, which the old one-line warning left
                them to discover afterwards. */}
            <p style={{ fontSize: 13, margin: "10px 0 0", lineHeight: 1.55 }}>
              {t("Here is precisely what happens:", "Voici précisément ce qui se passe :")}
            </p>
            <ul className="deletelist">
              <li>
                {t(
                  "Your profile, photo and private Path answers are erased.",
                  "Votre profil, votre photo et vos réponses privées du Chemin sont effacés.",
                )}
              </li>
              <li>
                {t(
                  "Every answer, guess and rating you gave is removed from every session you're in.",
                  "Chaque réponse, intuition et évaluation que vous avez données est retirée de toutes vos sessions.",
                )}
              </li>
              <li>
                {t(
                  "Your partner keeps their own answers — but your side of every reveal you shared disappears from their app too, and the scores between you go with it.",
                  "Votre partenaire garde ses propres réponses — mais votre côté de chaque révélation partagée disparaît aussi de son application, et les scores entre vous avec.",
                )}
              </li>
              <li>
                {t(
                  "A session where you were the only member is removed entirely.",
                  "Une session où vous étiez le seul membre est entièrement supprimée.",
                )}
              </li>
              <li>
                {t(
                  "Your consent record is kept. It is the evidence we were allowed to hold your data, and it contains no answers.",
                  "Votre enregistrement de consentement est conservé. C’est la preuve que nous étions autorisés à détenir vos données, et il ne contient aucune réponse.",
                )}
              </li>
            </ul>
            <p className="err" style={{ marginTop: 12 }}>
              {t("This cannot be undone.", "C’est irréversible.")}
            </p>
            <button
              className="btn"
              type="button"
              style={{ background: "var(--danger)", boxShadow: "none" }}
              onClick={doDelete}
              disabled={dataBusy}
            >
              {dataBusy
                ? t("Deleting…", "Suppression…")
                : t("Yes, delete everything", "Oui, tout supprimer")}
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => setConfirmDelete(false)}
              disabled={dataBusy}
            >
              {t("Cancel", "Annuler")}
            </button>
          </>
        )}
        <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
          {t("See our", "Consultez notre")}{" "}
          <a className="link" href="/privacy.html" target="_blank" rel="noreferrer">
            {t("Privacy Policy", "Politique de confidentialité")}
          </a>
          .
        </p>
      </div>

      <div className="foot">
        {t("Signed in as", "Connecté en tant que")}{" "}
        {user.email || t("your Google account", "votre compte Google")}
      </div>
      <BuildStamp />
    </section>
  );
}
