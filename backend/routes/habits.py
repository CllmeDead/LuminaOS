from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from database.connection import get_db
from database.models import Habit, HabitCompletion
from schemas.habit import (
    HabitCreate, HabitUpdate, HabitResponse,
    HabitCompletionCreate, HabitCompletionResponse
)

router = APIRouter(prefix="/habits", tags=["Habits"])

def calculate_streak(completions: list) -> int:

    if not completions:
        return 0
    
    dates = sorted(
        set(c.completed_at.date() for c in completions),
        reverse=True
    )

    today = datetime.now(timezone.utc).date()
    streak = 0

    for i, date in enumerate(dates):
        expected = today - timedelta(days=i)
        if date == expected:
            streak += 1
        else:
            break

    return streak


@router.get("/", response_model=list[HabitResponse])
def get_habits(db: Session = Depends(get_db)):
    habits = db.query(Habit).filter(Habit.is_active == True).all()

    result = []
    for habit in habits:
        habit_dict = {
            "id": habit.id,
            "name": habit.name,
            "description": habit.description,
            "frequency": habit.frequency,
            "color": habit.color,
            "icon": habit.icon,
            "target_streak": habit.target_streak,
            "is_active": habit.is_active,
            "created_at": habit.created_at,
            "current_streak": calculate_streak(habit.completions),
            "completions": habit.completions
        }
        result.append(HabitResponse(**habit_dict))

    return result

@router.post("/", response_model=HabitResponse, status_code=201)
def create_habit(payload: HabitCreate, db: Session = Depends(get_db)):
    habit = Habit(**payload.model_dump())
    db.add(habit)
    db.commit()
    db.refresh(habit)

    habit_dict = {**habit.__dict__, "current_streak": 0, "completions":[]}
    return HabitResponse(**habit_dict)


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(habit_id:int, payload: HabitUpdate, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(habit, field, value)

    db.commit()
    db.refresh(habit)

    habit_dict = {
        **{c.key: getattr(habit, c.key) for c in habit.__table__.columns},
        "current_streak": calculate_streak(habit.completions),
        "completions": habit.completions
    }
    return HabitResponse(**habit_dict)


@router.post("/{habit_id}/complete", response_model=HabitCompletionResponse, status_code=201)
def complete_habit(
    habit_id: int,
    payload: HabitCompletionCreate,
    db: Session = Depends(get_db)
):
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    completion = HabitCompletion(habit_id=habit_id, notes=payload.notes)
    db.add(completion)
    db.commit()
    db.refresh(completion)
    return completion


@router.delete("/{habit_id}", status_code=204)
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    habit.is_active = False # type:ignore
    db.commit()