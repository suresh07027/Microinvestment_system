import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { PageHeader, Alert, Toggle } from '../../components/ui/misc'
import { API_URL } from '../../config'
import roundUpBg from '../../assets/roundup-bg.png'

/**
 * 3D animated background image — confined to this page's own content area
 * only (not the sidebar or top nav). It's positioned `absolute` inside a
 * `relative` wrapper that this component owns, so it never escapes past
 * this page, unlike a `fixed`/portal-based background.
 */
function PageAnimatedBackground({ containerRef }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [16, -16]), { stiffness: 50, damping: 20 })
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 50, damping: 20 })
  const bgRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-2.5, 2.5]), { stiffness: 50, damping: 20 })
  const bgRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 50, damping: 20 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    }
    el.addEventListener('mousemove', handleMove)
    return () => el.removeEventListener('mousemove', handleMove)
  }, [containerRef, mouseX, mouseY])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl" style={{ perspective: 1600 }}>
      <motion.div
        className="absolute -inset-6"
        style={{
          x: bgX,
          y: bgY,
          rotateX: bgRotateX,
          rotateY: bgRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.img
          src={roundUpBg}
          alt=""
          className="w-full h-full object-cover scale-110"
          animate={{ scale: [1.1, 1.16, 1.1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* light wash, just enough for text/icon contrast (brightened so the image reads clearly) */}
      <div className="absolute inset-0 bg-base-950/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-base-950/20 via-base-950/10 to-base-950/30" />
    </div>
  )
}

/* Lighter, more see-through glass card than the default Card component,
   so the background illustration reads clearly through it. */
function GlassBox({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl bg-white/[0.07] backdrop-blur-[8px] border border-white/[0.12] overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  )
}

function RoundUpSettings() {
  const [enabled, setEnabled] = useState(true)
  const [roundLevel, setRoundLevel] = useState(10)
  const [minAmount, setMinAmount] = useState(5)
  const [maxAmount, setMaxAmount] = useState(100)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState(null)

  const pageRef = useRef(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)

    // Fetch current settings from database
    fetch(`${API_URL}/api/users/${userData._id}`)
      .then(res => res.json())
      .then(data => {
        setEnabled(data.roundUpEnabled)
        setRoundLevel(data.roundUpLevel)
        setMinAmount(data.minAmount)
        setMaxAmount(data.maxAmount)
      })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundUpEnabled: enabled,
          roundUpLevel: roundLevel,
          minAmount,
          maxAmount,
        })
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  return (
    <div ref={pageRef} className="relative -m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-6rem)] rounded-3xl">
      {/* background confined to this page's content area only — sidebar and top nav stay unaffected */}
      <PageAnimatedBackground containerRef={pageRef} />

      <div className="relative max-w-2xl">
        <PageHeader title="Round-Up Settings" subtitle="Control how your spare change is invested" />

        {success && (
          <Alert tone="mint">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} /> Settings saved successfully!
            </span>
          </Alert>
        )}

        {/* Enable/Disable */}
        <GlassBox className="p-6 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-ink-50 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">Enable Daily Round-Ups</h3>
              <p className="text-sm text-ink-200 mt-0.5">Automatically round up your transactions</p>
            </div>
            <Toggle checked={enabled} onChange={() => setEnabled(!enabled)} />
          </div>
        </GlassBox>

        {/* Rounding Level */}
        <GlassBox className="p-6 mb-4" delay={0.05}>
          <h3 className="font-semibold text-ink-50 mb-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">Rounding Level</h3>
          <div className="flex gap-3">
            {[5, 10, 20, 50].map((amount) => (
              <motion.button
                key={amount}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRoundLevel(amount)}
                className={`flex-1 py-2.5 rounded-xl border font-semibold transition-all duration-200 ${
                  roundLevel === amount
                    ? 'border-indigo-400/60 bg-indigo-500/20 text-indigo-200 shadow-glow-indigo'
                    : 'border-white/15 bg-white/[0.03] text-ink-200 hover:border-indigo-400/40 hover:text-ink-50'
                }`}
              >
                ₹{amount}
              </motion.button>
            ))}
          </div>
        </GlassBox>

        {/* Min/Max Limits */}
        <GlassBox className="p-6 mb-6" delay={0.1}>
          <h3 className="font-semibold text-ink-50 mb-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">Daily Limits</h3>
          <div className="flex gap-4">
            <Input
              label="Minimum Amount (₹)"
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
            <Input
              label="Maximum Amount (₹)"
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </GlassBox>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={loading} size="lg">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}

export default RoundUpSettings