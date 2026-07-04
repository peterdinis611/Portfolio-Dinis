import { motion } from 'framer-motion'
import { type Lang, translations } from '@/i18n/translations'
import { BlockText, PageShell } from '../blocks'
import { BlockCalloutRich, BlockQuote } from '../notion-blocks'
import { getNotionPages } from '../nav'
import {
  AnimatedExploreLinks,
  staggerContainer,
  staggerItem,
  StatusBackLink,
  StatusDetail,
  StatusPageIcon,
  StatusPageRoot,
  StatusPageTitle,
} from './status-page-parts'

export function NotFoundPage({
  lang,
  attemptedPath,
}: {
  lang: Lang
  attemptedPath?: string
}) {
  const ui = translations[lang].ui
  const pages = getNotionPages(lang)

  return (
    <PageShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <StatusPageRoot watermark="404" watermarkVariant="not-found">
          <motion.div variants={staggerItem}>
            <StatusBackLink href="#about">{ui.notionBackHome}</StatusBackLink>
          </motion.div>

          <StatusPageIcon icon="🔍" />
          <StatusPageTitle>{ui.notionNotFoundHeading}</StatusPageTitle>

          <motion.div variants={staggerItem}>
            <BlockText>{ui.notionNotFoundBody}</BlockText>
          </motion.div>

          {attemptedPath ? (
            <StatusDetail
              label={ui.notionNotFoundPathLabel}
              value={`#${attemptedPath}`}
            />
          ) : null}

          <motion.div variants={staggerItem} className="mt-6">
            <BlockQuote>{ui.notionNotFoundQuote}</BlockQuote>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-4">
            <BlockCalloutRich icon="💡" title={ui.notionNotFoundTipTitle} variant="idea">
              {ui.notionNotFoundTipBody}
            </BlockCalloutRich>
          </motion.div>
        </StatusPageRoot>
      </motion.div>

      <AnimatedExploreLinks title={ui.notionNotFoundExplore} pages={pages} />
    </PageShell>
  )
}
