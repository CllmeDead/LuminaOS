from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import PomodoroSession
from schemas.pomodoro import PomodoroCreate, PomodoroUpdate, PomodoroResponse

router = APIRouter(prefix="/pomodoro", tags=["Pomodoro"])

@router.get("/", response_model=list[PomodoroResponse])
def get_sessions(db: Session = Depends(get_db)):
    return db.query(PomodoroSession).order_by(PomodoroSession.started_at.desc()).all()

@router.post("/", response_model=PomodoroResponse, status_code=201)
def start_session(payload: PomodoroCreate, db:Session = Depends(get_db)):
    session = PomodoroSession(**payload.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.put("/{session_id}", response_model=PomodoroResponse)
def update_session(session_id: int, payload: PomodoroUpdate, db:Session = Depends(get_db)):
    session = db.query(PomodoroSession).filter(PomodoroSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)

    db.commit()
    db.refresh(session)
    return session