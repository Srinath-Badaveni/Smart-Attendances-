import { useState, useRef, useEffect } from "react";
import * as api from "../api/client";
import AttendanceResultModal from "./AttendanceResultModal";

const selectCls =
  "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-all duration-200 font-mono shadow-sm cursor-pointer";

export default function TakeAttendanceTab({ teacher, subjects }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.subject_id || "");
  const [images,  setImages]  = useState([]);
  const [results, setResults] = useState(null);
  const [mode,    setMode]    = useState("photos"); // 'photos' | 'voice'
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const fileRef = useRef(null);
  const [audioBlob,  setAudioBlob]  = useState(null);
  const [recording,  setRecording]  = useState(false);
  const mediaRecorderRef = useRef(null);

  // Sync selected subject whenever subjects prop loads/changes
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].subject_id);
    }
  }, [subjects]);

  if (!subjects.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
        <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-3xl mb-4">🎯</div>
        <p className="font-semibold text-slate-700">No subjects yet</p>
        <p className="text-sm text-slate-400 mt-1">Create a subject first to start taking attendance.</p>
      </div>
    );
  }

  const handleFileAdd = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((f) => ({ blob: f, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...newImgs]);
  };

  const runFaceAnalysis = async () => {
    if (!selectedSubjectId) return setError("Select a subject first");
    if (!images.length) return setError("Add at least one photo");
    setLoading(true); setError("");
    try {
      const data = await api.runFaceAttendance(selectedSubjectId, images.map((i) => i.blob));
      setResults(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };


  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    const chunks = [];
    mr.ondataavailable = (e) => chunks.push(e.data);
    mr.onstop = () => {
      setAudioBlob(new Blob(chunks, { type: "audio/webm" }));
      stream.getTracks().forEach((t) => t.stop());
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const runVoiceAnalysis = async () => {
    if (!audioBlob) return setError("Record audio first");
    setLoading(true); setError("");
    try {
      const data = await api.runVoiceAttendance(selectedSubjectId, audioBlob);
      setResults(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">

      {/* Page title */}
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-900">AI Attendance</h2>
        <p className="text-sm text-slate-500 mt-0.5">Select a subject and run biometric recognition</p>
      </div>

      {/* Subject selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-sm">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Subject</label>
        <select className={selectCls} value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(Number(e.target.value))}>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>{s.name} — {s.subject_code}</option>
          ))}
        </select>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: "photos", label: "Face Recognition", icon: "📸" },
          { id: "voice",  label: "Voice Recognition", icon: "🎙" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === m.id
                ? "bg-white text-violet-700 shadow-sm border border-violet-100"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
            }`}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700">
          ⚠️ {error}
        </div>
      )}

      {/* ── Face Mode ── */}
      {mode === "photos" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-800">Upload Classroom Photos</p>
            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current.click()}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg active:scale-95 transition-all"
              >
                + Add photos
              </button>
              {images.length > 0 && (
                <button
                  onClick={() => setImages([])}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg active:scale-95 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileAdd} />

          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group/thumb">
                  <img
                    src={img.url}
                    alt={`Photo ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-xl border border-slate-200 shadow-sm group-hover/thumb:border-violet-300 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 rounded-xl transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-bold opacity-0 group-hover/thumb:opacity-100 transition-opacity">P{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-all duration-200"
              onClick={() => fileRef.current.click()}
            >
              <span className="text-4xl mb-3">🖼️</span>
              <p className="text-sm font-semibold text-slate-600">Drop photos here or click to upload</p>
              <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP</p>
            </div>
          )}

          <button
            onClick={runFaceAnalysis}
            disabled={loading || !images.length}
            className="w-full py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white font-bold text-sm rounded-2xl shadow-glow-violet active:scale-[0.99] disabled:opacity-40 transition-all duration-200"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing…</>
            ) : (
              <><span>🔍</span> Run Face Analysis ({images.length} photo{images.length !== 1 ? "s" : ""})</>
            )}
          </button>
        </div>
      )}

      {/* ── Voice Mode ── */}
      {mode === "voice" && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-center border border-slate-700 space-y-6">
          <div>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 transition-all duration-300 ${recording ? "bg-rose-500 recording-pulse" : "bg-slate-700"}`}>
              🎙
            </div>
            <h3 className="font-display font-semibold text-white text-lg">Voice Biometrics</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
              Record students saying <span className="font-mono text-rose-300">"I am present"</span>. AI identifies each speaker.
            </p>
          </div>

          <div className="flex justify-center">
            {!recording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-3 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-2xl shadow-glow-rose active:scale-95 transition-all"
              >
                <span className="text-lg">🎙</span> Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-3 px-8 py-4 bg-white/15 hover:bg-white/25 border border-rose-400 text-white font-bold text-sm rounded-2xl recording-pulse active:scale-95 transition-all"
              >
                <span className="w-3 h-3 bg-rose-400 rounded-sm" /> Stop Recording
              </button>
            )}
          </div>

          {audioBlob && (
            <div className="bg-white/10 rounded-2xl p-4">
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full max-w-sm mx-auto" />
            </div>
          )}

          <button
            onClick={runVoiceAnalysis}
            disabled={loading || !audioBlob}
            className="w-full max-w-sm mx-auto py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold text-sm rounded-2xl shadow-glow-rose active:scale-[0.99] disabled:opacity-40 transition-all duration-200"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing…</>
            ) : (
              <><span>🔍</span> Analyze Audio</>
            )}
          </button>
        </div>
      )}

      {results && (
        <AttendanceResultModal results={results.results} logs={results.logs} onClose={() => setResults(null)} />
      )}
    </div>
  );
}
