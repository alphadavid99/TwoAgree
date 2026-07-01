# Aligned — Setup Checklist (tick as you go)

You are just clicking buttons and copying two things. Claude Code builds everything else.
If you get stuck on any step, you can literally ask Claude Code "help me do step X" and it'll walk you through it.

---

## Part 1 — Put your files in one folder (on your Mac)

- [ ] Make a new folder on your Mac. Name it **aligned** (Desktop is fine).
- [ ] Download these from this chat and drop them in the folder:
      - [ ] `CLAUDE.md`
      - [ ] `aligned-accounts.html`
- [ ] Add your existing project files to the same folder:
      - [ ] `index.html`
      - [ ] the question-bank spreadsheet (`.xlsx`)
      - [ ] the question-bank viewer (`.html`)

That's the folder Claude Code will work in. Done? Move on.

---

## Part 2 — Firebase (in your web browser)

Go to **console.firebase.google.com** and open your **Aligned** project.

**Turn on sign-in:**
- [ ] In the left menu click **Build → Authentication**.
- [ ] Click **Get started**.
- [ ] Click the **Sign-in method** tab.
- [ ] Click **Email/Password**, switch it **on**, click **Save**.
- [ ] (Optional) Click **Add new provider → Google**, switch it on, pick your email as the support email, **Save**.

**Copy your "config" (the settings Claude Code needs):**
- [ ] Click the **gear icon ⚙️** at the top-left (next to "Project Overview") → **Project settings**.
- [ ] Scroll down to **Your apps**.
- [ ] If you see NO web app: click the **</>** (web) icon, give it a nickname like *Aligned web*, click **Register app**. (Ignore the Hosting checkbox — skip it.)
- [ ] You'll see a box of code starting with `const firebaseConfig = {`. **Copy that whole box.**
- [ ] Paste it into a Notes file so you have it ready. (It's not a password — safe to keep in Notes.)

Done? Move on.

---

## Part 3 — GitHub (in your web browser)

This is just an online backup + history of your project.

- [ ] Go to **github.com** and sign in.
- [ ] Top-right, click the **+** → **New repository**.
- [ ] Name it **aligned**.
- [ ] Choose **Private**.
- [ ] Do **NOT** tick "Add a README" or any other boxes — leave it empty.
- [ ] Click **Create repository**.
- [ ] Copy the web address of that page (looks like `https://github.com/yourname/aligned`). Keep it with your config.

Done? Move on.

---

## Part 4 — Hand it all to Claude Code

- [ ] Open **Claude Code** and point it at your **aligned** folder.
- [ ] Paste in the **kickoff message** (in the chat, below this checklist). Before sending, drop in your **GitHub link** and your **Firebase config** where it says to.
- [ ] Press send. Now just watch and answer when it asks.

**Two pop-ups may appear — this is normal:**
- [ ] If a browser window opens asking to **allow Firebase login** → click **Allow**.
- [ ] If it asks you to **sign in to GitHub** → sign in.

That's it. When Claude Code says the smoke test deployed, your pipeline works and you're ready for real building.

---

### If something feels wrong
You cannot break anything by trying. Ask Claude Code plainly: *"That didn't work, here's what I see: [paste what's on screen]."* It will sort it out. And you can always come back here and I'll translate.
