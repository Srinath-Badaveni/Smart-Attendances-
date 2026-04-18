export default function SubjectCard({ name, code, section, stats = [], footer, onClick }) {
  return (
    <div
      className={`group relative bg-white border border-violet-100 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full hover:border-violet-300 hover:shadow-glow-violet hover:-translate-y-1.5 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-rose-400 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex-grow min-w-0">
            <h3 className="font-display font-semibold text-[15px] text-slate-900 leading-snug truncate mb-0.5">{name}</h3>
            <p className="text-xs text-slate-400 font-medium">{section}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="font-mono text-[11px] font-bold px-2.5 py-1 bg-violet-100 text-violet-700 border border-violet-200 rounded-lg tracking-widest">
              {code}
            </span>
            {onClick && (
              <span className="text-[10px] font-semibold text-violet-400 group-hover:text-violet-600 transition-colors">
                View →
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-violet-50">
            {stats.map(([icon, label, value]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full">
                <span>{icon}</span>
                <span className="font-bold text-slate-800">{value}</span>
                <span className="text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer action */}
      {footer && (
        <div className="px-6 pb-6" onClick={(e) => e.stopPropagation()}>
          {footer}
        </div>
      )}
    </div>
  );
}
