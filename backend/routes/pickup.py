from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import PickupRequest, Activity, User
from jose import jwt
from typing import Optional
import os
import threading
from email_service import email_pickup_scheduled

router = APIRouter()

def get_user_id(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload["id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

class PickupData(BaseModel):
    waste_type: str
    quantity_kg: float
    location: str
    preferred_date: str
    notes: Optional[str] = ""

@router.post("/schedule")
def schedule_pickup(data: PickupData, db: Session = Depends(get_db), user_id: int = Depends(get_user_id)):
    pickup = PickupRequest(
        user_id=user_id,
        waste_type=data.waste_type,
        quantity_kg=data.quantity_kg,
        location=data.location,
        preferred_date=data.preferred_date,
        status="Pending"
    )
    db.add(pickup)

    activity = Activity(
        user_id=user_id,
        action="pickup_scheduled",
        description=f"Scheduled pickup for {data.quantity_kg}kg of {data.waste_type}"
    )
    db.add(activity)

    user = db.query(User).filter(User.id == user_id).first()
    user.reward_points += 10
    db.commit()

    # Capture values before thread
    user_email = user.email
    user_name = user.name
    waste_type = data.waste_type
    preferred_date = data.preferred_date
    location = data.location

    # Send confirmation email in background
    def send_pickup_email():
        try:
            email_pickup_scheduled(user_email, user_name, waste_type, preferred_date, location)
            print(f"Pickup email sent to {user_email}")
        except Exception as e:
            print(f"Pickup email failed: {e}")

    threading.Thread(target=send_pickup_email).start()

    return {"message": "Pickup scheduled successfully", "pickup_id": pickup.id}

@router.get("/my-pickups")
def get_my_pickups(db: Session = Depends(get_db), user_id: int = Depends(get_user_id)):
    pickups = db.query(PickupRequest).filter(
        PickupRequest.user_id == user_id
    ).order_by(PickupRequest.created_at.desc()).all()

    return [
        {
            "id": p.id,
            "waste_type": p.waste_type,
            "quantity_kg": p.quantity_kg,
            "location": p.location,
            "preferred_date": str(p.preferred_date),
            "status": p.status,
            "created_at": str(p.created_at)
        }
        for p in pickups
    ]

@router.get("/all")
def get_all_pickups(db: Session = Depends(get_db)):
    pickups = db.query(PickupRequest).order_by(PickupRequest.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "waste_type": p.waste_type,
            "quantity_kg": p.quantity_kg,
            "location": p.location,
            "preferred_date": str(p.preferred_date),
            "status": p.status,
            "created_at": str(p.created_at)
        }
        for p in pickups
    ]

@router.put("/update-status/{pickup_id}")
def update_pickup_status(pickup_id: int, status: str, db: Session = Depends(get_db)):
    pickup = db.query(PickupRequest).filter(PickupRequest.id == pickup_id).first()
    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup not found")
    pickup.status = status
    db.commit()
    return {"message": f"Status updated to {status}"}