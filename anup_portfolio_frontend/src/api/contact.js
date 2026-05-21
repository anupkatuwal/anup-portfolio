// src/api/contact.js
// Uses formsubmit.co — no backend needed. Sends email directly to katuwalanup@gmail.com.
// First-ever submission will trigger a one-time activation email from formsubmit.co.

export async function sendContactMessage({ name, email, subject, message }) {
  const res = await fetch("https://formsubmit.co/ajax/katuwalanup@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      subject,
      message,
      _captcha: "false",
      _template: "table",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}
