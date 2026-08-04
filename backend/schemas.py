from pydantic import BaseModel
from datetime import datetime
from typing import Optional

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