# app/schemas.py

from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# ---------- Portfolio Profile & Content Schemas ----------

class SocialLinks(BaseModel):
    github: Optional[str] = None
    linkedin: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None


class Profile(BaseModel):
    name: str
    title: str
    tagline: str
    location: str
    summary: str
    social: SocialLinks


class Skill(BaseModel):
    name: str
    level: str        # e.g. "Beginner", "Intermediate", "Advanced"
    category: str     # e.g. "Programming", "Data", "Soft Skill"


class Experience(BaseModel):
    company: str
    role: str
    start_year: int
    end_year: Optional[int]  # None if current
    location: str
    description: str


class Education(BaseModel):
    institution: str
    degree: str
    field: str
    start_year: int
    end_year: int
    location: str
    details: Optional[str] = None


# ---------- Contact Schemas (DB-backed) ----------

class ContactBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactCreate(ContactBase):
    """
    Data required to create a contact message (request body).
    """
    pass


class ContactResponse(ContactBase):
    """
    Data returned when reading a contact message from the API.
    """
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# ---------- Project Schemas (DB-backed) ----------

class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: Optional[str] = None       # stored as a string in DB, e.g. "FastAPI, React"
    github_link: Optional[str] = None
    live_link: Optional[str] = None
    image_url: Optional[str] = None        # URL to thumbnail (e.g. "/media/projects/...")


class ProjectCreate(ProjectBase):
    """
    Data required to create a project (request body).
    """
    pass


class ProjectResponse(ProjectBase):
    """
    Data returned when reading a project from the API (response model).
    """
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
