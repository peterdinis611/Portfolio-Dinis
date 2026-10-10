import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { NoteDetailPage } from '@/components/notion/pages/NoteDetailPage'
import { isNoteId, notes } from '@/data/notes'
import { resolveLocale } from '@/lib/i18n-params'
import { LOCALES } from '@/lib/locale'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => notes.map((note) => ({ locale, noteId: note.id })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; noteId: string }>
}) {
  const { locale: localeParam, noteId } = await params
  const locale = await resolveLocale(Promise.resolve({ locale: localeParam }))
  if (!isNoteId(noteId)) {
    return buildMetadata(locale, { page: 'not-found', attemptedPath: `notes/${noteId}` })
  }
  return buildMetadata(locale, { page: 'notes', noteId })
}

export default async function NoteDetailRoute({
  params,
}: {
  params: Promise<{ locale: string; noteId: string }>
}) {
  const { locale: localeParam, noteId } = await params
  const locale = await resolveLocale(Promise.resolve({ locale: localeParam }))
  if (!isNoteId(noteId)) notFound()

  return (
    <>
      <JsonLd locale={locale} route={{ page: 'notes', noteId }} />
      <NoteDetailPage lang={locale} noteId={noteId} />
    </>
  )
}
