import { getNotionPages } from '@/components/notion/nav'
import type { NotionPageId } from '@/components/notion/types'
import { profile, projects } from '@/data/portfolio'
import { techCategories } from '@/data/technologies'
import { type Lang, translations } from '@/i18n/translations'

export type PortfolioSearchResult = {
  page: NotionPageId
  projectId?: string
  pageLabel: string
  pageIcon: string
  title: string
  subtitle?: string
  score: number
}

type SearchEntry = {
  page: NotionPageId
  projectId?: string
  title: string
  subtitle?: string
  terms: string[]
  weight: number
}

function normalize(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
}

function addEntry(
  entries: SearchEntry[],
  entry: Omit<SearchEntry, 'terms'> & { terms: Array<string | undefined> },
) {
  const terms = entry.terms.filter((term): term is string => Boolean(term?.trim()))
  if (terms.length === 0) return
  entries.push({ ...entry, terms })
}

function buildSearchIndex(lang: Lang): SearchEntry[] {
  const t = translations[lang]
  const pages = getNotionPages(lang)
  const titleMap = Object.fromEntries(t.techCategories.map((c) => [c.id, c.title])) as Record<
    string,
    string
  >
  const entries: SearchEntry[] = []

  for (const page of pages) {
    addEntry(entries, {
      page: page.id,
      title: page.label,
      subtitle: t.ui.notionPages,
      terms: [page.label],
      weight: 12,
    })
  }

  addEntry(entries, {
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
    addEntry(entries, {
      page: 'about',
      title: service.label,
      subtitle: t.ui.whatIDo,
      terms: [service.label],
      weight: 6,
    })
  }

  for (const category of techCategories) {
    addEntry(entries, {
      page: 'tech',
      title: titleMap[category.id] ?? category.id,
      subtitle: t.ui.tech,
      terms: [titleMap[category.id], t.techCategories.find((c) => c.id === category.id)?.skills],
      weight: 7,
    })

    for (const item of category.items) {
      addEntry(entries, {
        page: 'tech',
        title: item.name,
        subtitle: titleMap[category.id],
        terms: [item.name, item.id],
        weight: 6,
      })
    }
  }

  for (const job of t.experience) {
    addEntry(entries, {
      page: 'experience',
      title: job.role,
      subtitle: job.company,
      terms: [
        job.role,
        job.company,
        job.period,
        'summary' in job ? job.summary : undefined,
        'projects' in job ? job.projects : undefined,
        'tech' in job ? job.tech : undefined,
        ...job.highlights,
      ],
      weight: 8,
    })
  }

  for (const project of projects) {
    const copy = t.projects.find((item) => item.id === project.id)
    addEntry(entries, {
      page: 'projects',
      projectId: project.id,
      title: project.name,
      subtitle: project.tech,
      terms: [project.name, project.tech, copy?.description],
      weight: 8,
    })
  }

  addEntry(entries, {
    page: 'contact',
    title: t.ui.contact,
    subtitle: profile.name,
    terms: [t.ui.contact, t.ui.contactLead, t.ui.getInTouch, profile.name, profile.phone],
    weight: 7,
  })

  return entries
}

function scoreEntry(entry: SearchEntry, query: string): number {
  const tokens = normalize(query).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return 0

  let score = 0
  const title = normalize(entry.title)
  const subtitle = entry.subtitle ? normalize(entry.subtitle) : ''

  for (const token of tokens) {
    let tokenMatched = false

    if (title === token) {
      score += entry.weight + 8
      tokenMatched = true
    } else if (title.startsWith(token)) {
      score += entry.weight + 5
      tokenMatched = true
    } else if (title.includes(token)) {
      score += entry.weight + 3
      tokenMatched = true
    }

    if (subtitle.includes(token)) {
      score += entry.weight + 2
      tokenMatched = true
    }

    for (const term of entry.terms) {
      if (normalize(term).includes(token)) {
        score += entry.weight
        tokenMatched = true
      }
    }

    if (!tokenMatched) return 0
  }

  return score
}

export function searchPortfolio(lang: Lang, query: string, limit = 8): PortfolioSearchResult[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const pages = getNotionPages(lang)
  const pageMeta = Object.fromEntries(pages.map((page) => [page.id, page])) as Record<
    NotionPageId,
    (typeof pages)[number]
  >

  const ranked = buildSearchIndex(lang)
    .map((entry) => ({ entry, score: scoreEntry(entry, trimmed) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const seen = new Set<string>()
  const results: PortfolioSearchResult[] = []

  for (const { entry, score } of ranked) {
    const key = `${entry.page}:${entry.title}:${entry.subtitle ?? ''}`
    if (seen.has(key)) continue
    seen.add(key)

    const page = pageMeta[entry.page]
    results.push({
      page: entry.page,
      projectId: entry.projectId,
      pageLabel: page.label,
      pageIcon: page.icon,
      title: entry.title,
      subtitle: entry.subtitle,
      score,
    })

    if (results.length >= limit) break
  }

  return results
}
