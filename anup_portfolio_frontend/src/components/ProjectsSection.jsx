import React from "react";
import { Section } from "./Section";

const PROJECTS = [
  {
    id: 1,
    title: "Bias-Aware Mental Health Sentiment Analysis",
    description: "Fine-tuned BERT on Reddit mental-health posts to classify sentiment while measuring and mitigating demographic bias. Published as IEEE paper.",
    tech_stack: "Python,BERT,HuggingFace,Pandas,Scikit-learn,Reddit API",
    github_link: "https://github.com/anupkatuwal/bias-aware-sentiment-analysis-mental-health",
    live_link: "",
  },
  {
    id: 2,
    title: "This Portfolio",
    description: "Full-stack personal site — React frontend, FastAPI backend, SQLite DB, JWT admin panel. Deployed serverless on Vercel.",
    tech_stack: "React,Vite,FastAPI,Python,SQLite,Vercel",
    github_link: "https://github.com/anupkatuwal/anup-portfolio",
    live_link: "https://anup-portfolio-one.vercel.app",
  },
];

export function ProjectsSection() {
  return (
    <Section id="projects" title="Projects" eyebrow="// things I've built">
      <div className="projects-grid">
        {PROJECTS.map((p) => (
          <article key={p.id} className="card project-card">
            <div className="project-header">
              <h3 className="card-title">{p.title}</h3>
              <div className="project-links">
                {p.github_link && (
                  <a href={p.github_link} target="_blank" rel="noreferrer" className="project-link">
                    github ↗
                  </a>
                )}
                {p.live_link && (
                  <a href={p.live_link} target="_blank" rel="noreferrer" className="project-link">
                    live ↗
                  </a>
                )}
              </div>
            </div>
            <p className="project-tagline">{p.description}</p>
            {p.tech_stack && (
              <ul className="pill-list">
                {p.tech_stack.split(",").map((t) => (
                  <li key={t} className="pill">{t.trim()}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
