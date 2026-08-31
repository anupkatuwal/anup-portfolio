import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

// Small inline glyph standing in for the project's architecture diagram.
function ArchIcon() {
  return (
    <svg className="project-arch" viewBox="0 0 24 24" width="22" height="22" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true">
      <rect x="2.5" y="3" width="7" height="5" rx="1.2" />
      <rect x="14.5" y="3" width="7" height="5" rx="1.2" />
      <rect x="8.5" y="16" width="7" height="5" rx="1.2" />
      <path d="M6 8v3.5h12V8" />
      <path d="M12 11.5V16" />
    </svg>
  );
}

export function ProjectsSection() {
  const { PROJECTS = [] } = useContent();
  const projects = [...PROJECTS].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  return (
    <Section id="projects" title="Projects" eyebrow="// applied work">
      <p className="section-lead">
        Pipelines, models and automation built end to end — each one with the
        source open for review.
      </p>
      <div className="projects-grid">
        {projects.map((p) => (
          <article key={p.id} className="card project-card">
            <div className="project-header">
              <ArchIcon />
              <h3 className="card-title">{p.title}</h3>
            </div>

            {p.metric && <p className="project-metric">{p.metric}</p>}
            <p className="project-tagline">{p.description}</p>

            {p.tech?.length > 0 && (
              <ul className="pill-list">
                {p.tech.map((t) => (
                  <li key={t} className="pill">{t}</li>
                ))}
              </ul>
            )}

            <div className="project-links">
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="project-badge">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5z"/>
                  </svg>
                  Source
                </a>
              )}
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="project-badge project-badge--live">
                  Live demo ↗
                </a>
              )}
              <a href={`/projects/${p.id}`} className="project-badge project-badge--ghost">
                Details →
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
