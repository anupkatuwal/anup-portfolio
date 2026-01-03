# app/database.py

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Generator

# -----------------------------------------
# Database Configuration
# -----------------------------------------

# SQLite DB file will be created in project root as: portfolio.db
import os

DB_PATH = os.getenv("DB_PATH", "portfolio.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"


# For SQLite, we must disable thread checking
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# Enable SQLite Foreign Key constraints (good practice)
@event.listens_for(engine, "connect")
def enable_sqlite_fk(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# -----------------------------------------
# Session Factory
# -----------------------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# -----------------------------------------
# Base ORM Class
# -----------------------------------------
Base = declarative_base()

# -----------------------------------------
# Dependency: Database Session
# -----------------------------------------
def get_db() -> Generator:
    """Provides a database session to routes and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
