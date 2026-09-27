#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { resolveSiteUrl } from './resolve-site-url.mjs'

const root = process.cwd()
const portfolioSource = readFileSync(resolve(root, 'src/data/portfolio.ts'), 'utf8')
const notesSource = readFileSync(resolve(root, 'src/data/notes.ts'), 'utf8')

const projects = [...portfolioSource.matchAll(/^\s*id:\s*'([^']+)'/gm)].map(([, id]) => id)
const projectNames = Object.fromEntries(
  [...portfolioSource.matchAll(/^\s*id:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)'/gm)].map(
    ([, id, name]) => [id, name],
  ),
)

const noteIds = [...notesSource.matchAll(/^\s*id:\s*'([^']+)'/gm)].map(([, id]) => id)
const noteTitles = Object.fromEntries(
  [...notesSource.matchAll(/id:\s*'([^']+)'[\s\S]*?title:\s*\{\s*sk:\s*'((?:\\'|[^'])*)'/g)].map(
    ([, id, title]) => [id, title.replace(/\\'/g, "'")],
  ),
)

const siteUrl = resolveSiteUrl()

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function writeSvg(relPath, { eyebrow, title, subtitle }) {
  const abs = resolve(root, 'public', relPath)
  mkdirSync(dirname(abs), { recursive: true })
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f1c1d"/>
      <stop offset="55%" stop-color="#143336"/>
      <stop offset="100%" stop-color="#18747a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1040" cy="90" r="180" fill="#7ec8cf" fill-opacity="0.12"/>
  <circle cx="160" cy="520" r="220" fill="#ffffff" fill-opacity="0.04"/>
  <text x="72" y="110" fill="#7ec8cf" font-family="Georgia, 'Times New Roman', serif" font-size="28">${escapeXml(eyebrow)}</text>
  <text x="72" y="280" fill="#f4f7f7" font-family="Georgia, 'Times New Roman', serif" font-size="64">${escapeXml(title)}</text>
  <text x="72" y="350" fill="#c5d6d7" font-family="ui-sans-serif, system-ui, sans-serif" font-size="28">${escapeXml(subtitle)}</text>
  <text x="72" y="560" fill="#9bb5b7" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22">${escapeXml(siteUrl.replace(/^https?:\/\//, ''))}</text>
</svg>
`
  writeFileSync(abs, svg)
}

const pages = [
  {
    path: 'og/about.svg',
    eyebrow: 'Portfolio',
    title: 'Peter Dinis',
    subtitle: 'Medior Full-Stack Developer',
  },
  {
    path: 'og/tech.svg',
    eyebrow: 'Stack',
    title: 'Technológie',
    subtitle: 'React · TypeScript · NestJS · Cloud',
  },
  {
    path: 'og/experience.svg',
    eyebrow: 'Career',
    title: 'Skúsenosti',
    subtitle: 'IBA.CZ · Meditorial · JUMP soft',
  },
  {
    path: 'og/projects.svg',
    eyebrow: 'Work',
    title: 'Projekty',
    subtitle: 'Docu-Nest · Boom Scope · Pulse',
  },
  {
    path: 'og/notes.svg',
    eyebrow: 'Blog',
    title: 'Blog',
    subtitle: 'Design systems · Tauri · TypeScript',
  },
  { path: 'og/cv.svg', eyebrow: 'Resume', title: 'CV', subtitle: 'Print-ready experience summary' },
  {
    path: 'og/contact.svg',
    eyebrow: 'Hello',
    title: 'Kontakt',
    subtitle: 'Praha · Hybrid / Remote',
  },
]

for (const page of pages) {
  writeSvg(page.path, page)
}

for (const id of projects) {
  writeSvg(`og/projects/${id}.svg`, {
    eyebrow: 'Project',
    title: projectNames[id] ?? id,
    subtitle: 'Peter Dinis — Portfolio',
  })
}

for (const id of noteIds) {
  const title = noteTitles[id] ?? id
  const short = title.length > 42 ? `${title.slice(0, 40)}…` : title
  writeSvg(`og/notes/${id}.svg`, {
    eyebrow: 'Article',
    title: short,
    subtitle: 'Peter Dinis — Blog',
  })
}

console.log(
  `OG cards generated (${pages.length + projects.length + noteIds.length}) for ${siteUrl}`,
)
