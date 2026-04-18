import { useState } from "react";
import * as api from "../api/client";

const inputCls =
  "w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-mono font-bold text-slate-800 placeholder-slate-300 tracking-[0.3em] uppercase text-center focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-all duration-200";

export default function EnrollModal({ studentId, onClose, initialCode = "" }) {
  const [code,    setCode]    = useState(initialCode);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!code.trim()) return setError("Please enter a subject code");
    setLoading(true); setError("");
    try {
      await api.enrollStudent(studentId, code.trim().toUpperCase());
      setSuccess("Enrolled successfully! 🎉");
      setTimeout(onClose, 1200);
    } catch (e) {
      let errText = e.message || String(e);
      if (errText === "[object Object]" && e.detail) errText = JSON.stringify(e.detail);
      else if (errText === "[object Object]" && typeof e === "object") errText = JSON.stringify(e);
      setError(errText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-4xl shadow-modal animate-slide-up overflow-hidden">
        
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">Enroll in Subject</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {initialCode ? "You were invited via a join link" : "Enter the code from your teacher"}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-lg transition-colors">×</button>
          </div>

          {/* Auto-fill banner when opened via URL */}
          {initialCode && !error && !success && (
            <div className="mb-5 flex items-center gap-3 p-4 bg-violet-50 border border-violet-200 rounded-xl">
              <span className="text-xl">🔗</span>
              <div>
                <p className="text-sm font-bold text-violet-800">Join code detected!</p>
                <p className="text-xs text-violet-600 mt-0.5">Code <span className="font-mono font-bold">{initialCode}</span> was loaded from the invite link.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium break-words">
              <span className="shrink-0">⚠️</span><span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-5 flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-bold">
              {success}
            </div>
          )}

          {/* Code input */}
          <div className="mb-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Subject Code</label>
            <input
              className={inputCls}
              placeholder="CS101"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnroll()}
            />
            <p className="text-[11px] text-slate-400 mt-2 text-center">Ask your teacher for the class code</p>
          </div>

          <div className="mt-7 flex flex-col gap-2.5">
            <button
              onClick={handleEnroll}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-bold rounded-2xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
            >
              {loading ? "Joining…" : "Join Subject →"}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-100 text-slate-500 text-sm font-semibold rounded-2xl hover:bg-slate-200 active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
