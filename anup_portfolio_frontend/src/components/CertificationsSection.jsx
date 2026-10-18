import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

// One line per credential: name · issuer · date · status or link.
function CertLine({ item }) {
  return (
    <li>
      <span className="cert-name">{item.name}</span>
      {" · "}{item.org}
      {item.period && <>{" · "}<span className="mono">{item.period}</span></>}
      {item.note && <>{" · "}<span className="cert-status">{item.note}</span></>}
      {item.link && (
        <>
          {" · "}
          <a href={item.link} target="_blank" rel="noreferrer">
            Verify<span className="visually-hidden"> {item.name}</span> ↗
          </a>
        </>
      )}
    </li>
  );
}

export function CertificationsSection() {
  const { TRAINING = [], CERTIFICATIONS = [], FOUNDATIONS = [] } = useContent();
  const items = [...TRAINING, ...CERTIFICATIONS];
  if (!items.length && !FOUNDATIONS.length) return null;

  return (
    <Section id="certifications" title="Certifications">
      <ul className="cert-list">
        {items.map((item) => <CertLine key={item.name + item.period} item={item} />)}
      </ul>
      {FOUNDATIONS.map((line) => (
        <p key={line.label} className="cert-foundations">
          <span className="cert-foundations-label">{line.label}:</span>{" "}
          {(line.items || []).join(" · ")}
          {line.note && <span className="meta"> — {line.note}</span>}{" "}
          {line.link && (
            <a
              href={line.link}
              target={line.link.startsWith("/") ? undefined : "_blank"}
              rel="noreferrer"
            >
              {line.linkLabel || "view ↗"}
            </a>
          )}
        </p>
      ))}
    </Section>
  );
}
