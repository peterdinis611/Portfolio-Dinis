import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { getNoteTags, notes } from '@/data/notes'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { filterNotes } from '@/lib/notes-search'
import { noteHref } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import { PageShell, PageTitle } from '../blocks'
import { MOTION_EASE, MotionSection } from '../motion'
import { PageCover } from '../PageCover'

export function NotesPage({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui
  const reduceMotion = useMotionDisabled()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [typeTick, setTypeTick] = useState(0)
  const deferredQuery = useDeferredValue(query)
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldRef = useRef<HTMLLabelElement>(null)
  const tags = useMemo(() => getNoteTags(), [])
  const filtered = useMemo(
    () => filterNotes({ lang, query: deferredQuery, tag: activeTag }),
    [lang, deferredQuery, activeTag],
  )
  const hasQuery = Boolean(query.trim())
  const isFiltering = hasQuery || activeTag !== null

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
    // Force reflow so the keyframe can restart on every keystroke.
    void field.offsetWidth
    field.classList.add('is-keyed')
    const timer = window.setTimeout(() => field.classList.remove('is-keyed'), 480)
    return () => window.clearTimeout(timer)
  }, [typeTick, reduceMotion])

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
                if (!reduceMotion && next.trim()) {
                  setTypeTick((tick) => tick + 1)
                }
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

          <p className="notes-search-meta" aria-live="polite">
            {isFiltering
              ? ui.notesResultsCount.replace('{count}', String(filtered.length))
              : ui.notesResultsAll.replace('{count}', String(notes.length))}
          </p>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.length === 0 ? (
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
              key={`results-${deferredQuery}-${activeTag ?? 'all'}`}
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
              {filtered.map((note) => (
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
                  <a
                    href={noteHref(note.id)}
                    className="group flex h-full flex-col rounded-[12px] border border-[rgba(55,53,47,0.1)] bg-[color-mix(in_srgb,var(--editor-surface)_94%,var(--primary))] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_42%,transparent)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] dark:border-[rgba(255,255,255,0.1)]"
                  >
                    <span className="mb-3 flex items-start justify-between gap-2">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(24,116,122,0.14)] text-[22px] transition-transform duration-300 group-hover:-translate-y-0.5 dark:bg-[rgba(126,200,207,0.16)]"
                        aria-hidden
                      >
                        {note.icon}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--link)] opacity-70 transition-opacity group-hover:opacity-100">
                        {ui.notesRead}
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
                      <span>{ui.notesReading.replace('{min}', String(note.readingMinutes))}</span>
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
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </MotionSection>
    </PageShell>
  )
}
