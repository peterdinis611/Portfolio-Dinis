import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Resolves the public site URL for OG generation.
 * Priority: NEXT_PUBLIC_SITE_URL → VITE_SITE_URL → .env → VERCEL_* → fallback.
 */
export function resolveSiteUrl(fallback = 'https://peterdinis.dev') {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/$/, '')
  }
  if (process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL.trim().replace(/\/$/, '')
  }

  try {
    const envPath = resolve(process.cwd(), '.env')
    const env = readFileSync(envPath, 'utf8')
    const match = env.match(/^NEXT_PUBLIC_SITE_URL=(.+)$/m) ?? env.match(/^VITE_SITE_URL=(.+)$/m)
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
