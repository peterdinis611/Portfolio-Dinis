import type { Metadata } from 'next'
import type { NotionPageId } from '@/components/notion/types'
import { getNote, notes } from '@/data/notes'
import { type ProjectListId, profile, projects, socials } from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
import type { Locale } from '@/lib/locale'
import { LOCALES } from '@/lib/locale'
import {
  getNoteTitle,
  getProjectName,
  noteHref,
  type PortfolioRoute,
  pageHref,
  projectHref,
  projectListHref,
} from '@/lib/portfolio-route'
import { decodeEmail } from './email'

const SITE_NAME = 'Peter Dinis — Portfolio'
const DEFAULT_PAGE: NotionPageId = 'about'

type PageSeo = {
  title: string
  description: string
}

type SiteSeo = PageSeo & {
  keywords: string
  ogLocale: string
}

export const seoCopy: Record<Lang, SiteSeo> = {
  sk: {
    title: 'Peter Dinis | Medior Full-Stack Developer — Portfólio',
    description:
      'Portfólio medior full-stack developera Petra Dinisa. Produktové inžinierstvo, design systémy, mentoring, React, TypeScript a cloud.',
    keywords:
      'Peter Dinis, medior full-stack developer, React, TypeScript, Node.js, NestJS, architektúra, mentoring, design systémy, Praha',
    ogLocale: 'sk_SK',
  },
  en: {
    title: 'Peter Dinis | Medior Full-Stack Developer — Portfolio',
    description:
      'Portfolio of medior full-stack developer Peter Dinis. Product engineering, design systems, mentoring, React, TypeScript, and cloud.',
    keywords:
      'Peter Dinis, medior full-stack developer, React, TypeScript, Node.js, NestJS, architecture, mentoring, design systems, Prague',
    ogLocale: 'en_US',
  },
}

const pageSeoCopy: Record<Lang, Record<NotionPageId, PageSeo>> = {
  sk: {
    about: {
      title: 'O mne | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Medior full-stack developer so zameraním na React, TypeScript, design systémy a produktové dodávky. Bio, služby a skúsenosti.',
    },
    now: {
      title: 'Teraz | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Aktuálny fokus: IBA.CZ, side projekty, mentoring a čo hľadám — živý snapshot dostupnosti.',
    },
    oss: {
      title: 'Open source | Peter Dinis — Medior Full-Stack Developer',
      description:
        'GitHub repozitáre, komunita a priestor na talks — Docu-Nest, Pulse, Boom Scope a ďalšie.',
    },
    uses: {
      title: 'Uses | Peter Dinis — Medior Full-Stack Developer',
      description: 'Editor, denný stack a workflow — Cursor, React, TypeScript, GitHub.',
    },
    tech: {
      title: 'Technológie | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Produkčný tech stack: React, Next.js, TypeScript, Node.js, NestJS, PostgreSQL, Docker, AWS a design systémy.',
    },
    experience: {
      title: 'Skúsenosti | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Produkčné skúsenosti — IBA.CZ, Meditorial, JUMP soft, Navisys. Vedenie frontendu, mentoring a enterprise dodávky.',
    },
    projects: {
      title: 'Projekty | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Produkčné a open-source projekty: ÚDZS, EForms, Docu-Nest, Boom Scope, Pulse API Client, SPST Knižnica a ďalšie.',
    },
    notes: {
      title: 'Blog | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Tech blog: design systémy, XState, Tauri, Convex, TypeScript a mentoring — články z praxe.',
    },
    cv: {
      title: 'CV | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Životopis Petra Dinisa — skúsenosti, stack a kontakty. Pripravené na tlač alebo PDF.',
    },
    contact: {
      title: 'Kontakt | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Kontaktuj Petra Dinisa — medior full-stack developer v Prahe. Email, telefón, LinkedIn a GitHub.',
    },
  },
  en: {
    about: {
      title: 'About | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Medior full-stack developer focused on React, TypeScript, design systems, and product delivery. Bio, services, and experience.',
    },
    now: {
      title: 'Now | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Current focus: IBA.CZ, side projects, mentoring, and what I’m looking for — a living availability snapshot.',
    },
    oss: {
      title: 'Open source | Peter Dinis — Medior Full-Stack Developer',
      description:
        'GitHub repos, community, and room for talks — Docu-Nest, Pulse, Boom Scope, and more.',
    },
    uses: {
      title: 'Uses | Peter Dinis — Medior Full-Stack Developer',
      description: 'Editor, daily stack, and workflow — Cursor, React, TypeScript, GitHub.',
    },
    tech: {
      title: 'Technologies | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Production tech stack: React, Next.js, TypeScript, Node.js, NestJS, PostgreSQL, Docker, AWS, and design systems.',
    },
    experience: {
      title: 'Experience | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Production experience — IBA.CZ, Meditorial, JUMP soft, Navisys. Frontend leadership, mentoring, and enterprise delivery.',
    },
    projects: {
      title: 'Projects | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Production and open-source projects: ÚDZS, EForms, Docu-Nest, Boom Scope, Pulse API Client, SPST Knižnica, and more.',
    },
    notes: {
      title: 'Blog | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Tech blog: design systems, XState, Tauri, Convex, TypeScript, and mentoring — practice articles.',
    },
    cv: {
      title: 'CV | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Resume of Peter Dinis — experience, stack, and contact. Print-ready or save as PDF.',
    },
    contact: {
      title: 'Contact | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Contact Peter Dinis — medior full-stack developer based in Prague. Email, phone, LinkedIn, and GitHub.',
    },
  },
}

