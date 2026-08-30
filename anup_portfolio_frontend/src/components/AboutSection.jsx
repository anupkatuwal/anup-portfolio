// src/components/AboutSection.jsx — academic + professional bio, an academic
// timeline graphic (B.Sc. → M.Sc. → Research), and the CV / resume downloads.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function AboutSection() {
  const { ABOUT } = useContent();
  if (!ABOUT) return null;
  const { lead, body = [], milestones = [] } = ABOUT;

  return (
    <Section id="about" title="About" eyebrow="// academic & professional">
      <div className="about-layout">
        <div className="about-copy">
          {lead && <p className="about-lead">{lead}</p>}
          {body.map((para) => (
            <p key={para.slice(0, 40)} className="about-para">{para}</p>
          ))}

          <div className="about-actions">
            <a href="/resume.pdf" download className="btn btn-primary">Download CV</a>
            <a href="/resume.pdf" download className="btn btn-ghost">Download Resume</a>
          </div>
        </div>

        {/* Academic timeline graphic */}
        <ol className="about-track" aria-label="Academic timeline">
          {milestones.map((m) => (
            <li key={m.title} className="about-step">
              <span className="about-step-dot" aria-hidden="true" />
              <p className="about-step-year">{m.year}</p>
              <p className="about-step-title">{m.title}</p>
              <p className="about-step-detail">{m.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
