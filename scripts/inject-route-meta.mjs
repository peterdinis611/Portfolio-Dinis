#!/usr/bin/env node
/**
 * After Vite build, copy index.html into route folders with route-specific OG meta
 * so crawlers (LinkedIn, Slack, …) see correct cards without executing JS.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { resolveSiteUrl } from './resolve-site-url.mjs'

const root = process.cwd()
const distIndex = resolve(root, 'dist/index.html')
const siteUrl = resolveSiteUrl()

const portfolioSource = readFileSync(resolve(root, 'src/data/portfolio.ts'), 'utf8')
const notesSource = readFileSync(resolve(root, 'src/data/notes.ts'), 'utf8')
const projects = [...portfolioSource.matchAll(/^\s*id:\s*'([^']+)'/gm)].map(([, id]) => id)
const notes = [...notesSource.matchAll(/^\s*id:\s*'([^']+)'/gm)].map(([, id]) => id)

const projectNames = Object.fromEntries(
  [...portfolioSource.matchAll(/^\s*id:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)'/gm)].map(
    ([, id, name]) => [id, name],
  ),
)

const noteTitles = Object.fromEntries(
  [...notesSource.matchAll(/id:\s*'([^']+)'[\s\S]*?title:\s*\{\s*sk:\s*'((?:\\'|[^'])*)'/g)].map(
    ([, id, title]) => [id, title.replace(/\\'/g, "'")],
  ),
)

/** @type {Array<{ path: string; title: string; description: string; image: string }>} */
const routes = [
  {
    path: '',
    title: 'Peter Dinis | Medior Full-Stack Developer — Portfólio',
    description:
      'Portfólio medior full-stack developera Petra Dinisa. Produktové inžinierstvo, design systémy, mentoring, React, TypeScript a cloud.',
    image: '/og/about.svg',
  },
  {
    path: 'tech',
    title: 'Technológie | Peter Dinis — Medior Full-Stack Developer',
    description:
      'Produkčný tech stack: React, Next.js, TypeScript, Node.js, NestJS, PostgreSQL, Docker, AWS a design systémy.',
    image: '/og/tech.svg',
  },
  {
    path: 'experience',
    title: 'Skúsenosti | Peter Dinis — Medior Full-Stack Developer',
    description:
      'Produkčné skúsenosti — IBA.CZ, Meditorial, JUMP soft, Navisys. Vedenie frontendu, mentoring a enterprise dodávky.',
    image: '/og/experience.svg',
  },
  {
    path: 'projects',
    title: 'Projekty | Peter Dinis — Medior Full-Stack Developer',
    description:
      'Produkčné a open-source projekty: Docu-Nest, Boom Scope, Pulse API Client, SPST Knižnica a ďalšie.',
    image: '/og/projects.svg',
  },
  {
    path: 'notes',
    title: 'Blog | Peter Dinis — Medior Full-Stack Developer',
    description:
      'Tech blog: design systémy, Tauri desktop nástroje a TypeScript end-to-end — krátke články z praxe.',
    image: '/og/notes.svg',
  },
  {
    path: 'cv',
    title: 'CV | Peter Dinis — Medior Full-Stack Developer',
    description:
      'Životopis Petra Dinisa — skúsenosti, stack a kontakty. Pripravené na tlač alebo PDF.',
    image: '/og/cv.svg',
  },
  {
    path: 'contact',
    title: 'Kontakt | Peter Dinis — Medior Full-Stack Developer',
    description:
      'Kontaktuj Petra Dinisa — medior full-stack developer v Prahe. Email, telefón, LinkedIn a GitHub.',
    image: '/og/contact.svg',
  },
]

for (const id of projects) {
  routes.push({
    path: `projects/${id}`,
    title: `${projectNames[id] ?? id} | Projekt — Peter Dinis`,
    description: `${projectNames[id] ?? id} — projekt z portfólia Petra Dinisa.`,
    image: `/og/projects/${id}.svg`,
  })
}

for (const id of notes) {
  routes.push({
    path: `notes/${id}`,
    title: `${noteTitles[id] ?? id} | Článok — Peter Dinis`,
    description: noteTitles[id] ?? 'Tech článok z blogu Petra Dinisa.',
    image: `/og/notes/${id}.svg`,
  })
}

function patchHtml(html, route) {
  const url = route.path ? `${siteUrl}/${route.path}` : `${siteUrl}/`
  const image = `${siteUrl}${route.image}`

  let next = html
  next = next.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`)
  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${route.description}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${route.title}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${route.description}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${image}" />`,
  )
  next = next.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${route.title}" />`,
  )
  next = next.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${route.description}" />`,
  )
  next = next.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${image}" />`,
  )

  if (next.includes('property="og:url"')) {
    next = next.replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${url}" />`,
    )
  } else {
    next = next.replace(
      '<meta property="og:image"',
      `<meta property="og:url" content="${url}" />\n    <meta property="og:image"`,
    )
  }

  return next
}

const template = readFileSync(distIndex, 'utf8')

for (const route of routes) {
  if (!route.path) {
    writeFileSync(distIndex, patchHtml(template, route))
    continue
  }
  const out = resolve(root, 'dist', route.path, 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, patchHtml(template, route))
}

console.log(`Injected OG meta into ${routes.length} route HTML files`)
