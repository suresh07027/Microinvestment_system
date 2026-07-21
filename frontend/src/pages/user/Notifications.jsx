import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Wallet, Receipt } from 'lucide-react'
import Card from '../../components/ui/Card'
import { PageHeader, StatCard } from '../../components/ui/misc'
import roundUpBg from '../../assets/roundup-bg.png'

/**
 * 3D animated background image — confined to this page's own content area
 * only (not the sidebar or top nav). Positioned `absolute` inside a
 * `relative` wrapper this component owns, so it never bleeds into the
 * rest of the app shell.
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

      {/* light wash, just enough for text/icon contrast */}
      <div className="absolute inset-0 bg-base-950/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-base-950/20 via-base-950/10 to-base-950/30" />
    </div>
  )
}

function Notifications() {
  const [transactions, setTransactions] = useState([])
  const [user, setUser] = useState(null)

  const pageRef = useRef(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)

    fetch(`http://localhost:5000/api/transactions/${userData._id}`)
      .then(res => res.json())
      .then(data => setTransactions(data))
  }, [])

  const totalInvested = transactions.reduce((sum, t) => sum + t.investedAmount, 0)
  const todayTransactions = transactions.filter(t => {
    const today = new Date()
    const tDate = new Date(t.date)
    return tDate.toDateString() === today.toDateString()
  })

  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: '💰',
      title: 'Investment Milestone!',
      message: `You have invested ₹${totalInvested} through spare change!`,
      time: 'Just now'
    },
    {
      id: 2,
      type: 'info',
      icon: '🔥',
      title: 'Investment Streak!',
      message: `You have ${transactions.length} transactions rounded up successfully!`,
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'warning',
      icon: '🎯',
      title: 'Goal Progress',
      message: `You are ${Math.min(totalInvested, 100)}/100 towards your ₹100 goal!`,
      time: '2 hours ago'
    },
    {
      id: 4,
      type: 'success',
      icon: '📈',
      title: 'Round-Up Active',
      message: 'Your daily round-ups are working perfectly!',
      time: 'Today'
    },
    {
      id: 5,
      type: 'info',
      icon: '💡',
      title: 'Tip of the day',
      message: 'Increase your round-up level to ₹50 to invest more every day!',
      time: 'Today'
    },
  ]

  const getTypeStyles = (type) => {
    switch(type) {
      case 'success': return 'bg-mint-500/[0.07] border-mint-400/20'
      case 'warning': return 'bg-amber-400/[0.07] border-amber-400/20'
      case 'info': return 'bg-indigo-500/[0.07] border-indigo-400/20'
      default: return 'bg-white/[0.04] border-white/10'
    }
  }

  return (
    <div ref={pageRef} className="relative -m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-6rem)] rounded-3xl">
      <PageAnimatedBackground containerRef={pageRef} />

      <div className="relative max-w-2xl">
        <PageHeader title="Notifications" subtitle="Your investment alerts and updates" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard label="Total Invested" value={`₹${totalInvested}`} icon={Wallet} tone="indigo" />
          <StatCard label="Total Transactions" value={transactions.length} icon={Receipt} tone="violet" delay={0.05} />
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-3">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className={`border rounded-2xl p-4 backdrop-blur-xl ${getTypeStyles(n.type)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{n.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-ink-50">{n.title}</h3>
                    <span className="text-xs text-ink-500 whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-sm text-ink-400 mt-1">{n.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Notifications