import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const MOTION_EASE = [0.25, 0.1, 0.25, 1] as const

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: MOTION_EASE },
  },
}

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: MOTION_EASE },
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
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: MOTION_EASE }}
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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay, ease: MOTION_EASE }}
    >
      {children}
    </motion.div>
  )
}
