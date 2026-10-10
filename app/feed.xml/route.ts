import { notes } from '@/data/notes'
import { noteHref } from '@/lib/portfolio-route'
import { getSiteUrl } from '@/lib/seo'

export const dynamic = 'force-static'
export const revalidate = false

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function GET() {
  const siteUrl = getSiteUrl()
  const sorted = [...notes].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  const now = new Date().toUTCString()

  const items = sorted
    .map((note) => {
      const link = `${siteUrl}${noteHref('sk', note.id)}`
      return `    <item>
      <title>${escapeXml(note.title.sk)} / ${escapeXml(note.title.en)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(note.date).toUTCString()}</pubDate>
      <description>${escapeXml(note.summary.sk)} — ${escapeXml(note.summary.en)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Peter Dinis — Blog</title>
    <link>${siteUrl}/sk/notes</link>
    <description>Tech notes by Peter Dinis (SK/EN)</description>
    <language>sk</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  })
}
