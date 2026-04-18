import { useEffect, useRef } from "react";

const APP_DOMAIN = (import.meta.env.VITE_APP_DOMAIN || "http://localhost:5173").replace(/\/$/, "");

export default function ShareSubjectModal({ subject, onClose }) {
  const canvasRef = useRef(null);
  const joinUrl = `${APP_DOMAIN}/?join-code=${subject.subject_code}`;

  useEffect(() => {
    if (window.QRCode && canvasRef.current) {
      canvasRef.current.innerHTML = "";
      new window.QRCode(canvasRef.current, {
        text:         joinUrl,
        width:        160,
        height:       160,
        colorDark:    "#6d28d9",
        colorLight:   "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H,
      });
    }
  }, [joinUrl]);

  const copied = async () => {
    await navigator.clipboard.writeText(joinUrl);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-4xl shadow-modal animate-slide-up overflow-hidden">

        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">Share Class</h3>
              <p className="text-violet-600 font-semibold text-sm mt-0.5">{subject.name}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-lg transition-colors">×</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

            {/* Left: link / code info */}
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Join Code</p>
                <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
                  <span className="font-mono text-xl font-bold tracking-[0.25em] text-violet-700">{subject.subject_code}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(subject.subject_code)}
                    className="text-xs font-bold text-violet-500 hover:text-violet-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Join Link</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 space-y-2">
                  <p className="font-mono text-xs text-slate-500 break-all leading-relaxed">{joinUrl}</p>
                  <button
                    onClick={copied}
                    className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg active:scale-95 transition-all"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">Share via WhatsApp, Email, or Classroom</p>
            </div>

            {/* Right: QR */}
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-6 gap-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scan to Join</p>
              <div ref={canvasRef} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm" />
              <p className="text-[11px] text-slate-400 text-center">Students scan with camera</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-2xl hover:bg-slate-200 active:scale-[0.98] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
