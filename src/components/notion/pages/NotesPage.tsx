import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
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
import { PageCover } from '../PageCover'

const SORTS: NotesSort[] = ['newest', 'reading', 'az']

function readNotesParams(): { q: string; tag: string | null; sort: NotesSort } {
  const params = new URLSearchParams(window.location.search)
  const sortParam = params.get('sort')
  const sort = SORTS.includes(sortParam as NotesSort) ? (sortParam as NotesSort) : 'newest'
  return {
    q: params.get('q') ?? '',
    tag: params.get('tag'),
    sort,
  }
}

function writeNotesParams(state: { q: string; tag: string | null; sort: NotesSort }) {
  const params = new URLSearchParams()
  if (state.q.trim()) params.set('q', state.q.trim())
  if (state.tag) params.set('tag', state.tag)
  if (state.sort !== 'newest') params.set('sort', state.sort)
  const qs = params.toString()
  const next = qs ? `/notes?${qs}` : '/notes'
  const current = `${window.location.pathname}${window.location.search}`
  if (current !== next) {
    window.history.replaceState(null, '', next)
  }
}

function NoteCard({ note, lang, readLabel }: { note: Note; lang: Lang; readLabel: string }) {
  return (
    <a
      href={noteHref(note.id)}
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
        {note.title[lang]}
      </span>
      <span className="mb-3 line-clamp-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
        {note.summary[lang]}
      </span>
      <span className="mt-auto flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
        <time dateTime={note.date}>{note.date}</time>
        <span aria-hidden>·</span>
        <span>
          {translations[lang].ui.notesReading.replace('{min}', String(note.readingMinutes))}
        </span>
        {note.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-[3px] bg-[rgba(55,53,47,0.06)] px-1.5 py-0.5 dark:bg-[rgba(255,255,255,0.08)]"
          >
            {tag}
          </span>
        ))}
      </span>
    </a>
  )
}

export function NotesPage({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui
  const reduceMotion = useMotionDisabled()
  const initial = useMemo(() => readNotesParams(), [])
  const [query, setQuery] = useState(initial.q)
  const [activeTag, setActiveTag] = useState<string | null>(initial.tag)
  const [sort, setSort] = useState<NotesSort>(initial.sort)
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
    writeNotesParams({ q: query, tag: activeTag, sort })
  }, [query, activeTag, sort])

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
    <PageShell cover={<PageCover variant="tech" />}>
      <MotionSection>
        <PageTitle icon="✍️" description={ui.notesIntro}>
          {ui.notes}
        </PageTitle>
      </MotionSection>

      <MotionSection delay={0.04} className="mt-1">
        <div className={cn('notes-search mb-5', hasQuery && 'has-query')}>
          <label
            ref={fieldRef}
            className={cn('notes-search-field group/search', hasQuery && 'has-query')}
          >
            <span className="sr-only">{ui.notesSearch}</span>
            <span className="notes-search-icon" aria-hidden>
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
              className="notes-search-input"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="notes-search-clear"
                aria-label={ui.notesSearchClear}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.25} />
              </button>
            ) : (
              <kbd className="notes-search-kbd">/</kbd>
            )}
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="notes-search-tags">
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

            <label className="notes-sort self-start">
              <span className="sr-only">{ui.notesSort}</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as NotesSort)}
                className="notes-sort-select"
              >
                {SORTS.map((value) => (
                  <option key={value} value={value}>
                    {sortLabel(value)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="notes-search-meta" aria-live="polite">
            {isFiltering
              ? ui.notesResultsCount.replace('{count}', String(sorted.length))
              : ui.notesResultsAll.replace('{count}', String(notes.length))}
          </p>
        </div>

        {featured ? (
          <a
            href={noteHref(featured.id)}
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
          </a>
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
              key={`results-${deferredQuery}-${activeTag ?? 'all'}-${sort}`}
              className="grid gap-3 sm:grid-cols-2"
              initial="hidden"
              animate="show"
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: MOTION_EASE }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.035,
                    delayChildren: reduceMotion ? 0 : 0.02,
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
                      : { opacity: 0, y: 12, scale: 0.98 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.32, ease: MOTION_EASE }}
                >
                  <NoteCard note={note} lang={lang} readLabel={ui.notesRead} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </MotionSection>
    </PageShell>
  )
}
