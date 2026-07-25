import { motion } from 'framer-motion'
import { type Lang, translations } from '@/i18n/translations'
import { BlockText, PageShell, PageTitle } from '../blocks'
import { BlockCalloutRich, BlockQuote } from '../notion-blocks'
import type { PortfolioError } from '../portfolio-error'
import { getNotionPages } from '../nav'
import {
  AnimatedExploreLinks,
  createDemoPortfolioError,
  staggerContainer,
  staggerItem,
  StatusBackLink,
  StatusDetail,
  StatusRetryButton,
  StatusStackTrace,
} from './status-page-parts'

type ErrorPageProps = {
  lang: Lang
  error?: PortfolioError
  demo?: boolean
  onRetry?: () => void
}

export function ErrorPage({ lang, error, demo = false, onRetry }: ErrorPageProps) {
  const ui = translations[lang].ui
  const pages = getNotionPages(lang)
  const resolvedError = error ?? (demo ? createDemoPortfolioError() : undefined)
  const detail = resolvedError?.message ?? (demo ? ui.notionErrorDemoDetail : undefined)

  return (
    <PageShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={staggerItem}>
          <StatusBackLink href="#about">{ui.notionBackHome}</StatusBackLink>
        </motion.div>

        <motion.div variants={staggerItem}>
          <PageTitle icon="🧭">{ui.notionErrorHeading}</PageTitle>
        </motion.div>

        <motion.div variants={staggerItem}>
          <BlockText>{ui.notionErrorBody}</BlockText>
        </motion.div>

        {detail ? (
          <StatusDetail label={ui.notionErrorDetailLabel} value={detail} />
        ) : null}

        <motion.div variants={staggerItem} className="mt-6">
          <BlockQuote>{ui.notionErrorQuote}</BlockQuote>
        </motion.div>

        <div className="mt-5">
          <StatusRetryButton label={ui.notionErrorRetry} onClick={onRetry} />
        </div>

        <motion.div variants={staggerItem} className="mt-4">
          <BlockCalloutRich title={ui.notionErrorTipTitle} variant="warning">
            {ui.notionErrorTipBody}
          </BlockCalloutRich>
        </motion.div>

        {resolvedError ? (
          <StatusStackTrace title={ui.notionErrorStackTitle} error={resolvedError} />
        ) : null}
      </motion.div>

      <AnimatedExploreLinks title={ui.notionNotFoundExplore} pages={pages} />
    </PageShell>
  )
}
