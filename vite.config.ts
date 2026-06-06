import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imagetools()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@chakra-ui') || id.includes('node_modules/@emotion')) {
            return 'chakra'
          }
        },
      },
    },
  },
})
