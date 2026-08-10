from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import get_db
import models

router = APIRouter(prefix="/reminders", tags=["reminders"])

@router.get("/due")
def get_due_reminders(db: Session = Depends(get_db)):
    now = datetime.now()
    due_reminders = []
    events = db.query(models.Event).all()
    for event in events:
        time_until_start = event.start_time - now
        if timedelta(hours=23) <= time_until_start <= timedelta(hours=24):
            due_reminders.append({
                "type": "standard",
                "event_id": event.id, 
                "message": f"'{event.title}' starts in 24 hours",
                "trigger_time": (event.start_time - timedelta(hours=24)).isoformat()
            })
        if timedelta(minutes=55) <= time_until_start <= timedelta(hours=1):
            due_reminders.append({
                "type": "standard",
                "event_id": event.id, 
                "message": f"'{event.title}' starts in 1 hour",
                "trigger_time": (event.start_time - timedelta(hours=1)).isoformat()
            })
    smart_reminders = db.query(models.SmartReminder).filter(
        models.SmartReminder.trigger_time <= now,
        models.SmartReminder.is_dismissed == False
    ).all()
    
    for reminder in smart_reminders:
        due_reminders.append({
            "type": "smart",
            "id": reminder.id,
            "event_id": reminder.event_id,
            "message": reminder.message,
            "trigger_time": reminder.trigger_time.isoformat()
        })

    return due_reminders

@router.patch("/{reminder_id}/dismiss")
def dismiss_reminder(reminder_id: int, db: Session = Depends(get_db)):
    reminder = db.query(models.SmartReminder).filter(models.SmartReminder.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    reminder.is_dismissed = True
    db.commit()
    return {"messsage": "Reminder dismissed"}