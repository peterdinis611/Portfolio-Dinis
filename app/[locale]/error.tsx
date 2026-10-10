'use client'

import { useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { ErrorPage } from '@/components/notion/pages/ErrorPage'
import type { PortfolioError } from '@/components/notion/portfolio-error'
import { isLocale, localeFromPathname } from '@/lib/locale'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const params = useParams<{ locale?: string }>()
  const fromParams = typeof params?.locale === 'string' ? params.locale : ''
  const lang = isLocale(fromParams) ? fromParams : localeFromPathname(pathname)

  useEffect(() => {
    console.error('[portfolio]', error)
  }, [error])

  const portfolioError = error as PortfolioError

  return <ErrorPage lang={lang} error={portfolioError} onRetry={reset} />
}
