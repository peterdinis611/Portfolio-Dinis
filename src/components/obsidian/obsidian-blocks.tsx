import { ChevronRight, FileText } from 'lucide-react'
import type { ReactNode } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

const calloutVariantMeta = {
  default: { label: 'note', className: 'border-l-[var(--link)] bg-muted/30' },
  warning: { label: 'warning', className: 'border-l-amber-500/70 bg-amber-500/5' },
  success: { label: 'tip', className: 'border-l-emerald-500/70 bg-emerald-500/5' },
  idea: { label: 'hint', className: 'border-l-amber-400/60 bg-amber-400/5' },
  info: { label: 'info', className: 'border-l-[var(--link)] bg-[color-mix(in_srgb,var(--link)_8%,transparent)]' },
} as const

export function BlockH1({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        'mb-2 mt-8 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-foreground first:mt-0',
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
        'mb-2 mt-6 scroll-mt-20 text-[1.125rem] font-semibold tracking-[-0.01em] text-foreground first:mt-0',
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
        'mb-1.5 mt-5 scroll-mt-20 text-base font-semibold text-foreground first:mt-0',
        className,
      )}
    >
      {children}
    </h3>
  )
}

export function BlockQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-4 border-l-2 border-[color-mix(in_srgb,var(--link)_35%,var(--border))] py-0.5 pl-4 text-[14px] italic leading-relaxed text-muted-foreground">
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
    yellow: 'bg-amber-500/10 text-amber-700 dark:text-amber-200',
    blue: 'bg-[color-mix(in_srgb,var(--link)_10%,transparent)] text-[var(--link)]',
    gray: 'bg-muted text-muted-foreground',
    pink: 'bg-rose-500/10 text-rose-700 dark:text-rose-200',
  }[tone]

  return (
    <p
      className={cn(
        'my-2 inline-block rounded-sm px-1.5 py-0.5 font-mono text-[12px] leading-relaxed',
        toneClass,
      )}
    >
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
    <Collapsible defaultOpen={defaultOpen} className="my-0.5 border-b border-border/60 last:border-b-0">
      <CollapsibleTrigger className="group flex w-full items-start gap-1.5 rounded-sm px-1 py-1.5 text-left transition-colors hover:bg-muted/40">
        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
        <span className="text-[13px] font-medium text-foreground">{title}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-2 pl-5 text-[14px] leading-relaxed text-foreground/90">
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
    <div className="my-2 border border-border">
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
    <ul className="my-2 space-y-1">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
          <span className="obsidian-checkbox" data-checked={item.done ? 'true' : 'false'} aria-hidden>
            {item.done ? '✓' : ''}
          </span>
          <span className={cn(item.done && 'text-muted-foreground line-through')}>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

export function BlockNumberedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="my-2 list-decimal space-y-1 pl-5 text-[14px] leading-relaxed text-foreground/90">
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
    <div className="obsidian-code-block my-3 overflow-hidden rounded-sm border border-border bg-[var(--code-bg)]">
      {language ? (
        <div className="border-b border-border px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          {language}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-foreground/95">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function BlockInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[2px] bg-muted px-1 py-0.5 font-mono text-[0.88em] text-[var(--code-inline)]">
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
      title={description}
      className="obsidian-external-link my-1.5 flex items-center gap-2 border border-border bg-card/30 px-2.5 py-1.5 transition-colors hover:border-[color-mix(in_srgb,var(--link)_35%,var(--border))] hover:bg-muted/30"
    >
      <span className="min-w-0 flex-1">
        <p className="truncate font-mono text-[12px] text-[var(--link)]">{title}</p>
        <p className="truncate text-[10px] text-muted-foreground">{bookmarkDomain(href)}</p>
      </span>
      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">↗</span>
    </a>
  )
}

export function BlockPageLink({
  href,
  icon: _icon,
  label,
}: {
  href: string
  icon: string
  label: string
}) {
  return (
    <a
      href={href}
      className="portfolio-page-link obsidian-wikilink my-0.5 inline-flex max-w-full items-center rounded-sm px-0.5 py-0.5 transition-colors hover:bg-muted/40"
    >
      <span className="truncate border-b border-[color-mix(in_srgb,var(--link)_40%,transparent)] leading-none">[[{label}]]</span>
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
    <nav className="obsidian-toc my-4 border border-border bg-card/30 px-3 py-2.5" aria-label={title}>
      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-0.5 border-l border-border pl-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-[13px] text-muted-foreground transition-colors hover:text-[var(--link)]"
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
        'my-4 grid gap-4',
        cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3',
      )}
    >
      {children.map((child, index) => (
        <div key={index} className="min-w-0 text-[14px] leading-relaxed">
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
    <ul className="my-3 divide-y divide-border border border-border">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            className="group flex items-start gap-2.5 px-3 py-2 transition-colors hover:bg-muted/40"
          >
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-[var(--link)]" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-mono text-[13px] text-[var(--link)] group-hover:underline">
                {item.id}.md
              </span>
              <span className="block truncate text-[12px] text-foreground">{item.title}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{item.subtitle}</span>
              {item.tags.length > 0 ? (
                <span className="mt-1 block truncate font-mono text-[10px] text-muted-foreground">
                  {item.tags.slice(0, 4).join(' · ')}
                </span>
              ) : null}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export function BlockCalloutRich({
  icon: _icon,
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
    <div className={cn('obsidian-callout my-4 border border-l-2 px-3 py-2.5', meta.className)}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--link)]">
        [!{meta.label}]
      </p>
      {title ? <p className="mt-1 text-[13px] font-semibold text-foreground">{title}</p> : null}
      <div className="mt-1 text-[14px] leading-[1.65] text-foreground/90">{children}</div>
    </div>
  )
}

export function BlockDividerDots() {
  return <hr className="my-6 border-0 border-t border-border" aria-hidden />
}
