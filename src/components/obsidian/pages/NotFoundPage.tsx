import { motion } from 'framer-motion'
import { type Lang, translations } from '@/i18n/translations'
import { BlockText, PageShell, PageTitle } from '../blocks'
import { BlockCalloutRich, BlockQuote } from '../obsidian-blocks'
import { getObsidianPages } from '../nav'
import {
  AnimatedExploreLinks,
  staggerContainer,
  staggerItem,
  StatusBackLink,
  StatusDetail,
} from './status-page-parts'

export function NotFoundPage({
  lang,
  attemptedPath,
}: {
  lang: Lang
  attemptedPath?: string
}) {
  const ui = translations[lang].ui
  const pages = getObsidianPages(lang)

  return (
    <PageShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={staggerItem}>
          <StatusBackLink href="#about">{ui.notionBackHome}</StatusBackLink>
        </motion.div>

        <motion.div variants={staggerItem}>
          <PageTitle fileName="404.md">{ui.notionNotFoundHeading}</PageTitle>
        </motion.div>

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
          <BlockCalloutRich title={ui.notionNotFoundTipTitle} variant="idea">
            {ui.notionNotFoundTipBody}
          </BlockCalloutRich>
        </motion.div>
      </motion.div>

      <AnimatedExploreLinks title={ui.notionNotFoundExplore} pages={pages} />
    </PageShell>
  )
}
