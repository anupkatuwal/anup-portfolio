// src/components/AboutSection.jsx — `01 / about`: bio paragraphs beside a
// mono spec sheet (DESIGN.md §5.6). Copy: ABOUT and ABOUT_SPEC in content.js.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function AboutSection() {
  const { ABOUT = {}, ABOUT_SPEC = [] } = useContent();
  const paragraphs = [ABOUT.lead, ...(ABOUT.body || [])].filter(Boolean);

  return (
    <Section id="about" index="01" label="about" title="About">
      <div className="about-grid">
        <div className="about-text" data-reveal>
          {paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
        </div>
        {ABOUT_SPEC.length > 0 && (
          <dl className="spec-sheet" data-reveal>
            {ABOUT_SPEC.map((row) => (
              <div key={row.key} className="spec-row">
                <dt>{row.key}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Section>
  );
}
