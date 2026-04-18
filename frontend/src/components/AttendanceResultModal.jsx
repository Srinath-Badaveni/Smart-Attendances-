import { useState } from "react";
import * as api from "../api/client";

export default function AttendanceResultModal({ results, logs, onClose }) {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveAttendance(logs);
      setSaved(true);
      setTimeout(onClose, 1500);
    } catch (e) {
      alert("Failed to save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const present = results.filter((r) => r.status === "present").length;
  const absent  = results.length - present;
  const pct     = results.length ? Math.round((present / results.length) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-4xl shadow-modal animate-slide-up overflow-hidden max-h-[92vh] flex flex-col">

        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 shrink-0" />

        <div className="p-8 pb-6 shrink-0">
          {/* Header + summary */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">Attendance Results</h3>
              <p className="text-sm text-slate-500 mt-0.5">Review before confirming</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-lg transition-colors shrink-0">×</button>
          </div>

          {/* Summary chips */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-emerald-700">{present} Present</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-sm font-bold text-rose-700">{absent} Absent</span>
            </div>
            <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-xl">
              <span className="text-sm font-bold text-violet-700">{pct}% Rate</span>
            </div>
          </div>
        </div>

        {/* Table (scrollable) */}
        <div className="flex-grow overflow-y-auto mx-8 mb-6 border border-slate-200 rounded-2xl">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Source</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{r.name}</td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{r.source || "—"}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {r.status === "present" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 text-[11px] font-bold rounded-full border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className="px-8 pb-8 shrink-0">
          {saved && (
            <div className="flex items-center justify-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-bold mb-4">
              ✅ Attendance saved!
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-2xl hover:bg-slate-200 active:scale-[0.98] transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="flex-[2] py-3.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-bold rounded-2xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
            >
              {saving ? "Saving…" : "✅ Confirm & Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
