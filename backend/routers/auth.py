from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import check_teacher_exists, create_teacher, teacher_login

router = APIRouter()


class TeacherRegisterRequest(BaseModel):
    username: str
    password: str
    name: str


class TeacherLoginRequest(BaseModel):
    username: str
    password: str


@router.post("/teacher/register")
def register_teacher(body: TeacherRegisterRequest):
    if not body.username or not body.name or not body.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    if check_teacher_exists(body.username):
        raise HTTPException(status_code=409, detail="Username already taken")
    try:
        create_teacher(body.username, body.password, body.name)
        return {"message": "Teacher registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unexpected error")


@router.post("/teacher/login")
def login_teacher(body: TeacherLoginRequest):
    teacher = teacher_login(body.username, body.password)
    if not teacher:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    # Return teacher without password
    teacher.pop("password", None)
    return {"teacher": teacher}
