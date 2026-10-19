// src/components/StackSection.jsx — `03 / stack` (DESIGN.md §5.8). A plain
// table from STACK in content.js: no ratings, no logos.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";

export function StackSection() {
  const { STACK = [] } = useContent();
  if (!STACK.length) return null;

  return (
    <Section id="stack" index="03" label="stack" title="Stack">
      <table className="stack-table" data-reveal>
        <thead>
          <tr>
            <th scope="col">Area</th>
            <th scope="col">Tools</th>
            <th scope="col">Used for</th>
          </tr>
        </thead>
        <tbody>
          {STACK.map((r) => (
            <tr key={r.area}>
              <th scope="row">{r.area}</th>
              <td>{r.tools}</td>
              <td>{r.use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
