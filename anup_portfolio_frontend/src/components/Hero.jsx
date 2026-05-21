import React from "react";

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container">
        <div className="hero-layout">

          {/* LEFT */}
          <div>
            <p className="hero-kicker">Kathmandu, Nepal · Data & NLP</p>

            <h1 className="hero-name">
              Anup<br /><em>Katuwal.</em>
            </h1>

            <p className="hero-bio">
              I build <strong>NLP systems</strong> that understand language and surface bias.
              Graduate researcher, aspiring lecturer, occasional tinkerer.
            </p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">Projects</a>
              <a href="#contact" className="btn btn-ghost">Get in touch</a>
            </div>

            <div className="hero-status">
              <span className="status-dot" />
              Open to data & analytics roles
            </div>
          </div>

          {/* RIGHT */}
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
    </section>
  );
}
