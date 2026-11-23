# new-website: a Claude Code skill

Say "I want to start a new website" and Claude sets up:

- Vue 3 + TypeScript + Vite + Tailwind v4 + Pinia + Vitest, strict lint (no `as`, no `any`), Bun
- A Firebase project (Hosting, Firestore with locked-down rules, Google sign-in for admins)
- A private GitHub repo with `main` (live) / `dev` (working) branches
- GitHub Actions: a preview URL on every PR, auto-deploy on merge to `main`
- A `CLAUDE.md` with the PR workflow, commit rules and code rules, ready for vibe coding

Claude does everything it can itself; you only do the browser-consent and console-toggle steps.

New here? Follow [TUTORIAL.md](TUTORIAL.md).

## Install

```sh
git clone <this repo> ~/.claude/skills/new-website
```

Needs: node, bun, git, gh (logged in), firebase-tools (logged in). The skill checks and guides you.

## Use

In Claude Code: "start a new project called <name>" (or `/new-website`).

## Layout

- `SKILL.md` the playbook Claude follows
- `scripts/` preflight, scaffold, Firebase and GitHub setup
- `templates/` the project files (placeholders like `__TITLE__`)
- `reference/manual-steps.md` the human-only steps
