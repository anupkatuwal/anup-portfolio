import React from "react";
import { Section } from "./Section";

const TRAINING = [
  {
    name: "Advanced Data Analysis with Python",
    org: "Broadway Infosys",
    period: "May 2026 – Aug 2026",
    note: "In Progress",
    tag: "training",
  },
];

const CERTIFICATIONS = [
  {
    name: "Google Data Analytics Certificate",
    org: "Google on Coursera",
    period: "Jul 2024",
    note: "In Progress — 6/9 courses",
    tag: "cert",
  },
  {
    name: "Intro to Generative AI",
    org: "Google Cloud",
    period: "Nov 2023",
    id: "FY87A6MQPE2S",
    tag: "cert",
  },
  {
    name: "Python for Everybody Specialization",
    org: "University of Michigan on Coursera",
    period: "Dec 2020",
    id: "V8DVHVZAA3ZE",
    tag: "cert",
  },
  {
    name: "Building Modern Java Applications on AWS",
    org: "Amazon Web Services (AWS)",
    period: "Mar 2022",
    id: "VY4V3AXMX2S7",
    tag: "cert",
  },
  {
    name: "AWS Cloud Technical Essentials",
    org: "Amazon Web Services (AWS)",
    period: "Jan 2022",
    id: "6L926FGW6DT3",
    tag: "cert",
  },
  {
    name: "Intro to Business Analysis Using Spreadsheets",
    org: "Coursera",
    period: "Jul 2023",
    id: "LXX9PXMFLGLX",
    tag: "cert",
  },
  {
    name: "Build a Full Website Using WordPress",
    org: "Coursera",
    period: "Dec 2020",
    id: "LXX9PXMFLGLX",
    tag: "cert",
  },
];

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
    </Section>
  );
}
