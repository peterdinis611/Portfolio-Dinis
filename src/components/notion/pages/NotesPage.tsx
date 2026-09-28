import { ArrowUpRight, Search, X } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { getNoteTags, notes } from '@/data/notes'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { filterNotes } from '@/lib/notes-search'
import { noteHref } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import { PageShell, PageTitle } from '../blocks'
import { MotionSection } from '../motion'
import { PageCover } from '../PageCover'

export function NotesPage({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)
  const tags = useMemo(() => getNoteTags(), [])
  const filtered = useMemo(
    () => filterNotes({ lang, query: deferredQuery, tag: activeTag }),
    [lang, deferredQuery, activeTag],
  )
  const isFiltering = Boolean(deferredQuery.trim()) || activeTag !== null

  return (
    <PageShell cover={<PageCover variant="tech" />}>
      <MotionSection>
        <PageTitle icon="✍️" description={ui.notesIntro}>
          {ui.notes}
        </PageTitle>
      </MotionSection>

      <MotionSection delay={0.04} className="mt-1">
        <label className="relative mb-4 block">
          <span className="sr-only">{ui.notesSearch}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui.notesSearchPlaceholder}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-[8px] border border-[rgba(55,53,47,0.12)] bg-[color-mix(in_srgb,var(--editor-surface)_94%,var(--primary))] py-2.5 pr-10 pl-10 text-[14px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-[color-mix(in_srgb,var(--primary)_45%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_16%,transparent)] dark:border-[rgba(255,255,255,0.12)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[4px] text-muted-foreground transition-colors hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground dark:hover:bg-[rgba(255,255,255,0.08)]"
              aria-label={ui.notesSearchClear}
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          ) : null}
        </label>

        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              'rounded-[4px] px-2 py-1 text-[12px] font-medium transition-colors',
              activeTag === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-[rgba(55,53,47,0.06)] text-muted-foreground hover:text-foreground dark:bg-[rgba(255,255,255,0.08)]',
            )}
          >
            {ui.notesAll} · {notes.length}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
              className={cn(
                'rounded-[4px] px-2 py-1 text-[12px] font-medium transition-colors',
                activeTag === tag
                  ? 'bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] text-[var(--primary)]'
                  : 'bg-[rgba(55,53,47,0.06)] text-muted-foreground hover:text-foreground dark:bg-[rgba(255,255,255,0.08)]',
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <p className="mb-4 text-[12.5px] text-muted-foreground" aria-live="polite">
          {isFiltering
            ? ui.notesResultsCount.replace('{count}', String(filtered.length))
            : ui.notesResultsAll.replace('{count}', String(notes.length))}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[rgba(55,53,47,0.14)] px-4 py-8 text-center dark:border-[rgba(255,255,255,0.14)]">
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
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {filtered.map((note) => (
              <li key={note.id}>
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
              </li>
            ))}
          </ul>
        )}
      </MotionSection>
    </PageShell>
  )
}
