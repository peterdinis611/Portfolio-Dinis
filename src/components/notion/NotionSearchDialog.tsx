import { ArrowRight, Search, SearchX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { type Lang, translations } from '@/i18n/translations'
import { type PortfolioSearchResult, searchPortfolio } from '@/lib/portfolio-search'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import { getNotionPages } from './nav'
import type { NotionPageId } from './types'

type NotionSearchDialogProps = {
  lang: Lang
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (route: PortfolioRoute) => void
}

function SearchPageList({
  lang,
  onSelect,
  compact = false,
}: {
  lang: Lang
  onSelect: (page: NotionPageId) => void
  compact?: boolean
}) {
  const ui = translations[lang].ui
  const pages = getNotionPages(lang)

  return (
    <div className={cn(compact ? 'pt-1' : 'pt-0.5')}>
      <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {ui.notionSearchPages}
      </p>
      <ul className="space-y-0.5">
        {pages.map((page) => (
          <li key={page.id}>
            <button
              type="button"
              className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/80"
              onClick={() => onSelect(page.id)}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-base"
                aria-hidden
              >
                {page.icon}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {page.label}
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SearchIntroState({
  lang,
  onSelectPage,
}: {
  lang: Lang
  onSelectPage: (page: NotionPageId) => void
}) {
  const ui = translations[lang].ui

  return (
    <div className="px-1 py-2">
      <div className="mx-1 mb-3 flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-3.5 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-lg shadow-sm">
          ✨
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-medium text-foreground">{ui.notionQuickFind}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{ui.notionSearchIntro}</p>
        </div>
      </div>
      <SearchPageList lang={lang} onSelect={onSelectPage} />
    </div>
  )
}

function SearchEmptyState({
  lang,
  query,
  onSelectPage,
}: {
  lang: Lang
  query: string
  onSelectPage: (page: NotionPageId) => void
}) {
  const ui = translations[lang].ui

  return (
    <div className="px-1 py-3">
      <div className="flex flex-col items-center px-4 py-5 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/30 text-muted-foreground shadow-sm">
          <SearchX className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {ui.notionSearchEmptyTitle.replace('{query}', query)}
        </p>
        <p className="mt-1.5 max-w-[15rem] text-xs leading-relaxed text-muted-foreground">
          {ui.notionSearchEmptyBody}
        </p>
      </div>

      <div className="mx-2 border-t border-border/60 pt-1">
        <SearchPageList lang={lang} onSelect={onSelectPage} compact />
      </div>
    </div>
  )
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
  const trimmedQuery = query.trim()

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

  const handleSelectPage = (page: NotionPageId) => {
    onNavigate({ page })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="sr-only">{ui.notionQuickFind}</DialogTitle>
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

          <div className="max-h-[min(28rem,55vh)] overflow-y-auto p-2">
            {trimmedQuery === '' ? (
              <SearchIntroState lang={lang} onSelectPage={handleSelectPage} />
            ) : results.length === 0 ? (
              <SearchEmptyState lang={lang} query={trimmedQuery} onSelectPage={handleSelectPage} />
            ) : (
              <ul className="space-y-0.5 px-1">
                {results.map((result) => (
                  <li key={`${result.page}-${result.title}-${result.subtitle ?? ''}`}>
                    <button
                      type="button"
                      className="group flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/80"
                      onClick={() => handleSelect(result)}
                    >
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-base"
                        aria-hidden
                      >
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
                      <span className="shrink-0 rounded-md bg-muted/50 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {result.pageLabel}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
      </DialogContent>
    </Dialog>
  )
}
