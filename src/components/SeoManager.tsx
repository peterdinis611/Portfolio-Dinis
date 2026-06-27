import { useEffect, useState } from 'react'
import { pageFromHash } from '@/lib/portfolio-route'
import type { NotionPageId } from '@/components/notion/types'
import { SettingsContext } from '@/context/AppProviders'
import { applySeo } from '@/lib/seo'

export function SeoManager() {
  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const [page, setPage] = useState<NotionPageId>(() => pageFromHash())

  useEffect(() => {
    const syncPage = () => setPage(pageFromHash())
    window.addEventListener('hashchange', syncPage)
    syncPage()
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  useEffect(() => {
    applySeo(lang, page)
  }, [lang, page])

  return null
}
