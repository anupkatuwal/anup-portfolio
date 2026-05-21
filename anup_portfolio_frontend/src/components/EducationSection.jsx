import React from "react";
import { Section } from "./Section";

const EDUCATION = [
  {
    degree: "Master of Computer Information Systems (MCIS)",
    inst: "NCIT, Pokhara University",
    period: "2022 – Apr 2026",
    details: "CGPA 3.71 · Thesis: Bias Mitigation in Mental Health Sentiment Analysis using BERT.",
  },
  {
    degree: "B.Sc. in Computer Information Systems",
    inst: "Columbia College, Denver, Colorado",
    period: "2010 – 2014",
    details: "GPA 3.34 · Focus on information systems and programming.",
  },
];

export function EducationSection() {
  return (
    <Section id="education" title="Education" eyebrow="// academic background">
      <div className="education-grid">
        {EDUCATION.map((ed) => (
          <article key={ed.degree} className="card">
            <h3 className="card-title">{ed.degree}</h3>
            <p className="card-subtitle">{ed.inst}</p>
            <p className="card-meta">{ed.period}</p>
            <p className="card-text">{ed.details}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
