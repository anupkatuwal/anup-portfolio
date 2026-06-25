# api/index.py — FastAPI backend, run directly by Vercel's Python runtime.
# Stores contact-form messages in Neon Postgres; admin endpoints are JWT-gated.
# Projects/skills/etc. are NOT here — they live in src/data/content.js.

import html
import json as _json
import logging
import os
import re
import resend
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Body, Depends, FastAPI, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy import JSON, Boolean, DateTime, Integer, String, Text, create_engine, select, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session, sessionmaker
from sqlalchemy.pool import NullPool

logger = logging.getLogger("portfolio-api")

# ── Config ────────────────────────────────────────────────────────────────────

SECRET_KEY = os.environ.get("SECRET_KEY", "")
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "")
ADMIN_PASSWORD_HASH = os.environ.get("ADMIN_PASSWORD_HASH", "")
JWT_ALGORITHM = "HS256"
JWT_TTL_HOURS = 12

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
NOTIFY_TO = "katuwalanup@gmail.com"
NOTIFY_FROM = "Portfolio Contact <onboarding@resend.dev>"

# ── Database ──────────────────────────────────────────────────────────────────

def _database_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://"):]
    return url


# Serverless: no connection pooling across invocations — Neon's pgbouncer
# (-pooler endpoint) does the pooling server-side.
engine = create_engine(_database_url(), poolclass=NullPool, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    subject: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class SiteContent(Base):
    # Single-row document store: the entire editable site content (projects,
    # skills, resume, etc.) lives as one JSON blob, keyed by CONTENT_KEY. The
    # frontend falls back to its bundled defaults whenever this is absent, so
    # the public site can never go blank if the DB is empty or unreachable.
    __tablename__ = "site_content"

    key: Mapped[str] = mapped_column(String(50), primary_key=True)
    data: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


try:
    Base.metadata.create_all(engine)
except Exception as exc:  # DB unreachable at cold start — /api/health will report it
    logger.error("startup.create_all_failed: %s", exc)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── App / rate limiting ───────────────────────────────────────────────────────

def client_ip(request: Request) -> str:
    # Prefer x-real-ip: on Vercel the platform sets it to the true client IP
    # and overwrites any caller-supplied value, so it can't be spoofed to
    # rotate the rate-limit key. x-forwarded-for's leftmost entry IS caller-
    # controllable, so only use it as a fallback (e.g. behind other proxies);
    # request.client.host covers local dev where neither header is set.
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


limiter = Limiter(key_func=client_ip)

app = FastAPI(title="anup-portfolio API", docs_url=None, redoc_url=None)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Same-origin in production; CORS only for the Vite dev server.
if not os.environ.get("VERCEL"):
    from fastapi.middleware.cors import CORSMiddleware

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

# ── Auth ──────────────────────────────────────────────────────────────────────

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def require_admin(token: str = Depends(oauth2_scheme)) -> str:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise credentials_error
    username = payload.get("sub")
    if not username or username != ADMIN_USERNAME:
        raise credentials_error
    return username


# ── Schemas ───────────────────────────────────────────────────────────────────

class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=10, max_length=5000)
    company: str = ""  # honeypot — humans never see this field


