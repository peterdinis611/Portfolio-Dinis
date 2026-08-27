import type { ReactNode } from 'react'
import type { ProjectIconTone } from '@/data/portfolio-meta'
import type { ProductPreviewVariant } from '@/data/project-showcase'
import { cn } from '@/lib/utils'

const toneSurface: Record<ProjectIconTone, string> = {
  blue: 'from-[#d6eafb] to-[#eef6ff] dark:from-[#16324a] dark:to-[#101820]',
  green: 'from-[#d8f0eb] to-[#eefaf6] dark:from-[#14352f] dark:to-[#101816]',
  orange: 'from-[#fbe4c9] to-[#fff5ea] dark:from-[#3a2410] dark:to-[#1c1410]',
  purple: 'from-[#e8ddf7] to-[#f5f0fb] dark:from-[#2a1d3d] dark:to-[#16121c]',
  pink: 'from-[#f7d7e8] to-[#fdf0f6] dark:from-[#3a182c] dark:to-[#1c1218]',
  yellow: 'from-[#f7e8b8] to-[#fff8e6] dark:from-[#3a3012] dark:to-[#1c1810]',
  red: 'from-[#f7d4d4] to-[#fff0f0] dark:from-[#3a1a1a] dark:to-[#1c1212]',
  gray: 'from-[#ebe9e6] to-[#f7f6f3] dark:from-[#2a2a2a] dark:to-[#161616]',
}

const toneAccent: Record<ProjectIconTone, string> = {
  blue: 'bg-[#2383e2]',
  green: 'bg-[#0f7b6c]',
  orange: 'bg-[#c77100]',
  purple: 'bg-[#6940a5]',
  pink: 'bg-[#ad1a72]',
  yellow: 'bg-[#9a6700]',
  red: 'bg-[#e03e3e]',
  gray: 'bg-[rgba(55,53,47,0.45)]',
}

