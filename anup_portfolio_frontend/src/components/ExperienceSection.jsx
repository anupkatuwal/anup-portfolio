import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";
import { Testimonials } from "./Testimonials";

// Work history, newest first, in the order stored in content.
export function ExperienceSection() {
  const { EXPERIENCES = [] } = useContent();
  return (
    <Section id="experience" title="Experience">
      <ol className="entries">
        {EXPERIENCES.map((exp) => (
          <li key={exp.role + exp.org} className="entry">
            <div className="entry-head">
              <h3 className="entry-title">{exp.role}</h3>
              <p className="meta">{exp.period}</p>
            </div>
            <p className="entry-org">
              {[exp.org, exp.location].filter(Boolean).join(" · ")}
            </p>
            {exp.minor || !exp.bullets?.length ? (
              exp.description && <p className="entry-text">{exp.description}</p>
            ) : (
              <ul className="bullets">
                {exp.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ol>
      <Testimonials />
    </Section>
  );
}
