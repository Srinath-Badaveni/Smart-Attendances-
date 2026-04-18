import { useState } from "react";
import * as api from "../api/client";
import SubjectCard from "../components/SubjectCard";
import CreateSubjectModal from "../components/CreateSubjectModal";
import ShareSubjectModal from "../components/ShareSubjectModal";
import TakeAttendanceTab from "../components/TakeAttendanceTab";
import AttendanceRecordsTab from "../components/AttendanceRecordsTab";
import { useApp } from "../context/AppContext";

// ── Shared input style
const inputCls =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-all duration-200 font-sans";

// ── Teacher Dashboard ─────────────────────────────────────────────────────────
function TeacherDashboard() {
  const { teacher } = useApp();
  const [tab, setTab] = useState("attendance");
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [subjects, setSubjects] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);

  const loadSubjects = async () => {
    const data = await api.getTeacherSubjects(teacher.id || teacher.teacher_id);
    setSubjects(data.subjects);
  };

  if (!subjects) loadSubjects();

  const tabs = [
    { id: "attendance", label: "Take Attendance", icon: "🎯" },
    { id: "subjects",   label: "Subjects",         icon: "📚" },
    { id: "records",    label: "Records",           icon: "📋" },
  ];

  return (
    <div className="w-full flex-grow flex flex-col">

      {/* Dashboard sub-header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Welcome back</p>
              <h2 className="font-display font-bold text-lg text-slate-900">{teacher.name}</h2>
            </div>
            {/* Tab bar inside sub-header */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    tab === t.id
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span className="hidden lg:inline">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Mobile tabs */}
          <div className="flex md:hidden gap-1 bg-slate-100 rounded-xl p-1 mb-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  tab === t.id
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {tab === "attendance" && (
            <TakeAttendanceTab teacher={teacher} subjects={subjects || []} />
          )}

          {tab === "subjects" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900">Subjects</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{(subjects || []).length} subjects managed</p>
                </div>
                <button
                  onClick={() => setShowCreateSubject(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold rounded-xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 active:scale-95 transition-all duration-200"
                >
                  <span className="text-base leading-none">+</span> New Subject
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {(subjects || []).map((sub) => (
                  <SubjectCard
                    key={sub.subject_id}
                    name={sub.name}
                    code={sub.subject_code}
                    section={sub.section}
                    stats={[
                      ["👥", "Students", sub.total_students],
                      ["🕐", "Classes", sub.total_classes],
                    ]}
                    footer={
                      <button
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
                        onClick={() => setShareTarget(sub)}
                      >
                        🔗 Share Code
                      </button>
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {tab === "records" && (
            <AttendanceRecordsTab teacherId={teacher.id || teacher.teacher_id} />
          )}
        </div>
      </div>

      {showCreateSubject && (
        <CreateSubjectModal
          teacherId={teacher.id || teacher.teacher_id}
          onClose={() => { setShowCreateSubject(false); setSubjects(null); }}
        />
      )}
      {shareTarget && (
        <ShareSubjectModal subject={shareTarget} onClose={() => setShareTarget(null)} />
      )}
    </div>
  );
}

// ── Auth form wrapper
function AuthCard({ children, title, subtitle }) {
  return (
    <div className="w-full flex-grow flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-4xl p-8 shadow-modal animate-slide-up">
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center mb-5 shadow-glow-violet">
            <span className="text-white font-bold font-mono text-sm">SC</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Teacher Login ─────────────────────────────────────────────────────────────
function TeacherLogin({ onRegister }) {
  const { setTeacher } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return setError("Fill in all fields");
    setLoading(true);
    setError("");
    try {
      const data = await api.teacherLogin(username, password);
      setTeacher(data.teacher);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Teacher Sign In" subtitle="Welcome back! Enter your credentials to continue.">
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
          <input className={inputCls} placeholder="your_username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
          <input className={inputCls} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-bold rounded-xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>
        <button
          onClick={onRegister}
          className="w-full py-3.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 active:scale-[0.98] transition-all duration-200"
        >
          Create an account
        </button>
      </div>
    </AuthCard>
  );
}

// ── Teacher Register ──────────────────────────────────────────────────────────
function TeacherRegister({ onLogin }) {
  const [form, setForm] = useState({ username: "", name: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.username || !form.name || !form.password) return setError("All fields are required");
    if (form.password !== form.confirm) return setError("Passwords don't match");
    setLoading(true);
    setError("");
    try {
      await api.teacherRegister(form.username, form.password, form.name);
      setSuccess("Account created! Redirecting…");
      setTimeout(onLogin, 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "username", label: "Username",        type: "text",     ph: "john_doe" },
    { key: "name",     label: "Full Name",        type: "text",     ph: "John Doe" },
    { key: "password", label: "Password",         type: "password", ph: "••••••••" },
    { key: "confirm",  label: "Confirm Password", type: "password", ph: "••••••••" },
  ];

  return (
    <AuthCard title="Create Account" subtitle="Join SnapClass as a teacher.">
      {error && (
        <div className="mb-5 flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-5 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
          ✅ {success}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {fields.map(({ key, label, type, ph }) => (
          <div key={key}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            <input className={inputCls} type={type} placeholder={ph} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-bold rounded-xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
        >
          {loading ? "Creating…" : "Create Account →"}
        </button>
        <button
          onClick={onLogin}
          className="w-full py-3.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 active:scale-[0.98] transition-all duration-200"
        >
          Already have an account? Sign in
        </button>
      </div>
    </AuthCard>
  );
}

// ── Teacher Screen ─────────────────────────────────────────────────────────────
export default function TeacherScreen() {
  const { teacher } = useApp();
  const [authMode, setAuthMode] = useState("login");

  if (teacher) return <TeacherDashboard />;

  return authMode === "login"
    ? <TeacherLogin onRegister={() => setAuthMode("register")} />
    : <TeacherRegister onLogin={() => setAuthMode("login")} />;
}
