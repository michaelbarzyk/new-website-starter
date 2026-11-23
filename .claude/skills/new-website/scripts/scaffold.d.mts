export function parseFirebaseConfig(text: string): Record<string, unknown>
export interface ScaffoldInputs {
  args: Record<string, string | undefined>
  config?: Record<string, unknown>
  configError?: string
  destExists: boolean
  destEmpty: boolean
  inPlace: boolean
}
export function findProblems(inputs: ScaffoldInputs): string[]
