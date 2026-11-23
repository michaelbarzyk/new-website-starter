# __TITLE__

Stack: Vue 3 (Composition API, `<script setup lang="ts">`), TypeScript, Vite, Tailwind v4, Pinia,
Vitest, lucide-vue-next, Firebase (Hosting, Firestore, Auth). Package manager: Bun.
Always use bun, never npm or yarn. NOT React.

> **IMPORTANT:** After opening or updating a PR, post its Firebase preview URL in chat
> as soon as the preview deploy finishes. No exceptions.

## Workflow

Every user-facing change goes through two loops before it ships.

### Branches

- `main` is live. Every push to `main` deploys to production at https://__SITE_ID__.web.app
  (`firebase-hosting-merge.yml`).
- `dev` is the long-lived working branch. Feature PRs target `dev`.
- A standing `dev` → `main` PR is never closed; it updates as `dev` moves.
  `dev` is merged into `main` ONLY when the user explicitly says to ship.
- Ship with a merge commit (not squash) so `dev` and `main` share history. Merging closes the
  standing PR: fast-forward `dev` to `main`, and open a fresh `dev` → `main` PR when `dev` next moves.
- Feature branches: `feature/<short-description>` (or `fix/<short-description>`),
  always branched from the latest `dev`.

### Loop 1: feature testing

1. Branch off `dev`, commit, push, and open a PR into `dev` right away.
2. Wait for the preview deploy (`firebase-hosting-pull-request.yml` comments the URL on the PR),
   then post the URL in chat and put it at the top of the PR body.
3. The user tests the preview. Apply change requests on the same branch and repeat.

### Loop 2: code review

1. Once the user accepts the preview, run `/code-review` on the PR.
2. Fix the issues the user agrees with, push, and re-post the preview URL.
3. Finalize the PR description (format below), then merge into `dev` (squash).

### When a PR is not needed

Docs, CLAUDE.md, config and CI-only changes may be committed straight to `dev`.
Never push user-facing changes straight to `dev` or `main`. Never merge a feature PR
without both loops.

### Commits

- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`;
  `feat!:` for breaking changes. Subject ≤ 50 characters, imperative.
- Every commit has a body explaining why, not just what.
- After each push to a PR branch, post the new commit bodies as a PR comment
  so the PR thread tells the story.

### PR description format

```
Preview: <firebase preview URL>

## Summary
<what and why>

## How to test
<steps on the preview>

## ✅ What actually shipped (final branch state)
<filled in before merge: the end state, not the journey>

## 🧠 Retrospective: notes for a future AI agent
<gotchas, dead ends, decisions worth remembering>
```

### PR status reports

When asked for PR status, answer with a table:

| CI | PR | Date | Description |
| -- | -- | ---- | ----------- |
| ✅ | #12 | Nov 13, 2026, 3:05 PM | feat: admin sign-in |

Dates use 12-hour time with AM/PM.

## Commands

- `bun install`: install dependencies. Run it after ANY change to `package.json`
  dependencies (or use `bun add` / `bun remove`), and commit the updated `bun.lock`
  in the same commit. CI runs `bun install --frozen-lockfile`, so a stale lockfile fails the deploy.
- `bun run dev`: start the dev server (http://localhost:5173)
- `bun run test`: run Vitest (never plain `bun test`)
- `bun run type-check`: strict type check
- `bun run lint`: ESLint (bans type assertions, non-null `!`, and `any`)
- `bun run build`: production build into `dist/`
- `bunx firebase-tools@latest deploy --only firestore`: deploy rules and indexes

## Firebase

- Project id: `__FIREBASE_PROJECT_ID__`. Web config lives in `src/firebase.ts` (public by design;
  `firestore.rules` is the access control).
- CI deploys with the `__SECRET_NAME__` GitHub secret.
- Admins: a doc at `admins/{uid}` grants admin. Created by hand in the Firebase console only.
- Document every collection in the header of `firestore.rules` and keep it in sync.
  Rules default to deny; open access on purpose, per collection.
- Deploy rules after changing them: `bunx firebase-tools@latest deploy --only firestore`.

## Code rules

- No type assertions. Don't use `as Type`, `<Type>value`, or non-null `!`.
  Narrow types with type guards, `typeof`/`in` checks, optional chaining, and `??` instead.
  Use `satisfies` to check data shapes. `as const` is allowed.
- No `any`, `@ts-ignore`, or `@ts-expect-error`. Fix the type properly.
- Parse unknown data (localStorage, clipboard) with a type guard function before using it.
- Clean up every setInterval/setTimeout in `onUnmounted`.
- Always write complete files. Never use "// rest of code" placeholders.
- Shared types live in `src/types.ts`. App data lives in Firestore, never in `src/`.
- Do not store a Firebase `User` in reactive state (store a plain snapshot; see `stores/auth.ts`).
- Run `bun run type-check` before every commit, and `bun run test` (never plain `bun test`).
- Every piece of logic gets Vitest unit tests.
- Commit after each working step with a clear message.

## No assumptions

- Check the installed library's types/docs before using an API.
- If a requirement is unclear, ask one short question before building.
- If unsure about a fact, leave it out and flag it.

## Project notes

Add design decisions, palette, game/product rules and gotchas here as they are made.
