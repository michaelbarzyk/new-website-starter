#!/usr/bin/env bash
# Initialises git in the current dir, creates a PRIVATE GitHub repo, pushes main and dev.
# Usage (run inside the project dir): github-setup.sh <repo-name> [private|public]
set -euo pipefail
REPO="$1"; VIS="${2:-private}"
git init -q -b main 2>/dev/null || git init -q
git checkout -q -B main
git add -A
git commit -q -m "chore: scaffold project

Vue 3, TypeScript, Vite, Tailwind, Pinia, Firebase Hosting, Firestore and Auth,
with CI preview deploys and the dev/main PR workflow described in CLAUDE.md.

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
gh repo create "$REPO" "--$VIS" --source . --remote origin --push
git checkout -q -b dev
git push -q -u origin dev
OWNER=$(gh api user --jq .login)
echo "repo: https://github.com/$OWNER/$REPO"
