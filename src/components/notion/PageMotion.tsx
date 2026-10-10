'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEnterMotionReady } from '@/hooks/useEnterMotionReady'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { MOTION_EASE } from './motion'

export function PageMotion({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const reduce = useMotionDisabled()
  const enterReady = useEnterMotionReady()
  const skipEnter = reduce || !enterReady

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={skipEnter ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -4 }}
        transition={{ duration: reduce ? 0 : 0.28, ease: MOTION_EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
