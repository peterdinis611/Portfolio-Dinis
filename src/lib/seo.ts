import { parsePortfolioRoute, getProjectName, type PortfolioRoute } from '@/lib/portfolio-route'
import type { NotionPageId } from '@/components/notion/types'
import { profile, projects, socials, type ProjectListId } from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
import { caseStudyContent } from '@/i18n/portfolio-template'
import { decodeEmail } from './email'

const SITE_NAME = 'Peter Dinis — Portfolio'
const JSON_LD_ID = 'portfolio-jsonld'
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
    description: 'Táto stránka v portfóliu neexistuje. Vráť sa na úvod alebo preskúmaj dostupné sekcie.',
  },
  en: {
    title: '404 | Page not found — Peter Dinis',
    description: 'This page does not exist in the portfolio. Return home or explore the available sections.',
  },
}

export function getSiteUrl(): string {
  const envUrl = import.meta.env.VITE_SITE_URL as string | undefined
  if (envUrl) return envUrl.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

function getStoredLang(): Lang {
  try {
    return localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'sk'
  } catch {
    return 'sk'
  }
}

const projectListSeoCopy: Record<Lang, Record<ProjectListId, PageSeo>> = {
  sk: {
    'companies-projects': {
      title: 'Firemné projekty | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Produkčné projekty z firemných rolí — ÚDZS, EForms, prolekare.cz, enterprise licenčný systém a IBA R&D.',
    },
    'my-projects': {
      title: 'Moje projekty | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Osobné a open-source projekty — Docu-Nest, Scribe Notes, Boom Scope, Pulse API Client a SPST Knižnica.',
    },
  },
  en: {
    'companies-projects': {
      title: 'Company projects | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Production projects from company roles — ÚDZS, EForms, prolekare.cz, enterprise license system, and IBA R&D.',
    },
    'my-projects': {
      title: 'My projects | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Personal and open-source projects — Docu-Nest, Scribe Notes, Boom Scope, Pulse API Client, and SPST Knižnica.',
    },
  },
}

function resolveRouteSeo(lang: Lang, route: PortfolioRoute): PageSeo {
  if (route.page === 'not-found') return notFoundSeoCopy[lang]

  if (route.page === 'projects' && route.projectList) {
    return projectListSeoCopy[lang][route.projectList]
  }

  if (route.page === 'projects' && route.projectId) {
    const project = projects.find((item) => item.id === route.projectId)
    const study = caseStudyContent[lang][route.projectId]
    const label = lang === 'sk' ? 'Projekt' : 'Project'

    return {
      title: `${project?.name ?? route.projectId} | ${label} — Peter Dinis`,
      description: study?.overview ?? pageSeoCopy[lang].projects.description,
    }
  }

  if (route.page === DEFAULT_PAGE) return seoCopy[lang]
  return pageSeoCopy[lang][route.page]
}

function pageUrl(siteUrl: string, page: NotionPageId): string {
  const base = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  if (!base) return ''
  return page === DEFAULT_PAGE ? base : `${base}/#${page}`
}

function projectUrl(siteUrl: string, projectId: string): string {
  const base = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  if (!base) return ''
  return `${base}/#projects/${projectId}`
}

function routeUrl(siteUrl: string, route: PortfolioRoute): string {
  if (route.page === 'not-found' && route.attemptedPath) {
    const origin = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')
    return origin ? `${origin}/#${route.attemptedPath}` : ''
  }

  if (route.page === 'projects' && route.projectId) {
    return projectUrl(siteUrl, route.projectId)
  }

  if (route.page === 'projects' && route.projectList) {
    const base = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')
    return base ? `${base}/#projects/${route.projectList}` : ''
  }

  if (route.page === 'not-found') return pageUrl(siteUrl, DEFAULT_PAGE)
  return pageUrl(siteUrl, route.page)
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

function buildJsonLd(lang: Lang, route: PortfolioRoute, siteUrl: string) {
  if (route.page === 'not-found') return null

  const copy = resolveRouteSeo(lang, route)
  const isProjectDetail = route.page === 'projects' && Boolean(route.projectId)
  const currentUrl = routeUrl(siteUrl, route)
  const projectsLabel = lang === 'sk' ? 'Projekty' : 'Projects'
  const pageLabel = isProjectDetail
    ? (getProjectName(route.projectId!) ?? route.projectId!)
    : pageSeoCopy[lang][route.page].title.split(' | ')[0]

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE_NAME,
      item: siteUrl,
    },
  ]

  if (isProjectDetail && route.projectId) {
    breadcrumbItems.push(
      {
        '@type': 'ListItem',
        position: 2,
        name: projectsLabel,
        item: pageUrl(siteUrl, 'projects'),
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

function setJsonLd(lang: Lang, route: PortfolioRoute, siteUrl: string) {
  const data = buildJsonLd(lang, route, siteUrl)
  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null

  if (!data) {
    script?.remove()
    return
  }

  if (!script) {
    script = document.createElement('script')
    script.id = JSON_LD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function applySeo(lang: Lang, route: PortfolioRoute = { page: DEFAULT_PAGE }) {
  const site = seoCopy[lang]
  const copy = resolveRouteSeo(lang, route)
  const siteUrl = getSiteUrl()
  const canonical = routeUrl(siteUrl, route)
  const ogImage = siteUrl ? `${siteUrl}/og-image.jpg` : '/og-image.jpg'

  document.documentElement.lang = lang
  document.title = copy.title

  setMeta('description', copy.description)
  setMeta('keywords', site.keywords)
  setMeta('author', profile.name)
  setMeta('robots', route.page === 'not-found' ? 'noindex, follow' : 'index, follow, max-image-preview:large')
  setMeta('googlebot', 'index, follow')

  setMeta('og:title', copy.title, true)
  setMeta('og:description', copy.description, true)
  setMeta('og:type', 'website', true)
  setMeta('og:site_name', SITE_NAME, true)
  setMeta('og:locale', site.ogLocale, true)
  setMeta('og:locale:alternate', lang === 'sk' ? 'en_US' : 'sk_SK', true)
  setMeta('og:image', ogImage, true)
  setMeta('og:image:alt', `${profile.name} — ${translations[lang].profile.title}`, true)
  if (canonical) setMeta('og:url', canonical, true)

  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', copy.title)
  setMeta('twitter:description', copy.description)
  setMeta('twitter:image', ogImage)
  setMeta('twitter:image:alt', `${profile.name} — ${translations[lang].profile.title}`)

  if (canonical) {
    setLink('canonical', canonical)
    setLink('alternate', canonical, 'sk')
    setLink('alternate', canonical, 'en')
    setLink('alternate', canonical, 'x-default')
  }

  if (siteUrl) setJsonLd(lang, route, siteUrl)
}

/** Run once before React mounts — uses stored language and current hash. */
export function initSeo() {
  const route = typeof window !== 'undefined' ? parsePortfolioRoute() : { page: DEFAULT_PAGE }
  applySeo(getStoredLang(), route)
}

export const notionPagesForSitemap: NotionPageId[] = [
  'about',
  'tech',
  'experience',
  'projects',
  'contact',
]

export const projectIdsForSitemap = projects.map((project) => project.id)
