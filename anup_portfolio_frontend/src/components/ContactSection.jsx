import React, { useState } from "react";
import { Section } from "./Section";
import { sendContactMessage } from "../api/contact";

export function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setLoading(true);

    try {
      await sendContactMessage(form);
      setStatus({
        type: "success",
        message: "Thank you for reaching out. I will get back to you soon.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="contact"
      title="Contact"
      eyebrow="Let us collaborate"
    >
      <div className="contact-layout">
        <div className="contact-text">
          <p className="card-text">
            Whether you want to discuss data analytics, NLP projects, teaching,
            or potential collaborations, feel free to send me a message.
          </p>
          <ul className="contact-meta">
            <li>
              <span className="meta-label">Current focus:</span>
              <span>Thesis, data analytics, and academic roles</span>
            </li>
            <li>
              <span className="meta-label">Location:</span>
              <span>Kathmandu, Nepal</span>
            </li>
          </ul>
        </div>

        <form className="card contact-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          {status.type && (
            <p
              className={
                status.type === "success" ? "form-status success" : "form-status error"
              }
            >
              {status.message}
            </p>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </Section>
  );
}
