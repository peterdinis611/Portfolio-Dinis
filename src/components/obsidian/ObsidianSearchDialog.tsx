import { FileText, Search, SearchX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { type Lang, translations } from '@/i18n/translations'
import { type PortfolioSearchResult, searchPortfolio } from '@/lib/portfolio-search'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import { getObsidianPages } from './nav'
import type { ObsidianPageId } from './types'

type ObsidianSearchDialogProps = {
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
  onSelect: (page: ObsidianPageId) => void
  compact?: boolean
}) {
  const ui = translations[lang].ui
  const pages = getObsidianPages(lang)

  return (
    <div className={cn(compact ? 'pt-1' : 'pt-0.5')}>
      <p className="px-2 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {ui.notionSearchPages}
      </p>
      <ul className="space-y-px">
        {pages.map((page) => (
          <li key={page.id}>
            <button
              type="button"
              className="group flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-muted/80"
              onClick={() => onSelect(page.id)}
            >
              <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
              <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-primary">
                {page.id}.md
              </span>
              <span className="truncate text-[11px] text-muted-foreground">{page.label}</span>
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
  onSelectPage: (page: ObsidianPageId) => void
}) {
  const ui = translations[lang].ui

  return (
    <div className="px-1 py-2">
      <div className="mx-1 mb-3 border border-border bg-card/40 px-3 py-2.5">
        <p className="font-mono text-[12px] font-medium text-foreground">{ui.notionQuickFind}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{ui.notionSearchIntro}</p>
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
  onSelectPage: (page: ObsidianPageId) => void
}) {
  const ui = translations[lang].ui

  return (
    <div className="px-1 py-3">
      <div className="flex flex-col items-center px-4 py-5 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
          <SearchX className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <p className="text-[13px] font-semibold text-foreground">
          {ui.notionSearchEmptyTitle.replace('{query}', query)}
        </p>
        <p className="mt-1.5 max-w-[15rem] text-[11px] leading-relaxed text-muted-foreground">
          {ui.notionSearchEmptyBody}
        </p>
      </div>

      <div className="mx-2 border-t border-border pt-1">
        <SearchPageList lang={lang} onSelect={onSelectPage} compact />
      </div>
    </div>
  )
}

export function ObsidianSearchDialog({
  lang,
  open,
  onOpenChange,
  onNavigate,
}: ObsidianSearchDialogProps) {
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

  const handleSelectPage = (page: ObsidianPageId) => {
    onNavigate({ page })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="sr-only">{ui.notionQuickFind}</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.notionSearchHint}
            className="h-10 w-full bg-transparent font-mono text-[13px] outline-none placeholder:text-muted-foreground"
            aria-label={ui.notionQuickFind}
          />
          <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            Esc
          </kbd>
        </div>

        <div className="max-h-[min(28rem,55vh)] overflow-y-auto p-2">
          {trimmedQuery === '' ? (
            <SearchIntroState lang={lang} onSelectPage={handleSelectPage} />
          ) : results.length === 0 ? (
            <SearchEmptyState lang={lang} query={trimmedQuery} onSelectPage={handleSelectPage} />
          ) : (
            <ul className="space-y-px px-1">
              {results.map((result) => (
                <li key={`${result.page}-${result.title}-${result.subtitle ?? ''}`}>
                  <button
                    type="button"
                    className="group flex w-full items-start gap-2 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-muted/80"
                    onClick={() => handleSelect(result)}
                  >
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[12px] text-primary">
                        {result.title}
                      </span>
                      {result.subtitle ? (
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {result.subtitle}
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {result.page}
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
