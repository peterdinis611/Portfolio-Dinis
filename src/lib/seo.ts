import { decodeEmail } from './email'
import { profile, socials } from '../data/portfolio'
import { type Lang, translations } from '../i18n/translations'

const SITE_NAME = 'Peter Dinis — Portfolio'
const JSON_LD_ID = 'portfolio-jsonld'

export const seoCopy = {
  sk: {
    title: 'Peter Dinis | Full-Stack Developer — Interaktívne portfólio',
    description:
      'Portfólio full-stack developera Petra Dinisa. React, TypeScript, Node.js, cloud a UX — skúsenosti, projekty a kontakt v interaktívnej knihe.',
    keywords:
      'Peter Dinis, full-stack developer, React, TypeScript, Node.js, NestJS, portfólio, Praha, frontend, backend',
    ogLocale: 'sk_SK',
  },
  en: {
    title: 'Peter Dinis | Full-Stack Developer — Interactive Portfolio',
    description:
      'Portfolio of full-stack developer Peter Dinis. React, TypeScript, Node.js, cloud and UX — experience, projects and contact in an interactive book.',
    keywords:
      'Peter Dinis, full-stack developer, React, TypeScript, Node.js, NestJS, portfolio, Prague, frontend, backend',
    ogLocale: 'en_US',
  },
} as const

function getSiteUrl(): string {
  const envUrl = import.meta.env.VITE_SITE_URL as string | undefined
  if (envUrl) return envUrl.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
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

function buildJsonLd(lang: Lang, siteUrl: string) {
  const t = translations[lang]

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
          addressLocality: lang === 'sk' ? 'Praha' : 'Prague',
          addressCountry: lang === 'sk' ? 'CZ' : 'CZ',
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
        url: siteUrl,
        name: seoCopy[lang].title,
        description: seoCopy[lang].description,
        inLanguage: lang === 'sk' ? 'sk-SK' : 'en-US',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
      },
    ],
  }
}

function setJsonLd(lang: Lang, siteUrl: string) {
  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = JSON_LD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(buildJsonLd(lang, siteUrl))
}

export function applySeo(lang: Lang) {
  const copy = seoCopy[lang]
  const siteUrl = getSiteUrl()
  const pageUrl = siteUrl || (typeof window !== 'undefined' ? window.location.href : '')
  const ogImage = siteUrl ? `${siteUrl}/og-image.jpg` : '/og-image.jpg'

  document.documentElement.lang = lang
  document.title = copy.title

  setMeta('description', copy.description)
  setMeta('keywords', copy.keywords)
  setMeta('author', profile.name)
  setMeta('robots', 'index, follow, max-image-preview:large')
  setMeta('googlebot', 'index, follow')

  setMeta('og:title', copy.title, true)
  setMeta('og:description', copy.description, true)
  setMeta('og:type', 'website', true)
  setMeta('og:site_name', SITE_NAME, true)
  setMeta('og:locale', copy.ogLocale, true)
  setMeta('og:image', ogImage, true)
  setMeta('og:image:alt', `${profile.name} — ${translations[lang].profile.title}`, true)
  if (pageUrl) setMeta('og:url', pageUrl, true)

  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', copy.title)
  setMeta('twitter:description', copy.description)
  setMeta('twitter:image', ogImage)

  if (pageUrl) {
    setLink('canonical', pageUrl)
    setLink('alternate', pageUrl, 'sk')
    setLink('alternate', pageUrl, 'en')
    setLink('alternate', pageUrl, 'x-default')
  }

  setJsonLd(lang, siteUrl)
}

/** Run once before React mounts — uses stored language preference. */
export function initSeo() {
  let lang: Lang = 'sk'
  try {
    lang = localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'sk'
  } catch {
    /* ignore */
  }
  applySeo(lang)
}
