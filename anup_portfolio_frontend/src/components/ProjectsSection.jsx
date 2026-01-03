// src/components/ProjectsSection.jsx
import React, { useEffect, useState } from "react";
import { Section } from "./Section";
import { fetchProjects } from "../api/client";

export function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <Section
      id="projects"
      title="Projects"
      eyebrow="Things I am building"
    >
      {loading && <p className="card-text">Loading projects…</p>}

      {error && <p className="card-text">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="card-text">No projects added yet.</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="projects-grid">
          {projects.map((p) => (
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
                        GitHub
                      </a>
                    )}
                    {p.live_link && (
                      <a
                        href={p.live_link}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link"
                      >
                        Live
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
      )}
    </Section>
  );
}
