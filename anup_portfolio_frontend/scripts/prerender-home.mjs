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
// the <!--ssg--> marker in dist/index.html with the full page. Every section
// is generated from src/data/content.js, so it cannot drift out of sync. The
// one exception is the hero copy below, which lives in Hero.jsx as JSX and is
// mirrored here by hand -- keep the two in step.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  ABOUT, SKILLS, EXPERIENCES, EDUCATION, TRAINING, CERTIFICATIONS,
  FOUNDATIONS, RESUME_HIGHLIGHTS, PROJECTS, RESEARCH, SKILL_MATRIX,
} from "../src/data/content.js";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const SITE_URL = (process.env.VITE_SITE_URL || "https://anup-katuwal.com.np").replace(/\/+$/, "");

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
           .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ── Hero copy — mirrors src/components/Hero.jsx ──────────────────────────────
const HERO = {
  eyebrow: "Kathmandu, Nepal · Open to research & data roles",
  headline: "Anup Katuwal — CIS Graduate & Data Enthusiast",
  tagline: "Bridging academic research with real-world data solutions.",
  bio: "M.Sc. in Computer Information Systems (CGPA 3.71) with thesis research " +
       "on fairness in mental-health NLP. I'm early in my career, building real " +
       "skills through hands-on projects — ETL pipelines, dashboards and Python " +
       "automation — and working toward data analyst and data engineer roles.",
  status: "Python · SQL · ETL · BERT · FastAPI",
};

// Mirrors src/lib/nav.js
const NAV = [
  ["/#top", "Home"], ["/research", "Research"], ["/#projects", "Projects"],
  ["/#experience", "Experience"], ["/#contact", "Contact"],
];

const li = (items) => items.map((t) => `<li>${esc(t)}</li>`).join("");

const section = (id, eyebrow, title, body) => `
      <section id="${id}" class="section">
        <div class="container">
          <p class="section-eyebrow">${esc(eyebrow)}</p>
          <h2 class="section-title">${esc(title)}</h2>
          ${body}
        </div>
      </section>`;

