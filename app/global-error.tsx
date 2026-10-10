'use client'

import { DM_Sans, Instrument_Serif } from 'next/font/google'
import { useEffect } from 'react'
import { ErrorPage } from '@/components/notion/pages/ErrorPage'
import type { PortfolioError } from '@/components/notion/portfolio-error'
import { DEFAULT_LOCALE } from '@/lib/locale'
import '@/index.css'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

/** Replaces the root layout when an error escapes all other boundaries. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[portfolio:global]', error)
  }, [error])

  return (
    <html
      lang={DEFAULT_LOCALE}
      className={`${dmSans.variable} ${instrumentSerif.variable}`}
      data-theme="light"
      data-animations="on"
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans antialiased text-foreground">
        <main className="mx-auto min-h-dvh max-w-[720px] px-4 py-8 sm:px-8">
          <ErrorPage lang={DEFAULT_LOCALE} error={error as PortfolioError} onRetry={reset} />
        </main>
      </body>
    </html>
  )
}
