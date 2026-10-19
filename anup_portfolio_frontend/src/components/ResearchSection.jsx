// src/components/ResearchSection.jsx — homepage teaser linking to /research.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function ResearchSection() {
  const { RESEARCH } = useContent();
  if (!RESEARCH) return null;

  const { title, venue, period, abstract = "", metrics = [] } = RESEARCH;
  // Problem + approach; the results sentence is shown as the metric row.
  const summary = abstract.split(". ").slice(0, 2).join(". ") + ".";

  return (
    <Section id="research" title="Research">
      <article className="research-teaser">
        <h3 className="research-title"><a href="/research">{title}</a></h3>
        <p className="meta">{venue} · {period}</p>
        <p className="research-summary">{summary}</p>

        {metrics.length > 0 && (
          <dl className="metrics">
            {metrics.map((m) => (
              <div key={m.label} className="metric">
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <p className="text-link-row"><a href="/research">Read the full research →</a></p>
      </article>
    </Section>
  );
}
