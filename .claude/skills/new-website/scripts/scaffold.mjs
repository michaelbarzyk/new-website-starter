#!/usr/bin/env node
// Copies ../templates into a directory, replacing __TOKENS__. Everything is checked BEFORE any file is touched,
// so a mistake (bad config, bad name, ...) stops with a clear message and leaves the directory exactly as it was.
//
// Usage: node scaffold.mjs --dir <path> --name <kebab-name> --title "<Display Title>"
//          --project-id <firebase-project-id> --site-id <hosting-site-id>
//          --secret <GITHUB_SECRET_NAME> --config <path-to-firebase-web-config>
//          [--owner-email <owner's Google email>]  (auto-admin on first sign-in)
//          [--phone]     add the phone-mode workflows (CI deploys the rules too)
//          [--in-place]  scaffold into an existing repo (keeps .claude/, .git, node_modules)
//
// The config file may be JSON, or exactly what the Firebase console shows (`const firebaseConfig = { apiKey: "..." };`).
// Exit codes: 0 done, 2 something was wrong (nothing was changed).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isValidEmail, isValidProjectId, isValidRepoName, normalizeEmail, parseFirebaseConfig } from '../steps/fill.mjs'

// Lives in steps/fill.mjs (which the website also uses, and which has no Node-only imports); re-exported here for the scripts and tests.
export { parseFirebaseConfig }

const REQUIRED_ARGS = ['dir', 'name', 'title', 'project-id', 'site-id', 'secret', 'config']
const CONFIG_KEYS = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const FLAGS = new Set(['--phone', '--in-place'])
const SECRET_NAME = /^[A-Z][A-Z0-9_]*$/

/** Everything that is wrong with the inputs, as plain sentences. An empty list means safe to go ahead. */
export function findProblems({ args, config, configError, destExists, destEmpty, inPlace }) {
  const problems = []
  for (const k of REQUIRED_ARGS) if (!args[k]) problems.push(`missing --${k}`)
  if (args.name && !isValidRepoName(args.name)) problems.push(`--name "${args.name}" must be lowercase letters, digits and hyphens`)
  if (args['project-id'] && !isValidProjectId(args['project-id'])) {
    problems.push(`--project-id "${args['project-id']}" must be 6-30 lowercase letters, digits or hyphens, starting with a letter`)
  }
  if (args['site-id'] && !isValidProjectId(args['site-id'])) {
    problems.push(`--site-id "${args['site-id']}" must be 6-30 lowercase letters, digits or hyphens, starting with a letter`)
  }
  if (args.secret && !SECRET_NAME.test(args.secret)) problems.push(`--secret "${args.secret}" must be CAPITAL_LETTERS_DIGITS_AND_UNDERSCORES`)
  if (args.title && args.title.trim().length > 80) problems.push('--title is longer than 80 characters')
  if (args['owner-email'] !== undefined && !isValidEmail(args['owner-email'])) {
    problems.push(`--owner-email is not a valid email: ${args['owner-email']}`)
  }
  if (configError) {
    problems.push(configError)
  } else if (config) {
    const missingKeys = CONFIG_KEYS.filter((k) => typeof config[k] !== 'string' || config[k].trim() === '')
    if (missingKeys.length > 0) problems.push(`the Firebase config is missing: ${missingKeys.join(', ')}`)
    if (typeof config.projectId === 'string' && args['project-id'] && config.projectId !== args['project-id']) {
      problems.push(`the config's projectId "${config.projectId}" does not match --project-id "${args['project-id']}"`)
    }
  }
  if (!inPlace && destExists && !destEmpty) problems.push('the target folder already exists and is not empty (use --in-place to scaffold into a repo)')
  return problems
}

const esc = {
  '.ts': (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'"),
  '.vue': (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  '.html': (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
}

// In-place mode runs inside the repo that holds this skill: never rewrite the skill, git, or deps.
const SKIP = new Set(['.claude', '.git', 'node_modules'])

function main() {
  const argv = process.argv.slice(2)
  const args = Object.fromEntries(
    argv.reduce((acc, cur, i) => {
      if (cur.startsWith('--') && !FLAGS.has(cur)) acc.push([cur.slice(2), argv[i + 1]])
      return acc
    }, []),
  )
  const inPlace = argv.includes('--in-place')
  const phone = argv.includes('--phone')
  if (args['owner-email'] !== undefined) args['owner-email'] = normalizeEmail(args['owner-email'])

  const here = dirname(fileURLToPath(import.meta.url))
  const templates = resolve(here, '..', 'templates')
  const dest = resolve(args.dir ?? '.')

  // 1. Read and check everything. Nothing is written until this passes.
  let config
  let configError
  if (args.config) {
    try {
      config = parseFirebaseConfig(readFileSync(resolve(args.config), 'utf8'))
    } catch (err) {
      const reason = err && err.code === 'ENOENT' ? 'file not found' : err instanceof Error ? err.message : String(err)
      configError = `could not read the Firebase config (${args.config}): ${reason}`
    }
  }
  const destExists = existsSync(dest)
  const problems = findProblems({
    args,
    config,
    configError,
    destExists,
    destEmpty: destExists && statSync(dest).isDirectory() ? readdirSync(dest).length === 0 : false,
    inPlace,
  })
  if (!existsSync(templates)) problems.push(`templates folder not found: ${templates}`)
  if (problems.length > 0) {
    console.error('Nothing was changed. Fix these and run it again:')
    for (const p of problems) console.error(`  - ${p}`)
    process.exit(2)
  }
  if (args['owner-email'] === undefined) {
    console.warn('warning: no --owner-email, so nobody becomes admin automatically (add one to firestore.rules ownerEmails()).')
  }

  // 2. Copy the templates, then fill in the placeholders.
  const configLiteral = '{\n' + CONFIG_KEYS.map((k) => `  ${k}: ${JSON.stringify(config[k])},`).join('\n') + '\n}'
  mkdirSync(dest, { recursive: true })
  cpSync(templates, dest, { recursive: true })
  // --phone: also add CI workflows that deploy Firestore rules, so no local Firebase login is needed.
  if (phone) cpSync(resolve(here, '..', 'templates-phone'), dest, { recursive: true })

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (SKIP.has(entry)) continue
      const p = join(dir, entry)
      if (statSync(p).isDirectory()) walk(p)
      else {
        const text = readFileSync(p, 'utf8')
        const title = (esc[extname(p)] ?? ((s) => s))(args.title)
        // Function replacers, so a "$" in the user's text is written literally.
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
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
