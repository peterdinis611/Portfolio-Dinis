'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, LayoutGrid, List, Rss, Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { HighlightedText } from '@/components/ui/HighlightedText'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getNoteTags, type Note, notes } from '@/data/notes'
import { getNoteCover } from '@/data/page-covers'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { getFeaturedNote, type NotesSort, sortNotes } from '@/lib/note-blocks'
import { filterNotes } from '@/lib/notes-search'
import { noteHref } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import { PageShell, PageTitle } from '../blocks'
import { MOTION_EASE, MotionSection } from '../motion'
import { NotionLink } from '../NotionLink'
import { PageCover } from '../PageCover'

const SORTS: NotesSort[] = ['newest', 'reading', 'az']
type NotesView = 'cards' | 'list'

function parseNotesParams(searchParams: URLSearchParams): {
  q: string
  tag: string | null
  sort: NotesSort
  view: NotesView
} {
  const sortParam = searchParams.get('sort')
  const sort = SORTS.includes(sortParam as NotesSort) ? (sortParam as NotesSort) : 'newest'
  const view = searchParams.get('view') === 'list' ? 'list' : 'cards'
  return {
    q: searchParams.get('q') ?? '',
    tag: searchParams.get('tag'),
    sort,
    view,
  }
}

function buildNotesQuery(state: {
  q: string
  tag: string | null
  sort: NotesSort
  view: NotesView
}): string {
  const params = new URLSearchParams()
  if (state.q.trim()) params.set('q', state.q.trim())
  if (state.tag) params.set('tag', state.tag)
  if (state.sort !== 'newest') params.set('sort', state.sort)
  if (state.view !== 'cards') params.set('view', state.view)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

function NoteCard({
  note,
  lang,
  readLabel,
  query,
}: {
  note: Note
  lang: Lang
  readLabel: string
  query?: string
}) {
  const ui = translations[lang].ui
  return (
    <NotionLink
      href={noteHref(lang, note.id)}
      className="group flex h-full flex-col rounded-[12px] border border-[rgba(55,53,47,0.1)] bg-[color-mix(in_srgb,var(--editor-surface)_94%,var(--primary))] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_42%,transparent)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] dark:border-[rgba(255,255,255,0.1)]"
    >
      <span className="mb-3 flex items-start justify-between gap-2">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-[12px] text-[22px] transition-transform duration-300 group-hover:-translate-y-0.5"
          style={{
            background: note.accent
              ? `color-mix(in srgb, ${note.accent} 18%, transparent)`
              : 'rgba(24,116,122,0.14)',
          }}
          aria-hidden
        >
          {note.icon}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--link)] opacity-70 transition-opacity group-hover:opacity-100">
          {readLabel}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </span>
      <span className="mb-1.5 text-[16px] font-semibold tracking-[-0.01em] text-foreground group-hover:text-[var(--link)]">
        <HighlightedText text={note.title[lang]} query={query} />
      </span>
      <span className="mb-3 line-clamp-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
        <HighlightedText text={note.summary[lang]} query={query} />
      </span>
      <span className="mt-auto flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
        <time dateTime={note.date}>{note.date}</time>
        <span aria-hidden>·</span>
        <span>{ui.notesReading.replace('{min}', String(note.readingMinutes))}</span>
        <span aria-hidden>·</span>
        <span>{ui.notesWords.replace('{count}', String(note.wordCount))}</span>
        {note.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-[3px] bg-[rgba(55,53,47,0.06)] px-1.5 py-0.5 dark:bg-[rgba(255,255,255,0.08)]"
          >
            {tag}
          </span>
        ))}
      </span>
    </NotionLink>
  )
}

