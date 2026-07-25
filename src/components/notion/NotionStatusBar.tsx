import { type Lang, type Theme, translations } from '@/i18n/translations'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { routeToVaultFile } from '@/lib/vault-path'

type NotionStatusBarProps = {
  lang: Lang
  theme: Theme
  route: PortfolioRoute
}

export function NotionStatusBar({ lang, theme, route }: NotionStatusBarProps) {
  const ui = translations[lang].ui
  const file = routeToVaultFile(route)

  return (
    <footer
      className="flex h-7 shrink-0 items-center justify-between border-t border-border px-3 font-mono text-[10px] text-muted-foreground"
      style={{ background: 'var(--sidebar)' }}
    >
      <span className="truncate">{file}</span>
      <span className="flex shrink-0 items-center gap-2">
        <span>{lang.toUpperCase()}</span>
        <span aria-hidden>·</span>
        <span>{theme === 'dark' ? ui.themeDark : ui.themeLight}</span>
      </span>
    </footer>
  )
}
