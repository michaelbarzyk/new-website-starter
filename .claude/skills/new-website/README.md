# new-website: a Claude Code skill

Say "I want to start a new website" and Claude sets up:

- Vue 3 + TypeScript + Vite + Tailwind v4 + Pinia + Vitest, strict lint (no `as`, no `any`), Bun
- A Firebase project (Hosting, Firestore with locked-down rules, Google sign-in); the owner becomes admin automatically on first sign-in
- A private GitHub repo with `main` (live) / `dev` (working) branches
- GitHub Actions: lint + tests on every PR with a preview URL, and on merge to `main` rules then site deploy (phone mode) or site deploy (laptop mode)
- A `CLAUDE.md` with the PR workflow, commit rules and code rules, ready for vibe coding

Claude does everything it can itself; you only do the browser-consent and console-toggle steps.

New here? Follow [TUTORIAL.md](TUTORIAL.md).

## Install

The source of truth is the `michaelbarzyk/catch-a-vibecode` repo (this folder is `.claude/skills/new-website/` inside it):

```sh
gh repo clone michaelbarzyk/catch-a-vibecode ~/catch-a-vibecode
mkdir -p ~/.claude/skills && ln -s ~/catch-a-vibecode/.claude/skills/new-website ~/.claude/skills/new-website
```

Needs: node, bun, git, gh (logged in), firebase-tools (logged in). The skill checks and guides you.

## Use

In Claude Code: "start a new project called <name>" (or `/new-website`).

## Layout

- `SKILL.md` the playbook Claude follows (one flow, two modes)
- `reference/phone-mode.md` the tap-by-tap Firebase/GitHub script for phone sessions
- `reference/discovery.md`, `explainers.md` the guided questions and plain-words explanations
- `reference/troubleshooting.md` every error met so far, with fixes; `recipes.md` verified patterns; `feedback.md` run log
- `reference/manual-steps.md` the human-only steps for laptop mode
- `scripts/` preflight, scaffold (`--owner-email`, `--phone`, `--in-place`), Firebase and GitHub setup
- `templates/`, `templates-phone/` the project files (placeholders like `__TITLE__`) and the phone-mode workflows
