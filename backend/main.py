from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, waste, pickup, complaints, dashboard, ml_routes, marketplace

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoNova API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,         prefix="/auth")
app.include_router(waste.router,        prefix="/waste")
app.include_router(pickup.router,       prefix="/pickup")
app.include_router(complaints.router,   prefix="/complaints")
app.include_router(dashboard.router,    prefix="/dashboard")
app.include_router(ml_routes.router,    prefix="/routes")
app.include_router(marketplace.router,  prefix="/marketplace")

@app.get("/")
def root():
    return {"message": "EcoNova API is running"}