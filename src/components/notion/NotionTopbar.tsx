import { Menu, PanelLeft } from 'lucide-react'
import { ThemeToggleIcon } from '@/components/icons/ThemeToggleIcon'
import { Button } from '@/components/ui/button'
import { type Lang, type Theme, translations } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { routeToVaultLabel } from '@/lib/vault-path'
import { cn } from '@/lib/utils'
import { getNotionPages } from './nav'
import { ProjectIcon } from './ProjectIcon'

type NotionTopbarProps = {
  lang: Lang
  theme: Theme
  route: PortfolioRoute
  sidebarCollapsed?: boolean
  onMenu: () => void
  onOpenSidebar?: () => void
  onOpenSearch: () => void
  onLang: (lang: Lang) => void
  onTheme: () => void
}

export function NotionTopbar({
  lang,
  theme,
  route,
  sidebarCollapsed = false,
  onMenu,
  onOpenSidebar,
  onLang,
  onTheme,
}: NotionTopbarProps) {
  const ui = translations[lang].ui
  const pageLabel = routeToVaultLabel(route, lang)
  const pageEmoji = getNotionPages(lang).find((page) => page.id === route.page)?.icon ?? '📄'

  return (
    <header className="notion-topbar">
      <div className="flex min-w-0 items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 rounded-[4px] text-muted-foreground hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground md:hidden dark:hover:bg-[rgba(255,255,255,0.055)]"
          onClick={onMenu}
          aria-label={ui.notionMenu}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {sidebarCollapsed && onOpenSidebar ? (
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-7 w-7 shrink-0 rounded-[4px] text-muted-foreground hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground md:inline-flex dark:hover:bg-[rgba(255,255,255,0.055)]"
            onClick={onOpenSidebar}
            aria-label={ui.notionOpenSidebar}
            title={`${ui.notionOpenSidebar} (⌘\\)`}
          >
            <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        ) : null}

        <nav className="flex min-w-0 items-center gap-1 text-[14px]" aria-label="Breadcrumb">
          <button
            type="button"
            className="hidden max-w-[10rem] truncate rounded-[4px] px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground sm:inline dark:hover:bg-[rgba(255,255,255,0.055)]"
            onClick={() => {
              window.location.hash = '#about'
            }}
          >
            {ui.notionWorkspace}
          </button>
          <span
            className="hidden px-0.5 text-[rgba(55,53,47,0.35)] sm:inline dark:text-[rgba(255,255,255,0.3)]"
            aria-hidden
          >
            /
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate rounded-[4px] px-1.5 py-0.5 text-muted-foreground">
            {route.projectId ? (
              <ProjectIcon projectId={route.projectId} size="xs" />
            ) : (
              <span className="shrink-0 text-[14px] leading-none" aria-hidden>
                {pageEmoji}
              </span>
            )}
            <span className="truncate">{pageLabel}</span>
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-0.5">

        <div className="mx-0.5 flex items-center">
          {(['sk', 'en'] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onLang(code)}
              className={cn(
                'h-7 rounded-[4px] px-1.5 text-[12px] font-medium transition-colors',
                lang === code
                  ? 'bg-[rgba(55,53,47,0.08)] text-foreground dark:bg-[rgba(255,255,255,0.08)]'
                  : 'text-muted-foreground hover:bg-[rgba(55,53,47,0.06)] hover:text-foreground dark:hover:bg-[rgba(255,255,255,0.055)]',
              )}
              aria-pressed={lang === code}
            >
              {code === 'sk' ? ui.langSk : ui.langEn}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-[4px] text-muted-foreground hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground dark:hover:bg-[rgba(255,255,255,0.055)]"
          onClick={onTheme}
          aria-label={theme === 'dark' ? ui.themeLight : ui.themeDark}
        >
          <ThemeToggleIcon theme={theme} />
        </Button>
      </div>
    </header>
  )
}
