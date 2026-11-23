---
name: new-website
description: Bootstrap a brand-new website project end to end — Vue 3/TS/Vite/Tailwind/Pinia scaffold, Firebase project (Hosting, Firestore, Auth), private GitHub repo, CI preview deploys, dev/main PR workflow, and CLAUDE.md. Use when the user says they want to start a new project, site, app or website, or "set up a new project like krill-and-anchor".
---

# new-website

Turns "I want a website" into a live, deployed, CI-wired project the user can vibe code in. Do
everything you can yourself; hand the user only the steps that need a human (console toggles,
browser consent, one secret). Never ask for secrets or tokens in chat.

`$SKILL` = this skill's directory (`.claude/skills/new-website/` in a starter repo, or
`~/.claude/skills/new-website/`). Reference files live in `$SKILL/reference/`.

## Audience and style

Assume a **complete beginner on a phone**. Short messages, ONE step at a time, numbered choices
("reply with a number"), plain words ("your web address", not "deploy target").

Every console step follows the same shape (see `reference/phone-mode.md` for the exact scripts):
1. say what to tap, giving BOTH old and new menu names where they differ;
2. say what to TYPE before they reach any text box (names, ids, emails);
3. say what success looks like, and end with "reply **done**";
4. if something fails, say in one sentence what happened and what you'll do.
Explain *why* in one line when they ask (anonymous sign-in? roles? the config?), and write the answer into
`reference/feedback.md` if it was a surprise.

## Fixed defaults (don't re-ask)

- Stack: Vue 3 + TS + Vite + Tailwind v4 + Pinia + Vitest, **Bun** only. Not React.
- Firebase: Hosting + Firestore (locked-down rules) + Auth (Google only; anonymous OFF).
- Admin: the owner's verified Google email is in `ownerEmails()` in `firestore.rules`; their first
  sign-in creates their own `admins/{uid}` doc. No console admin step.
- GitHub: **private** repo; `main` (live) + `dev` (working); PR previews; two-loop review (see the
  project's CLAUDE.md). Branches are `<type>/<issue#>-<description>` and **never** `claude/`.
- The Firebase **project id is the free web address** (`<id>.web.app`) and can never change.

## Which mode?

- Phone or cloud session (no local browser, no `firebase login`): **`reference/phone-mode.md`**. CI does all
  deploys; the user pastes one service-account key into a GitHub secret, never into chat.
- Laptop with a terminal: the "Laptop mode" section below.
- Not sure? Ask: "Are you on a computer with a terminal, or just your phone?"

## The flow (both modes)

1. **Discovery** (`reference/discovery.md`; first check for `.claude/site-brief.json` from the setup website and confirm it instead of re-asking): what it is, mood board, features, content, confirm.
   Also collect: the site name, the **project id / web address** to create (kebab-case from the
   name), and the **owner's Google email** (only if they want admin editing). Say explainer #1 and #2b
   (`reference/explainers.md`) before any setup. If they answer several rounds at once, confirm in one line and skip ahead.
2. **Firebase setup**, all in ONE batch before scaffolding, so nothing is redone: project, database,
   sign-in, web app config, deploy key, IAM roles, GitHub secret. Phone: user does it, step by step.
   Laptop: `scripts/firebase-setup.sh` does most of it.
3. **Scaffold with the REAL config**: `scripts/scaffold.mjs ... --owner-email <email> [--phone]`
   (`--in-place --dir .` inside a starter repo). Then `bun install`, `bun run format`, lint, test, build; all must pass.
4. **First PR and preview**: open the PR, wait for CI, post the preview URL, user reacts in plain words.
5. **Ship** only when the user says so. CI publishes the rules, then the site. Then have them sign in
   on the live address and confirm the **Admin** link appears (explainer #4/#6).
6. **Hand off**: summarise (live URL, repo, workflow in one line), ask what to build first, then start
   on a `feature/<issue#>-...` branch per the project's CLAUDE.md.

While the user is doing steps in the Firebase console, build the first draft in parallel; that is what
keeps them from waiting.

## Laptop mode

1. `bash $SKILL/scripts/preflight.sh` (Windows needs WSL). Fix MISSING installs yourself; logins are the
   user's: `! firebase login`, `! gh auth login`, `! gh auth refresh -s repo,workflow`.
2. `bash $SKILL/scripts/firebase-setup.sh <project-id> "<Title>" <web-config.json>` creates the project, web app and
   database. On a new project Firestore often fails ("API has not been used"): have the user click Create
   database (`reference/manual-steps.md`) and carry on.
3. `node $SKILL/scripts/scaffold.mjs --dir ~/<name> --name <name> --title "<Title>" --project-id <id> --site-id <id> --secret FIREBASE_SERVICE_ACCOUNT_<ID_UPPER_UNDERSCORES> --config <web-config.json> --owner-email <email>`,
   then `cd ~/<name> && bun install && bun run format && bun run lint && bun run test && bun run build`.
4. `bash $SKILL/scripts/github-setup.sh <name> private` (commits, creates the private repo, pushes `main` and `dev`).
5. CI key (last, give Google time): the user runs `cd ~/<name> && firebase init hosting:github` in a real terminal
   (full `<owner>/<name>`; build script `bun install --frozen-lockfile && bun run build`; do NOT overwrite the PR
   workflow; do NOT deploy on merge; no agent skills). Warn first: it usually errors once with
   `404 ... service account ... does not exist`; just run it again. After: `gh secret list`, `git checkout firebase.json`,
   `bash $SKILL/scripts/fix-workflows.sh <project-id>`.
6. First deploy: `bunx firebase-tools@latest deploy --only firestore,hosting --project <id>`, then a small commit
   on `dev`, a `dev` → `main` PR "chore: initial release", `gh pr checks --watch`, post the preview URL, merge on "ship it".
   Rules are deployed from the user's own login here, so the extra IAM roles of phone mode are not needed.

## One source for the steps

The Firebase/GitHub console steps live once, in `steps/steps.json` (shared with the website checklist at https://catchavibecode.web.app).
`reference/phone-mode.md` and `TUTORIAL.md` render them between `<!-- steps:begin console -->` markers: edit the JSON, then run
`node scripts/render-steps.mjs` (`--check` fails when a doc is stale; the test suite does this). `steps/fill.mjs` fills `{{projectId}}`-style
placeholders and derives names (project id, secret name, links); `steps/brief.mjs` defines the site brief.

## When things go wrong

`reference/troubleshooting.md` has every error we have met, with the fix. Log new surprises in
`reference/feedback.md` (what happened, the fix, whether the skill was updated).
