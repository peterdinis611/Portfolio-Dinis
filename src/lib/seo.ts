import { pageFromHash } from '@/components/notion/nav'
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
    title: 'Peter Dinis | Full-Stack Developer — Portfólio',
    description:
      'Notion-style portfólio full-stack developera Petra Dinisa. React, TypeScript, Node.js, cloud, skúsenosti, projekty a kontakt.',
    keywords:
      'Peter Dinis, full-stack developer, React, TypeScript, Node.js, NestJS, portfólio, Praha, frontend, backend, UX',
    ogLocale: 'sk_SK',
  },
  en: {
    title: 'Peter Dinis | Full-Stack Developer — Portfolio',
    description:
      'Notion-style portfolio of full-stack developer Peter Dinis. React, TypeScript, Node.js, cloud, experience, projects and contact.',
    keywords:
      'Peter Dinis, full-stack developer, React, TypeScript, Node.js, NestJS, portfolio, Prague, frontend, backend, UX',
    ogLocale: 'en_US',
  },
}

const pageSeoCopy: Record<Lang, Record<NotionPageId, PageSeo>> = {
  sk: {
    about: {
      title: 'O mne | Peter Dinis — Full-Stack Developer',
      description:
        'Full-stack developer so zameraním na React, TypeScript a čisté UX. Bio, služby, technológie a záujmy.',
    },
    tech: {
      title: 'Technológie | Peter Dinis — Full-Stack Developer',
      description:
        'Tech stack: React, Next.js, TypeScript, Node.js, NestJS, PostgreSQL, Docker, AWS, Azure a ďalšie.',
    },
    experience: {
      title: 'Skúsenosti | Peter Dinis — Full-Stack Developer',
      description:
        'Pracovné skúsenosti v Prahe a na Slovensku — IBA.CZ, Meditorial, JUMP soft, Navisys a ďalšie.',
    },
    projects: {
      title: 'Projekty | Peter Dinis — Full-Stack Developer',
      description:
        'Vybrané projekty: Legato, Carter, školská knižnica, e-shop licencií a ďalšie produkčné práce.',
    },
    contact: {
      title: 'Kontakt | Peter Dinis — Full-Stack Developer',
      description:
        'Kontaktuj Petra Dinisa — email, telefón, LinkedIn a GitHub. Full-stack developer v Prahe.',
    },
  },
  en: {
    about: {
      title: 'About | Peter Dinis — Full-Stack Developer',
      description:
        'Full-stack developer focused on React, TypeScript and sharp UX. Bio, services, technologies and interests.',
    },
    tech: {
      title: 'Technologies | Peter Dinis — Full-Stack Developer',
      description:
        'Tech stack: React, Next.js, TypeScript, Node.js, NestJS, PostgreSQL, Docker, AWS, Azure and more.',
    },
    experience: {
      title: 'Experience | Peter Dinis — Full-Stack Developer',
      description:
        'Work experience in Prague and Slovakia — IBA.CZ, Meditorial, JUMP soft, Navisys and more.',
    },
    projects: {
      title: 'Projects | Peter Dinis — Full-Stack Developer',
      description:
        'Selected projects: Legato, Carter, school library system, license e-shop and other production work.',
    },
    contact: {
      title: 'Contact | Peter Dinis — Full-Stack Developer',
      description:
        'Contact Peter Dinis — email, phone, LinkedIn and GitHub. Full-stack developer based in Prague.',
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
