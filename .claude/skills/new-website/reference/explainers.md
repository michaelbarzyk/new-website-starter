# Explainers: say these at the right moment, in this size

Plain words, 2-4 short sentences each, then a question or next step. Never dump them all at once.
Use each only once, at its trigger, and offer "Want more detail? Reply 'explain'" instead of more text.

## 1. After discovery, before any setup ("what we're about to do")
"Here's how this works. I'll build your site and keep it in a GitHub repo (your project's folder
online). Firebase hosts it so it gets a real web address. Every change I make first appears at a
**preview link** only you see; when you like it, you say 'ship it' and it goes live. Setup takes
about 20 minutes and you'll do a few taps in two websites; I'll tell you exactly which."

## 2. Before the Firebase/GitHub taps ("why these accounts")
"GitHub stores your site's files and history, so any change can be undone. Firebase (Google's)
hosts the site, its database and sign-in, free at this size. You make the project once; after
that I handle everything."

## 3. After the first preview ("how editing works")
"That link is a preview, only for you. To change anything, just tell me in plain words ('make the
heading bigger', 'add a menu page', 'use a warmer colour'). I'll update the preview in a minute.
Nothing is live until you say 'ship it', so you can't break your real site while experimenting."

## 4. Before admin setup ("what admin means")
"Right now anyone can look at your site, but only you should be able to change things from inside
it. Admin is you proving who you are with Google sign-in, then being added to a short 'allowed to
edit' list. It's two taps in Firebase."

## 5. When they ask about tech / "what is it built with"
Short answer first: "Your site is built with Vue (the building blocks), Tailwind (styling) and
Firebase (hosting, database, sign-in). It's one set of tools I know will work together with this
setup, so I use it for every site." Then offer the table below only if they want more.

| If your site is… | Good fit | Why |
| --- | --- | --- |
| A few pages, mostly text and photos | Plain HTML/CSS (or our Vue setup, which handles this too) | Simplest, fastest, free |
| Needs sign-in, forms saved somewhere, an owner who edits content | **Vue + Firebase (what we use)** | Database and accounts are included |
| A big blog or docs site | Astro / a static-site generator | Great for lots of writing |
| An online shop with payments | Shopify or Stripe-based tools; we add payments in a later step | Payments need extra safety checks |
| A mobile app people install | React Native / Flutter (a different project) | Not a website |
Be honest: this skill always uses Vue + Firebase. If their need clearly doesn't fit (a mobile app,
a full store), say so and suggest a better route instead of forcing it.

## 6. After admin works ("you're set")
"You're the admin of a live website. To change it: tell me what you want, check the preview link,
say 'ship it'. Your site's address is <url>. Anything else you want to add?"
