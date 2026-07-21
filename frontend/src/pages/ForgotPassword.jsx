import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Coins, AlertCircle, KeyRound, Mail, Send, MailCheck, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import loginBg from '../assets/login-bg.png'

/** A single floating decorative element (icon / badge) that drifts up & down forever. */
function Floater({ children, className = '', duration = 5, delay = 0, distance = 16, rotate = 0 }) {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${className}`}
      animate={{
        y: [0, -distance, 0],
        rotate: rotate ? [0, rotate, 0] : 0,
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // ---- whole-page mouse tracking, same 3D scene as the login page ----
  const pageRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [24, -24]), { stiffness: 60, damping: 20 })
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), { stiffness: 60, damping: 20 })
  const bgRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-4, 4]), { stiffness: 60, damping: 20 })
  const bgRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [4, -4]), { stiffness: 60, damping: 20 })

  const cardRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 })
  const cardRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 })
  const glowX = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%'])
  const glowY = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%'])

  const handlePageMouseMove = (e) => {
    const rect = pageRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handlePageMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      // small delay so the paper-plane send animation gets to play out
      setTimeout(() => {
        setSubmitted(true)
        setLoading(false)
      }, 700)
    } catch (err) {
      setError('Could not reach the server. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      ref={pageRef}
      onMouseMove={handlePageMouseMove}
      onMouseLeave={handlePageMouseLeave}
      className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-base-950"
      style={{ perspective: 1600 }}
    >
      {/* ---- 3D animated background photo, lightened so the photo reads brighter ---- */}
      <div className="absolute inset-0 -z-10 overflow-hidden" style={{ perspective: 1600 }}>
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
            src={loginBg}
            alt=""
            className="w-full h-full object-cover scale-110"
            animate={{ scale: [1.1, 1.18, 1.1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-base-950/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-base-950/15 via-base-950/15 to-base-950/45" />
        <div className="absolute inset-0 bg-mesh-gradient bg-200% animate-gradientShift opacity-[0.18] mix-blend-screen" />
        <motion.div
          className="absolute top-1/4 right-1/3 w-[26rem] h-[26rem] rounded-full bg-violet-500/12 blur-[110px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-[22rem] h-[22rem] rounded-full bg-indigo-500/12 blur-[100px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ---- floating decorative icons — mail / security themed ---- */}
      <Floater className="top-[14%] left-[10%] hidden lg:block" duration={6} distance={20}>
        <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-indigo-300 shadow-glow-indigo">
          <Mail size={24} />
        </div>
      </Floater>
      <Floater className="top-[18%] right-[12%] hidden lg:block" duration={7} delay={0.8} distance={18} rotate={8}>
        <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-amber-400">
          <KeyRound size={20} />
        </div>
      </Floater>
      <Floater className="bottom-[20%] left-[14%] hidden lg:block" duration={5.5} delay={1.4} distance={14}>
        <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-mint-400">
          <ShieldCheck size={20} />
        </div>
      </Floater>
      <Floater className="bottom-[24%] right-[16%] hidden lg:block" duration={6.5} delay={0.4} distance={22} rotate={-6}>
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-panel text-violet-300 text-xs font-bold shadow-glow-indigo">
          <Sparkles size={13} /> Secure reset
        </div>
      </Floater>

      {/* ---- auth card with interactive 3D tilt — smaller, bold text throughout ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full max-w-sm rounded-2xl glass-panel shadow-glass p-6 font-bold"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-70"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) => `radial-gradient(240px circle at ${gx} ${gy}, rgba(129,140,248,0.18), transparent 70%)`
            ),
          }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-base-950/25" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-card-sheen opacity-60" />

        <div className="relative" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Coins size={16} className="text-white" />
            </div>
            <span className="font-bold text-ink-50">MicroInvest</span>
          </div>

          {/* ---- floating 3D envelope hero, sits above the form ---- */}
          <div className="relative w-full h-24 mb-2 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-brand-gradient blur-[40px] opacity-30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="envelope"
                  initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: [0, 4, 0, -4, 0],
                    y: [0, -8, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.5, x: 120, y: -60, rotate: 30, transition: { duration: 0.5, ease: 'easeIn' } }}
                  transition={{
                    rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 },
                  }}
                  className="relative w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-indigo-300 shadow-glow-indigo"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  {loading ? <Send size={22} className="animate-pulse" /> : <Mail size={22} />}
                </motion.div>
              ) : (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="relative w-14 h-14 rounded-2xl bg-mint-500/15 border border-mint-400/30 flex items-center justify-center text-mint-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <motion.span
                    className="absolute inset-0 rounded-2xl border border-mint-400/50"
                    animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <MailCheck size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-ink-50 mb-1.5 text-center">Forgot your password?</h2>
                <p className="text-ink-200 mb-5 text-sm font-bold text-center">
                  Enter the email linked to your account and we'll send a secure reset link your way.
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 bg-rose-400/10 border border-rose-400/25 text-rose-400 px-4 py-3 rounded-xl mb-4 text-sm font-bold overflow-hidden"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    autoFocus
                    className="font-bold"
                  />

                  <Button type="submit" disabled={loading} size="lg" className="w-full mt-1 font-bold">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Send size={16} className="animate-pulse" /> Sending link...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <h2 className="text-lg font-bold text-ink-50 mb-1.5">Check your inbox</h2>
                <p className="text-ink-200 text-sm font-bold mb-1">
                  If an account exists for <span className="text-ink-50">{email}</span>, we've sent a
                  password reset link to it.
                </p>
                <p className="text-ink-300 text-xs font-bold mb-5">
                  The link expires in 30 minutes. Didn't get it? Check spam, or try again.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSubmitted(false)
                    setEmail('')
                  }}
                  className="w-full font-bold"
                >
                  Try a different email
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm font-bold text-ink-200 hover:text-ink-50 mt-5 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword