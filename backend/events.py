from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from ai_parser import generate_smart_reminders
import models
import schemas

router = APIRouter(prefix="/events", tags=["events"])

# Create new event
@router.post("/", response_model=schemas.EventResponse)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    new_event = models.Event(**event.model_dump())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    # reminders
    reminders_data = generate_smart_reminders(
        event_title=new_event.title,
        event_description=new_event.description,
        event_start_time=new_event.start_time.isoformat()
    )
    for item in reminders_data:
        reminder = models.SmartReminder(
            event_id=new_event.id,
            message=item.get("message"),
            trigger_time=item.get("trigger_time"),
            is_dismissed=False
        )
        db.add(reminder)

    db.commit()
    db.refresh(new_event)
    return new_event

# Get all events
@router.get("/", response_model=List[schemas.EventResponse])
def get_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()