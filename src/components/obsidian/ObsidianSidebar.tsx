import {
  Briefcase,
  ChevronRight,
  FileText,
  FolderClosed,
  FolderOpen,
  Mail,
  User,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Lang, translations } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import {
  getObsidianPages,
  getProjectNavGroups,
  isProjectListActive,
  isProjectsOverviewActive,
} from './nav'
import type { ObsidianPageId } from './types'

type ObsidianSidebarProps = {
  lang: Lang
  route: PortfolioRoute
  onNavigate: (route: PortfolioRoute) => void
  className?: string
}

const pageIcon = {
  about: User,
  tech: Zap,
  experience: Briefcase,
  projects: FolderClosed,
  contact: Mail,
} as const

function navActive(active: boolean) {
  return { 'data-active': active ? true : undefined }
}

export function ObsidianSidebar({ lang, route, onNavigate, className }: ObsidianSidebarProps) {
  const ui = translations[lang].ui
  const pages = getObsidianPages(lang)
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

  return (
    <aside
      className={cn(
        'flex h-full min-h-0 w-[var(--sidebar-width)] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        className,
      )}
      aria-label={ui.notionSidebar}
    >
      <div className="border-b border-sidebar-border px-2.5 py-2">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-sm px-1.5 py-1 text-left transition-colors hover:bg-sidebar-accent"
          onClick={() => onNavigate({ page: 'about' })}
        >
          <FolderOpen className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
          <span className="min-w-0 truncate">
            <span className="block truncate text-[12px] font-semibold leading-tight">
              {ui.notionWorkspace}
            </span>
            <span className="block truncate font-mono text-[10px] text-muted-foreground">
              portfolio/
            </span>
          </span>
        </button>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-1 py-1.5">
        <p className="px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {ui.notionPages}
        </p>
        <ul className="space-y-px">
          {pages.map((item) => {
            const Icon = pageIcon[item.id as keyof typeof pageIcon] ?? FileText
            const pageActive =
              isProjectsOverviewActive(route) && item.id === 'projects'
                ? true
                : route.page === item.id && item.id !== 'projects'
            const projectsOpen = expanded.has('projects')

            return (
              <li key={item.id}>
                {item.id === 'projects' ? (
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="rounded-sm p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      onClick={() => toggle('projects')}
                      aria-expanded={projectsOpen}
                      aria-label={projectsOpen ? 'Collapse' : 'Expand'}
                    >
                      <ChevronRight
                        className={cn('h-3 w-3 transition-transform', projectsOpen && 'rotate-90')}
                      />
                    </button>
                    <button
                      type="button"
                      className="obsidian-nav-item min-w-0 flex-1"
                      {...navActive(pageActive)}
                      onClick={() => onNavigate({ page: item.id })}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                      <span className="truncate font-mono text-[12px]">{item.id}.md</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="obsidian-nav-item pl-6"
                    {...navActive(pageActive)}
                    onClick={() => onNavigate({ page: item.id as ObsidianPageId })}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                    <span className="truncate font-mono text-[12px]">{item.id}.md</span>
                  </button>
                )}

                {item.id === 'projects' && projectsOpen ? (
                  <ul className="ml-4 mt-px space-y-px border-l border-border/70 pl-1">
                    {projectGroups.map((group) => {
                      const groupOpen = expanded.has(group.id)
                      const groupActive =
                        (isProjectListActive(route, group.id) ||
                          (route.projectId &&
                            group.items.some((project) => project.id === route.projectId))) &&
                        !isProjectsOverviewActive(route)

                      return (
                        <li key={group.id}>
                          <div className="flex items-center">
                            <button
                              type="button"
                              className="rounded-sm p-1 text-muted-foreground hover:bg-sidebar-accent"
                              onClick={() => toggle(group.id)}
                              aria-expanded={groupOpen}
                            >
                              <ChevronRight
                                className={cn(
                                  'h-3 w-3 transition-transform',
                                  groupOpen && 'rotate-90',
                                )}
                              />
                            </button>
                            <button
                              type="button"
                              className={cn(
                                'obsidian-nav-item min-w-0 flex-1 text-[11px]',
                                !groupActive && 'text-muted-foreground',
                              )}
                              {...navActive(Boolean(groupActive))}
                              onClick={() =>
                                onNavigate({ page: 'projects', projectList: group.id })
                              }
                            >
                              <FolderClosed className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                              <span className="truncate font-mono">{group.id}/</span>
                            </button>
                          </div>

                          {groupOpen ? (
                            <ul className="ml-5 mt-px space-y-px border-l border-border/50 pl-1">
                              {group.items.map((project) => (
                                <li key={project.id}>
                                  <button
                                    type="button"
                                    className="obsidian-nav-item text-[11px]"
                                    {...navActive(route.projectId === project.id)}
                                    onClick={() =>
                                      onNavigate({ page: 'projects', projectId: project.id })
                                    }
                                  >
                                    <FileText className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                                    <span className="truncate font-mono">{project.id}.md</span>
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
              </li>
            )
          })}
        </ul>
      </ScrollArea>
    </aside>
  )
}
