import { highlightParts } from '@/lib/search-utils'
import { cn } from '@/lib/utils'

/** Render text with Fuse-friendly query highlights. */
export function HighlightedText({
  text,
  query,
  className,
}: {
  text: string
  query?: string
  className?: string
}) {
  if (!query?.trim()) {
    return <span className={className}>{text}</span>
  }

  const parts = highlightParts(text, query)
  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.match ? (
          <mark
            // biome-ignore lint/suspicious/noArrayIndexKey: highlight segments are positional
            key={index}
            className={cn(
              'rounded-[2px] bg-[color-mix(in_srgb,var(--primary)_28%,transparent)] px-0.5 text-inherit',
              'dark:bg-[color-mix(in_srgb,var(--primary)_34%,transparent)]',
            )}
          >
            {part.text}
          </mark>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: highlight segments are positional
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  )
}
