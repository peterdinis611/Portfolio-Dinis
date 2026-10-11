import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * shadcn Spinner — Notion-styled bouncing dots (instead of Loader2 spin).
 * Drop-in API: `<Spinner />` / size `sm` | `default` | `lg`.
 */
const spinnerVariants = cva('notion-spinner', {
  variants: {
    size: {
      sm: 'notion-spinner--sm',
      default: 'notion-spinner--md',
      lg: 'notion-spinner--lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

type SpinnerProps = ComponentProps<'div'> &
  VariantProps<typeof spinnerVariants> & {
    /** Accessible label; defaults to “Loading”. */
    label?: string
  }

function Spinner({ className, size, label = 'Loading', ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <span className="notion-spinner__dot" aria-hidden />
      <span className="notion-spinner__dot" aria-hidden />
      <span className="notion-spinner__dot" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export { Spinner, spinnerVariants }
