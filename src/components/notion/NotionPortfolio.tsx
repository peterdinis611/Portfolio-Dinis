import { useCallback, useEffect, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SettingsContext } from '@/context/AppProviders'
import {
  parsePortfolioRoute,
  type PortfolioRoute,
  setPortfolioHash,
} from '@/lib/portfolio-route'
import { ErrorPage } from './pages/ErrorPage'
import { NotionPageView } from './NotionPageView'
import { PortfolioErrorBoundary } from './PortfolioErrorBoundary'
import type { PortfolioError } from './portfolio-error'
import { NotionSearchDialog } from './NotionSearchDialog'
import { NotionSidebar } from './NotionSidebar'
import { NotionTopbar } from './NotionTopbar'

export function NotionPortfolio() {
  const settingsActor = SettingsContext.useActorRef()
  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const theme = SettingsContext.useSelector((s) => s.context.theme)

  const [route, setRoute] = useState<PortfolioRoute>(() => parsePortfolioRoute())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [runtimeError, setRuntimeError] = useState<PortfolioError | null>(null)
  const [errorResetKey, setErrorResetKey] = useState(0)

  const navigate = useCallback((next: PortfolioRoute) => {
    setRuntimeError(null)
    setRoute(next)
    setPortfolioHash(next)
    setSidebarOpen(false)
  }, [])

  const handleRuntimeError = useCallback((error: PortfolioError) => {
    setRuntimeError(error)
  }, [])

  const handleErrorRetry = useCallback(() => {
    setRuntimeError(null)
    setErrorResetKey((key) => key + 1)
  }, [])

  useEffect(() => {
    const syncRoute = () => {
      const next = parsePortfolioRoute()
      setRuntimeError(null)
      setErrorResetKey((key) => key + 1)
      setRoute(next)
      return next
    }

    const initial = syncRoute()
    if (initial.page !== 'not-found' && initial.page !== 'error') {
      setPortfolioHash(initial)
    }

    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

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

  const topbarRoute: PortfolioRoute = runtimeError ? { page: 'error' } : route

  const mainContent = runtimeError ? (
    <ErrorPage lang={lang} error={runtimeError} onRetry={handleErrorRetry} />
  ) : (
    <PortfolioErrorBoundary resetKey={errorResetKey} onError={handleRuntimeError}>
      <NotionPageView lang={lang} route={route} darkMode={theme === 'dark'} />
    </PortfolioErrorBoundary>
  )

  return (
    <div className="notion-app-shell flex h-dvh overflow-hidden bg-background">
      <div className="hidden md:flex">
        <PortfolioErrorBoundary resetKey={errorResetKey} onError={handleRuntimeError}>
          <NotionSidebar lang={lang} route={route} onNavigate={navigate} />
        </PortfolioErrorBoundary>
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 md:hidden">
          <PortfolioErrorBoundary resetKey={errorResetKey} onError={handleRuntimeError}>
            <NotionSidebar
              lang={lang}
              route={route}
              onNavigate={navigate}
              className="w-full border-0"
            />
          </PortfolioErrorBoundary>
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
          route={topbarRoute}
          onMenu={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onLang={(l) => settingsActor.send({ type: 'SET_LANG', lang: l })}
          onTheme={() => settingsActor.send({ type: 'TOGGLE_THEME' })}
        />

        <main className="flex-1 overflow-y-auto" id="main-content">
          {mainContent}
        </main>
      </div>
    </div>
  )
}
