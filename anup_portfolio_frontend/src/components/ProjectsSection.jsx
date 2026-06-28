import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function ProjectsSection() {
  const { PROJECTS = [] } = useContent();
  const projects = [...PROJECTS].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  return (
    <Section id="projects" title="Projects" eyebrow="// things I've built">
      <div className="projects-grid">
        {projects.map((p) => (
          <article key={p.id} className="card project-card">
            <div className="project-header">
              <h3 className="card-title">{p.title}</h3>
              <div className="project-links">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    github ↗
                  </a>
                )}
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    live ↗
                  </a>
                )}
                <a href={`/projects/${p.id}`} className="project-link">
                  details →
                </a>
              </div>
            </div>
            {p.metric && <p className="project-metric">{p.metric}</p>}
            <p className="project-tagline">{p.description}</p>
            {p.tech?.length > 0 && (
              <ul className="pill-list">
                {p.tech.map((t) => (
                  <li key={t} className="pill">
                    {t}
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
