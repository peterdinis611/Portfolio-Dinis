'use client'

import Link from 'next/link'
import type { ComponentProps, MouseEvent } from 'react'
import { useRoutePending } from './RoutePending'

type NotionLinkProps = ComponentProps<typeof Link>

function shouldTrackNav(event: MouseEvent<HTMLAnchorElement>): boolean {
  if (event.defaultPrevented) return false
  if (event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  return true
}

/**
 * Next.js Link that registers slow-nav pending with RoutePending.
 * Spinner only appears if the navigation takes longer than the show delay.
 */
export function NotionLink({ onClick, prefetch = true, ...props }: NotionLinkProps) {
  const { begin } = useRoutePending()

  return (
    <Link
      prefetch={prefetch}
      onClick={(event) => {
        if (shouldTrackNav(event)) begin()
        onClick?.(event)
      }}
      {...props}
    />
  )
}
