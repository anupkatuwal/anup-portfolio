// src/pages/ContentEditor.jsx
// A generic structured editor for the whole site-content document. It edits a
// draft (defaults overlaid with whatever is saved), then PUTs the full document
// to /api/content. Handles every section shape in content.js: arrays of strings
// (one-per-line), arrays of records (add/delete/reorder + per-field inputs),
// and booleans.
import React, { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../data/content";
import { apiFetch } from "../lib/api";

const SECTION_LABELS = {
  ABOUT: "About — bio & academic timeline",
  PRIMARY_SKILLS: "Primary skills — highlighted chips",
  SKILLS: "Skills",
  EXPERIENCES: "Experience",
  EDUCATION: "Education",
  TRAINING: "Training",
  CERTIFICATIONS: "Certifications",
  FOUNDATIONS: "Foundations",
  RESUME_HIGHLIGHTS: "Resume highlights",
  SKILL_MATRIX: "Skills matrix",
  TESTIMONIALS: "Testimonials — real, attributable quotes only",
  PROJECTS: "Projects",
  RESEARCH: "Research — thesis page",
  INTERESTS: "Beyond work — training",
};

const MULTILINE_KEYS = new Set(["description", "details", "abstract", "detail", "excerpt", "lead", "quote"]);

const clone = (x) => JSON.parse(JSON.stringify(x));
const isRecordArray = (v) =>
  Array.isArray(v) && v.length > 0 && v.every((x) => x && typeof x === "object" && !Array.isArray(x));

// A blank record matching the union of keys across existing items.
function blankTemplate(items) {
  const tmpl = {};
  for (const item of items) {
    for (const [k, v] of Object.entries(item)) {
      if (k in tmpl) continue;
      if (typeof v === "boolean") tmpl[k] = false;
      else if (Array.isArray(v)) tmpl[k] = [];
      else if (v && typeof v === "object") tmpl[k] = {};
      else tmpl[k] = "";
    }
  }
  return tmpl;
}

// Trim/drop empty lines in string arrays; recurse everything else.
function cleanDeep(node) {
  if (Array.isArray(node)) {
    if (node.every((x) => typeof x === "string")) {
      return node.map((s) => s.trim()).filter((s) => s.length > 0);
    }
    return node.map(cleanDeep);
  }
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = cleanDeep(v);
    return out;
  }
  return node;
}

function itemLabel(item) {
  const k = item.title || item.name || item.role || item.degree || item.domain || item.label;
  return k ? ` · ${k}` : "";
}

function Field({ name, value, onChange }) {
  if (typeof value === "boolean") {
    return (
      <label className="admin-check">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span>{name}</span>
      </label>
    );
  }

  if (Array.isArray(value) && (value.length === 0 || value.every((x) => typeof x === "string"))) {
    return (
      <label className="admin-field">
        <span className="admin-field-label">
          {name} <em>(one per line)</em>
        </span>
        <textarea
          className="admin-input"
          rows={Math.max(2, value.length + 1)}
          value={value.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
        />
      </label>
    );
  }

  if (isRecordArray(value)) {
    return (
      <div className="admin-subfield">
        <span className="admin-field-label">{name}</span>
        <ListEditor items={value} onChange={onChange} />
      </div>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className="admin-subfield">
        <span className="admin-field-label">{name}</span>
        {Object.entries(value).map(([ck, cv]) => (
          <Field key={ck} name={ck} value={cv} onChange={(nv) => onChange({ ...value, [ck]: nv })} />
        ))}
      </div>
    );
  }

  const str = value == null ? "" : String(value);
  const multiline = MULTILINE_KEYS.has(name) || str.length > 64;
  return (
    <label className="admin-field">
      <span className="admin-field-label">{name}</span>
      {multiline ? (
        <textarea
          className="admin-input"
          rows={Math.max(3, Math.ceil(str.length / 60))}
          value={str}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className="admin-input" value={str} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function ListEditor({ items, onChange }) {
  const update = (i, nv) => onChange(items.map((it, idx) => (idx === i ? nv : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const add = () => onChange([...items, items.length ? blankTemplate(items) : {}]);

  return (
    <div className="admin-list-editor">
      {items.map((item, i) => (
        <div className="admin-record" key={i}>
          <div className="admin-record-bar">
            <span className="admin-record-title">
              #{i + 1}
              {itemLabel(item)}
            </span>
            <span className="admin-record-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              <button type="button" className="admin-delete" onClick={() => remove(i)}>Delete</button>
            </span>
          </div>
          {Object.entries(item).map(([k, v]) => (
            <Field key={k} name={k} value={v} onChange={(nv) => update(i, { ...item, [k]: nv })} />
          ))}
        </div>
      ))}
      <button type="button" className="btn btn-ghost admin-add" onClick={add}>
        + Add entry
      </button>
    </div>
  );
}

function Section({ name, value, onChange }) {
  if (Array.isArray(value) && (value.length === 0 || value.every((x) => typeof x === "string"))) {
    return (
      <textarea
        className="admin-input"
        rows={Math.max(3, value.length + 1)}
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
      />
    );
  }
  if (isRecordArray(value)) {
    return <ListEditor items={value} onChange={onChange} />;
  }
  return <Field name={name} value={value} onChange={onChange} />;
}

export function ContentEditor({ token, onAuthError }) {
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/content")
      .then((stored) => {
        if (cancelled) return;
        const overlay = stored && typeof stored === "object" ? stored : {};
        setDraft({ ...clone(DEFAULT_CONTENT), ...overlay });
      })
      .catch(() => {
        if (!cancelled) setDraft(clone(DEFAULT_CONTENT));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setSection = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError("");
    setStatus("");
    try {
      await apiFetch("/api/content", { method: "PUT", body: cleanDeep(draft), token });
      setStatus("Saved ✓ — refresh the public site to see your changes.");
    } catch (err) {
      if (err.status === 401) return onAuthError();
      if (err.status === 400) setError(err.detail || "Validation failed — check your URLs.");
      else if (err.status === 413) setError("Content is too large to save.");
      else setError("Could not save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return <p className="card-text">Loading content…</p>;

  return (
    <div className="admin-editor">
      <div className="admin-editor-bar card">
        <p className="card-text">
          Edit any section and Save. Links must start with <code>https://</code>,{" "}
          <code>mailto:</code>, or <code>/</code>. Clear a section entirely to fall back to the
          built-in default.
        </p>
        <div className="admin-editor-actions">
          <button type="button" className="btn btn-ghost" onClick={() => setDraft(clone(DEFAULT_CONTENT))}>
            Reset to defaults
          </button>
          <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
        {status && <p className="form-status">{status}</p>}
        {error && (
          <p className="form-status error" role="alert">
            {error}
          </p>
        )}
      </div>

      {Object.keys(DEFAULT_CONTENT).map((key) => (
        <details className="admin-section card" key={key} open={key === "PROJECTS"}>
          <summary>{SECTION_LABELS[key] || key}</summary>
          <div className="admin-section-body">
            <Section name={key} value={draft[key] ?? clone(DEFAULT_CONTENT[key])} onChange={(nv) => setSection(key, nv)} />
          </div>
        </details>
      ))}
    </div>
  );
}
