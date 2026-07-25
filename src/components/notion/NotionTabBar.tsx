import { FileText } from 'lucide-react'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { routeToVaultFile } from '@/lib/vault-path'

export function NotionTabBar({ route }: { route: PortfolioRoute }) {
  const file = routeToVaultFile(route)

  return (
    <div
      className="flex h-9 shrink-0 items-end gap-px border-b border-border px-2"
      style={{ background: 'var(--tab-bar)' }}
      role="tablist"
      aria-label="Open note"
    >
      <div
        role="tab"
        aria-selected
        className="flex max-w-[min(100%,18rem)] items-center gap-1.5 rounded-t-sm border border-b-0 border-border px-3 py-1.5 text-xs text-foreground"
        style={{ background: 'var(--editor-surface)' }}
      >
        <FileText className="h-3 w-3 shrink-0 text-[var(--link)]" strokeWidth={2} />
        <span className="truncate font-mono">{file}</span>
      </div>
    </div>
  )
}