function WindowChrome({
  title,
  tone,
  children,
  className,
}: {
  title: string
  tone: ProjectIconTone
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[12px] border border-[rgba(55,53,47,0.12)] bg-background shadow-[0_18px_40px_-24px_rgba(15,15,15,0.55)] dark:border-[rgba(255,255,255,0.1)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-[rgba(55,53,47,0.08)] px-3 py-2.5 dark:border-[rgba(255,255,255,0.08)]">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-[5px] bg-[rgba(55,53,47,0.05)] px-2.5 py-1 text-center text-[11px] text-muted-foreground dark:bg-[rgba(255,255,255,0.05)]">
          {title}
        </span>
        <span className={cn('h-2.5 w-2.5 rounded-full', toneAccent[tone])} aria-hidden />
      </div>
      <div className={cn('relative min-h-[180px] bg-gradient-to-br p-3.5', toneSurface[tone])}>
        {children}
      </div>
    </div>
  )
}

function FakeBars({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {Array.from({ length: count }, (_, i) => `bar-${i}`).map((id, i) => (
        <div
          key={id}
          className="h-2 rounded-full bg-[rgba(55,53,47,0.12)] dark:bg-[rgba(255,255,255,0.12)]"
          style={{ width: `${88 - i * 12}%` }}
        />
      ))}
    </div>
  )
}

function PreviewBody({ variant }: { variant: ProductPreviewVariant }) {
  switch (variant) {
    case 'dashboard':
      return (
        <div className="grid grid-cols-[56px_1fr] gap-2">
          <div className="rounded-[6px] bg-background/80 p-1.5 shadow-sm">
            <div className="mb-2 h-4 w-4 rounded-[4px] bg-[rgba(55,53,47,0.15)] dark:bg-[rgba(255,255,255,0.15)]" />
            <div className="space-y-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full bg-[rgba(55,53,47,0.12)] dark:bg-[rgba(255,255,255,0.12)]"
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-[6px] bg-background/85 p-2 shadow-sm">
                  <div className="mb-1.5 h-2 w-8 rounded-full bg-[rgba(55,53,47,0.15)] dark:bg-[rgba(255,255,255,0.15)]" />
                  <div className="h-4 w-10 rounded-[4px] bg-[rgba(55,53,47,0.2)] dark:bg-[rgba(255,255,255,0.2)]" />
                </div>
              ))}
            </div>
            <div className="rounded-[6px] bg-background/85 p-2 shadow-sm">
              <FakeBars count={3} />
            </div>
          </div>
        </div>
      )
    case 'forms':
      return (
        <div className="rounded-[8px] bg-background/90 p-3 shadow-sm">
          <div className="mb-3 h-2.5 w-24 rounded-full bg-[rgba(55,53,47,0.18)] dark:bg-[rgba(255,255,255,0.18)]" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-[6px] border border-[rgba(55,53,47,0.08)] bg-[rgba(55,53,47,0.03)] px-2 py-2 dark:border-[rgba(255,255,255,0.08)]"
              >
                <div className="mb-1 h-1.5 w-16 rounded-full bg-[rgba(55,53,47,0.14)] dark:bg-[rgba(255,255,255,0.14)]" />
                <div className="h-5 rounded-[4px] bg-[rgba(55,53,47,0.08)] dark:bg-[rgba(255,255,255,0.08)]" />
              </div>
            ))}
          </div>
          <div className="mt-3 h-6 w-20 rounded-[5px] bg-[rgba(55,53,47,0.2)] dark:bg-[rgba(255,255,255,0.2)]" />
        </div>
      )
    case 'healthcare':
      return (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[8px] bg-background/90 p-2.5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[rgba(173,26,114,0.2)]" />
              <FakeBars count={2} className="flex-1" />
            </div>
            <FakeBars count={3} />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-[6px] bg-background/90 px-2 py-2 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-2 w-14 rounded-full bg-[rgba(55,53,47,0.14)] dark:bg-[rgba(255,255,255,0.14)]" />
                  <div className="h-4 w-8 rounded-full bg-[rgba(173,26,114,0.25)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'api':
      return (
        <div className="grid grid-cols-[72px_1fr] gap-2">
          <div className="space-y-1.5 rounded-[6px] bg-background/85 p-2 shadow-sm">
            {['GET', 'POST', 'PUT'].map((method) => (
              <div
                key={method}
                className="rounded-[4px] bg-[rgba(55,53,47,0.06)] px-1.5 py-1 text-[9px] font-semibold tracking-wide text-foreground/70 dark:bg-[rgba(255,255,255,0.06)]"
              >
                {method}
              </div>
            ))}
          </div>
          <div className="rounded-[6px] bg-[#1e1e1e] p-2.5 font-mono text-[9px] leading-relaxed text-[#d4d4d4] shadow-sm">
            <div className="text-[#6a9955]">{'// send request'}</div>
            <div>
              <span className="text-[#569cd6]">await</span> client.send({'{'}
            </div>
            <div className="pl-2">
              method: <span className="text-[#ce9178]">'GET'</span>,
            </div>
            <div className="pl-2">
              path: <span className="text-[#ce9178]">'/users'</span>
            </div>
            <div>{'}'})</div>
          </div>
        </div>
      )
    case 'licenses':
      return (
        <div className="rounded-[8px] bg-background/90 p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="h-2.5 w-24 rounded-full bg-[rgba(55,53,47,0.16)] dark:bg-[rgba(255,255,255,0.16)]" />
            <div className="h-5 w-14 rounded-full bg-[rgba(105,64,165,0.25)]" />
          </div>
          <div className="space-y-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-[5px] bg-[rgba(55,53,47,0.04)] px-2 py-1.5 dark:bg-[rgba(255,255,255,0.04)]"
              >
                <div className="h-3 w-3 rounded-[3px] bg-[rgba(105,64,165,0.35)]" />
                <div className="h-1.5 flex-1 rounded-full bg-[rgba(55,53,47,0.12)] dark:bg-[rgba(255,255,255,0.12)]" />
                <div className="h-1.5 w-8 rounded-full bg-[rgba(55,53,47,0.1)] dark:bg-[rgba(255,255,255,0.1)]" />
              </div>
            ))}
          </div>
        </div>
      )
    case 'design-system':
      return (
        <div className="grid grid-cols-3 gap-2">
          {['A', 'B', 'C', 'D', 'E', 'F'].map((label, i) => (
            <div key={label} className="rounded-[8px] bg-background/90 p-2 shadow-sm">
              <div
                className="mb-2 flex h-8 items-center justify-center rounded-[6px] text-[11px] font-semibold text-white"
                style={{ opacity: 0.75 + i * 0.04, background: `hsl(${210 + i * 28} 55% 45%)` }}
              >
                {label}
              </div>
              <FakeBars count={2} />
            </div>
          ))}
        </div>
      )
    case 'notebooks':
      return (
        <div className="grid grid-cols-[70px_1fr] gap-2">
          <div className="rounded-[6px] bg-background/85 p-2 shadow-sm">
            <FakeBars count={5} />
          </div>
          <div className="rounded-[6px] bg-background/90 p-2.5 shadow-sm">
            <div className="mb-2 h-2.5 w-28 rounded-full bg-[rgba(55,53,47,0.16)] dark:bg-[rgba(255,255,255,0.16)]" />
            <FakeBars count={4} />
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <div className="h-10 rounded-[5px] bg-[rgba(35,131,226,0.15)]" />
              <div className="h-10 rounded-[5px] bg-[rgba(55,53,47,0.08)] dark:bg-[rgba(255,255,255,0.08)]" />
            </div>
          </div>
        </div>
      )
    case 'notes':
      return (
        <div className="rounded-[8px] bg-background/90 p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-5 rounded-[4px] bg-[rgba(55,53,47,0.1)] px-2 text-[9px] leading-5 text-muted-foreground dark:bg-[rgba(255,255,255,0.1)]">
              /
            </div>
            <div className="h-2 w-20 rounded-full bg-[rgba(55,53,47,0.14)] dark:bg-[rgba(255,255,255,0.14)]" />
          </div>
          <div className="mb-2 h-3 w-36 rounded-full bg-[rgba(55,53,47,0.18)] dark:bg-[rgba(255,255,255,0.18)]" />
          <FakeBars count={5} />
        </div>
      )
    case 'canvas':
      return (
        <div className="relative h-[156px] overflow-hidden rounded-[8px] bg-background/85 shadow-sm">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(55,53,47,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(55,53,47,0.12)_1px,transparent_1px)] [background-size:18px_18px] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />
          <div className="absolute top-4 left-4 h-16 w-24 rounded-[10px] border border-[rgba(105,64,165,0.4)] bg-[rgba(105,64,165,0.2)] p-2 shadow-sm">
            <div className="mb-2 h-2 w-10 rounded-full bg-[rgba(105,64,165,0.55)]" />
            <div className="space-y-1">
              <div className="h-1.5 w-14 rounded-full bg-[rgba(105,64,165,0.35)]" />
              <div className="h-1.5 w-10 rounded-full bg-[rgba(105,64,165,0.28)]" />
            </div>
          </div>
          <div className="absolute top-8 right-5 h-20 w-28 rounded-[10px] border border-[rgba(35,131,226,0.4)] bg-[rgba(35,131,226,0.18)] p-2 shadow-sm">
            <div className="mb-2 flex gap-1">
              <div className="h-4 w-4 rounded-[4px] bg-[rgba(35,131,226,0.45)]" />
              <div className="h-4 w-4 rounded-[4px] bg-[rgba(35,131,226,0.3)]" />
            </div>
            <div className="h-8 rounded-[6px] bg-[rgba(35,131,226,0.22)]" />
          </div>
          <div className="absolute bottom-4 left-12 h-12 w-32 rounded-[10px] border border-[rgba(15,123,108,0.4)] bg-[rgba(15,123,108,0.18)] p-2 shadow-sm">
            <div className="h-2 w-16 rounded-full bg-[rgba(15,123,108,0.45)]" />
            <div className="mt-1.5 h-1.5 w-20 rounded-full bg-[rgba(15,123,108,0.3)]" />
          </div>
        </div>
      )
    case 'library':
      return (
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-[6px] bg-background/90 p-1.5 shadow-sm">
              <div className="mb-1.5 aspect-[3/4] rounded-[4px] bg-[rgba(15,123,108,0.18)]" />
              <div className="h-1.5 w-full rounded-full bg-[rgba(55,53,47,0.12)] dark:bg-[rgba(255,255,255,0.12)]" />
            </div>
          ))}
        </div>
      )
  }
}

const previewTitles: Record<ProductPreviewVariant, string> = {
  dashboard: 'app.dashboard',
  forms: 'app.forms',
  healthcare: 'app.healthcare',
  api: 'app.api-client',
  licenses: 'app.licenses',
  'design-system': 'app.design-system',
  notebooks: 'app.notebooks',
  notes: 'app.notes',
  canvas: 'app.canvas',
  library: 'app.library',
}

type ProductPreviewProps = {
  variant: ProductPreviewVariant
  tone: ProjectIconTone
  className?: string
  title?: string
}

export function ProductPreview({ variant, tone, className, title }: ProductPreviewProps) {
  return (
    <WindowChrome title={title ?? previewTitles[variant]} tone={tone} className={className}>
      <PreviewBody variant={variant} />
    </WindowChrome>
  )
}
