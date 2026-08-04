from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
import models
import schemas

router = APIRouter(prefix="/notes", tags=["notes"])

# post new note
@router.post("/", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    new_note = models.DailyNote(
        content=note.content,
        created_at=datetime.now()
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

# get all notes
@router.get("/", response_model=List[schemas.NoteResponse])
def get_notes(db: Session = Depends(get_db)):
    return db.query(models.DailyNote).order_by(models.DailyNote.created_at.desc()).all()