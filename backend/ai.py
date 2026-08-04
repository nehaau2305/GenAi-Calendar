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
            location=item.get("location")
        )
        db.add(suggestion)
        saved_suggestions.append(suggestion)
    
    db.commit()
    for s in saved_suggestions:
        db.refresh(s)
    
    return saved_suggestions

# get all suggestions
@router.get("/suggestions", response_model=List[schemas.SuggestionResponse])
def get_pending_suggestions(db: Session = Depends(get_db)):
    return db.query(models.Suggestion).all()

@router.post("/suggestions/{suggestion_id}/accept", response_model=schemas.EventResponse)
def accept_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    suggestion = db.query(models.Suggestion).filter(models.Suggestion.id == suggestion_id).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    new_event = models.Event(
        title=suggestion.title,
        description=suggestion.description,
        start_time=suggestion.suggested_start_time,
        end_time=suggestion.suggested_end_time,
        location=suggestion.location
    )
    db.add(new_event)
    db.delete(suggestion)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.delete("/suggestions/{suggestion_id}")
def dismiss_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    suggestion = db.query(models.Suggestion).filter(models.Suggestion.id == suggestion_id).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    db.delete(suggestion)
    db.commit()
    return {"message": "Suggestion dismissed"}