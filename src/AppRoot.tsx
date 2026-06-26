import { lazy, Suspense, useEffect, useState } from 'react'
import { PreloadScreen } from './components/PreloadScreen'
import { preloadApp } from './lib/preload'

const LazyNotionPortfolio = lazy(() =>
  import('./components/notion/NotionPortfolio').then((m) => ({ default: m.NotionPortfolio })),
)

export function AppRoot() {
  const [booted, setBooted] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let active = true
    preloadApp((value) => {
      if (active) setProgress(value)
    })
      .then(() => {
        if (active) setBooted(true)
      })
      .catch(() => {
        if (active) setBooted(true)
      })
    return () => {
      active = false
    }
  }, [])

  if (!booted) {
    return <PreloadScreen progress={progress} />
  }

  return (
    <Suspense fallback={<PreloadScreen progress={0.92} />}>
      <LazyNotionPortfolio />
    </Suspense>
  )
}
