// src/components/InterestsSection.jsx — the "beyond work" section.
// Deliberately compact: this is a footnote to a professional page, not a
// second act. Renders nothing if INTERESTS is missing, and drops the image
// cleanly if `photo` is empty.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function InterestsSection() {
  const { INTERESTS } = useContent();
  if (!INTERESTS) return null;
  const { eyebrow, title, body = [], facts = [], photo, photoAlt } = INTERESTS;

  return (
    <Section id="interests" title={title} eyebrow={eyebrow}>
      <div className={`interests-layout${photo ? "" : " interests-layout--text"}`}>
        <div className="interests-copy">
          {body.map((para) => (
            <p key={para.slice(0, 40)} className="interests-para">{para}</p>
          ))}
          {facts.length > 0 && (
            <dl className="interests-facts">
              {facts.map((f) => (
                <div key={f.label} className="interests-fact">
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {photo && (
          <figure className="interests-photo">
            <picture>
              <source srcSet={`${photo}.webp`} type="image/webp" />
              <img
                src={`${photo}.jpg`}
                alt={photoAlt || ""}
                width="760"
                height="950"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </figure>
        )}
      </div>
    </Section>
  );
}
