import React from "react";
import { Section } from "./Section";

const HIGHLIGHTS = [
  "Master's in Computer Information Systems — CGPA 3.71 (NCIT)",
  "Thesis: bias mitigation in mental-health sentiment analysis using BERT",
  "Data analytics pipelines & dashboards (Python, Pandas, SQL, Tableau)",
  "Backend development (Java, Spring Boot) & DBMS teaching",
  "Google Data Analytics & Python for Everybody certified",
];

export function ResumeSection() {
  return (
    <Section id="resume" title="Resume" eyebrow="// my background, on one page">
      <div className="resume-card card">
        <div className="resume-info">
          <p className="resume-lead">
            A quick snapshot of my education, experience, and skills — grab the
            full PDF for the details.
          </p>
          <ul className="resume-highlights">
            {HIGHLIGHTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="resume-actions">
          <a
            href="/resume.pdf"
            download
            className="btn btn-primary"
          >
            Download PDF
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            View in browser
          </a>
        </div>
      </div>
    </Section>
  );
}
