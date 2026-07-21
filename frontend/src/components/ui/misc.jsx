import { motion, AnimatePresence } from 'framer-motion'

export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 shrink-0 ${
        checked ? 'bg-brand-gradient' : 'bg-white/10'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ x: checked ? 28 : 0 }}
      />
    </button>
  )
}

const badgeTones = {
  indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/20',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-400/20',
  azure: 'bg-azure-500/15 text-azure-300 border-azure-400/20',
  mint: 'bg-mint-500/15 text-mint-400 border-mint-400/20',
  amber: 'bg-amber-400/15 text-amber-400 border-amber-400/20',
  rose: 'bg-rose-400/15 text-rose-400 border-rose-400/20',
  neutral: 'bg-white/[0.06] text-ink-300 border-white/10',
}

export function Badge({ children, tone = 'indigo', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${badgeTones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function StatCard({ label, value, icon: Icon, tone = 'indigo', delay = 0 }) {
  const toneMap = {
    indigo: 'text-indigo-300',
    violet: 'text-violet-300',
    azure: 'text-azure-300',
    mint: 'text-mint-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    neutral: 'text-ink-50',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl glass-panel glass-panel-hover p-5 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-card-sheen opacity-60" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-ink-400 text-xs font-medium uppercase tracking-wide mb-2">{label}</p>
          <p className={`text-3xl font-bold num ${toneMap[tone]}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-white/[0.06] border border-white/10 ${toneMap[tone]}`}>
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start justify-between gap-4 mb-8 flex-wrap"
    >
      <div>
        <h1 className="text-2xl md:text-[1.75rem] font-bold text-ink-50 tracking-tight">{title}</h1>
        {subtitle && <p className="text-ink-400 mt-1.5 text-sm">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}

export function Alert({ children, tone = 'mint' }) {
  const tones = {
    mint: 'bg-mint-500/10 border-mint-400/25 text-mint-400',
    rose: 'bg-rose-400/10 border-rose-400/25 text-rose-400',
    amber: 'bg-amber-400/10 border-amber-400/25 text-amber-400',
    indigo: 'bg-indigo-500/10 border-indigo-400/25 text-indigo-300',
  }
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
        animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className={`px-4 py-3 rounded-xl border text-sm font-medium overflow-hidden ${tones[tone]}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="text-left text-ink-500 text-xs uppercase tracking-wide border-b border-white/[0.08]">
            {columns.map((c) => (
              <th key={c} className="pb-3 px-2 font-medium whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Loader({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative w-14 h-16" style={{ perspective: '400px' }}>
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-7 h-7 rounded-full bg-brand-gradient shadow-glow-indigo flex items-center justify-center text-[10px] font-bold text-white"
          animate={{ y: [0, 26, 26, 0], rotateY: [0, 720, 720, 720], opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, times: [0, 0.55, 0.7, 1], ease: 'easeIn' }}
        >
          ₹
        </motion.div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full bg-white/10 blur-[2px]" />
      </div>
      <p className="text-ink-400 text-sm font-medium tracking-wide">{label}</p>
    </div>
  )
}
