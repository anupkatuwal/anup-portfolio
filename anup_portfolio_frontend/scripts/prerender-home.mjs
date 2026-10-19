// Build-time static render of the homepage.
//
// Why: main.jsx mounts with createRoot().render(), which wipes #root and
// re-renders in the browser. So whatever sits inside #root in the shipped
// index.html is what a crawler sees BEFORE it runs any JavaScript. Googlebot
// does render JS, but on a deferred second pass; Bing, DuckDuckGo and the
// AI answer-engine crawlers are far less reliable at it. Shipping the real
// content as HTML removes that dependency entirely.
//
// This runs after `vite build` and after prerender-projects.mjs, and replaces
// the <!--ssg--> marker in dist/index.html with the full page, using the same
// markup and classes as the React components. Every section is generated from
// src/data/content.js, so the copy cannot drift out of sync. The markup is
// mirrored by hand from the components — keep the two in step.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  SITE, ABOUT, ABOUT_SPEC, STACK, EXPERIENCES, EDUCATION, PROJECTS, PROJECT_NOTES, RESEARCH,
} from "../src/data/content.js";
import { liveLinkLabel, workItems } from "../src/lib/projects.js";
import { shortHash } from "../src/lib/gitHash.js";
import { esc, headerHtml, footerHtml } from "./site-chrome.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const SITE_URL = (process.env.VITE_SITE_URL || "https://anup-katuwal.com.np").replace(/\/+$/, "");

const section = (id, index, label, title, body) => `
        <section id="${id}" class="section" aria-labelledby="${id}-title">
          <div class="container">
            <header class="section-head">
              <p class="label"><span class="idx">${index}</span> / ${esc(label)}</p>
              <h2 id="${id}-title">${esc(title)}</h2>
            </header>
            ${body}
          </div>
        </section>`;

// The SQL console, fully typed — what reduced-motion visitors and crawlers see.
const KW = /\b(SELECT|FROM|WHERE|AND|OR|ORDER|BY|LIMIT)\b/g;
const sql = esc(SITE.console.query).replace(KW, '<span class="sql-kw">$1</span>').replace(/\b(\d+)\b/g, '<span class="sql-num">$1</span>');
const consoleHtml = `<figure class="console">
                <figcaption class="console-head"><span class="console-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${esc(SITE.console.file)}</span></figcaption>
                <div class="console-body">
                  <pre class="console-query">${sql}<span class="cursor" aria-hidden="true"></span></pre>
                  <table class="console-result is-shown">
                    <thead><tr><th scope="col">focus</th><th scope="col">stack</th></tr></thead>
                    <tbody>${SITE.console.rows.map((r) => `<tr><td>${esc(r.focus)}</td><td>${esc(r.stack)}</td></tr>`).join("")}</tbody>
                  </table>
                </div>
                <p class="console-foot">${esc(SITE.console.footer)}</p>
              </figure>`;

