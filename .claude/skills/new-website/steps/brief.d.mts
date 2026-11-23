export const KINDS: readonly string[]
export const MOODS: readonly string[]
export const FEATURES: readonly string[]
export const CONTENT: readonly string[]
export interface SiteBrief {
  version: 1
  siteName: string
  projectId: string
  ownerEmail: string
  kind: string
  audience: string
  moods: string[]
  features: string[]
  content: string
}
export function createBrief(input: Record<string, unknown>): SiteBrief
export function validateBrief(brief: unknown): string[]
