import { type ComponentType, useEffect, useState } from 'react'
import { PreloadScreen } from './components/PreloadScreen'
import { preloadApp } from './lib/preload'

export function AppRoot() {
  const [Portfolio, setPortfolio] = useState<ComponentType | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let active = true

    preloadApp((value) => {
      if (active) setProgress(value)
    })
      .then(() => import('./components/notion/NotionPortfolio'))
      .then((mod) => {
        if (!active) return
        setPortfolio(() => mod.NotionPortfolio)
      })
      .catch(async () => {
        try {
          const mod = await import('./components/notion/NotionPortfolio')
          if (active) setPortfolio(() => mod.NotionPortfolio)
        } catch {
          if (active) setProgress(1)
        }
      })

    return () => {
      active = false
    }
  }, [])

  if (!Portfolio) {
    return <PreloadScreen progress={progress} />
  }

  return <Portfolio />
}
