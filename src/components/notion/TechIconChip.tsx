import type { CSSProperties } from 'react'
import { BrandIcon } from '@/components/icons/BrandIcon'
import type { TechItem } from '@/data/technologies'
import { getTechIconPresentation } from '@/data/technologies'
import { cn } from '@/lib/utils'

type TechIconChipProps = {
  item: TechItem
  className?: string
}

export function TechIconChip({ item, className }: TechIconChipProps) {
  const icon = getTechIconPresentation(item)

  return (
    <li
      className={cn(
        'inline-flex items-center gap-2.5 rounded-lg border border-border/70 bg-card px-2.5 py-2 text-[13px] font-medium text-foreground shadow-sm transition-colors hover:border-border hover:bg-muted/30',
        className,
      )}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-md shadow-sm ring-1 ring-black/5 dark:ring-white/10"
        style={{ backgroundColor: icon.brand } as CSSProperties}
      >
        <BrandIcon
          slug={item.icon}
          color={icon.iconColor}
          size={18}
          className="block shrink-0"
          label={item.name}
        />
      </span>
      <span className="leading-tight">{item.name}</span>
    </li>
  )
}
