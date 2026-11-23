export interface StepsData {
  values: Record<string, { placeholder?: string }>
  steps: Array<{ phase: string }>
}
export function renderPhase(phase: string, data: StepsData): string
export function replaceBlock(doc: string, name: string, body: string): string
