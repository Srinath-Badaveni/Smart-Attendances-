from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
import numpy as np
from PIL import Image
import io
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import get_all_students, create_student, get_student_attendance
from pipelines.face_pipeline import predict_attendance, get_face_embeddings, train_classifier
from pipelines.voice_pipeline import get_voice_embedding

router = APIRouter()


@router.post("/face-login")
async def face_login(photo: UploadFile = File(...)):
    """Identify student from a face photo."""
    contents = await photo.read()
    img = np.array(Image.open(io.BytesIO(contents)).convert("RGB"))

    detected, _, num_faces = predict_attendance(img)

    if num_faces == 0:
        raise HTTPException(status_code=400, detail="No face detected")
    if num_faces > 1:
        raise HTTPException(status_code=400, detail="Multiple faces detected")
    if not detected:
        raise HTTPException(status_code=404, detail="Face not recognized")

    student_id = list(detected.keys())[0]
    all_students = get_all_students()
    student = next((s for s in all_students if s.get("id", s.get("student_id")) == student_id), None)

    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    student.pop("face_embedding", None)
    student.pop("voice_embedding", None)
    return {"student": student}


@router.post("/register")
async def register_student(
    name: str = Form(...),
    photo: UploadFile = File(...),
    audio: UploadFile = File(None),
):
    """Register a new student with face (and optional voice) embedding."""
    photo_bytes = await photo.read()
    img = np.array(Image.open(io.BytesIO(photo_bytes)).convert("RGB"))
    encodings = get_face_embeddings(img)

    if not encodings:
        raise HTTPException(status_code=400, detail="Could not extract face features")

    face_emb = encodings[0].tolist()
    voice_emb = None

    if audio:
        audio_bytes = await audio.read()
        voice_emb = get_voice_embedding(audio_bytes)

    data = create_student(name, face_embedding=face_emb, voice_embedding=voice_emb)
    if not data:
        raise HTTPException(status_code=500, detail="Could not create student")

    train_classifier()
    student = data[0]
    student.pop("face_embedding", None)
    student.pop("voice_embedding", None)
    return {"student": student}


@router.get("/{student_id}/attendance")
def student_attendance(student_id: int):
    logs = get_student_attendance(student_id)
    return {"logs": logs}
