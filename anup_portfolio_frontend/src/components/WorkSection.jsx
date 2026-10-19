// src/components/WorkSection.jsx — `02 / work` (DESIGN.md §5.7). Cards join
// PROJECTS with PROJECT_NOTES; the first note is the featured, full-width card.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";
import { liveLinkLabel, workItems } from "../lib/projects";

function ProjectCard({ p, featured }) {
  const links = [
    p.code && { href: p.code, label: "Code" },
    p.live && { href: p.live, label: liveLinkLabel(p.live) },
    p.paper && { href: p.paper, label: "Paper", internal: p.paper.startsWith("/") },
  ].filter(Boolean);

  return (
    <article className={`card project${featured ? " project--featured" : ""}`}>
      <div className="project-body">
        <div className="project-top">
          <h3 className="project-title"><a href={`/projects/${p.id}`}>{p.title}</a></h3>
          {p.tag && <span className="tag-chip">{p.tag}</span>}
        </div>
        {p.problem && <p className="project-problem">{p.problem}</p>}
        {p.outcome && <p className="project-outcome">{p.outcome}</p>}
        {p.stack.length > 0 && (
          <ul className="chips" aria-label="Stack">
            {p.stack.map((t) => <li key={t} className="chip">{t}</li>)}
          </ul>
        )}
        {links.length > 0 && (
          <ul className="project-links">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  className="link"
                  href={l.href}
                  {...(l.internal ? {} : { target: "_blank", rel: "noreferrer" })}
                >
                  {l.label}<span className="visually-hidden"> — {p.title}</span> ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {featured && p.stats.length > 0 && (
        <dl className="project-stats">
          {p.stats.map((s) => (
            <div key={s.label} className="stat">
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

export function WorkSection() {
  const { PROJECTS = [], PROJECT_NOTES = [] } = useContent();
  const items = workItems(PROJECTS, PROJECT_NOTES);

  return (
    <Section id="work" index="02" label="work" title="Selected work">
      <div className="work-grid" data-reveal-group>
        {items.map((p, i) => <ProjectCard key={p.id} p={p} featured={i === 0} />)}
      </div>
    </Section>
  );
}
