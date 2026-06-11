// src/lib/api.js — tiny fetch wrapper for the portfolio API.
// In dev the FastAPI server runs separately on :8000; in production the API
// is same-origin under /api on Vercel.

const BASE = import.meta.env.DEV ? "http://127.0.0.1:8000" : "";

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || `Request failed (${status})`);
    this.status = status;
    this.detail = detail;
  }
}

export async function apiFetch(path, { method = "GET", body, token, form } = {}) {
  const headers = {};
  let payload;

  if (form) {
    payload = new URLSearchParams(form);
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { method, headers, body: payload });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // FastAPI puts errors in `detail` — either a string or a validation array
    let detail = data?.detail;
    if (Array.isArray(detail)) {
      detail = detail.map((d) => d.msg).join(" · ");
    }
    throw new ApiError(res.status, detail);
  }
  return data;
}
