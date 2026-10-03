import { useEffect, useState } from 'react'
import type { NoteTocItem } from '@/lib/note-blocks'
import { cn } from '@/lib/utils'

export function NoteToc({
  items,
  title,
  className,
}: {
  items: NoteTocItem[]
  title: string
  className?: string
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    if (items.length === 0) return
    const pane = document.getElementById('main-content')
    if (!pane) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const onScroll = () => {
      const offset = pane.scrollTop + 120
      let current = items[0]?.id ?? null
      for (const el of headings) {
        if (el.offsetTop <= offset) current = el.id
      }
      setActiveId(current)
    }

    onScroll()
    pane.addEventListener('scroll', onScroll, { passive: true })
    return () => pane.removeEventListener('scroll', onScroll)
  }, [items])

  if (items.length < 2) return null

  return (
    <nav className={cn('note-toc', className)} aria-label={title}>
      <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
        {title}
      </p>
      <ol className="space-y-1 border-l border-[rgba(55,53,47,0.12)] dark:border-[rgba(255,255,255,0.12)]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault()
                const el = document.getElementById(item.id)
                const pane = document.getElementById('main-content')
                if (!el || !pane) return
                pane.scrollTo({ top: Math.max(0, el.offsetTop - 88), behavior: 'smooth' })
                setActiveId(item.id)
                const next = `${window.location.pathname}${window.location.search}#${item.id}`
                window.history.replaceState(null, '', next)
              }}
              className={cn(
                'block border-l-2 py-1 text-[12.5px] leading-snug transition-colors',
                item.level === 3 ? 'pl-4' : 'pl-3',
                activeId === item.id
                  ? '-ml-px border-[var(--primary)] font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
