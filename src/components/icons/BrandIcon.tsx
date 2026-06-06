import { brandIconColor, getBrandIcon } from '../../lib/brand-icons'

type BrandIconProps = {
  slug: string
  color?: string
  size?: number
  className?: string
  label?: string
  fallback?: string
}

export function BrandIcon({
  slug,
  color,
  size,
  className,
  label,
  fallback,
}: BrandIconProps) {
  const icon = getBrandIcon(slug)

  if (!icon) {
    const fallbackSize = size ?? 20
    const text = fallback ?? slug.slice(0, 2).toUpperCase()
    return (
      <span
        className={className}
        aria-hidden={!label}
        aria-label={label}
        style={{
          width: size ?? '100%',
          height: size ?? '100%',
          display: 'grid',
          placeItems: 'center',
          fontSize: Math.max(8, fallbackSize * 0.45),
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {text}
      </span>
    )
  }

  const fill = brandIconColor(slug, color)

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size ?? '100%'}
      height={size ?? '100%'}
      className={className}
      aria-label={label ?? icon.title}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
    >
      <path fill={fill} d={icon.path} />
    </svg>
  )
}
