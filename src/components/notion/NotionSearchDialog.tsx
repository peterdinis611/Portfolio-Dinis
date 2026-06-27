import * as Dialog from '@radix-ui/react-dialog'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { type Lang, translations } from '@/i18n/translations'
import { type PortfolioSearchResult, searchPortfolio } from '@/lib/portfolio-search'
import type { PortfolioRoute } from '@/lib/portfolio-route'

type NotionSearchDialogProps = {
  lang: Lang
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (route: PortfolioRoute) => void
}

export function NotionSearchDialog({
  lang,
  open,
  onOpenChange,
  onNavigate,
}: NotionSearchDialogProps) {
  const ui = translations[lang].ui
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  const results = useMemo(() => searchPortfolio(lang, query), [lang, query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [open])

  const handleSelect = (result: PortfolioSearchResult) => {
    onNavigate({ page: result.page, projectId: result.projectId })
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-[12vh] left-1/2 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl outline-none">
          <Dialog.Title className="sr-only">{ui.notionQuickFind}</Dialog.Title>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui.notionSearchHint}
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label={ui.notionQuickFind}
            />
            <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
              Esc
            </kbd>
          </div>

          <div className="max-h-[min(24rem,50vh)] overflow-y-auto p-2">
            {query.trim() === '' ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                {ui.notionSearchIntro}
              </p>
            ) : results.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                {ui.notionSearchEmpty}
              </p>
            ) : (
              <ul>
                {results.map((result) => (
                  <li key={`${result.page}-${result.title}-${result.subtitle ?? ''}`}>
                    <button
                      type="button"
                      className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted"
                      onClick={() => handleSelect(result)}
                    >
                      <span className="mt-0.5 w-5 shrink-0 text-center text-sm" aria-hidden>
                        {result.pageIcon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{result.title}</span>
                        {result.subtitle ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {result.subtitle}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {result.pageLabel}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
