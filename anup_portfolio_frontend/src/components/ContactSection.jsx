// src/components/ContactSection.jsx
//
// Uses Formspree for reliable email delivery — no backend, no lost messages.
//
// SETUP (one-time, 2 minutes):
//   1. Go to https://formspree.io and sign up free
//   2. Create a new form → copy the form ID (looks like "xpwzgkqr")
//   3. Replace "mjgzdegv" below with your actual ID
//   4. Formspree emails every submission directly to katuwalanup@gmail.com
//   5. Free tier: 50 submissions/month — more than enough for a portfolio

import React, { useState } from "react";
import { Section } from "./Section";

const FORMSPREE_ID = "mjgzdegv"; // ← replace this after signing up
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

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
    setLoading(true);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify(form),
      });

      if (res.ok) {
        setStatus({
          type:    "success",
          message: "Message sent — I'll get back to you soon.",
        });
        setForm(EMPTY_FORM);
      } else {
        // Formspree returns structured errors — surface them if present
        const data = await res.json().catch(() => ({}));
        setStatus({
          type:    "error",
          message: data?.error ?? "Something went wrong. Please try again.",
        });
      }
    } catch {
      setStatus({
        type:    "error",
        message: "Network error. Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact" title="Contact" eyebrow="Let's collaborate">
      <div className="contact-layout">

        {/* ── Left: contact info ── */}
        <div className="contact-text">
          <p className="card-text" style={{ marginBottom: "20px" }}>
            Available for freelance data analytics, Python automation, and API
            integration projects. Reach out and I'll reply within 24 hours.
          </p>

          <ul className="contact-meta">
            <li className="contact-meta-item">
              <span className="meta-label">Email</span>
              <a href="mailto:katuwalanup@gmail.com" className="meta-link">
                katuwalanup@gmail.com
              </a>
            </li>

            <li className="contact-meta-item">
              <span className="meta-label">Location</span>
              <span>Kathmandu, Nepal</span>
            </li>

            <li className="contact-meta-item">
              <span className="meta-label">Upwork</span>
              <a
                href="https://www.upwork.com/freelancers/~01fe60c948627059d5"
                target="_blank"
                rel="noreferrer"
                className="meta-link"
              >
                upwork.com/freelancers/~01fe60c948627059d5
              </a>
            </li>

            <li className="contact-meta-item">
              <span className="meta-label">GitHub</span>
              <a
                href="https://github.com/anupkatuwal"
                target="_blank"
                rel="noreferrer"
                className="meta-link"
              >
                github.com/anupkatuwal
              </a>
            </li>

            <li className="contact-meta-item">
              <span className="meta-label">LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/anup-katuwal-004b7884"
                target="_blank"
                rel="noreferrer"
                className="meta-link"
              >
                linkedin.com/in/anup-katuwal
              </a>
            </li>

            <li className="contact-meta-item">
              <span className="meta-label">Open to</span>
              <span>Data analytics · Python automation · AI integration</span>
            </li>
          </ul>
        </div>

        {/* ── Right: contact form ── */}
        <form className="card contact-form" onSubmit={handleSubmit} noValidate>
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

          {status.type && (
            <p className={`form-status ${status.type}`} role="alert">
              {status.message}
            </p>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Sending…" : "Send Message"}
          </button>
        </form>

      </div>
    </Section>
  );
}
