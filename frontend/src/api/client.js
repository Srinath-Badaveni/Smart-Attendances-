const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const json = await res.json();
  if (!res.ok) {
    let msg = json.detail || "Request failed";
    if (typeof msg !== "string") msg = JSON.stringify(msg);
    throw new Error(msg);
  }
  return json;
}

// ── Auth ────────────────────────────────────────────────────────────────────
export const teacherLogin = (username, password) =>
  request("/auth/teacher/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

export const teacherRegister = (username, password, name) =>
  request("/auth/teacher/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, name }),
  });

// ── Students ─────────────────────────────────────────────────────────────────
export const faceLogin = (photoBlob) => {
  const fd = new FormData();
  fd.append("photo", photoBlob, "photo.jpg");
  return request("/students/face-login", { method: "POST", body: fd });
};

export const registerStudent = (name, photoBlob, audioBlob = null) => {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("photo", photoBlob, "photo.jpg");
  if (audioBlob) fd.append("audio", audioBlob, "audio.webm");
  return request("/students/register", { method: "POST", body: fd });
};

export const getStudentAttendance = (studentId) =>
  request(`/students/${studentId}/attendance`);

// ── Subjects ─────────────────────────────────────────────────────────────────
export const getTeacherSubjects = (teacherId) =>
  request(`/subjects/teacher/${teacherId}`);

export const getStudentSubjects = (studentId) =>
  request(`/subjects/student/${studentId}`);

export const createSubject = (subjectCode, name, section, teacherId) =>
  request("/subjects/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject_code: subjectCode,
      name,
      section,
      teacher_id: teacherId,
    }),
  });

export const enrollStudent = (studentId, subjectCode) =>
  request("/subjects/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, subject_code: subjectCode }),
  });

export const unenrollStudent = (studentId, subjectId) =>
  request("/subjects/unenroll", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, subject_id: subjectId }),
  });

export const getSubjectByCode = (code) =>
  request(`/subjects/by-code/${code}`);

// ── Attendance ────────────────────────────────────────────────────────────────
export const runFaceAttendance = (subjectId, imageBlobs) => {
  const fd = new FormData();
  imageBlobs.forEach((blob, i) => fd.append("photos", blob, `photo_${i}.jpg`));
  return request(`/attendance/face-analyze/${subjectId}`, {
    method: "POST",
    body: fd,
  });
};

export const runVoiceAttendance = (subjectId, audioBlob) => {
  const fd = new FormData();
  fd.append("audio", audioBlob, "audio.webm");
  return request(`/attendance/voice-analyze/${subjectId}`, {
    method: "POST",
    body: fd,
  });
};

export const saveAttendance = (logs) =>
  request("/attendance/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logs }),
  });

export const getTeacherAttendanceRecords = (teacherId) =>
  request(`/attendance/teacher/${teacherId}`);

// ── Subject Detail ────────────────────────────────────────────────────────────
export const getSubjectStudents = (subjectId) =>
  request(`/subjects/${subjectId}/students`);

export const getSubjectAttendanceLogs = (subjectId) =>
  request(`/subjects/${subjectId}/attendance`);

export const getStudentSubjectAttendance = (subjectId, studentId) =>
  request(`/subjects/${subjectId}/student/${studentId}/attendance`);

