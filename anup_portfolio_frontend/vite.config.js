import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, writeFileSync } from 'node:fs'

// Single source of truth for the site's public URL — used by the canonical
// tag, Open Graph tags, JSON-LD (via %SITE_URL% in index.html), and the
// generated sitemap.xml/robots.txt. Live domain is anup-katuwal.com.np; the
// VITE_SITE_URL env var in Vercel (if set) overrides this fallback.
const SITE_URL = (
  process.env.VITE_SITE_URL || 'https://anup-katuwal.com.np'
).replace(/\/+$/, '')

// Where to report a security issue. Override with VITE_SECURITY_CONTACT.
const SECURITY_CONTACT =
  process.env.VITE_SECURITY_CONTACT || 'contact@anup-katuwal.com.np'

const NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>404 — Page not found</title>
    <style>
      :root { color-scheme: dark light; }
      body {
        margin: 0; min-height: 100vh; display: grid; place-items: center;
        background: #0b0d12; color: #e6e8ee; text-align: center;
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      }
      main { padding: 2rem; }
      h1 { font-size: clamp(2.5rem, 10vw, 4rem); margin: 0 0 .5rem; }
      p { color: #98a0b3; margin: 0 0 1.5rem; }
      a { color: #7aa2ff; }
      @media (prefers-color-scheme: light) {
        body { background: #f7f8fb; color: #171a21; }
        p { color: #5b6478; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <a href="/">Back to the homepage</a>
    </main>
  </body>
</html>
`

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
      // Note: /admin is deliberately NOT listed here. A Disallow line is a
      // public announcement that the path exists, and it doesn't stop anyone
      // from visiting it. The panel is kept out of search results by the
      // `X-Robots-Tag: noindex` header on /admin (see vercel.json) plus the
      // meta tag the page sets itself — both of which crawlers obey without
      // advertising the URL to everyone who reads robots.txt.
      writeFileSync(
        'dist/robots.txt',
        `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
      )

      // RFC 9116 disclosure contact. Expires is required and must be in the
      // future, so it's regenerated a year out on every build.
      const expires = new Date(Date.now() + 365 * 864e5).toISOString().replace(/\.\d+Z$/, 'Z')
      mkdirSync('dist/.well-known', { recursive: true })
      writeFileSync(
        'dist/.well-known/security.txt',
        `Contact: mailto:${SECURITY_CONTACT}
Expires: ${expires}
Preferred-Languages: en, ne
Canonical: ${SITE_URL}/.well-known/security.txt
`
      )

      // Served by Vercel for any path that doesn't match a file or the SPA
      // rewrite — so a missing asset 404s instead of silently returning the
      // app shell with a 200.
      writeFileSync('dist/404.html', NOT_FOUND_HTML)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteUrl()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
