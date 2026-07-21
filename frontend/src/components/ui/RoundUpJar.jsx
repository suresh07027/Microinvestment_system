import { motion } from 'framer-motion'

/**
 * Signature animated element for the microinvestment product:
 * loose change continuously "rounds up" and drops into a glass jar,
 * whose fill level reflects the user's real totalInvested amount.
 */
function RoundUpJar({ totalInvested = 0, goal = 500 }) {
  const fillPct = Math.max(4, Math.min(100, (totalInvested / goal) * 100))
  const coins = [0, 1, 2]

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[220px]">
      {/* falling coins */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-6">
        {coins.map((i) => (
          <motion.div
            key={i}
            className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-violet-500 shadow-glow-violet flex items-center justify-center text-[10px] font-bold text-base-950"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              y: [0, 92, 92],
              rotateY: [0, 900],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeIn',
              times: [0, 0.75, 0.9, 1],
            }}
          >
            ₹
          </motion.div>
        ))}
      </div>

      {/* jar */}
      <svg viewBox="0 0 160 180" className="w-40 h-44 relative z-10" fill="none">
        <defs>
          <linearGradient id="jarFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <clipPath id="jarClip">
            <path d="M28 46 Q28 170 80 170 Q132 170 132 46 L132 40 L28 40 Z" />
          </clipPath>
        </defs>

        {/* liquid fill, animated height */}
        <motion.rect
          x="20"
          width="120"
          fill="url(#jarFill)"
          clipPath="url(#jarClip)"
          initial={{ y: 170, height: 0 }}
          animate={{ y: 170 - (130 * fillPct) / 100, height: (130 * fillPct) / 100 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          opacity={0.85}
        />

        {/* jar outline */}
        <path
          d="M28 46 Q28 170 80 170 Q132 170 132 46"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M24 36 L136 36 L132 46 L28 46 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <rect x="56" y="18" width="48" height="20" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

        {/* shine */}
        <path d="M40 60 Q38 130 66 158" stroke="rgba(255,255,255,0.25)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default RoundUpJar
