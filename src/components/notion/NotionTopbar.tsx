import { Menu, Search } from 'lucide-react'
import { ThemeToggleIcon } from '@/components/icons/ThemeToggleIcon'
import { Button } from '@/components/ui/button'
import { type Lang, type Theme, translations } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { getNotionPages, getProjectName } from './nav'

type NotionTopbarProps = {
  lang: Lang
  theme: Theme
  route: PortfolioRoute
  onMenu: () => void
  onOpenSearch: () => void
  onLang: (lang: Lang) => void
  onTheme: () => void
}

export function NotionTopbar({
  lang,
  theme,
  route,
  onMenu,
  onOpenSearch,
  onLang,
  onTheme,
}: NotionTopbarProps) {
  const ui = translations[lang].ui
  const current = getNotionPages(lang).find((p) => p.id === route.page)
  const projectName = route.projectId ? getProjectName(route.projectId) : undefined

  return (
    <header className="sticky top-0 z-20 flex h-11 items-center justify-between gap-3 border-b border-border bg-background/85 px-3 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenu}
          aria-label={ui.notionMenu}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <nav
          className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <span className="hidden truncate sm:inline">{ui.notionWorkspace}</span>
          <span className="hidden sm:inline" aria-hidden>
            /
          </span>
          <span className={cnTruncate(projectName)}>
            {current?.icon} {current?.label}
          </span>
          {projectName ? (
            <>
              <span aria-hidden>/</span>
              <span className="truncate font-medium text-foreground">{projectName}</span>
            </>
          ) : null}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="inline-flex"
          onClick={onOpenSearch}
          aria-label={ui.notionQuickFind}
        >
          <Search className="h-4 w-4" />
        </Button>
        <fieldset className="flex rounded-full border border-border bg-muted/50 p-0.5">
          <legend className="sr-only">Language</legend>
          <Button
            variant={lang === 'sk' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 rounded-full px-2.5 text-xs"
            onClick={() => onLang('sk')}
          >
            {ui.langSk}
          </Button>
          <Button
            variant={lang === 'en' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 rounded-full px-2.5 text-xs"
            onClick={() => onLang('en')}
          >
            {ui.langEn}
          </Button>
        </fieldset>
        <Button
          variant="ghost"
          size="icon"
          onClick={onTheme}
          aria-label={theme === 'dark' ? ui.themeLight : ui.themeDark}
        >
          <ThemeToggleIcon theme={theme} />
        </Button>
      </div>
    </header>
  )
}

function cnTruncate(hasProject: string | undefined) {
  return hasProject ? 'truncate' : 'truncate font-medium text-foreground'
}
