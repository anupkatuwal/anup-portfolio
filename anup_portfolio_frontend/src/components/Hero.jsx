import React from "react";

export function Hero() {
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
              <span className="role-word is-visible">Data Analyst &amp; NLP Researcher</span>
            </p>

            <p className="hero-bio">
              I help teams turn <strong>messy data into clear decisions</strong> — building
              Python pipelines, SQL analytics, and BERT-powered NLP. Backed by a Master&apos;s
              in Computer Information Systems and published fairness research.
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
                <p className="stat-value">M.CIS (3.71 GPA) · <span>Published NLP Research</span></p>
              </div>
              <div className="hero-stat">
                <p className="stat-label">Stack</p>
                <p className="stat-value">Python · BERT · FastAPI · React · SQL</p>
              </div>
              <div className="hero-stat">
                <p className="stat-label">Recent Work</p>
                <p className="stat-value">IEEE NLP Paper · BERT Fine-Tuning · Analytics Dashboards</p>
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
