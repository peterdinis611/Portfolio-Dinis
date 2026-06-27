import { pageFromHash } from '@/lib/portfolio-route'
import type { NotionPageId } from '@/components/notion/types'
import { profile, socials } from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
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
        'Produkčné projekty: ÚDZS, EForms, prolekare.cz, enterprise licenčný systém a IBA R&D aplikácie.',
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
        'Production projects: ÚDZS, EForms, prolekare.cz, enterprise license system, and IBA R&D applications.',
    },
    contact: {
      title: 'Contact | Peter Dinis — Medior Full-Stack Developer',
      description:
        'Contact Peter Dinis — medior full-stack developer based in Prague. Email, phone, LinkedIn, and GitHub.',
    },
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

function resolvePageSeo(lang: Lang, page: NotionPageId): PageSeo {
  if (page === DEFAULT_PAGE) return seoCopy[lang]
  return pageSeoCopy[lang][page]
}

function pageUrl(siteUrl: string, page: NotionPageId): string {
  const base = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  if (!base) return ''
  return page === DEFAULT_PAGE ? base : `${base}/#${page}`
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

function buildJsonLd(lang: Lang, page: NotionPageId, siteUrl: string) {
  const t = translations[lang]
  const copy = resolvePageSeo(lang, page)
  const currentUrl = pageUrl(siteUrl, page)
  const pageLabel = pageSeoCopy[lang][page].title.split(' | ')[0]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: profile.name,
        jobTitle: t.profile.title,
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
        '@id': `${siteUrl}/#profile`,
        url: currentUrl || siteUrl,
        name: copy.title,
        description: copy.description,
        inLanguage: lang === 'sk' ? 'sk-SK' : 'en-US',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${currentUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: SITE_NAME,
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: pageLabel,
            item: currentUrl || siteUrl,
          },
        ],
      },
    ],
  }
}

function setJsonLd(lang: Lang, page: NotionPageId, siteUrl: string) {
  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = JSON_LD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(buildJsonLd(lang, page, siteUrl))
}

export function applySeo(lang: Lang, page: NotionPageId = DEFAULT_PAGE) {
  const site = seoCopy[lang]
  const copy = resolvePageSeo(lang, page)
  const siteUrl = getSiteUrl()
  const canonical = pageUrl(siteUrl, page)
  const ogImage = siteUrl ? `${siteUrl}/og-image.jpg` : '/og-image.jpg'

  document.documentElement.lang = lang
  document.title = copy.title

  setMeta('description', copy.description)
  setMeta('keywords', site.keywords)
  setMeta('author', profile.name)
  setMeta('robots', 'index, follow, max-image-preview:large')
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

  if (siteUrl) setJsonLd(lang, page, siteUrl)
}

/** Run once before React mounts — uses stored language and current hash. */
export function initSeo() {
  const page = typeof window !== 'undefined' ? pageFromHash() : DEFAULT_PAGE
  applySeo(getStoredLang(), page)
}

export const notionPagesForSitemap: NotionPageId[] = [
  'about',
  'tech',
  'experience',
  'projects',
  'contact',
]
