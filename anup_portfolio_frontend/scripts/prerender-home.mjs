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
// markup and classes as the React components. Every section
// is generated from src/data/content.js, so it cannot drift out of sync. The
// one exception is the hero copy below, which lives in Hero.jsx as JSX and is
// mirrored here by hand -- keep the two in step.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  ABOUT, EXPERIENCES, EDUCATION, TRAINING, CERTIFICATIONS,
  FOUNDATIONS, PROJECTS, RESEARCH, SKILL_MATRIX, INTERESTS,
} from "../src/data/content.js";
import { firstSentence, liveLinkLabel } from "../src/lib/projects.js";
import { esc, headerHtml, footerHtml } from "./site-chrome.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const SITE_URL = (process.env.VITE_SITE_URL || "https://anup-katuwal.com.np").replace(/\/+$/, "");

// ── Hero copy — mirrors src/components/Hero.jsx ──────────────────────────────
const HERO = {
  role: "Data analyst · MCIS graduate · Kathmandu, Nepal",
  summary: "Data analyst with a Master's in CIS. I clean, model and query data, " +
           "then report what it shows. Master of Computer Information System " +
           "(CGPA 3.71) with thesis research on fairness in mental-health NLP. " +
           "I'm early in my career, building real skills through hands-on " +
           "projects — ETL pipelines, dashboards and Python automation — and " +
           "working toward data analyst and data engineer roles.",
  links: [
    ["Resume (PDF)", "/resume.pdf", "btn btn-primary"],
    ["GitHub", "https://github.com/anupkatuwal", "btn"],
    ["LinkedIn", "https://www.linkedin.com/in/anupkatuwal1989", "btn"],
    ["Email", "mailto:contact@anup-katuwal.com.np", "btn"],
  ],
};

const li = (items) => items.map((t) => `<li>${esc(t)}</li>`).join("");

const section = (id, title, body) => `
        <section id="${id}" class="section" aria-labelledby="${id}-title">
          <div class="container">
            <h2 class="section-title" id="${id}-title">${esc(title)}</h2>
            ${body}
          </div>
        </section>`;

const entry = (title, date, org, inner) => `<li class="entry">
              <div class="entry-head"><h3 class="entry-title">${esc(title)}</h3><p class="meta">${esc(date)}</p></div>
              <p class="entry-org">${esc(org)}</p>
              ${inner}
            </li>`;

const researchSummary = RESEARCH.abstract.split(". ").slice(0, 2).join(". ") + ".";
const projects = [...PROJECTS].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
const photo = (INTERESTS.photos || []).find((p) => p && p.src);

const html = `
      <a class="skip-link" href="#main">Skip to content</a>${headerHtml("/")}
      <main id="main">
        <section id="top" class="hero">
          <div class="container hero-inner">
            <div class="hero-text">
              <h1 class="hero-name">Anup Katuwal</h1>
              <p class="hero-role">${esc(HERO.role)}</p>
              <p class="hero-summary">${esc(HERO.summary)}</p>
              <ul class="hero-actions">${HERO.links.map(([l, h, c]) => `<li><a href="${h}" class="${c}">${l}</a></li>`).join("")}</ul>
            </div>
            <picture>
              <source srcset="/profile.webp" type="image/webp" />
              <img src="/profile-sm.png" class="hero-photo" alt="Anup Katuwal — Computer Information Systems graduate and data researcher, Kathmandu, Nepal" width="128" height="128" fetchpriority="high" />
            </picture>
          </div>
        </section>
${section("about", "About",
  [ABOUT.lead, ...ABOUT.body].filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("\n            "))}
${section("research", "Research",
  `<article class="research-teaser">
              <h3 class="research-title"><a href="/research">${esc(RESEARCH.title)}</a></h3>
              <p class="meta">${esc(RESEARCH.venue)} · ${esc(RESEARCH.period)}</p>
              <p class="research-summary">${esc(researchSummary)}</p>
              <dl class="metrics">${(RESEARCH.metrics || []).map((m) => `<div class="metric"><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join("")}</dl>
              <p class="text-link-row"><a href="/research">Read the full research →</a></p>
            </article>`)}
