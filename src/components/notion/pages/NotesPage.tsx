import { ArrowUpRight } from 'lucide-react'
import { notes } from '@/data/notes'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { noteHref } from '@/lib/portfolio-route'
import { BlockHeading, PageShell, PageTitle } from '../blocks'
import { MotionSection } from '../motion'
import { BlockCalloutRich, BlockGallery } from '../notion-blocks'
import { PageCover } from '../PageCover'

export function NotesPage({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui

  const galleryItems = notes.map((note) => ({
    id: note.id,
    href: noteHref(note.id),
    icon: (
      <span
        className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(24,116,122,0.14)] text-[22px] dark:bg-[rgba(126,200,207,0.16)]"
        aria-hidden
      >
        {note.icon}
      </span>
    ),
    title: note.title[lang],
    subtitle: note.summary[lang],
    tags: [ui.notesReading.replace('{min}', String(note.readingMinutes)), ...note.tags.slice(0, 2)],
  }))

  return (
    <PageShell cover={<PageCover variant="tech" />}>
      <MotionSection>
        <PageTitle icon="✍️" description={ui.notesIntro}>
          {ui.notes}
        </PageTitle>
      </MotionSection>

      <MotionSection delay={0.04}>
        <BlockCalloutRich title={ui.notesSection} variant="info" icon="✨">
          {ui.notesAll} · {notes.length}
        </BlockCalloutRich>
      </MotionSection>

      <MotionSection delay={0.06} className="mt-6">
        <BlockHeading className="mt-0">{ui.notesSection}</BlockHeading>

        {notes.length === 0 ? (
          <p className="text-[15px] text-muted-foreground">{ui.notesEmpty}</p>
        ) : (
          <>
            <BlockGallery items={galleryItems} />

            <ul className="mt-6 space-y-2">
              {notes.map((note) => (
                <li key={note.id}>
                  <a
                    href={noteHref(note.id)}
                    className="group flex items-center gap-3 rounded-[10px] border border-[rgba(55,53,47,0.1)] bg-[color-mix(in_srgb,var(--editor-surface)_94%,var(--primary))] px-3.5 py-3 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] dark:border-[rgba(255,255,255,0.1)]"
                  >
                    <span className="text-[18px]" aria-hidden>
                      {note.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground group-hover:text-[var(--link)]">
                        {note.title[lang]}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">
                        <time dateTime={note.date}>{note.date}</time>
                        <span aria-hidden> · </span>
                        {ui.notesReading.replace('{min}', String(note.readingMinutes))}
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-[var(--link)] opacity-80 transition-opacity group-hover:opacity-100">
                      {ui.notesRead}
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </MotionSection>
    </PageShell>
  )
}
