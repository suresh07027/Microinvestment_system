import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Wallet,
  BarChart3,
  Layers,
  TrendingUp,
  PieChart,
  Coins,
  PiggyBank,
  Target,
  Car,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { API_URL } from '../../config'
import financeBg from '../../assets/dashboard-bg.png'

const coinHeights = [2, 3, 4, 3, 5, 6, 5, 7, 8, 7, 9, 10, 9, 11, 12, 11, 13, 14]

/**
 * Full-viewport, 3D animated background image — rendered through a portal
 * straight into document.body so it truly covers the whole app shell
 * (sidebar, top nav, and page content), not just this page's own container.
 * Framer Motion's `transform` on ancestor elements would otherwise turn a
 * normal `position: fixed` div into something scoped to its parent, so the
 * portal sidesteps that entirely.
 */
function FullPageAnimatedBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), { stiffness: 50, damping: 20 })
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), { stiffness: 50, damping: 20 })
  const bgRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-3, 3]), { stiffness: 50, damping: 20 })
  const bgRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [3, -3]), { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5)
      mouseY.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [mouseX, mouseY])

  return createPortal(
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ perspective: 1600 }}>
      <motion.div
        className="absolute -inset-8"
        style={{
          x: bgX,
          y: bgY,
          rotateX: bgRotateX,
          rotateY: bgRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.img
          src={financeBg}
          alt=""
          className="w-full h-full object-cover scale-110"
          style={{ filter: 'brightness(1.35) saturate(1.15)' }}
          animate={{ scale: [1.1, 1.16, 1.1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* light wash, just enough for text/icon contrast across the whole app */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-950/35 via-base-950/20 to-base-950/45" />
    </div>,
    document.body
  )
}

/* Lighter, more see-through glass box than the default Card component,
   so the bright background illustration reads clearly through it. */
function GlassBox({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl bg-white/[0.03] backdrop-blur-[3px] border border-white/[0.08] overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  )
}

function StatPanel({ label, value, icon: Icon, caption, delay = 0 }) {
  return (
    <GlassBox delay={delay} className="p-5 min-h-[220px] flex flex-col">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-200">{label}</p>
        <div className="p-2 rounded-xl bg-white/[0.08] border border-white/15 text-ink-50 shrink-0">
          <Icon size={16} strokeWidth={2} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white num mt-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
        {value}
      </p>
      <div className="flex-1" />
      {caption && <p className="text-xs font-medium text-ink-100/90">{caption}</p>}
    </GlassBox>
  )
}

function Dashboard() {
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [roundLevel, setRoundLevel] = useState(10)

  useEffect(() => {
    let userData = null
    try {
      userData = JSON.parse(localStorage.getItem('user'))
    } catch {
      userData = null
    }
    setUser(userData)
    if (!userData?._id) return

    fetch(`${API_URL}/api/transactions/${userData._id}`)
      .then((res) => res.json())
      .then((data) => setTransactions(Array.isArray(data) ? data : []))
      .catch(() => {})

    fetch(`${API_URL}/api/users/${userData._id}`)
      .then((res) => res.json())
      .then((data) => setRoundLevel(data.roundUpLevel || 10))
      .catch(() => {})
  }, [])

  const totalInvested = transactions.reduce((sum, t) => sum + (t.investedAmount || 0), 0)
  const firstName = user?.name?.split(' ')[0] || 'there'
  const sampleSpend = 14.5
  const roundedUp = Math.ceil(sampleSpend / roundLevel) * roundLevel

  const buckets = [
    { label: 'Emergency Fund', icon: PiggyBank },
    { label: 'Custom Goal', icon: Target },
    { label: 'New Car', icon: Car },
  ]

  return (
    <div className="relative">
      {/* background now covers the whole app shell (sidebar, top nav, content) via portal */}
      <FullPageAnimatedBackground />

      <div className="relative space-y-6">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <Sparkles size={18} className="absolute -top-1 right-1 text-amber-200 hidden sm:block" />
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-ink-100/90 mt-1.5 text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            Here is your investment overview
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-stretch">
          {/* left stacked cards */}
          <div className="flex flex-col gap-5">
            {/* Automatic Round-Ups */}
            <GlassBox className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-100 mb-3">
                Automatic Round-Ups
              </p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.08] border border-white/15 text-sm font-semibold text-white">
                    ₹{sampleSpend.toFixed(2)}
                  </span>
                  <ArrowRight size={15} className="text-ink-100" />
                  <span className="px-3 py-1.5 rounded-xl bg-mint-500/20 border border-mint-400/40 text-sm font-semibold text-mint-300">
                    ₹{roundedUp}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-full bg-white/[0.08] border border-white/15 grid place-items-center shrink-0">
                  <PiggyBank size={18} className="text-white" />
                </div>
              </div>
            </GlassBox>

            {/* Diversified Investing */}
            <GlassBox className="p-5" delay={0.05}>
              <div className="flex items-center gap-2.5 mb-3">
                {[TrendingUp, BarChart3, PieChart].map((Icon, i) => (
                  <span
                    key={i}
                    className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/15 grid place-items-center text-white"
                  >
                    <Icon size={15} />
                  </span>
                ))}
                <span className="w-9 h-9 rounded-full bg-amber-400/25 border border-amber-300/40 grid place-items-center text-amber-200">
                  <Coins size={15} />
                </span>
                <span className="h-9 px-2.5 rounded-full bg-indigo-500/25 border border-indigo-300/40 grid place-items-center text-[10px] font-bold text-indigo-200">
                  ETF
                </span>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-100">
                Diversified Investing
              </p>
            </GlassBox>

            {/* Custom Goal Buckets */}
            <GlassBox className="p-5" delay={0.1}>
              <div className="flex items-center gap-5 mb-3">
                {buckets.map(({ label, icon: Icon }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <span className="w-11 h-11 rounded-full bg-white/[0.08] border border-white/15 grid place-items-center text-white">
                      <Icon size={17} />
                    </span>
                    <span className="text-[10px] text-ink-100 text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-100">
                Custom Goal Buckets
              </p>
            </GlassBox>
          </div>

          {/* right stat cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatPanel label="Total Invested" value={`₹${totalInvested}`} icon={Wallet} delay={0} />
            <StatPanel
              label="Transactions"
              value={transactions.length}
              icon={BarChart3}
              caption="Long-term compounding"
              delay={0.08}
            />
            <StatPanel label="Round-Up Level" value={`₹${roundLevel}`} icon={Layers} delay={0.16} />
          </div>
        </div>

        {/* Spare Change Growth */}
        <GlassBox className="p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
                Spare Change Growth <CheckCircle2 size={18} className="text-mint-300" />
              </h2>
              <p className="text-ink-100/90 text-sm">A visual representation of gradual savings growth.</p>
            </div>

            <div className="flex items-end gap-4 h-40 overflow-x-auto">
              {coinHeights.map((height, index) => (
                <div key={index} className="flex flex-col-reverse items-center gap-2 shrink-0">
                  <div className="flex flex-col-reverse items-center gap-1">
                    {Array.from({ length: height }).map((_, coinIndex) => (
                      <div
                        key={coinIndex}
                        className="w-8 h-2 rounded-full bg-amber-300/95 border border-amber-200/50"
                      />
                    ))}
                  </div>
                  {index % 4 === 0 ? (
                    <span className="text-xl">🌱</span>
                  ) : (
                    <span className="text-sm text-ink-200">.</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </GlassBox>
      </div>
    </div>
  )
}

export default Dashboard