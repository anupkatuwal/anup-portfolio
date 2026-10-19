// src/components/AboutSection.jsx — short bio. Copy comes from ABOUT in
// content.js (editable in /admin).
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function AboutSection() {
  const { ABOUT } = useContent();
  if (!ABOUT) return null;
  const { lead, body = [] } = ABOUT;

  return (
    <Section id="about" title="About">
      {lead && <p>{lead}</p>}
      {body.map((para) => (
        <p key={para.slice(0, 40)}>{para}</p>
      ))}
    </Section>
  );
}
