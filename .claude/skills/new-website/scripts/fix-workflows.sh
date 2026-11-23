#!/usr/bin/env bash
# After `firebase init hosting:github` (which may write npm-based workflows), restore the
# skill's bun-based workflows using the secret name that was actually created.
# Usage (inside the project dir): fix-workflows.sh <project-id>
set -euo pipefail
PID="$1"
HERE="$(cd "$(dirname "$0")" && pwd)"
FOUND=$(gh secret list | awk '{print $1}' | grep '^FIREBASE_SERVICE_ACCOUNT' | head -1 || true)
[ -z "$FOUND" ] && { echo "NO SECRET FOUND: the CI key step did not complete"; exit 1; }
echo "secret: $FOUND"
mkdir -p .github/workflows
for f in firebase-hosting-merge.yml firebase-hosting-pull-request.yml; do
  sed -e "s/__SECRET_NAME__/$FOUND/g" -e "s/__FIREBASE_PROJECT_ID__/$PID/g" \
    "$HERE/../templates/.github/workflows/$f" > ".github/workflows/$f"
done
if [ -f CLAUDE.md ]; then  # portable in-place edit (BSD and GNU sed differ on -i)
  sed "s/FIREBASE_SERVICE_ACCOUNT_[A-Z0-9_]*\` GitHub secret/$FOUND\` GitHub secret/" CLAUDE.md > CLAUDE.md.tmp && mv CLAUDE.md.tmp CLAUDE.md
fi
git status --short .github CLAUDE.md
