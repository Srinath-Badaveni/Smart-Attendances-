import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { screen, setScreen, teacher, student, logoutTeacher, logoutStudent } = useApp();

  const handleLogout = () => {
    if (teacher) logoutTeacher();
    if (student) logoutStudent();
  };

  const user = teacher || student;
  const role = teacher ? "Teacher" : student ? "Student" : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Brand */}
          <button
            onClick={() => setScreen("home")}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center shadow-glow-violet group-hover:scale-105 transition-transform duration-200">
              <span className="text-white text-xs font-bold font-mono">SC</span>
            </div>
            <span className="font-display font-700 text-lg text-slate-900 tracking-tight">
              Snap<span className="text-violet-600">Class</span>
            </span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => setScreen("teacher")}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200"
                >
                  Teacher Portal
                </button>
                <button
                  onClick={() => setScreen("student")}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-500 rounded-xl shadow-glow-violet hover:from-violet-700 hover:to-violet-600 active:scale-95 transition-all duration-200"
                >
                  Get Started →
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                  <span className="text-xs text-slate-400 font-mono">{role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 border border-rose-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
