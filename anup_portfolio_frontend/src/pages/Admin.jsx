// src/pages/Admin.jsx — message inbox behind a login form.
// Token lives in sessionStorage; any 401 clears it and drops back to login.
import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const TOKEN_KEY = "admin_token";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        form: { username, password },
      });
      window.sessionStorage.setItem(TOKEN_KEY, data.access_token);
      onLogin(data.access_token);
    } catch (err) {
      if (err.status === 429) {
        setError("Too many attempts — wait 15 minutes and try again.");
      } else if (err.status === 503) {
        setError("Login is not configured on the server.");
      } else if (err.status === 401) {
        setError("Incorrect username or password.");
      } else {
        setError("Login failed. Check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card contact-form admin-login" onSubmit={handleSubmit}>
      <h1 className="section-title">Admin</h1>
      <div className="field">
        <label htmlFor="admin-user">Username</label>
        <input
          id="admin-user"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
      </div>
      <div className="field">
        <label htmlFor="admin-pass">Password</label>
        <input
          id="admin-pass"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>
      {error && <p className="form-status error" role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function Inbox({ token, onLogout }) {
  const [messages, setMessages] = useState(null);
  const [error, setError]       = useState("");

  const handle401 = useCallback(() => {
    window.sessionStorage.removeItem(TOKEN_KEY);
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/admin/messages", { token })
      .then((rows) => { if (!cancelled) setMessages(rows); })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) handle401();
        else setError("Could not load messages.");
      });
    return () => { cancelled = true; };
  }, [token, handle401]);

  const markRead = async (id) => {
    try {
      await apiFetch(`/api/admin/messages/${id}/read`, { method: "PATCH", token });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    } catch (err) {
      if (err.status === 401) return handle401();
      setError("Could not mark as read.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await apiFetch(`/api/admin/messages/${id}`, { method: "DELETE", token });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      if (err.status === 401) return handle401();
      setError("Could not delete the message.");
    }
  };

  return (
    <>
      <div className="admin-header">
        <h1 className="section-title">Inbox</h1>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => { window.sessionStorage.removeItem(TOKEN_KEY); onLogout(); }}
        >
          Sign out
        </button>
      </div>

      {error && <p className="form-status error" role="alert">{error}</p>}
      {messages === null && <p className="card-text">Loading…</p>}
      {messages?.length === 0 && <p className="card-text">No messages yet.</p>}

      <div className="admin-list">
        {messages?.map((m) => (
          <article key={m.id} className={`card admin-msg${m.is_read ? "" : " admin-msg--unread"}`}>
            <div className="admin-msg-top">
              <h2 className="card-title">{m.subject}</h2>
              <p className="timeline-meta">
                {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
            <p className="card-subtitle">
              {m.name} · <a href={`mailto:${m.email}`}>{m.email}</a>
            </p>
            <p className="card-text admin-msg-body">{m.message}</p>
            <div className="admin-msg-actions">
              {!m.is_read && (
                <button className="btn btn-ghost" type="button" onClick={() => markRead(m.id)}>
                  Mark read
                </button>
              )}
              <button className="btn btn-ghost admin-delete" type="button" onClick={() => remove(m.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => window.sessionStorage.getItem(TOKEN_KEY));

  return (
    <main id="main" className="admin-page">
      <div className="container">
        {token ? (
          <Inbox token={token} onLogout={() => setToken(null)} />
        ) : (
          <LoginForm onLogin={setToken} />
        )}
      </div>
    </main>
  );
}
