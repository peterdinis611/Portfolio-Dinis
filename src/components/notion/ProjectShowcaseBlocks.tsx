import { ArrowRight, ArrowUpRight, ExternalLink, Play, Shield } from 'lucide-react'
import { useState } from 'react'
import { BrandIcon } from '@/components/icons/BrandIcon'
import type { Lang } from '@/i18n/translations'
import { getProjectShowcase } from '@/data/project-showcase'
import { cn } from '@/lib/utils'
import { StatGrid } from './blocks'
import { ProductPreview } from './ProductPreview'

type ProjectShowcaseBlocksProps = {
  projectId: string
  lang: Lang
  projectName: string
  labels: {
    impactTitle: string
    mediaTitle: string
    mediaTitleAnonymized: string
    anonymizedNote: string
    roleOutcomeTitle: string
    architectureTitle: string
    beforeAfterTitle: string
    beforeLabel: string
    afterLabel: string
    demoTitle: string
    openLiveDemo: string
    viewSource: string
    tryLive: string
    hideLive: string
  }
  compact?: boolean
}

export function ProjectShowcaseBlocks({
  projectId,
  lang,
  projectName,
  labels,
  compact = false,
}: ProjectShowcaseBlocksProps) {
  const showcase = getProjectShowcase(projectId)
  const [liveOpen, setLiveOpen] = useState(false)

  if (!showcase) return null

  const metrics = showcase.metrics.map((metric) => ({
    value: metric.value,
    label: metric.label[lang],
  }))
  const anonymized = Boolean(showcase.anonymized)
  const mediaTitle = anonymized ? labels.mediaTitleAnonymized : labels.mediaTitle

  return (
    <div className={cn('space-y-5', compact && 'space-y-4')}>
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <p className="text-[12px] font-medium text-muted-foreground">{mediaTitle}</p>
          {anonymized ? (
            <span className="inline-flex items-center gap-1 rounded-[4px] bg-[rgba(55,53,47,0.06)] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground dark:bg-[rgba(255,255,255,0.06)]">
              <Shield className="h-3 w-3" strokeWidth={2} />
              NDA
            </span>
          ) : null}
        </div>
        {anonymized ? (
          <p className="mb-2 text-[12px] leading-snug text-muted-foreground">{labels.anonymizedNote}</p>
        ) : null}
        <div className={cn('grid gap-2', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
          <ProductPreview
            variant={showcase.preview}
            tone={showcase.tone}
            title={anonymized ? 'concept.app' : projectName}
          />
          {!compact && showcase.previewSecondary ? (
            <ProductPreview
              variant={showcase.previewSecondary}
              tone={showcase.tone}
              title={anonymized ? 'concept.app · view' : `${projectName} · view`}
            />
          ) : null}
        </div>
      </div>

      {showcase.demo ? (
        <div>
          <p className="mb-2 text-[12px] font-medium text-muted-foreground">{labels.demoTitle}</p>
          <div className="overflow-hidden rounded-[10px] border border-[rgba(55,53,47,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            {showcase.demo.type === 'live' && liveOpen ? (
              <div className="relative">
                <iframe
                  title={`${projectName} live demo`}
                  src={showcase.demo.url}
                  className="h-[280px] w-full bg-background sm:h-[340px]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
                <div className="flex items-center justify-between gap-2 border-t border-[rgba(55,53,47,0.08)] px-3 py-2 dark:border-[rgba(255,255,255,0.08)]">
                  <button
                    type="button"
                    onClick={() => setLiveOpen(false)}
                    className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {labels.hideLive}
                  </button>
                  <a
                    href={showcase.demo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--link)] hover:underline"
                  >
                    {labels.openLiveDemo}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-foreground">{projectName}</p>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                    {showcase.demo.url.replace(/^https?:\/\//, '')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {showcase.demo.type === 'live' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setLiveOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-[6px] bg-foreground px-2.5 py-1.5 text-[12px] font-medium text-background transition-opacity hover:opacity-90"
                      >
                        <Play className="h-3.5 w-3.5" fill="currentColor" />
                        {labels.tryLive}
                      </button>
                      <a
                        href={showcase.demo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-[6px] border border-[rgba(55,53,47,0.12)] px-2.5 py-1.5 text-[12px] font-medium transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.12)] dark:hover:bg-[rgba(255,255,255,0.05)]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {labels.openLiveDemo}
                      </a>
                    </>
                  ) : (
                    <a
                      href={showcase.demo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[6px] bg-foreground px-2.5 py-1.5 text-[12px] font-medium text-background transition-opacity hover:opacity-90"
                    >
                      <BrandIcon slug="github" className="h-3.5 w-3.5" label="GitHub" />
                      {labels.viewSource}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {!compact && metrics.length > 0 ? (
        <div>
          <p className="mb-2 text-[12px] font-medium text-muted-foreground">{labels.impactTitle}</p>
          <StatGrid items={metrics} />
        </div>
      ) : null}

      {showcase.rolesOutcomes && showcase.rolesOutcomes.length > 0 ? (
        <div>
          <p className="mb-2 text-[12px] font-medium text-muted-foreground">
            {labels.roleOutcomeTitle}
          </p>
          <div className={cn('grid gap-2', compact ? 'grid-cols-1' : 'sm:grid-cols-2')}>
            {showcase.rolesOutcomes.map((item) => (
              <div
                key={`${item.role[lang]}-${item.outcome[lang]}`}
                className="rounded-[8px] border border-[rgba(55,53,47,0.09)] bg-[rgba(55,53,47,0.02)] px-3 py-2.5 dark:border-[rgba(255,255,255,0.09)] dark:bg-[rgba(255,255,255,0.03)]"
              >
                <p className="text-[12px] font-medium text-muted-foreground">{item.role[lang]}</p>
                <p className="mt-1 text-[14px] leading-snug text-foreground">{item.outcome[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {showcase.beforeAfter ? (
        <div>
          <p className="mb-2 text-[12px] font-medium text-muted-foreground">
            {labels.beforeAfterTitle}
          </p>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
            <div className="rounded-[8px] border border-[rgba(224,62,62,0.18)] bg-[rgba(224,62,62,0.06)] px-3 py-2.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#c0392b] uppercase dark:text-[#ff7369]">
                {labels.beforeLabel}
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-foreground/90">
                {showcase.beforeAfter.before[lang]}
              </p>
            </div>
            <div className="hidden items-center justify-center sm:flex" aria-hidden>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="rounded-[8px] border border-[rgba(15,123,108,0.2)] bg-[rgba(15,123,108,0.08)] px-3 py-2.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#0f7b6c] uppercase dark:text-[#4dab9a]">
                {labels.afterLabel}
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-foreground/90">
                {showcase.beforeAfter.after[lang]}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {showcase.architecture && showcase.architecture.length > 0 ? (
        <div>
          <p className="mb-2 text-[12px] font-medium text-muted-foreground">
            {labels.architectureTitle}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {showcase.architecture.map((step, index) => (
              <div key={`${step[lang]}-${index}`} className="flex items-center gap-1.5">
                <span className="rounded-[6px] border border-[rgba(55,53,47,0.1)] bg-background px-2.5 py-1.5 text-[12px] font-medium text-foreground dark:border-[rgba(255,255,255,0.1)]">
                  {step[lang]}
                </span>
                {index < showcase.architecture!.length - 1 ? (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
