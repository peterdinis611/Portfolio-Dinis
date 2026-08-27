import type { Theme } from '@/i18n/translations'
import { brandIconColor, getBrandIcon } from '@/lib/brand-icons'
import { cn } from '@/lib/utils'

type BrandIconProps = {
  slug: string
  color?: string
  size?: number
  className?: string
  label?: string
  fallback?: string
  /** Optional override — defaults to document theme (`html.dark` / `data-theme`). */
  theme?: Theme
}

function readDocumentTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  if (document.documentElement.classList.contains('dark')) return 'dark'
  if (document.documentElement.dataset.theme === 'dark') return 'dark'
  return 'light'
}

export function BrandIcon({
  slug,
  color,
  size,
  className,
  label,
  fallback,
  theme: themeProp,
}: BrandIconProps) {
  const theme = themeProp ?? readDocumentTheme()
  const icon = getBrandIcon(slug)

  if (!icon) {
    const fallbackSize = size ?? 20
    const text = fallback ?? slug.slice(0, 2).toUpperCase()
    const style = {
      width: size ?? '100%',
      height: size ?? '100%',
      display: 'grid',
      placeItems: 'center',
      fontSize: Math.max(8, fallbackSize * 0.45),
      fontWeight: 700,
      lineHeight: 1,
    } as const

    if (label) {
      return (
        <span className={className} role="img" aria-label={label} style={style}>
          {text}
        </span>
      )
    }

    return (
      <span className={className} aria-hidden style={style}>
        {text}
      </span>
    )
  }

  const fill = brandIconColor(slug, color, { theme })
  const dimension = size ?? 20

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={dimension}
      height={dimension}
      className={cn('shrink-0', className)}
      aria-label={label ?? icon.title}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
    >
      <path fill={fill} d={icon.path} />
    </svg>
  )
}
