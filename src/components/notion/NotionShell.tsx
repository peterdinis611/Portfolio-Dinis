'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SettingsContext } from '@/context/AppProviders'
import { translations } from '@/i18n/translations'
import type { Locale } from '@/lib/locale'
import { swapLocalePath } from '@/lib/locale'
import { type PortfolioRoute, parsePortfolioRoute, routeToPath } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import { NotionRoutePending } from './NotionRoutePending'
import { NotionSidebar } from './NotionSidebar'
import { NotionTopbar } from './NotionTopbar'
import { PageMotion } from './PageMotion'
import { PortfolioErrorBoundary } from './PortfolioErrorBoundary'
import { ErrorPage } from './pages/ErrorPage'
import type { PortfolioError } from './portfolio-error'
import { RoutePendingProvider, useRoutePending } from './RoutePending'
import { ScrollToTop } from './ScrollToTop'

const SIDEBAR_COLLAPSED_KEY = 'portfolio-sidebar-collapsed'

/** Fuse/notes/confetti stay out of the initial shell chunk until ⌘K opens. */
const NotionSearchDialog = dynamic(
  () => import('./NotionSearchDialog').then((mod) => mod.NotionSearchDialog),
  { ssr: false },
)

function readSidebarCollapsed() {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

type NotionShellProps = {
  locale: Locale
  children: ReactNode
}

export function NotionShell({ locale, children }: NotionShellProps) {
  return (
    <RoutePendingProvider>
      <NotionShellInner locale={locale}>{children}</NotionShellInner>
    </RoutePendingProvider>
  )
}

function NotionShellInner({ locale, children }: NotionShellProps) {
  const settingsActor = SettingsContext.useActorRef()
  const theme = SettingsContext.useSelector((s) => s.context.theme)
  const animations = SettingsContext.useSelector((s) => s.context.animations)
  const pathname = usePathname()
  const router = useRouter()
  const { showSpinner, begin: beginPending } = useRoutePending()

  const route = useMemo(() => parsePortfolioRoute(pathname), [pathname])

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [runtimeError, setRuntimeError] = useState<PortfolioError | null>(null)
  const [errorResetKey, setErrorResetKey] = useState(0)
  const [motionReady, setMotionReady] = useState(false)

  const scrollPositions = useRef(new Map<string, number>())
  const isPopNavigation = useRef(false)

  useEffect(() => {
    setSidebarCollapsed(readSidebarCollapsed())
    const id = window.setTimeout(() => setMotionReady(true), 40)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      isPopNavigation.current = true
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    setRuntimeError(null)
    setErrorResetKey((key) => key + 1)

    const pane = document.getElementById('main-content')
    if (!pane) return

    const restore = isPopNavigation.current
    const saved = scrollPositions.current.get(pathname) ?? 0
    isPopNavigation.current = false

    requestAnimationFrame(() => {
      pane.scrollTop = restore ? saved : 0
    })

    return () => {
      scrollPositions.current.set(pathname, pane.scrollTop)
    }
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hashPath = window.location.hash.replace(/^#\/?/, '').trim()
    if (!hashPath) return
    const hashRoute = parsePortfolioRoute(`/${locale}/${hashPath}`)
    const target = routeToPath(
      locale,
      hashRoute.page === 'not-found' ? { page: 'about' } : hashRoute,
    )
    router.replace(target)
  }, [locale, router])

  const persistCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [])

  /** Full navigation (search / programmatic). */
  const navigate = useCallback(
    (next: PortfolioRoute) => {
      setRuntimeError(null)
      setMobileSidebarOpen(false)
      beginPending()
      router.push(routeToPath(locale, next))
    },
    [beginPending, locale, router],
  )

  /** Side effects after NotionLink navigation — spinner is handled by the link. */
  const onNavIntent = useCallback(() => {
    setRuntimeError(null)
    setMobileSidebarOpen(false)
  }, [])

  const handleRuntimeError = useCallback((error: PortfolioError) => {
    setRuntimeError(error)
  }, [])

  const handleErrorRetry = useCallback(() => {
    setRuntimeError(null)
    setErrorResetKey((key) => key + 1)
  }, [])

  const switchLang = useCallback(
    (next: Locale) => {
      beginPending()
      router.replace(swapLocalePath(pathname, next))
    },
    [beginPending, pathname, router],
  )

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
    <ErrorPage lang={locale} error={runtimeError} onRetry={handleErrorRetry} />
  ) : (
    <PortfolioErrorBoundary resetKey={errorResetKey} onError={handleRuntimeError}>
      <PageMotion routeKey={pathname}>{children}</PageMotion>
    </PortfolioErrorBoundary>
  )

  const ui = translations[locale].ui

  return (
    <div
      className="notion-app-shell flex h-dvh overflow-hidden bg-background"
      data-motion-ready={motionReady ? 'true' : 'false'}
    >
      <a href="#main-content" className="skip-link">
        {ui.skipToContent}
      </a>

      <div
        className={cn(
          'notion-sidebar-shell hidden overflow-hidden border-r border-sidebar-border md:block',
          sidebarCollapsed && 'border-transparent',
        )}
        data-collapsed={sidebarCollapsed ? 'true' : 'false'}
        aria-hidden={sidebarCollapsed || undefined}
        inert={sidebarCollapsed ? true : undefined}
      >
        <PortfolioErrorBoundary resetKey={errorResetKey} onError={handleRuntimeError}>
          <NotionSidebar
            lang={locale}
            route={route}
            onNavigate={navigate}
            onNavIntent={onNavIntent}
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
              lang={locale}
              route={route}
              onNavigate={navigate}
              onNavIntent={onNavIntent}
              className="w-full border-0"
            />
          </PortfolioErrorBoundary>
        </SheetContent>
      </Sheet>

      {searchOpen ? (
        <NotionSearchDialog
          lang={locale}
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onNavigate={navigate}
          actions={{
            theme,
            animations,
            onToggleTheme: () => settingsActor.send({ type: 'TOGGLE_THEME' }),
            onToggleLang: () => switchLang(locale === 'sk' ? 'en' : 'sk'),
            onToggleAnimations: () => settingsActor.send({ type: 'TOGGLE_ANIMATIONS' }),
          }}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <NotionTopbar
          lang={locale}
          theme={theme}
          animations={animations}
          route={topbarRoute}
          sidebarCollapsed={sidebarCollapsed}
          onMenu={() => setMobileSidebarOpen(true)}
          onOpenSidebar={() => persistCollapsed(false)}
          onOpenSearch={() => setSearchOpen(true)}
          onLang={switchLang}
          onTheme={() => settingsActor.send({ type: 'TOGGLE_THEME' })}
          onAnimations={() => settingsActor.send({ type: 'TOGGLE_ANIMATIONS' })}
        />

        <main
          className={cn(
            'notion-page-pane relative flex-1 overflow-y-auto',
            animations === 'on' && 'scroll-smooth',
          )}
          id="main-content"
          tabIndex={-1}
          aria-label={ui.notionMain}
          aria-busy={showSpinner || undefined}
        >
          {mainContent}
          <NotionRoutePending lang={locale} active={showSpinner} />
        </main>
        <ScrollToTop lang={locale} />
      </div>
    </div>
  )
}
