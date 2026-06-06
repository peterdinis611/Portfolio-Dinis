import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

/** Strip Chakra global styles so existing book.css / preload.css stay in control. */
const { globalCss: _globalCss, ...restConfig } = defaultConfig

const portfolioConfig = defineConfig({
  preflight: false,
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'var(--font-display)' },
        body: { value: 'var(--font-ui)' },
      },
      colors: {
        brand: {
          50: { value: '#e8f2f3' },
          500: { value: '#18747a' },
          600: { value: '#1f939b' },
        },
      },
    },
  },
})

export const chakraSystem = createSystem(restConfig, portfolioConfig)
