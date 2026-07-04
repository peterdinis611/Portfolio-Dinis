import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { BackLink, BlockHeading } from '../blocks'
import { MOTION_EASE, MotionSection, staggerContainer, staggerItem, staggerItemLeft } from '../motion'
import { BlockDividerDots, BlockPageLink, BlockToggle } from '../notion-blocks'
import type { PortfolioError } from '../portfolio-error'

export const pageLinkStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.12 },
  },
}

const watermarkToneClass = {
  'not-found': 'text-sky-600/10 dark:text-sky-300/8',
  error: 'text-amber-600/10 dark:text-amber-300/8',
} as const

export function StatusPageRoot({
  watermark,
  watermarkVariant = 'not-found',
  children,
}: {
  watermark: string
  watermarkVariant?: keyof typeof watermarkToneClass
  children: ReactNode
}) {
  return (
    <div className="relative">
      <motion.span
        className={cn(
          'pointer-events-none absolute -right-1 top-0 z-0 select-none text-[clamp(4.5rem,20vw,8.5rem)] font-bold leading-none tracking-tighter sm:right-2',
          watermarkToneClass[watermarkVariant],
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: MOTION_EASE }}
        aria-hidden
      >
        {watermark}
      </motion.span>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function StatusPageIcon({ icon }: { icon: string }) {
  return (
    <motion.div
      variants={staggerItem}
      className="mb-4 flex h-[4.875rem] w-[4.875rem] items-center justify-center rounded-xl border border-border/70 bg-muted/25 text-[2.75rem] shadow-sm"
      aria-hidden
    >
      {icon}
    </motion.div>
  )
}

export function StatusPageTitle({ children }: { children: ReactNode }) {
  return (
    <motion.h1
      variants={staggerItem}
      className="mb-2 max-w-[min(100%,32rem)] text-[clamp(1.75rem,4vw,2.125rem)] font-bold leading-[1.2] tracking-[-0.02em] text-foreground"
    >
      {children}
    </motion.h1>
  )
}

export function StatusDetail({ label, value }: { label: string; value: string }) {
  return (
    <motion.p variants={staggerItem} className="mt-4 text-sm text-muted-foreground">
      <span className="font-medium text-foreground/80">{label}:</span>{' '}
      <code className="rounded-md bg-muted/80 px-1.5 py-0.5 font-mono text-[13px] text-foreground">
        {value}
      </code>
    </motion.p>
  )
}

export function StatusRetryButton({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <motion.button
      type="button"
      variants={staggerItem}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/60"
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  )
}

export function createDemoPortfolioError(): PortfolioError {
  const error = new Error('ui is not defined') as PortfolioError
  error.name = 'ReferenceError'
  error.stack = [
    'ReferenceError: ui is not defined',
    '    at getProjectNavGroups (src/components/notion/nav.ts:47:14)',
    '    at NotionSidebar (src/components/notion/NotionSidebar.tsx:31:22)',
    '    at renderWithHooks (node_modules/react-dom/cjs/react-dom-client.development.js:15486:18)',
    '    at updateFunctionComponent (node_modules/react-dom/cjs/react-dom-client.development.js:19612:20)',
    '    at beginWork (node_modules/react-dom/cjs/react-dom-client.development.js:21631:16)',
  ].join('\n')
  error.componentStack = [
    '\n    at NotionSidebar (src/components/notion/NotionSidebar.tsx:18:3)',
    '    at NotionPortfolio (src/components/notion/NotionPortfolio.tsx:91:11)',
    '    at AppRoot (src/AppRoot.tsx:42:7)',
  ].join('\n')
  return error
}

export function formatPortfolioErrorStack(error: PortfolioError): string {
  const lines = [error.stack ?? `${error.name}: ${error.message}`]

  if (error.componentStack?.trim()) {
    lines.push('', '--- React component stack ---', error.componentStack.trim())
  }

  return lines.join('\n')
}

export function StatusStackTrace({ title, error }: { title: string; error: PortfolioError }) {
  const content = formatPortfolioErrorStack(error)
  if (!content.trim()) return null

  return (
    <motion.div variants={staggerItem} className="mt-4">
      <BlockToggle title={title} defaultOpen>
        <pre className="max-h-72 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
          {content}
        </pre>
      </BlockToggle>
    </motion.div>
  )
}

export function AnimatedExploreLinks({
  title,
  pages,
}: {
  title: string
  pages: Array<{ id: string; icon: string; label: string; href?: string }>
}) {
  return (
    <MotionSection delay={0.1} className="mt-10">
      <motion.div
        initial={{ opacity: 0, scaleX: 0.35 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.45, delay: 0.55, ease: MOTION_EASE }}
        style={{ originX: 0 }}
      >
        <BlockDividerDots />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.62, ease: MOTION_EASE }}
      >
        <BlockHeading className="mt-0">{title}</BlockHeading>
      </motion.div>

      <motion.div
        className="flex flex-col gap-0.5"
        variants={pageLinkStagger}
        initial="hidden"
        animate="visible"
      >
        {pages.map((page) => (
          <motion.div
            key={page.id}
            variants={staggerItemLeft}
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
          >
            <BlockPageLink
              href={page.href ?? `#${page.id}`}
              icon={page.icon}
              label={page.label}
            />
          </motion.div>
        ))}
      </motion.div>
    </MotionSection>
  )
}

export function StatusBackLink({ href, children }: { href: string; children: ReactNode }) {
  return <BackLink href={href}>{children}</BackLink>
}

export { staggerContainer, staggerItem }
