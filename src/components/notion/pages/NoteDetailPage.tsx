import { getNote } from '@/data/notes'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { getAdjacentNotes, noteHref, pageHref } from '@/lib/portfolio-route'
import { BackLink, BlockText, PageShell, PageTitle, TagList } from '../blocks'
import { MotionSection } from '../motion'
import { PageCover } from '../PageCover'
import { NotFoundPage } from './NotFoundPage'

export function NoteDetailPage({ lang, noteId }: { lang: Lang; noteId: string }) {
  const ui = translations[lang].ui
  const note = getNote(noteId)

  if (!note) {
    return <NotFoundPage lang={lang} attemptedPath={`notes/${noteId}`} />
  }

  const { prev, next } = getAdjacentNotes(noteId)
  const paragraphs = note.body[lang]

  return (
    <PageShell cover={<PageCover variant="tech" />}>
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

      <MotionSection delay={0.05} className="mt-6 max-w-2xl space-y-4">
        {paragraphs.map((paragraph) => (
          <BlockText key={paragraph.slice(0, 32)}>{paragraph}</BlockText>
        ))}
      </MotionSection>

      {(prev || next) && (
        <MotionSection
          delay={0.08}
          className="mt-10 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
        >
          {prev ? (
            <a
              href={noteHref(prev.id)}
              className="rounded-[8px] border border-border px-3.5 py-3 text-[13px] text-muted-foreground transition-colors hover:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] hover:text-foreground"
            >
              <span className="mb-1 block text-[11px] font-medium tracking-wide uppercase opacity-70">
                ← {lang === 'sk' ? 'Predchádzajúci' : 'Previous'}
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
                {lang === 'sk' ? 'Ďalší' : 'Next'} →
              </span>
              <span className="line-clamp-2 font-medium text-foreground">{next.title[lang]}</span>
            </a>
          ) : null}
        </MotionSection>
      )}
    </PageShell>
  )
}
