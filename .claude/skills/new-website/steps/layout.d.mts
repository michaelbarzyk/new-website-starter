export interface StepLink {
  label: string
  url: string
  after?: number
}
export interface StepCopy {
  label: string
  value: string
  after?: number
}
export interface LayoutItem {
  /** Where the instruction sits in the step's `do` list. */
  raw: number
  text: string
  notes: string[]
  links: StepLink[]
  copies: StepCopy[]
}
export interface StepLayout {
  items: LayoutItem[]
  tail: { links: StepLink[]; copies: StepCopy[] }
}
export function layoutStep(step: { do: string[]; links?: StepLink[]; copy?: StepCopy[] }): StepLayout
