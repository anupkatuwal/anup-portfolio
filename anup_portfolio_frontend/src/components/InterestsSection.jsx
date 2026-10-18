// src/components/InterestsSection.jsx — the "outside work" footnote.
// Deliberately small: the body copy and one photo. Renders nothing if
// INTERESTS is missing, and runs text-only when `photos` is empty.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function InterestsSection() {
  const { INTERESTS } = useContent();
  if (!INTERESTS) return null;
  const { body = [], photos = [] } = INTERESTS;
  const photo = photos.find((p) => p && p.src);

  return (
    <Section id="interests" title="Outside work">
      <div className="outside">
        <div className="outside-text">
          {body.map((para) => <p key={para.slice(0, 40)}>{para}</p>)}
        </div>
        {photo && (
          <figure className="outside-photo">
            <picture>
              <source srcSet={`${photo.src}.webp`} type="image/webp" />
              <img
                src={`${photo.src}.jpg`}
                alt={photo.alt || ""}
                width="120"
                height="150"
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
