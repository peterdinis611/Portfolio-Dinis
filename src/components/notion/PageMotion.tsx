'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEnterMotionReady } from '@/hooks/useEnterMotionReady'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { MOTION, MOTION_EASE } from './motion'

/** Soft crossfade between routes — Notion-like, never theatrical. */
export function PageMotion({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const reduce = useMotionDisabled()
  const enterReady = useEnterMotionReady()
  const skipEnter = reduce || !enterReady

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        initial={skipEnter ? false : { opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -3 }}
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
