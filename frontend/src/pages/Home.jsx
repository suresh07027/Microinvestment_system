import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Coins, Target, TrendingUp, Bell, ArrowRight, Sparkles } from 'lucide-react'
import HeroImage3D from '../components/home/HeroImage3D'
import FeatureCard from '../components/home/FeatureCard'

function Home() {
  const navigate = useNavigate()
  const pageRef = useRef(null)

  // subtle mouse-parallax for the ambient glow orbs
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const orbX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), { stiffness: 50, damping: 20 })
  const orbY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), { stiffness: 50, damping: 20 })

  const handleMouseMove = (e) => {
    const rect = pageRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={pageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen overflow-hidden bg-base-950"
    >
      {/* ---- premium ambient background ---- */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient bg-200% animate-gradientShift opacity-90" />
        <motion.div
          style={{ x: orbX, y: orbY }}
          className="absolute top-[10%] left-[15%] w-[26rem] h-[26rem] rounded-full bg-indigo-500/20 blur-[110px]"
        />
        <motion.div
          style={{ x: useTransform(orbX, (v) => -v), y: useTransform(orbY, (v) => -v) }}
          className="absolute bottom-[8%] right-[12%] w-[24rem] h-[24rem] rounded-full bg-violet-500/20 blur-[100px]"
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] rounded-full bg-amber-400/10 blur-[100px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        {/* ---- headline ---- */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6 lg:mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel text-xs font-semibold text-indigo-300 mb-5">
            <Sparkles size={13} /> Premium micro-investing, reimagined
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-50 tracking-tight leading-tight">
            Turn spare change into <span className="text-gradient">real wealth</span>
          </h1>
          <p className="text-ink-400 max-w-xl mx-auto mt-4 text-sm sm:text-base">
            Round-ups, smart buckets, and AI-guided investments — all in one elegant platform built to grow with you.
          </p>
        </motion.div>

        {/* ---- center 3D illustration flanked by feature cards (2 left, 2 right) ---- */}
        <div className="hidden lg:grid grid-cols-[19rem_1fr_19rem] grid-rows-2 gap-6 items-center max-w-6xl mx-auto">
          <FeatureCard
            className="col-start-1 row-start-1"
            icon={Coins}
            title="Round-Up Investments"
            description="Automatically round up everyday purchases and invest the spare change effortlessly — small contributions that build long-term wealth."
            glow="amber"
            initial={{ opacity: 0, x: -40 }}
            delay={0.15}
          />
          <FeatureCard
            className="col-start-1 row-start-2"
            icon={Target}
            title="Investment Buckets"
            description="Organize investments into personalized goals — Emergency Fund, Vacation, Retirement — and track each one with confidence."
            initial={{ opacity: 0, x: -40 }}
            delay={0.3}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-start-2 row-start-1 row-span-2 w-full aspect-square"
          >
            <HeroImage3D mouseX={mouseX} mouseY={mouseY} className="w-full h-full" />
          </motion.div>

          <FeatureCard
            className="col-start-3 row-start-1"
            icon={TrendingUp}
            title="Smart Investment Options"
            description="Choose from ETFs, index funds, mutual funds, and gold — with AI-powered recommendations guiding every decision."
            glow="mint"
            initial={{ opacity: 0, x: 40 }}
            delay={0.2}
          />
          <FeatureCard
            className="col-start-3 row-start-2"
            icon={Bell}
            title="Smart Notifications"
            description="Stay informed with real-time alerts for investments, portfolio growth, goal milestones, and market updates."
            pulse
            initial={{ opacity: 0, x: 40 }}
            delay={0.35}
          />
        </div>

        {/* center illustration alone, shown pre-lg (cards move below into the stacked grid) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:hidden relative w-full max-w-[22rem] sm:max-w-md aspect-square mx-auto"
        >
          <HeroImage3D mouseX={mouseX} mouseY={mouseY} className="w-full h-full" />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 mt-8 lg:hidden">
          <FeatureCard
            icon={Coins}
            title="Round-Up Investments"
            description="Automatically round up everyday purchases and invest the spare change effortlessly."
            glow="amber"
            delay={0.05}
          />
          <FeatureCard
            icon={Target}
            title="Investment Buckets"
            description="Organize investments into personalized goals and track each one with confidence."
            delay={0.1}
          />
          <FeatureCard
            icon={TrendingUp}
            title="Smart Investment Options"
            description="Choose from ETFs, index funds, mutual funds, and gold with AI-powered recommendations."
            glow="mint"
            delay={0.15}
          />
          <FeatureCard
            icon={Bell}
            title="Smart Notifications"
            description="Stay informed with real-time alerts for investments, growth, and milestones."
            pulse
            delay={0.2}
          />
        </div>

        {/* ---- call to action ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mt-14 lg:mt-16"
        >
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-brand-gradient text-white font-semibold text-base shadow-glow-indigo"
          >
            <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-active:opacity-100 group-active:animate-ping" />
            Start Investing
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Home