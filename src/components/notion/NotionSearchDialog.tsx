import {
  Copy,
  FileText,
  Languages,
  Moon,
  Printer,
  Search,
  SearchX,
  Sparkles,
  Sun,
} from 'lucide-react'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { notes } from '@/data/notes'
import { projects } from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
import { decodeEmail } from '@/lib/email'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { searchPortfolio } from '@/lib/portfolio-search'
import { cn } from '@/lib/utils'
import { getNotionPages } from './nav'
import { ProjectIcon } from './ProjectIcon'

export type CommandPaletteActions = {
  onToggleTheme: () => void
  onToggleLang: () => void
  onToggleAnimations: () => void
  theme: 'light' | 'dark'
  animations: 'on' | 'off'
}

type CommandItem = {
  id: string
  group: 'pages' | 'projects' | 'notes' | 'actions' | 'results'
  icon: ReactNode
  title: string
  subtitle?: string
  run: () => void
}

type NotionSearchDialogProps = {
  lang: Lang
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (route: PortfolioRoute) => void
  actions: CommandPaletteActions
}

export function NotionSearchDialog({
  lang,
  open,
  onOpenChange,
  onNavigate,
  actions,
}: NotionSearchDialogProps) {
  const ui = translations[lang].ui
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const close = () => onOpenChange(false)
  const go = (route: PortfolioRoute) => {
    onNavigate(route)
    close()
  }

  const searchResults = useMemo(() => searchPortfolio(lang, query, 10), [lang, query])
  const trimmed = query.trim()

  const pages = getNotionPages(lang).map(
    (page): CommandItem => ({
      id: `page-${page.id}`,
      group: 'pages',
      icon: <span aria-hidden>{page.icon}</span>,
      title: page.label,
      subtitle: ui.notionPages,
      run: () => go({ page: page.id }),
    }),
  )

  const projectItems = projects.map(
    (project): CommandItem => ({
      id: `project-${project.id}`,
      group: 'projects',
      icon: <ProjectIcon projectId={project.id} size="xs" />,
      title: project.name,
      subtitle: project.tech,
      run: () => go({ page: 'projects', projectId: project.id }),
    }),
  )

  const noteItems = notes.map(
    (note): CommandItem => ({
      id: `note-${note.id}`,
      group: 'notes',
      icon: <span aria-hidden>{note.icon}</span>,
      title: note.title[lang],
      subtitle: note.summary[lang],
      run: () => go({ page: 'notes', noteId: note.id }),
    }),
  )

  const actionItems: CommandItem[] = [
    {
      id: 'action-theme',
      group: 'actions',
      icon:
        actions.theme === 'dark' ? (
          <Sun className="h-3.5 w-3.5" />
        ) : (
          <Moon className="h-3.5 w-3.5" />
        ),
      title: ui.cmdToggleTheme,
      subtitle: actions.theme === 'dark' ? ui.themeLight : ui.themeDark,
      run: () => {
        actions.onToggleTheme()
        close()
      },
    },
    {
      id: 'action-lang',
      group: 'actions',
      icon: <Languages className="h-3.5 w-3.5" />,
      title: ui.cmdToggleLang,
      subtitle: lang === 'sk' ? 'EN' : 'SK',
      run: () => {
        actions.onToggleLang()
        close()
      },
    },
    {
      id: 'action-animations',
      group: 'actions',
      icon: <Sparkles className="h-3.5 w-3.5" />,
      title: ui.cmdToggleAnimations,
      subtitle: actions.animations === 'on' ? ui.animationsOff : ui.animationsOn,
      run: () => {
        actions.onToggleAnimations()
        close()
      },
    },
    {
      id: 'action-email',
      group: 'actions',
      icon: <Copy className="h-3.5 w-3.5" />,
      title: copied ? ui.cmdEmailCopied : ui.cmdCopyEmail,
      run: () => {
        void navigator.clipboard.writeText(decodeEmail()).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        })
      },
    },
    {
      id: 'action-cv',
      group: 'actions',
      icon: <FileText className="h-3.5 w-3.5" />,
      title: ui.cmdOpenCv,
      run: () => go({ page: 'cv' }),
    },
    {
      id: 'action-print',
      group: 'actions',
      icon: <Printer className="h-3.5 w-3.5" />,
      title: ui.cmdPrintCv,
      run: () => {
        go({ page: 'cv' })
        window.setTimeout(() => window.print(), 350)
      },
    },
  ]

  const items: CommandItem[] = !trimmed
    ? [...pages, ...projectItems, ...noteItems, ...actionItems]
    : [
        ...searchResults.map(
          (result): CommandItem => ({
            id: `result-${result.page}-${result.projectId ?? ''}-${result.noteId ?? ''}-${result.title}`,
            group: 'results',
            icon: <span aria-hidden>{result.pageIcon}</span>,
            title: result.title,
            subtitle: result.subtitle,
            run: () =>
              go({
                page: result.page,
                projectId: result.projectId,
                noteId: result.noteId,
              }),
          }),
        ),
        ...actionItems.filter((item) => {
          const q = trimmed.toLowerCase()
          return item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q)
        }),
      ]

  const safeIndex = items.length === 0 ? 0 : Math.min(activeIndex, items.length - 1)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActiveIndex(0)
      setCopied(false)
      return
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [open])

  const groupLabel = (group: CommandItem['group']) => {
    if (group === 'pages') return ui.notionSearchPages
    if (group === 'projects') return ui.cmdProjects
    if (group === 'notes') return ui.cmdNotes
    if (group === 'actions') return ui.cmdActions
    return ui.notionSearchPages
  }

  let lastGroup: CommandItem['group'] | null = null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">{ui.notionQuickFind}</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActiveIndex((i) => Math.min(i + 1, Math.max(items.length - 1, 0)))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActiveIndex((i) => Math.max(i - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                items[safeIndex]?.run()
              }
            }}
            placeholder={ui.notionSearchHint}
            className="h-11 w-full bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
            aria-label={ui.notionQuickFind}
            aria-activedescendant={items[safeIndex] ? `cmd-${items[safeIndex].id}` : undefined}
          />
          <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            Esc
          </kbd>
        </div>

        <div className="max-h-[min(28rem,55vh)] overflow-y-auto p-2">
          {trimmed && items.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center border border-border bg-muted/40 text-muted-foreground">
                <SearchX className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <p className="text-[13px] font-semibold text-foreground">
                {ui.notionSearchEmptyTitle.replace('{query}', trimmed)}
              </p>
              <p className="mt-1.5 max-w-[15rem] text-[11px] leading-relaxed text-muted-foreground">
                {ui.notionSearchEmptyBody}
              </p>
            </div>
          ) : (
            <ul className="space-y-px">
              {items.map((item, index) => {
                const showHeading = item.group !== lastGroup
                lastGroup = item.group
                return (
                  <li key={item.id}>
                    {showHeading && !trimmed ? (
                      <p className="px-2 pt-2 pb-1 text-[11px] font-medium text-muted-foreground">
                        {groupLabel(item.group)}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      id={`cmd-${item.id}`}
                      className={cn(
                        'group flex w-full items-start gap-2.5 rounded-[6px] px-2 py-1.5 text-left transition-colors',
                        index === safeIndex ? 'bg-muted/90' : 'hover:bg-muted/70',
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => item.run()}
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
                        {item.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] text-foreground">
                          {item.title}
                        </span>
                        {item.subtitle ? (
                          <span className="block truncate text-[12px] text-muted-foreground">
                            {item.subtitle}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {!trimmed ? (
            <p className="mt-2 px-2 pb-1 text-[11px] leading-relaxed text-muted-foreground">
              {ui.notionSearchIntro}
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
