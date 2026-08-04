from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
from events import router as events_router
from ai import router as ai_router
from notes import router as notes_router

# app entry point

# Create all tables defined by models.py that inherit from Base
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events_router)
app.include_router(ai_router)
app.include_router(notes_router)

@app.get("/")
def read_root():
    return {"message": "Calendar API is running"}