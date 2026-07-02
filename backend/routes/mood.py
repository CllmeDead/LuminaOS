from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import MoodCheckin
from schemas.mood import MoodCheckinCreate, MoodCheckinResponse

router = APIRouter(prefix="/mood", tags=["Mood"])

@router.get("/", response_model=list[MoodCheckinResponse])
def get_checkins(db: Session = Depends(get_db)):
    return db.query(MoodCheckin).order_by(MoodCheckin.checked_in_at.desc()).all()

@router.post("/", response_model=MoodCheckinResponse, status_code=201)
def create_checkin(payload: MoodCheckinCreate, db: Session = Depends(get_db)):
    checkin = MoodCheckin(**payload.model_dump())
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return checkin