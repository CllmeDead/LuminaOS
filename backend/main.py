from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base, SessionLocal
from database import models
from database.models import seed_default_categories

from routes import tasks, categories, journal, habits, pomodoro, mood, ai

Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    seed_default_categories(db)
finally:
    db.close()

app = FastAPI(
    title="Lumina API",
    description="Backend for Lumina Personal Productivity OS",
    version="0.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router)
app.include_router(tasks.router)
app.include_router(journal.router)
app.include_router(habits.router)
app.include_router(pomodoro.router)
app.include_router(mood.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "Lumina API is running", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "ok"}