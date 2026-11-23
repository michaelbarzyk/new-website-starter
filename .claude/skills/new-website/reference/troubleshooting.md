# Troubleshooting (every failure met so far)

| Symptom | Cause | Fix |
| --- | --- | --- |
| Rules job: `403 Permission denied to get service firestore.googleapis.com` | Deploy key lacks **Service Usage Consumer** | Cloud IAM: add it to `firebase-adminsdk-…` (phone-mode step 6) |
| Rules job: `403 ... firebaserules.googleapis.com ... :test` | Deploy key lacks **Firebase Rules Admin** | Add it. Cloud Datastore roles are unrelated and not needed |
| Re-run right after adding a role fails again | IAM changes take 1-2 minutes | Wait, then re-run (Actions → the run → Re-run failed jobs) |
| Rules job: `The ... secret is missing or empty` | Secret name wrong or not added | Name must equal `FIREBASE_SERVICE_ACCOUNT_<PROJECT_ID_UPPER_UNDERSCORES>` exactly; paste the whole JSON |
| Site is live but nobody is admin / admin link missing | New site not deployed yet, or rules not deployed, or owner email mismatch | Check the merge run finished; the owner email in `ownerEmails()` must be the verified Google email, lower-case; hard-refresh, sign out and in |
| "unauthorized domain" on Google sign-in | Preview/custom address not trusted | Firebase → Authentication → Settings → Authorized domains → Add it. Previews (`--pr1-…web.app`) are not trusted by default, so test sign-in on the live address |
| Live address is `<id>-test00.web.app`, not the site name | Project id was never edited in the create wizard | Id can't change. Add a second Hosting site or a custom domain (explainers #2b) |
| Scaffold rewrote files in `.claude/` | Old scaffold with `--in-place` | Fixed (skips `.claude`, `.git`, `node_modules`); `git checkout -- .claude` if it happened |
| Lint: "Do not use any type assertions" | Template bans `as`/`!`/`any` | Use type guards or small mapper functions for Firestore data |
| Lint: "Missing type parameters on mock function" | `vi.fn()` needs types | `vi.fn<() => void>()` |
| Message sends fail with permission denied | Rules require exact fields (uid, name, email == token email, kind, outfitId, outfitTitle, price, body, createdAt, read=false) | Send exactly those; see `reference/recipes.md` |
| Outfits (or any list) missing from the page | `orderBy('field')` skips docs that lack that field | Make sure every doc has the field, or sort in the client |
| Page shows placeholder data when the database is down | Fallback hid the error | Show an error state instead of samples when a load fails |
| Anonymous sign-in question | Not needed | Keep OFF: browsing is already public; messages need Google sign-in so the owner can reply |
| CI fails at `bun install --frozen-lockfile` | Stale lockfile | `bun install`, commit `bun.lock` |
| No preview comment on a PR | Fork PR, or deploy key missing | Previews only run for same-repo PRs and need the secret |
| `firebase init hosting:github` 404 service account | Google propagation | Run it again (laptop mode) |
| Claude says repository could not be found | GitHub app lacks the repo | Reconnect GitHub in Claude; choose **All repositories** |
