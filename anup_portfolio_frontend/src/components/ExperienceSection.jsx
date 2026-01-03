import React from "react";
import { Section } from "./Section";

const EXPERIENCES = [
  {
    role: "Graduate Student · MCIS",
    org: "Nepal College of Information Technology (NCIT)",
    period: "2022 – Present",
    location: "Kathmandu, Nepal",
    bullets: [
      "Conducting thesis on bias mitigation in mental-health sentiment analysis using BERT.",
      "Working with Reddit-based mental-health datasets and fairness metrics.",
      "Exploring data analytics, NLP, and teaching-focused career paths.",
    ],
  },
  {
    role: "Assistant Manager",
    org: "Fine Dining Italian Restaurant",
    period: "2012 – 2016",
    location: "Denver, Colorado, USA",
    bullets: [
      "Led day-to-day operations, scheduling, and customer experience.",
      "Managed a diverse team, inventory, and vendor relationships.",
      "Developed strong time-management, communication, and leadership skills.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      title="Experience"
      eyebrow="Professional background"
    >
      <div className="timeline">
        {EXPERIENCES.map((exp) => (
          <article key={exp.role + exp.org} className="timeline-item card">
            <div className="timeline-header">
              <h3 className="card-title">{exp.role}</h3>
              <p className="card-subtitle">{exp.org}</p>
            </div>
            <p className="timeline-meta">
              <span>{exp.period}</span> · <span>{exp.location}</span>
            </p>
            <ul className="bullet-list">
              {exp.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
