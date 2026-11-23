export function toProjectId(name: string): string
export function isValidProjectId(id: unknown): boolean
export function normalizeEmail(email: unknown): string
export function isValidEmail(email: unknown): boolean
export function isValidRepoName(name: unknown): boolean
export function isValidGithubUser(name: unknown): boolean
export function secretNameFor(projectId: string): string
export interface StepInput {
  siteName?: string
  projectId?: string
  ownerEmail?: string
  repoName?: string
  githubUser?: string
}
export type StepValues = Record<string, string>
export function deriveValues(input: StepInput): StepValues
export function fill(text: string, values: StepValues): string
export function missing(text: string, values: StepValues): string[]
export function docForm(text: string, catalog: Record<string, { placeholder?: string }>): string
