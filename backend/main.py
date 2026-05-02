from fastapi import FastAPI
from database import engine
from models import Base
from crud import router as crud_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TasKify API")

# Create all tables (including new User + Category tables)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# All routes now live under /todos — includes auth + categories + todos
app.include_router(crud_router, prefix="/todos", tags=["TasKify"])

# Removed the old debug root route — the FastAPI docs at /docs replace it


@app.get("/")
async def root():
    return {"message": "TasKify API is running. Visit /docs for the API explorer."}
