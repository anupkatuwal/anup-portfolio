// Build-time prerender: emit a real, crawlable static HTML page per project at
// dist/projects/<id>/index.html, each with its own <title>, meta description,
// canonical, Open Graph, and JSON-LD (SoftwareSourceCode + BreadcrumbList).
// Runs after `vite build` (see package.json "build"), so it works on Vercel
// and in CI. Also rewrites dist/sitemap.xml to include the project URLs.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PROJECTS } from "../src/data/content.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

const SITE_URL = (process.env.VITE_SITE_URL || "https://anup-katuwal.com.np").replace(/\/+$/, "");
const AUTHOR = "Anup Katuwal";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const clamp = (s, n = 155) => {
  s = String(s).replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  return s.slice(0, s.lastIndexOf(" ", n - 1)).trim() + "…";
};

// Reuse the hashed CSS bundle Vite just produced, so pages match the site.
const builtIndex = readFileSync(join(dist, "index.html"), "utf8");
const cssHref = (builtIndex.match(/href="(\/assets\/index-[^"]+\.css)"/) || [])[1] || "";

function pageHtml(p) {
  const url = `${SITE_URL}/projects/${p.id}`;
  const title = `${p.title} — ${AUTHOR}`;
  const desc = clamp(p.description);
  const stack = (p.tech || []).join(", ");

  const software = {
    "@type": "SoftwareSourceCode",
    name: p.title,
    description: p.description,
    url,
    ...(p.github ? { codeRepository: p.github } : {}),
    ...(stack ? { programmingLanguage: stack } : {}),
    author: { "@type": "Person", name: AUTHOR, url: `${SITE_URL}/` },
  };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/#projects` },
      { "@type": "ListItem", position: 3, name: p.title, item: url },
    ],
  };
  const jsonld = JSON.stringify({ "@context": "https://schema.org", "@graph": [software, breadcrumb] });

  const pills = (p.tech || []).map((t) => `<li class="pill">${esc(t)}</li>`).join("");
  const links = [
    p.github && `<a class="btn btn-primary" href="${esc(p.github)}" target="_blank" rel="noreferrer">View on GitHub ↗</a>`,
    p.live && `<a class="btn btn-ghost" href="${esc(p.live)}" target="_blank" rel="noreferrer">Live site ↗</a>`,
  ].filter(Boolean).join(" ");

  return `<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#0e0d0b" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <meta name="author" content="${AUTHOR}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${AUTHOR}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE_URL}/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${SITE_URL}/og.png" />
    <script type="application/ld+json">${jsonld}</script>
    ${cssHref ? `<link rel="stylesheet" href="${cssHref}" />` : ""}
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1a1a1a; background: #faf8f5; line-height: 1.6; margin: 0; }
      .pp-wrap { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
      .pp-crumb { font-size: 13px; color: #777; margin-bottom: 24px; }
      .pp-crumb a { color: #777; text-decoration: none; }
      .pp-crumb a:hover { text-decoration: underline; }
      .pp-title { font-size: 30px; line-height: 1.2; margin: 0 0 6px; }
      .pp-metric { font-weight: 600; color: #b4541a; margin: 0 0 18px; }
      .pp-desc { font-size: 17px; margin: 0 0 22px; }
      .pp-stack { font-size: 13px; color: #555; margin: 0 0 26px; }
      .pp-links a { display: inline-block; padding: 9px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 10px; }
      .pp-links a.btn-primary { background: #1a1a2e; color: #fff; }
      .pp-links a.btn-ghost { border: 1px solid #ccc; color: #1a1a1a; }
      .pp-back { display: inline-block; margin-top: 36px; color: #1a1a2e; font-weight: 600; text-decoration: none; }
    </style>
  </head>
  <body>
    <main class="pp-wrap">
      <nav class="pp-crumb" aria-label="Breadcrumb">
        <a href="/">Anup Katuwal</a> / <a href="/#projects">Projects</a> / <span>${esc(p.title)}</span>
      </nav>
      <article>
        <h1 class="pp-title">${esc(p.title)}</h1>
        ${p.metric ? `<p class="pp-metric">${esc(p.metric)}</p>` : ""}
        <p class="pp-desc">${esc(p.description)}</p>
        ${stack ? `<p class="pp-stack"><strong>Built with:</strong> ${esc(stack)}</p>` : ""}
        <div class="pp-links">${links}</div>
      </article>
      <a class="pp-back" href="/#projects">← Back to all projects</a>
    </main>
  </body>
</html>
`;
}

let count = 0;
for (const p of PROJECTS) {
  const outDir = join(dist, "projects", p.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), pageHtml(p));
  count++;
}

// Rewrite the sitemap to include the homepage + every project page.
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "weekly" },
  ...PROJECTS.map((p) => ({ loc: `${SITE_URL}/projects/${p.id}`, priority: "0.7", changefreq: "monthly" })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  )
  .join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

console.log(`prerender: wrote ${count} project page(s) + sitemap with ${urls.length} URLs`);
