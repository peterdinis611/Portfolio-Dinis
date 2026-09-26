import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'

/** Soft expo — editorial, not bouncy */
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: MOTION_EASE },
  },
}

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: MOTION_EASE },
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, delay, ease: MOTION_EASE }}
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

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay, ease: MOTION_EASE }}
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

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06, delayChildren: 0.04 + delay },
        },
      }}
      initial="hidden"
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
