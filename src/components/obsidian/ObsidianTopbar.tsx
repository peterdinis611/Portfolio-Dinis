import { Menu, Search } from 'lucide-react'
import { ThemeToggleIcon } from '@/components/icons/ThemeToggleIcon'
import { Button } from '@/components/ui/button'
import { type Lang, type Theme, translations } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { routeToVaultFile } from '@/lib/vault-path'

type ObsidianTopbarProps = {
  lang: Lang
  theme: Theme
  route: PortfolioRoute
  onMenu: () => void
  onOpenSearch: () => void
  onLang: (lang: Lang) => void
  onTheme: () => void
}

export function ObsidianTopbar({
  lang,
  theme,
  route,
  onMenu,
  onOpenSearch,
  onLang,
  onTheme,
}: ObsidianTopbarProps) {
  const ui = translations[lang].ui
  const vaultPath = routeToVaultFile(route)

  return (
    <header className="obsidian-ribbon">
      <div className="flex min-w-0 items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm md:hidden"
          onClick={onMenu}
          aria-label={ui.notionMenu}
        >
          <Menu className="h-3.5 w-3.5" />
        </Button>
        <p className="min-w-0 truncate font-mono text-[11px] text-muted-foreground">
          <span className="hidden sm:inline">portfolio/</span>
          <span className="text-foreground">{vaultPath}</span>
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={onOpenSearch}
          aria-label={ui.notionQuickFind}
        >
          <Search className="h-3.5 w-3.5" />
        </Button>
        <fieldset className="flex rounded-sm border border-border bg-muted/40 p-0.5">
          <legend className="sr-only">Language</legend>
          <Button
            variant={lang === 'sk' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-6 rounded-sm px-2 font-mono text-[10px]"
            onClick={() => onLang('sk')}
          >
            {ui.langSk}
          </Button>
          <Button
            variant={lang === 'en' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-6 rounded-sm px-2 font-mono text-[10px]"
            onClick={() => onLang('en')}
          >
            {ui.langEn}
          </Button>
        </fieldset>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={onTheme}
          aria-label={theme === 'dark' ? ui.themeLight : ui.themeDark}
        >
          <ThemeToggleIcon theme={theme} />
        </Button>
      </div>
    </header>
  )
}
