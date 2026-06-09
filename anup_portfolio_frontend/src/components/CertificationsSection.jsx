import React from "react";
import { Section } from "./Section";

const TRAINING = [
  {
    title: "Advanced Data Analysis with Python",
    issuer: "Broadway Infosys",
    date: "May 2026 – Aug 2026",
    status: "In Progress",
  },
];

const CERTIFICATIONS = [
  {
    title: "Google Data Analytics Certificate",
    issuer: "Google on Coursera",
    date: "Jul 2024",
    status: "In Progress — 6/9 courses",
  },
  {
    title: "Intro to Generative AI",
    issuer: "Google Cloud",
    date: "Nov 2023",
    status: null,
  },
  {
    title: "Python for Everybody Specialization",
    issuer: "University of Michigan on Coursera",
    date: "Dec 2020",
    status: null,
  },
  {
    title: "Building Modern Java Applications on AWS",
    issuer: "Amazon Web Services (AWS)",
    date: "Mar 2022",
    status: null,
  },
  {
    title: "AWS Cloud Technical Essentials",
    issuer: "Amazon Web Services (AWS)",
    date: "Jan 2022",
    status: null,
  },
  {
    title: "Intro to Business Analysis Using Spreadsheets",
    issuer: "Coursera",
    date: "Jul 2023",
    status: null,
  },
  {
    title: "Build a Full Website Using WordPress",
    issuer: "Coursera",
    date: "Dec 2020",
    status: null,
  },
];

function CertItem({ title, issuer, date, status }) {
  return (
    <div className="timeline-item">
      <div className="timeline-header">
        <p className="card-title">{title}</p>
        {status && (
          <p className="card-subtitle" style={{ color: "var(--accent)" }}>
            {status}
          </p>
        )}
        <p className="card-subtitle">{issuer}</p>
      </div>
      <p className="timeline-meta">{date}</p>
    </div>
  );
}

export function CertificationsSection() {
  return (
    <Section id="certifications" title="Certifications & Training" eyebrow="// continuous learning">

      <p style={{ marginBottom: "16px", fontSize: "11px", fontFamily: "var(--mono)", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        training
      </p>
      <div className="timeline" style={{ marginBottom: "40px" }}>
        {TRAINING.map((item) => (
          <CertItem key={item.title} {...item} />
        ))}
      </div>

      <p style={{ marginBottom: "16px", fontSize: "11px", fontFamily: "var(--mono)", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        certifications
      </p>
      <div className="timeline">
        {CERTIFICATIONS.map((item) => (
          <CertItem key={item.title} {...item} />
        ))}
      </div>

    </Section>
  );
}
