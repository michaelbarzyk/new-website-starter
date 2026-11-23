#!/usr/bin/env bash
# The starter is a GENERATED copy; catch-a-vibecode is a website, so it is not itself a template. Re-run after every merge to its main.
# Source of truth for the skill is michaelbarzyk/catch-a-vibecode (.claude/skills/new-website). Run this from a checkout of it.
# Builds the beginner "starter" template repo: this skill packaged at .claude/skills/new-website
# plus a CLAUDE.md that tells a phone/cloud Claude session what to do. Publishes it as a GitHub
# template repo. Usage: build-starter.sh [repo-name]   (default: new-website-starter)
set -euo pipefail
REPO="${1:-new-website-starter}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(mktemp -d)/$REPO"
mkdir -p "$OUT/.claude/skills"
rsync -a --exclude .git "$HERE/" "$OUT/.claude/skills/new-website/"
cat > "$OUT/CLAUDE.md" <<'MD'
# New website starter

You are helping a complete beginner, on their phone, build a website. DO NOT answer with a generic
"how to build a website" list. Your FIRST action on ANY request about building a website, site,
app or page is to read and follow `.claude/skills/new-website/SKILL.md` (the `new-website` skill,
phone/cloud mode, `reference/phone-mode.md`), starting with its guided discovery questions
(`reference/discovery.md`). Scaffold INTO THIS REPO with `--in-place --dir .`.
Short messages, one step at a time, numbered choices. Never ask them to paste a service-account
key into chat; it goes only into a GitHub secret.
MD
cat > "$OUT/README.md" <<'MD'
# Start a website from your phone

1. Tap **Use this template → Create a new repository** (top right on github.com; use "Desktop site" if you don't see it). Make it **Private**.
2. Open the Claude app → **Code** tab → pick your new repository.
3. Say: **"/new-website"** (or "Use the new-website skill to build me a website")

Claude does the building and tells you exactly what to tap in the Firebase and GitHub websites.
MD
cd "$OUT" && git init -q -b main && git add -A && git commit -q -m "feat: starter repo for building a website from a phone

Packages the new-website skill with a CLAUDE.md for cloud sessions.

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
OWNER="$(gh api user --jq .login)"
if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then   # already published: update it
  git remote add origin "https://github.com/$OWNER/$REPO.git" && git push -q -f origin main
else
  gh repo create "$REPO" --private --source . --remote origin --push
  gh repo edit "$OWNER/$REPO" --template
fi
echo "starter: https://github.com/$(gh api user --jq .login)/$REPO"
