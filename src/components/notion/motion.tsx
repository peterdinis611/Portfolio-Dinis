import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const MOTION_EASE = [0.32, 0.72, 0, 1] as const

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.42, ease: MOTION_EASE },
  },
}

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.36, ease: MOTION_EASE },
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: MOTION_EASE }}
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: MOTION_EASE }}
    >
      {children}
    </motion.div>
  )
}
