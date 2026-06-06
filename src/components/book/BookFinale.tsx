import { profile } from '../../data/portfolio'
import { translations } from '../../i18n/translations'
import { BookContext, SettingsContext } from '../../context/AppProviders'

export function BookFinale() {
  const bookActor = BookContext.useActorRef()
  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const ui = translations[lang].ui

  return (
    <div className="book-finale">
      <p className="book-finale-label">{ui.endLabel}</p>
      <h2 className="book-finale-title">{ui.endTitle}</h2>
      <p className="book-finale-quote">{translations[lang].profile.tagline}</p>
      <p className="book-finale-thanks">{ui.thanks}</p>

      <div className="book-finale-actions">
        <button
          type="button"
          className="book-finale-btn book-finale-btn--primary"
          onClick={() => bookActor.send({ type: 'GO_TO', page: 0 })}
        >
          {ui.readAgain}
        </button>
        <button
          type="button"
          className="book-finale-btn"
          onClick={() => bookActor.send({ type: 'REQUEST_CLOSE' })}
        >
          {ui.closeBook}
        </button>
      </div>

      <footer className="book-finale-colophon">
        {profile.name} · 2026 · {ui.madeWith}
      </footer>
    </div>
  )
}
