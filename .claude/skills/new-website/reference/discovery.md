# Discovery: from "I want a website" to a first draft

Goal: in about 8 short phone messages, learn enough to build a first draft that already looks like
what the person imagined. Never ask open-ended questions when a numbered list will do. If the
client supports multiple-choice question UI (AskUserQuestion), use it; otherwise show a numbered
list and say "Reply with a number (or two, like 1 and 3)". Max 4 options per message on a phone
when using the tool; otherwise up to 8 in a list. One topic per message. Always allow "something else".

Keep every message short: a line of context, the list, how to answer.

## Round 1: what is it? (pick one)
1. A page for me or my work (portfolio, résumé, creator page)
2. A small business (shop, studio, restaurant, services)
3. A blog or a place to share writing / photos
4. An event, club, team or community
5. An online shop (selling things)
6. A game or something interactive
7. Something else (tell me in a sentence)

Then ONE fill-in-the-blank, offered with an example so they can copy the shape:
"My site is for ______ (who) to ______ (do what). Example: *dog owners in Austin to book walks.*"
Also get the name of the site/business (suggest a few if they have none).

## Round 2: mood board ("pick the ones you like", like choosing shows)
Show the moods as a numbered list with an emoji and a one-line picture in words; ask for **two or three**:

1. 🌿 **Calm & natural**: soft greens, lots of space, gentle serif headings
2. ⚡ **Bold & modern**: big type, strong contrast, one loud accent colour
3. 🧁 **Warm & friendly**: rounded shapes, peachy warm tones, welcoming
4. 🖤 **Minimal & elegant**: black, white, thin lines, fashion-magazine feel
5. 🎮 **Playful & retro**: pixel/arcade vibes, bright colours, fun
6. 🌊 **Fresh & coastal**: blues, airy, clean, summery
7. 🏛️ **Classic & trustworthy**: navy, gold, serif, professional
8. 🌙 **Dark & techy**: dark background, glowing accent, sleek

Map the first pick to the main palette and the second to accents/details (see table below).
Then ask: "Any website you love the look of? Paste a link, or skip."

## Round 3: what should it do? (pick all that apply)
1. Show info and photos (the basics)
2. Let people contact me (a contact form)
3. Let people sign in (accounts)
4. Let me, the owner, edit things myself (admin page)
5. A blog / news / updates section
6. Take bookings or orders (note: payments are a later step; we start with a request form)
7. Not sure yet (start simple)

Do not build what they don't pick. Admin (4) is always set up anyway via Part 5, but only wire
admin-only editing screens if they picked 4 or 5.

## Round 4: content
"Do you have a logo, photos and text ready?" 1. Yes, I'll share them 2. Some 3. No: make placeholders I can swap later.
(Phone note: photos can be uploaded to the Claude chat; text can be pasted. Placeholders are fine for a first draft.)

## Round 5: confirm
Echo back in 4 lines: purpose + audience, name, mood (two words), features. Ask "Sound right? Reply 1 to build it, 2 to change something."

## Mood → design mapping
Set the palette in `src/assets/main.css` (`--color-brand`, `--color-ink`, `--color-paper`, add `--color-accent`)
and the fonts with `bun add @fontsource/<font>` imported in `src/main.ts` (use `--font-heading`/`--font-body`).

| Mood | brand | ink | paper | accent | heading font | body font |
| --- | --- | --- | --- | --- | --- | --- |
| Calm & natural | #3f6b4f | #1f2a22 | #f6f4ee | #c9a66b | fraunces | inter |
| Bold & modern | #111111 | #111111 | #ffffff | #ff4d2e | space-grotesk | inter |
| Warm & friendly | #e0734a | #3a2a24 | #fff6ee | #f2b84b | nunito | nunito |
| Minimal & elegant | #111111 | #1a1a1a | #fafafa | #9a8f7a | playfair-display | inter |
| Playful & retro | #6d28d9 | #1e1b4b | #fef9c3 | #f43f5e | press-start-2p (headings only) | inter |
| Fresh & coastal | #0e7490 | #0c2b36 | #f0fbff | #f59e0b | poppins | inter |
| Classic & trustworthy | #1e3a8a | #101a33 | #f8f7f3 | #b8860b | lora | inter |
| Dark & techy | #22d3ee | #e2e8f0 | #0b1020 | #a78bfa | space-grotesk | inter |

With two moods, blend: first = brand/paper/fonts, second = accent and decorative details (shapes, borders).

## First draft
Build a real, complete homepage for THEIR site (their name, their words, their sections from
Round 3, placeholders where needed), mobile-first, with the palette and fonts above. Run the
checks, open a PR into `dev`, and give them the preview link. Then the "how edits work" explainer
(reference/explainers.md, point 3) and ask: "What would you change? Reply with anything, like
'make the heading bigger' or 'add a menu page'."
