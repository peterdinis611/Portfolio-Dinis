import { ChakraProvider } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { chakraSystem } from '../theme/chakra-system'

export function ChakraAppProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider value={chakraSystem}>{children}</ChakraProvider>
}
