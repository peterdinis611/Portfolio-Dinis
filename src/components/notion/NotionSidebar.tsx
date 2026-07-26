import { ChevronRight, PanelLeftClose, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Lang, translations } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import {
  getNotionPages,
  getProjectNavGroups,
  isProjectListActive,
  isProjectsOverviewActive,
} from './nav'
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
  const projectGroups = useMemo(() => getProjectNavGroups(lang), [lang])
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(['projects', 'companies-projects', 'my-projects']),
  )

  useEffect(() => {
    if (route.page !== 'projects' && !route.projectId && !route.projectList) return

    setExpanded((prev) => {
      const next = new Set(prev)
      let changed = false

      if (!next.has('projects')) {
        next.add('projects')
        changed = true
      }
      if (route.projectList && !next.has(route.projectList)) {
        next.add(route.projectList)
        changed = true
      }
      if (route.projectId) {
        const group = projectGroups.find((g) =>
          g.items.some((item) => item.id === route.projectId),
        )
        if (group && !next.has(group.id)) {
          next.add(group.id)
          changed = true
        }
      }

      return changed ? next : prev
    })
  }, [route.page, route.projectId, route.projectList, projectGroups])

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
          <div className="group/row flex items-center gap-0.5">
            <button
              type="button"
              className="flex h-[28px] w-[18px] shrink-0 items-center justify-center rounded-[4px] text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-foreground group-hover/row:opacity-100 focus-visible:opacity-100"
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
            <ul className="mt-px space-y-px pl-[18px]">
              {projectGroups.map((group) => {
                const groupOpen = expanded.has(group.id)
                const groupActive =
                  (isProjectListActive(route, group.id) ||
                    (route.projectId &&
                      group.items.some((project) => project.id === route.projectId))) &&
                  !isProjectsOverviewActive(route)

                return (
                  <li key={group.id}>
                    <div className="group/row flex items-center gap-0.5">
                      <button
                        type="button"
                        className="flex h-[26px] w-[18px] shrink-0 items-center justify-center rounded-[4px] text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent group-hover/row:opacity-100 focus-visible:opacity-100"
                        onClick={() => toggle(group.id)}
                        aria-expanded={groupOpen}
                      >
                        <ChevronRight
                          className={cn(
                            'h-3 w-3 transition-transform duration-150',
                            groupOpen && 'rotate-90',
                          )}
                        />
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'notion-nav-item min-w-0 flex-1 !py-[4px] text-[13px]',
                          !groupActive && 'text-sidebar-foreground/80',
                        )}
                        {...navActive(Boolean(groupActive))}
                        onClick={() =>
                          onNavigate({ page: 'projects', projectList: group.id })
                        }
                      >
                        <span className="text-[14px] leading-none" aria-hidden>
                          {group.icon}
                        </span>
                        <span className="truncate">{group.label}</span>
                      </button>
                    </div>

                    {groupOpen ? (
                      <ul className="mt-px space-y-px pl-[18px]">
                        {group.items.map((project) => (
                          <li key={project.id}>
                            <button
                              type="button"
                              className="notion-nav-item !py-[4px] text-[13px] text-sidebar-foreground/85"
                              {...navActive(route.projectId === project.id)}
                              onClick={() =>
                                onNavigate({ page: 'projects', projectId: project.id })
                              }
                            >
                              <span className="text-[14px] leading-none" aria-hidden>
                                {project.icon}
                              </span>
                              <span className="truncate">{project.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          ) : null}
        </>
      )
    }

    return (
      <div className="flex items-center gap-0.5">
        <span className="w-[18px] shrink-0" aria-hidden />
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
      <div className="group/workspace flex items-center gap-0.5 px-2 pb-1 pt-2.5">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-[4px] px-1.5 py-1 text-left transition-colors hover:bg-sidebar-accent"
          onClick={() => onNavigate({ page: 'about' })}
        >
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[3px] bg-[rgba(35,131,226,0.85)] text-[10px] font-bold leading-none text-white">
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
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-foreground group-hover/workspace:opacity-100 focus-visible:opacity-100"
            aria-label={ui.notionCloseSidebar}
            title={`${ui.notionCloseSidebar} (⌘\\)`}
          >
            <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      <div className="px-2 pb-2">
        {onOpenSearch ? (
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex h-8 w-full items-center gap-2 rounded-[4px] px-2 text-left text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.75} />
            <span className="min-w-0 flex-1 truncate text-[13px]">{ui.notionQuickFind}</span>
            <kbd className="rounded-[4px] bg-[rgba(55,53,47,0.08)] px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground dark:bg-[rgba(255,255,255,0.08)]">
              ⌘K
            </kbd>
          </button>
        ) : null}
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2">
        <p className="mb-1 px-2 pt-1 text-[11px] font-medium text-muted-foreground/70">
          {ui.notionPages}
        </p>
        <ul className="space-y-px pb-2">
          {mainPages.map((item) => (
            <li key={item.id}>{renderPageButton(item)}</li>
          ))}
        </ul>
      </ScrollArea>

      {contactPage ? (
        <div className="border-t border-[rgba(55,53,47,0.06)] px-2 py-2 dark:border-[rgba(255,255,255,0.06)]">
          {renderPageButton(contactPage)}
        </div>
      ) : null}
    </aside>
  )
}
