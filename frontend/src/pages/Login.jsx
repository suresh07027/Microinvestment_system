import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Coins, AlertCircle, TrendingUp, ShieldCheck, LineChart, Sparkles } from 'lucide-react'
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

function Login({ setToken }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // ---- whole-page mouse tracking, drives both the 3D background parallax
  // and the auth card tilt so everything feels like one connected scene ----
  const pageRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // background: subtle opposite-direction drift + tilt for depth
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [24, -24]), { stiffness: 60, damping: 20 })
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), { stiffness: 60, damping: 20 })
  const bgRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-4, 4]), { stiffness: 60, damping: 20 })
  const bgRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [4, -4]), { stiffness: 60, damping: 20 })

  // card: tilt toward the cursor for a hand-held glass feel
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

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const url = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register'

    const body = isLogin
      ? { email, password }
      : { name, email, password }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token)
      navigate('/')

    } catch (err) {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div
      ref={pageRef}
      onMouseMove={handlePageMouseMove}
      onMouseLeave={handlePageMouseLeave}
      className="relative min-h-screen flex items-center justify-start p-4 md:pl-16 overflow-hidden bg-base-950"
      style={{ perspective: 1600 }}
    >
      {/* ---- 3D animated background photo ---- */}
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

        {/* readability + brand-color wash over the photo (kept light so the photo stays visible) */}
        <div className="absolute inset-0 bg-base-950/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-base-950/5 via-base-950/10 to-base-950/40" />
        <div className="absolute inset-0 bg-mesh-gradient bg-200% animate-gradientShift opacity-25 mix-blend-screen" />
        <motion.div
          className="absolute top-1/4 left-1/3 w-[28rem] h-[28rem] rounded-full bg-indigo-500/20 blur-[110px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ---- always-visible headline, independent of the background photo's own text ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-10 left-1/2 -translate-x-1/2 text-center px-4 z-10 w-full max-w-xl"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-ink-50 tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)]">
          Micro-investing made <span className="text-gradient">easy</span>
        </h1>
        <p className="text-ink-200 text-sm mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
          Start small. Grow big.
        </p>
      </motion.div>

      {/* ---- floating decorative icons scattered around the viewport ---- */}
      <Floater className="top-[12%] left-[8%] hidden lg:block" duration={6} distance={20}>
        <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-amber-400 shadow-glow-indigo">
          <Coins size={24} />
        </div>
      </Floater>
      <Floater className="top-[20%] right-[10%] hidden lg:block" duration={7} delay={0.8} distance={18} rotate={8}>
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-panel text-mint-400 text-xs font-bold shadow-glow-indigo">
          <TrendingUp size={14} /> +12.4%
        </div>
      </Floater>
      <Floater className="bottom-[18%] left-[12%] hidden lg:block" duration={5.5} delay={1.4} distance={14}>
        <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-indigo-300">
          <ShieldCheck size={20} />
        </div>
      </Floater>
      <Floater className="bottom-[26%] right-[14%] hidden lg:block" duration={6.5} delay={0.4} distance={22} rotate={-6}>
        <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-mint-400">
          <LineChart size={20} />
        </div>
      </Floater>

      <div className="w-full max-w-sm">
        {/* Auth card with interactive 3D tilt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: 'preserve-3d' }}
          className="relative w-full max-w-sm rounded-2xl glass-panel shadow-glass p-6"
        >
          {/* mouse-reactive glow spot */}
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
            <div className="flex items-center gap-2 mb-1 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <Coins size={16} className="text-white" />
              </div>
              <span className="font-bold text-ink-50">MicroInvest</span>
            </div>
            <h2 className="text-xl font-bold text-ink-50 mb-1.5">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-ink-200 mb-6 text-sm">
              {isLogin ? 'Log in to continue growing your spare change.' : 'Start investing your spare change today.'}
            </p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-rose-400/10 border border-rose-400/25 text-rose-400 px-4 py-3 rounded-xl mb-4 text-sm overflow-hidden"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Input
                      label="Full Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="placeholder:text-ink-200/80"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="placeholder:text-ink-200/80"
              />

              {isLogin && (
                <div className="flex justify-end -mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              <Button onClick={handleSubmit} disabled={loading} size="lg" className="w-full mt-1">
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
              </Button>
            </div>

            <p className="text-center text-ink-200 mt-5 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-300 font-semibold ml-1.5 hover:text-indigo-200">
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login