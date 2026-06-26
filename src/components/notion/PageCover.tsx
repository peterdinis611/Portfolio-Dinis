import { type PageCoverVariant, pageCoverImages } from '@/data/page-covers'
import { cn } from '@/lib/utils'

export type { PageCoverVariant }

export function PageCover({
  variant,
  className,
}: {
  variant: PageCoverVariant
  className?: string
}) {
  const cover = pageCoverImages[variant]

  return (
    <div
      className={cn(
        'page-cover pointer-events-none relative h-36 w-full overflow-hidden sm:h-44',
        className,
      )}
    >
      <img
        src={cover.src}
        alt=""
        className="h-full w-full object-cover object-center"
        loading={variant === 'about' ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/[0.12] dark:bg-black/30" aria-hidden />
      <div
        className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent"
        aria-hidden
      />
    </div>
  )
}
