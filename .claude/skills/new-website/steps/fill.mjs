// Shared by the website checklist, the doc renderer and the tests. Plain JS (with .d.mts types) so Node and Vite can both import it.

const PROJECT_ID = /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/
const EMAIL = /^[^\s@'"\\]+@[^\s@'"\\]+\.[^\s@'"\\]+$/

/**
 * Turn a site name into a valid Firebase project id (6-30 chars, lowercase letters/digits/hyphens, starts with a letter).
 * Spaces and punctuation are dropped, not turned into hyphens, so "Pied Piper" becomes piedpiper.web.app.
 */
export function toProjectId(name) {
  let id = String(name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
  if (!/^[a-z]/.test(id)) id = id === '' ? 'mysite' : `site${id}`
  if (id.length < 6) id = `${id}site`
  return id.slice(0, 30)
}

export function isValidProjectId(id) {
  return typeof id === 'string' && PROJECT_ID.test(id)
}

/** Lower-cased and trimmed: Google's token email is lower-case and the rules compare exactly. */
export function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

export function isValidEmail(email) {
  return EMAIL.test(normalizeEmail(email))
}

export function secretNameFor(projectId) {
  return `FIREBASE_SERVICE_ACCOUNT_${String(projectId).toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`
}

const REPO_NAME = /^[a-z0-9][a-z0-9-]{0,99}$/
const GITHUB_USER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/

export function isValidRepoName(name) {
  return typeof name === 'string' && REPO_NAME.test(name)
}

export function isValidGithubUser(name) {
  return typeof name === 'string' && GITHUB_USER.test(name)
}

/**
 * Everything the steps can mention, from the few things the user types. Values that are missing or invalid are
 * left OUT (never half-built into a link), so the steps simply ask the user to fill them in.
 */
export function deriveValues(input) {
  const values = {}
  if (input.siteName) values.siteName = String(input.siteName).trim()
  const typedId = input.projectId ? String(input.projectId).trim().toLowerCase() : ''
  const projectId = typedId !== '' ? typedId : values.siteName ? toProjectId(values.siteName) : ''
  if (isValidProjectId(projectId)) {
    values.projectId = projectId
    values.secretName = secretNameFor(projectId)
    values.liveUrl = `https://${projectId}.web.app`
    values.consoleUrl = `https://console.firebase.google.com/project/${projectId}`
    values.firestoreUrl = `${values.consoleUrl}/firestore`
    values.authUrl = `${values.consoleUrl}/authentication/providers`
    values.serviceAccountsUrl = `${values.consoleUrl}/settings/serviceaccounts/adminsdk`
    values.iamUrl = `https://console.cloud.google.com/iam-admin/iam?project=${projectId}`
  }
  if (input.ownerEmail && isValidEmail(input.ownerEmail)) values.ownerEmail = normalizeEmail(input.ownerEmail)
  // The repo can have any name (it need not match the project id), so it is only known when it was given. Never guessed.
  const typedRepo = input.repoName ? String(input.repoName).trim().toLowerCase() : ''
  if (isValidRepoName(typedRepo)) values.repoName = typedRepo
  if (input.githubUser && isValidGithubUser(String(input.githubUser).trim())) values.githubUser = String(input.githubUser).trim()
  // A link straight to the secret form only when both are known; otherwise the person's repo list.
  if (values.githubUser && values.repoName) {
    values.secretsUrl = `https://github.com/${values.githubUser}/${values.repoName}/settings/secrets/actions/new`
  } else if (values.siteName || values.projectId || values.githubUser || values.repoName) {
    values.secretsUrl = 'https://github.com/settings/repositories'
  }
  return values
}

const PLACEHOLDER = /\{\{\s*([A-Za-z][A-Za-z0-9]*)\s*\}\}/g

/** Replace {{name}} with its value; unknown names are left as-is so missing input is visible. */
export function fill(text, values) {
  return String(text).replace(PLACEHOLDER, (whole, key) => (typeof values[key] === 'string' && values[key] !== '' ? values[key] : whole))
}

/** The {{names}} in `text` that have no value yet. */
export function missing(text, values) {
  const out = new Set()
  for (const m of String(text).matchAll(PLACEHOLDER)) {
    const key = m[1]
    if (!(typeof values[key] === 'string' && values[key] !== '')) out.add(key)
  }
  return [...out]
}

/** For printed docs: {{projectId}} becomes the catalogue's placeholder text, like <project-id>. */
export function docForm(text, catalog) {
  return String(text).replace(PLACEHOLDER, (whole, key) => catalog[key]?.placeholder ?? whole)
}
