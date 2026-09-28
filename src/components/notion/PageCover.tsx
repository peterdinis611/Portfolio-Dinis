import { motion } from 'framer-motion'
import {
  getProjectCover,
  type PageCoverImage,
  type PageCoverVariant,
  pageCoverImages,
} from '@/data/page-covers'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { cn } from '@/lib/utils'
import { MOTION_EASE } from './motion'

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
  const webp = mode === 'dark' ? (cover.srcDarkWebp ?? cover.srcWebp) : cover.srcWebp
  const objectPosition =
    mode === 'dark' ? (cover.objectPositionDark ?? cover.objectPosition) : cover.objectPosition

  return (
    <picture className={cn('absolute inset-0 block h-full w-full', className)}>
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
        className="page-cover-img absolute inset-0 h-full w-full object-cover"
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
  const reduce = useMotionDisabled()
  const cover = projectId
    ? (getProjectCover(projectId) ?? pageCoverImages.projects)
    : pageCoverImages[variant ?? 'about']
  const eager = Boolean(projectId) || variant === 'about' || variant === 'projects'
  const hasDark = Boolean(cover.srcDark)

  return (
    <motion.div
      className={cn(
        'page-cover pointer-events-none relative h-48 w-full overflow-hidden sm:h-60 md:h-72',
        className,
      )}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: MOTION_EASE }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={reduce ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduce ? 0 : 1.2, ease: MOTION_EASE }}
      >
        {hasDark ? (
          <>
            <CoverPicture cover={cover} mode="light" eager={eager} className="dark:hidden" />
            <CoverPicture cover={cover} mode="dark" eager={eager} className="hidden dark:block" />
          </>
        ) : (
          <CoverPicture cover={cover} mode="single" eager={eager} />
        )}
      </motion.div>

      {/* Minimal scrim — photos stay readable in light + dark */}
      <div className="absolute inset-0 z-[1] bg-transparent dark:bg-black/10" aria-hidden />

      {/* Short fade into page — keep stack below page content */}
      <div
        className="absolute inset-x-0 bottom-0 z-[2] h-10 bg-gradient-to-t from-background via-background/35 to-transparent sm:h-12"
        aria-hidden
      />
      <div className="page-cover-shine z-[3]" aria-hidden />
    </motion.div>
  )
}
