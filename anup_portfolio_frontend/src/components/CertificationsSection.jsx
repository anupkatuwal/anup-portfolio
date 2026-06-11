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
      <p className="cert-foundations">
        <span className="cert-foundations-label">{FOUNDATIONS.label}:</span>{" "}
        {FOUNDATIONS.items.join(" · ")}{" "}
        <a href={FOUNDATIONS.link} target="_blank" rel="noreferrer">
          {FOUNDATIONS.linkLabel}
        </a>
      </p>
    </Section>
  );
}
