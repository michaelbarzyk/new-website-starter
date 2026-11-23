# Tutorial: from nothing to a live, vibe-codeable website

By the end you will have:

- a live website at `https://<your-project>.web.app`
- a private GitHub repo with a `main` (live) and `dev` (working) branch
- a **preview link for every change**, posted automatically on each pull request
- Google sign-in for you as admin, and a locked-down database
- Claude Code ready to build features with you

Time: 30–45 minutes the first time. Claude does most of it; steps you must do yourself are
marked **YOU**. Worked example: https://newsite-test-mb.web.app (built with these exact steps).

Cost: free. Firebase's free plan (Spark) covers hosting, Firestore and Auth at hobby scale, and
GitHub private repos and Actions are free at this size. No credit card is needed.

---

## Fastest start: from your phone (no computer, no installs)

**What you'll end up with:** a real website with its own web address, made by chatting with Claude.

**What you need:** a phone with the Claude app, a paid Claude plan, an email address, and about
45 minutes the first time. Everything except the Claude plan is free.

**How this is laid out:** each step says what to do, what you should see when it worked (✅), and
what to do if you don't (⚠️). Button names may differ slightly from what's written here; look for
the closest match. Take it one step at a time, and tell Claude when you're stuck.

You'll bounce between two places: your phone's **web browser** (Safari or Chrome) and the **Claude app**.

### Step 1: What do you already have?

Check each line. Then do **only** the sections below for the things you answered "no" to, in
the order they appear, and skip the rest.

| Do you have… | If yes | If no |
| --- | --- | --- |
| A Google account (any Gmail address works) | skip "Create a Google account" | do it |
| A GitHub account (you can sign in at github.com) | skip "Create a GitHub account" | do it |
| A paid Claude plan (Pro, Max or a Team seat, and a **Code** tab in the app) | skip "Get a paid Claude plan" | do it |
| Opened the Firebase console before and accepted its terms | skip "Accept Firebase's terms" | do it |

Not sure about one? Try signing in at its address below. If you get in, you have it.
Use the **same email** for everything if you can.

