import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

function resolveSiteUrlForBuild(): string {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL.trim().replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  }
  return ''
}

// Vercel injects VERCEL_* at build time; bake the URL into the client bundle.
if (!process.env.VITE_SITE_URL) {
  const siteUrl = resolveSiteUrlForBuild()
  if (siteUrl) process.env.VITE_SITE_URL = siteUrl
}

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
