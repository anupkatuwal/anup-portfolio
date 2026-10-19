import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";
import { firstSentence, liveLinkLabel } from "../lib/projects";

export function ProjectsSection() {
  const { PROJECTS = [] } = useContent();
  const projects = [...PROJECTS].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  return (
    <Section id="projects" title="Projects">
      <ul className="project-list">
        {projects.map((p) => (
          <li key={p.id} className="project">
            <div className="project-head">
              <h3 className="project-title"><a href={`/projects/${p.id}`}>{p.title}</a></h3>
              {p.metric && <p className="project-metric">{p.metric}</p>}
            </div>
            <p className="project-summary">{firstSentence(p.description)}</p>

            <div className="project-foot">
              {p.tech?.length > 0 && (
                <ul className="tags" aria-label="Technologies">
                  {p.tech.map((t) => <li key={t} className="tag">{t}</li>)}
                </ul>
              )}
              <ul className="project-links">
                <li><a href={`/projects/${p.id}`}>Details<span className="visually-hidden"> — {p.title}</span></a></li>
                {p.github && (
                  <li>
                    <a href={p.github} target="_blank" rel="noreferrer">
                      GitHub<span className="visually-hidden"> — {p.title}</span> ↗
                    </a>
                  </li>
                )}
                {p.live && (
                  <li>
                    <a href={p.live} target="_blank" rel="noreferrer">
                      {liveLinkLabel(p.live)}<span className="visually-hidden"> — {p.title}</span> ↗
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
