import React from "react";
import { Section } from "./Section";

const EXPERIENCES = [
  {
    role: "Graduate Researcher · MCIS Thesis",
    org: "Nepal College of Information Technology (NCIT), Pokhara University",
    period: "2022 – Present",
    location: "Kathmandu, Nepal",
    bullets: [
      "Conducting thesis on bias mitigation in mental-health sentiment analysis using fine-tuned BERT.",
      "Working with Reddit-based mental-health datasets and fairness metrics across demographic groups.",
      "Published IEEE paper on findings; exploring data analytics and teaching-focused career paths.",
    ],
  },
  {
    role: "Consultant Supervisor",
    org: "Bhatta IT Consultancy Services Pvt Ltd (Remote — Austin, Texas, USA)",
    period: "2021 – 2022",
    location: "Kathmandu, Nepal (Remote)",
    bullets: [
      "Supervised junior and beginner developers working with Java and Spring Boot across multiple projects.",
      "Reviewed and audited code written by new developers, identified issues, and guided fixes or collaborated directly to resolve them.",
      "Provided hands-on mentorship and pair-programming support to build confidence and improve code quality.",
    ],
  },
  {
    role: "Teaching Assistant — Database Management Systems",
    org: "College of Applied Business",
    period: "2020 – 2021",
    location: "Kathmandu, Nepal",
    bullets: [
      "Delivered a full semester of DBMS instruction following the Tribhuvan University syllabus.",
      "Conducted hands-on SQL lab sessions in MySQL covering query writing, schema design, and data retrieval.",
      "Managed student assessment through attendance, quizzes, and midterm exams; maintained open availability for support.",
    ],
  },
  {
    role: "Assistant Manager",
    org: "Fine Dining Italian Restaurant",
    period: "2012 – 2016",
    location: "Denver, Colorado, USA",
    bullets: [
      "Led day-to-day operations, scheduling, and customer experience management.",
      "Managed a diverse team, inventory, and vendor relationships in a high-volume environment.",
      "Developed strong communication, leadership, and time-management skills.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      title="Experience"
      eyebrow="Professional background"
    >
      <div className="timeline">
        {EXPERIENCES.map((exp) => (
          <article key={exp.role + exp.org} className="timeline-item card">
            <div className="timeline-header">
              <h3 className="card-title">{exp.role}</h3>
              <p className="card-subtitle">{exp.org}</p>
            </div>
            <p className="timeline-meta">
              <span>{exp.period}</span> · <span>{exp.location}</span>
            </p>
            <ul className="bullet-list">
              {exp.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
