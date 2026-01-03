# app/main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app import models
from app.auth import router as auth_router
from app.routers import projects, portfolio
from app.schemas import ContactCreate, ContactResponse  # <- NEW IMPORT
from app.routers import admin_contacts

# ---------- Database Initialization ----------

# Create all tables (Admin, Project, ContactMessage, etc.) if they do not exist
Base.metadata.create_all(bind=engine)


# ---------- FastAPI App ----------

app = FastAPI(
    title="Anup Portfolio Backend",
    version="1.0.0",
    description="Backend API for Anup's personal portfolio.",
)

origins = [
    "http://localhost:5173",
    "https://your-portfolio.vercel.app",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Health Check ----------

@app.get("/")
def read_root():
    return {"message": "Anup Portfolio API is running"}


# ---------- Contact Endpoint ----------

@app.post("/contact", response_model=ContactResponse)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    contact = models.ContactMessage(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact   # Will be serialized using ContactResponse


# ---------- Routers ----------

app.include_router(auth_router)        # /auth/...
app.include_router(projects.router)    # /projects/...
app.include_router(portfolio.router)   # /portfolio/...
app.include_router(admin_contacts.router) 