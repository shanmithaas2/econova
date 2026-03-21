from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Complaint, Activity, User
from jose import jwt
import os
import threading
from email_service import email_complaint_resolved

router = APIRouter()

def get_user_id(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload["id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

class ComplaintData(BaseModel):
    description: str
    location: str
    complaint_type: str

@router.post("/submit")
def submit_complaint(data: ComplaintData, db: Session = Depends(get_db), user_id: int = Depends(get_user_id)):
    complaint = Complaint(
        user_id=user_id,
        description=f"[{data.complaint_type}] {data.description}",
        location=data.location,
        status="Open"
    )
    db.add(complaint)

    activity = Activity(
        user_id=user_id,
        action="complaint_submitted",
        description=f"Submitted complaint: {data.complaint_type} at {data.location}"
    )
    db.add(activity)
    db.commit()
    return {"message": "Complaint submitted successfully", "complaint_id": complaint.id}

@router.get("/my-complaints")
def get_my_complaints(db: Session = Depends(get_db), user_id: int = Depends(get_user_id)):
    complaints = db.query(Complaint).filter(
        Complaint.user_id == user_id
    ).order_by(Complaint.created_at.desc()).all()

    return [
        {
            "id": c.id,
            "description": c.description,
            "location": c.location,
            "status": c.status,
            "created_at": str(c.created_at)
        }
        for c in complaints
    ]

@router.get("/all")
def get_all_complaints(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    return [
        {
            "id": c.id,
            "user_id": c.user_id,
            "description": c.description,
            "location": c.location,
            "status": c.status,
            "created_at": str(c.created_at)
        }
        for c in complaints
    ]

@router.put("/update-status/{complaint_id}")
def update_status(complaint_id: int, status: str, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = status

    # Send email when complaint is resolved
    if status == "Resolved":
        user = db.query(User).filter(User.id == complaint.user_id).first()
        if user:
            threading.Thread(
                target=email_complaint_resolved,
                args=(user.email, user.name, complaint.description)
            ).start()

    db.commit()
    return {"message": f"Status updated to {status}"}