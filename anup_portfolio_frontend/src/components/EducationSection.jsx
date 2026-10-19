import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function EducationSection() {
  const { EDUCATION = [] } = useContent();
  if (!EDUCATION.length) return null;
  return (
    <Section id="education" title="Education">
      <ol className="entries">
        {EDUCATION.map((ed) => (
          <li key={ed.degree} className="entry">
            <div className="entry-head">
              <h3 className="entry-title">{ed.degree}</h3>
              <p className="meta">{ed.period}</p>
            </div>
            <p className="entry-org">{ed.inst}</p>
            {ed.details && <p className="entry-text">{ed.details}</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}
