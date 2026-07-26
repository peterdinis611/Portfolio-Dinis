import { useCallback, useEffect, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SettingsContext } from '@/context/AppProviders'
import {
  parsePortfolioRoute,
  portfolioRouteEquals,
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
import { ScrollToTop } from './ScrollToTop'
import { cn } from '@/lib/utils'

const SIDEBAR_COLLAPSED_KEY = 'portfolio-sidebar-collapsed'

function readSidebarCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

export function NotionPortfolio() {
  const settingsActor = SettingsContext.useActorRef()
  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const theme = SettingsContext.useSelector((s) => s.context.theme)

  const [route, setRoute] = useState<PortfolioRoute>(() => parsePortfolioRoute())
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarCollapsed)
  const [searchOpen, setSearchOpen] = useState(false)
  const [runtimeError, setRuntimeError] = useState<PortfolioError | null>(null)
  const [errorResetKey, setErrorResetKey] = useState(0)

  const persistCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [])

  const navigate = useCallback((next: PortfolioRoute) => {
    setRuntimeError(null)
    setRoute(next)
    setPortfolioHash(next)
    setMobileSidebarOpen(false)
    requestAnimationFrame(() => {
      const pane = document.getElementById('main-content')
      if (pane) pane.scrollTop = 0
    })
  }, [])

  const handleRuntimeError = useCallback((error: PortfolioError) => {
    setRuntimeError(error)
  }, [])

  const handleErrorRetry = useCallback(() => {
    setRuntimeError(null)
    setErrorResetKey((key) => key + 1)
  }, [])

  useEffect(() => {
    let currentRoute = parsePortfolioRoute()
    setRoute(currentRoute)

    if (currentRoute.page !== 'not-found' && currentRoute.page !== 'error') {
      setPortfolioHash(currentRoute)
    }

    const syncRoute = () => {
      const next = parsePortfolioRoute()
      if (portfolioRouteEquals(currentRoute, next)) return
      currentRoute = next
      setRuntimeError(null)
      setErrorResetKey((key) => key + 1)
      setRoute(next)
      requestAnimationFrame(() => {
        const pane = document.getElementById('main-content')
        if (pane) pane.scrollTop = 0
      })
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
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key === '\\') {
        event.preventDefault()
        if (window.matchMedia('(min-width: 768px)').matches) {
          persistCollapsed(!sidebarCollapsed)
        } else {
          setMobileSidebarOpen((open) => !open)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [persistCollapsed, sidebarCollapsed])

  const topbarRoute: PortfolioRoute = runtimeError ? { page: 'error' } : route

  const mainContent = runtimeError ? (
    <ErrorPage lang={lang} error={runtimeError} onRetry={handleErrorRetry} />
  ) : (
    <PortfolioErrorBoundary resetKey={errorResetKey} onError={handleRuntimeError}>
      <NotionPageView
        key={`${lang}-${route.page}-${route.projectId ?? ''}-${route.projectList ?? ''}-${route.attemptedPath ?? ''}`}
        lang={lang}
        route={route}
        darkMode={theme === 'dark'}
      />
    </PortfolioErrorBoundary>
  )

  return (
    <div className="notion-app-shell flex h-dvh overflow-hidden bg-background">
      <div
        className={cn(
          'notion-sidebar-shell hidden overflow-hidden border-r border-sidebar-border md:block',
          sidebarCollapsed && 'border-transparent',
        )}
        data-collapsed={sidebarCollapsed ? 'true' : 'false'}
        aria-hidden={sidebarCollapsed}
      >
        <PortfolioErrorBoundary resetKey={errorResetKey} onError={handleRuntimeError}>
          <NotionSidebar
            lang={lang}
            route={route}
            onNavigate={navigate}
            onOpenSearch={() => setSearchOpen(true)}
            onCollapse={() => persistCollapsed(true)}
          />
        </PortfolioErrorBoundary>
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[min(100%,280px)] border-r border-sidebar-border bg-sidebar p-0 md:hidden"
        >
          <PortfolioErrorBoundary resetKey={errorResetKey} onError={handleRuntimeError}>
            <NotionSidebar
              lang={lang}
              route={route}
              onNavigate={navigate}
              onOpenSearch={() => {
                setMobileSidebarOpen(false)
                setSearchOpen(true)
              }}
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
          sidebarCollapsed={sidebarCollapsed}
          onMenu={() => setMobileSidebarOpen(true)}
          onOpenSidebar={() => persistCollapsed(false)}
          onOpenSearch={() => setSearchOpen(true)}
          onLang={(l) => settingsActor.send({ type: 'SET_LANG', lang: l })}
          onTheme={() => settingsActor.send({ type: 'TOGGLE_THEME' })}
        />

        <main className="notion-page-pane flex-1 overflow-y-auto scroll-smooth" id="main-content">
          {mainContent}
        </main>
        <ScrollToTop lang={lang} />
      </div>
    </div>
  )
}
