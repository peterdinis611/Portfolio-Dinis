import type { ReactNode } from 'react'
import { getNotionTagColor, notionTagClass } from '@/lib/notion-tags'
import { cn } from '@/lib/utils'

export function PageShell({
  cover,
  children,
  className,
}: {
  cover?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className="w-full">
      {cover}
      <article
        className={cn(
          'mx-auto w-full max-w-[708px] px-5 sm:px-10',
          cover ? 'pb-10 pt-0 sm:pb-12' : 'py-10 sm:py-12',
          className,
        )}
      >
        {children}
      </article>
    </div>
  )
}

export function PageHero({
  name,
  title,
  subtitle,
  photo,
}: {
  name: string
  title: string
  subtitle?: string
  photo: ReactNode
}) {
  return (
    <div className="relative z-10 -mt-14 mb-6 flex flex-col items-center gap-3 sm:-mt-16 sm:flex-row sm:items-end sm:gap-4">
      <div className="rounded-xl border-4 border-background bg-background shadow-md">{photo}</div>
      <div className="text-center sm:pb-1 sm:text-left">
        <p className="text-xl font-bold tracking-tight text-foreground">{name}</p>
        <p className="text-sm font-medium text-foreground/90">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

export function StatGrid({ items }: { items: Array<{ value: string; label: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-border/70 bg-card px-3 py-3 text-center shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <p className="text-xl font-bold tracking-tight text-primary">{item.value}</p>
          <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

export function PageNavPills({
  items,
}: {
  items: Array<{ href: string; icon: string; label: string }>
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Quick navigation">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <span aria-hidden>{item.icon}</span>
          {item.label}
        </a>
      ))}
    </nav>
  )
}

export function ServiceGrid({ items }: { items: Array<{ icon: string; label: string }> }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.label}
          className="rounded-lg border border-border/70 bg-muted/20 px-3 py-3 text-center transition-colors hover:bg-muted/50"
        >
          <span className="text-lg" aria-hidden>
            {item.icon}
          </span>
          <p className="mt-1 text-xs font-medium leading-tight">{item.label}</p>
        </li>
      ))}
    </ul>
  )
}

export function PageTitle({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <header className="mb-6">
      <h1 className="flex items-center gap-2.5 text-[2.125rem] font-bold leading-[1.2] tracking-[-0.02em] text-foreground">
        <span className="text-[2.25rem] leading-none" aria-hidden>
          {icon}
        </span>
        {children}
      </h1>
    </header>
  )
}

export function BlockText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-[15px] leading-[1.65] text-foreground/90', className)}>{children}</p>
  )
}

export function BlockHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        'mb-2 mt-7 text-[1.125rem] font-semibold tracking-[-0.01em] text-foreground',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function BlockDivider() {
  return <hr className="my-6 border-0 border-t border-border" />
}

const calloutVariants = {
  default: 'border-l-[3px] border-l-muted-foreground/30 bg-muted/60',
  idea: 'border-l-[3px] border-l-amber-400 bg-amber-50/80 dark:bg-amber-950/25 dark:border-l-amber-500',
  info: 'border-l-[3px] border-l-sky-400 bg-sky-50/80 dark:bg-sky-950/25 dark:border-l-sky-500',
} as const

export function BlockCallout({
  icon = '💡',
  variant = 'idea',
  children,
}: {
  icon?: string
  variant?: keyof typeof calloutVariants
  children: ReactNode
}) {
  return (
    <div className={cn('my-4 flex gap-3 rounded-r-md px-4 py-3', calloutVariants[variant])}>
      <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden>
        {icon}
      </span>
      <div className="text-[15px] leading-[1.6] text-foreground/90">{children}</div>
    </div>
  )
}

export function BlockBullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="my-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-foreground/90">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function PropertyTable({ children }: { children: ReactNode }) {
  return (
    <section
      className="rounded-lg border border-border/70 bg-muted/25 px-3 py-2"
      aria-label="Page properties"
    >
      <dl className="divide-y divide-border/50">{children}</dl>
    </section>
  )
}

export function PropertyRow({
  icon,
  label,
  children,
}: {
  icon?: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-1 py-2.5 first:pt-2 last:pb-2 sm:grid-cols-[minmax(0,9.5rem)_1fr] sm:items-center sm:gap-4">
      <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon ? (
          <span
            className="flex w-4 shrink-0 items-center justify-center text-[13px] leading-none"
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
        <span>{label}</span>
      </dt>
      <dd className="text-sm font-normal text-foreground sm:min-w-0">{children}</dd>
    </div>
  )
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const color = getNotionTagColor(tag)
        return (
          <li
            key={tag}
            className={cn(
              'rounded-[4px] px-2 py-0.5 text-[13px] font-medium leading-5 transition-transform hover:scale-[1.03]',
              notionTagClass[color],
            )}
          >
            {tag}
          </li>
        )
      })}
    </ul>
  )
}
