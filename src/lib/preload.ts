import { profilePhotoSources } from './profile-image'

function loadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

const preloadSteps = [
  () => document.fonts.ready,
  () => Promise.all(profilePhotoSources.map(loadImage)),
  () => import('../components/notion/NotionPortfolio'),
  () => import('../components/notion/pages/AboutPage'),
  () => import('../components/notion/pages/TechPage'),
] as const

let preloadPromise: Promise<void> | null = null

export function preloadApp(onProgress?: (value: number) => void): Promise<void> {
  if (preloadPromise) return preloadPromise

  let completed = 0
  const total = preloadSteps.length

  const report = () => {
    completed += 1
    onProgress?.(completed / total)
  }

  preloadPromise = Promise.all(
    preloadSteps.map(async (step) => {
      await step()
      report()
    }),
  )
    .then(() => undefined)
    .catch((err) => {
      preloadPromise = null
      throw err
    })

  return preloadPromise
}

export function getPreloadPromise(): Promise<void> {
  return preloadApp()
}
