from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from database.models import MOODLEVEL

class MoodCheckinCreate(BaseModel):
    mood: MOODLEVEL
    energy_level: Optional[int] = Field(None, ge=1, le=0)
    notes: Optional[str] = None

class MoodCheckinResponse(BaseModel):
    id: int
    mood: MOODLEVEL
    energy_level: Optional[int]
    notes: Optional[str]
    checked_in_at: datetime

    class Config:
        from_attributes = True
