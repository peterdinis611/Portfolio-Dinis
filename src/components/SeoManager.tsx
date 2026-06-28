import { useEffect, useState } from 'react'
import { parsePortfolioRoute, type PortfolioRoute } from '@/lib/portfolio-route'
import { SettingsContext } from '@/context/AppProviders'
import { applySeo } from '@/lib/seo'

export function SeoManager() {
  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const [route, setRoute] = useState<PortfolioRoute>(() => parsePortfolioRoute())

  useEffect(() => {
    const syncRoute = () => setRoute(parsePortfolioRoute())
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    syncRoute()
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

  useEffect(() => {
    applySeo(lang, route)
  }, [lang, route])

  return null
}
