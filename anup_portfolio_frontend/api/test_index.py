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

from passlib.context import CryptContext  # noqa: E402

os.environ.setdefault(
    "ADMIN_PASSWORD_HASH",
    CryptContext(schemes=["bcrypt"], deprecated="auto").hash("testpass"),
)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

import index  # noqa: E402

client = TestClient(index.app)


@pytest.fixture(autouse=True)
def _isolate():
    """Disable rate limiting and start each test with an empty messages table."""
    index.limiter.enabled = False
    db = index.SessionLocal()
    try:
        db.query(index.ContactMessage).delete()
        db.commit()
    finally:
        db.close()
    yield


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


# ── rate limiting ───────────────────────────────────────────────────────────

def test_contact_rate_limited_after_five(monkeypatch):
    index.limiter.enabled = True
    try:
        codes = [client.post("/api/contact", json=_payload()).status_code for _ in range(6)]
    finally:
        index.limiter.enabled = False
    assert codes[:5] == [200, 200, 200, 200, 200]
    assert codes[5] == 429
