#!/usr/bin/env node
// Renders the console steps from steps/steps.json into the docs, between <!-- steps:begin NAME --> and <!-- steps:end NAME -->.
//   node scripts/render-steps.mjs          rewrite the docs
//   node scripts/render-steps.mjs --check  exit 1 if any doc is out of date (use in CI)
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { docForm } from '../steps/fill.mjs'
import { layoutStep } from '../steps/layout.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(readFileSync(join(root, 'steps/steps.json'), 'utf8'))

/** Markdown for the steps of one phase, numbered from 1. */
export function renderPhase(phase, data) {
  // A [[button]] looks like a button on the site; in the docs it is just marked as code.
  const f = (t) => docForm(t, data.values).replace(/\[\[([^\]]+)\]\]/g, '`$1`')
  const link = (l) => `- Link: [${f(l.label)}](${f(l.url)})`
  const copy = (c) => `- Value: ${f(c.label)} = \`${f(c.value)}\``
  const steps = data.steps.filter((s) => s.phase === phase)
  const out = []
  steps.forEach((s, i) => {
    out.push(`**${i + 1}. ${f(s.title)}**`)
    if (s.why) out.push(`*${f(s.why)}*`)
    out.push('')
    const { items, tail } = layoutStep(s)
    for (const item of items) {
      out.push(`- ${f(item.text)}`)
      for (const note of item.notes) out.push(`  - ${f(note)}`)
      for (const l of item.links) out.push(`  ${link(l)}`)
      for (const c of item.copies) out.push(`  ${copy(c)}`)
    }
    for (const l of tail.links) out.push(link(l))
    for (const c of tail.copies) out.push(copy(c))
    if (s.success) out.push(`- ✅ Worked when: ${f(s.success)}`)
    for (const t of s.trouble ?? []) out.push(`- ⚠️ ${f(t.symptom)} → ${f(t.fix)}`)
    out.push('')
  })
  return out.join('\n').trimEnd() + '\n'
}

const TARGETS = [
  { file: 'reference/phone-mode.md', name: 'console', phase: 'console' },
  { file: 'TUTORIAL.md', name: 'console', phase: 'console' },
]

export function replaceBlock(doc, name, body) {
  const begin = `<!-- steps:begin ${name} -->`
  const end = `<!-- steps:end ${name} -->`
  const a = doc.indexOf(begin)
  const b = doc.indexOf(end)
  if (a === -1 || b === -1 || b < a) throw new Error(`markers for "${name}" not found`)
  return doc.slice(0, a + begin.length) + '\n' + body + doc.slice(b)
}

function main() {
  const check = process.argv.includes('--check')
  let stale = false
  for (const t of TARGETS) {
    const path = join(root, t.file)
    const before = readFileSync(path, 'utf8')
    const after = replaceBlock(before, t.name, renderPhase(t.phase, data))
    if (before !== after) {
      stale = true
      if (!check) writeFileSync(path, after)
      console.log(`${check ? 'out of date' : 'updated'}: ${t.file}`)
    }
  }
  if (check && stale) {
    console.error('Docs are out of date. Run: node scripts/render-steps.mjs')
    process.exit(1)
  }
  if (!stale) console.log('docs are up to date')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
