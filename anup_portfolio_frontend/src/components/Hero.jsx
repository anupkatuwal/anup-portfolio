// src/components/Hero.jsx — name, role line, short summary, primary links.
// NOTE: the copy here is mirrored by hand in scripts/prerender-home.mjs so the
// crawlable HTML matches what React renders. Keep the two in step.
import React from "react";

const HERO_LINKS = [
  { label: "Resume (PDF)", href: "/resume.pdf", primary: true },
  { label: "GitHub", href: "https://github.com/anupkatuwal", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/anupkatuwal1989", external: true },
  { label: "Email", href: "mailto:contact@anup-katuwal.com.np" },
];

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <h1 className="hero-name">Anup Katuwal</h1>
          <p className="hero-role">Data analyst · MCIS graduate · Kathmandu, Nepal</p>

          <p className="hero-summary">
            Data analyst with a Master&apos;s in CIS. I clean, model and query
            data, then report what it shows. Master of
            Computer Information System (CGPA 3.71) with thesis research on
            fairness in mental-health NLP. I&apos;m early in my career, building
            real skills through hands-on projects — ETL pipelines, dashboards and
            Python automation — and working toward data analyst and data
            engineer roles.
          </p>

          <ul className="hero-actions">
            {HERO_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className={`btn${l.primary ? " btn-primary" : ""}`}
                  {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <picture>
          <source srcSet="/profile.webp" type="image/webp" />
          <img
            src="/profile-sm.png"
            alt="Anup Katuwal — Computer Information Systems graduate and data researcher, Kathmandu, Nepal"
            className="hero-photo"
            width="128"
            height="128"
            fetchPriority="high"
          />
        </picture>
      </div>
    </section>
  );
}
