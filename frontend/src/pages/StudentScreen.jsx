import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import * as api from "../api/client";
import SubjectCard from "../components/SubjectCard";
import EnrollModal from "../components/EnrollModal";
import SubjectDetailModal from "../components/SubjectDetailModal";

const inputCls =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-all duration-200";

// ── Student Dashboard ─────────────────────────────────────────────────────────
function StudentDashboard() {
  const { student, joinCode, setJoinCode } = useApp();
  const [subjects, setSubjects]           = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState(null);
  // Auto-open enroll if arrived via join-code URL
  const [showEnroll, setShowEnroll]       = useState(!!joinCode);
  const [detailSubject, setDetailSubject] = useState(null);
  // Pre-fill the enroll modal if a join-code is pending
  const pendingCode = joinCode;

  const load = async () => {
    const [subs, logs] = await Promise.all([
      api.getStudentSubjects(student?.id || student?.student_id || 1),
      api.getStudentAttendance(student?.id || student?.student_id || 1),
    ]);
    setSubjects(subs.subjects);
    setAttendanceLogs(logs.logs);
  };

  if (!subjects) load();

  const statsMap = {};
  (attendanceLogs || []).forEach((log) => {
    if (!statsMap[log.subject_id]) statsMap[log.subject_id] = { total: 0, attended: 0 };
    statsMap[log.subject_id].total += 1;
    if (log.is_present) statsMap[log.subject_id].attended += 1;
  });

  const handleUnenroll = async (subjectId, subjectName) => {
    if (!confirm(`Unenroll from ${subjectName}?`)) return;
    await api.unenrollStudent(student?.id || student?.student_id || 1, subjectId);
    alert(`Unenrolled from ${subjectName}`);
    setSubjects(null);
  };

  // Compute overall attendance
  const totalClasses  = Object.values(statsMap).reduce((s, v) => s + v.total,    0);
  const totalAttended = Object.values(statsMap).reduce((s, v) => s + v.attended,  0);
  const pct = totalClasses ? Math.round((totalAttended / totalClasses) * 100) : 0;

  return (
    <div className="w-full flex-grow flex flex-col">
      
      {/* Student sub-header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Student Dashboard</p>
              <h2 className="font-display font-bold text-xl text-slate-900">{student.name}</h2>
            </div>
            {/* Attendance summary pill */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-2xl px-5 py-3">
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-violet-700">{pct}%</p>
                  <p className="text-[10px] text-violet-500 font-semibold uppercase tracking-wide">Attendance</p>
                </div>
                <div className="w-px h-8 bg-violet-200" />
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-slate-800">{(subjects || []).length}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Subjects</p>
                </div>
              </div>
              <button
                onClick={() => setShowEnroll(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-bold rounded-xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 active:scale-95 transition-all duration-200"
              >
                + Enroll
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects grid */}
      <div className="flex-grow bg-violet-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="font-display font-semibold text-lg text-slate-800 mb-6">Enrolled Subjects</h3>

          {subjects && subjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
              <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-3xl mb-4">📚</div>
              <h3 className="font-display font-semibold text-slate-800 mb-2">No subjects yet</h3>
              <p className="text-sm text-slate-400 mb-6">Enroll with a code from your teacher to get started.</p>
              <button
                onClick={() => setShowEnroll(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-bold rounded-xl shadow-glow-violet active:scale-95 transition-all"
              >
                + Enroll in a Subject
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {(subjects || []).map(({ subjects: sub }) => {
                const s = statsMap[sub.subject_id] || { total: 0, attended: 0 };
                const subPct = s.total ? Math.round((s.attended / s.total) * 100) : 0;
                return (
                  <SubjectCard
                    key={sub.subject_id}
                    name={sub.name}
                    code={sub.subject_code}
                    section={sub.section}
                    onClick={() => setDetailSubject(sub)}
                    stats={[
                      ["📅", "Total",    s.total],
                      ["✅", "Attended", s.attended],
                      ["🎯", "Rate",     `${subPct}%`],
                    ]}
                    footer={
                      <button
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold rounded-xl border border-rose-100 transition-all active:scale-95"
                        onClick={() => handleUnenroll(sub.subject_id, sub.name)}
                      >
                        🗑 Unenroll
                      </button>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showEnroll && (
        <EnrollModal
          studentId={student?.id || student?.student_id || 1}
          initialCode={pendingCode || ""}
          onClose={() => {
            setShowEnroll(false);
            setJoinCode(null); // clear the pending join code
            setSubjects(null);
          }}
        />
      )}
      {detailSubject && (
        <SubjectDetailModal
          subject={detailSubject}
          role="student"
          studentId={student?.id || student?.student_id || 1}
          onClose={() => setDetailSubject(null)}
        />
      )}
    </div>
  );
}

// ── Face Login ────────────────────────────────────────────────────────────────
function FaceLogin() {
  const { setStudent } = useApp();
  const videoRef    = useRef(null);
  const [streaming,     setStreaming]     = useState(false);
  const [capturedBlob,  setCapturedBlob]  = useState(null);
  const [capturedUrl,   setCapturedUrl]   = useState(null);
  const [status,        setStatus]        = useState("");
  const [statusType,    setStatusType]    = useState("info"); // info | error | success
  const [showRegister,  setShowRegister]  = useState(false);
  const [regName,       setRegName]       = useState("");
  const [loading,       setLoading]       = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStreaming(true);
      setStatus("");
      // Small timeout to ensure the video element is visible in the DOM before assigning srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (e) {
      setStatus("Could not access camera. Please allow camera permission and try again.");
      setStatusType("error");
    }
  };

  const capture = () => {
    const canvas = document.createElement("canvas");
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      setCapturedBlob(blob);
      setCapturedUrl(URL.createObjectURL(blob));
      videoRef.current.srcObject?.getTracks().forEach((t) => t.stop());
      setStreaming(false);
      setStatus("Scanning your face…");
      setStatusType("info");
      setLoading(true);
      try {
        const data = await api.faceLogin(blob);
        setStudent(data.student);
      } catch (e) {
        if (e.message === "Face not recognized") {
          setStatus("Face not recognized — register as a new student?");
          setStatusType("warn");
          setShowRegister(true);
        } else {
          setStatus(e.message);
          setStatusType("error");
        }
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  const handleRegister = async () => {
    if (!regName || !capturedBlob) return;
    setLoading(true);
    try {
      const data = await api.registerStudent(regName, capturedBlob);
      setStudent(data.student);
    } catch (e) {
      setStatus(e.message);
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const statusStyles = {
    info:  "bg-violet-50 border-violet-200 text-violet-700",
    warn:  "bg-amber-50  border-amber-200  text-amber-700",
    error: "bg-rose-50   border-rose-200   text-rose-700",
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center bg-violet-50 p-6">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-modal animate-slide-up">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center mb-4 shadow-glow-violet">
              <span className="text-2xl">👤</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900">Face ID Login</h1>
            <p className="text-sm text-slate-500 mt-1">Position your face and tap capture</p>
          </div>

          {/* Camera / Preview */}
          {!streaming && !capturedUrl && !loading && (
            <button
              onClick={startCamera}
              className="w-full py-4 flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl text-sm active:scale-[0.98] transition-all duration-200 mb-4"
            >
              <span className="text-xl">📷</span> Open Camera
            </button>
          )}

          {/* Video element - always in DOM so ref is always available */}
          <div className={`mb-3 space-y-3 ${streaming ? "block" : "hidden"}`}>
            <div className="relative rounded-2xl overflow-hidden border-2 border-violet-200 shadow-glow-violet">
              <video
                ref={videoRef}
                className="w-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <div
                className="absolute inset-0 border-[3px] border-violet-300/40 rounded-2xl pointer-events-none"
                style={{ boxShadow: "inset 0 0 32px rgba(139,92,246,0.15)" }}
              />
            </div>
            {streaming && (
              <button
                onClick={capture}
                className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold rounded-2xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 active:scale-[0.98] transition-all text-sm"
              >
                📸 Capture &amp; Login
              </button>
            )}
          </div>


          {capturedUrl && !streaming && (
            <div className="mb-4 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner">
              <img src={capturedUrl} alt="Captured" className="w-full object-cover" />
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-3 py-4 text-sm font-medium text-violet-600">
              <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              Analyzing…
            </div>
          )}

          {status && (
            <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-sm font-medium mb-4 ${statusStyles[statusType]}`}>
              <span className="shrink-0">{statusType === "error" ? "⚠️" : statusType === "warn" ? "🤔" : "ℹ️"}</span>
              <span>{status}</span>
            </div>
          )}

          {/* Register box */}
          {showRegister && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-semibold text-slate-800">Register New Profile</h3>
              <input
                className={inputCls}
                placeholder="Your full name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-bold rounded-xl shadow-glow-violet hover:from-violet-700 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {loading ? "Creating…" : "✨ Create Account"}
              </button>
            </div>
          )}

          {/* Retry */}
          {(capturedUrl || status) && !showRegister && !loading && (
            <button
              onClick={() => { setCapturedUrl(null); setCapturedBlob(null); setStatus(""); setShowRegister(false); }}
              className="w-full mt-3 py-2.5 text-sm font-semibold text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
            >
              ↩ Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Student Screen ─────────────────────────────────────────────────────────────
export default function StudentScreen() {
  const { student } = useApp();
  return student ? <StudentDashboard /> : <FaceLogin />;
}
