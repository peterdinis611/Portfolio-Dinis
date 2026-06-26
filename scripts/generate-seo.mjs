#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { resolveSiteUrl } from './resolve-site-url.mjs'

const pages = ['', 'about', 'tech', 'experience', 'projects', 'contact']

const siteUrl = resolveSiteUrl()
const lastmod = new Date().toISOString().slice(0, 10)

const urls = pages
  .map((page) => {
    const loc = page ? `${siteUrl}/#${page}` : `${siteUrl}/`
    const priority = page === '' ? '1.0' : '0.8'
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

writeFileSync(resolve(process.cwd(), 'public/sitemap.xml'), xml)
writeFileSync(resolve(process.cwd(), 'public/robots.txt'), robots)

console.log(`SEO files updated for ${siteUrl}`)
