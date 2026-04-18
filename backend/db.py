from config import supabase
import bcrypt


# ── Helpers ────────────────────────────────────────────────────────────────────

def hash_pass(pwd: str) -> str:
    return bcrypt.hashpw(pwd.encode(), bcrypt.gensalt()).decode()


def check_pass(pwd: str, hashed: str) -> bool:
    return bcrypt.checkpw(pwd.encode(), hashed.encode())


# ── Teachers ───────────────────────────────────────────────────────────────────

def check_teacher_exists(username: str) -> bool:
    response = supabase.table("teachers").select("username").eq("username", username).execute()
    return len(response.data) > 0


def create_teacher(username: str, password: str, name: str):
    data = {"username": username, "password": hash_pass(password), "name": name}
    return supabase.table("teachers").insert(data).execute().data


def teacher_login(username: str, password: str):
    response = supabase.table("teachers").select("*").eq("username", username).execute()
    if response.data:
        teacher = response.data[0]
        if check_pass(password, teacher["password"]):
            return teacher
    return None


# ── Students ───────────────────────────────────────────────────────────────────

def get_all_students():
    return supabase.table("students").select("*").execute().data


def create_student(new_name: str, face_embedding=None, voice_embedding=None):
    data = {"name": new_name, "face_embedding": face_embedding, "voice_embedding": voice_embedding}
    return supabase.table("students").insert(data).execute().data


# ── Subjects ───────────────────────────────────────────────────────────────────

def create_subject(subject_code: str, name: str, section: str, teacher_id: int):
    data = {"subject_code": subject_code, "name": name, "section": section, "teacher_id": teacher_id}
    return supabase.table("subjects").insert(data).execute().data


def get_teacher_subjects(teacher_id: int):
    response = supabase.table("subjects") \
        .select("*, subject_students(count), attendance_logs(timestamp)") \
        .eq("teacher_id", teacher_id).execute()
    subjects = response.data

    for sub in subjects:
        sub["total_students"] = sub.get("subject_students", [{}])[0].get("count", 0)
        attendance = sub.get("attendance_logs", [])
        sub["total_classes"] = len(set(log["timestamp"] for log in attendance))
        sub.pop("subject_student", None)
        sub.pop("attendance_logs", None)

    return subjects


def get_subject_by_code(subject_code: str):
    res = supabase.table("subjects").select("subject_id, name, subject_code").eq("subject_code", subject_code).execute()
    return res.data[0] if res.data else None


# ── Enrollment ─────────────────────────────────────────────────────────────────

def enroll_student_to_subject(student_id: int, subject_id: int):
    data = {"student_id": student_id, "subject_id": subject_id}
    return supabase.table("subject_students").insert(data).execute().data


def unenroll_student_to_subject(student_id: int, subject_id: int):
    return supabase.table("subject_students") \
        .delete().eq("student_id", student_id).eq("subject_id", subject_id).execute().data


def get_student_subjects(student_id: int):
    return supabase.table("subject_students").select("*, subjects(*)").eq("student_id", student_id).execute().data


def check_already_enrolled(student_id: int, subject_id: int) -> bool:
    check = supabase.table("subject_students") \
        .select("*").eq("subject_id", subject_id).eq("student_id", student_id).execute()
    return bool(check.data)


def get_enrolled_students(subject_id: int):
    return supabase.table("subject_students").select("*, students(*)").eq("subject_id", subject_id).execute().data


# ── Attendance ─────────────────────────────────────────────────────────────────

def create_attendance(logs: list):
    return supabase.table("attendance_logs").insert(logs).execute().data


def get_student_attendance(student_id: int):
    return supabase.table("attendance_logs").select("*, subjects(*)").eq("student_id", student_id).execute().data


def get_attendance_for_teacher(teacher_id: int):
    return supabase.table("attendance_logs") \
        .select("*, subjects!inner(*)").eq("subjects.teacher_id", teacher_id).execute().data
