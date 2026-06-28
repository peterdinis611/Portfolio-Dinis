import { type PageCoverVariant, pageCoverImages } from '@/data/page-covers'
import { cn } from '@/lib/utils'

export type { PageCoverVariant }

function CoverImage({
  src,
  objectPosition,
  eager,
  className,
}: {
  src: string
  objectPosition?: string
  eager?: boolean
  className?: string
}) {
  return (
    <img
      src={src}
      alt=""
      className={cn('h-full w-full scale-[1.02] object-cover', className)}
      style={objectPosition ? { objectPosition } : undefined}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
    />
  )
}

export function PageCover({
  variant,
  className,
}: {
  variant: PageCoverVariant
  className?: string
}) {
  const cover = pageCoverImages[variant]
  const eager = variant === 'about' || variant === 'projects'

  return (
    <div
      className={cn(
        'page-cover pointer-events-none relative h-40 w-full overflow-hidden sm:h-48',
        className,
      )}
    >
      {cover.srcDark ? (
        <>
          <CoverImage
            src={cover.src}
            objectPosition={cover.objectPosition}
            eager={eager}
            className="dark:hidden"
          />
          <CoverImage
            src={cover.srcDark}
            objectPosition={cover.objectPositionDark ?? cover.objectPosition}
            eager={eager}
            className="hidden dark:block"
          />
        </>
      ) : (
        <CoverImage src={cover.src} objectPosition={cover.objectPosition} eager={eager} />
      )}
      <div
        className={cn(
          'absolute inset-0',
          cover.srcDark
            ? 'bg-black/[0.08] dark:bg-black/15'
            : variant === 'projects' || variant === 'tech'
              ? 'bg-black/[0.08] dark:bg-black/25'
              : 'bg-black/[0.12] dark:bg-black/40',
        )}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/85 to-transparent"
        aria-hidden
      />
    </div>
  )
}
