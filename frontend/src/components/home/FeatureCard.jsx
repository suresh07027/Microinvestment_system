import { motion } from 'framer-motion'

function FeatureCard({
  icon: Icon,
  title,
  description,
  className = '',
  glow = 'indigo',
  pulse = false,
  initial,
  delay = 0,
}) {
  const glowClass =
    glow === 'amber'
      ? 'shadow-glow-violet hover:shadow-[0_0_40px_rgba(251,191,36,0.25)]'
      : glow === 'mint'
      ? 'hover:shadow-[0_0_40px_rgba(52,211,153,0.25)]'
      : 'shadow-glow-indigo hover:shadow-[0_0_40px_rgba(129,140,248,0.3)]'

  const iconTone =
    glow === 'amber' ? 'text-amber-400' : glow === 'mint' ? 'text-mint-400' : 'text-indigo-300'

  return (
    <motion.div
      initial={initial || { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={`relative overflow-hidden glass-panel rounded-3xl p-5 sm:p-6 transition-shadow duration-500 ${glowClass} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-card-sheen opacity-50" />
      <div className="relative">
        <div className={`relative w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-4 ${iconTone}`}>
          {pulse && (
            <motion.span
              className="absolute inset-0 rounded-2xl border border-current"
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <Icon size={20} />
        </div>
        <h3 className="text-ink-50 font-bold text-base sm:text-lg mb-1.5">{title}</h3>
        <p className="text-ink-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export default FeatureCard