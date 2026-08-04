import requests
import json
from datetime import datetime, timedelta

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2"

# AI parses user's note & generates proposed events

def suggest_events_from_note(note_text: str) -> list[dict]:
    today = datetime.now().strftime("%Y-%m-%d (%A)")
    prompt = f"""Today's date is {today}.
    Read the following daily note and identify anything that could become a calendar event the user should add to the calendar. This will include appointments, errands, follow-ups, or even reminders to do something.

    Note: {note_text}

    Return ONLY a valid JSON array of suggestions, no other text. Each suggestion should have this format:
    {{
        "title": "short title",
        "description": "brief context from the note",
        "suggested_start_time": "YYYY-MM-DDTHH:MM:SS",
        "suggested_end_time": "YYYY-MM-DDTHH:MM:SS",
        "location": "location or null"
    }}

    Example:
    Note: "Need to pick up dry cleaning tomorrow. Mom's surgery is scheduled for next Friday, need to visit her in the hospital the next day."
    Output: [
        {{"title": "Pick up dry cleaning", "description": "Dry cleaning task is mentioned in today's note ask a task to be done tomorrow", "suggested_start_time": "2026-08-04T09:00:00", "suggested_end_time": "2026-08-04T10:30:00", "location": null}},
        {{"title": "Visit Mom in the hospital", "description": "Mom's surgery is next Friday. You mentioned wanting to visit her the next day.", "suggested_start_time": "2026-08-04T11:00:00", "suggested_end_time": "2026-08-04T13:00:00", "location": "hospital"}}
    ]

    Rules:
    - If the note mentioned nothing worth scheduling, return an empty array: []
    - Only include a suggested event on genuinely actionable items, not general feelings or observations.
    - Always provide a specific description citing the user's note to explain the suggestion's context.
    - Always provide a best-guess suggested_start_time and suggested_end_time depending on the type of event if the note does not provide a clear start and end time.Use reasonable default times: errands/tasks start at 9:00 AM the same or next day and end an hour later; if a specific future day is mentioned, use that date at a reasonable default time and duration.
    - location should be null only if no location is mentioned or implied.
    - Respond with ONLY the JSON array, No explanation, no extra text."""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
        },
    )

    result = response.json()
    raw_text = result["response"]

    suggestions = json.loads(raw_text)
    return suggestions