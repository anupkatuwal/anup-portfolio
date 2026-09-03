// src/components/Hero.jsx — vertically centred academic hero.
// NOTE: the copy here is mirrored by hand in scripts/prerender-home.mjs so the
// crawlable HTML matches what React renders. Keep the two in step.
import React from "react";

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container">
        <div className="hero-layout">

          {/* ── LEFT ── */}
          <div className="hero-left">
            <p className="hero-eyebrow">
              <span className="eyebrow-line" aria-hidden="true" />
              Kathmandu, Nepal · Open to research &amp; data roles
            </p>

            <h1 className="hero-name">
              Anup Katuwal
              <span className="hero-name-role">CIS Graduate &amp; Data Enthusiast</span>
            </h1>

            <p className="hero-tagline">
              Bridging academic research with real-world data solutions.
            </p>

            <p className="hero-bio">
              M.Sc. in Computer Information Systems (CGPA 3.71) with thesis
              research on fairness in mental-health NLP. I&apos;m early in my
              career, building real skills through hands-on projects —{" "}
              <strong>ETL pipelines, dashboards and Python automation</strong> —
              and working toward data analyst and data engineer roles.
            </p>

            <div className="hero-status">
              <span className="status-dot" aria-hidden="true" />
              Python · Microsoft SQL Server · data analysis · learning Power BI &amp; Tableau
            </div>

            <div className="hero-actions">
              <a href="/resume.pdf" className="btn btn-primary" target="_blank" rel="noreferrer">
                View Resume
              </a>
              <a href="#projects" className="btn btn-ghost">Explore Projects</a>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hero-aside hero-right">
            <div className="hero-photo-wrap">
              <picture>
                <source srcSet="/profile.webp" type="image/webp" />
                <img
                  src="/profile.jpg"
                  alt="Anup Katuwal — Computer Information Systems graduate and data researcher, Kathmandu, Nepal"
                  className="hero-photo"
                  width="440"
                  height="440"
                  fetchPriority="high"
                />
              </picture>
            </div>

            <div className="hero-panel">
              <div className="hero-stat">
                <p className="stat-label">Education</p>
                <p className="stat-value">M.Sc. CIS · <span>CGPA 3.71</span></p>
              </div>
              <div className="hero-stat">
                <p className="stat-label">Thesis</p>
                <p className="stat-value">FairBERT — <span>84% accuracy</span>, bias −35%</p>
              </div>
              <div className="hero-stat">
                <p className="stat-label">Focus</p>
                <p className="stat-value">Data engineering · NLP · Fairness in AI</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
