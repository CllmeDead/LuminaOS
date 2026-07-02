from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from database.models import HabitFrequency

class HabitCreate(BaseModel):
    name: str
    description: Optional[str] = None
    frequency: HabitFrequency = HabitFrequency.DAILY
    color: str = "#F59E0B"
    icon: Optional[str] = None
    target_streak: int = 30

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    target_streak: Optional[int] = None
    is_active: Optional[bool] = None

class HabitCompletionCreate(BaseModel):
    notes: Optional[str] = None

class HabitCompletionResponse(BaseModel):
    id: int
    habit_id: int
    completed_at: datetime
    notes: Optional[str]

    class Config:
        from_attributes = True

class HabitResponse(BaseModel):
    id: int
    name:str
    description: Optional[str]
    frequency: HabitFrequency
    color: str
    icon: Optional[str]
    target_streak: int
    is_active: bool
    created_at: datetime
    current_streak: int = 0
    completions: list[HabitCompletionResponse]= []

    class Config:
        from_attributes = True
