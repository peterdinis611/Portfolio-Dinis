#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { resolveSiteUrl } from './resolve-site-url.mjs'

const siteUrl = resolveSiteUrl()
const notesPath = resolve(process.cwd(), 'src/data/notes.ts')
const source = readFileSync(notesPath, 'utf8')

/** Pull note blocks from notes.ts via lightweight regex (build-time only). */
function extractNotes() {
  const chunks = source.split(/\n\s*\{\s*\n\s*id:\s*'/)
  const notes = []

  for (let i = 1; i < chunks.length; i++) {
    const chunk = `id: '${chunks[i]}`
    const id = chunk.match(/^id:\s*'([^']+)'/)?.[1]
    const date = chunk.match(/date:\s*'([^']+)'/)?.[1]
    const titleSk = chunk.match(/title:\s*\{\s*sk:\s*'((?:\\'|[^'])*)'/)?.[1]
    const titleEn = chunk.match(/title:\s*\{[^}]*en:\s*'((?:\\'|[^'])*)'/)?.[1]
    const summarySk = chunk.match(/summary:\s*\{\s*sk:\s*'((?:\\'|[^'])*)'/)?.[1]
    const summaryEn = chunk.match(/summary:\s*\{[^}]*en:\s*'((?:\\'|[^'])*)'/)?.[1]
    if (!id || !date || !titleSk || !titleEn) continue
    notes.push({
      id,
      date,
      titleSk: titleSk.replace(/\\'/g, "'"),
      titleEn: titleEn.replace(/\\'/g, "'"),
      summarySk: (summarySk ?? '').replace(/\\'/g, "'"),
      summaryEn: (summaryEn ?? '').replace(/\\'/g, "'"),
    })
  }

  return notes.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const notes = extractNotes()
const now = new Date().toUTCString()

const items = notes
  .map((note) => {
    const link = `${siteUrl}/notes/${note.id}`
    return `    <item>
      <title>${escapeXml(note.titleEn)} / ${escapeXml(note.titleSk)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(note.date).toUTCString()}</pubDate>
      <description>${escapeXml(note.summaryEn || note.summarySk)}</description>
    </item>`
  })
  .join('\n')

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Peter Dinis — Blog</title>
    <link>${siteUrl}/notes</link>
    <description>Tech articles from practice — design systems, React, API, a11y, mentoring.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>
`

const out = resolve(process.cwd(), 'public/feed.xml')
writeFileSync(out, feed)
console.log(`Wrote ${out} (${notes.length} items)`)
