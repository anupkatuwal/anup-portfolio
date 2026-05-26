import React, { useState, useEffect } from "react";

const ROLES = ["Data Analyst", "Web Developer", "NLP Researcher"];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setRoleVisible(true);
      }, 450);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="top" className="hero">
      <div className="container">
        <div className="hero-layout">

          {/* LEFT */}
          <div>
            <h1 className="hero-name">
              Anup<br /><em>Katuwal.</em>
            </h1>

            <p className="hero-roles">
              <span className="role-prefix">I&apos;m a </span>
              <span className={`role-word${roleVisible ? " is-visible" : ""}`}>
                {ROLES[roleIndex]}
              </span>
            </p>

            <p className="hero-bio">
              Hi, I&apos;m Anup Katuwal — a <strong>Master&apos;s graduate in Computer Information
              Systems</strong> from Kathmandu, Nepal. I build data pipelines, wrangle messy
              datasets, and research fairness in AI. My Master&apos;s thesis tackled bias
              mitigation in mental-health NLP using BERT.
            </p>

            <div className="hero-status">
              <span className="status-dot" />
              Open to roles in Data Analysis, Business Analytics, or Software Development
            </div>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">Projects</a>
              <a href="#contact" className="btn btn-ghost">Get in touch</a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-aside">
            <div className="hero-photo-wrap">
              <img src="/profile.jpg" alt="Anup Katuwal" className="hero-photo" />
            </div>

            <p className="hero-kicker">Kathmandu, Nepal · Data & NLP</p>

            <div className="hero-panel">
              <div className="hero-stat">
                <p className="stat-label">Currently</p>
                <p className="stat-value">M.CIS thesis — <span>bias in mental-health NLP</span></p>
              </div>
              <div className="hero-stat">
                <p className="stat-label">Stack</p>
                <p className="stat-value">Python · BERT · FastAPI · React · SQL</p>
              </div>
              <div className="hero-stat">
                <p className="stat-label">Background</p>
                <p className="stat-value">Teaching · Consulting · Research</p>
              </div>
              <div className="hero-stat">
                <p className="stat-label">Interests</p>
                <p className="stat-value">Fairness in AI · Teaching · Data storytelling</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
