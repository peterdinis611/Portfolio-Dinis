import { ChakraProvider } from '@chakra-ui/react'
import { createActorContext } from '@xstate/react'
import type { ReactNode } from 'react'
import { bookMachine } from '../machines/bookMachine'
import { settingsMachine } from '../machines/settingsMachine'
import { chakraSystem } from '../theme/chakra-system'

export const BookContext = createActorContext(bookMachine)
export const SettingsContext = createActorContext(settingsMachine)

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={chakraSystem}>
      <SettingsContext.Provider>
        <BookContext.Provider>{children}</BookContext.Provider>
      </SettingsContext.Provider>
    </ChakraProvider>
  )
}
