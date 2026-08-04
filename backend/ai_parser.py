import requests
import json
from datetime import datetime, timedelta

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2"

def clean_event_data(event_data: dict) -> dict:
    for field in ["description", "location"]:
        if event_data.get(field) in ["null", "None", ""]: 
            event_data[field] = None
    
    try:
        start = datetime.fromisoformat(event_data["start_time"])
        end = datetime.fromisoformat(event_data["end_time"])
        if end <= start:
            event_data["end_time"] = (start + timedelta(hours=1)).isoformat()
    except (ValueError, KeyError):
        pass
    return event_data


def parse_event_text(user_text: str) -> dict:
    today = datetime.now().strftime("%Y-%m-%d (%A)")
    prompt = f"""Today's date is {today}.
    Extract calendar event details from this text and return ONLY valid JSON, no other text, no explanation.

    Example:
    Text: "Emma’s birthday party will be next Tuesday from 4pm to 9pm at her house."
    Output: {{"title": "Emma's birthday party", "description": null, "start_time": "2026-08-11T16:00:00", "end_time": "2026-08-11T21:00:00", "location": "Emma's house"}}


    Text: "{user_text}"
    Return JSON in exactly this format:
    {{
        "title": "short event title",
        "description": null,
        "start_time": "YYYY-MM-DDTHH:MM:SS",
        "end_time": "YYYY-MM-DDTHH:MM:SS",
        "location": null
    }}
    Rules:
    - If no end time is mentioned, assume that the event is 2 hours long. 
    - If no start time is mentioned, assume 9:00 AM. 
    - If no date is mentioned at all, assume today's date.
    - If no date and start time are mentioned, assume today's date and an hour from the current time. 
    - Carefully extract the accurate time, location, & description mentioned in the user's text.
    - If no description is mentioned, use the JSON value null (not a String).
    - If no location is mentioned, use the JSON value null (not a String).
    - Respond with ONLY the JSON object. No explanation nor extra text."""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
        },
    )

    result = response.json();
    raw_text = result["response"]
    event_data = json.loads(raw_text)
    event_data = clean_event_data(event_data)
    return event_data
