from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from datetime import datetime
import numpy as np
from PIL import Image
import io
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import get_enrolled_students, create_attendance, get_attendance_for_teacher
from pipelines.face_pipeline import predict_attendance
from pipelines.voice_pipeline import process_bulk_audio

router = APIRouter()


class AttendanceLog(BaseModel):
    student_id: int
    subject_id: int
    timestamp: str
    is_present: bool


class SaveAttendanceRequest(BaseModel):
    logs: list[AttendanceLog]


@router.post("/face-analyze/{subject_id}")
async def face_analyze(subject_id: int, photos: list[UploadFile] = File(...)):
    """Run face recognition on one or more photos and return attendance results."""
    enrolled = get_enrolled_students(subject_id)
    if not enrolled:
        raise HTTPException(status_code=400, detail="No students enrolled in this subject")

    all_detected_ids: dict[int, list[str]] = {}

    for idx, photo in enumerate(photos):
        contents = await photo.read()
        img = np.array(Image.open(io.BytesIO(contents)).convert("RGB"))
        detected, _, _ = predict_attendance(img)
        for sid in detected.keys():
            all_detected_ids.setdefault(int(sid), []).append(f"Photo {idx + 1}")

    current_timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    results = []
    logs = []

    for node in enrolled:
        student = node["students"]
        sid = student.get("id", student.get("student_id"))
        sources = all_detected_ids.get(int(sid), [])
        is_present = len(sources) > 0

        results.append({
            "name": student["name"],
            "id": sid,
            "source": ", ".join(sources) if is_present else "-",
            "status": "present" if is_present else "absent",
        })
        logs.append({
            "student_id": sid,
            "subject_id": subject_id,
            "timestamp": current_timestamp,
            "is_present": is_present,
        })

    return {"results": results, "logs": logs}


@router.post("/voice-analyze/{subject_id}")
async def voice_analyze(subject_id: int, audio: UploadFile = File(...)):
    """Run voice recognition on a bulk audio file."""
    enrolled = get_enrolled_students(subject_id)
    if not enrolled:
        raise HTTPException(status_code=400, detail="No students enrolled")

    candidates_dict = {
        s["students"].get("id", s["students"].get("student_id")): s["students"]["voice_embedding"]
        for s in enrolled
        if s["students"].get("voice_embedding")
    }

    if not candidates_dict:
        raise HTTPException(status_code=400, detail="No students have voice profiles")

    audio_bytes = await audio.read()
    detected_scores = process_bulk_audio(audio_bytes, candidates_dict)

    current_timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    results = []
    logs = []

    for node in enrolled:
        student = node["students"]
        sid = student.get("id", student.get("student_id"))
        score = detected_scores.get(sid, 0.0)
        is_present = bool(score > 0)

        results.append({
            "name": student["name"],
            "id": sid,
            "source": round(float(score), 3) if is_present else "-",
            "status": "present" if is_present else "absent",
        })
        logs.append({
            "student_id": sid,
            "subject_id": subject_id,
            "timestamp": current_timestamp,
            "is_present": is_present,
        })

    return {"results": results, "logs": logs}


@router.post("/save")
def save_attendance(body: SaveAttendanceRequest):
    logs = [log.dict() for log in body.logs]
    create_attendance(logs)
    return {"message": "Attendance saved successfully"}


@router.get("/teacher/{teacher_id}")
def teacher_records(teacher_id: int):
    records = get_attendance_for_teacher(teacher_id)
    return {"records": records}
