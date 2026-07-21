function Input({ label, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-xs font-medium text-ink-400 mb-1.5 block uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-ink-50 placeholder:text-ink-600 outline-none transition-all duration-200 focus:border-indigo-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/10 ${className}`}
        {...props}
      />
    </div>
  )
}

export function Select({ label, className = '', children, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-xs font-medium text-ink-400 mb-1.5 block uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-ink-50 outline-none transition-all duration-200 focus:border-indigo-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/10 [&>option]:bg-base-850 [&>option]:text-ink-50 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export default Input
