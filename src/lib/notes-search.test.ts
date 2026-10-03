import { describe, expect, it } from 'vitest'
import { getNote, getNotesByTag, getNoteTags, isNoteId, notes } from '@/data/notes'
import { filterNotes, normalizeSearch, scoreNote } from '@/lib/notes-search'
import { searchPortfolio } from '@/lib/portfolio-search'
import { countWords, estimateReadingMinutes, highlightParts } from '@/lib/search-utils'

describe('notes data', () => {
  it('keeps unique ids and newest-first order', () => {
    const ids = notes.map((note) => note.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.length).toBeGreaterThanOrEqual(10)

    for (let i = 1; i < notes.length; i++) {
      expect(notes[i - 1]!.date >= notes[i]!.date).toBe(true)
    }
  })

  it('requires bilingual title, summary, and body for every note', () => {
    for (const note of notes) {
      expect(note.title.sk.trim()).not.toBe('')
      expect(note.title.en.trim()).not.toBe('')
      expect(note.summary.sk.trim()).not.toBe('')
      expect(note.summary.en.trim()).not.toBe('')
      expect(note.body.sk.length).toBeGreaterThanOrEqual(4)
      expect(note.body.en.length).toBe(note.body.sk.length)
      expect(note.body.sk.some((block) => block.type === 'h2')).toBe(true)
      expect(note.tags.length).toBeGreaterThan(0)
      expect(note.wordCount).toBeGreaterThan(50)
      expect(note.readingMinutes).toBe(estimateReadingMinutes(note.wordCount))
      expect(note.cover).toBeTruthy()
    }
  })

  it('resolves notes by id via Map helpers', () => {
    const first = notes[0]!
    expect(isNoteId(first.id)).toBe(true)
    expect(isNoteId('missing-note')).toBe(false)
    expect(getNote(first.id)?.title.en).toBe(first.title.en)
    expect(getNote('nope')).toBeUndefined()
  })

  it('lists sorted unique tags and filters by tag', () => {
    const tags = getNoteTags()
    expect(tags.length).toBeGreaterThan(5)
    expect([...tags].sort((a, b) => a.localeCompare(b))).toEqual(tags)

    const reactNotes = getNotesByTag('React')
    expect(reactNotes.length).toBeGreaterThan(0)
    expect(reactNotes.every((note) => note.tags.includes('React'))).toBe(true)
    expect(getNotesByTag(null)).toEqual(notes)
  })
})

describe('notes search', () => {
  it('normalizes diacritics for Slovak queries', () => {
    expect(normalizeSearch('Dizajn')).toBe('dizajn')
    expect(normalizeSearch('Prístupnosť')).toBe('pristupnost')
  })

  it('scores title hits higher than unrelated queries', () => {
    const note = getNote('react-performance')
    expect(note).toBeDefined()
    const titleScore = scoreNote(note!, 'en', 'performance')
    const unrelated = scoreNote(note!, 'en', 'kubernetes-cluster-xyz')
    expect(titleScore).toBeGreaterThan(40)
    expect(unrelated).toBe(0)
  })

  it('ranks closer title matches above weaker body matches', () => {
    const byTitle = filterNotes({ lang: 'en', query: 'design system' })
    expect(byTitle[0]?.id).toBe('design-systems')
  })

  it('filters by query across SK and EN', () => {
    const sk = filterNotes({ lang: 'sk', query: 'mentoring' })
    const en = filterNotes({ lang: 'en', query: 'accessibility' })
    expect(sk.some((note) => note.id === 'mentoring-juniors')).toBe(true)
    expect(en.some((note) => note.id === 'a11y-enterprise')).toBe(true)
  })

  it('combines tag filter with search query', () => {
    const results = filterNotes({ lang: 'en', query: 'fluent', tag: 'Accessibility' })
    expect(results.map((note) => note.id)).toContain('a11y-enterprise')
    expect(results.every((note) => note.tags.includes('Accessibility'))).toBe(true)
  })

  it('returns empty list when nothing matches', () => {
    expect(filterNotes({ lang: 'en', query: 'zzzz-no-such-topic' })).toEqual([])
  })

  it('returns full tag subset when query is blank', () => {
    const tagged = filterNotes({ lang: 'en', query: '   ', tag: 'React' })
    expect(tagged).toEqual(getNotesByTag('React'))
  })
})

describe('portfolio search notes index', () => {
  it('finds blog posts by tag and body terms', () => {
    const byTag = searchPortfolio('en', 'XState', 10)
    expect(byTag.some((result) => result.noteId === 'xstate-ui')).toBe(true)

    const byBody = searchPortfolio('sk', 'idempotencia', 10)
    expect(byBody.some((result) => result.noteId === 'api-boundaries')).toBe(true)
  })

  it('keeps the query on hits for highlight rendering', () => {
    const hits = searchPortfolio('en', 'design system', 5)
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.every((hit) => hit.query === 'design system')).toBe(true)
  })
})

describe('search highlight helpers', () => {
  it('marks diacritics-insensitive matches', () => {
    const parts = highlightParts('Prístupnosť v enterprise', 'pristupnost')
    expect(parts.some((part) => part.match && /Prístupnosť/i.test(part.text))).toBe(true)
  })

  it('counts words and estimates reading time', () => {
    expect(countWords('one two three')).toBe(3)
    expect(estimateReadingMinutes(220)).toBe(1)
    expect(estimateReadingMinutes(440)).toBe(2)
  })
})
