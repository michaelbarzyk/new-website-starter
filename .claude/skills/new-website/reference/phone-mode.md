# Phone / cloud mode

For users with no laptop tooling: Claude runs in a cloud session (Claude app or claude.ai/code) with
no browser and no interactive prompts. Design: **Claude never holds Firebase credentials.** The user
creates the Firebase project in the console, pastes one service-account key into a GitHub secret,
and GitHub Actions does every deploy. Claude only needs the public web config.

## Order for a beginner
1. Discovery (`discovery.md`) and the explainers. 2. Create Firebase project + secret (below).
3. Scaffold with their mood palette, build the first draft, open the PR, share the preview.
4. Admin setup. Never make them wait through setup before they see anything: if you can,
scaffold and open the PR FIRST (the preview needs the secret, so ask for the secret right after the
first draft is pushed).

## Starting point

The user created their repo from the `new-website-starter` template and opened it in the Claude app
(Code tab). The skill is at `.claude/skills/new-website/` in that repo (`$SKILL`). Cloud sessions
cannot create repos, so the repo (private, named by the user) already exists. Project name = repo
name. Scaffold into the repo itself: `--in-place --dir .` (keep `.claude/`). Work on a branch
(cloud sessions push `claude/...` branches), then create `dev` from `main` after the first commit
lands on `main` via PR.

## What the user does on their phone (browser), in order
1. https://console.firebase.google.com → **Add project** → name it (this is the project id; note it).
   Skip Google Analytics. Accept terms if asked.
2. Build → **Firestore Database** → Create database → Standard → `nam5` → Production mode.
3. Build → **Authentication** → Get started → Sign-in method → Google → Enable → Save.
4. Project settings (gear) → **Your apps** → web icon `</>` → nickname → Register app. Copy the
   `firebaseConfig` values (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)
   and paste them to Claude. These are public by design; fine to paste in chat.
5. Project settings → **Service accounts** → **Generate new private key** → a JSON file downloads.
   Open it, copy ALL the text. **Never paste this into the chat.**
6. GitHub (github.com in the browser, "Desktop site" if the mobile view hides it) → the new repo →
   Settings → Secrets and variables → Actions → **New repository secret**:
   name `FIREBASE_SERVICE_ACCOUNT_<PROJECT_ID_UPPER_WITH_UNDERSCORES>`, value = the JSON text. Then delete the downloaded file.

## What Claude does
1. Writes the web config to a file and scaffolds with `--phone`:
   `node $SKILL/scripts/scaffold.mjs ... --phone` (adds `firebase-firestore-rules.yml`).
2. Creates/pushes the repo (GitHub connector or the session's git remote; if repo creation isn't
   possible, ask the user to create an empty private repo `<name>` in GitHub and give the URL).
3. After the secret exists: opens the `dev` → `main` PR; preview deploys run in CI.
4. After merge: the live deploy runs in CI. Rules deploy via the "Deploy Firestore rules" workflow
   (runs on push to main when rules change; for the very first deploy ask the user to open
   Actions → Deploy Firestore rules → Run workflow).
5. Console: first admin (same as laptop mode, Part 5 of TUTORIAL.md).

## Never
- Ask for, print, or store the service-account JSON anywhere but the GitHub secret.
- Use `firebase login` / `firebase init hosting:github` in this mode.
