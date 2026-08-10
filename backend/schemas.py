from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# schema defines the data types of the info passed to the API
# and passed back

# frontend sends this when creating an event
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None

# Send event back to client after saving event to database
class EventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None

    class Config:
        from_attributes = True

class NoteCreate(BaseModel):
    content: str

class NoteResponse(BaseModel):
    id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class SuggestionResponse(BaseModel):
    id: int
    note_id: int
    title: str
    description: Optional[str] = None
    suggested_start_time: Optional[datetime] = None
    suggested_end_time: Optional[datetime] = None
    location: Optional[str] = None

    class Config: 
        from_attributes = True

class SmartReminderResponse(BaseModel):
    id: int
    event_id: int
    message: str
    trigger_time: datetime
    is_dismissed: bool
    class Config:
        from_attributes = True