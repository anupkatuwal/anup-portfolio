import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function ResumeSection() {
  const { RESUME_HIGHLIGHTS = [] } = useContent();
  return (
    <Section id="resume" title="Resume" eyebrow="// my background, on one page">
      <div className="resume-card card">
        <div className="resume-info">
          <p className="resume-lead">
            A quick snapshot of my education, experience, and skills — grab the
            full PDF for the details.
          </p>
          <ul className="resume-highlights">
            {RESUME_HIGHLIGHTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="resume-actions">
          <a href="/resume.pdf" download className="btn btn-primary">
            Download PDF
          </a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn btn-ghost">
            View in browser
          </a>
        </div>
      </div>
    </Section>
  );
}
