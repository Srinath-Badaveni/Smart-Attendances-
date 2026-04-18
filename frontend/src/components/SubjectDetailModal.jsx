import { useState, useEffect } from "react";
import * as api from "../api/client";

// ── Shared helpers ─────────────────────────────────────────────────────────────
function Badge({ children, color = "violet" }) {
  const map = {
    violet: "bg-violet-100 text-violet-700 border-violet-200",
    rose:   "bg-rose-100   text-rose-700   border-rose-200",
    emerald:"bg-emerald-100 text-emerald-700 border-emerald-200",
    amber:  "bg-amber-100  text-amber-700  border-amber-200",
    slate:  "bg-slate-100  text-slate-600  border-slate-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono tracking-wide ${map[color]}`}>
      {children}
    </span>
  );
}

function StatBubble({ icon, label, value, color = "violet" }) {
  const bg = {
    violet: "bg-violet-50 border-violet-100",
    rose:   "bg-rose-50   border-rose-100",
    emerald:"bg-emerald-50 border-emerald-100",
    amber:  "bg-amber-50  border-amber-100",
  };
  return (
    <div className={`flex flex-col items-center justify-center px-5 py-4 rounded-2xl border ${bg[color]} text-center`}>
      <span className="text-2xl mb-1">{icon}</span>
      <p className="font-display font-bold text-2xl text-slate-900">{value}</p>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

// ── Teacher Subject Detail ─────────────────────────────────────────────────────
function TeacherSubjectDetail({ subject, onClose, onShare }) {
  const [tab, setTab]           = useState("overview");
  const [students, setStudents] = useState(null);
  const [logs,     setLogs]     = useState(null);

  useEffect(() => {
    api.getSubjectStudents(subject.subject_id).then((d) => setStudents(d.students));
    api.getSubjectAttendanceLogs(subject.subject_id).then((d) => setLogs(d.logs));
  }, [subject.subject_id]);

  // Build per-student stats from logs
  const studentStats = {};
  (logs || []).forEach((log) => {
    const sid = log.student_id;
    if (!studentStats[sid]) studentStats[sid] = { total: 0, present: 0 };
    studentStats[sid].total   += 1;
    if (log.is_present) studentStats[sid].present += 1;
  });

  // Unique sessions by timestamp
  const sessions = [...new Set((logs || []).map((l) => l.timestamp?.split(".")[0]))].sort((a, b) => b.localeCompare(a));

  const tabs = [
    { id: "overview", label: "Overview",  icon: "📋" },
    { id: "students", label: `Students (${students?.length ?? "…"})`, icon: "👥" },
    { id: "sessions", label: `Sessions (${sessions.length || "…"})`,  icon: "🕐" },
  ];

  const pct = sessions.length
    ? Math.round(((logs || []).filter((l) => l.is_present).length /
        ((logs || []).length || 1)) * 100)
    : 0;

  return (
    <>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatBubble icon="👥" label="Students"  value={students?.length ?? "…"} color="violet" />
        <StatBubble icon="📅" label="Sessions"  value={sessions.length || "—"} color="violet" />
        <StatBubble icon="✅" label="Avg Rate"  value={sessions.length ? `${pct}%` : "—"} color="emerald" />
        <StatBubble icon="🏷️" label="Section"  value={subject.section}         color="amber"  />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-violet-50 rounded-xl mb-5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              tab === t.id
                ? "bg-white text-violet-700 shadow-sm border border-violet-100"
                : "text-slate-500 hover:text-violet-600"
            }`}
          >
            <span>{t.icon}</span> <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-4">
          <div className="bg-violet-50/60 border border-violet-100 rounded-2xl p-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Subject Info</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Subject Code", <Badge>{subject.subject_code}</Badge>],
                ["Section",      subject.section],
                ["Subject ID",   `#${subject.subject_id}`],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold mb-0.5">{k}</p>
                  <p className="font-semibold text-slate-800">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onShare}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
          >
            🔗 Share Join Code &amp; QR
          </button>
        </div>
      )}

      {/* Students */}
      {tab === "students" && (
        <div className="space-y-2">
          {students === null ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>
          ) : students.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No students enrolled yet.</div>
          ) : students.map((node, i) => {
            const s   = node.students;
            const sid = s?.id || s?.student_id;
            const st  = studentStats[sid] || { total: 0, present: 0 };
            const p   = st.total ? Math.round((st.present / st.total) * 100) : null;
            return (
              <div key={i} className="flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl hover:border-violet-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {s?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">{s?.name}</span>
                </div>
                {p !== null ? (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className={`h-full rounded-full ${p >= 75 ? "bg-emerald-500" : p >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${p}%` }} />
                    </div>
                    <Badge color={p >= 75 ? "emerald" : p >= 50 ? "amber" : "rose"}>{p}%</Badge>
                  </div>
                ) : <Badge color="slate">No data</Badge>}
              </div>
            );
          })}
        </div>
      )}

      {/* Sessions */}
      {tab === "sessions" && (
        <div className="space-y-2">
          {logs === null ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No sessions yet.</div>
          ) : sessions.map((ts, i) => {
            const sessionLogs = (logs || []).filter((l) => l.timestamp?.startsWith(ts));
            const present = sessionLogs.filter((l) => l.is_present).length;
            const total   = sessionLogs.length;
            const pct     = total ? Math.round((present / total) * 100) : 0;
            return (
              <div key={i} className="flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl hover:border-violet-200 transition-colors">
                <div>
                  <p className="font-mono text-xs text-slate-500">
                    {ts ? new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    <span className="text-emerald-600 font-bold">{present}</span> / {total} present
                  </p>
                </div>
                <Badge color={pct >= 75 ? "emerald" : pct >= 50 ? "amber" : "rose"}>{pct}%</Badge>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ── Student Subject Detail ─────────────────────────────────────────────────────
function StudentSubjectDetail({ subject, studentId, onClose }) {
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    api.getStudentSubjectAttendance(subject.subject_id, studentId).then((d) => setLogs(d.logs));
  }, [subject.subject_id, studentId]);

  const total   = (logs || []).length;
  const present = (logs || []).filter((l) => l.is_present).length;
  const absent  = total - present;
  const pct     = total ? Math.round((present / total) * 100) : 0;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatBubble icon="📅" label="Total"    value={total || "—"}   color="violet" />
        <StatBubble icon="✅" label="Present"  value={present || "—"} color="emerald" />
        <StatBubble icon="❌" label="Absent"   value={absent || "—"}  color="rose" />
        <StatBubble icon="🎯" label="Rate"     value={total ? `${pct}%` : "—"} color={pct >= 75 ? "emerald" : "amber"} />
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mb-6 bg-violet-50 border border-violet-100 rounded-2xl p-4">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Attendance Progress</span>
            <span className={pct >= 75 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-rose-600"}>{pct}%</span>
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            {pct >= 75 ? "✅ Good standing" : pct >= 50 ? "⚠️ Needs improvement" : "🚨 Below minimum attendance"}
          </p>
        </div>
      )}

      {/* Session list */}
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Session History</p>
      <div className="space-y-2">
        {logs === null ? (
          <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">No sessions recorded yet.</div>
        ) : [...logs].sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || "")).map((log, i) => {
          const ts = log.timestamp?.split(".")[0];
          return (
            <div key={i} className="flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl">
              <p className="font-mono text-xs text-slate-500">
                {ts ? new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
              </p>
              {log.is_present
                ? <Badge color="emerald">✅ Present</Badge>
                : <Badge color="rose">❌ Absent</Badge>
              }
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Main Modal Shell ──────────────────────────────────────────────────────────
export default function SubjectDetailModal({ subject, role, studentId, onClose, onShare }) {
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-4xl shadow-modal overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">

        {/* Gradient header */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 shrink-0" />

        {/* Header */}
        <div className="px-8 pt-7 pb-5 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-violet-100 text-violet-700 border border-violet-200 rounded-lg tracking-widest">
                  {subject.subject_code}
                </span>
                <span className="text-xs text-slate-400 font-medium">§ {subject.section}</span>
              </div>
              <h2 className="font-display font-bold text-xl text-slate-900">{subject.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 text-xl transition-colors shrink-0"
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-grow overflow-y-auto px-8 py-6">
          {role === "teacher" ? (
            <TeacherSubjectDetail subject={subject} onClose={onClose} onShare={() => { onClose(); onShare(subject); }} />
          ) : (
            <StudentSubjectDetail subject={subject} studentId={studentId} onClose={onClose} />
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-7 pt-4 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-2xl transition-all active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
