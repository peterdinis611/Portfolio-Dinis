import { type Lang, translations } from '../../i18n/translations'
import { getTocEntries, pageIndexToSpread, type BookPageDef } from './pages'

type BookToolbarProps = {
  lang: Lang
  page: number
  total: number
  progress: number
  bookPages: BookPageDef[]
  leftPage?: BookPageDef
  rightPage?: BookPageDef
  isFinaleSpread: boolean
  isTransitioning: boolean
  isClosing: boolean
  onPrev: () => void
  onNext: () => void
  onGoTo: (page: number) => void
  onClose: () => void
}

function chapterMatchesPage(tocId: string, pageId: string): boolean {
  if (tocId === 'about') return pageId === 'about'
  if (tocId === 'projects') return pageId === 'projects'
  if (tocId === 'contact') return pageId === 'contact'
  if (tocId.startsWith('tech')) return pageId.startsWith('tech-')
  if (tocId.startsWith('exp')) return pageId.startsWith('exp-')
  return false
}

function isChapterActive(entryId: string, left?: BookPageDef, right?: BookPageDef): boolean {
  return (
    (left !== undefined && chapterMatchesPage(entryId, left.id)) ||
    (right !== undefined && chapterMatchesPage(entryId, right.id))
  )
}

export function BookToolbar({
  lang,
  page,
  total,
  progress,
  bookPages,
  leftPage,
  rightPage,
  isFinaleSpread,
  isTransitioning,
  isClosing,
  onPrev,
  onNext,
  onGoTo,
  onClose,
}: BookToolbarProps) {
  const ui = translations[lang].ui
  const toc = getTocEntries(lang, bookPages)
  const disabled = isTransitioning || isClosing

  return (
    <footer className="book-toolbar">
      <button
        type="button"
        className="book-nav-btn"
        onClick={onPrev}
        disabled={page <= 0 || disabled}
        aria-label={ui.back}
      >
        <span aria-hidden>‹</span>
      </button>

      <div className="book-toolbar-main">
        <nav className="book-toolbar-chapters" aria-label={ui.pages}>
          {toc.map((entry) => {
            const spread = pageIndexToSpread(entry.pageIndex)
            const active = isChapterActive(entry.id, leftPage, rightPage)

            return (
              <button
                key={entry.id}
                type="button"
                className={`book-chapter-pill${active ? ' active' : ''}`}
                onClick={() => !disabled && onGoTo(spread)}
                disabled={disabled}
                aria-current={active ? 'true' : undefined}
              >
                {entry.label}
              </button>
            )
          })}
        </nav>

        <div className="book-toolbar-meta">
          <div className="book-toolbar-track" aria-hidden>
            <div className="book-toolbar-track-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="book-toolbar-count">
            {page + 1}–{Math.min(page + 2, total)} / {total}
          </span>
        </div>

        <p className="book-toolbar-hint">{ui.navHintOpen}</p>
      </div>

      {isFinaleSpread ? (
        <button
          type="button"
          className="book-nav-btn book-nav-btn--text"
          onClick={() => onGoTo(0)}
          disabled={isClosing}
        >
          {ui.readAgain}
        </button>
      ) : (
        <button
          type="button"
          className="book-nav-btn"
          onClick={onNext}
          disabled={page >= total - 2 || disabled}
          aria-label={ui.next}
        >
          <span aria-hidden>›</span>
        </button>
      )}

      <button
        type="button"
        className="book-nav-btn book-nav-btn--ghost"
        onClick={onClose}
        disabled={isClosing}
      >
        {ui.close}
      </button>
    </footer>
  )
}
