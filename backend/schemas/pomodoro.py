from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PomodoroCreate(BaseModel):
    task_id: Optional[int] = None
    duration_minutes: int = 25
    break_duration_minutes: int = 5
    started_at: datetime

class PomodoroUpdate(BaseModel):
    completed: Optional[bool] = None
    ended_at: Optional[datetime] = None
    notes: Optional[str] = None

class PomodoroResponse(BaseModel):
    id: int
    task_id: Optional[int]
    duration_minutes: int
    completed: bool
    started_at: datetime
    ended_at: Optional[datetime]
    notes: Optional[str]

    class Config:
        from_attribute = True
        