function NoteListRow({ note, lang, query }: { note: Note; lang: Lang; query?: string }) {
  const ui = translations[lang].ui
  return (
    <NotionLink
      href={noteHref(lang, note.id)}
      className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[8px] border border-transparent px-2 py-2.5 transition-colors hover:border-[rgba(55,53,47,0.1)] hover:bg-[rgba(55,53,47,0.04)] dark:hover:border-[rgba(255,255,255,0.1)] dark:hover:bg-[rgba(255,255,255,0.04)]"
    >
      <span className="text-[20px]" aria-hidden>
        {note.icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[14px] font-medium text-foreground group-hover:text-[var(--link)]">
          <HighlightedText text={note.title[lang]} query={query} />
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">
          <HighlightedText text={note.summary[lang]} query={query} />
        </span>
      </span>
      <span className="hidden text-right text-[11px] text-muted-foreground sm:block">
        <span className="block">{note.date}</span>
        <span className="block">
          {ui.notesReading.replace('{min}', String(note.readingMinutes))}
        </span>
      </span>
    </NotionLink>
  )
}

export function NotesPage({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui
  const reduceMotion = useMotionDisabled()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(
    () => parseNotesParams(new URLSearchParams(searchParams.toString())).q,
  )
  const [activeTag, setActiveTag] = useState<string | null>(
    () => parseNotesParams(new URLSearchParams(searchParams.toString())).tag,
  )
  const [sort, setSort] = useState<NotesSort>(
    () => parseNotesParams(new URLSearchParams(searchParams.toString())).sort,
  )
  const [view, setView] = useState<NotesView>(
    () => parseNotesParams(new URLSearchParams(searchParams.toString())).view,
  )
  const [typeTick, setTypeTick] = useState(0)
  const deferredQuery = useDeferredValue(query)
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldRef = useRef<HTMLLabelElement>(null)
  const tags = useMemo(() => getNoteTags(), [])

  const filtered = useMemo(
    () => filterNotes({ lang, query: deferredQuery, tag: activeTag }),
    [lang, deferredQuery, activeTag],
  )
  const sorted = useMemo(() => sortNotes(filtered, sort, lang), [filtered, sort, lang])
  const hasQuery = Boolean(query.trim())
  const isFiltering = hasQuery || activeTag !== null
  const showFeatured = !isFiltering && sort === 'newest'
  const featured = showFeatured ? getFeaturedNote(sorted) : undefined
  const gridNotes = featured ? sorted.filter((note) => note.id !== featured.id) : sorted

  useEffect(() => {
    const qs = buildNotesQuery({ q: query, tag: activeTag, sort, view })
    const next = `${pathname}${qs}`
    const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    if (current !== next) {
      router.replace(next, { scroll: false })
    }
  }, [query, activeTag, sort, view, pathname, router, searchParams])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return
      }
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (reduceMotion || typeTick === 0) return
    const field = fieldRef.current
    if (!field) return
    field.classList.remove('is-keyed')
    void field.offsetWidth
    field.classList.add('is-keyed')
    const timer = window.setTimeout(() => field.classList.remove('is-keyed'), 480)
    return () => window.clearTimeout(timer)
  }, [typeTick, reduceMotion])

  const sortLabel = (value: NotesSort) => {
    if (value === 'reading') return ui.notesSortReading
    if (value === 'az') return ui.notesSortAz
    return ui.notesSortNewest
  }

  return (
    <PageShell className="notes-page" cover={<PageCover variant="tech" />}>
      <MotionSection>
        <PageTitle icon="✍️" description={ui.notesIntro}>
          {ui.notes}
        </PageTitle>
        <a
          href="/feed.xml"
          className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-[var(--link)]"
        >
          <Rss className="h-3.5 w-3.5" strokeWidth={2} />
          {ui.notesRss}
        </a>
      </MotionSection>

      <MotionSection delay={0.04} className="mt-1">
        <div className={cn('notes-search mb-5 grid gap-3.5', hasQuery && 'has-query')}>
          <label
            ref={fieldRef}
            className={cn(
              'notes-search-field group/search grid min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border border-[rgba(55,53,47,0.14)] px-2.5 py-1.5',
              'bg-[color-mix(in_srgb,var(--editor-surface)_92%,var(--primary))] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_6px_18px_-14px_rgba(15,15,15,0.28)]',
              'focus-within:border-[color-mix(in_srgb,var(--primary)_48%,transparent)] focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_0_0_3px_color-mix(in_srgb,var(--primary)_16%,transparent)]',
              'dark:border-[rgba(255,255,255,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_22px_-16px_rgba(0,0,0,0.55)]',
              hasQuery && 'has-query border-[color-mix(in_srgb,var(--primary)_42%,transparent)]',
            )}
          >
            <span className="sr-only">{ui.notesSearch}</span>
            <span
              className="notes-search-icon grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[color-mix(in_srgb,var(--primary)_80%,var(--muted-foreground))]"
              aria-hidden
            >
              <Search className="h-4 w-4" strokeWidth={2} />
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => {
                const next = event.target.value
                setQuery(next)
                if (!reduceMotion && next.trim()) setTypeTick((tick) => tick + 1)
              }}
              placeholder={ui.notesSearchPlaceholder}
              autoComplete="off"
              spellCheck={false}
              className="notes-search-input h-[2.15rem] min-w-0 w-full border-0 bg-transparent p-0 text-[14.5px] tracking-[-0.01em] text-foreground outline-none placeholder:text-muted-foreground/85"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="notes-search-clear grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground dark:hover:bg-[rgba(255,255,255,0.1)]"
                aria-label={ui.notesSearchClear}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.25} />
              </button>
            ) : (
              <kbd className="notes-search-kbd grid h-[1.55rem] min-w-[1.55rem] place-items-center rounded-md border border-[rgba(55,53,47,0.12)] bg-[color-mix(in_srgb,var(--editor-surface)_90%,transparent)] px-1.5 text-[11px] font-semibold text-muted-foreground dark:border-[rgba(255,255,255,0.12)]">
                /
              </kbd>
            )}
          </label>

          <div className="notes-toolbar">
            <div className="notes-toolbar-controls" role="group" aria-label={ui.notesView}>
              <fieldset className="notes-view-toggle m-0">
                <legend className="sr-only">{ui.notesView}</legend>
                <button
                  type="button"
                  className={cn('notes-view-btn', view === 'cards' && 'is-active')}
                  onClick={() => setView('cards')}
                  aria-pressed={view === 'cards'}
                  aria-label={ui.notesViewCards}
                  title={ui.notesViewCards}
                >
                  <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className={cn('notes-view-btn', view === 'list' && 'is-active')}
                  onClick={() => setView('list')}
                  aria-pressed={view === 'list'}
                  aria-label={ui.notesViewList}
                  title={ui.notesViewList}
                >
                  <List className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </fieldset>

              <Select value={sort} onValueChange={(value) => setSort(value as NotesSort)}>
                <SelectTrigger className="notes-sort-trigger" aria-label={ui.notesSort}>
                  <SelectValue placeholder={ui.notesSort} />
                </SelectTrigger>
                <SelectContent align="end" className="min-w-[10.5rem]">
                  {SORTS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {sortLabel(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="notes-search-tags" role="group" aria-label={ui.notesAll}>
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={cn('notes-tag', activeTag === null && 'is-active')}
              >
                {ui.notesAll}
                <span className="notes-tag-count">{notes.length}</span>
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                  className={cn('notes-tag', activeTag === tag && 'is-active is-tag')}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <p className="notes-search-meta" aria-live="polite">
            {isFiltering
              ? ui.notesResultsCount.replace('{count}', String(sorted.length))
              : ui.notesResultsAll.replace('{count}', String(notes.length))}
          </p>
        </div>

        {featured ? (
          <NotionLink
            href={noteHref(lang, featured.id)}
            className="notes-featured group mb-5 grid overflow-hidden rounded-[14px] border border-[rgba(55,53,47,0.1)] transition-colors hover:border-[color-mix(in_srgb,var(--primary)_45%,transparent)] dark:border-[rgba(255,255,255,0.1)] md:grid-cols-[1.15fr_1fr]"
          >
            <div className="relative min-h-[180px] overflow-hidden md:min-h-[240px]">
              <PageCover
                cover={getNoteCover(featured.cover)}
                accent={featured.accent}
                className="h-full min-h-[180px] md:min-h-[240px]"
              />
              <span className="absolute top-3 left-3 rounded-[6px] bg-background/90 px-2 py-1 text-[11px] font-semibold tracking-wide text-foreground uppercase backdrop-blur-sm">
                {ui.notesFeatured}
              </span>
            </div>
            <div className="flex flex-col justify-center gap-3 p-5 sm:p-6">
              <span className="text-[28px]" aria-hidden>
                {featured.icon}
              </span>
              <span className="text-[24px] leading-tight font-semibold tracking-[-0.02em] text-foreground group-hover:text-[var(--link)] sm:text-[28px]">
                {featured.title[lang]}
              </span>
              <span className="text-[14px] leading-relaxed text-muted-foreground">
                {featured.summary[lang]}
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                <time dateTime={featured.date}>{featured.date}</time>
                <span aria-hidden>·</span>
                <span>{ui.notesReading.replace('{min}', String(featured.readingMinutes))}</span>
                <span className="inline-flex items-center gap-1 font-medium text-[var(--link)]">
                  {ui.notesRead}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </span>
            </div>
          </NotionLink>
        ) : null}

        <AnimatePresence mode="popLayout" initial={false}>
          {sorted.length === 0 ? (
            <motion.div
              key="empty"
              className="rounded-[10px] border border-dashed border-[rgba(55,53,47,0.14)] px-4 py-8 text-center dark:border-[rgba(255,255,255,0.14)]"
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.28, ease: MOTION_EASE }}
            >
              <p className="text-[15px] font-medium text-foreground">{ui.notesEmpty}</p>
              <p className="mt-1 text-[13px] text-muted-foreground">{ui.notesEmptyHint}</p>
              {isFiltering ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setActiveTag(null)
                  }}
                  className="mt-3 rounded-[4px] px-2.5 py-1.5 text-[13px] font-medium text-[var(--link)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]"
                >
                  {ui.notesResetFilters}
                </button>
              ) : null}
            </motion.div>
          ) : (
            <motion.ul
              key={`results-${deferredQuery}-${activeTag ?? 'all'}-${sort}-${view}`}
              className={cn(
                view === 'list'
                  ? 'notes-list divide-y divide-[rgba(55,53,47,0.08)] dark:divide-[rgba(255,255,255,0.08)]'
                  : 'grid gap-3 sm:grid-cols-2',
              )}
              initial="hidden"
              animate="show"
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: MOTION_EASE }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.028,
                    delayChildren: reduceMotion ? 0 : 0.015,
                  },
                },
              }}
            >
              {gridNotes.map((note) => (
                <motion.li
                  key={note.id}
                  variants={{
                    hidden: reduceMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 6 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.26, ease: MOTION_EASE }}
                >
                  {view === 'list' ? (
                    <NoteListRow note={note} lang={lang} query={deferredQuery} />
                  ) : (
                    <NoteCard
                      note={note}
                      lang={lang}
                      readLabel={ui.notesRead}
                      query={deferredQuery}
                    />
                  )}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </MotionSection>
    </PageShell>
  )
}
