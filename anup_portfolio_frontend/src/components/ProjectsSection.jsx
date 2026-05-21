// src/components/ProjectsSection.jsx
import React from "react";
import { Section } from "./Section";

const STATIC_PROJECTS = [
  {
    id: 1,
    title: "Bias-Aware Sentiment Analysis on Mental Health",
    description:
      "Master's thesis project. Fine-tuned BERT on Reddit mental-health posts to classify sentiment while measuring and mitigating demographic bias using fairness-aware techniques. Includes statistical analysis and IEEE paper.",
    tech_stack: "Python, BERT, HuggingFace Transformers, Pandas, Scikit-learn, Reddit API",
    github_link: "https://github.com/anupkatuwal/bias-aware-sentiment-analysis-mental-health",
    live_link: "",
  },
  {
    id: 2,
    title: "Anup Portfolio — Full-Stack Personal Site",
    description:
      "This very portfolio! A full-stack app with a React + Vite frontend, FastAPI backend, and admin dashboard for managing projects and contact messages. Deployed on Vercel and Railway.",
    tech_stack: "React, Vite, FastAPI, Python, SQLite, Axios",
    github_link: "https://github.com/anupkatuwal/anup-portfolio",
    live_link: "https://anup-portfolio-one.vercel.app",
  },
];

export function ProjectsSection() {
  return (
    <Section id="projects" title="Projects" eyebrow="Things I am building">
      <div className="projects-grid">
        {STATIC_PROJECTS.map((p) => (
          <article key={p.id} className="card project-card">
            <div className="project-header">
              <h3 className="card-title">{p.title}</h3>
              {(p.github_link || p.live_link) && (
                <div className="project-links">
                  {p.github_link && (
                    <a
                      href={p.github_link}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {p.live_link && (
                    <a
                      href={p.live_link}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link"
                    >
                      Live ↗
                    </a>
                  )}
                </div>
              )}
            </div>

            <p className="project-tagline">{p.description}</p>

            {p.tech_stack && (
              <ul className="pill-list">
                {p.tech_stack.split(",").map((t) => (
                  <li key={t.trim()} className="pill">
                    {t.trim()}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
