import { useEffect, useState } from 'react'
import { SettingsContext } from '@/context/AppProviders'
import { type PortfolioRoute, parsePortfolioRoute } from '@/lib/portfolio-route'
import { applySeo } from '@/lib/seo'

export function SeoManager() {
  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const [route, setRoute] = useState<PortfolioRoute>(() => parsePortfolioRoute())

  useEffect(() => {
    const syncRoute = () => setRoute(parsePortfolioRoute())
    window.addEventListener('portfolio:navigate', syncRoute)
    window.addEventListener('popstate', syncRoute)
    syncRoute()
    return () => {
      window.removeEventListener('portfolio:navigate', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

  useEffect(() => {
    applySeo(lang, route)
  }, [lang, route])

  return null
}
