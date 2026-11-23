# Manual steps (the parts that need a human)

Walk the user through these one click at a time. Replace `<project-id>`.

## Firestore
Normally created by `firebase-setup.sh`. If it wasn't:
Console → https://console.firebase.google.com/project/<project-id>/firestore → **Create database**
→ Standard edition → location `nam5` (US) → **Production mode** → Create. Then deploy rules:
`bunx firebase-tools@latest deploy --only firestore`.

## CI key (only if `firebase init hosting:github` can't be used)
1. https://console.firebase.google.com/project/<project-id>/settings/serviceaccounts/adminsdk → **Generate new private key** (downloads JSON).
2. Add it as a secret named `FIREBASE_SERVICE_ACCOUNT_<PROJECT_ID_UPPER_UNDERSCORES>`:
   `gh secret set FIREBASE_SERVICE_ACCOUNT_<...> < ~/Downloads/<key>.json`, then delete the file.
   The service account also needs the *Firebase Hosting Admin* and *Cloud Run Viewer* / *API Keys Viewer* roles
   (IAM page) if deploys complain about permissions.

## Auth
1. https://console.firebase.google.com/project/<project-id>/authentication → **Get started**.
2. **Sign-in method** tab → **Google** → Enable → pick the support email → Save.
3. (Only if the app needs players without accounts) also enable **Anonymous**.
4. `Settings → Authorized domains` already includes `<project-id>.web.app`; add custom domains later.

## First admin
1. Open the live site, click **Admin sign-in**, sign in with the Google account that should be admin.
   (It will say "not an admin"; that's expected.)
2. Console → Authentication → **Users** → copy that account's **User UID**.
3. Console → Firestore Database → **Start collection** → ID `admins` → Document ID = the UID
   → add field `role` (string) = `admin` → Save.
4. Refresh the site: it now says "admin".
Admin docs are created only here, never from the app (the rules forbid it).
