/** Shared search helpers for Fuse-backed portfolio + notes search. */

export function normalizeSearch(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
}

export type HighlightPart = { text: string; match: boolean }

/**
 * Split display text into parts, marking spans that match any query token
 * (diacritics-insensitive). Safe for React rendering.
 */
export function highlightParts(text: string, query: string): HighlightPart[] {
  const tokens = normalizeSearch(query)
    .split(/\s+/)
    .filter((token) => token.length >= 2)
  if (!text || tokens.length === 0) return [{ text, match: false }]

  const normalized = normalizeSearch(text)
  const marks = new Array<boolean>(text.length).fill(false)

  for (const token of tokens) {
    let from = 0
    while (from < normalized.length) {
      const idx = normalized.indexOf(token, from)
      if (idx < 0) break
      for (let i = idx; i < idx + token.length && i < marks.length; i++) {
        marks[i] = true
      }
      from = idx + token.length
    }
  }

  const parts: HighlightPart[] = []
  let buffer = ''
  let mode = marks[0] ?? false

  for (let i = 0; i < text.length; i++) {
    const next = marks[i] ?? false
    if (next !== mode && buffer) {
      parts.push({ text: buffer, match: mode })
      buffer = ''
      mode = next
    }
    buffer += text[i]
  }
  if (buffer) parts.push({ text: buffer, match: mode })
  return parts.length > 0 ? parts : [{ text, match: false }]
}

/** ~220 wpm — typical technical blog pace. */
export function estimateReadingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 220))
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
