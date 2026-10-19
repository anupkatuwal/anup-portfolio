import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, writeFileSync } from 'node:fs'
import { themeInitTag } from './scripts/theme-init.mjs'

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
      /* Standalone page with no stylesheet: values mirror src/styles/tokens.css */
      :root { color-scheme: dark light; }
      body {
        margin: 0; min-height: 100vh; display: grid; place-items: center;
        background: #0A0C09; color: #ECF0E6; text-align: center;
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      }
      main { padding: 2rem 20px; }
      h1 { font-size: 2.5rem; font-weight: 600; margin: 0 0 .5rem; letter-spacing: -0.03em; }
      p { color: #8C9686; margin: 0 0 1.5rem; font-family: ui-monospace, monospace; }
      a { color: #C6F432; }
      @media (prefers-color-scheme: light) {
        body { background: #F7F8F3; color: #12150F; }
        p { color: #59614F; }
        a { color: #4D7C0F; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>404 · no rows returned</p>
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
      handler: (html) =>
        html.replaceAll('%SITE_URL%', SITE_URL).replace('<!--theme-init-->', themeInitTag()),
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

// The page is prerendered (scripts/prerender-*.mjs), so the app script only
// hydrates markup that is already on screen. Fetching it at low priority
// leaves the bandwidth on slow connections for the CSS and fonts, which the
// first paint actually needs.
function lowPriorityAppScript() {
  return {
    name: 'low-priority-app-script',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => html.replace('<script type="module" crossorigin', '<script type="module" fetchpriority="low" crossorigin'),
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteUrl(), lowPriorityAppScript()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
