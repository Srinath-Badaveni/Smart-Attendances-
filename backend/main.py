from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, subjects, students, attendance

app = FastAPI(title="SnapMark API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://snapmark-api-qb7j.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(subjects.router, prefix="/api/subjects", tags=["subjects"])
app.include_router(students.router, prefix="/api/students", tags=["students"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])

@app.get("/")
def root():
    return {"message": "SnapClass API is running"}
