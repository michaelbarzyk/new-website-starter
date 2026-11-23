#!/usr/bin/env bash
# Checks the tools and logins the new-website skill needs. Prints one line per check:
#   OK <what> | MISSING <what> -> <how to fix>
# Exit code is 0 only when everything is OK.
fail=0
# Install hints differ by OS. Windows must run inside WSL (Ubuntu), where this is Linux.
if [ "$(uname)" = "Darwin" ]; then
  H_NODE="brew install node"; H_BUN="brew install oven-sh/bun/bun"; H_GH="brew install gh"
  H_GIT="xcode-select --install"; H_FB="npm install -g firebase-tools"
else
  case "$(uname -r)" in *icrosoft*) echo "NOTE running inside WSL; good";; esac
  H_NODE="curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash - && sudo apt install -y nodejs"
  H_BUN="curl -fsSL https://bun.sh/install | bash   (then restart the terminal)"
  H_GH="see https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
  H_GIT="sudo apt install -y git"; H_FB="sudo npm install -g firebase-tools"
fi
ok()   { echo "OK      $1"; }
miss() { echo "MISSING $1 -> $2"; fail=1; }

command -v node >/dev/null && ok "node $(node -v)" || miss node "$H_NODE"
command -v bun  >/dev/null && ok "bun $(bun -v)"   || miss bun  "$H_BUN"
command -v git  >/dev/null && ok "git"             || miss git  "$H_GIT"
command -v gh   >/dev/null && ok "gh"              || miss gh   "$H_GH"
command -v firebase >/dev/null && ok "firebase-tools $(firebase --version)" \
  || miss firebase-tools "$H_FB"

if command -v gh >/dev/null; then
  if gh auth status >/dev/null 2>&1; then
    ok "gh logged in as $(gh api user --jq .login 2>/dev/null)"
    scopes=$(gh auth status 2>&1 | grep -i 'scopes' | head -1)
    for s in repo workflow; do
      echo "$scopes" | grep -q "$s" || miss "gh scope '$s'" "gh auth refresh -s repo,workflow"
    done
  else
    miss "gh login" "gh auth login   (choose GitHub.com, HTTPS, browser)"
  fi
fi

if command -v firebase >/dev/null; then
  if firebase login:list 2>&1 | grep -q "Logged in as"; then
    ok "$(firebase login:list 2>&1 | grep 'Logged in as' | head -1)"
  else
    miss "firebase login" "firebase login   (opens a browser)"
  fi
fi
exit $fail
