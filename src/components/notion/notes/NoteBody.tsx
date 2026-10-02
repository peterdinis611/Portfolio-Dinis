import { useMemo } from 'react'
import type { NoteBlock } from '@/lib/note-blocks'
import { withHeadingIds } from '@/lib/note-blocks'
import { cn } from '@/lib/utils'

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded-[4px] bg-[rgba(55,53,47,0.08)] px-1 py-0.5 font-mono text-[0.86em] text-foreground dark:bg-[rgba(255,255,255,0.1)]">
      {children}
    </code>
  )
}

/** Very light inline markdown: `code` spans only. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((part) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return <InlineCode key={part}>{part.slice(1, -1)}</InlineCode>
        }
        return <span key={part}>{part}</span>
      })}
    </>
  )
}

const calloutTone: Record<string, string> = {
  tip: 'border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]',
  info: 'border-[rgba(35,131,226,0.35)] bg-[rgba(35,131,226,0.08)]',
  warn: 'border-[rgba(233,168,0,0.4)] bg-[rgba(233,168,0,0.1)]',
}

export function NoteBody({ blocks, className }: { blocks: NoteBlock[]; className?: string }) {
  const rendered = useMemo(() => withHeadingIds(blocks), [blocks])

  return (
    <div className={cn('note-body space-y-4', className)}>
      {rendered.map((block, index) => {
        const key = `${block.type}-${index}`
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={key}
                id={block.id}
                className="note-h2 scroll-mt-24 pt-4 text-[22px] font-semibold tracking-[-0.02em] text-foreground"
              >
                {block.text}
              </h2>
            )
          case 'h3':
            return (
              <h3
                key={key}
                id={block.id}
                className="note-h3 scroll-mt-24 pt-2 text-[17px] font-semibold tracking-[-0.01em] text-foreground"
              >
                {block.text}
              </h3>
            )
          case 'p':
            return (
              <p key={key} className="text-[15.5px] leading-[1.7] text-foreground/90">
                <RichText text={block.text} />
              </p>
            )
          case 'ul':
            return (
              <ul
                key={key}
                className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-foreground/90"
              >
                {block.items.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol
                key={key}
                className="list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-foreground/90"
              >
                {block.items.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ol>
            )
          case 'code':
            return (
              <pre
                key={key}
                className="note-code overflow-x-auto rounded-[10px] border border-[rgba(55,53,47,0.1)] bg-[color-mix(in_srgb,var(--editor-surface)_70%,#0f172a)] p-4 text-[12.5px] leading-relaxed text-[#e2e8f0] dark:border-[rgba(255,255,255,0.1)]"
              >
                <code className="font-mono whitespace-pre">{block.code}</code>
              </pre>
            )
          case 'callout':
            return (
              <aside
                key={key}
                className={cn(
                  'rounded-[10px] border px-3.5 py-3 text-[14px] leading-relaxed text-foreground',
                  calloutTone[block.tone ?? 'tip'],
                )}
              >
                <RichText text={block.text} />
              </aside>
            )
          case 'quote':
            return (
              <blockquote
                key={key}
                className="border-l-[3px] border-[color-mix(in_srgb,var(--primary)_55%,transparent)] pl-4 text-[15px] leading-relaxed text-muted-foreground italic"
              >
                <p>
                  <RichText text={block.text} />
                </p>
                {block.cite ? (
                  <cite className="mt-2 block text-[12px] not-italic opacity-80">
                    — {block.cite}
                  </cite>
                ) : null}
              </blockquote>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