const html = `
      <header class="navbar">
        <div class="navbar-inner">
          <a href="#top" class="navbar-brand"><span class="brand-mark"><span>AK</span></span><span class="brand-text">Anup Katuwal</span></a>
          <nav class="navbar-nav" aria-label="Main navigation">
            ${NAV.map(([h, l]) => `<a href="${h}" class="navbar-link">${l}</a>`).join("\n            ")}
          </nav>
        </div>
      </header>
      <main>
        <section id="top" class="hero">
          <div class="container">
            <p class="hero-eyebrow">${esc(HERO.eyebrow)}</p>
            <h1 class="hero-name">${esc(HERO.headline)}</h1>
            <p class="hero-tagline">${esc(HERO.tagline)}</p>
            <p class="hero-bio">${esc(HERO.bio)}</p>
            <p class="hero-actions"><a href="/resume.pdf">View Resume</a> · <a href="#projects">Explore Projects</a></p>
            <p class="hero-status">${esc(HERO.status)}</p>
            <p>
              <a href="https://github.com/anupkatuwal">GitHub</a> ·
              <a href="https://www.linkedin.com/in/anupkatuwal1989">LinkedIn</a> ·
              <a href="https://www.upwork.com/freelancers/~01fe60c948627059d5">Upwork</a> ·
              <a href="mailto:contact@anup-katuwal.com.np">contact@anup-katuwal.com.np</a>
            </p>
            <picture>
              <source srcset="/profile.webp" type="image/webp" />
              <img src="/profile-sm.png" class="hero-photo" alt="Anup Katuwal — Computer Information Systems graduate and data researcher, Kathmandu, Nepal" width="190" height="190" />
            </picture>
          </div>
        </section>
${section("about", "Academic & professional", "About",
  `<p>${esc(ABOUT.lead)}</p>
          ${ABOUT.body.map((t) => `<p>${esc(t)}</p>`).join("\n          ")}
          <ol>${ABOUT.milestones.map((m) => `<li><strong>${esc(m.year)}</strong> — ${esc(m.title)}: ${esc(m.detail)}</li>`).join("")}</ol>
          <p><a href="/resume.pdf">Download CV</a> · <a href="/resume.pdf">Download Resume</a></p>`)}
${section("research", "Thesis", "Research",
  `<h3>${esc(RESEARCH.title)}</h3>
          <p class="card-subtitle">${esc(RESEARCH.venue)} · ${esc(RESEARCH.period)}</p>
          <p>${esc(RESEARCH.abstract)}</p>
          <ul>${li(RESEARCH.results)}</ul>
          <p><a href="/research">Read the research</a></p>`)}
${section("skills", "What I work with", "Skills",
  SKILLS.map((s) => `<div class="skill-row"><h3>${esc(s.domain)}</h3><ul>${li(s.items)}</ul></div>`).join("\n          ")
  + `\n          <h3>Skills matrix</h3>
          <h4>Technical</h4><ul>${li(SKILL_MATRIX.technical.map((k) => `${k.name} (${k.level}/5)`))}</ul>
          <h4>Professional</h4><ul>${li(SKILL_MATRIX.professional.map((k) => `${k.name} (${k.level}/5)`))}</ul>`)}
${section("experience", "Where I've worked", "Experience",
  EXPERIENCES.map((e) => `<article class="card">
            <h3 class="card-title">${esc(e.role)}</h3>
            <p class="card-subtitle">${esc(e.org)} · ${esc(e.period)}${e.location ? ` · ${esc(e.location)}` : ""}</p>
            ${e.bullets ? `<ul>${li(e.bullets)}</ul>` : `<p>${esc(e.description || "")}</p>`}
          </article>`).join("\n          ")
  + `\n          <h3>Education</h3>\n          `
  + EDUCATION.map((d) => `<article class="card">
            <h4 class="card-title">${esc(d.degree)}</h4>
            <p class="card-subtitle">${esc(d.inst)} · ${esc(d.period)}</p>
            <p>${esc(d.details)}</p>
          </article>`).join("\n          "))}
${section("certifications", "Credentials", "Certifications",
  [...CERTIFICATIONS, ...TRAINING].map((c) => `<article class="card">
            <h3 class="card-title">${esc(c.name)}</h3>
            <p class="card-subtitle">${esc(c.org)} · ${esc(c.period)}${c.note ? ` · ${esc(c.note)}` : ""}</p>
            ${c.link ? `<a href="${esc(c.link)}">View credential</a>` : ""}
          </article>`).join("\n          ")
  + "\n          "
  + FOUNDATIONS.map((f) => `<article class="card">
            <h3 class="card-title">${esc(f.label)}</h3>
            <ul>${li(f.items)}</ul>
            ${f.note ? `<p class="card-subtitle">${esc(f.note)}</p>` : ""}
            ${f.link ? `<a href="${esc(f.link)}">${esc(f.linkLabel || "View")}</a>` : ""}
          </article>`).join("\n          "))}
${section("projects", "Selected work", "Projects",
  PROJECTS.map((p) => `<article class="card">
            <h3 class="card-title"><a href="/projects/${esc(p.id)}">${esc(p.title)}</a></h3>
            ${p.metric ? `<p class="card-metric">${esc(p.metric)}</p>` : ""}
            <p>${esc(p.description)}</p>
            <ul class="tech">${li(p.tech || [])}</ul>
            <p>
              <a href="/projects/${esc(p.id)}">Project details</a>
              ${p.github ? ` · <a href="${esc(p.github)}">Source on GitHub</a>` : ""}
              ${p.live ? ` · <a href="${esc(p.live)}">Live</a>` : ""}
            </p>
          </article>`).join("\n          "))}
${section("resume", "Background", "Resume",
  `<ul>${li(RESUME_HIGHLIGHTS)}</ul>
          <p><a href="/resume.pdf">Download resume (PDF)</a></p>`)}
${section("contact", "Let's collaborate", "Contact",
  `<p>Available for freelance data engineering projects — ETL pipelines, MySQL
          database design, data warehouses, Python automation, and BI dashboards.</p>
          <ul>
            <li>Email: <a href="mailto:contact@anup-katuwal.com.np">contact@anup-katuwal.com.np</a></li>
            <li>Email: <a href="mailto:katuwalanup@gmail.com">katuwalanup@gmail.com</a></li>
            <li>Location: Kathmandu, Nepal</li>
            <li>Upwork: <a href="https://www.upwork.com/freelancers/~01fe60c948627059d5">upwork.com/freelancers/~01fe60c948627059d5</a></li>
            <li>GitHub: <a href="https://github.com/anupkatuwal">github.com/anupkatuwal</a></li>
            <li>LinkedIn: <a href="https://www.linkedin.com/in/anupkatuwal1989">linkedin.com/in/anupkatuwal1989</a></li>
          </ul>`)}
      </main>
      <footer><p>© ${new Date().getFullYear()} Anup Katuwal · <a href="mailto:contact@anup-katuwal.com.np">Contact</a> · <a href="https://www.linkedin.com/in/anupkatuwal1989">LinkedIn</a> · <a href="https://github.com/anupkatuwal">GitHub</a></p><p>“Knowledge applied through technology.”</p></footer>
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
> based in Kathmandu, Nepal. Master's in Computer Information Systems (NCIT,
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
${SKILLS.map((s) => `- ${s.domain}: ${s.items.join(", ")}`).join("\n")}
`;
writeFileSync(join(dist, "llms.txt"), llms);

const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
console.log(`prerender-home: injected ~${words} words of static content + llms.txt`);
