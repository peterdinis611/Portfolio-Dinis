'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEnterMotionReady } from '@/hooks/useEnterMotionReady'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { MOTION, MOTION_EASE } from './motion'

/**
 * Soft route transition — slide only, no opacity.
 * Fading the whole page made covers/photos look like they reloaded on every click.
 */
export function PageMotion({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const reduce = useMotionDisabled()
  const enterReady = useEnterMotionReady()
  const skipEnter = reduce || !enterReady

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        initial={skipEnter ? false : { y: 5 }}
        animate={{ y: 0 }}
        exit={reduce ? undefined : { y: -3 }}
        transition={{
          duration: reduce ? 0 : MOTION.page.duration,
          ease: MOTION_EASE,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
