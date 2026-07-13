"""Backend tests for the FastAPI app (api/index.py).

Run from the api/ directory:  pytest -q
Uses a local SQLite DB and dummy secrets so nothing external is touched.
RESEND_API_KEY is intentionally left unset so no real email is sent.
"""
import os

# Configure env BEFORE importing the app — it builds the DB engine at import time.
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_portfolio.db")
os.environ.setdefault("SECRET_KEY", "test-secret-key-at-least-32-bytes-long-0123456789")
os.environ.setdefault("ADMIN_USERNAME", "admin")

import bcrypt  # noqa: E402

os.environ.setdefault(
    "ADMIN_PASSWORD_HASH",
    bcrypt.hashpw(b"testpass", bcrypt.gensalt()).decode(),
)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

import index  # noqa: E402

client = TestClient(index.app)


@pytest.fixture(autouse=True)
def _isolate():
    """Disable rate limiting and start each test with empty tables."""
    index.RATE_LIMIT_ENABLED = False
    db = index.SessionLocal()
    try:
        db.query(index.ContactMessage).delete()
        db.query(index.RateLimitHit).delete()
        db.query(index.AdminCredential).delete()  # back to env-var password
        db.commit()
    finally:
        db.close()
    yield


def _login(password="testpass"):
    r = client.post("/api/auth/login", data={"username": "admin", "password": password})
    return r.json().get("access_token") if r.status_code == 200 else None


def _payload(**over):
    p = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "subject": "Hello",
        "message": "This is a sufficiently long message.",
        "company": "",
    }
    p.update(over)
    return p


def _count():
    db = index.SessionLocal()
    try:
        return db.query(index.ContactMessage).count()
    finally:
        db.close()


# ── health ──────────────────────────────────────────────────────────────────

def test_health_ok():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_content_is_edge_cached():
    # The public content endpoint must be CDN-cached so visitors don't each
    # pay a serverless cold start (perf regression guard).
    r = client.get("/api/content")
    assert r.status_code == 200
    assert "s-maxage" in r.headers.get("cache-control", "")


# ── contact form ────────────────────────────────────────────────────────────

def test_contact_happy_path_saves_message():
    r = client.post("/api/contact", json=_payload())
    assert r.status_code == 200
    assert r.json() == {"ok": True}
    assert _count() == 1


def test_contact_honeypot_discards_silently():
    r = client.post("/api/contact", json=_payload(company="bot-filled"))
    assert r.status_code == 200          # bot gets a fake success...
    assert r.json() == {"ok": True}
    assert _count() == 0                 # ...but nothing is saved


def test_contact_rejects_short_message():
    r = client.post("/api/contact", json=_payload(message="short"))
    assert r.status_code == 422


def test_contact_rejects_invalid_email():
    r = client.post("/api/contact", json=_payload(email="not-an-email"))
    assert r.status_code == 422


# ── auth ────────────────────────────────────────────────────────────────────

def test_login_wrong_password_401():
    r = client.post("/api/auth/login", data={"username": "admin", "password": "nope"})
    assert r.status_code == 401


def test_login_success_returns_token_and_unlocks_admin():
    r = client.post("/api/auth/login", data={"username": "admin", "password": "testpass"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    assert token

    r2 = client.get("/api/admin/messages", headers={"Authorization": f"Bearer {token}"})
    assert r2.status_code == 200
    assert isinstance(r2.json(), list)


def test_admin_requires_token():
    assert client.get("/api/admin/messages").status_code == 401


# ── change password ───────────────────────────────────────────────────────────

def test_change_password_requires_auth():
    r = client.post("/api/admin/password",
                    json={"current_password": "testpass", "new_password": "brandnew123"})
    assert r.status_code == 401


def test_change_password_wrong_current_is_401():
    token = _login()
    r = client.post("/api/admin/password",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"current_password": "WRONG", "new_password": "brandnew123"})
    assert r.status_code == 401


def test_change_password_rejects_short_new():
    token = _login()
    r = client.post("/api/admin/password",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"current_password": "testpass", "new_password": "short"})
    assert r.status_code == 422  # Pydantic min_length


def test_change_password_rejects_same_password():
    token = _login()
    r = client.post("/api/admin/password",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"current_password": "testpass", "new_password": "testpass"})
    assert r.status_code == 400


def test_change_password_happy_path_switches_credential():
    token = _login()
    r = client.post("/api/admin/password",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"current_password": "testpass", "new_password": "brandnew123"})
    assert r.status_code == 200

    # New password now works; the old env-var password no longer does.
    assert _login("brandnew123") is not None
    assert _login("testpass") is None


def test_admin_rejects_garbage_token():
    r = client.get("/api/admin/messages", headers={"Authorization": "Bearer not.a.real.token"})
    assert r.status_code == 401


# ── security: email HTML-injection escaping ─────────────────────────────────

def test_notify_escapes_html(monkeypatch):
    """The contact-form notification must escape user input (no HTML injection)."""
    captured = {}
    monkeypatch.setattr(index, "RESEND_API_KEY", "test-key")
    import resend
    monkeypatch.setattr(
        resend.Emails, "send",
        lambda payload: captured.update(payload) or {"id": "x"},
    )
    msg = index.ContactMessage(
        name="<b>x</b>", email="e@e.com", subject="<script>",
        message="<img src=x onerror=alert(1)>",
    )
    index._notify(msg)
    # No raw tags survive — they're escaped to inert text, so nothing executes.
    assert "<script>" not in captured["html"]
    assert "&lt;script&gt;" in captured["html"]
    assert "<img" not in captured["html"]
    assert "&lt;img" in captured["html"]


def test_notify_routes_to_inbox_with_visitor_reply_to(monkeypatch):
    """Notifications go to the configured inbox, with the visitor as Reply-To
    so hitting reply in the mail client answers them directly."""
    captured = {}
    monkeypatch.setattr(index, "RESEND_API_KEY", "test-key")
    import resend
    monkeypatch.setattr(
        resend.Emails, "send",
        lambda payload: captured.update(payload) or {"id": "x"},
    )
    msg = index.ContactMessage(
        name="Jane", email="jane@example.com", subject="Hello",
        message="A perfectly ordinary message.",
    )
    index._notify(msg)
    assert captured["to"] == [index.NOTIFY_TO]
    assert captured["reply_to"] == "jane@example.com"
    assert captured["from"] == index.NOTIFY_FROM


# ── rate limiting ───────────────────────────────────────────────────────────

def test_contact_rate_limited_after_five():
    index.RATE_LIMIT_ENABLED = True
    try:
        codes = [client.post("/api/contact", json=_payload()).status_code for _ in range(6)]
    finally:
        index.RATE_LIMIT_ENABLED = False
    assert codes[:5] == [200, 200, 200, 200, 200]
    assert codes[5] == 429


def test_login_rate_limited_after_five():
    # The DB-backed limiter is the durable backstop for brute-force login
    # attempts (the edge WAF rule covers short bursts); the 6th try is capped
    # before the password is even checked.
    index.RATE_LIMIT_ENABLED = True
    try:
        codes = [
            client.post(
                "/api/auth/login", data={"username": "admin", "password": "nope"}
            ).status_code
            for _ in range(6)
        ]
    finally:
        index.RATE_LIMIT_ENABLED = False
    assert codes[:5] == [401, 401, 401, 401, 401]
    assert codes[5] == 429
