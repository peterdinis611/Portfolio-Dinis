import { ChevronRight, PanelLeftClose, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Lang, translations } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import {
  getNotionPages,
  getProjectNavItems,
  isProjectsOverviewActive,
} from './nav'
import { ProjectIcon } from './ProjectIcon'
import type { NotionPageId } from './types'

type NotionSidebarProps = {
  lang: Lang
  route: PortfolioRoute
  onNavigate: (route: PortfolioRoute) => void
  onOpenSearch?: () => void
  onCollapse?: () => void
  className?: string
}

function navActive(active: boolean) {
  return { 'data-active': active ? true : undefined }
}

export function NotionSidebar({
  lang,
  route,
  onNavigate,
  onOpenSearch,
  onCollapse,
  className,
}: NotionSidebarProps) {
  const ui = translations[lang].ui
  const pages = getNotionPages(lang)
  const mainPages = pages.filter((page) => page.id !== 'contact')
  const contactPage = pages.find((page) => page.id === 'contact')
  const projectItems = useMemo(() => getProjectNavItems(), [])
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
    const projectsOpen = expanded.has('projects')

    if (item.id === 'projects') {
      return (
        <>
          <div className="group/row flex items-center gap-1">
            <button
              type="button"
              className="flex h-8 w-5 shrink-0 items-center justify-center rounded-[4px] text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-foreground group-hover/row:opacity-100 focus-visible:opacity-100"
              onClick={() => toggle('projects')}
              aria-expanded={projectsOpen}
              aria-label={projectsOpen ? 'Collapse' : 'Expand'}
            >
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-150',
                  projectsOpen && 'rotate-90',
                )}
              />
            </button>
            <button
              type="button"
              className="notion-nav-item min-w-0 flex-1"
              {...navActive(pageActive)}
              onClick={() => onNavigate({ page: item.id })}
            >
              <span className="text-[15px] leading-none" aria-hidden>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          </div>

          {projectsOpen ? (
            <ul className="mt-1 space-y-0.5 pl-5">
              {projectItems.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    className="notion-nav-item text-[13px] text-sidebar-foreground/85"
                    {...navActive(route.projectId === project.id)}
                    onClick={() => onNavigate({ page: 'projects', projectId: project.id })}
                  >
                    <ProjectIcon projectId={project.id} size="xs" />
                    <span className="truncate">{project.name}</span>
                  </button>
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
        <button
          type="button"
          className="notion-nav-item min-w-0 flex-1"
          {...navActive(pageActive)}
          onClick={() => onNavigate({ page: item.id as NotionPageId })}
        >
          <span className="text-[15px] leading-none" aria-hidden>
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
        </button>
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
      <div className="group/workspace flex items-center gap-1 px-2.5 pb-1.5 pt-3">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent"
          onClick={() => onNavigate({ page: 'about' })}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[rgba(35,131,226,0.85)] text-[10px] font-bold leading-none text-white">
            P
          </span>
          <span className="min-w-0 flex-1 truncate text-[14px] font-medium tracking-[-0.01em]">
            {ui.notionWorkspace}
          </span>
        </button>

        {onCollapse ? (
          <button
            type="button"
            onClick={onCollapse}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-foreground group-hover/workspace:opacity-100 focus-visible:opacity-100"
            aria-label={ui.notionCloseSidebar}
            title={`${ui.notionCloseSidebar} (⌘\\)`}
          >
            <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      <div className="px-2.5 pb-2.5">
        {onOpenSearch ? (
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex h-9 w-full items-center gap-2.5 rounded-[6px] px-2.5 text-left text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.75} />
            <span className="min-w-0 flex-1 truncate text-[13px]">{ui.notionQuickFind}</span>
            <kbd className="rounded-[4px] bg-[rgba(55,53,47,0.08)] px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground dark:bg-[rgba(255,255,255,0.08)]">
              ⌘K
            </kbd>
          </button>
        ) : null}
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2.5">
        <p className="mb-2 px-2.5 pt-1.5 text-[11px] font-medium tracking-wide text-muted-foreground/70 uppercase">
          {ui.notionPages}
        </p>
        <ul className="space-y-0.5 pb-3">
          {mainPages.map((item) => (
            <li key={item.id}>{renderPageButton(item)}</li>
          ))}
        </ul>
      </ScrollArea>

      {contactPage ? (
        <div className="border-t border-[rgba(55,53,47,0.06)] px-2.5 py-2.5 dark:border-[rgba(255,255,255,0.06)]">
          {renderPageButton(contactPage)}
        </div>
      ) : null}
    </aside>
  )
}
