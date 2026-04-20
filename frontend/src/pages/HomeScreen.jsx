import { useApp } from "../context/AppContext";

const features = [
  {
    icon: "📸",
    color: "from-violet-500 to-violet-400",
    bg: "bg-violet-50",
    title: "Face Recognition",
    desc: "Instant biometric login. Snap a photo, mark attendance — all under a second.",
  },
  {
    icon: "🎙️",
    color: "from-rose-500 to-rose-400",
    bg: "bg-rose-50",
    title: "Voice Biometrics",
    desc: "Unique voiceprint identification for low-light or remote scenarios.",
  },
  {
    icon: "📊",
    color: "from-emerald-500 to-emerald-400",
    bg: "bg-emerald-50",
    title: "Real-Time Analytics",
    desc: "Live dashboards with per-subject attendance heatmaps and export ready data.",
  },
];

const stats = [
  { value: "99.2%", label: "Recognition Accuracy" },
  { value: "<1s", label: "Identification Speed" },
  { value: "∞", label: "Students Supported" },
];

export default function HomeScreen() {
  const { setScreen } = useApp();

  return (
    <div className="w-full flex-grow flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
        {/* Mesh overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 60%, rgba(139,92,246,0.4) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(244,63,94,0.25) 0%, transparent 50%)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold tracking-wide uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            NoProxy — AI Attendance
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight mb-6">
            Attendance,{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-rose-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Replace manual roll calls with instant face and voice recognition.
            <br className="hidden sm:block" />
            Secure, accurate, and blazing fast.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setScreen("student")}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-base rounded-2xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Student Portal</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
            <button
              onClick={() => setScreen("teacher")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-base rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Teacher Portal
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="py-6 px-4 bg-white/5 text-center">
                <p className="font-display font-bold text-3xl text-white">{s.value}</p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-600 font-semibold text-sm uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900">
              Everything you need
            </h2>
            <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">
              One platform, endless possibilities for modern classrooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-white border border-slate-200 rounded-3xl p-8 hover:border-violet-200 hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 cursor-default"
              >
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-xl text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-[15px]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal CTA */}
      <section className="bg-white py-20 px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          <button
            onClick={() => setScreen("student")}
            className="group relative overflow-hidden bg-gradient-to-br from-violet-600 to-violet-500 rounded-3xl p-8 text-left hover:from-violet-700 hover:to-violet-600 hover:shadow-glow-violet transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative">
              <img src="https://i.ibb.co/844D9Lrt/mascot-student.png" alt="Student" className="w-20 h-20 object-contain mb-4" />
              <h3 className="font-display font-bold text-2xl text-white mb-2">I'm a Student</h3>
              <p className="text-violet-200 text-sm mb-6">Face scan login. View your subjects and attendance.</p>
              <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                Enter Portal <span>→</span>
              </span>
            </div>
          </button>

          <button
            onClick={() => setScreen("teacher")}
            className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-left hover:from-slate-800 hover:to-slate-700 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-slate-700"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative">
              <img src="https://i.ibb.co/CsmQQV6X/mascot-prof.png" alt="Teacher" className="w-20 h-20 object-contain mb-4" />
              <h3 className="font-display font-bold text-2xl text-white mb-2">I'm a Teacher</h3>
              <p className="text-slate-400 text-sm mb-6">Manage subjects, run AI attendance sessions, view records.</p>
              <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                Enter Portal <span>→</span>
              </span>
            </div>
          </button>

        </div>
      </section>
    </div>
  );
}