class MessageOut(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime
    is_read: bool

    model_config = {"from_attributes": True}


# ── Email notification ────────────────────────────────────────────────────────

def _notify(msg: ContactMessage) -> None:
    if not RESEND_API_KEY:
        logger.warning(
            "notify.skipped: RESEND_API_KEY not set (message id=%s saved, no email sent)",
            msg.id,
        )
        return
    try:
        resend.api_key = RESEND_API_KEY
        # Escape all user-supplied fields — the contact form is public, so a
        # submitter could otherwise inject arbitrary HTML into this email.
        safe_name = html.escape(msg.name)
        safe_email = html.escape(msg.email)
        safe_subject = html.escape(msg.subject)
        body = html.escape(msg.message).replace("\n", "<br>")
        resend.Emails.send({
            "from": NOTIFY_FROM,
            "to": [NOTIFY_TO],
            "reply_to": msg.email,
            "subject": f"[Portfolio] {msg.name} — {msg.subject}",
            "html": (
                f"<p><strong>From:</strong> {safe_name} &lt;{safe_email}&gt;</p>"
                f"<p><strong>Subject:</strong> {safe_subject}</p>"
                f"<hr/><p>{body}</p>"
                f"<hr/><p style='color:#888;font-size:12px'>"
                f"Sent via anup-katuwal.com.np contact form</p>"
            ),
        })
    except Exception as exc:
        # Don't fail the request (the message is already saved), but make the
        # failure loud in logs so a broken notification pipeline is noticeable.
        logger.error("notify.failed: message id=%s did not send: %s", msg.id, exc)


# ── Endpoints ─────────────────────────────────────────────────────────────────

# ── Site content (CMS) ────────────────────────────────────────────────────────

CONTENT_KEY = "default"
MAX_CONTENT_BYTES = 512_000  # generous cap; the whole site doc is a few KB

# Only these object keys are ever rendered as href targets on the public site.
# Anything stored there must be a safe scheme so a saved doc can't smuggle a
# javascript:/data: URL into a link (defense in depth — only the authenticated
# admin can write, but we never want a stored value to become an XSS vector).
_URL_FIELDS = {"github", "live", "link"}
_SAFE_URL = re.compile(r"^(https?://|mailto:|/)", re.IGNORECASE)


def _validate_content(node, depth=0):
    if depth > 12:
        raise HTTPException(status_code=400, detail="Content nested too deeply")
    if isinstance(node, dict):
        for key, value in node.items():
            if key in _URL_FIELDS and isinstance(value, str):
                stripped = value.strip()
                if stripped and not _SAFE_URL.match(stripped):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Unsafe URL in field '{key}'. Use http(s)://, mailto:, or a /relative path.",
                    )
            _validate_content(value, depth + 1)
    elif isinstance(node, list):
        for item in node:
            _validate_content(item, depth + 1)


@app.get("/api/content")
def get_content(db: Session = Depends(get_db)):
    """Public: the stored site content, or {} so the frontend uses its defaults."""
    row = db.get(SiteContent, CONTENT_KEY)
    return row.data if row else {}


@app.put("/api/content")
def put_content(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    _admin: str = Depends(require_admin),
):
    """Admin: replace the entire site content document."""
    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="Content must be a JSON object")
    if len(_json.dumps(payload)) > MAX_CONTENT_BYTES:
        raise HTTPException(status_code=413, detail="Content too large")
    _validate_content(payload)

    row = db.get(SiteContent, CONTENT_KEY)
    if row:
        row.data = payload
    else:
        db.add(SiteContent(key=CONTENT_KEY, data=payload))
    db.commit()
    return {"ok": True}


@app.get("/api/health")
def health():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        return {"status": "degraded", "database": "unreachable"}


@app.post("/api/contact")
@limiter.limit("5/hour")
def submit_contact(request: Request, payload: ContactIn, db: Session = Depends(get_db)):
    if payload.company.strip():
        return {"ok": True}  # bot filled the honeypot — pretend success, save nothing

    msg = ContactMessage(
        name=payload.name.strip(),
        email=payload.email,
        subject=payload.subject.strip(),
        message=payload.message.strip(),
    )
    db.add(msg)
    db.commit()
    _notify(msg)
    return {"ok": True}


@app.post("/api/auth/login")
@limiter.limit("5/15minutes")
def login(request: Request, form: OAuth2PasswordRequestForm = Depends()):
    if not (SECRET_KEY and ADMIN_USERNAME and ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=503, detail="Auth is not configured")

    username_ok = form.username == ADMIN_USERNAME
    # Always run the hash check so response timing doesn't leak whether the
    # username was right.
    password_ok = pwd_context.verify(form.password, ADMIN_PASSWORD_HASH)
    if not (username_ok and password_ok):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    expires = datetime.now(timezone.utc) + timedelta(hours=JWT_TTL_HOURS)
    token = jwt.encode({"sub": ADMIN_USERNAME, "exp": expires}, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}


@app.get("/api/admin/messages", response_model=list[MessageOut])
def list_messages(db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    rows = db.execute(
        select(ContactMessage).order_by(ContactMessage.created_at.desc())
    ).scalars().all()
    return rows


@app.patch("/api/admin/messages/{message_id}/read", response_model=MessageOut)
def mark_read(message_id: int, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    msg = db.get(ContactMessage, message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    return msg


@app.delete("/api/admin/messages/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    msg = db.get(ContactMessage, message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"ok": True}
