import { cn } from '@/lib/utils'

type NotionBounceSpinnerProps = {
  className?: string
  /** sm = 3×6px, md = 3×8px, lg = 3×10px */
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeClass = {
  sm: 'notion-bounce-spinner--sm',
  md: 'notion-bounce-spinner--md',
  lg: 'notion-bounce-spinner--lg',
} as const

/** Notion-style staggered bouncing dots. CSS-only; respects reduced-motion. */
export function NotionBounceSpinner({
  className,
  size = 'md',
  label = 'Loading',
}: NotionBounceSpinnerProps) {
  return (
    <div
      className={cn('notion-bounce-spinner', sizeClass[size], className)}
      role="status"
      aria-label={label}
    >
      <span className="notion-bounce-spinner__dot" aria-hidden />
      <span className="notion-bounce-spinner__dot" aria-hidden />
      <span className="notion-bounce-spinner__dot" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  )
}
