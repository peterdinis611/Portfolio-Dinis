import { type NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from '@/lib/locale'

const PUBLIC_FILE = /\.(.*)$/

const LEGACY_TOP_LEVEL = new Set([
  'tech',
  'experience',
  'projects',
  'notes',
  'now',
  'oss',
  'uses',
  'cv',
  'contact',
  'error',
])

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookie && isLocale(cookie)) return cookie

  const accept = request.headers.get('accept-language') ?? ''
  const lowered = accept.toLowerCase()
  if (lowered.includes('en') && !lowered.startsWith('sk')) return 'en'
  return DEFAULT_LOCALE
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/feed.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]

  if (!first) {
    const locale = preferredLocale(request)
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  if (isLocale(first)) {
    const response = NextResponse.next()
    response.cookies.set(LOCALE_COOKIE, first, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  // Legacy unprefixed routes → default/preferred locale
  if (LEGACY_TOP_LEVEL.has(first) || first === 'about') {
    const locale = preferredLocale(request)
    const rest = first === 'about' ? segments.slice(1) : segments
    const target = `/${locale}${rest.length ? `/${rest.join('/')}` : ''}`
    return NextResponse.redirect(new URL(target || `/${locale}`, request.url))
  }

  // Unknown unprefixed path → locale 404 path
  const locale = preferredLocale(request)
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
