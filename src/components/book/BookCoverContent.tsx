import { profile } from '../../data/portfolio'
import { type Lang, translations } from '../../i18n/translations'
import { ProfilePhoto } from '../ui/ProfilePhoto'

type BookCoverContentProps = {
  lang: Lang
  ctaLabel: string
  showHint?: boolean
}

export function BookCoverContent({ lang, ctaLabel, showHint = false }: BookCoverContentProps) {
  const t = translations[lang]
  const ui = t.ui
  const year = new Date().getFullYear()

  return (
    <>
      <div className="book-cover-spine" aria-hidden />

      <div className="book-cover-inner">
        <div className="book-cover-ornament" aria-hidden>
          <span className="book-cover-ornament-line" />
          <span className="book-cover-ornament-mark">✦</span>
          <span className="book-cover-ornament-line" />
        </div>

        <ProfilePhoto className="book-cover-avatar" priority />

        <h1 className="book-cover-name">{profile.name}</h1>
        <p className="book-cover-title">{t.profile.title}</p>

        <div className="book-cover-rule" aria-hidden />

        <span className="book-cover-cta">{ctaLabel}</span>

        {showHint ? <p className="book-cover-hint">{ui.tapToOpen}</p> : null}
      </div>

      <span className="book-cover-year" aria-hidden>
        {year}
      </span>
    </>
  )
}
