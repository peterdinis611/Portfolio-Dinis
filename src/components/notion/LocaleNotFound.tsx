'use client'

import { usePathname } from 'next/navigation'
import { NotFoundPage } from '@/components/notion/pages/NotFoundPage'
import { attemptedPathFromPathname, localeFromPathname } from '@/lib/locale'

/** `not-found.tsx` has no `params` — resolve locale + path from the URL. */
export function LocaleNotFound() {
  const pathname = usePathname()
  const lang = localeFromPathname(pathname)
  const attemptedPath = attemptedPathFromPathname(pathname)

  return <NotFoundPage lang={lang} attemptedPath={attemptedPath} />
}
