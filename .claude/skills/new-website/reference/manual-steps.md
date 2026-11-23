# Manual steps (the parts that need a human)

Walk the user through these one click at a time. Replace `<project-id>`.

## Firestore
Normally created by `firebase-setup.sh`. If it wasn't:
Console → https://console.firebase.google.com/project/<project-id>/firestore (menu: Databases & Storage → Firestore) → **Create database**
→ Standard edition → location `nam5` (US) → **Production mode** → Create. Then deploy rules:
`bunx firebase-tools@latest deploy --only firestore`.

## CI key (only if `firebase init hosting:github` can't be used)
1. https://console.firebase.google.com/project/<project-id>/settings/serviceaccounts/adminsdk → **Generate new private key** (downloads JSON).
2. Add it as a secret named `FIREBASE_SERVICE_ACCOUNT_<PROJECT_ID_UPPER_UNDERSCORES>`:
   `gh secret set FIREBASE_SERVICE_ACCOUNT_<...> < ~/Downloads/<key>.json`, then delete the file.
   For CI that also deploys rules (phone mode) the account needs **Service Usage Consumer** and **Firebase Rules Admin**
   (Cloud IAM page, see phone-mode.md step 6).

## Auth
1. https://console.firebase.google.com/project/<project-id>/authentication → **Get started**.
2. **Sign-in method** tab → **Google** → Enable → pick the support email → Save.
3. (Only if the app needs players without accounts) also enable **Anonymous**.
4. `Settings → Authorized domains` already includes `<project-id>.web.app`; add custom domains later.

## First admin (fallback only)
Normally automatic: the owner's verified Google email is in `ownerEmails()` in `firestore.rules`, and their first sign-in on the live
site creates `admins/{uid}`. Only if that is not set up:
1. Sign in on the live site once ("not an admin" is expected).
2. Console → Authentication → **Users** → copy that account's **User UID**.
3. Console → Firestore → **Start collection** → ID `admins` → Document ID = the UID → field `role` (string) = `admin` → Save.
4. Refresh: it now says admin.
To revoke an admin, delete their `admins/{uid}` doc (removing an email from `ownerEmails()` does not remove an existing admin).
