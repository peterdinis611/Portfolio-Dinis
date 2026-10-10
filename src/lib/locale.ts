import type { Lang } from '@/i18n/translations'

export const LOCALES = ['sk', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'sk'
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function toLang(locale: string): Lang {
  return isLocale(locale) ? locale : DEFAULT_LOCALE
}

/** First path segment as locale, or default. Safe for error/not-found (no params). */
export function localeFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return DEFAULT_LOCALE
  const segment = pathname.split('/').filter(Boolean)[0]
  return isLocale(segment) ? segment : DEFAULT_LOCALE
}

/** Path after `/{locale}/…` for 404 “attempted path” display. */
export function attemptedPathFromPathname(pathname: string | null | undefined): string | undefined {
  if (!pathname) return undefined
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return undefined
  if (isLocale(parts[0])) {
    const rest = parts.slice(1).join('/')
    return rest || undefined
  }
  return parts.join('/')
}

/** Swap locale segment in a pathname, preserving the rest of the path + search. */
export function swapLocalePath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split('/')
  if (segments.length >= 2 && isLocale(segments[1])) {
    segments[1] = nextLocale
    return segments.join('/') || `/${nextLocale}`
  }
  return `/${nextLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}
