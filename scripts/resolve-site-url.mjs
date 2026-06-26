import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Resolves the public site URL for sitemap/OG/canonical.
 * Priority: VITE_SITE_URL → .env → VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → fallback.
 */
export function resolveSiteUrl(fallback = 'https://peterdinis.dev') {
  if (process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL.trim().replace(/\/$/, '')
  }

  try {
    const envPath = resolve(process.cwd(), '.env')
    const env = readFileSync(envPath, 'utf8')
    const match = env.match(/^VITE_SITE_URL=(.+)$/m)
    if (match?.[1]) return match[1].trim().replace(/\/$/, '')
  } catch {
    /* no .env */
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, '')
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  }

  return fallback
}
