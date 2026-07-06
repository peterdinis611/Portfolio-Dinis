import type { ErrorInfo } from 'react'

export type PortfolioError = Error & {
  componentStack?: string
}

export function enrichPortfolioError(error: Error, info: ErrorInfo): PortfolioError {
  const enriched = error as PortfolioError
  enriched.componentStack = info.componentStack ?? undefined
  return enriched
}
