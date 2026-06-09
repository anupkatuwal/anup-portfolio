import React from "react";
import { Section } from "./Section";

const EXPERIENCES = [
  {
    role: "Graduate Researcher",
    org: "NCIT, Pokhara University",
    period: "2022 – 2026",
    location: "Kathmandu, Nepal",
    bullets: [
      "Thesis on bias mitigation in mental-health sentiment analysis using fine-tuned BERT.",
      "Published IEEE paper; worked with Reddit datasets and demographic fairness metrics.",
    ],
  },
  {
    role: "Consultant Supervisor",
    org: "Bhatta IT Consultancy Services (Remote — Austin, TX)",
    period: "2021 – 2022",
    location: "Kathmandu, Nepal",
    bullets: [
      "Supervised junior developers on Java and Spring Boot projects.",
      "Code review, mentorship, and pair-programming to improve team quality.",
    ],
  },
  {
    role: "Teaching Assistant — DBMS",
    org: "College of Applied Business",
    period: "2020 – 2021",
    location: "Kathmandu, Nepal",
    bullets: [
      "Full semester DBMS instruction — SQL labs, schema design, assessments.",
      "Followed Tribhuvan University syllabus; maintained open availability for students.",
    ],
  },
  {
    role: "Assistant Manager",
    org: "Fine Dining Italian Restaurant",
    period: "2012 – 2016",
    location: "Denver, Colorado",
    description: "Operations, team management, and front-of-house at a fine dining venue.",
    bullets: [],
    minor: true,
  },
];

export function ExperienceSection() {
  return (
    <Section id="experience" title="Experience" eyebrow="// professional background">
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
                {exp.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