${section("projects", "Projects",
  `<ul class="project-list">${projects.map((p) => `
              <li class="project">
                <div class="project-head">
                  <h3 class="project-title"><a href="/projects/${esc(p.id)}">${esc(p.title)}</a></h3>
                  ${p.metric ? `<p class="project-metric">${esc(p.metric)}</p>` : ""}
                </div>
                <p class="project-summary">${esc(firstSentence(p.description))}</p>
                <div class="project-foot">
                  <ul class="tags" aria-label="Technologies">${(p.tech || []).map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>
                  <ul class="project-links">
                    <li><a href="/projects/${esc(p.id)}">Details</a></li>
                    ${p.github ? `<li><a href="${esc(p.github)}">GitHub ↗</a></li>` : ""}
                    ${p.live ? `<li><a href="${esc(p.live)}">${liveLinkLabel(p.live)} ↗</a></li>` : ""}
                  </ul>
                </div>
              </li>`).join("")}
            </ul>`)}
${section("experience", "Experience",
  `<ol class="entries">${EXPERIENCES.map((e) => entry(e.role, e.period,
    [e.org, e.location].filter(Boolean).join(" · "),
    e.bullets?.length ? `<ul class="bullets">${li(e.bullets)}</ul>` : `<p class="entry-text">${esc(e.description || "")}</p>`)).join("\n            ")}</ol>`)}
${section("education", "Education",
  `<ol class="entries">${EDUCATION.map((d) => entry(d.degree, d.period, d.inst,
    `<p class="entry-text">${esc(d.details)}</p>`)).join("\n            ")}</ol>`)}
${section("skills", "Skills",
  `<dl class="skills">
              <dt>Working with</dt><dd><ul class="inline-list">${li(SKILL_MATRIX.using)}</ul></dd>
              <dt>Learning</dt><dd><ul class="inline-list">${li(SKILL_MATRIX.learning)}</ul></dd>
            </dl>`)}
${section("certifications", "Certifications",
  `<ul class="cert-list">${[...TRAINING, ...CERTIFICATIONS].map((c) =>
    `<li><span class="cert-name">${esc(c.name)}</span> · ${esc(c.org)}${c.period ? ` · <span class="mono">${esc(c.period)}</span>` : ""}${c.note ? ` · <span class="cert-status">${esc(c.note)}</span>` : ""}${c.link ? ` · <a href="${esc(c.link)}">Verify ↗</a>` : ""}</li>`).join("")}</ul>
            ${FOUNDATIONS.map((f) => `<p class="cert-foundations"><span class="cert-foundations-label">${esc(f.label)}:</span> ${esc(f.items.join(" · "))}${f.note ? `<span class="meta"> — ${esc(f.note)}</span>` : ""} ${f.link ? `<a href="${esc(f.link)}">${esc(f.linkLabel || "view ↗")}</a>` : ""}</p>`).join("\n            ")}`)}
${section("interests", "Outside work",
  `<div class="outside">
              <div class="outside-text">${INTERESTS.body.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
              ${photo ? `<figure class="outside-photo"><picture><source srcset="${esc(photo.src)}.webp" type="image/webp" /><img src="${esc(photo.src)}.jpg" alt="${esc(photo.alt || "")}" width="120" height="150" loading="lazy" decoding="async" /></picture></figure>` : ""}
            </div>`)}
${section("contact", "Contact",
  `<p class="contact-intro">Available for freelance data engineering projects — ETL pipelines,
            MySQL database design, data warehouses, Python automation, and BI dashboards.
            Reach out and I'll reply within 24 hours.</p>
            <dl class="contact-list">
              <dt>Email</dt><dd><a href="mailto:contact@anup-katuwal.com.np">contact@anup-katuwal.com.np</a><br /><a href="mailto:katuwalanup@gmail.com">katuwalanup@gmail.com</a></dd>
              <dt>LinkedIn</dt><dd><a href="https://www.linkedin.com/in/anupkatuwal1989">linkedin.com/in/anupkatuwal1989</a></dd>
              <dt>GitHub</dt><dd><a href="https://github.com/anupkatuwal">github.com/anupkatuwal</a></dd>
              <dt>Upwork</dt><dd><a href="https://www.upwork.com/freelancers/~01fe60c948627059d5">upwork.com/freelancers/~01fe60c948627059d5</a></dd>
              <dt>Location</dt><dd>Kathmandu, Nepal</dd>
              <dt>Open to</dt><dd>ETL pipelines · Data engineering · Python automation · AI integration</dd>
            </dl>`)}
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
const llms = `# Anup Katuwal

> Computer Information Systems graduate, data engineer and NLP researcher
> based in Kathmandu, Nepal. Master of Computer Information System (NCIT,
> Pokhara University), CGPA 3.71, with thesis research on fairness in
> mental-health NLP. Works with ETL pipelines, star-schema data warehousing,
> Python, SQL (MySQL), and machine learning.

Canonical site: ${SITE_URL}/

## Contact
- Email: contact@anup-katuwal.com.np, katuwalanup@gmail.com
- Location: Kathmandu, Nepal
- GitHub: https://github.com/anupkatuwal
- LinkedIn: https://www.linkedin.com/in/anupkatuwal1989
- Upwork: https://www.upwork.com/freelancers/~01fe60c948627059d5

## Education
${EDUCATION.map((d) => `- ${d.degree}, ${d.inst} (${d.period}) — ${d.details}`).join("\n")}

## Experience
${EXPERIENCES.map((e) => `- ${e.role}, ${e.org} (${e.period})`).join("\n")}

## Projects
${PROJECTS.map((p) => `- ${p.title} (${SITE_URL}/projects/${p.id}) — ${p.description.split(". ")[0]}.`).join("\n")}

## Research
- ${RESEARCH.title} (${SITE_URL}/research) — ${RESEARCH.venue}, ${RESEARCH.period}.
${RESEARCH.results.map((r) => `- ${r}`).join("\n")}

## Skills
- Working with: ${SKILL_MATRIX.using.join(", ")}
- Learning: ${SKILL_MATRIX.learning.join(", ")}
`;
writeFileSync(join(dist, "llms.txt"), llms);

const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
console.log(`prerender-home: injected ~${words} words of static content + llms.txt`);
