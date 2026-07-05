from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from database.connection import get_db
from database.models import JournalEntry, MOODLEVEL
from schemas.journal import JournalCreate, JournalUpdate, JournalResponse

router = APIRouter(prefix="/journal", tags=["Journal"])

@router.get("/", response_model=list[JournalResponse])
def get_entries(
    mood: Optional[MOODLEVEL] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(JournalEntry).filter(JournalEntry.is_deleted == False)

    if mood:
        query = query.filter(JournalEntry.mood == mood)
    if search:
        query = query.filter(
            JournalEntry.content.ilike(f"%{search}%") |
            JournalEntry.tags.ilike(f"%{search}%")
        )

    return query.order_by(JournalEntry.created_at.desc()).all()

@router.get("/{entry_id}", response_model=JournalResponse)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.is_deleted == False
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return entry

@router.post("/", response_model=JournalResponse, status_code=201)
def create_entry(payload: JournalCreate, db: Session = Depends(get_db)):
    entry = JournalEntry(**payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.put("/{entry_id}", response_model=JournalResponse)
def update_entry(entry_id: int, payload: JournalUpdate, db: Session = Depends(get_db)):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.is_deleted == False
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    update_data = payload.model_dump(exclude_unset = True)
    for field, value in update_data.items():
        setattr(entry, field, value)

    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.is_deleted == False
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    entry.is_deleted = True # type: ignore
    db.commit()