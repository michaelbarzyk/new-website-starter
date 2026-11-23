---
name: new-website
description: Bootstrap a brand-new website project end to end — Vue 3/TS/Vite/Tailwind/Pinia scaffold, Firebase project (Hosting, Firestore, Auth), private GitHub repo, CI preview deploys, dev/main PR workflow, and CLAUDE.md. Use when the user says they want to start a new project, site, app or website, or "set up a new project like krill-and-anchor".
---

# new-website

Turns "I want to start a new website" into a live, deployed, CI-wired project the user can
immediately start vibe coding in. Do everything you can yourself; only hand the user the steps
that genuinely need a human (browser consent, console toggles). Never ask for secrets or tokens.

Paths below are relative to this skill's directory (`~/.claude/skills/new-website/`).
Call it `$SKILL`.

## Audience

Assume the user may be a **complete beginner** who has never coded. Use plain words (say "your
website's address", not "deploy target"), give ONE step at a time, say exactly what to tap or
click, and confirm each step worked before the next. Never paste walls of commands at them. If
something fails, explain what happened in one sentence and what you'll do about it.

## Fixed defaults (don't re-ask)

- Stack: Vue 3 + TS + Vite + Tailwind v4 + Pinia + Vitest, **Bun** only. Not React.
- Firebase: Hosting + Firestore (locked-down rules, `admins` collection) + Auth (Google sign-in for admins).
- GitHub: **private** repo, `main` (live) + `dev` (working) branches, PR previews, two-loop review (see the project's CLAUDE.md).
- Location: `~/<project-name>` unless the user says otherwise.

## Which mode?

- Laptop/desktop session with a terminal where the user can run commands: steps below.
- Phone or cloud session (no local browser, `firebase login` impossible): follow `reference/phone-mode.md`
  instead of Steps 1, 2, 5 and 6 (scaffold with `--phone`; CI does the deploying; the user pastes one
  service-account key into a GitHub secret and never into chat). Steps 3, 4's idea, 7 and 8 still apply.
- Not sure? Ask: "Are you on a computer with a terminal, or just your phone?"

## Step 0: discovery (guided, multiple choice)

Follow `reference/discovery.md`: five short rounds (what it is, a mood board of 8 looks, features,
content, confirm). Use numbered or multiple-choice options, not open questions, and say the
explainer from `reference/explainers.md` (#1) before any setup. Derive the project name (kebab-case
from the site name) and title yourself and confirm them in Round 5. Firebase project ids are
global; if the name is taken, retry with a short suffix, don't ask.

Phone style: short messages, one topic each, always say how to answer ("reply with a number").

## Step 1: preflight

OS: macOS and Linux work directly. **Windows must use WSL** (Ubuntu): if `uname` fails or this is native Windows, stop and walk the user through `wsl --install` (see TUTORIAL.md, Part 0), then continue inside the WSL terminal, with the project under the WSL home directory (not `/mnt/c`).

Run `bash $SKILL/scripts/preflight.sh`. For each MISSING line, fix it yourself if it is an install
(the preflight prints the right command for the OS); otherwise tell the user the exact command. Logins are interactive: ask the
user to run them in this session with the `!` prefix, e.g. `! firebase login`, `! gh auth login`,
`! gh auth refresh -s repo,workflow`. Re-run preflight until clean.

## Step 2: Firebase project (autonomous)

```
bash $SKILL/scripts/firebase-setup.sh <project-id> "<Title>" /tmp-or-scratchpad/web-config.json
```
Creates the project, a web app, the `(default)` Firestore database (nam5) and saves the web SDK config.
If `projects:create` fails because of terms of service, send the user to https://console.firebase.google.com
to accept once (or create the project there with the same id), then re-run (the script is idempotent).
On a brand-new project the Firestore create usually fails with "API has not been used" (the CLI can't enable it, and retrying doesn't help). Expect this: tell the user to do the console click in `reference/manual-steps.md` ("Firestore") and carry on with the other steps meanwhile; deploy rules in Step 6 once it exists.

## Step 3: scaffold + verify (autonomous)

```
node $SKILL/scripts/scaffold.mjs --dir ~/<name> --name <name> --title "<Title>" \
  --project-id <project-id> --site-id <project-id> \
  --secret FIREBASE_SERVICE_ACCOUNT_<PROJECT_ID_UPPER_WITH_UNDERSCORES> --config <web-config.json>
cd ~/<name> && bun install && bun run format && bun run lint && bun run test && bun run build
```
Everything must pass before continuing. Fix problems rather than skipping.
(Site id defaults to the project id, so the URL is `https://<project-id>.web.app`.)

## Step 4: GitHub (autonomous)

Inside the project: `bash $SKILL/scripts/github-setup.sh <name> private`. This commits, creates the
private repo, pushes `main` and `dev`. (Private repos on the free plan can't have branch protection;
the workflow in CLAUDE.md is the guard instead. Don't try to enable it.)

## Step 5: CI deploy key (one command for the user)

`firebase init hosting:github` creates the Firebase service account and stores it as a GitHub secret.
It needs browser consent and keyboard prompts, so the user must run it in a **real terminal** (the
`!` prefix in chat does not pass prompts through reliably; in VS Code: Terminal > New Terminal):

```
cd ~/<name> && firebase init hosting:github
```
Give these answers up front, one line each:
- GitHub repo: the FULL `<owner>/<name>` (name alone fails with "authorization cannot be used").
- Run a build script before every deploy? **Yes**, `bun install --frozen-lockfile && bun run build`.
- Overwrite PR workflow file? **No**. Deploy on merge? **No** (the template workflows already do it;
  the secret is created before these prompts, so declining loses nothing).
- Install Firebase agent skills? **No** (optional; can add later).
- Optional: revoke the Firebase CLI GitHub OAuth app link it prints.

Known flake (2 of 2 runs so far): the first attempt fails with `404 ... service account ... does not
exist`, because Google needs a few seconds to propagate the new account before the key can be made.
TELL THE USER BEFORE THEY RUN IT: "It will probably error once; that's normal. Just run it again."
The failed attempt leaves a harmless unused service account. Do this step last, after the slower
steps, to give Google time.

After: confirm `gh secret list` shows `FIREBASE_SERVICE_ACCOUNT_<ID>`, `git checkout firebase.json`
(the command only reformats it), and run `bash $SKILL/scripts/fix-workflows.sh <project-id>`.
If it can't be made to work, see `reference/manual-steps.md` ("CI key").

## Step 6: first deploy (autonomous)

```
cd ~/<name>
bunx firebase-tools@latest deploy --only firestore,hosting --project <project-id>
```
(Builds `dist/` first with `bun run build`.) `dev` and `main` start identical, so first add a small commit on `dev` (e.g. tick the ROADMAP). Then open a PR `dev` → `main` titled
"chore: initial release", wait for the preview check (`gh pr checks --watch`), post the preview URL,
and tell the user the live URL. Merge to `main` only when they say ship (per CLAUDE.md), or, for
this very first release, offer it, since nothing is live yet and `main` should deploy once to prove CI.

## Step 7: console steps for the user

Walk through `reference/manual-steps.md` ("Auth" and "First admin"): enable Google sign-in, sign
in once on the live site, create the `admins/{uid}` doc. Explain each click; offer to wait.
These can't be automated without a service-account key.

## Step 8: first draft, admin, hand off

Build the first draft per `reference/discovery.md` ("First draft") BEFORE the console steps if the
user is waiting on the preview; use explainers #3, #4 and #6 at their moments.

- Write a project memory note if useful (project purpose, live URL, repo).
- Summarize: live URL, repo URL, branch workflow in one line, what's left (design, features).
- Ask what to build first and start vibe coding on a `feature/` branch off `dev`, following the
  project's CLAUDE.md (PR early, post the preview URL).

## Troubleshooting

- CI fails at `bun install --frozen-lockfile`: lockfile stale; run `bun install` and commit `bun.lock`.
- `firebase deploy` 403 / "Cloud Firestore API has not been used": enable it in the console or wait
  a minute after project creation, retry.
- Preview comment missing on PRs from forks: expected (workflow only runs for same-repo PRs).
- Popup sign-in blocked on `localhost`: it is allowed by default; for custom domains add them under
  Auth → Settings → Authorized domains.
