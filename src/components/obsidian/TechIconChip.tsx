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
        'inline-flex items-center gap-2 rounded-sm border border-border bg-card/40 px-2 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/30',
        className,
      )}
    >
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-sm ring-1 ring-border"
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
