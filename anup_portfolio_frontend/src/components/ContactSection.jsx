// src/components/ContactSection.jsx
// Posts to our own API (/api/contact) which stores messages in Neon Postgres.
// Includes a hidden "company" honeypot field that humans never see — bots
// that fill it get a fake success and nothing is saved.

import React, { useState } from "react";
import { Section } from "./Section";
import { apiFetch } from "../lib/api";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "", company: "" };

export function ContactSection() {
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [status,  setStatus]  = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (form.message.trim().length < 10) {
      setStatus({
        type:    "error",
        message: "Message is a bit short — please write at least 10 characters.",
      });
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/contact", { method: "POST", body: form });
      setStatus({
        type:    "success",
        message: "Message sent — I'll get back to you soon.",
      });
      setForm(EMPTY_FORM);
    } catch (err) {
      if (err.status === 429) {
        setStatus({
          type:    "error",
          message: "You've sent several messages recently — please wait an hour and try again.",
        });
      } else if (err.status === 422) {
        setStatus({
          type:    "error",
          message: err.detail || "Please check the form — some fields look invalid.",
        });
      } else if (err.status) {
        setStatus({
          type:    "error",
          message: "Something went wrong on the server. Please try again later.",
        });
      } else {
        setStatus({
          type:    "error",
          message: "Network error. Check your connection and try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact" title="Contact">
      <p className="contact-intro">
        Available for freelance data engineering projects — ETL pipelines,
        MySQL database design, data warehouses, Python automation, and BI
        dashboards. Reach out and I'll reply within 24 hours.
      </p>

      <dl className="contact-list">
        <dt>Email</dt>
        <dd>
          <a href="mailto:contact@anup-katuwal.com.np">contact@anup-katuwal.com.np</a>
          <br />
          <a href="mailto:katuwalanup@gmail.com">katuwalanup@gmail.com</a>
        </dd>

        <dt>LinkedIn</dt>
        <dd>
          <a href="https://www.linkedin.com/in/anupkatuwal1989" target="_blank" rel="noreferrer">
            linkedin.com/in/anupkatuwal1989
          </a>
        </dd>

        <dt>GitHub</dt>
        <dd>
          <a href="https://github.com/anupkatuwal" target="_blank" rel="noreferrer">
            github.com/anupkatuwal
          </a>
        </dd>

        <dt>Upwork</dt>
        <dd>
          <a href="https://www.upwork.com/freelancers/~01fe60c948627059d5" target="_blank" rel="noreferrer">
            upwork.com/freelancers/~01fe60c948627059d5
          </a>
        </dd>

        <dt>Location</dt>
        <dd>Kathmandu, Nepal</dd>

        <dt>Open to</dt>
        <dd>ETL pipelines · Data engineering · Python automation · AI integration</dd>
      </dl>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="field-row">
          <div className="field">
            <label htmlFor="cf-name">Name</label>
            <input
              id="cf-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-email">Email</label>
            <input
              id="cf-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="cf-subject">Subject</label>
          <input
            id="cf-subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="cf-message">Message</label>
          <textarea
            id="cf-message"
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell me about your project or question..."
            required
          />
        </div>

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

        {status.type && (
          <p className={`form-status ${status.type}`} role="alert">
            {status.message}
          </p>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send Message"}
        </button>
      </form>
    </Section>
  );
}
