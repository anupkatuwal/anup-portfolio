// src/components/Hero.jsx
import React from "react";

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left */}
          <div className="hero-left">
            <p className="hero-eyebrow">Data & AI · Portfolio</p>

            <h1 className="hero-title">
              Hi, I am <span className="hero-accent">Anup Katuwal</span>.
            </h1>

            <p className="hero-subtitle">
              Graduate student in Computer Information Systems, aspiring data
              analyst and lecturer, building intelligent systems at the
              intersection of{" "}
              <span className="hero-subtle-accent">
                NLP, analytics, and real-world problems.
              </span>
            </p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                View Projects
              </a>
              <a href="#contact" className="btn btn-ghost">
                Contact Me
              </a>
            </div>

            <p className="hero-meta">
              Based in Kathmandu · Open to data/analytics roles and
              collaborations.
            </p>
          </div>

          {/* Right */}
          <div className="card hero-card">
            <div className="hero-card-top">
              <div className="hero-avatar">
                <span>AK</span>
              </div>
              <div>
                <p className="hero-card-label">Current Focus</p>
                <p className="hero-card-text">
                  Finishing master&apos;s thesis on bias in mental-health
                  sentiment analysis using BERT, and preparing for a lecturer
                  role.
                </p>
              </div>
            </div>

            <div className="hero-tags">
              <span className="tag">Python</span>
              <span className="tag">FastAPI</span>
              <span className="tag">React</span>
              <span className="tag">Data Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
