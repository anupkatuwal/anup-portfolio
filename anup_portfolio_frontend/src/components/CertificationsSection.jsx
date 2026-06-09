import React, { useState } from "react";
import { Section } from "./Section";

const TRAINING = [
  {
    title: "Advanced Data Analysis with Python",
    issuer: "Broadway Infosys",
    date: "May 2026 – Aug 2026",
    status: "In Progress",
    url: null,
  },
];

const CERTIFICATIONS = [
  {
    title: "Google Data Analytics Certificate",
    issuer: "Google on Coursera",
    date: "Jul 2024",
    status: "In Progress — 6/9 courses",
    url: null,
    courses: [
      { name: "Foundations: Data, Data, Everywhere", url: "https://www.coursera.org/account/accomplishments/verify/3K9MUNSMKTL6" },
      { name: "Ask Questions to Make Data-Driven Decisions", url: "https://www.coursera.org/account/accomplishments/verify/E5GVZM2NBSJL" },
      { name: "Prepare Data for Exploration", url: "https://www.coursera.org/account/accomplishments/verify/E5K9V4XED72M" },
      { name: "Process Data from Dirty to Clean", url: "https://www.coursera.org/account/accomplishments/verify/FHWS68LTF9PD" },
      { name: "Analyze Data to Answer Questions", url: "https://www.coursera.org/account/accomplishments/verify/FWW5YD3KRGGN" },
      { name: "Share Data Through the Art of Visualization", url: "https://www.coursera.org/account/accomplishments/verify/Q3X33DJNAPF5" },
    ],
  },
  {
    title: "Intro to Generative AI",
    issuer: "Google Cloud",
    date: "Nov 2023",
    status: null,
    url: "https://www.coursera.org/account/accomplishments/verify/FY87A6MQPE2S",
  },
  {
    title: "Python for Everybody Specialization",
    issuer: "University of Michigan on Coursera",
    date: "Dec 2020",
    status: null,
    url: "https://www.coursera.org/account/accomplishments/specialization/certificate/V8DVHVZAA3ZE",
  },
  {
    title: "Building Modern Java Applications on AWS",
    issuer: "Amazon Web Services (AWS)",
    date: "Mar 2022",
    status: null,
    url: "https://coursera.org/verify/VY4V3AXMX2S7",
  },
  {
    title: "AWS Cloud Technical Essentials",
    issuer: "Amazon Web Services (AWS)",
    date: "Jan 2022",
    status: null,
    url: "https://coursera.org/share/28d3e6ca9e7dd3b819459f047bea25a2",
  },
  {
    title: "Intro to Business Analysis Using Spreadsheets",
    issuer: "Coursera",
    date: "Jul 2023",
    status: null,
    url: "https://www.coursera.org/account/accomplishments/verify/LXX9PXMFLGLX",
  },
  {
    title: "Build a Full Website Using WordPress",
    issuer: "Coursera",
    date: "Dec 2020",
    status: null,
    url: "https://coursera.org/verify/6L926FGW6DT3",
  },
  {
    title: "TestPrep 1Z0-808 Java SE 8 Programmer I",
    issuer: "Metrix Learning / Skillsoft",
    date: "Dec 2021",
    status: null,
    url: "/cert-java-se8.pdf",
  },
];

function CourseList({ courses }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "10px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none",
          border: "1px solid var(--border-hover)",
          color: "var(--accent)",
          fontFamily: "var(--mono)",
          fontSize: "11px",
          letterSpacing: "0.06em",
          padding: "4px 10px",
          borderRadius: "4px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "10px" }}>{open ? "▾" : "▸"}</span>
        {open ? "hide courses" : `view ${courses.length} completed courses`}
      </button>
      {open && (
        <ul style={{ margin: "10px 0 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
          {courses.map((c) => (
            <li key={c.url} style={{ fontSize: "13px", display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "10px" }}>✓</span>
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--border-hover)" }}
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CertItem({ title, issuer, date, status, url, courses }) {
  return (
    <div className="timeline-item">
      <div className="timeline-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <p className="card-title" style={{ margin: 0 }}>{title}</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: "11px",
                fontFamily: "var(--mono)",
                color: "var(--accent)",
                border: "1px solid var(--border-hover)",
                borderRadius: "4px",
                padding: "2px 8px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              view certificate ↗
            </a>
          )}
        </div>
        {status && (
          <p className="card-subtitle" style={{ color: "var(--accent)" }}>
            {status}
          </p>
        )}
        <p className="card-subtitle">{issuer}</p>
      </div>
      <p className="timeline-meta">{date}</p>
      {courses && courses.length > 0 && <CourseList courses={courses} />}
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
