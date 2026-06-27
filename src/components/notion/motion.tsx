import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export const MOTION_EASE = [0.32, 0.72, 0, 1] as const

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