const notFoundSeoCopy: Record<Lang, PageSeo> = {
  sk: {
    title: '404 | Stránka sa nenašla — Peter Dinis',
    description:
      'Táto stránka v portfóliu neexistuje. Vráť sa na úvod alebo preskúmaj dostupné sekcie.',
  },
  en: {
    title: '404 | Page not found — Peter Dinis',
    description:
      'This page does not exist in the portfolio. Return home or explore the available sections.',
  },
}

const errorSeoCopy: Record<Lang, PageSeo> = {
  sk: {
    title: '500 | Chyba — Peter Dinis',
    description:
      'V portfóliu nastala neočakávaná chyba. Skús obnoviť stránku alebo sa vráť na úvod.',
  },
  en: {
    title: '500 | Error — Peter Dinis',
    description:
      'An unexpected error occurred in the portfolio. Try reloading or return to the home page.',
  },
}

const projectListSeoCopy: Record<Lang, Record<ProjectListId, PageSeo>> = {
  sk: {
    'my-projects': {
      title: 'Moje projekty | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Osobné a open-source projekty — Docu-Nest, Scribe Notes, Boom Scope, Pulse API Client a SPST Knižnica.',
    },
  },
  en: {
    'my-projects': {
      title: 'My projects | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Personal and open-source projects — Docu-Nest, Scribe Notes, Boom Scope, Pulse API Client, and SPST Knižnica.',
    },
  },
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  }
  return 'https://peterdinis.dev'
}

export function resolveRouteSeo(lang: Lang, route: PortfolioRoute): PageSeo {
  if (route.page === 'not-found') return notFoundSeoCopy[lang]
  if (route.page === 'error') return errorSeoCopy[lang]

  if (route.page === 'projects' && route.projectList) {
    return projectListSeoCopy[lang][route.projectList]
  }

  if (route.page === 'projects' && route.projectId) {
    const project = projects.find((item) => item.id === route.projectId)
    const description =
      translations[lang].projects.find((p) => p.id === route.projectId)?.description ??
      pageSeoCopy[lang].projects.description
    const label = lang === 'sk' ? 'Projekt' : 'Project'

    return {
      title: `${project?.name ?? route.projectId} | ${label} — Peter Dinis`,
      description,
    }
  }

  if (route.page === 'notes' && route.noteId) {
    const note = getNote(route.noteId)
    const label = lang === 'sk' ? 'Článok' : 'Article'
    return {
      title: `${note?.title[lang] ?? route.noteId} | ${label} — Peter Dinis`,
      description: note?.summary[lang] ?? pageSeoCopy[lang].notes.description,
    }
  }

  if (route.page === DEFAULT_PAGE) return seoCopy[lang]
  return pageSeoCopy[lang][route.page]
}

export function ogImagePathForRoute(route: PortfolioRoute): string {
  if (route.page === 'projects' && route.projectId) {
    return `/og/projects/${route.projectId}.svg`
  }
  if (route.page === 'notes' && route.noteId) {
    return `/og/notes/${route.noteId}.svg`
  }
  if (route.page === 'projects' && route.projectList) {
    return `/og/projects.svg`
  }
  if (route.page === 'not-found' || route.page === 'error') {
    return '/og-image.jpg'
  }
  if (route.page === 'about') return '/og/about.svg'
  return `/og/${route.page}.svg`
}

function pageUrl(siteUrl: string, locale: Locale, page: NotionPageId): string {
  return `${siteUrl}${pageHref(locale, page)}`
}

function routeUrl(siteUrl: string, locale: Locale, route: PortfolioRoute): string {
  if (route.page === 'not-found' && route.attemptedPath) {
    return `${siteUrl}/${locale}/${route.attemptedPath}`
  }

  if (route.page === 'error') {
    return `${siteUrl}${pageHref(locale, 'error')}`
  }

  if (route.page === 'projects' && route.projectId) {
    return `${siteUrl}${projectHref(locale, route.projectId)}`
  }

  if (route.page === 'notes' && route.noteId) {
    return `${siteUrl}${noteHref(locale, route.noteId)}`
  }

  if (route.page === 'projects' && route.projectList) {
    return `${siteUrl}${projectListHref(locale, route.projectList)}`
  }

  if (route.page === 'not-found') return pageUrl(siteUrl, locale, DEFAULT_PAGE)
  return pageUrl(siteUrl, locale, route.page)
}