**Create a Google account** *(only if you don't have one)*
1. In your browser, go to https://accounts.google.com/signup.
2. Fill in your name, pick a username, set a password, and finish the verification screens.
3. ✅ You see a Google page showing your name or initial in the top corner.

**Create a GitHub account** *(only if you don't have one)*
1. Go to https://github.com/signup.
2. Enter your email, a password and a username.
3. Solve the puzzle, then enter the verification code GitHub emails you. Skip any "personalize" questions.
4. ✅ You see your GitHub home page. ⚠️ No code? Check spam, then tap "resend".

**Get a paid Claude plan** *(only if you're not on one)*
Claude Code isn't on the free plan, so you need one of these.
1. Install the **Claude** app, or go to https://claude.ai, and sign up. (Have a free account? Just upgrade.)
2. Open your profile → **Upgrade** → choose **Pro** or higher.
3. ✅ You see a **Code** tab. ⚠️ No Code tab? Update the app, or use https://claude.ai/code in your browser.

**Accept Firebase's terms** *(only if you've never opened the Firebase console)*
1. In your browser, signed in to your Google account, go to https://console.firebase.google.com.
2. If you see a terms screen, accept it. Don't create a project yet.
3. ✅ You see "Create a project" or "Add project". That's enough; close it.

### Step 2: Connect Claude to GitHub

This lets Claude see and change your website's files. You'll do it from the Claude app.

1. Open the **Claude** app and tap the **Code** tab.
2. Tap **Connect GitHub** (or "Sign in with GitHub" / "Set up"; it appears the first time).
   Your browser opens.
3. GitHub asks you to sign in if needed. **Use the GitHub account from step 1b.**
   ⚠️ If your phone's browser is already signed in to a *different* GitHub account, Claude will
   attach to that one by mistake. Sign out of the other one first (github.com → profile picture → Sign out).
4. GitHub shows a screen titled something like **"Authorize Claude"**. Tap **Authorize**.
5. A second screen asks you to **install** the Claude app, titled something like **"Install & Authorize"**.
   Under **Repository access**, choose **All repositories**, then tap **Install**.
   (Choosing "Only select repositories" means repos you make later won't show up, which is the most
   common problem. If you already picked that, go to https://github.com/settings/installations →
   Claude → **Configure** → change it to **All repositories** → **Save**.)
6. GitHub may ask for your password again. Enter it.
7. You're sent back to the Claude app.
8. ✅ In the **Code** tab you see a box to type in, and a **repository selector** underneath it
   (it may say "Select repository"). ⚠️ If it still says "Connect GitHub", repeat from step 2.

### Step 3: Make your website's home from the starter

Your site needs its own space on GitHub (a "repository", or repo). We copy a ready-made starter.

1. In your **browser**, go to https://github.com/michaelbarzyk/new-website-starter.
2. Tap the green **Use this template** button (top right) → **Create a new repository**.
   ⚠️ Can't see it? Open your browser menu and tap **Request desktop site**, then reload.
3. **Repository name:** type a short name with only lowercase letters, numbers and hyphens, like
   `my-bakery-site`. This becomes part of your project's name, so choose something you like.
   Don't use your username as the name.
4. Choose **Private** (so only you can see the files; your website is still public).
5. Tap **Create repository**.
6. ✅ You land on a page showing your repo name at the top, with a folder `.claude` and a file
   `CLAUDE.md` listed.

### Step 4: Start chatting with Claude about your site

1. Back in the **Claude app** → **Code** tab.
2. Tap the **repository selector** under the text box and search for your repo name. Tap it.
   ⚠️ Not in the list? Wait a minute, pull down to refresh, or fully close and reopen the app. If
   it's still missing, Claude's GitHub access doesn't include it; redo the "Repository access"
   part of Step 2 and choose **All repositories**.
3. In the text box type: **Use the new-website skill to build me a website.** and send it.
   (Typing `/new-website` may also work, but it may not show in the menu on a phone.)
4. Starting up can take a minute or two the first time.
5. ✅ Claude asks you a short **multiple-choice question** about what your site is for, instead of
   giving a long general explanation. ⚠️ If it explains how websites work in general instead, say:
   **"Read CLAUDE.md in this repo and follow it."**

### Step 5: Answer the questions, and Claude builds the first draft

Claude asks about five short things:
1. What the site is (a portfolio, a business, a blog, and so on) and who it's for.
2. Which **looks** you like: a list of eight moods, and you pick two or three.
3. What the site should do (contact form, sign-in, you editing it, and so on).
4. Whether you have photos and text, or want placeholders.
5. A quick "does this sound right?" check.

Answer by typing the numbers. Then Claude explains how setup works and walks you through it.

### Step 6: The Firebase and GitHub taps Claude will ask for

Claude can't do these for you, so it tells you exactly what to tap, one at a time:
- Create your Firebase project, database, and Google sign-in (in your browser).
- Make one secret key and save it in your GitHub repo. **Never paste the secret key into the Claude chat.** It only goes into the box GitHub gives you.
- Add yourself as admin of your site, so you can sign in and edit it.

After these, Claude shows you a **preview link**: open it, and that's your site.

### Step 7: Ship it and keep changing it

1. Open the preview link on your phone and look around.
2. Tell Claude what to change in plain words: "make the title bigger", "add a menu page".
3. When you're happy, tell Claude **"ship it"**. Your site goes live at its real address.
4. From then on: describe a change, check the preview, say "ship it".

If you'd rather use a computer, follow the full guide below.

---

## Part 0: Accounts and software (one time)

**YOU**, create these if you don't have them:

| Need | Where |
| --- | --- |
| Claude Code (terminal or VS Code extension) | https://claude.com/claude-code |
| GitHub account | https://github.com/signup |
| Google account (Gmail is fine) | https://accounts.google.com/signup |

**YOU**, accept Firebase's terms once: visit https://console.firebase.google.com while signed in
to Google and click through any "Get started" / terms screen. Skipping this is the most common
reason project creation fails.

### Your terminal

**Mac:** open Terminal (Cmd+Space, type "Terminal") or, in VS Code, **Terminal → New Terminal**.
Install Homebrew first: https://brew.sh

**Windows:** this setup runs inside **WSL**, Windows' built-in Linux. One time:
1. Open **PowerShell as administrator** (Start menu, type "PowerShell", right-click → Run as administrator).
2. Run `wsl --install`, then restart the PC when asked. After the restart an Ubuntu window opens
   and asks you to pick a Linux username and password (the password won't show as you type; that's normal).
3. From now on, do **everything** in an Ubuntu terminal: Start menu → "Ubuntu", or in VS Code
   install the "WSL" extension and use **Remote: Connect to WSL**, then **Terminal → New Terminal**.
4. Install Claude Code **inside** Ubuntu, and keep your projects in the Linux home folder (`~`),
   never under `/mnt/c`.
5. In Ubuntu, run once: `sudo apt update && sudo apt install -y git curl unzip`

Every command in this tutorial then works the same on both systems; where they differ, both are shown.

Claude installs and checks the rest for you (node, bun, gh, firebase-tools) and prints the right
command for your system when something is missing.

## Part 1: Get the skill

The skill is private, so you must be a collaborator (the owner adds you; accept the email invite).

**YOU**, in your terminal:

```sh
# install the GitHub CLI
brew install gh                      # Mac
# Windows (Ubuntu): see https://github.com/cli/cli/blob/trunk/docs/install_linux.md

gh auth login                        # GitHub.com → HTTPS → Login with a web browser
gh repo clone michaelbarzyk/claude-skill-new-website ~/.claude/skills/new-website
```

Check: `ls ~/.claude/skills/new-website` shows `SKILL.md`. Restart Claude Code so it sees the skill.

## Part 2: Log in to the tools

**YOU**, in a real terminal (not the Claude chat box):

```sh
# Mac:
npm install -g firebase-tools        # needs node: brew install node
# Windows (Ubuntu): sudo npm install -g firebase-tools   (needs node, see Claude's preflight)

firebase login                       # browser opens; approve. On WSL, copy the link into your browser if none opens.
gh auth refresh -s repo,workflow     # lets gh create repos and workflows
```

(Claude also checks these and tells you what's missing, so don't worry about getting it perfect.)

## Part 3: Start the project

Open Claude Code in any folder and say:

> I want to start a new website called `my-site-name`. It's a <one line about it>.

Claude then, on its own:

1. checks your tools and logins (and tells you what to fix),
2. creates the Firebase project and web app (if the name is taken it adds a suffix),
3. builds the site from the template, then installs, lints, tests and builds it,
4. creates a **private** GitHub repo and pushes `main` and `dev`.

Project names: lowercase letters, digits and hyphens only; they must be unique across all of Firebase.

## Part 4: Finish the Firebase and CI setup

### 4a. Create the database  (**YOU**, only if Claude says it failed; it usually does on new projects)

1. Console → your project → **Firestore Database** → **Create database**.
2. Edition **Standard** → location `nam5` (US) → **Production mode** → **Create**.

### 4b. Create the CI deploy key  (**YOU**, one command)

Claude gives you this command; run it in a real terminal:

```sh
cd ~/my-site-name && firebase init hosting:github
```

Answer the prompts exactly like this:

| Prompt | Answer |
| --- | --- |
| GitHub repo | your **full** `username/my-site-name` (name alone fails with "authorization cannot be used") |
| Run a build script before every deploy? | **Yes**, then `bun install --frozen-lockfile && bun run build` |
| Overwrite the PR workflow file? | **No** |
| Deploy automatically when a PR is merged? | **No** (the template already does it) |
| Install Firebase agent skills? | **No** |

A browser window opens for GitHub authorization; approve it as the same GitHub account that owns the repo.

**Expect an error the first time.** You will probably see `404 ... service account ... does not
exist`. That is Google being slow to register the new account, not your mistake. **Run the same
command again**; the second try works (it did on every test so far). If it still fails, tell Claude and it will guide you
through the manual key route.

Tell Claude it's done. It confirms the secret exists, fixes the workflow files, deploys the site,
and opens your first pull request `dev → main`. Wait for the checks to pass; Claude gives you the
**preview link**. Open it; that's your site.

### 4c. Ship the first version

Tell Claude to merge. Pushing to `main` deploys the live site; Claude waits for the deploy and checks it.
From now on, `main` changes only when you say "ship it".

## Part 5: Turn on sign-in and make yourself admin  (**YOU**)

**Enable Google sign-in**

1. Console → **Authentication** → **Get started**.
2. **Sign-in method** tab → **Google** → toggle **Enable** → choose a support email → **Save**.

**Become admin**

1. Open your live site and click **Admin sign-in**. Sign in with Google. It says *"not an admin"*. That's expected.
2. Console → Authentication → **Users** → copy your **User UID**.
3. Console → Firestore Database → **Start collection**:
   - Collection ID: `admins` → **Next**
   - Document ID: paste your UID (not "Auto-ID")
   - Field `role`, type `string`, value `admin` → **Save**
4. Refresh the site (sign out and in again if needed). It now says *"admin"*.

Admin documents can only be made in the console, never by the app. That's deliberate.

## Part 6: Build things (the fun part)

Describe what you want:

> Make a landing page for my bakery with a hero, a menu section and a contact form.

Claude then:

1. creates a `feature/...` branch off `dev` and opens a pull request into `dev` right away,
2. posts the **preview link** (open it on your phone too),
3. applies your changes on the same branch until you're happy,
4. runs a code review and fixes what you agree with, then merges into `dev`.

When you say **"ship it"**, `dev` merges into `main` and the live site updates in about a minute.
Everything is in git, so any change can be undone.

Rules Claude follows in your project live in `CLAUDE.md`. Add your own (design, tone, product rules) under "Project notes".

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Project creation fails | Accept Firebase terms (Part 0). Name already used? Pick another. |
| `Cloud Firestore API has not been used` | Create the database in the console (4a), then re-run the deploy. |
| `authorization cannot be used with this repository` | Use the full `username/repo` name, and authorize with the GitHub account that owns the repo. |
| `service account ... does not exist` | Run `firebase init hosting:github` again. |
| CI fails at `bun install --frozen-lockfile` | Ask Claude to run `bun install` and commit `bun.lock`. |
| First CI run on `main` failed before the key existed | Ignore it; the next push deploys. |
| Claude says `repository ... could not be found` | Claude is connected to a different GitHub account, or hasn't been given this repo. Disconnect GitHub in Claude and reconnect while signed in as the repo's owner; choose **All repositories** when GitHub asks which to allow, so repos you create later also show up. Then refresh the repo list. |
| Sign-in popup does nothing | Allow popups. For custom domains, add them under Auth → Settings → Authorized domains. |
| Site says "not an admin" after adding the doc | The document ID must equal your User UID exactly; sign out and back in. |
| No preview link on a PR | Previews only run for branches in the same repo, and need the deploy key from 4b. |

## Cleaning up a practice project

- GitHub: repo → Settings → scroll to **Delete this repository**.
- Firebase: Console → Project settings → **Delete project** (restorable for 30 days).
- Locally: delete the `~/my-site-name` folder (`rm -rf ~/my-site-name`; be careful, it can't be undone).

## Handing the setup to someone else

Send them Part 0 and this repo. Each person needs their **own** Firebase project and GitHub repo
(the CI key and admin list belong to whoever created them), so they run the skill themselves
rather than reusing your site.
