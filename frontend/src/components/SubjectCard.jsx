export default function SubjectCard({ name, code, section, stats = [], footer }) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-violet-200 hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      
      {/* Top gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 opacity-70 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-[15px] text-slate-900 leading-tight mb-1">{name}</h3>
            <p className="text-xs text-slate-400 font-medium">{section}</p>
          </div>
          <span className="shrink-0 font-mono text-xs font-bold px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg tracking-widest">
            {code}
          </span>
        </div>

        {/* Stats chips */}
        {stats.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100">
            {stats.map(([icon, label, value]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
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
        <div className="px-6 pb-6">
          {footer}
        </div>
      )}
    </div>
  );
}
