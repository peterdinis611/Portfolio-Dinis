'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEnterMotionReady } from '@/hooks/useEnterMotionReady'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'

/** Notion-soft: quick settle, almost no bounce */
export const MOTION_EASE = [0.25, 0.1, 0.25, 1] as const

/** Slightly springier for micro-hovers only */
export const MOTION_EASE_OUT = [0.16, 1, 0.3, 1] as const

export const MOTION = {
  page: { duration: 0.22 },
  section: { duration: 0.38 },
  item: { duration: 0.32 },
  stagger: 0.045,
  staggerDelay: 0.04,
} as const

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: MOTION.stagger, delayChildren: MOTION.staggerDelay },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.item.duration, ease: MOTION_EASE_OUT },
  },
}

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: MOTION.item.duration, ease: MOTION_EASE_OUT },
  },
}

export function MotionSection({
  children,
  delay = 0,
  className,
  id,
}: {
  children: ReactNode
  delay?: number
  className?: string
  id?: string
}) {
  const disabled = useMotionDisabled()
  const enterReady = useEnterMotionReady()
  const skipEnter = disabled || !enterReady

  if (disabled) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={skipEnter ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.section.duration, delay, ease: MOTION_EASE_OUT }}
    >
      {children}
    </motion.section>
  )
}

export function MotionItem({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const disabled = useMotionDisabled()
  const enterReady = useEnterMotionReady()
  const skipEnter = disabled || !enterReady

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={skipEnter ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.item.duration, delay, ease: MOTION_EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

export function MotionStagger({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const disabled = useMotionDisabled()
  const enterReady = useEnterMotionReady()
  const skipEnter = disabled || !enterReady

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: MOTION.stagger,
            delayChildren: MOTION.staggerDelay + delay,
          },
        },
      }}
      initial={skipEnter ? false : 'hidden'}
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function MotionStaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const disabled = useMotionDisabled()

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  )
}
