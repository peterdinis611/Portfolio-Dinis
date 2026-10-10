import type { MetadataRoute } from 'next'
import { notes } from '@/data/notes'
import { projects } from '@/data/portfolio'
import { LOCALES } from '@/lib/locale'
import { noteHref, pageHref, projectHref } from '@/lib/portfolio-route'
import { getSiteUrl, notionPagesForSitemap } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const page of notionPagesForSitemap) {
      entries.push({
        url: `${siteUrl}${pageHref(locale, page)}`,
        lastModified: new Date(),
        changeFrequency: page === 'about' ? 'weekly' : 'monthly',
        priority: page === 'about' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((loc) => [loc, `${siteUrl}${pageHref(loc, page)}`]),
          ),
        },
      })
    }

    for (const project of projects) {
      entries.push({
        url: `${siteUrl}${projectHref(locale, project.id)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((loc) => [loc, `${siteUrl}${projectHref(loc, project.id)}`]),
          ),
        },
      })
    }

    for (const note of notes) {
      entries.push({
        url: `${siteUrl}${noteHref(locale, note.id)}`,
        lastModified: new Date(note.date),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((loc) => [loc, `${siteUrl}${noteHref(loc, note.id)}`]),
          ),
        },
      })
    }
  }

  return entries
}
