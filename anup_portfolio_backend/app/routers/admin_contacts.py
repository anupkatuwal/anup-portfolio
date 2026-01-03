# app/routers/admin_contacts.py

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ContactMessage
from app.auth import get_current_admin
from app.schemas import ContactResponse  # we defined this in schemas.py

router = APIRouter(
    prefix="/admin/contacts",
    tags=["Admin Contacts"],
)


@router.get("/", response_model=List[ContactResponse])
def list_contacts(
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin),
):
    """
    Return all contact messages ordered by newest first.
    Only accessible to admin.
    """
    contacts = (
        db.query(ContactMessage)
        .order_by(ContactMessage.created_at.desc())
        .all()
    )
    return contacts


@router.delete("/{contact_id}")
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin),
):
    """
    Delete a specific contact message by ID.
    Only accessible to admin.
    """
    contact = (
        db.query(ContactMessage)
        .filter(ContactMessage.id == contact_id)
        .first()
    )

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found",
        )

    db.delete(contact)
    db.commit()
    return {"message": "Contact message deleted successfully"}
