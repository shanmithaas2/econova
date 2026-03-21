from fastapi import APIRouter, Header, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends
from database import get_db
from models import User
from pydantic import BaseModel
from typing import Optional
import os, jwt
from datetime import datetime

router = APIRouter()

def get_user_id(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload["id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# In-memory listings store (no new DB table needed)
listings = []
listing_id_counter = [1]

class ListingCreate(BaseModel):
    waste_type: str
    quantity_kg: float
    price_per_kg: float
    location: str
    description: Optional[str] = ""

@router.get("/listings")
def get_listings():
    active = [l for l in listings if l["status"] == "Available"]
    return active

@router.post("/listings")
def create_listing(data: ListingCreate, user_id: int = Depends(get_user_id), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    listing = {
        "id": listing_id_counter[0],
        "waste_type": data.waste_type,
        "quantity_kg": data.quantity_kg,
        "price_per_kg": data.price_per_kg,
        "total_price": round(data.quantity_kg * data.price_per_kg, 2),
        "location": data.location,
        "description": data.description,
        "seller_name": user.name,
        "seller_id": user_id,
        "status": "Available",
        "created_at": datetime.utcnow().isoformat()
    }
    listings.append(listing)
    listing_id_counter[0] += 1
    return listing

@router.put("/listings/{listing_id}/buy")
def buy_listing(listing_id: int, user_id: int = Depends(get_user_id)):
    for l in listings:
        if l["id"] == listing_id and l["status"] == "Available":
            if l["seller_id"] == user_id:
                raise HTTPException(status_code=400, detail="Cannot buy your own listing")
            l["status"] = "Sold"
            return {"message": "Purchase successful", "listing": l}
    raise HTTPException(status_code=404, detail="Listing not found")

@router.delete("/listings/{listing_id}")
def delete_listing(listing_id: int, user_id: int = Depends(get_user_id)):
    for l in listings:
        if l["id"] == listing_id and l["seller_id"] == user_id:
            l["status"] = "Removed"
            return {"message": "Listing removed"}
    raise HTTPException(status_code=404, detail="Not found or not your listing")