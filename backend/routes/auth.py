from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User
import bcrypt
from jose import jwt
import os
import threading
from dotenv import load_dotenv
from email_service import email_welcome

load_dotenv()
router = APIRouter()

class RegisterData(BaseModel):
    name: str
    email: str
    password: str
    role: str

class LoginData(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(data: RegisterData, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt())
    user = User(
        name=data.name,
        email=data.email,
        password=hashed.decode(),
        role=data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Send welcome email in background
    threading.Thread(target=email_welcome, args=(user.email, user.name)).start()

    return {"message": "Registered successfully"}

@router.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not bcrypt.checkpw(data.password.encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Wrong password")
    token = jwt.encode(
        {"id": user.id, "role": user.role},
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )
    return {
        "token": token,
        "role": user.role,
        "name": user.name,
        "user_id": user.id
    }