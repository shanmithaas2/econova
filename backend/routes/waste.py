from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import WasteReport, User, CarbonLog, Activity
from jose import jwt
from fastapi import Header
import os

router = APIRouter()

WASTE_GUIDE = {
    "Plastic":       {"points": 20, "carbon": 0.3},
    "Glass":         {"points": 15, "carbon": 0.3},
    "Paper":         {"points": 10, "carbon": 0.9},
    "Metal":         {"points": 25, "carbon": 0.4},
    "Food Waste":    {"points": 10, "carbon": 0.5},
    "E-Waste":       {"points": 40, "carbon": 2.0},
    "Battery":       {"points": 30, "carbon": 1.5},
    "Clothes":       {"points": 15, "carbon": 0.6},
    "Medical Waste": {"points": 35, "carbon": 1.8},
}

def get_user_id(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload["id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

class WasteData(BaseModel):
    waste_type: str
    quantity_kg: float
    location: str

@router.post("/report")
def report_waste(data: WasteData, db: Session = Depends(get_db), user_id: int = Depends(get_user_id)):
    guide = WASTE_GUIDE.get(data.waste_type)
    if not guide:
        raise HTTPException(status_code=400, detail="Invalid waste type")

    carbon_saved = round(guide["carbon"] * data.quantity_kg, 2)
    points_earned = guide["points"]

    # Save waste report
    report = WasteReport(
        user_id=user_id,
        waste_type=data.waste_type,
        quantity_kg=data.quantity_kg,
        location=data.location,
        carbon_saved=carbon_saved,
        points_earned=points_earned
    )
    db.add(report)

    # Save carbon log
    carbon_log = CarbonLog(
        user_id=user_id,
        waste_type=data.waste_type,
        quantity_kg=data.quantity_kg,
        carbon_saved=carbon_saved
    )
    db.add(carbon_log)

    # Update user points and eco score
    user = db.query(User).filter(User.id == user_id).first()
    user.reward_points += points_earned
    user.eco_score = min(100, user.eco_score + 2)

    # Log activity
    activity = Activity(
        user_id=user_id,
        action="waste_report",
        description=f"Reported {data.quantity_kg}kg of {data.waste_type} waste"
    )
    db.add(activity)
    db.commit()

    return {
        "message": "Waste reported successfully",
        "carbon_saved": carbon_saved,
        "points_earned": points_earned,
        "total_points": user.reward_points
    }

@router.get("/my-reports")
def get_my_reports(db: Session = Depends(get_db), user_id: int = Depends(get_user_id)):
    reports = db.query(WasteReport).filter(
        WasteReport.user_id == user_id
    ).order_by(WasteReport.created_at.desc()).all()

    return [
        {
            "id": r.id,
            "waste_type": r.waste_type,
            "quantity_kg": r.quantity_kg,
            "location": r.location,
            "carbon_saved": r.carbon_saved,
            "points_earned": r.points_earned,
            "created_at": str(r.created_at)
        }
        for r in reports
    ]

@router.get("/all")
def get_all_reports(db: Session = Depends(get_db)):
    reports = db.query(WasteReport).order_by(WasteReport.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "waste_type": r.waste_type,
            "quantity_kg": r.quantity_kg,
            "carbon_saved": r.carbon_saved,
            "points_earned": r.points_earned,
            "created_at": str(r.created_at)
        }
        for r in reports
    ]