import { useEffect } from 'react'
import { SettingsContext } from '../context/AppProviders'
import { applySeo } from '../lib/seo'

export function SeoManager() {
  const lang = SettingsContext.useSelector((s) => s.context.lang)

  useEffect(() => {
    applySeo(lang)
  }, [lang])

  return null
}
