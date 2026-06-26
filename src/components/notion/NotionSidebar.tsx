import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { type Lang, translations } from '@/i18n/translations'
import { cn } from '@/lib/utils'
import { getNotionPages } from './nav'
import type { NotionPageId } from './types'

type NotionSidebarProps = {
  lang: Lang
  page: NotionPageId
  onNavigate: (page: NotionPageId) => void
  className?: string
}

export function NotionSidebar({ lang, page, onNavigate, className }: NotionSidebarProps) {
  const ui = translations[lang].ui
  const pages = getNotionPages(lang)

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
          onClick={() => onNavigate('about')}
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
                  page === item.id && 'bg-sidebar-accent font-medium',
                )}
                onClick={() => onNavigate(item.id)}
                aria-current={page === item.id ? 'page' : undefined}
              >
                <span className="w-5 text-center" aria-hidden>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  )
}
