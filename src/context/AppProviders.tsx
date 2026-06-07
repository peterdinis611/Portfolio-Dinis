import { createActorContext } from '@xstate/react'
import { lazy, type ReactNode, Suspense } from 'react'
import { SeoManager } from '../components/SeoManager'
import { bookMachine } from '../machines/bookMachine'
import { settingsMachine } from '../machines/settingsMachine'

export const BookContext = createActorContext(bookMachine)
export const SettingsContext = createActorContext(settingsMachine)

const LazyChakraAppProvider = lazy(() =>
  import('./ChakraAppProvider').then((m) => ({ default: m.ChakraAppProvider })),
)

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LazyChakraAppProvider>
        <SettingsContext.Provider>
          <SeoManager />
          <BookContext.Provider>{children}</BookContext.Provider>
        </SettingsContext.Provider>
      </LazyChakraAppProvider>
    </Suspense>
  )
}
