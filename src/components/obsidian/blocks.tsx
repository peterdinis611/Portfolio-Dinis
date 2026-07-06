import { FileText } from 'lucide-react'
import type { ReactNode } from 'react'
import { getObsidianTagColor, obsidianTagClass } from '@/lib/obsidian-tags'
import { cn } from '@/lib/utils'

export type InfoFactTone = 'rose' | 'yellow' | 'blue' | 'sky'

const infoFactToneClass: Record<InfoFactTone, string> = {
  rose: 'border-l-rose-400/60 bg-card/40',
  yellow: 'border-l-amber-400/60 bg-card/40',
  blue: 'border-l-[color-mix(in_srgb,var(--link)_55%,var(--border))] bg-card/40',
  sky: 'border-l-sky-400/60 bg-card/40',
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
          'obsidian-editor mx-auto w-full px-6 py-7 sm:px-10 sm:py-9 lg:px-12 lg:py-10 xl:px-16',
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
  tagline,
  photo,
  circular = false,
}: {
  name: string
  title: string
  subtitle?: string
  tagline?: string
  photo: ReactNode
  circular?: boolean
}) {
  return (
    <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
      <div
        className={cn(
          'border-2 border-border bg-background',
          circular ? 'rounded-full' : 'rounded-sm',
        )}
      >
        {photo}
      </div>
      <div className="max-w-md text-center sm:pb-1 sm:text-left">
        <p className="text-xl font-bold tracking-tight text-foreground">{name}</p>
        <p className="text-sm font-medium text-foreground/90">{title}</p>
        {tagline ? (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tagline}</p>
        ) : null}
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

export function BioTagPills({ items }: { items: string[] }) {
  return (
    <ul className="mb-6 flex flex-wrap justify-center gap-1.5 sm:justify-start">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-sm border border-border/70 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export function SectionAnchorNav({
  label,
  items,
}: {
  label: string
  items: Array<{ id: string; label: string }>
}) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 rounded-sm border border-border bg-card/60 px-3 py-2"
      aria-label={label}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rounded-sm border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-[var(--link)]"
        >
          {item.label}
        </a>
      ))}
    </nav>
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
          className="border border-border bg-card/30 px-3 py-3"
        >
          <h2 className="mb-2 text-[13px] font-semibold text-foreground">{column.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{column.body}</p>
        </section>
      ))}
    </div>
  )
}

export function InfoFactGrid({
  items,
}: {
  items: Array<{ label: string; value: string; tone: InfoFactTone; icon?: string }>
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'border border-l-2 border-border px-3 py-2.5 text-sm leading-snug',
            infoFactToneClass[item.tone],
          )}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 font-medium leading-snug text-foreground">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkillFeatureGrid({
  items,
}: {
  items: Array<{ id: string; icon?: string; title: string; description: string }>
}) {
  return (
    <ul className="divide-y divide-border border border-border">
      {items.map((item) => (
        <li key={item.title} className="px-3 py-2.5 transition-colors hover:bg-muted/30">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">{item.id}</span>
            <h3 className="text-[13px] font-semibold text-foreground">{item.title}</h3>
          </div>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{item.description}</p>
        </li>
      ))}
    </ul>
  )
}

export function ObsidianDatabase({
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
    <div className="overflow-hidden border border-border">
      <div className="hidden border-b border-border bg-muted/30 px-3 py-1.5 sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.7fr)_minmax(0,1fr)] sm:gap-3">
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
              <span className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                {row.cells[0]}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground sm:text-xs">{row.cells[1]}</span>
              <span className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
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
      className="mb-4 inline-flex items-center gap-1 font-mono text-[13px] text-primary transition-colors hover:underline"
    >
      ← [[{children}]]
    </a>
  )
}

export function StatGrid({ items }: { items: Array<{ value: string; label: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-sm border border-border/80 bg-muted/30 px-3 py-2.5 text-center"
        >
          <p className="text-lg font-semibold tracking-tight text-foreground">{item.value}</p>
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
    <nav className="flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Quick navigation">
      {items.map((item) => (
        <a key={item.href} href={item.href} className="obsidian-wikilink">
          [[{item.label}]]
        </a>
      ))}
    </nav>
  )
}

export function AboutCtaPanel({
  title,
  body,
  tagline,
  action,
  footer,
}: {
  title: string
  body: string
  tagline?: string
  action: ReactNode
  footer?: ReactNode
}) {
  return (
    <section className="border border-border bg-card/20">
      <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-8">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-foreground">{title}</h2>
          <p className="text-[14px] leading-relaxed text-muted-foreground">{body}</p>
          {tagline ? (
            <p className="mt-3 border-l-2 border-[color-mix(in_srgb,var(--link)_30%,var(--border))] pl-3 text-[13px] italic leading-relaxed text-foreground/85">
              {tagline}
            </p>
          ) : null}
        </div>
        <div className="shrink-0 sm:pt-1">{action}</div>
      </div>
      {footer ? (
        <div className="border-t border-border bg-muted/15 px-5 py-4">{footer}</div>
      ) : null}
    </section>
  )
}

export function PageTitle({
  children,
  fileName,
}: {
  children: ReactNode
  fileName?: string
  /** @deprecated Obsidian layout uses fileName instead of emoji icons */
  icon?: string
}) {
  return (
    <header className="obsidian-note-header mb-6">
      {fileName ? (
        <p className="mb-1.5 font-mono text-[11px] text-muted-foreground">{fileName}</p>
      ) : null}
      <h1 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">
        {children}
      </h1>
      <div className="mt-4 h-px bg-border" aria-hidden />
    </header>
  )
}

export function BlockText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-[14px] leading-[1.7] text-foreground/90', className)}>{children}</p>
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
  default: 'border-l-primary/50 bg-muted/40',
  idea: 'border-l-amber-400/70 bg-amber-950/15',
  info: 'border-l-primary/60 bg-accent/30',
} as const

export function BlockCallout({
  variant = 'idea',
  children,
}: {
  icon?: string
  variant?: keyof typeof calloutVariants
  children: ReactNode
}) {
  const label = variant === 'info' ? 'info' : variant === 'idea' ? 'hint' : 'note'
  return (
    <div className={cn('obsidian-callout my-4 border border-l-2 px-3 py-2.5', calloutVariants[variant])}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
        [!{label}]
      </p>
      <div className="mt-1 text-[14px] leading-[1.65] text-foreground/90">{children}</div>
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
    <section className="border border-border bg-card/40 px-3 py-1" aria-label="Page properties">
      <dl className="divide-y divide-border">{children}</dl>
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
        const color = getObsidianTagColor(tag)
        return (
          <li
            key={tag}
            className={cn(
              'rounded-sm border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground',
              obsidianTagClass[color],
            )}
          >
            {tag}
          </li>
        )
      })}
    </ul>
  )
}
