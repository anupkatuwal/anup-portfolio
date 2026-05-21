// src/api/contact.js
import { apiClient } from "./client";

export async function sendContactMessage({ name, email, subject, message }) {
  // Save to backend DB
  try {
    await apiClient.post("/contact", { name, email, subject, message });
  } catch (_) {
    // If backend is unavailable, fall through to email delivery only
  }

  // Also send via formsubmit.co so you get an email notification
  const res = await fetch("https://formsubmit.co/ajax/katuwalanup@gmail.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ name, email, subject, message, _captcha: "false", _template: "table" }),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
