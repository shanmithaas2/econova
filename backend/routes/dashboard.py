from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import User, WasteReport, PickupRequest, Complaint, CarbonLog, Activity
from jose import jwt
import os

router = APIRouter()

def get_user_id(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload["id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/citizen")
def citizen_dashboard(db: Session = Depends(get_db), user_id: int = Depends(get_user_id)):
    user = db.query(User).filter(User.id == user_id).first()

    total_waste = db.query(func.sum(WasteReport.quantity_kg)).filter(
        WasteReport.user_id == user_id).scalar() or 0

    total_carbon = db.query(func.sum(CarbonLog.carbon_saved)).filter(
        CarbonLog.user_id == user_id).scalar() or 0

    activities = db.query(Activity).filter(
        Activity.user_id == user_id
    ).order_by(Activity.created_at.desc()).limit(5).all()

    return {
        "name": user.name,
        "waste_recycled": round(total_waste, 2),
        "carbon_saved": round(total_carbon, 2),
        "reward_points": user.reward_points,
        "eco_score": user.eco_score,
        "activities": [
            {
                "action": a.action,
                "description": a.description,
                "created_at": str(a.created_at)
            }
            for a in activities
        ]
    }

@router.get("/admin")
def admin_dashboard(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar()
    total_reports = db.query(func.count(WasteReport.id)).scalar()
    total_pickups = db.query(func.count(PickupRequest.id)).scalar()
    total_complaints = db.query(func.count(Complaint.id)).scalar()
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(100).all()

    return {
        "total_users": total_users,
        "total_reports": total_reports,
        "total_pickups": total_pickups,
        "total_complaints": total_complaints,
        "recent_users": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "created_at": str(u.created_at)
            }
            for u in recent_users
        ]
    }

@router.get("/municipal")
def municipal_dashboard(db: Session = Depends(get_db)):
    pending = db.query(func.count(PickupRequest.id)).filter(
        PickupRequest.status == "Pending").scalar()
    active = db.query(func.count(PickupRequest.id)).filter(
        PickupRequest.status == "Assigned").scalar()
    completed = db.query(func.count(PickupRequest.id)).filter(
        PickupRequest.status == "Completed").scalar()
    complaints = db.query(func.count(Complaint.id)).filter(
        Complaint.status == "Open").scalar()

    return {
        "pending_pickups": pending,
        "active_pickups": active,
        "completed_pickups": completed,
        "pending_complaints": complaints,
    }

@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).filter(
        User.role == "citizen"
    ).order_by(User.reward_points.desc()).limit(10).all()

    return [
        {
            "rank": i + 1,
            "name": u.name,
            "points": u.reward_points,
            "eco_score": u.eco_score
        }
        for i, u in enumerate(users)
    ]