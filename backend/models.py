from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    location = Column(String, nullable=True)

    # will add smart reminders
    smart_reminders = relationship("SmartReminder", back_populates="event")

class DailyNote(Base):
    __tablename__ = "daily_notes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)


class Suggestion(Base):
    __tablename__ = "suggestions"

    id = Column(Integer, primary_key=True, index=True)
    note_id = Column(Integer, ForeignKey("daily_notes.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    suggested_start_time = Column(DateTime, nullable=True)
    suggested_end_time = Column(DateTime, nullable=True)
    location = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")

class SmartReminder(Base):
    __tablename__ = "smart_reminders"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    message = Column(String, nullable=False)
    trigger_time = Column(DateTime, nullable=False)
    is_dismissed = Column(Boolean, nullable=False, default=False)
    event = relationship("Event", back_populates="smart_reminders")