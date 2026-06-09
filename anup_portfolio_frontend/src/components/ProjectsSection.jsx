import React, { useEffect, useState } from "react";
import { Section } from "./Section";
import { fetchProjects } from "../api/client";

// Always-shown projects (kept even if the backend is down/empty).
const STATIC_PROJECTS = [
  {
    id: "s-1",
    title: "Bias-Aware Mental Health Sentiment Analysis",
    description:
      "Fine-tuned BERT on Reddit mental-health posts to classify sentiment while measuring and mitigating demographic bias. Published as IEEE paper.",
    tech_stack: "Python,BERT,HuggingFace,Pandas,Scikit-learn,Reddit API",
    github_link:
      "https://github.com/anupkatuwal/bias-aware-sentiment-analysis-mental-health",
    live_link: "",
  },
  {
    id: "s-2",
    title: "This Portfolio",
    description:
      "Full-stack personal site — React frontend, FastAPI backend, SQLite DB, JWT admin panel. Deployed serverless on Vercel.",
    tech_stack: "React,Vite,FastAPI,Python,SQLite,Vercel",
    github_link: "https://github.com/anupkatuwal/anup-portfolio",
    live_link: "https://anup-portfolio-one.vercel.app",
  },
  {
    id: "s-3",
    title: "Mood Board",
    description:
      "Full-stack Mood Board app that generates a color palette, quote, and emoji based on how you feel. Built with FastAPI and React, deployed serverless on Vercel.",
    tech_stack: "Python,FastAPI,React,JavaScript,CSS",
    github_link: "https://github.com/anupkatuwal/mood-board",
    live_link: "https://mood-board-five-theta.vercel.app",
  },
  {
    id: "s-4",
    title: "AI Daily Briefing",
    description:
      "Automated personal assistant that fetches unread emails, Google Calendar events, and news headlines every morning, generates a structured briefing with Claude AI, and emails it at 10 AM. Replies to the briefing email trigger Claude to reply or delete emails on your behalf.",
    tech_stack: "Python,Claude AI,Gmail API,Google Calendar API,GitHub Actions,RSS",
    github_link: "https://github.com/anupkatuwal/daily-briefing",
    live_link: "",
  },
];

export function ProjectsSection() {
  const [apiProjects, setApiProjects] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        // Prefix API ids to avoid collisions with static ids
        setApiProjects(data.map((p) => ({ ...p, id: `api-${p.id}` })));
      })
      .catch(() => {
        // Backend unreachable — fine, static still renders
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const projects = [...STATIC_PROJECTS, ...apiProjects];

  return (
    <Section id="projects" title="Projects" eyebrow="// things I've built">
      <div className="projects-grid">
        {projects.map((p) => (
          <article key={p.id} className="card project-card">
            <div className="project-header">
              <h3 className="card-title">{p.title}</h3>
              <div className="project-links">
                {p.github_link && (
                  <a
                    href={p.github_link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    github ↗
                  </a>
                )}
                {p.live_link && (
                  <a
                    href={p.live_link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    live ↗
                  </a>
                )}
              </div>
            </div>
            <p className="project-tagline">{p.description}</p>
            {p.tech_stack && (
              <ul className="pill-list">
                {p.tech_stack.split(",").map((t) => (
                  <li key={t} className="pill">
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
