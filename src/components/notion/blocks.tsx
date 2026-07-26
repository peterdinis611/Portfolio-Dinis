import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { BrandIcon } from '@/components/icons/BrandIcon'
import { getNotionTagMeta, notionTagClass } from '@/lib/notion-tags'
import { cn } from '@/lib/utils'

export type InfoFactTone = 'rose' | 'yellow' | 'blue' | 'sky'

const infoFactToneClass: Record<InfoFactTone, string> = {
  rose: 'bg-[rgba(226,85,161,0.12)]',
  yellow: 'bg-[rgba(233,168,0,0.12)]',
  blue: 'bg-[rgba(35,131,226,0.12)]',
  sky: 'bg-[rgba(15,123,108,0.12)]',
}

const infoFactIcon: Record<InfoFactTone, string> = {
  rose: '🏠',
  yellow: '🎓',
  blue: '💬',
  sky: '❤️',
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
          'notion-page mx-auto w-full px-6 pb-24 pt-10 sm:px-12 sm:pt-12 md:px-[96px] md:pt-14',
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
    <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div
        className={cn(
          'overflow-hidden bg-muted',
          circular ? 'rounded-full' : 'rounded-[4px]',
        )}
      >
        {photo}
      </div>
      <div className="max-w-md">
        <p className="text-[20px] font-semibold tracking-tight text-foreground">{name}</p>
        <p className="text-[15px] text-foreground/90">{title}</p>
        {tagline ? (
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{tagline}</p>
        ) : null}
        {subtitle ? (
          <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

export function BioTagPills({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item) => {
        const meta = getNotionTagMeta(item)
        return (
          <li
            key={item}
            className={cn(
              'inline-flex items-center gap-1 rounded-[3px] px-1.5 py-0.5 text-[13px] font-medium',
              notionTagClass[meta.color],
            )}
          >
            {meta.icon ? (
              <BrandIcon slug={meta.icon} size={12} className="opacity-95" label={item} />
            ) : null}
            <span>{item}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function SectionAnchorNav({
  label,
  items,
  activeId,
}: {
  label: string
  items: Array<{ id: string; label: string; icon?: string }>
  activeId?: string
}) {
  return (
    <nav className="notion-block my-2 py-0.5" aria-label={label}>
      <p className="mb-1 text-[12px] font-medium text-muted-foreground">{label}</p>
      <ul className="space-y-px border-l border-[rgba(55,53,47,0.12)] pl-3 dark:border-[rgba(255,255,255,0.12)]">
        {items.map((item) => {
          const active = activeId === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  '-ml-px block border-l-2 py-1 pl-3 text-[14px] leading-snug transition-colors',
                  active
                    ? 'border-[var(--link)] font-medium text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function SectionTabs({
  label,
  items,
  value,
  onChange,
}: {
  label?: string
  items: Array<{ id: string; label: string; icon?: string }>
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="my-2">
      {label ? (
        <p className="mb-2 text-[12px] font-medium text-muted-foreground">{label}</p>
      ) : null}
      <div
        role="tablist"
        aria-label={label}
        className="flex flex-wrap gap-1 rounded-[6px] bg-[rgba(55,53,47,0.06)] p-1 dark:bg-[rgba(255,255,255,0.06)]"
      >
        {items.map((item) => {
          const active = value === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={active}
              aria-controls={`panel-${item.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(item.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-[13px] font-medium transition-colors',
                active
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.icon ? (
                <span className="text-[14px] leading-none" aria-hidden>
                  {item.icon}
                </span>
              ) : null}
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function GreetingTitle({ greeting, role }: { greeting: string; role: string }) {
  return (
    <h1 className="mb-4 text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-foreground">
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
    <div className="my-2 grid gap-2 sm:grid-cols-2">
      {[left, right].map((column) => (
        <section
          key={column.title}
          className="rounded-[4px] bg-[rgba(241,241,239,0.9)] px-3.5 py-3 dark:bg-[rgba(255,255,255,0.055)]"
        >
          <h2 className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-foreground">
            <span aria-hidden>{column.icon}</span>
            {column.title}
          </h2>
          <p className="text-[14px] leading-relaxed text-muted-foreground">{column.body}</p>
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
    <div className="my-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'flex gap-2.5 rounded-[4px] px-3 py-2.5 text-[14px] leading-snug',
            infoFactToneClass[item.tone],
          )}
        >
          <span className="mt-0.5 shrink-0 text-[16px] leading-none" aria-hidden>
            {item.icon ?? infoFactIcon[item.tone]}
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-0.5 font-medium text-foreground">{item.value}</p>
          </div>
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
    <nav className="flex flex-wrap gap-1.5" aria-label="Quick navigation">
      {items.map((item) => (
        <a key={item.href} href={item.href} className="notion-page-mention">
          <span aria-hidden>{item.icon}</span>
          <span className="underline decoration-[rgba(55,53,47,0.25)] underline-offset-2 dark:decoration-[rgba(255,255,255,0.25)]">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  )
}

export function SkillFeatureGrid({
  items,
}: {
  items: Array<{ id: string; icon?: string; title: string; description: string }>
}) {
  return (
    <ul className="my-2 grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.title}
          className="rounded-[4px] bg-[rgba(241,241,239,0.9)] px-3.5 py-3 transition-colors hover:bg-[rgba(55,53,47,0.06)] dark:bg-[rgba(255,255,255,0.055)] dark:hover:bg-[rgba(255,255,255,0.08)]"
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[16px] leading-none" aria-hidden>
              {item.icon ?? '•'}
            </span>
            <h3 className="text-[15px] font-semibold text-foreground">{item.title}</h3>
          </div>
          <p className="text-[14px] leading-relaxed text-muted-foreground">{item.description}</p>
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
    <div className="my-2 overflow-hidden rounded-[4px] border border-[rgba(55,53,47,0.09)] dark:border-[rgba(255,255,255,0.09)]">
      <div className="hidden border-b border-[rgba(55,53,47,0.09)] bg-[rgba(247,246,243,0.7)] px-3 py-2 dark:border-[rgba(255,255,255,0.09)] dark:bg-[rgba(255,255,255,0.03)] sm:grid sm:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-3">
        {columns.map((column) => (
          <span
            key={column}
            className="text-[12px] font-medium text-muted-foreground"
          >
            {column}
          </span>
        ))}
      </div>
      <ul>
        {rows.map((row) => (
          <li
            key={row.id}
            className="border-b border-[rgba(55,53,47,0.06)] last:border-b-0 dark:border-[rgba(255,255,255,0.06)]"
          >
            <a
              href={row.href}
              className="grid gap-1 px-3 py-2.5 transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)] sm:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center sm:gap-3"
            >
              <span className="flex min-w-0 items-center gap-2 text-[14px] font-medium text-foreground">
                <span className="shrink-0 text-[16px]" aria-hidden>
                  {row.icon}
                </span>
                <span className="truncate">{row.cells[0]}</span>
              </span>
              <span className="truncate text-[13px] text-muted-foreground">{row.cells[1]}</span>
              <span className="truncate text-[13px] text-muted-foreground">{row.cells[2]}</span>
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
    <section className="mt-8">
      <h2
        id={id}
        className="mb-2 scroll-mt-24 text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-foreground"
      >
        {title}
      </h2>
      <div className="text-[16px] leading-[1.5] text-foreground/90">{children}</div>
    </section>
  )
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group mb-5 inline-flex items-center gap-2 rounded-[10px] py-1 pr-2.5 pl-1 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-[rgba(35,131,226,0.08)] hover:text-[var(--link)] dark:hover:bg-[rgba(82,156,202,0.12)]"
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[rgba(55,53,47,0.08)] bg-[rgba(247,246,243,0.95)] text-foreground/70 shadow-[0_1px_2px_rgba(15,15,15,0.04)] transition-all group-hover:-translate-x-0.5 group-hover:border-[rgba(35,131,226,0.25)] group-hover:bg-background group-hover:text-[var(--link)] dark:border-[rgba(255,255,255,0.1)] dark:bg-[rgba(255,255,255,0.06)]"
        aria-hidden
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <span className="underline decoration-transparent underline-offset-[3px] transition-[text-decoration-color] group-hover:decoration-[rgba(35,131,226,0.45)]">
        {children}
      </span>
    </a>
  )
}

export function PageTitle({
  children,
  icon,
  description,
  meta,
}: {
  children: ReactNode
  fileName?: string
  icon?: string
  description?: ReactNode
  meta?: ReactNode
}) {
  return (
    <header className="mb-5">
      {icon ? (
        <button
          type="button"
          tabIndex={-1}
          className="-ml-1.5 mb-1.5 flex h-[78px] w-[78px] items-center justify-center rounded-[4px] text-[78px] leading-none transition-colors hover:bg-[rgba(55,53,47,0.06)] dark:hover:bg-[rgba(255,255,255,0.055)]"
          aria-hidden
        >
          {icon}
        </button>
      ) : null}
      <h1 className="text-[40px] font-bold leading-[1.2] tracking-[-0.01em] text-foreground">
        {children}
      </h1>
      {meta ? <div className="mt-2 flex flex-wrap items-center gap-1.5">{meta}</div> : null}
      {description ? (
        <div className="mt-1.5 max-w-2xl text-[16px] leading-[1.5] text-muted-foreground">
          {description}
        </div>
      ) : null}
    </header>
  )
}

export function StatGrid({ items }: { items: Array<{ value: string; label: string }> }) {
  const valueColors = [
    'text-[#0b6e99] dark:text-[#6cb5f9]',
    'text-[#0f7b6c] dark:text-[#4dab9a]',
    'text-[#6940a5] dark:text-[#9a6dd7]',
    'text-[#9a6700] dark:text-[#ffdc49]',
  ]
  const surfaces = [
    'bg-[rgba(35,131,226,0.12)]',
    'bg-[rgba(15,123,108,0.12)]',
    'bg-[rgba(105,64,165,0.12)]',
    'bg-[rgba(233,168,0,0.14)]',
  ]

  return (
    <div className="my-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            'rounded-[4px] px-3 py-3 text-center',
            surfaces[index % surfaces.length],
          )}
        >
          <p
            className={cn(
              'text-[24px] font-bold tracking-[-0.02em] leading-none',
              valueColors[index % valueColors.length],
            )}
          >
            {item.value}
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
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
    <section className="my-2">
      <div className="flex gap-2.5 rounded-[4px] bg-[rgba(35,131,226,0.12)] px-3.5 py-3.5">
        <span className="mt-0.5 shrink-0 text-[18px]" aria-hidden>
          ✉️
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="mb-1 text-[16px] font-semibold text-foreground">{title}</h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">{body}</p>
              {tagline ? (
                <p className="mt-2 border-l-[3px] border-[rgba(55,53,47,0.16)] pl-3 text-[14px] italic leading-relaxed text-muted-foreground dark:border-[rgba(255,255,255,0.16)]">
                  {tagline}
                </p>
              ) : null}
            </div>
            <div className="shrink-0">{action}</div>
          </div>
          {footer ? (
            <div className="mt-4 border-t border-[rgba(55,53,47,0.08)] pt-3 dark:border-[rgba(255,255,255,0.08)]">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function BlockText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-[16px] leading-[1.5] text-foreground/90', className)}>{children}</p>
  )
}

export function BlockHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        'mb-1 mt-8 text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-foreground',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function BlockDivider() {
  return (
    <hr className="my-3 border-0 border-t border-[rgba(55,53,47,0.09)] dark:border-[rgba(255,255,255,0.09)]" />
  )
}

export function BlockCallout({
  icon = '💡',
  children,
}: {
  icon?: string
  variant?: 'default' | 'idea' | 'info'
  children: ReactNode
}) {
  return (
    <div className="my-2 flex gap-2.5 rounded-[4px] bg-[rgba(233,168,0,0.12)] px-3.5 py-3">
      <span className="mt-0.5 shrink-0 text-[18px] leading-none" aria-hidden>
        {icon}
      </span>
      <div className="text-[15px] leading-[1.5] text-foreground/90">{children}</div>
    </div>
  )
}

export function BlockBullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="my-1 list-disc space-y-1 pl-7 text-[16px] leading-[1.5] text-foreground marker:text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  )
}

export function PropertyTable({ children }: { children: ReactNode }) {
  return (
    <section className="my-3 max-w-xl" aria-label="Page properties">
      <dl>{children}</dl>
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
    <div className="group grid grid-cols-1 gap-1 rounded-[4px] px-1 py-1.5 transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)] sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-center sm:gap-2">
      <dt className="flex items-center gap-1.5 text-[14px] text-muted-foreground">
        {icon ? (
          <span className="flex w-4 shrink-0 items-center justify-center text-[13px]" aria-hidden>
            {icon}
          </span>
        ) : null}
        <span>{label}</span>
      </dt>
      <dd className="min-w-0 text-[14px] text-foreground">{children}</dd>
    </div>
  )
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const meta = getNotionTagMeta(tag)
        return (
          <li
            key={tag}
            className={cn(
              'inline-flex items-center gap-1 rounded-[3px] px-1.5 py-0.5 text-[13px] font-medium',
              notionTagClass[meta.color],
            )}
          >
            {meta.icon ? (
              <BrandIcon slug={meta.icon} size={12} className="opacity-95" label={tag} />
            ) : null}
            <span>{tag}</span>
          </li>
        )
      })}
    </ul>
  )
}
