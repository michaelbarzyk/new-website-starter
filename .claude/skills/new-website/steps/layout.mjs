// Shared by the website's step cards and the doc renderer, so both lay a step out the same way. Plain JS (with .d.mts types).

/** The line number a link or copy button belongs under, or undefined when it goes at the end of the step. */
function afterOf(entry) {
  return Number.isInteger(entry?.after) ? entry.after : undefined
}

/**
 * Groups a step's `do` lines into numbered instructions.
 * - A line that starts with "> " is a small note under the instruction before it (it is not numbered).
 * - A link or copy button with `after: n` sits right under the instruction at `do[n]`; the others go at the end.
 */
export function layoutStep(step) {
  const items = []
  step.do.forEach((line, raw) => {
    const previous = items[items.length - 1]
    if (line.startsWith('> ') && previous !== undefined) previous.notes.push(line.slice(2))
    else items.push({ raw, text: line, notes: [], links: [], copies: [] })
  })
  const tail = { links: [], copies: [] }
  for (const link of step.links ?? []) {
    const item = items.find((i) => i.raw === afterOf(link))
    ;(item ? item.links : tail.links).push(link)
  }
  for (const copy of step.copy ?? []) {
    const item = items.find((i) => i.raw === afterOf(copy))
    ;(item ? item.copies : tail.copies).push(copy)
  }
  return { items, tail }
}
