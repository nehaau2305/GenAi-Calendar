from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from ai_parser import suggest_events_from_note
from database import get_db
import models
import schemas

router = APIRouter(prefix="/ai", tags=["ai"])

# API route btw ai_parser & database. sends to frontend
# Read note --> suggestion --> save to database --> return
@router.post("/suggest-events/{note_id}", response_model=List[schemas.SuggestionResponse])
def suggest_events(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.DailyNote).filter(models.DailyNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    suggestions_data = suggest_events_from_note(note.content)
    saved_suggestions = []
    for item in suggestions_data:
        suggestion = models.Suggestion(
            note_id=note.id,
            title=item.get("title"),
            description=item.get("description"),
            suggested_start_time=item.get("suggested_start_time"),
            suggested_end_time=item.get("suggested_end_time"),
            location=item.get("location"),
            status="pending"
        )
        db.add(suggestion)
        saved_suggestions.append(suggestion)
    
    db.commit()
    for s in saved_suggestions:
        db.refresh(s)
    
    return saved_suggestions