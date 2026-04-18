import { useState } from "react";
import * as api from "../api/client";

const inputCls =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-all duration-200";

export default function CreateSubjectModal({ teacherId, onClose }) {
  const [form, setForm]     = useState({ code: "", name: "", section: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!form.code || !form.name || !form.section) return setError("All fields required");
    setLoading(true);
    try {
      await api.createSubject(form.code, form.name, form.section, teacherId);
      onClose();
    } catch (e) {
      let errText = e.message || String(e);
      if (errText === "[object Object]" && e.detail) errText = JSON.stringify(e.detail);
      else if (errText === "[object Object]" && typeof e === "object") errText = JSON.stringify(e);
      setError(errText);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "code",    label: "Subject Code", ph: "e.g. CS101", mono: true },
    { key: "name",    label: "Subject Name", ph: "e.g. Data Structures" },
    { key: "section", label: "Section",      ph: "e.g. A" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-4xl shadow-modal animate-slide-up overflow-hidden">
        
        {/* Header stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500" />

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">Create Subject</h3>
              <p className="text-sm text-slate-500 mt-0.5">Add a new class to your dashboard</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-lg transition-colors"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium break-words">
              <span className="shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4 mb-7">
            {fields.map(({ key, label, ph, mono }) => (
              <div key={key}>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
                <input
                  className={`${inputCls} ${mono ? "font-mono tracking-widest uppercase" : ""}`}
                  placeholder={ph}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-bold rounded-xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
            >
              {loading ? "Creating…" : "Create Subject →"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 active:scale-[0.98] transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
