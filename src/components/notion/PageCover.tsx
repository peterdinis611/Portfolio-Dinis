import {
  getProjectCover,
  type PageCoverImage,
  type PageCoverVariant,
  pageCoverImages,
} from '@/data/page-covers'
import { cn } from '@/lib/utils'

export type { PageCoverVariant }

function CoverPicture({
  cover,
  mode,
  eager,
  className,
}: {
  cover: PageCoverImage
  mode: 'light' | 'dark' | 'single'
  eager?: boolean
  className?: string
}) {
  const jpg = mode === 'dark' ? (cover.srcDark ?? cover.src) : cover.src
  const webp =
    mode === 'dark' ? (cover.srcDarkWebp ?? cover.srcWebp) : cover.srcWebp
  const objectPosition =
    mode === 'dark'
      ? (cover.objectPositionDark ?? cover.objectPosition)
      : cover.objectPosition

  return (
    <picture className={cn('absolute inset-0 block', className)}>
      {webp ? (
        <source
          srcSet={webp}
          type="image/webp"
          sizes="(max-width: 768px) 100vw, min(100vw, 1100px)"
        />
      ) : null}
      <img
        src={jpg}
        alt=""
        className="h-full w-full scale-[1.02] object-cover"
        style={objectPosition ? { objectPosition } : undefined}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        width={1280}
        height={854}
        sizes="(max-width: 768px) 100vw, min(100vw, 1100px)"
      />
    </picture>
  )
}

export function PageCover({
  variant,
  projectId,
  className,
}: {
  variant?: PageCoverVariant
  projectId?: string
  className?: string
}) {
  const cover = projectId
    ? (getProjectCover(projectId) ?? pageCoverImages.projects)
    : pageCoverImages[variant ?? 'about']
  const eager = Boolean(projectId) || variant === 'about' || variant === 'projects'
  const hasDark = Boolean(cover.srcDark)

  return (
    <div
      className={cn(
        'page-cover pointer-events-none relative h-40 w-full overflow-hidden sm:h-52',
        className,
      )}
    >
      {hasDark ? (
        <>
          <CoverPicture cover={cover} mode="light" eager={eager} className="dark:hidden" />
          <CoverPicture cover={cover} mode="dark" eager={eager} className="hidden dark:block" />
        </>
      ) : (
        <CoverPicture cover={cover} mode="single" eager={eager} />
      )}
      <div
        className={cn(
          'absolute inset-0',
          hasDark
            ? 'bg-black/[0.08] dark:bg-black/15'
            : projectId || variant === 'projects' || variant === 'tech'
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
