from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import (
    create_subject, get_teacher_subjects, get_subject_by_code,
    enroll_student_to_subject, unenroll_student_to_subject,
    get_student_subjects, check_already_enrolled, get_enrolled_students,
    get_attendance_for_subject, get_student_attendance_for_subject
)

router = APIRouter()


class CreateSubjectRequest(BaseModel):
    subject_code: str
    name: str
    section: str
    teacher_id: int


class EnrollRequest(BaseModel):
    student_id: int
    subject_code: str


class UnenrollRequest(BaseModel):
    student_id: int
    subject_id: int


@router.post("/")
def create_new_subject(body: CreateSubjectRequest):
    try:
        data = create_subject(body.subject_code, body.name, body.section, body.teacher_id)
        return {"subject": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/teacher/{teacher_id}")
def list_teacher_subjects(teacher_id: int):
    return {"subjects": get_teacher_subjects(teacher_id)}


@router.get("/student/{student_id}")
def list_student_subjects(student_id: int):
    return {"subjects": get_student_subjects(student_id)}


@router.get("/by-code/{subject_code}")
def get_subject(subject_code: str):
    subject = get_subject_by_code(subject_code)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return {"subject": subject}


@router.post("/enroll")
def enroll(body: EnrollRequest):
    subject = get_subject_by_code(body.subject_code)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject code not found")
    if check_already_enrolled(body.student_id, subject["subject_id"]):
        raise HTTPException(status_code=409, detail="Already enrolled")
    enroll_student_to_subject(body.student_id, subject["subject_id"])
    return {"message": "Enrolled successfully"}


@router.delete("/unenroll")
def unenroll(body: UnenrollRequest):
    unenroll_student_to_subject(body.student_id, body.subject_id)
    return {"message": "Unenrolled successfully"}


@router.get("/{subject_id}/students")
def get_enrolled(subject_id: int):
    return {"students": get_enrolled_students(subject_id)}


@router.get("/{subject_id}/attendance")
def get_subject_attendance(subject_id: int):
    """All attendance logs for a subject (teacher detail view)."""
    return {"logs": get_attendance_for_subject(subject_id)}


@router.get("/{subject_id}/student/{student_id}/attendance")
def get_my_subject_attendance(subject_id: int, student_id: int):
    """A student's attendance for a specific subject."""
    return {"logs": get_student_attendance_for_subject(student_id, subject_id)}
