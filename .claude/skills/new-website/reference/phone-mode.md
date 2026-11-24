# Phone / cloud mode

For a user with no laptop tooling. Claude runs in a cloud session (Claude app, Code tab) with no
browser and no interactive prompts. Design: **Claude never holds Firebase credentials.** The user
creates the Firebase project in the console, pastes one service-account key into a GitHub secret, and
GitHub Actions does every deploy. Claude needs only the public web config.

## Starting point

The user made their repo from the **`michaelbarzyk/new-website-starter` template** (a generated copy of this skill plus a starter `CLAUDE.md`, built from
`michaelbarzyk/catch-a-vibecode` with `scripts/build-starter.sh`; never edited by hand) and opened it in the Claude app. This skill is at
`.claude/skills/new-website/` in that repo (`$SKILL`). Cloud sessions cannot create repos,
so the (private) repo already exists, under any name (it need not match the project name). Scaffold into it with
`--in-place --dir .` (the script skips `.claude/`). Cloud sessions force a working branch name (e.g.
`claude/...`); that is the environment, not our convention (see SKILL.md for ours).

## Order (do not reorder; this is what removed rework in test run 1)

1. Discovery + explainers (`discovery.md`, `explainers.md` #1, #2, #2b).
2. **Console pass**, steps 1-6 below, one at a time. Scaffold as soon as you have the web config
   (after step 2) and build the first draft while the user does steps 3-6.
3. Open the first PR into `main`, post the preview, user reacts. (There is no `dev` yet; create it from
   `main` after the first merge.) Subscribe to the PR so CI results reach you.
4. "Ship it" → merge (merge commit). CI deploys rules, then the site. Check both runs.
5. Owner signs in on the live address → Admin link appears. Done.

## Console pass: what to say, step by step

Always end with: "Reply **done** when …". Never batch two steps in one message. The steps below are generated from `steps/steps.json`
(the single source shared with the website checklist; edit that file, then run `node scripts/render-steps.mjs`).

<!-- steps:begin console -->
**1. Create the Firebase project**
*Firebase hosts your site, database and sign-in, free at this size.*

- Open the [Firebase console](https://console.firebase.google.com) (Firebase's control panel) and tap **Add project**.
  - Link: [Firebase console](https://console.firebase.google.com)
- Give the project any name you like. Under it, Firebase shows a **Project ID**. If it adds random letters, or says the name is taken, tap the pencil and edit it until you like it.
- The Project ID becomes your free web address, **<project-id>.web.app**, and can **never be changed**. Pick one you'll be happy with.
- Turn **Gemini in Firebase OFF** and **Google Analytics OFF** (optional extras you don't need). Accept the terms. If it offers billing or an upgrade, skip it; the free plan is enough.
- ✅ Worked when: You see the new project's overview page.
- ⚠️ That Project ID is taken → Firebase tells you straight away and suggests another. Add a short suffix (like `-1`) or try a different name until it accepts one.
- ⚠️ The id has random letters added → Tap the pencil and edit it before you tap Create; it can't be changed later.

**2. Register the web app and copy its settings**
*These six values are your site's address-book entry for Firebase.*

- Stay in your new project. On **Project overview**, tap **Add app** (under the project name) and choose the web icon `</>`.
- Nickname: your site's name. Leave **Firebase Hosting unchecked**. Tap **Register app**.
- It asks **npm or script tag**: choose **npm** (a way of adding ready-made code to a site; Claude uses it later, so ignore the install commands).
- Copy the whole **firebaseConfig** block (the code with apiKey, authDomain, projectId and the rest) and paste it into the box below. These settings are public by design, so this is safe to share. Your Project ID, and so your web address, is read from it, so there is nothing else to type.
- ✅ Worked when: The box below says all six settings were found.

**3. Create the database**

- Open [Firestore](https://console.firebase.google.com/project/<project-id>/firestore) (menu **Databases & Storage → Firestore**; older console: Build → Firestore Database) and tap **Create database**.
  - Link: [Firestore page](https://console.firebase.google.com/project/<project-id>/firestore)
- Choose **Standard**, location **nam5 (United States)** (where your data is stored), and **Production mode** (locked until your rules open it). Tap **Create**.
- ✅ Worked when: You see an empty Firestore with a **Data** tab.

**4. Turn on Google sign-in**
*Sign-in is how you, the owner, log in to edit your site, and how visitors can send you messages later. Browsing stays public: nobody has to sign in to look around.*

- Open [Authentication](https://console.firebase.google.com/project/<project-id>/authentication/providers) (menu **Security → Authentication**; older console: Build → Authentication) and tap **Get started**.
  - Link: [Authentication page](https://console.firebase.google.com/project/<project-id>/authentication/providers)
- Open **Sign-in method**, tap **Google**, and switch **Enable** on.
- For the **public-facing name**, type your site's name (it shows on the Google sign-in popup). For the **support email** (the address people can write to about sign-in), pick your own email. Tap **Save**.
- Leave **Anonymous** OFF (it lets people in without any account).
- ✅ Worked when: Google shows as **Enabled** in the Sign-in method list.

**5. Create the deploy key**
*This service account lets GitHub publish your site and rules for you. The key is private: never paste it into the Claude chat or any website except GitHub's secret form.*

- Open [Service accounts](https://console.firebase.google.com/project/<project-id>/settings/serviceaccounts/adminsdk) (**Project settings** → **Service accounts**). Tap **Generate new private key**, then **Generate key**. A small `.json` file downloads to your phone.
  - Link: [Service accounts page](https://console.firebase.google.com/project/<project-id>/settings/serviceaccounts/adminsdk)
- Open the [new secret page](https://github.com/<github-username>/<repo-name>/settings/secrets/actions/new). If it shows a list, pick your site's repo, then **Settings → Secrets and variables → Actions → New repository secret** (tap 'Desktop site' if the phone view hides Settings).
  - Link: [New secret page](https://github.com/<github-username>/<repo-name>/settings/secrets/actions/new)
- Copy the secret's name with the button below, then paste it into the **Name** box. It must match exactly.
  - Value: Secret name = `<SECRET_NAME>`
- Open the key file you downloaded, from your browser's downloads list (go back to your browser first if you left it).
  - **Safari (iPhone):** tap the download icon `⬇` (a circle with a down arrow) beside the address bar, then **Downloads**, then the file.
  - **Chrome (iPhone):** tap the three dots `•••` at the bottom right, swipe along the menu icons to **Downloads**, then tap the file.
  - **Chrome (Android):** tap the three dots `⋮` at the top right, then **Downloads**, then the file.
  - **Can't find it?** Open the **Files** app (**My Files** on Samsung) and look in **Downloads**. On iPhone, Chrome's files are under **On My iPhone → Chrome**.
- Press and hold the text, tap **Select All**, then **Copy**.
- Go back to the GitHub page. Paste the key into the **Value** box and tap **Add secret**.
- Delete the downloaded file from your phone (in the downloads list or the Files app).
- ✅ Worked when: The secret <SECRET_NAME> shows in the repo's Actions secrets list, and the downloaded file is deleted.
- ⚠️ Can't open or copy the file → Try the Files app route in the grey notes, or do this step on a computer.
- ⚠️ The deploy later says the secret is missing or empty → The name must match exactly and the value must be the whole JSON text.

**6. Give the key two permissions**
*The key starts with few permissions. These two let it check that the database is on and publish your rules.*

- Open the [Google Cloud IAM page](https://console.cloud.google.com/iam-admin/iam?project=<project-id>) (where permissions are set) and sign in with the same Google account. Accept any welcome screen.
  - Link: [Google Cloud IAM page](https://console.cloud.google.com/iam-admin/iam?project=<project-id>)
- Tap the pencil on the row **firebase-adminsdk-…**, then **Add another role** (a role is a set of permissions) and add **Service Usage Consumer**.
- Tap **Add another role** again and add **Firebase Rules Admin** (type `rules` in the role box; if it's missing, **Firebase Admin** also works but is broader). Tap **Save**.
- Keep its existing roles. Leave the **Owner (Legacy)** row (that's you) alone. Don't add any Cloud Datastore roles.
- Wait 1 to 2 minutes: Google applies these slowly.
- ✅ Worked when: The firebase-adminsdk row lists both new roles alongside its existing ones.
- ⚠️ Deploy fails with `Permission denied to get service firestore.googleapis.com` → Service Usage Consumer is missing.
- ⚠️ Deploy fails with `firebaserules.googleapis.com ... :test` → Firebase Rules Admin is missing.
- ⚠️ It still fails right after you added the role → Wait 2 minutes and re-run the failed job.
<!-- steps:end console -->

### Notes for Claude on those steps (not for the user)

- **Project id:** don't ask for it. It is the `projectId` inside the config pasted in step 2; read it from there and use it for `--project-id`.
- **Web config:** say what it is in one line: "your site's address-book entry for Firebase. Public by design; safe to paste here."
- **Deploy key:** if asked "can you add it for me?": no. My tools cannot create GitHub secrets, and the key must not pass through chat. The phone copy
  routes are untested across phones, so ask which phone and offer fallbacks (a computer is the last resort).
- **IAM:** if a deploy still fails after the roles are added and 2 minutes have passed, ask for a screenshot of the firebase-adminsdk row. The page
  is `https://console.cloud.google.com/iam-admin/iam?project=<project-id>`.
- **Anonymous sign-in:** explain only if asked: browsing is public already; messages need Google sign-in so the owner can reply.

## What Claude does around those steps

- After step 2: save the config EXACTLY as the user pasted it (the JavaScript object is fine; no conversion needed) to a scratch file and scaffold. The script checks
  everything first (the six Firebase values, that `projectId` matches `--project-id`, names, secret name, owner email) and, if anything is wrong, prints what and
  changes NOTHING, so fix the input and run it again (`--phone` adds the phone workflows: the merge workflow deploys
  **rules first, then hosting**, so a bad key fails before anything publishes; plus a manual "Deploy Firestore rules" workflow):
  `node $SKILL/scripts/scaffold.mjs --in-place --dir . --name <repo> --title "<Title>" --project-id <id> --site-id <id> --secret FIREBASE_SERVICE_ACCOUNT_<ID> --config <cfg.json> --owner-email <email> --phone`
  Then install, format, lint, test, build. All must pass. Commit with a body; push the session branch.
- When the secret exists: open the PR into `main`, subscribe to it, post the preview URL when CI comments it. Previews can't test Google
  sign-in (preview addresses aren't authorized domains) and don't have the new rules yet: say so.
- On "ship it": merge (merge commit). Check the "Deploy to Firebase Hosting on merge" run. If rules fail with 403, see `troubleshooting.md`
  (re-run once after IAM propagates; Actions → run → Re-run failed jobs, or `rerun_failed_jobs`).
- The PR closing ends your subscription, so tell the user to say **check** and poll the run yourself.
- After merge: create `dev` from `main` (`git push origin main:dev`) for future work.

## Never

- Ask for, print or store the service-account JSON anywhere but the GitHub secret.
- Use `firebase login` or `firebase init hosting:github` in this mode.
- Put someone else's email in `ownerEmails()`; it is the user's own verified Google email, lower-case.