export function buildJsonLd(lang: Lang, locale: Locale, route: PortfolioRoute, siteUrl: string) {
  if (route.page === 'not-found' || route.page === 'error') return null

  const copy = resolveRouteSeo(lang, route)
  const isProjectDetail = route.page === 'projects' && Boolean(route.projectId)
  const isNoteDetail = route.page === 'notes' && Boolean(route.noteId)
  const currentUrl = routeUrl(siteUrl, locale, route)
  const projectsLabel = lang === 'sk' ? 'Projekty' : 'Projects'
  const notesLabel = lang === 'sk' ? 'Blog' : 'Blog'
  const pageLabel = isProjectDetail
    ? (getProjectName(route.projectId!) ?? route.projectId!)
    : isNoteDetail
      ? (getNoteTitle(route.noteId!, lang) ?? route.noteId!)
      : pageSeoCopy[lang][route.page].title.split(' | ')[0]

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE_NAME,
      item: `${siteUrl}/${locale}`,
    },
  ]

  if (isProjectDetail && route.projectId) {
    breadcrumbItems.push(
      {
        '@type': 'ListItem',
        position: 2,
        name: projectsLabel,
        item: pageUrl(siteUrl, locale, 'projects'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pageLabel,
        item: currentUrl || siteUrl,
      },
    )
  } else if (isNoteDetail && route.noteId) {
    breadcrumbItems.push(
      {
        '@type': 'ListItem',
        position: 2,
        name: notesLabel,
        item: pageUrl(siteUrl, locale, 'notes'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pageLabel,
        item: currentUrl || siteUrl,
      },
    )
  } else {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: pageLabel,
      item: currentUrl || siteUrl,
    })
  }

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: profile.name,
      jobTitle: translations[lang].profile.title,
      email: decodeEmail(),
      telephone: profile.phone,
      url: siteUrl,
      image: siteUrl ? `${siteUrl}/og-image.jpg` : undefined,
      sameAs: socials.map((s) => s.url),
      knowsAbout: profile.interests,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Prague',
        addressCountry: 'CZ',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: SITE_NAME,
      url: siteUrl,
      inLanguage: ['sk-SK', 'en-US'],
      author: { '@id': `${siteUrl}/#person` },
      description: seoCopy[lang].description,
    },
    {
      '@type': 'ProfilePage',
      '@id': `${currentUrl || siteUrl}#profile`,
      url: currentUrl || siteUrl,
      name: copy.title,
      description: copy.description,
      inLanguage: lang === 'sk' ? 'sk-SK' : 'en-US',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#person` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${currentUrl || siteUrl}#breadcrumb`,
      itemListElement: breadcrumbItems,
    },
  ]

  if (isProjectDetail && route.projectId) {
    const project = projects.find((item) => item.id === route.projectId)
    graph.push({
      '@type': 'CreativeWork',
      '@id': `${currentUrl}#project`,
      name: project?.name ?? route.projectId,
      description: copy.description,
      url: currentUrl,
      author: { '@id': `${siteUrl}/#person` },
      inLanguage: lang === 'sk' ? 'sk-SK' : 'en-US',
      keywords: project?.tech,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export function buildMetadata(locale: Locale, route: PortfolioRoute): Metadata {
  const lang = locale
  const site = seoCopy[lang]
  const copy = resolveRouteSeo(lang, route)
  const siteUrl = getSiteUrl()
  const canonical = routeUrl(siteUrl, locale, route)
  const ogPath = ogImagePathForRoute(route)
  const ogImage = `${siteUrl}${ogPath}`
  const noIndex = route.page === 'not-found' || route.page === 'error'

  const languages: Record<string, string> = {}
  for (const loc of LOCALES) {
    languages[loc] = routeUrl(siteUrl, loc, route)
  }
  languages['x-default'] = routeUrl(siteUrl, 'sk', route)

  return {
    title: copy.title,
    description: copy.description,
    keywords: site.keywords.split(', '),
    authors: [{ name: profile.name }],
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: 'website',
      siteName: SITE_NAME,
      locale: site.ogLocale,
      alternateLocale: [lang === 'sk' ? 'en_US' : 'sk_SK'],
      url: canonical,
      images: [{ url: ogImage, alt: copy.title, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [ogImage],
    },
  }
}

export const notionPagesForSitemap: NotionPageId[] = [
  'about',
  'now',
  'tech',
  'experience',
  'projects',
  'notes',
  'oss',
  'uses',
  'cv',
  'contact',
]

export const projectIdsForSitemap = projects.map((project) => project.id)
export const noteIdsForSitemap = notes.map((note) => note.id)
