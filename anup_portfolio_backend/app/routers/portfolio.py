# app/routers/portfolio.py

from fastapi import APIRouter
from typing import List

from app.schemas import (
    Profile,
    Skill,
    Experience,
    Education
)

router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"]
)

# ----------- STATIC DATA FOR NOW -----------

PROFILE_DATA = Profile(
    name="Anup Katuwal",
    title="Graduate Student | Aspiring Data Analyst",
    tagline="Turning data into meaningful insights",
    location="Kathmandu, Nepal",
    summary="Passionate about data analytics, AI, and building intelligent systems. Currently completing my Master's in CIS.",
    social={
        "github": "https://github.com/anupkatuwal",
        "linkedin": "https://linkedin.com/in/anupkatuwal",
        "email": "example@email.com",
        "website": None
    }
)

SKILLS_DATA: List[Skill] = [
    Skill(name="Python", level="Intermediate", category="Programming"),
    Skill(name="FastAPI", level="Intermediate", category="Backend"),
    Skill(name="React", level="Beginner", category="Frontend"),
    Skill(name="SQL", level="Advanced", category="Database"),
]

EXPERIENCE_DATA: List[Experience] = [
    Experience(
        company="NCIT / Pokhara University",
        role="Graduate Student",
        start_year=2023,
        end_year=None,
        location="Kathmandu, Nepal",
        description="Conducting research in NLP and AI; focusing on sentiment analysis and bias mitigation."
    ),
]

EDUCATION_DATA: List[Education] = [
    Education(
        institution="Columbia College, Denver USA",
        degree="Bachelor of Science",
        field="Computer Information Systems",
        start_year=2010,
        end_year=2014,
        location="Denver, USA",
        details="Completed undergraduate studies."
    ),
]


# ----------- ENDPOINTS -----------

@router.get("/profile", response_model=Profile)
def get_profile():
    return PROFILE_DATA


@router.get("/skills", response_model=List[Skill])
def get_skills():
    return SKILLS_DATA


@router.get("/experience", response_model=List[Experience])
def get_experience():
    return EXPERIENCE_DATA


@router.get("/education", response_model=List[Education])
def get_education():
    return EDUCATION_DATA
