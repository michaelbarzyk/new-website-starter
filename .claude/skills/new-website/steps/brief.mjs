// The site brief: what the setup website learned, written into the user's NEW repo as .claude/site-brief.json
// so Claude's discovery can skip questions already answered. Plain JS with .d.mts types.
import { isValidEmail, isValidProjectId, normalizeEmail } from './fill.mjs'

export const KINDS = ['portfolio', 'business', 'blog', 'community', 'shop', 'game', 'other']
export const MOODS = ['calm-natural', 'bold-modern', 'warm-friendly', 'minimal-elegant', 'playful-retro', 'fresh-coastal', 'classic-trustworthy', 'dark-techy']
export const FEATURES = ['info-photos', 'contact', 'sign-in', 'admin', 'blog', 'bookings', 'undecided']
export const CONTENT = ['ready', 'some', 'placeholders']

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const pick = (list, v) => (Array.isArray(v) ? v.filter((x) => list.includes(x)) : [])

/** Build a clean brief from loose form input. Unknown values are dropped. */
export function createBrief(input) {
  return {
    version: 1,
    siteName: text(input.siteName, 80),
    projectId: text(input.projectId, 30).toLowerCase(),
    ownerEmail: normalizeEmail(input.ownerEmail),
    kind: KINDS.includes(input.kind) ? input.kind : 'other',
    audience: text(input.audience, 300),
    moods: pick(MOODS, input.moods).slice(0, 3),
    features: pick(FEATURES, input.features),
    content: CONTENT.includes(input.content) ? input.content : 'placeholders',
  }
}

/** Check a brief (for example one read from the repo). Returns the list of problems; empty means valid. */
export function validateBrief(brief) {
  const errors = []
  if (typeof brief !== 'object' || brief === null) return ['The brief must be an object.']
  if (brief.version !== 1) errors.push('version must be 1.')
  if (typeof brief.siteName !== 'string' || brief.siteName.trim() === '') errors.push('siteName is required.')
  if (!isValidProjectId(brief.projectId)) errors.push('projectId must be 6-30 lowercase letters, digits or hyphens, starting with a letter.')
  if (brief.ownerEmail !== '' && !isValidEmail(brief.ownerEmail)) errors.push('ownerEmail is not a valid email.')
  if (!KINDS.includes(brief.kind)) errors.push(`kind must be one of ${KINDS.join(', ')}.`)
  if (!Array.isArray(brief.moods) || brief.moods.length > 3 || brief.moods.some((m) => !MOODS.includes(m))) errors.push('moods must be up to 3 known moods.')
  if (!Array.isArray(brief.features) || brief.features.some((f) => !FEATURES.includes(f))) errors.push('features must be known feature ids.')
  if (!CONTENT.includes(brief.content)) errors.push(`content must be one of ${CONTENT.join(', ')}.`)
  return errors
}
