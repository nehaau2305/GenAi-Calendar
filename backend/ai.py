from fastapi import APIRouter
from pydantic import BaseModel
from ai_parser import parse_event_text

router = APIRouter(prefix="/ai", tags=["ai"])

class ParseRequest(BaseModel):
    text: str


@router.post("/parse-event")
def parse_event(request: ParseRequest):
    result = parse_event_text(request.text)
    return result