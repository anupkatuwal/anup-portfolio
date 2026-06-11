import React from "react";
import { Section } from "./Section";
import { TRAINING, CERTIFICATIONS, FOUNDATIONS } from "../data/content";

function CertCard({ item }) {
  return (
    <article className={`card cert-card${item.tag === "training" ? " cert-card--training" : ""}`}>
      <div className="cert-header">
        <h3 className="card-title cert-title">{item.name}</h3>
        {item.note && <span className="cert-badge">{item.note}</span>}
      </div>
      <p className="card-subtitle">{item.org}</p>
      <p className="card-meta">{item.period}</p>
      {item.link && (
        <a href={item.link} target="_blank" rel="noreferrer" className="cert-verify">
          verify ↗
        </a>
      )}
    </article>
  );
}

export function CertificationsSection() {
  return (
    <Section id="certifications" title="Certifications & Training" eyebrow="// continuous learning">
      <div className="cert-group">
        <p className="cert-group-label">training</p>
        <div className="cert-grid">
          {TRAINING.map((item) => <CertCard key={item.name} item={item} />)}
        </div>
      </div>
      <div className="cert-group">
        <p className="cert-group-label">certifications</p>
        <div className="cert-grid">
          {CERTIFICATIONS.map((item) => <CertCard key={item.name + item.period} item={item} />)}
        </div>
      </div>
      {FOUNDATIONS.map((line) => (
        <p key={line.label} className="cert-foundations">
          <span className="cert-foundations-label">{line.label}:</span>{" "}
          {line.items.join(" · ")}
          {line.note && <span className="cert-foundations-note"> — {line.note}</span>}{" "}
          <a
            href={line.link}
            target={line.link.startsWith("/") ? undefined : "_blank"}
            rel="noreferrer"
          >
            {line.linkLabel}
          </a>
        </p>
      ))}
    </Section>
  );
}
