import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

const calloutVariantMeta = {
  default: {
    icon: '📝',
    className: 'bg-[rgba(241,241,239,0.9)] dark:bg-[rgba(255,255,255,0.055)]',
  },
  warning: {
    icon: '⚠️',
    className: 'bg-[rgba(233,168,0,0.12)]',
  },
  success: {
    icon: '✅',
    className: 'bg-[rgba(15,123,108,0.12)]',
  },
  idea: {
    icon: '💡',
    className: 'bg-[rgba(233,168,0,0.12)]',
  },
  info: {
    icon: 'ℹ️',
    className: 'bg-[rgba(35,131,226,0.12)]',
  },
} as const

export function BlockH1({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        'mb-1 mt-8 text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-foreground first:mt-0',
        className,
      )}
    >
      {children}
    </h1>
  )
}

export function BlockH2({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <h2
      id={id}
      className={cn(
        'mb-1 mt-6 scroll-mt-24 text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-foreground first:mt-0',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function BlockH3({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <h3
      id={id}
      className={cn(
        'mb-1 mt-4 scroll-mt-24 text-[20px] font-semibold leading-[1.3] text-foreground first:mt-0',
        className,
      )}
    >
      {children}
    </h3>
  )
}

export function BlockQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="notion-block my-1 border-l-[3px] border-[rgba(55,53,47,0.2)] py-0.5 pl-[14px] text-[1.05em] leading-[1.6] text-[rgba(55,53,47,0.75)] dark:border-[rgba(255,255,255,0.2)] dark:text-[rgba(255,255,255,0.7)]">
      {children}
    </blockquote>
  )
}

export function BlockHighlight({
  tone = 'gray',
  children,
}: {
  tone?: 'yellow' | 'blue' | 'gray' | 'pink'
  children: ReactNode
}) {
  const toneClass = {
    yellow: 'bg-[rgba(255,212,0,0.35)] text-foreground',
    blue: 'bg-[rgba(35,131,226,0.2)] text-foreground',
    gray: 'bg-[rgba(135,131,120,0.2)] text-foreground',
    pink: 'bg-[rgba(226,85,161,0.2)] text-foreground',
  }[tone]

  return (
    <span className={cn('rounded-[3px] px-1 py-0.5 text-[15px] leading-[1.5]', toneClass)}>
      {children}
    </span>
  )
}

export function BlockToggle({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="notion-block my-0.5">
      <CollapsibleTrigger className="group flex w-full items-start gap-1 rounded-[4px] py-1 pr-1 text-left transition-colors hover:bg-[rgba(55,53,47,0.06)] dark:hover:bg-[rgba(255,255,255,0.055)]">
        <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[3px] text-muted-foreground">
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-150 group-data-[state=open]:rotate-90" />
        </span>
        <span className="min-w-0 flex-1 py-px text-[16px] font-medium leading-[1.5] text-foreground">
          {title}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-1 pl-[30px] text-[16px] leading-[1.5] text-foreground/90">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function BlockToggleGroup({
  items,
  defaultOpenIndex = 0,
}: {
  items: Array<{ title: string; body: ReactNode }>
  defaultOpenIndex?: number
}) {
  return (
    <div className="my-1">
      {items.map((item, index) => (
        <BlockToggle key={item.title} title={item.title} defaultOpen={index === defaultOpenIndex}>
          {item.body}
        </BlockToggle>
      ))}
    </div>
  )
}

export function BlockTodoList({
  items,
}: {
  items: Array<{ text: string; done?: boolean }>
}) {
  return (
    <ul className="my-1">
      {items.map((item) => (
        <li
          key={item.text}
          className="notion-block flex items-start gap-2 rounded-[4px] py-1 pr-1 transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]"
        >
          <span className="notion-checkbox" data-checked={item.done ? 'true' : 'false'} aria-hidden>
            {item.done ? '✓' : ''}
          </span>
          <span
            className={cn(
              'text-[16px] leading-[1.5]',
              item.done ? 'text-muted-foreground line-through' : 'text-foreground',
            )}
          >
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function BlockNumberedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="my-1 list-decimal space-y-1 pl-7 text-[16px] leading-[1.5] text-foreground marker:text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  )
}

export function BlockCode({
  code,
  language,
}: {
  code: string
  language?: string
}) {
  return (
    <div className="notion-block my-2 overflow-hidden rounded-[4px] bg-[rgba(135,131,120,0.15)] dark:bg-[rgba(255,255,255,0.055)]">
      {language ? (
        <div className="px-3.5 pt-2.5 font-mono text-[12px] text-muted-foreground">{language}</div>
      ) : null}
      <pre className="overflow-x-auto px-3.5 py-3 font-mono text-[13.5px] leading-[1.5] text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function BlockInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[3px] bg-[rgba(135,131,120,0.15)] px-[0.3em] py-[0.1em] font-mono text-[85%] text-[var(--code-inline)] dark:bg-[rgba(255,255,255,0.08)]">
      {children}
    </code>
  )
}

function bookmarkDomain(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return href
  }
}

export function BlockBookmark({
  href,
  title,
  description,
  external,
}: {
  href: string
  title: string
  description: string
  external?: boolean
}) {
  const domain = bookmarkDomain(href)

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="notion-block my-2 flex overflow-hidden rounded-[4px] border border-[rgba(55,53,47,0.16)] transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.13)] dark:hover:bg-[rgba(255,255,255,0.04)]"
    >
      <span className="min-w-0 flex-1 px-3.5 py-3">
        <span className="mb-1 block truncate text-[14px] font-medium text-foreground">{title}</span>
        <span className="mb-1.5 line-clamp-2 block text-[12px] leading-snug text-muted-foreground">
          {description}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <span className="flex h-4 w-4 items-center justify-center rounded-[2px] bg-[rgba(55,53,47,0.08)] text-[9px] dark:bg-[rgba(255,255,255,0.08)]">
            {domain.slice(0, 1).toUpperCase()}
          </span>
          {domain}
        </span>
      </span>
    </a>
  )
}

export function BlockPageLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: string
  label: string
}) {
  return (
    <a href={href} className="notion-page-mention">
      <span className="text-[1em]" aria-hidden>
        {icon}
      </span>
      <span className="underline decoration-[rgba(55,53,47,0.25)] underline-offset-2 dark:decoration-[rgba(255,255,255,0.25)]">
        {label}
      </span>
    </a>
  )
}

export function BlockTableOfContents({
  title,
  items,
}: {
  title: string
  items: Array<{ id: string; label: string }>
}) {
  return (
    <nav className="notion-block my-3 py-1" aria-label={title}>
      <p className="mb-1 px-1 text-[12px] font-medium text-muted-foreground">{title}</p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block rounded-[4px] px-1 py-0.5 text-[14px] text-muted-foreground transition-colors hover:bg-[rgba(55,53,47,0.06)] hover:text-foreground dark:hover:bg-[rgba(255,255,255,0.055)]"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function BlockColumns({
  children,
  cols = 2,
}: {
  children: ReactNode[]
  cols?: 2 | 3
}) {
  return (
    <div
      className={cn(
        'my-2 grid gap-4',
        cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3',
      )}
    >
      {children.map((child, index) => (
        <div key={index} className="min-w-0 text-[16px] leading-[1.5]">
          {child}
        </div>
      ))}
    </div>
  )
}

export function BlockGallery({
  items,
}: {
  items: Array<{
    id: string
    href: string
    icon: string
    title: string
    subtitle: string
    tags: string[]
  }>
}) {
  return (
    <ul className="my-2 grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            className="notion-block group flex h-full flex-col rounded-[8px] border border-[rgba(55,53,47,0.1)] p-3 transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.1)] dark:hover:bg-[rgba(255,255,255,0.04)]"
          >
            <span className="mb-2 text-[28px] leading-none" aria-hidden>
              {item.icon}
            </span>
            <span className="mb-0.5 truncate text-[15px] font-medium text-foreground group-hover:text-[var(--link)]">
              {item.title}
            </span>
            <span className="line-clamp-2 text-[13px] leading-snug text-muted-foreground">
              {item.subtitle}
            </span>
            {item.tags.length > 0 ? (
              <span className="mt-2 flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[3px] bg-[rgba(135,131,120,0.15)] px-1.5 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function BlockCalloutRich({
  icon,
  title,
  children,
  variant = 'default',
}: {
  icon?: string
  title?: string
  children: ReactNode
  variant?: keyof typeof calloutVariantMeta
}) {
  const meta = calloutVariantMeta[variant]

  return (
    <div
      className={cn(
        'notion-block my-2 flex gap-2.5 rounded-[4px] px-3.5 py-3',
        meta.className,
      )}
    >
      <span className="mt-0.5 shrink-0 text-[18px] leading-none" aria-hidden>
        {icon ?? meta.icon}
      </span>
      <div className="min-w-0 flex-1">
        {title ? (
          <p className="mb-0.5 text-[15px] font-semibold leading-[1.4] text-foreground">{title}</p>
        ) : null}
        <div className="text-[15px] leading-[1.5] text-foreground/90">{children}</div>
      </div>
    </div>
  )
}

export function BlockDividerDots() {
  return (
    <hr className="notion-block my-3 border-0 border-t border-[rgba(55,53,47,0.09)] dark:border-[rgba(255,255,255,0.09)]" />
  )
}
