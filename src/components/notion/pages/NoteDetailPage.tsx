import { getNote, getRelatedNotes } from '@/data/notes'
import { getNoteCover } from '@/data/page-covers'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { extractNoteToc } from '@/lib/note-blocks'
import { getAdjacentNotes, noteHref, pageHref } from '@/lib/portfolio-route'
import { BackLink, PageShell, PageTitle, TagList } from '../blocks'
import { MotionSection } from '../motion'
import { NoteBody } from '../notes/NoteBody'
import { NoteReadingProgress } from '../notes/NoteReadingProgress'
import { NoteToc } from '../notes/NoteToc'
import { PageCover } from '../PageCover'
import { NotFoundPage } from './NotFoundPage'

export function NoteDetailPage({ lang, noteId }: { lang: Lang; noteId: string }) {
  const ui = translations[lang].ui
  const note = getNote(noteId)

  if (!note) {
    return <NotFoundPage lang={lang} attemptedPath={`notes/${noteId}`} />
  }

  const { prev, next } = getAdjacentNotes(noteId)
  const related = getRelatedNotes(noteId, 3)
  const blocks = note.body[lang]
  const toc = extractNoteToc(blocks)
  const cover = getNoteCover(note.cover)

  return (
    <PageShell cover={<PageCover cover={cover} accent={note.accent} />}>
      <NoteReadingProgress accent={note.accent} />

      <MotionSection>
        <BackLink href={pageHref('notes')}>{ui.notesBack}</BackLink>
        <PageTitle
          icon={note.icon}
          meta={
            <span className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
              <time dateTime={note.date}>{note.date}</time>
              <span aria-hidden>·</span>
              <span>{ui.notesReading.replace('{min}', String(note.readingMinutes))}</span>
            </span>
          }
          description={note.summary[lang]}
        >
          {note.title[lang]}
        </PageTitle>
        <TagList tags={note.tags} />
      </MotionSection>

      <MotionSection delay={0.05} className="mt-6">
        <div className="mb-6 lg:hidden">
          <NoteToc items={toc} title={ui.notesToc} />
        </div>
        <div className="note-layout grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
          <NoteBody blocks={blocks} className="max-w-2xl" />
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <NoteToc items={toc} title={ui.notesToc} />
            </div>
          </aside>
        </div>
      </MotionSection>

      {related.length > 0 ? (
        <MotionSection delay={0.07} className="mt-10 border-t border-border pt-6">
          <h2 className="mb-3 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
            {ui.notesRelated}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <a
                  href={noteHref(item.id)}
                  className="group flex h-full flex-col rounded-[10px] border border-border px-3 py-3 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)]"
                >
                  <span className="mb-2 text-[18px]" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="line-clamp-2 text-[13px] font-medium text-foreground group-hover:text-[var(--link)]">
                    {item.title[lang]}
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    {ui.notesReading.replace('{min}', String(item.readingMinutes))}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </MotionSection>
      ) : null}

      {(prev || next) && (
        <MotionSection
          delay={0.08}
          className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
        >
          {prev ? (
            <a
              href={noteHref(prev.id)}
              className="rounded-[8px] border border-border px-3.5 py-3 text-[13px] text-muted-foreground transition-colors hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:text-foreground"
            >
              <span className="mb-1 block text-[11px] font-medium tracking-wide uppercase opacity-70">
                ← {ui.notesPrev}
              </span>
              <span className="line-clamp-2 font-medium text-foreground">{prev.title[lang]}</span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a
              href={noteHref(next.id)}
              className="rounded-[8px] border border-border px-3.5 py-3 text-right text-[13px] text-muted-foreground transition-colors hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:text-foreground"
            >
              <span className="mb-1 block text-[11px] font-medium tracking-wide uppercase opacity-70">
                {ui.notesNext} →
              </span>
              <span className="line-clamp-2 font-medium text-foreground">{next.title[lang]}</span>
            </a>
          ) : null}
        </MotionSection>
      )}
    </PageShell>
  )
}
