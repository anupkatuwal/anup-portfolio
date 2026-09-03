// src/components/InterestsSection.jsx — the "beyond work" section.
// Deliberately compact: this is a footnote to a professional page, not a
// second act. Renders nothing if INTERESTS is missing, and drops the photo
// row cleanly when `photos` is empty.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function InterestsSection() {
  const { INTERESTS } = useContent();
  if (!INTERESTS) return null;
  const { eyebrow, title, body = [], facts = [], photos = [] } = INTERESTS;
  const shown = photos.filter((p) => p && p.src).slice(0, 2);

  return (
    <Section id="interests" title={title} eyebrow={eyebrow}>
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

      {shown.length > 0 && (
        <div className={`interests-photos interests-photos--${shown.length}`}>
          {shown.map((photo) => (
            <figure key={photo.src} className="interests-photo">
              <picture>
                <source srcSet={`${photo.src}.webp`} type="image/webp" />
                <img
                  src={`${photo.src}.jpg`}
                  alt={photo.alt || ""}
                  width="700"
                  height="875"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
          ))}
        </div>
      )}
    </Section>
  );
}
