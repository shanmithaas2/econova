from sqlalchemy import Column, Integer, String, Float, Date, Text, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    reward_points = Column(Integer, default=0)
    eco_score = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())

class WasteReport(Base):
    __tablename__ = "waste_reports"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    waste_type = Column(String)
    quantity_kg = Column(Float)
    location = Column(String)
    carbon_saved = Column(Float)
    points_earned = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())

class PickupRequest(Base):
    __tablename__ = "pickup_requests"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    waste_type = Column(String)
    quantity_kg = Column(Float)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    preferred_date = Column(Date)
    status = Column(String, default="Pending")
    assigned_vehicle = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    description = Column(Text)
    location = Column(String)
    status = Column(String, default="Open")
    created_at = Column(TIMESTAMP, server_default=func.now())

class CarbonLog(Base):
    __tablename__ = "carbon_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    waste_type = Column(String)
    quantity_kg = Column(Float)
    carbon_saved = Column(Float)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    action = Column(String)
    description = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())




