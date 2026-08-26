// src/components/Hero.jsx
import React, { useState, useEffect } from "react";

// Single clear primary identity — not three competing roles
const ROLE_STATIC  = "Data Analyst &";
const ROLE_CYCLING = ["Aspiring Data Engineer", "NLP Researcher", "Python Developer"];

export function Hero() {
  const [roleIndex, setRoleIndex]   = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLE_CYCLING.length);
        setRoleVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="top" className="hero">
      <div className="container">
        <div className="hero-layout">

          {/* ── LEFT ── */}
          <div className="hero-left">
            <p className="hero-eyebrow">
              <span className="eyebrow-line" aria-hidden="true" />
              Kathmandu, Nepal · Open to Work
            </p>

            <h1 className="hero-name">
              Anup<br />
              <em>Katuwal.</em>
            </h1>

            <p className="hero-roles" aria-live="polite">
              <span className="role-static">{ROLE_STATIC} </span>
              <span className={`role-word${roleVisible ? " is-visible" : ""}`}>
                {ROLE_CYCLING[roleIndex]}
              </span>
            </p>

            {/* Client-facing bio — two sentences max */}
            <p className="hero-bio">
              Recent M.CIS graduate (3.71 GPA) with thesis research on fairness
              in mental-health NLP. I&apos;m early in my career, building real
              skills through hands-on projects — <strong>ETL pipelines,
              dashboards, and Python automation</strong> — and working toward
              data analyst and data engineer roles.
            </p>

            <div className="hero-status">
              <span className="status-dot" aria-hidden="true" />
              Open to freelance · ETL Pipelines · Data Engineering · Python Automation
            </div>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">View projects</a>
              <a href="mailto:contact@anup-katuwal.com.np" className="btn btn-ghost">Email me</a>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hero-aside hero-right">
            <div className="hero-photo-wrap">
              <picture>
                <source srcSet="/profile.webp" type="image/webp" />
                <img
                  src="/profile-sm.png"
                  alt="Anup Katuwal — Data Analyst and NLP Researcher, Kathmandu, Nepal"
                  className="hero-photo"
                  width="380"
                  height="380"
                  fetchPriority="high"
                />
              </picture>
            </div>

            <div className="hero-panel">
              <div className="hero-stat">
                <p className="stat-label">Credentials</p>
                <p className="stat-value">
                  M.CIS · <span>3.71 GPA</span> · NLP Thesis Research
                </p>
              </div>

              <div className="hero-stat">
                <p className="stat-label">Built</p>
                <p className="stat-value">
                  <span>Dashboards · Pipelines · API Integrations</span>
                </p>
              </div>

              <div className="hero-stat">
                <p className="stat-label">Stack</p>
                <p className="stat-value">Python · SQL (MySQL) · BERT · FastAPI</p>
              </div>

              <div className="hero-stat">
                <p className="stat-label">Interests</p>
                <p className="stat-value">Fairness in AI · Data storytelling · Automation</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
