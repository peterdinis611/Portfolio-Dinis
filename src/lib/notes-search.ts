import type { Note } from '@/data/notes'
import { getNotesByTag } from '@/data/notes'
import type { Lang } from '@/i18n/translations'

export type NotesQuery = {
  lang: Lang
  query?: string
  tag?: string | null
}

/** Diacritics-insensitive lowercase for SK/EN search. */
export function normalizeSearch(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
}

/** Score a single note against a free-text query. Higher is better; 0 = no match. */
export function scoreNote(note: Note, lang: Lang, query: string): number {
  const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return 1

  const title = normalizeSearch(note.title[lang])
  const summary = normalizeSearch(note.summary[lang])
  const tags = note.tags.map((tag) => normalizeSearch(tag))
  const body = normalizeSearch(note.body[lang].slice(0, 2).join(' '))
  let score = 0

  for (const token of tokens) {
    let matched = false

    if (title === token) {
      score += 24
      matched = true
    } else if (title.startsWith(token)) {
      score += 18
      matched = true
    } else if (title.includes(token)) {
      score += 14
      matched = true
    }

    if (tags.some((tag) => tag === token || tag.includes(token))) {
      score += 12
      matched = true
    }

    if (summary.includes(token)) {
      score += 8
      matched = true
    }

    if (body.includes(token)) {
      score += 4
      matched = true
    }

    if (!matched) return 0
  }

  return score
}

/**
 * Filter + rank blog notes by optional tag and free-text query.
 * Empty query returns date-sorted (or tag-filtered) list.
 */
export function filterNotes({ lang, query, tag = null }: NotesQuery): Note[] {
  const base = getNotesByTag(tag)
  const trimmed = query?.trim() ?? ''
  if (!trimmed) return base

  return base
    .map((note) => ({ note, score: scoreNote(note, lang, trimmed) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (a.note.date < b.note.date ? 1 : -1))
    .map((item) => item.note)
}
