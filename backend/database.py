import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# load the variables from .env
load_dotenv()
# retrieve the database connection String
DATABASE_URL = os.getenv("DATABASE_URL")
# connect to PostgreSQL
engine = create_engine(DATABASE_URL)
# factory for creating database sessions per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# base class that all database models will inherit from
class Base(DeclarativeBase):
    pass

# database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()