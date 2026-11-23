# Recipes: patterns verified in real builds

Reusable patterns from Vibesew (a Pinterest-style portfolio with Google sign-in, messages and admin editing). Rules below were
checked in the Firestore emulator (27 cases). Copy the idea, not the product details.

## Public content, admin-only writes (e.g. `outfits`)
```
match /outfits/{id} {
  allow read: if true;
  allow write: if isAdmin();
}
```
- Store: load with `getDocs(query(collection, orderBy('order')))`; map each doc through a small `toOutfit(id, data)` function
  (no `as`). Docs lacking the `orderBy` field are silently skipped, so always write that field.
- If a load fails, show an error; never fall back to fake sample data (visitors could act on it). Samples only when the query
  succeeded and was empty (a brand-new site).
- Admin UI is gated by `auth.isAdmin`; the rules, not the UI, are the real protection.

## Signed-in visitors send messages the owner can read (`messages`)
```
match /messages/{id} {
  allow create: if isAuthenticated()
    && request.resource.data.uid == request.auth.uid
    && request.resource.data.kind in ['message', 'request', 'offer']
    && request.resource.data.body is string && request.resource.data.body.size() > 0 && request.resource.data.body.size() <= 2000
    && request.resource.data.read == false
    && request.resource.data.keys().hasOnly(['uid','name','email','kind','outfitId','outfitTitle','price','body','createdAt','read'])
    && request.resource.data.createdAt is number
    && request.resource.data.email == request.auth.token.email
    && request.resource.data.name is string && request.resource.data.name.size() <= 80
    && request.resource.data.outfitId is string && request.resource.data.outfitId.size() <= 100
    && request.resource.data.outfitTitle is string && request.resource.data.outfitTitle.size() <= 200
    && (request.resource.data.price == null || (request.resource.data.price is number && request.resource.data.price > 0));
  allow read: if isAuthenticated() && (resource.data.uid == request.auth.uid || isAdmin());
  allow update, delete: if isAdmin();
}
```
Why each line: `hasOnly` blocks extra fields; `createdAt` is required because the admin inbox sorts by it (docs without it vanish);
`email == token.email` stops forged sender addresses (the admin's reply link uses it); sizes cap spam. Escape/validate any `mailto:` data.

## Owner becomes admin on first sign-in
Rules (`admins/{uid}`): `allow create` only if `request.auth.uid == uid`, `email_verified == true` and `token.email in ownerEmails()`;
no update/delete. Auth store: after sign-in `getDoc(admins/uid)`; if missing, `setDoc(admins/uid, {role:'admin'})` in the background
(non-blocking, so the page doesn't wait); if that is refused, re-read the doc (another tab may have claimed it) and only show an error for
non-`permission-denied` failures. Revoke by deleting the doc. Tests: owner claims, non-owner refused, race, signed out (see template `auth.spec.ts`).

## Testing rules
Needs Java. `bunx firebase-tools@15 emulators:exec --only firestore --project demo-rules "bun rules.test.mjs"` with
`@firebase/rules-unit-testing` (`initializeTestEnvironment`, `assertSucceeds`, `assertFails`). Cover: allowed path, wrong user, signed out,
unverified email, extra fields, missing fields, oversize values.
