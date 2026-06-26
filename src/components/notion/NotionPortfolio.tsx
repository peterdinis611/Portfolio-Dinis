import { useCallback, useEffect, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SettingsContext } from '@/context/AppProviders'
import { NotionPageView } from './NotionPageView'
import { NotionSearchDialog } from './NotionSearchDialog'
import { NotionSidebar } from './NotionSidebar'
import { NotionTopbar } from './NotionTopbar'
import { pageFromHash, setPageHash } from './nav'
import type { NotionPageId } from './types'

export function NotionPortfolio() {
  const settingsActor = SettingsContext.useActorRef()
  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const theme = SettingsContext.useSelector((s) => s.context.theme)

  const [page, setPage] = useState<NotionPageId>(() => pageFromHash())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const navigate = useCallback((next: NotionPageId) => {
    setPage(next)
    setPageHash(next)
    setSidebarOpen(false)
  }, [])

  useEffect(() => {
    const onHash = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHash)
    setPageHash(page)
    return () => window.removeEventListener('hashchange', onHash)
  }, [page])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="notion-app-shell flex h-dvh overflow-hidden bg-background">
      <div className="hidden md:flex">
        <NotionSidebar lang={lang} page={page} onNavigate={navigate} />
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 md:hidden">
          <NotionSidebar
            lang={lang}
            page={page}
            onNavigate={navigate}
            className="w-full border-0"
          />
        </SheetContent>
      </Sheet>

      <NotionSearchDialog
        lang={lang}
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onNavigate={navigate}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <NotionTopbar
          lang={lang}
          theme={theme}
          page={page}
          onMenu={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onLang={(l) => settingsActor.send({ type: 'SET_LANG', lang: l })}
          onTheme={() => settingsActor.send({ type: 'TOGGLE_THEME' })}
        />

        <main className="flex-1 overflow-y-auto" id="main-content">
          <NotionPageView lang={lang} page={page} darkMode={theme === 'dark'} />
        </main>
      </div>
    </div>
  )
}
