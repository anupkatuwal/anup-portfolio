import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'node:fs'

// Single source of truth for the site's public URL — used by the canonical
// tag, Open Graph tags, JSON-LD (via %SITE_URL% in index.html), and the
// generated sitemap.xml/robots.txt. When the .com.np domain goes live, set
// VITE_SITE_URL in Vercel (or change the fallback here) and rebuild.
const SITE_URL = (
  process.env.VITE_SITE_URL || 'https://anupkat.com.np'
).replace(/\/+$/, '')

function siteUrl() {
  return {
    name: 'site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
    },
    // Regenerate sitemap + robots on every build so lastmod stays current.
    closeBundle() {
      const today = new Date().toISOString().slice(0, 10)
      writeFileSync(
        'dist/sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
      )
      writeFileSync(
        'dist/robots.txt',
        `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteUrl()],
})
