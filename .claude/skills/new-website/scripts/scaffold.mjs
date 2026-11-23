#!/usr/bin/env node
// Copies ../templates into a new directory, replacing __TOKENS__.
// Usage: node scaffold.mjs --dir <path> --name <kebab-name> --title "<Display Title>"
//          --project-id <firebase-project-id> --site-id <hosting-site-id>
//          --secret <GITHUB_SECRET_NAME> --config <path-to-firebase-web-config.json>
//          [--owner-email <owner's Google email>]  (auto-admin on first sign-in)
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, all) => {
    if (cur.startsWith('--') && cur !== '--phone' && cur !== '--in-place') acc.push([cur.slice(2), all[i + 1]])
    return acc
  }, []),
)
for (const k of ['dir', 'name', 'title', 'project-id', 'site-id', 'secret', 'config']) {
  if (!args[k]) {
    console.error(`missing --${k}`)
    process.exit(2)
  }
}

// Google's token email is lower-case; the rules compare exactly. Normalise, then reject anything that
// could break the rules file (quotes, backslashes, spaces).
if (args['owner-email'] !== undefined) {
  args['owner-email'] = args['owner-email'].trim().toLowerCase()
  if (!/^[^\s@'"\\]+@[^\s@'"\\]+\.[^\s@'"\\]+$/.test(args['owner-email'])) {
    console.error(`--owner-email is not a valid email: ${args['owner-email']}`)
    process.exit(2)
  }
}

if (args['owner-email'] === undefined) {
  console.warn('warning: no --owner-email, so nobody becomes admin automatically (add one to firestore.rules ownerEmails()).')
}

const here = dirname(fileURLToPath(import.meta.url))
const templates = resolve(here, '..', 'templates')
const dest = resolve(args.dir)
const inPlace = process.argv.includes('--in-place') // scaffold into an existing repo (phone mode)
if (!inPlace && existsSync(dest) && readdirSync(dest).length > 0) {
  console.error(`${dest} exists and is not empty`)
  process.exit(1)
}
mkdirSync(dest, { recursive: true })
cpSync(templates, dest, { recursive: true })
// --phone: also add CI workflows that deploy Firestore rules, so no local Firebase login is needed.
if (process.argv.includes('--phone')) cpSync(resolve(here, '..', 'templates-phone'), dest, { recursive: true })

const cfg = JSON.parse(readFileSync(resolve(args.config), 'utf8'))
const wanted = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const configLiteral =
  '{\n' + wanted.filter((k) => cfg[k]).map((k) => `  ${k}: ${JSON.stringify(cfg[k])},`).join('\n') + '\n}'

const esc = {
  '.ts': (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'"),
  '.vue': (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  '.html': (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
}

// In-place mode runs inside the repo that holds this skill: never rewrite the skill, git, or deps.
const SKIP = new Set(['.claude', '.git', 'node_modules'])

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p)
    else {
      let text = readFileSync(p, 'utf8')
      const title = (esc[extname(p)] ?? ((s) => s))(args.title)
      const out = text
        .replaceAll('__FIREBASE_CONFIG__', () => configLiteral)
        .replaceAll('__PROJECT_NAME__', () => args.name)
        .replaceAll('__TITLE__', () => title)
        .replaceAll('__SITE_ID__', () => args['site-id'])
        .replaceAll('__FIREBASE_PROJECT_ID__', () => args['project-id'])
        .replaceAll('__SECRET_NAME__', () => args.secret)
        .replaceAll('__OWNER_EMAIL__', () => args['owner-email'] ?? 'nobody@example.invalid')
      if (out !== text) writeFileSync(p, out)
    }
  }
}
walk(dest)
console.log(`scaffolded ${dest}`)
