import { createActorContext } from '@xstate/react'
import { lazy, Suspense, type ReactNode } from 'react'
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
          <BookContext.Provider>{children}</BookContext.Provider>
        </SettingsContext.Provider>
      </LazyChakraAppProvider>
    </Suspense>
  )
}
