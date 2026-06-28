import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { type Lang, translations } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import {
  getNotionPages,
  getProjectNavGroups,
  isProjectListActive,
  isProjectsOverviewActive,
} from './nav'

type NotionSidebarProps = {
  lang: Lang
  route: PortfolioRoute
  onNavigate: (route: PortfolioRoute) => void
  className?: string
}

export function NotionSidebar({ lang, route, onNavigate, className }: NotionSidebarProps) {
  const ui = translations[lang].ui
  const pages = getNotionPages(lang)
  const projectGroups = getProjectNavGroups(lang)

  return (
    <aside
      className={cn(
        'flex h-full w-[var(--sidebar-width,240px)] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        className,
      )}
      aria-label={ui.notionSidebar}
    >
      <div className="p-3">
        <button
          type="button"
          className="flex h-auto w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-sidebar-accent"
          onClick={() => onNavigate({ page: 'about' })}
        >
          <span className="text-lg" aria-hidden>
            🧑‍💻
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{ui.notionWorkspace}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {ui.notionWorkspaceSub}
            </span>
          </span>
        </button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-2 py-2">
        <p className="px-2 py-1 text-xs font-medium text-muted-foreground">{ui.notionPages}</p>
        <ul className="space-y-0.5">
          {pages.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent',
                  isProjectsOverviewActive(route) && item.id === 'projects'
                    ? 'bg-sidebar-accent font-medium'
                    : route.page === item.id && item.id !== 'projects'
                      ? 'bg-sidebar-accent font-medium'
                      : undefined,
                )}
                onClick={() => onNavigate({ page: item.id })}
                aria-current={
                  route.page === item.id && (item.id !== 'projects' || isProjectsOverviewActive(route))
                    ? 'page'
                    : undefined
                }
              >
                <span className="w-5 text-center" aria-hidden>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>

              {item.id === 'projects' ? (
                <ul className="ml-5 mt-0.5 space-y-1 border-l border-border/60 pl-2">
                  {projectGroups.map((group) => (
                    <li key={group.id}>
                      <button
                        type="button"
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-sidebar-accent',
                          (isProjectListActive(route, group.id) ||
                            (route.projectId &&
                              group.items.some((project) => project.id === route.projectId))) &&
                            !isProjectsOverviewActive(route)
                            ? 'bg-sidebar-accent/70 text-foreground'
                            : 'text-muted-foreground',
                        )}
                        onClick={() => onNavigate({ page: 'projects', projectList: group.id })}
                      >
                        <span className="w-4 text-center" aria-hidden>
                          {group.icon}
                        </span>
                        <span className="truncate">{group.label}</span>
                      </button>

                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border/40 pl-2">
                        {group.items.map((project) => (
                          <li key={project.id}>
                            <button
                              type="button"
                              className={cn(
                                'flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-sidebar-accent',
                                route.projectId === project.id && 'bg-sidebar-accent font-medium',
                              )}
                              onClick={() =>
                                onNavigate({ page: 'projects', projectId: project.id })
                              }
                            >
                              <span className="w-4 text-center" aria-hidden>
                                {project.icon}
                              </span>
                              <span className="truncate">{project.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  )
}
