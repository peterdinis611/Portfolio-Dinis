'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

/** shadcn Select — Notion-soft trigger + menu. */
export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'notion-select-trigger inline-flex h-8 items-center justify-between gap-1.5 whitespace-nowrap rounded-[6px] border border-[rgba(55,53,47,0.12)] bg-[rgba(55,53,47,0.04)] px-2.5 text-[12px] font-medium text-foreground outline-none transition-colors',
        'hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground',
        'focus-visible:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary)_18%,transparent)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[placeholder]:text-muted-foreground data-[state=open]:bg-[rgba(55,53,47,0.08)]',
        'dark:border-[rgba(255,255,255,0.12)] dark:bg-[rgba(255,255,255,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] dark:data-[state=open]:bg-[rgba(255,255,255,0.1)]',
        '[&>span]:line-clamp-1',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-80" strokeWidth={2} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectScrollUpButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn('flex cursor-default items-center justify-center py-1 text-muted-foreground', className)}
      {...props}
    >
      <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
    </SelectPrimitive.ScrollUpButton>
  )
}

export function SelectScrollDownButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn('flex cursor-default items-center justify-center py-1 text-muted-foreground', className)}
      {...props}
    >
      <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
    </SelectPrimitive.ScrollDownButton>
  )
}

export function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          'notion-select-content relative z-50 max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-[8rem] overflow-hidden rounded-[8px] border border-[rgba(55,53,47,0.12)] bg-popover text-popover-foreground shadow-[0_12px_36px_-14px_rgba(15,15,15,0.35)]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
          'dark:border-[rgba(255,255,255,0.12)] dark:shadow-[0_14px_40px_-16px_rgba(0,0,0,0.65)]',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn('px-2 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground', className)}
      {...props}
    />
  )
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'notion-select-item relative flex w-full cursor-default select-none items-center rounded-[5px] py-1.5 pr-8 pl-2 text-[13px] outline-none',
        'focus:bg-[rgba(55,53,47,0.08)] focus:text-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[state=checked]:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] data-[state=checked]:text-foreground',
        'dark:focus:bg-[rgba(255,255,255,0.08)]',
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-[rgba(55,53,47,0.1)] dark:bg-[rgba(255,255,255,0.1)]', className)}
      {...props}
    />
  )
}
