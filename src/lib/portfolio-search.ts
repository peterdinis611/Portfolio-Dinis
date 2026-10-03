import Fuse from 'fuse.js'
import { getNotionPages } from '@/components/notion/nav'
import type { NotionPageId } from '@/components/notion/types'
import { notes } from '@/data/notes'
import { profile, projects } from '@/data/portfolio'
import { techCategories } from '@/data/technologies'
import { type Lang, translations } from '@/i18n/translations'
import { flattenNoteBody } from '@/lib/note-blocks'
import { normalizeSearch } from '@/lib/search-utils'

export type PortfolioSearchResult = {
  page: NotionPageId
  projectId?: string
  noteId?: string
  pageLabel: string
  pageIcon: string
  title: string
  subtitle?: string
  score: number
  query: string
}

type PortfolioDoc = {
  key: string
  page: NotionPageId
  projectId?: string
  noteId?: string
  title: string
  subtitle?: string
  haystack: string
  weight: number
}

const fuseByLang = new Map<Lang, Fuse<PortfolioDoc>>()
const docsByLang = new Map<Lang, PortfolioDoc[]>()

function buildDocs(lang: Lang): PortfolioDoc[] {
  const t = translations[lang]
  const pages = getNotionPages(lang)
  const titleMap = Object.fromEntries(t.techCategories.map((c) => [c.id, c.title])) as Record<
    string,
    string
  >
  const docs: PortfolioDoc[] = []

  const push = (doc: Omit<PortfolioDoc, 'haystack' | 'key'> & { terms: string[] }) => {
    const terms = doc.terms.filter(Boolean)
    docs.push({
      key: `${doc.page}:${doc.noteId ?? ''}:${doc.projectId ?? ''}:${doc.title}`,
      page: doc.page,
      projectId: doc.projectId,
      noteId: doc.noteId,
      title: doc.title,
      subtitle: doc.subtitle,
      weight: doc.weight,
      haystack: normalizeSearch([doc.title, doc.subtitle ?? '', ...terms].join(' ')),
    })
  }

  for (const page of pages) {
    push({
      page: page.id,
      title: page.label,
      subtitle: t.ui.notionPages,
      terms: [page.label],
      weight: 12,
    })
  }

  push({
    page: 'about',
    title: t.profile.title,
    subtitle: t.ui.about,
    terms: [
      t.profile.title,
      t.profile.tagline,
      t.profile.bio,
      t.profile.location,
      ...profile.interests,
    ],
    weight: 8,
  })

  for (const service of t.services) {
    push({
      page: 'about',
      title: service.label,
      subtitle: t.ui.whatIDo,
      terms: [service.label],
      weight: 6,
    })
  }

  for (const category of techCategories) {
    push({
      page: 'tech',
      title: titleMap[category.id] ?? category.id,
      subtitle: t.ui.tech,
      terms: [
        titleMap[category.id] ?? '',
        t.techCategories.find((c) => c.id === category.id)?.skills ?? '',
      ],
      weight: 7,
    })
    for (const item of category.items) {
      push({
        page: 'tech',
        title: item.name,
        subtitle: titleMap[category.id],
        terms: [item.name, item.id],
        weight: 6,
      })
    }
  }

  for (const job of t.experience) {
    push({
      page: 'experience',
      title: job.role,
      subtitle: job.company,
      terms: [
        job.role,
        job.company,
        job.period,
        'summary' in job ? String(job.summary) : '',
        'projects' in job ? String(job.projects) : '',
        'tech' in job ? String(job.tech) : '',
        ...job.highlights,
      ],
      weight: 8,
    })
  }

  for (const project of projects) {
    const copy = t.projects.find((item) => item.id === project.id)
    push({
      page: 'projects',
      projectId: project.id,
      title: project.name,
      subtitle: project.tech,
      terms: [project.name, project.tech, copy?.description ?? ''],
      weight: 8,
    })
  }

  for (const note of notes) {
    push({
      page: 'notes',
      noteId: note.id,
      title: note.title[lang],
      subtitle: note.summary[lang],
      terms: [note.title[lang], note.summary[lang], ...note.tags, flattenNoteBody(note.body[lang])],
      weight: 8,
    })
  }

  push({
    page: 'cv',
    title: t.ui.cv,
    subtitle: t.profile.title,
    terms: [t.ui.cv, t.ui.cvIntro, t.profile.title, 'resume', 'pdf'],
    weight: 9,
  })

  push({
    page: 'contact',
    title: t.ui.contact,
    subtitle: profile.name,
    terms: [t.ui.contact, t.ui.contactLead, t.ui.getInTouch, profile.name, profile.phone],
    weight: 7,
  })

  return docs
}

function getPortfolioFuse(lang: Lang): Fuse<PortfolioDoc> {
  const cached = fuseByLang.get(lang)
  if (cached) return cached

  const docs = buildDocs(lang)
  docsByLang.set(lang, docs)

  const fuse = new Fuse(docs, {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.4,
    distance: 140,
    minMatchCharLength: 2,
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'subtitle', weight: 0.2 },
      { name: 'haystack', weight: 0.3 },
    ],
  })

  fuseByLang.set(lang, fuse)
  return fuse
}

export function searchPortfolio(lang: Lang, query: string, limit = 8): PortfolioSearchResult[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const pages = getNotionPages(lang)
  const pageMeta = Object.fromEntries(pages.map((page) => [page.id, page])) as Record<
    NotionPageId,
    (typeof pages)[number]
  >

  const fuse = getPortfolioFuse(lang)
  const hits = fuse.search(normalizeSearch(trimmed))
  const seen = new Set<string>()
  const results: PortfolioSearchResult[] = []

  for (const hit of hits) {
    const doc = hit.item
    if (seen.has(doc.key)) continue
    seen.add(doc.key)

    const page = pageMeta[doc.page]
    const fuseScore = hit.score ?? 1
    // Prefer heavier entries when Fuse scores are close.
    const score = Math.round((1 - fuseScore) * 100 + doc.weight)

    results.push({
      page: doc.page,
      projectId: doc.projectId,
      noteId: doc.noteId,
      pageLabel: page.label,
      pageIcon: page.icon,
      title: doc.title,
      subtitle: doc.subtitle,
      score,
      query: trimmed,
    })

    if (results.length >= limit) break
  }

  return results
}

export function resetPortfolioSearchCache() {
  fuseByLang.clear()
  docsByLang.clear()
}
