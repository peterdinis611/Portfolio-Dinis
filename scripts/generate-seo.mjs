#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { resolveSiteUrl } from './resolve-site-url.mjs'

const pages = ['', 'about', 'tech', 'experience', 'projects', 'contact']

const projectLists = ['companies-projects', 'my-projects']

const portfolioSource = readFileSync(resolve(process.cwd(), 'src/data/portfolio.ts'), 'utf8')
const projects = [...portfolioSource.matchAll(/^\s*id:\s*'([^']+)'/gm)].map(([, id]) => id)

const siteUrl = resolveSiteUrl()
const lastmod = new Date().toISOString().slice(0, 10)

const pageUrls = pages
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

const projectListUrls = projectLists
  .map((listId) => {
    const loc = `${siteUrl}/#projects/${listId}`
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`
  })
  .join('\n')

const projectUrls = projects
  .map((projectId) => {
    const loc = `${siteUrl}/#projects/${projectId}`
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  })
  .join('\n')

const urls = `${pageUrls}\n${projectListUrls}\n${projectUrls}`

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