const card = (p, featured) => {
  const links = [
    p.code && `<li><a class="link" href="${esc(p.code)}">Code ↗</a></li>`,
    p.live && `<li><a class="link" href="${esc(p.live)}">${liveLinkLabel(p.live)} ↗</a></li>`,
    p.paper && `<li><a class="link" href="${esc(p.paper)}">Paper ↗</a></li>`,
  ].filter(Boolean).join("");
  return `<article class="card project${featured ? " project--featured" : ""}">
                <div class="project-body">
                  <div class="project-top">
                    <h3 class="project-title"><a href="/projects/${esc(p.id)}">${esc(p.title)}</a></h3>
                    ${p.tag ? `<span class="tag-chip">${esc(p.tag)}</span>` : ""}
                  </div>
                  ${p.problem ? `<p class="project-problem">${esc(p.problem)}</p>` : ""}
                  ${p.outcome ? `<p class="project-outcome">${esc(p.outcome)}</p>` : ""}
                  <ul class="chips" aria-label="Stack">${p.stack.map((t) => `<li class="chip">${esc(t)}</li>`).join("")}</ul>
                  ${links ? `<ul class="project-links">${links}</ul>` : ""}
                </div>
                ${featured && p.stats.length ? `<dl class="project-stats">${p.stats.map((s) => `<div class="stat"><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join("")}</dl>` : ""}
              </article>`;
};

const html = `
      <a class="skip-link" href="#main">Skip to content</a>${headerHtml("/")}
      <main id="main">
        <section id="top" class="hero">
          <div class="container hero-grid">
            <div class="hero-main">
              <p class="label">&gt; whoami</p>
              <h1 class="hero-name">${esc(SITE.name)}</h1>
              <p class="hero-lead">${esc(SITE.lead)}</p>
              ${consoleHtml}
              <div class="hero-actions">
                <a href="#work" class="btn btn-primary">View work</a>
                <a href="${esc(SITE.cvUrl)}" class="btn btn-secondary">Download CV</a>
              </div>
            </div>
            <picture class="hero-photo">
              <source srcset="/portrait.webp" type="image/webp" />
              <img src="/profile.jpg" alt="${esc(SITE.name)}, portrait" width="608" height="760" fetchpriority="high" />
            </picture>
          </div>
        </section>
${section("about", "01", "about", "About",
  `<div class="about-grid">
              <div class="about-text">${[ABOUT.lead, ...ABOUT.body].filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
              <dl class="spec-sheet">${ABOUT_SPEC.map((r) => `<div class="spec-row"><dt>${esc(r.key)}</dt><dd>${esc(r.value)}</dd></div>`).join("")}</dl>
            </div>`)}
${section("work", "02", "work", "Selected work",
  `<div class="work-grid">${workItems(PROJECTS, PROJECT_NOTES).map((p, i) => card(p, i === 0)).join("")}</div>`)}
${section("stack", "03", "stack", "Stack",
  `<table class="stack-table">
              <thead><tr><th scope="col">Area</th><th scope="col">Tools</th><th scope="col">Used for</th></tr></thead>
              <tbody>${STACK.map((r) => `<tr><th scope="row">${esc(r.area)}</th><td>${esc(r.tools)}</td><td>${esc(r.use)}</td></tr>`).join("")}</tbody>
            </table>`)}
${section("log", "04", "log", "Experience",
  `<ol class="git-log">${EXPERIENCES.map((e) => {
    const lines = e.bullets?.length ? e.bullets.slice(0, 2) : e.description ? [e.description] : [];
    return `<li class="commit">
                <p class="commit-meta"><span class="commit-hash">${shortHash(`${e.role} ${e.org}`)}</span><span class="commit-date">${esc(e.period)}</span></p>
                <h3 class="commit-title">${esc(e.role)} · ${esc(e.org)}</h3>
                ${lines.map((l) => `<p class="commit-desc">${esc(l)}</p>`).join("")}
              </li>`;
  }).join("")}</ol>`)}
${section("contact", "05", "contact", "Get in touch",
  `<p>Email <a class="link" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a> · <a class="link" href="${esc(SITE.linkedin)}">LinkedIn</a> · <a class="link" href="${esc(SITE.github)}">GitHub</a></p>`)}
      </main>${footerHtml()}
`;

const indexPath = join(dist, "index.html");
const src = readFileSync(indexPath, "utf8");
if (!src.includes("<!--ssg-->")) {
  console.error("prerender-home: <!--ssg--> marker not found in dist/index.html — refusing to write.");
  process.exit(1);
}
writeFileSync(indexPath, src.replace("<!--ssg-->", html));

// llms.txt — a plain-text summary for AI answer engines, which increasingly
// mediate "who is this person" queries. Same facts as the page, no markup.
const llms = `# ${SITE.name}

> ${SITE.role}, based in ${SITE.location}. ${SITE.lead}

Canonical site: ${SITE_URL}/

## Contact
- Email: ${SITE.email}
- GitHub: ${SITE.github}
- LinkedIn: ${SITE.linkedin}

## Education
${EDUCATION.map((d) => `- ${d.degree}, ${d.inst} (${d.period}) — ${d.details.replace(/\s+/g, " ")}`).join("\n")}

## Experience
${EXPERIENCES.map((e) => `- ${e.role}, ${e.org} (${e.period})`).join("\n")}

## Work
${workItems(PROJECTS, PROJECT_NOTES).map((p) => `- ${p.title} (${SITE_URL}/projects/${p.id}) — ${p.problem} ${p.outcome}`.trim()).join("\n")}

## Research
- ${RESEARCH.title} (${SITE_URL}/research) — ${RESEARCH.venue}, ${RESEARCH.period}.
${RESEARCH.results.map((r) => `- ${r}`).join("\n")}

## Stack
${STACK.map((r) => `- ${r.area}: ${r.tools} — ${r.use}`).join("\n")}
`;
writeFileSync(join(dist, "llms.txt"), llms);

const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
console.log(`prerender-home: injected ~${words} words of static content + llms.txt`);
