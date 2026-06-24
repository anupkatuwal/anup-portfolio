import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

// One vertical timeline: work entries first (newest first, as ordered in
// content.js), then education entries tagged "education".
export function ExperienceSection() {
  const { EXPERIENCES = [], EDUCATION = [] } = useContent();
  return (
    <Section id="experience" title="Experience & Education" eyebrow="// background">
      <div className="timeline">
        {EXPERIENCES.map((exp) => (
          <article key={exp.role + exp.org} className={`card timeline-item${exp.minor ? " role--minor" : ""}`}>
            <div className="timeline-header">
              <h3 className="card-title">{exp.role}</h3>
              <p className="card-subtitle">{exp.org}</p>
            </div>
            <p className="timeline-meta">{exp.period} · {exp.location}</p>
            {exp.minor ? (
              <p className="timeline-description">{exp.description}</p>
            ) : (
              <ul className="bullet-list">
                {(exp.bullets || []).map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
          </article>
        ))}

        {EDUCATION.map((ed) => (
          <article key={ed.degree} className="card timeline-item timeline-item--edu">
            <div className="timeline-header">
              <h3 className="card-title">{ed.degree}</h3>
              <p className="card-subtitle">{ed.inst}</p>
            </div>
            <p className="timeline-meta">{ed.period} · education</p>
            <p className="timeline-description">{ed.details}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
