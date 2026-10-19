// src/components/ContactSection.jsx — `05 / contact`, styled as an API
// request (DESIGN.md §5.10). Posts to our own API (/api/contact), which
// stores messages in Neon Postgres. The hidden "company" field is a
// honeypot: bots that fill it get a fake success and nothing is saved.
import React, { useState } from "react";
import { Briefcase, FolderGit2, Mail } from "lucide-react";
import { Section } from "./Section";
import { apiFetch } from "../lib/api";
import { useContent } from "../context/ContentContext";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "", company: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Client-side checks mirror the API's own rules (api/index.py ContactIn).
function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Please add your name.";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "That email address doesn't look right.";
  if (!form.subject.trim()) errors.subject = "Please add a subject.";
  if (form.message.trim().length < 10) errors.message = "Please write at least 10 characters.";
  return errors;
}

const FIELDS = [
  { name: "name", label: "name", autoComplete: "name" },
  { name: "email", label: "email", type: "email", autoComplete: "email" },
  { name: "subject", label: "subject" },
  { name: "message", label: "message", multiline: true },
];

export function ContactSection() {
  const { SITE = {} } = useContent();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: null, code: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, code: "", message: "" });

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/contact", { method: "POST", body: form });
      setStatus({ type: "success", code: "201 Created", message: "Thanks — I'll reply within 2 days." });
      setForm(EMPTY_FORM);
    } catch (err) {
      if (err.status === 429) {
        setStatus({
          type: "error",
          code: "429",
          message: "You've sent several messages recently — please wait an hour and try again.",
        });
      } else if (err.status === 422) {
        setStatus({
          type: "error",
          code: "422",
          message: err.detail || "Please check the form — some fields look invalid.",
        });
      } else {
        setStatus({ type: "error", code: "500", message: "Something broke. Email me directly instead." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact" index="05" label="contact" title="Get in touch">
      <div className="request card" data-reveal>
        <div className="request-head">
          <span><span className="request-method">POST</span> /contact</span>
          <span className="request-status">200 OK?</span>
        </div>

        {status.type === "success" ? (
          <div className="request-result" role="status">
            <p className="request-code is-ok">{status.code}</p>
            <p>{status.message}</p>
          </div>
        ) : (
          <form className="request-form" onSubmit={handleSubmit} noValidate>
            {FIELDS.map((f) => {
              const id = `cf-${f.name}`;
              const err = errors[f.name];
              const props = {
                id,
                name: f.name,
                value: form[f.name],
                onChange: handleChange,
                required: true,
                "aria-invalid": err ? "true" : undefined,
                "aria-describedby": err ? `${id}-error` : undefined,
              };
              return (
                <div key={f.name} className="request-field">
                  <label htmlFor={id}>{f.label}</label>
                  <div>
                    {f.multiline ? (
                      <textarea rows="5" {...props} />
                    ) : (
                      <input type={f.type || "text"} autoComplete={f.autoComplete} {...props} />
                    )}
                    {err && <p className="field-error" id={`${id}-error`}>{err}</p>}
                  </div>
                </div>
              );
            })}

            {/* Honeypot — hidden from humans, bots auto-fill it */}
            <div className="field" style={{ display: "none" }} aria-hidden="true">
              <label htmlFor="cf-company">Company</label>
              <input
                id="cf-company"
                name="company"
                value={form.company}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {status.type === "error" && (
              <div className="request-result" role="alert">
                <p className="request-code is-error">{status.code}</p>
                <p>
                  {status.message}{" "}
                  {status.code === "500" && <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>}
                </p>
              </div>
            )}

            <div className="request-actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Sending…" : "Send request"}
              </button>
            </div>
          </form>
        )}
      </div>

      <ul className="contact-links" data-reveal>
        <li>
          <a className="link" href={`mailto:${SITE.email}`}>
            <Mail size={18} strokeWidth={1.5} aria-hidden="true" /> Email
          </a>
        </li>
        <li>
          <a className="link" href={SITE.linkedin} target="_blank" rel="noreferrer">
            <Briefcase size={18} strokeWidth={1.5} aria-hidden="true" /> LinkedIn
          </a>
        </li>
        <li>
          <a className="link" href={SITE.github} target="_blank" rel="noreferrer">
            <FolderGit2 size={18} strokeWidth={1.5} aria-hidden="true" /> GitHub
          </a>
        </li>
      </ul>
    </Section>
  );
}
