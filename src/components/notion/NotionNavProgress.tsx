'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/** Thin Notion-style topbar progress shown briefly on client navigations. */
export function NotionNavProgress() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const first = useRef(true)
  const hideTimer = useRef<number | null>(null)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }

    setActive(true)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setActive(false), 520)

    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [pathname])

  return (
    <div className="notion-nav-progress" data-active={active ? 'true' : 'false'} aria-hidden>
      <span className="notion-nav-progress__bar" />
    </div>
  )
}
