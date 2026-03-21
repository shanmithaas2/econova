from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import PickupRequest, User
from ml.route_optimizer import optimize_routes

router = APIRouter()

@router.get("/optimize")
def get_optimized_routes(num_vehicles: int = 3, db: Session = Depends(get_db)):
    # Get all pending and assigned pickups
    pickups = db.query(PickupRequest).filter(
        PickupRequest.status.in_(["Pending", "Assigned"])
    ).all()

    if not pickups:
        return {"routes": [], "message": "No pending pickups to optimize"}

    pickup_data = []
    for p in pickups:
        user = db.query(User).filter(User.id == p.user_id).first()
        pickup_data.append({
            "id": p.id,
            "location": p.location,
            "waste_type": p.waste_type,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "citizen_name": user.name if user else "Citizen"
        })

    routes = optimize_routes(pickup_data, num_vehicles)
    return {
        "routes": routes,
        "total_pickups": len(pickups),
        "vehicles": len(routes)
    }