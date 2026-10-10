'use client'

import { useEffect, useState } from 'react'

/**
 * False during SSR and the first client paint so framer-motion `initial`
 * styles (opacity: 0) are not baked into prerendered HTML / hydration.
 * After mount, enter animations can run on client navigations.
 */
export function useEnterMotionReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(true)
  }, [])
  return ready
}
