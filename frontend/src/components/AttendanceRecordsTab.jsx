import { useState, useEffect } from "react";
import * as api from "../api/client";

export default function AttendanceRecordsTab({ teacherId }) {
  const [records, setRecords] = useState(null);

  useEffect(() => {
    api.getTeacherAttendanceRecords(teacherId).then((d) => setRecords(d.records));
  }, [teacherId]);

  if (!records) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-3 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-4" style={{borderWidth: "3px"}} />
      <p className="text-sm text-slate-400 font-medium">Loading records…</p>
    </div>
  );

  if (!records.length) return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mb-4">📋</div>
      <p className="font-semibold text-slate-700">No records yet</p>
      <p className="text-sm text-slate-400 mt-1">Attendance records will appear here after sessions.</p>
    </div>
  );

  // Group by timestamp + subject
  const grouped = {};
  records.forEach((r) => {
    const ts  = r.timestamp?.split(".")[0] || r.timestamp;
    const key = `${ts}__${r.subjects?.subject_id}`;
    if (!grouped[key]) {
      grouped[key] = {
        time: ts
          ? new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
          : "N/A",
        subject: r.subjects?.name || "—",
        code:    r.subjects?.subject_code || "—",
        present: 0,
        total:   0,
      };
    }
    grouped[key].total += 1;
    if (r.is_present) grouped[key].present += 1;
  });

  const rows = Object.values(grouped).sort((a, b) => b.time.localeCompare(a.time));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-900">Attendance Records</h2>
        <p className="text-sm text-slate-500 mt-0.5">{rows.length} session{rows.length !== 1 ? "s" : ""} recorded</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Code</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row, i) => {
              const pct = row.total ? Math.round((row.present / row.total) * 100) : 0;
              const pctColor = pct >= 75 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : pct >= 50 ? "text-amber-600 bg-amber-50 border-amber-100" : "text-rose-600 bg-rose-50 border-rose-100";
              return (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-800 text-[13px] font-mono whitespace-nowrap">{row.time}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 text-[13px]">{row.subject}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[11px] font-bold px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg tracking-widest">
                      {row.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-600">
                    <span className="font-bold text-emerald-600">{row.present}</span>
                    <span className="text-slate-400"> / {row.total}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-grow max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${pctColor}`}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
