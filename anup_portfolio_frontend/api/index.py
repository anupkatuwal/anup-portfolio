# api/index.py — FastAPI backend running as a Vercel Python serverless function
import os
from datetime import datetime, timedelta
from typing import List, Optional, Generator

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from mangum import Mangum

# ── Database ──────────────────────────────────────────────────────────────────
DB_PATH = os.getenv("DB_PATH", "/tmp/portfolio.db")
engine = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False},
)

@event.listens_for(engine, "connect")
def enable_fk(dbapi_conn, _):
    dbapi_conn.cursor().execute("PRAGMA foreign_keys=ON")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ── Models ────────────────────────────────────────────────────────────────────
class Project(Base):
    __tablename__ = "projects"
    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack  = Column(String(255), nullable=True)
    github_link = Column(String(255), nullable=True)
    live_link   = Column(String(255), nullable=True)
    image_url   = Column(String(255), nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(200), nullable=False)
    email      = Column(String(200), nullable=False)
    subject    = Column(String(250), nullable=False)
    message    = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# ── Auth ──────────────────────────────────────────────────────────────────────
SECRET_KEY        = os.getenv("SECRET_KEY") or os.urandom(32).hex()
ALGORITHM         = "HS256"
TOKEN_EXPIRE_MINS = 60
# Admin credentials must be provided via env vars; no insecure defaults.
ADMIN_USERNAME    = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD    = os.getenv("ADMIN_PASSWORD")

pwd_ctx        = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme  = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def make_token(data: dict) -> str:
    payload = {**data, "exp": datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINS)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def current_admin(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Schemas ───────────────────────────────────────────────────────────────────
class ProjectCreate(BaseModel):
    title:       str
    description: str
    tech_stack:  Optional[str] = None
    github_link: Optional[str] = None
    live_link:   Optional[str] = None
    image_url:   Optional[str] = None

class ProjectResponse(ProjectCreate):
    id:         int
    created_at: datetime
    model_config = {"from_attributes": True}

class ContactCreate(BaseModel):
    name:    str
    email:   EmailStr
    subject: str
    message: str

class ContactResponse(ContactCreate):
    id:         int
    created_at: datetime
    model_config = {"from_attributes": True}

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Anup Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://anup-portfolio-one.vercel.app",
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes: health ────────────────────────────────────────────────────────────
@app.get("/api")
def health():
    return {"status": "ok", "message": "Anup Portfolio API"}

# ── Routes: auth ──────────────────────────────────────────────────────────────
@app.post("/api/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    # If env vars are not configured, admin login is disabled entirely.
    if not ADMIN_USERNAME or not ADMIN_PASSWORD:
        raise HTTPException(status_code=503, detail="Admin login is not configured on this deployment")
    if form.username != ADMIN_USERNAME or form.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": make_token({"sub": form.username}), "token_type": "bearer"}

# ── Routes: projects ──────────────────────────────────────────────────────────
@app.get("/api/projects", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.created_at.desc()).all()

@app.post("/api/projects", response_model=ProjectResponse)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db), _: str = Depends(current_admin)):
    obj = Project(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@app.put("/api/projects/{pid}", response_model=ProjectResponse)
def update_project(pid: int, payload: ProjectCreate, db: Session = Depends(get_db), _: str = Depends(current_admin)):
    obj = db.query(Project).filter(Project.id == pid).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Project not found")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/api/projects/{pid}")
def delete_project(pid: int, db: Session = Depends(get_db), _: str = Depends(current_admin)):
    obj = db.query(Project).filter(Project.id == pid).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(obj)
    db.commit()
    return {"message": "Deleted"}

# ── Routes: contact ───────────────────────────────────────────────────────────
@app.post("/api/contact", response_model=ContactResponse)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    obj = ContactMessage(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@app.get("/api/admin/contacts", response_model=List[ContactResponse])
def list_contacts(db: Session = Depends(get_db), _: str = Depends(current_admin)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()

@app.delete("/api/admin/contacts/{cid}")
def delete_contact(cid: int, db: Session = Depends(get_db), _: str = Depends(current_admin)):
    obj = db.query(ContactMessage).filter(ContactMessage.id == cid).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(obj)
    db.commit()
    return {"message": "Deleted"}

# ── Vercel handler ────────────────────────────────────────────────────────────
handler = Mangum(app, lifespan="off")
