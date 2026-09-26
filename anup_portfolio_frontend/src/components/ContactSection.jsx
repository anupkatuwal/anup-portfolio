// src/components/ContactSection.jsx
// Posts to our own API (/api/contact) which stores messages in Neon Postgres.
// Includes a hidden "company" honeypot field that humans never see — bots
// that fill it get a fake success and nothing is saved.

import React, { useState } from "react";
import { Theme } from "@astryxdesign/core/theme";
import { Card } from "@astryxdesign/core/Card";
import { FormLayout } from "@astryxdesign/core/FormLayout";
import { TextInput } from "@astryxdesign/core/TextInput";
import { TextArea } from "@astryxdesign/core/TextArea";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";
import { Section } from "./Section";
import { apiFetch } from "../lib/api";
import { useSiteTheme } from "../lib/useSiteTheme";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "", company: "" };
export function ContactSection() {
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [status,  setStatus]  = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);
  const mode = useSiteTheme();

  // Astryx inputs call onChange(value, event); native ones pass the event.
  const setField = (name) => (value) => setForm((prev) => ({ ...prev, [name]: value }));
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
    <Section id="contact" title="Contact" eyebrow="Let's collaborate">
      <div className="contact-layout">

        {/* ── Left: contact info ── */}
        <div className="contact-text">
          <p className="card-text" style={{ marginBottom: "20px" }}>
            Available for freelance data engineering projects — ETL pipelines,
            MySQL database design, data warehouses, Python automation, and BI
            dashboards. Reach out and I'll reply within 24 hours.
          </p>

          <ul className="contact-meta">
            <li className="contact-meta-item">
              <span className="meta-label">Email</span>
              <span>
                <a href="mailto:contact@anup-katuwal.com.np" className="meta-link">
                  contact@anup-katuwal.com.np
                </a>
                <br />
                <a href="mailto:katuwalanup@gmail.com" className="meta-link">
                  katuwalanup@gmail.com
                </a>
              </span>
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
                href="https://www.linkedin.com/in/anupkatuwal1989"
                target="_blank"
                rel="noreferrer"
                className="meta-link"
              >
                linkedin.com/in/anupkatuwal1989
              </a>
            </li>

            <li className="contact-meta-item">
              <span className="meta-label">Open to</span>
              <span>ETL pipelines · Data engineering · Python automation · AI integration</span>
            </li>
          </ul>
        </div>

        {/* ── Right: contact form (Astryx trial, Neutral theme) ── */}
        {/* Scoped to this form: index.html's #root boundary keeps Neutral's
            default text styles off the rest of the page. */}
        <Theme theme={neutralTheme} mode={mode}>
          <Card elevation="low" padding={5}>
            <form onSubmit={handleSubmit} noValidate>
              <FormLayout defaultOptionality="required">
                <FormLayout direction="horizontal">
                  <TextInput
                    label="Name"
                    htmlName="name"
                    value={form.name}
                    onChange={setField("name")}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                  <TextInput
                    label="Email"
                    htmlName="email"
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </FormLayout>

                <TextInput
                  label="Subject"
                  htmlName="subject"
                  value={form.subject}
                  onChange={setField("subject")}
                  placeholder="What's this about?"
                />

                <TextArea
                  label="Message"
                  htmlName="message"
                  rows={5}
                  value={form.message}
                  onChange={setField("message")}
                  placeholder="Tell me about your project or question..."
                />

                {/* Honeypot — hidden from humans, bots auto-fill it. Stays a
                    native input: it must never render or take focus. */}
                <div style={{ display: "none" }} aria-hidden="true">
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
                  <Banner
                    status={status.type}
                    title={status.message}
                    collapsible={false}
                  />
                )}

                <Button
                  variant="primary"
                  type="submit"
                  label={loading ? "Sending…" : "Send Message"}
                  isLoading={loading}
                />
              </FormLayout>
            </form>
          </Card>
        </Theme>

      </div>
    </Section>
  );
}
