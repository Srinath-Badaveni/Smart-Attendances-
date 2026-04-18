export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold font-mono">SC</span>
            </div>
            <span className="font-display font-semibold text-slate-700">
              Snap<span className="text-violet-600">Class</span>
            </span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} SnapClass AI Attendance. Built with ❤️
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Support"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-slate-400 font-medium hover:text-violet-600 transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
