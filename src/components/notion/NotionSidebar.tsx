'use client'

import { ChevronRight, PanelLeftClose } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Lang, translations } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { routeToPath } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import { getNotionPages, getProjectNavItems, isProjectsOverviewActive } from './nav'
import { NotionLink } from './NotionLink'
import { ProjectIcon } from './ProjectIcon'
import type { NotionPageId } from './types'

type NotionSidebarProps = {
  lang: Lang
  route: PortfolioRoute
  onNavigate: (route: PortfolioRoute) => void
  /** Called when a Link handles routing — close sheet / clear errors only. */
  onNavIntent?: () => void
  onCollapse?: () => void
  className?: string
}

function navActive(active: boolean) {
  return {
    'data-active': active ? true : undefined,
    'aria-current': active ? ('page' as const) : undefined,
  }
}

export function NotionSidebar({
  lang,
  route,
  onNavigate: _onNavigate,
  onNavIntent,
  onCollapse,
  className,
}: NotionSidebarProps) {
  // `_onNavigate` kept for Storybook / callers; Links use `onNavIntent` for side effects only.
  void _onNavigate
  const afterLink = onNavIntent ?? (() => {})
  const ui = translations[lang].ui
  const pages = getNotionPages(lang)
  const mainPages = pages.filter(
    (page) => page.id !== 'contact' && page.id !== 'cv' && page.id !== 'uses',
  )
  const footerPages = pages.filter(
    (page) => page.id === 'uses' || page.id === 'cv' || page.id === 'contact',
  )
  const projectItems = useMemo(() => getProjectNavItems(lang), [lang])
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['projects']))

  useEffect(() => {
    if (route.page !== 'projects' && !route.projectId && !route.projectList) return

    setExpanded((prev) => {
      if (prev.has('projects')) return prev
      const next = new Set(prev)
      next.add('projects')
      return next
    })
  }, [route.page, route.projectId, route.projectList])

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const renderPageButton = (item: (typeof pages)[number]) => {
    const pageActive =
      isProjectsOverviewActive(route) && item.id === 'projects'
        ? true
        : route.page === item.id && item.id !== 'projects'

    if (item.id === 'projects') {
      const projectsOpen = expanded.has('projects')

      return (
        <>
          <div className="group/row flex items-center gap-1">
            <button
              type="button"
              className="flex h-8 w-5 shrink-0 items-center justify-center rounded-[4px] text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-foreground group-hover/row:opacity-100 focus-visible:opacity-100"
              onClick={() => toggle('projects')}
              aria-expanded={projectsOpen}
              aria-label={projectsOpen ? ui.notionCollapse : ui.notionExpand}
            >
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-150',
                  projectsOpen && 'rotate-90',
                )}
              />
            </button>
            <NotionLink
              href={routeToPath(lang, { page: 'projects' })}
              className="notion-nav-item min-w-0 flex-1"
              {...navActive(isProjectsOverviewActive(route))}
              onClick={afterLink}
            >
              <span className="text-[15px] leading-none" aria-hidden>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </NotionLink>
          </div>

          {projectsOpen ? (
            <ul className="mt-1 space-y-0.5 pl-5" aria-label={ui.notionProjectsNav}>
              {projectItems.map((project) => (
                <li key={project.id}>
                  <NotionLink
                    href={routeToPath(lang, { page: 'projects', projectId: project.id })}
                    className="notion-nav-item text-[13px] text-sidebar-foreground/85"
                    {...navActive(route.projectId === project.id)}
                    onClick={afterLink}
                  >
                    <ProjectIcon projectId={project.id} size="xs" />
                    <span className="truncate">{project.name}</span>
                  </NotionLink>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )
    }

    return (
      <div className="flex items-center gap-1">
        <span className="w-5 shrink-0" aria-hidden />
        <NotionLink
          href={routeToPath(lang, { page: item.id as NotionPageId })}
          className="notion-nav-item min-w-0 flex-1"
          {...navActive(pageActive)}
          onClick={afterLink}
        >
          <span className="text-[15px] leading-none" aria-hidden>
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
        </NotionLink>
      </div>
    )
  }

  return (
    <aside
      className={cn(
        'flex h-full min-h-0 w-[var(--sidebar-width)] shrink-0 flex-col bg-sidebar text-sidebar-foreground',
        className,
      )}
      aria-label={ui.notionSidebar}
    >
      <header className="group/workspace flex items-center gap-1 px-2.5 pt-3 pb-1.5">
        <NotionLink
          href={routeToPath(lang, { page: 'about' })}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent"
          onClick={afterLink}
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-primary text-[10px] leading-none font-bold text-primary-foreground"
            aria-hidden
          >
            P
          </span>
          <span className="min-w-0 flex-1 truncate text-[14px] font-medium tracking-[-0.01em]">
            {ui.notionWorkspace}
          </span>
        </NotionLink>

        {onCollapse ? (
          <button
            type="button"
            onClick={onCollapse}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-muted-foreground opacity-0 transition-opacity group-hover/workspace:opacity-100 hover:bg-sidebar-accent hover:text-foreground focus-visible:opacity-100"
            aria-label={ui.notionCloseSidebar}
            title={`${ui.notionCloseSidebar} (⌘\\)`}
          >
            <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
        ) : null}
      </header>

      <ScrollArea className="min-h-0 flex-1 px-2.5">
        <nav aria-label={ui.notionPages}>
          <h2 className="mb-2 px-2.5 pt-2.5 text-[11px] font-medium tracking-wide text-muted-foreground/70 uppercase">
            {ui.notionPages}
          </h2>
          <ul className="space-y-0.5 pb-3">
            {mainPages.map((item) => (
              <li key={item.id}>{renderPageButton(item)}</li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      {footerPages.length > 0 ? (
        <nav
          className="space-y-0.5 border-t border-[rgba(55,53,47,0.06)] px-2.5 py-2.5 dark:border-[rgba(255,255,255,0.06)]"
          aria-label={ui.notionUtilityPages}
        >
          <ul className="space-y-0.5">
            {footerPages.map((page) => (
              <li key={page.id}>{renderPageButton(page)}</li>
            ))}
          </ul>
        </nav>
      ) : null}
    </aside>
  )
}
