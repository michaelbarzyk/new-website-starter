# Feedback log (real test runs)

Add a new run section after each real use. Mark items **fixed** (and where) or **open**.

## Run 1: phone, cloud session, first-time user (portfolio site "Vibesew")

Outcome: live site, Google sign-in, owner auto-admin, CI previews, rules deploy, all verified by the user. Cost: many
back-and-forth steps; most were order-of-operations and missing-detail problems, all fixed in the refactor below.

### Fixed in the refactor
- **Order of operations.** We scaffolded with placeholder Firebase settings, then swapped in real ones and renamed ids. Now: one
  Firebase console pass first (project → web app → database → sign-in → key and GitHub secret → IAM), scaffold with the REAL config right after
  step 2, and build the first draft while the user does the rest. (SKILL.md flow; phone-mode.md)
- **Web address.** The project id became the live URL (`vibesew-test00.web.app`) because the id was never edited in the create wizard.
  Now: edit the id under the name before Create; explainer #2b; discovery Round 3b. (Open: automate "add another Hosting site".)
- **Create-project wizard questions** (Gemini, Analytics, billing) answered up front.
- **Console menu names changed** (Databases & Storage → Firestore; Security → Authentication; "Add app" on Project overview); both old and new
  names are documented. Auth asks for a **public-facing name** and **support email**; web app registration asks **npm or script tag** (npm).
- **Phone key handling.** Where the JSON lands, how to open and copy it, what the "Admin SDK snippet" is (ignore), why Claude can't add the secret itself.
- **IAM roles.** The rules deploy failed 403 twice before working. Needed exactly **Service Usage Consumer** + **Firebase Rules Admin** on the
  `firebase-adminsdk` account (Datastore roles are not needed). IAM takes 1-2 minutes; an immediate re-run fails again. Now a numbered step before
  the first merge, with the exact error → role map in troubleshooting.md.
- **CI order and safety.** Phone merge workflow now runs lint + tests + build, then deploys rules, then hosting (one job, fails fast, checks the
  secret exists, pinned `bunx firebase-tools@15`, `permissions: contents: read`). PR workflow runs lint + tests too.
- **Admin bootstrap.** Replaced the manual console steps with an owner-email allowlist in rules plus a self-claim in the auth store
  (`--owner-email`, validated/lower-cased). Race-safe, non-blocking, with tests; verified in the emulator.
- **Scaffold bugs.** `--in-place` rewrote tokens inside `.claude/` and corrupted the skill itself (now skips `.claude`, `.git`, `node_modules`);
  oxlint linted `.claude/**` (now ignored); scaffold warns when no owner email is given.
- **Code review findings** (messages rules too loose, admin race, blocking claim, sample data masking errors) → rules hardened, patterns in recipes.md.
- **Branch naming.** `<type>/<issue#>-<description>`, never `claude/` (cloud sessions may still force that name for their own branch).
- **Lint gotchas** for first drafts (no `as`; `vi.fn<...>()` type params) documented in the template CLAUDE.md.
- **Skill inside a project polluted its test run.** A project that carries `.claude/skills/new-website/` ran the skill's own template tests in its Vitest
  (8 tests instead of 1). Template `vitest.config.ts` now excludes `.claude/**` (lint already ignored it).
- Anonymous sign-in question answered (keep off) in the phone guide and troubleshooting.

- **Scaffold left a half-built repo on bad input** (it copied files before reading the config). It now checks every input first, reports all problems together, and changes
  nothing on failure; it also accepts the config exactly as Firebase shows it (JavaScript object) and requires all six values and a matching project id. (`scripts/scaffold.mjs`, tested.)

- **The starter fell behind** (it still had the Nov 22 skill). An automatic sync (workflow + token) was built, then removed in favour of a manual hand-off that
  needs no long-lived token: after any change to the skill folder merges, Claude opens a pull request that copies the folder into the starter
  (`docs/starter-sync.md`, and a rule in the repo's `CLAUDE.md`).

### Open
- Automate the nicer web address (add a Hosting site, set `site` in firebase.json, `target` in workflows) and offer custom domains.
- Avoid copy-pasting the key on a phone entirely (needs research; a computer-side `gh secret set` is not phone-friendly).
- Previews can't test Google sign-in (preview hostnames aren't authorized domains). Consider adding the preview wildcard, or a clear note (done: note).
- Polish items from the review not yet in the template: delete confirmation and error handling in admin lists, resetting "Sent!" in forms,
  URL validation and blank-row filtering in editors.
- Real-device checks of the Files/Notes copy routes on both iPhone and Android.
- Consider an optional early in-chat mock-up of the design while the user does the console pass.
