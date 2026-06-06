import { profile } from '../../data/portfolio'
import type { BookPageDef } from './pages'

export function BookPageContent({
  page,
  side,
  pageNum,
}: {
  page: BookPageDef
  side: 'left' | 'right'
  pageNum?: number
}) {
  const isFinale = page.id === 'finale'

  return (
    <div className={`book-sheet book-sheet--${side} ${isFinale ? 'book-sheet--finale' : ''}`}>
      {!isFinale && (
        <header className="book-sheet-header">
          <div className="book-sheet-header-top">
            <span className="book-sheet-chapter">{page.chapter}</span>
            {pageNum !== undefined && <span className="book-sheet-num">{pageNum}</span>}
          </div>
          <h2 className="book-sheet-title">{page.title}</h2>
        </header>
      )}
      <div className={`book-sheet-body ${isFinale ? 'book-sheet-body--finale' : ''}`}>{page.render()}</div>
      {!isFinale && (
        <footer className="book-sheet-footer">
          <span>{profile.name}</span>
        </footer>
      )}
    </div>
  )
}
