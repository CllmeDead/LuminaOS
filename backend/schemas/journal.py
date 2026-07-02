from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from database.models import MOODLEVEL

class JournalCreate(BaseModel):
    content: str
    mood: Optional[MOODLEVEL] = None
    tags: Optional[str] = None

class JournalUpdate(BaseModel):
    content: Optional[str] = None
    mood: Optional[MOODLEVEL] = None
    tags: Optional[str] = None

class JournalResponse(BaseModel):
    id: int
    content: str
    mood: Optional[MOODLEVEL]
    tags: Optional[str]
    ai_summary: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True