import { motion } from 'framer-motion'
import { BookContext, SettingsContext } from '../../context/AppProviders'
import { profile } from '../../data/portfolio'
import { MailtoLink } from '../ui/MailtoLink'
import { translations } from '../../i18n/translations'

const EASE = [0.32, 0.72, 0, 1] as const

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: EASE },
})

export function BookFinale() {
  const bookActor = BookContext.useActorRef()
  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const t = translations[lang]
  const ui = t.ui

  return (
    <div className="book-finale">
      <motion.div className="book-finale-inner" {...fade(0.05)}>
        <p className="book-finale-label">{ui.endLabel}</p>

        <div className="book-finale-ornament" aria-hidden>
          <span className="book-finale-ornament-line" />
          <span className="book-finale-ornament-mark">✦</span>
          <span className="book-finale-ornament-line" />
        </div>

        <h2 className="book-finale-title">{ui.endTitle}</h2>
        <p className="book-finale-lead">{ui.endSubtitle}</p>

        <div className="book-finale-rule" aria-hidden />

        <p className="book-finale-body">{ui.endBody}</p>

        <MailtoLink className="book-finale-btn book-finale-btn--primary">
          {ui.endCta}
        </MailtoLink>

        <div className="book-finale-signoff">
          <span className="book-finale-signoff-line" aria-hidden />
          <p className="book-finale-name">{profile.name}</p>
          <p className="book-finale-role">{t.profile.title}</p>
        </div>
      </motion.div>

      <motion.footer className="book-finale-foot" {...fade(0.25)}>
        <button
          type="button"
          className="book-finale-link"
          onClick={() => bookActor.send({ type: 'GO_TO', page: 0 })}
        >
          {ui.readAgain}
        </button>
        <span className="book-finale-foot-dot" aria-hidden>
          ·
        </span>
        <button
          type="button"
          className="book-finale-link"
          onClick={() => bookActor.send({ type: 'REQUEST_CLOSE' })}
        >
          {ui.closeBook}
        </button>
        <p className="book-finale-colophon">
          {profile.name} · 2026 · {ui.madeWith}
        </p>
      </motion.footer>
    </div>
  )
}
