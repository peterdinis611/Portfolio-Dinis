import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export function BlockH1({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        'mb-2 mt-8 text-[1.875rem] font-bold leading-tight tracking-[-0.03em] text-foreground first:mt-0',
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
        'mb-2 mt-7 scroll-mt-20 text-[1.375rem] font-semibold tracking-[-0.02em] text-foreground first:mt-0',
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
        'mb-1.5 mt-5 scroll-mt-20 text-[1.125rem] font-semibold text-foreground first:mt-0',
        className,
      )}
    >
      {children}
    </h3>
  )
}

export function BlockQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-4 border-l-[3px] border-foreground/20 py-0.5 pl-4 text-[15px] italic leading-relaxed text-foreground/80">
      {children}
    </blockquote>
  )
}

export function BlockHighlight({
  tone = 'yellow',
  children,
}: {
  tone?: 'yellow' | 'blue' | 'gray' | 'pink'
  children: ReactNode
}) {
  const toneClass = {
    yellow: 'bg-amber-100/90 text-foreground dark:bg-amber-950/40',
    blue: 'bg-sky-100/90 text-foreground dark:bg-sky-950/40',
    gray: 'bg-muted text-foreground',
    pink: 'bg-rose-100/90 text-foreground dark:bg-rose-950/35',
  }[tone]

  return (
    <p className={cn('my-2 inline-block rounded px-1.5 py-0.5 text-[15px] leading-relaxed', toneClass)}>
      {children}
    </p>
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
    <Collapsible defaultOpen={defaultOpen} className="my-0.5">
      <CollapsibleTrigger className="group flex w-full items-start gap-1.5 rounded px-1 py-1.5 text-left transition-colors hover:bg-muted/50">
        <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
        <span className="text-[15px] font-medium text-foreground">{title}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-2 pl-5 text-[15px] leading-relaxed text-foreground/90">
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
    <div className="my-2 space-y-0.5">
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
    <ul className="my-2 space-y-1.5">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
          <span
            className={cn(
              'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border text-[10px] font-bold',
              item.done
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-transparent',
            )}
            aria-hidden
          >
            {item.done ? '✓' : '·'}
          </span>
          <span className={cn(item.done && 'text-muted-foreground line-through')}>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

export function BlockNumberedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="my-2 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-foreground/90">
      {items.map((item) => (
        <li key={item}>{item}</li>
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
    <div className="notion-code-block my-3 overflow-hidden rounded-md border border-border bg-[#f7f6f3] dark:bg-[#252525]">
      {language ? (
        <div className="border-b border-border/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {language}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-relaxed text-foreground/95">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function BlockInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[3px] bg-[#f1f1ef] px-1.5 py-0.5 font-mono text-[0.9em] text-[#eb5757] dark:bg-white/10 dark:text-[#ff7369]">
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
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="notion-bookmark my-3 flex overflow-hidden rounded-md border border-border bg-card transition-colors hover:bg-muted/30"
    >
      <div className="min-w-0 flex-1 border-l-[3px] border-l-muted-foreground/25 px-3 py-2.5">
        <p className="truncate text-xs text-muted-foreground">{bookmarkDomain(href)}</p>
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
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
    <a
      href={href}
      className="portfolio-page-link my-1 inline-flex max-w-full items-center gap-1.5 rounded px-1.5 py-0.5 text-[15px] text-foreground transition-colors hover:bg-muted/60 dark:hover:bg-white/[0.055]"
    >
      <span className="text-base leading-none" aria-hidden>
        {icon}
      </span>
      <span className="truncate border-b border-dotted border-foreground/30 pb-px dark:border-white/35">
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
    <nav
      className="notion-toc my-4 rounded-md border border-border/80 bg-muted/25 px-4 py-3"
      aria-label={title}
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-1 border-l border-border/70 pl-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground dark:text-white/65 dark:hover:text-white/90"
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
        'notion-columns my-4 grid gap-3',
        cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3',
      )}
    >
      {children.map((child, index) => (
        <div key={index} className="min-w-0 text-[15px] leading-relaxed">
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
    <div className="notion-gallery my-4 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
        >
          <div className="flex h-24 items-center justify-center bg-gradient-to-br from-muted/60 to-muted/20 text-4xl">
            {item.icon}
          </div>
          <div className="space-y-1.5 p-3">
            <p className="font-semibold leading-tight text-foreground group-hover:text-primary">
              {item.title}
            </p>
            <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-[3px] bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

export function BlockCalloutRich({
  icon,
  title,
  children,
  variant = 'default',
}: {
  icon: string
  title?: string
  children: ReactNode
  variant?: 'default' | 'warning' | 'success' | 'idea' | 'info'
}) {
  const variantClass = {
    default: 'border-l-muted-foreground/30 bg-muted/60',
    warning: 'border-l-orange-400 bg-orange-50/80 dark:bg-orange-950/25',
    success: 'border-l-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/25',
    idea: 'border-l-amber-400 bg-amber-50/80 dark:bg-amber-950/25',
    info: 'border-l-sky-400 bg-sky-50/80 dark:bg-sky-950/25',
  }[variant]

  return (
    <div className={cn('my-4 flex gap-3 rounded-r-md border-l-[3px] px-4 py-3', variantClass)}>
      <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 text-[15px] leading-[1.6] text-foreground/90">
        {title ? <p className="mb-1 font-semibold text-foreground">{title}</p> : null}
        {children}
      </div>
    </div>
  )
}

export function BlockDividerDots() {
  return (
    <div className="my-6 flex justify-center gap-1.5" aria-hidden>
      <span className="size-1 rounded-full bg-border" />
      <span className="size-1 rounded-full bg-border" />
      <span className="size-1 rounded-full bg-border" />
    </div>
  )
}
