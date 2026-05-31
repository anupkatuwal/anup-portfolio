// src/components/Hero.jsx
import React, { useState, useEffect } from "react";

// Single clear primary identity — not three competing roles
const ROLE_STATIC  = "Data Analyst &";
const ROLE_CYCLING = ["Automation Engineer", "Python Developer", "NLP Researcher"];

export function Hero() {
  const [roleIndex, setRoleIndex]   = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);

  useEffect(() => {
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
            {/* Eyebrow ABOVE the name — not floating below the photo */}
            <p className="hero-eyebrow">
              <span className="eyebrow-line" aria-hidden="true" />
              Kathmandu, Nepal · Available for freelance
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

            {/* Client-facing bio — outcomes, not CV bullet points */}
            <p className="hero-bio">
              I turn messy data into <strong>decisions</strong> — dashboards,
              pipelines, and automation tools built with Python, SQL, and AI.
              M.CIS graduate (3.71 GPA) with published NLP research on fairness
              in mental-health AI.
            </p>

            {/* Single clear availability signal */}
            <div className="hero-status">
              <span className="status-dot" aria-hidden="true" />
              Open to freelance · Data Analysis · Python Automation · AI Integration
            </div>

            {/* Three CTAs: projects, contact, AND Upwork for instant credibility */}
            <div className="hero-actions">
              <a href="#projects"                              className="btn btn-primary">View Projects</a>
              <a href="#contact"                               className="btn btn-ghost">Get in touch</a>
              <a
                href="https://www.upwork.com/freelancers/~01fe60c948627059d5"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-upwork"
              >
                Upwork ↗
              </a>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hero-aside hero-right">
            <div className="hero-photo-wrap">
              <img src="/profile.jpg" alt="Anup Katuwal" className="hero-photo" />
            </div>

            <div className="hero-panel">
              {/* Credentials — graduate, not student */}
              <div className="hero-stat">
                <p className="stat-label">Credentials</p>
                <p className="stat-value">
                  M.CIS · <span>3.71 GPA</span> · Published Research
                </p>
              </div>

              {/* What you've actually delivered */}
              <div className="hero-stat">
                <p className="stat-label">Delivered</p>
                <p className="stat-value">
                  <span>Dashboards · Pipelines · API Integrations</span>
                </p>
              </div>

              {/* Stack */}
              <div className="hero-stat">
                <p className="stat-label">Stack</p>
                <p className="stat-value">Python · SQL · BERT · FastAPI · React</p>
              </div>

              {/* Interests — humanising, fine to keep */}
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
