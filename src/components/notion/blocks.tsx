import type { ReactNode } from 'react'
import { getNotionTagColor, notionTagClass } from '@/lib/notion-tags'
import { cn } from '@/lib/utils'

export type InfoFactTone = 'rose' | 'yellow' | 'blue' | 'sky'

const infoFactToneClass: Record<InfoFactTone, string> = {
  rose: 'bg-rose-50/90 dark:bg-rose-950/30',
  yellow: 'bg-amber-50/90 dark:bg-amber-950/30',
  blue: 'bg-sky-50/90 dark:bg-sky-950/30',
  sky: 'bg-blue-50/80 dark:bg-blue-950/25',
}

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
  circular = false,
}: {
  name: string
  title: string
  subtitle?: string
  photo: ReactNode
  circular?: boolean
}) {
  return (
    <div className="relative z-10 -mt-[4.5rem] mb-8 flex flex-col items-center gap-3 sm:-mt-20 sm:flex-row sm:items-end sm:gap-5">
      <div
        className={cn(
          'border-4 border-background bg-background shadow-md',
          circular ? 'rounded-full' : 'rounded-xl',
        )}
      >
        {photo}
      </div>
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

export function GreetingTitle({ greeting, role }: { greeting: string; role: string }) {
  return (
    <h1 className="mb-6 text-[clamp(1.75rem,4.5vw,2.35rem)] font-bold leading-[1.2] tracking-[-0.03em] text-foreground">
      {greeting} {role}
    </h1>
  )
}

export function TwoColumnCards({
  left,
  right,
}: {
  left: { icon: string; title: string; body: string }
  right: { icon: string; title: string; body: string }
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[left, right].map((column) => (
        <section
          key={column.title}
          className="rounded-lg border border-border/70 bg-card px-4 py-3.5 shadow-sm"
        >
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <span aria-hidden>{column.icon}</span>
            {column.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{column.body}</p>
        </section>
      ))}
    </div>
  )
}

export function InfoFactGrid({
  items,
}: {
  items: Array<{ label: string; value: string; tone: InfoFactTone }>
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'rounded-md border border-border/50 px-3 py-2.5 text-sm leading-snug',
            infoFactToneClass[item.tone],
          )}
        >
          <p className="text-[11px] font-medium text-muted-foreground">{item.label}</p>
          <p className="mt-0.5 font-medium text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export function SkillFeatureGrid({
  items,
}: {
  items: Array<{ icon: string; title: string; description: string }>
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.title}
          className="rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm transition-colors hover:bg-muted/20"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              {item.icon}
            </span>
            <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </li>
      ))}
    </ul>
  )
}

export function NotionDatabase({
  columns,
  rows,
}: {
  columns: string[]
  rows: Array<{
    id: string
    href: string
    icon: string
    cells: [string, string, string]
  }>
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="hidden border-b border-border bg-muted/40 px-3 py-2 sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.7fr)_minmax(0,1fr)] sm:gap-3">
        {columns.map((column) => (
          <span
            key={column}
            className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {column}
          </span>
        ))}
      </div>
      <ul>
        {rows.map((row) => (
          <li key={row.id} className="border-b border-border last:border-b-0">
            <a
              href={row.href}
              className="grid gap-1 px-3 py-3 transition-colors hover:bg-muted/30 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.7fr)_minmax(0,1fr)] sm:items-center sm:gap-3"
            >
              <span className="flex items-center gap-2 font-medium text-foreground">
                <span aria-hidden>{row.icon}</span>
                {row.cells[0]}
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">{row.cells[1]}</span>
              <span className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {row.cells[2]}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CaseStudySection({
  title,
  id,
  children,
}: {
  title: string
  id?: string
  children: ReactNode
}) {
  return (
    <section className="mt-6">
      <h2
        id={id}
        className="mb-2 scroll-mt-20 text-base font-semibold tracking-[-0.01em] text-foreground"
      >
        {title}
      </h2>
      <div className="text-[15px] leading-[1.65] text-foreground/90">{children}</div>
    </section>
  )
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      ← {children}
    </a>
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
