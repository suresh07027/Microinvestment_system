import { useState, useEffect, useRef } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Wallet, Calculator, Receipt } from 'lucide-react'
import Card from '../../components/ui/Card'
import { PageHeader, StatCard, Loader } from '../../components/ui/misc'
import { GlassTooltip, CHART_COLORS, chartGrid, chartAxisTick } from '../../components/ui/chartTheme.jsx'
import { API_URL } from '../../config'
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

function Analytics() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const pageRef = useRef(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    fetch(`${API_URL}/api/transactions/${userData._id}`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data)
        setLoading(false)
      })
  }, [])

  // Category data for pie chart
  const categoryData = transactions.reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.category)
    if (existing) {
      existing.value += t.investedAmount
    } else {
      acc.push({ name: t.category, value: t.investedAmount })
    }
    return acc
  }, [])

  // Weekly data for bar chart
  const weeklyData = [
    { day: 'Mon', invested: 0 },
    { day: 'Tue', invested: 0 },
    { day: 'Wed', invested: 0 },
    { day: 'Thu', invested: 0 },
    { day: 'Fri', invested: 0 },
    { day: 'Sat', invested: 0 },
    { day: 'Sun', invested: 0 },
  ]

  transactions.forEach(t => {
    const day = new Date(t.date).getDay()
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayName = days[day]
    const found = weeklyData.find(d => d.day === dayName)
    if (found) found.invested += t.investedAmount
  })

  const COLORS = CHART_COLORS

  const totalInvested = transactions.reduce((sum, t) => sum + t.investedAmount, 0)
  const avgPerTransaction = transactions.length > 0
    ? (totalInvested / transactions.length).toFixed(1)
    : 0

  if (loading) return <Loader label="Crunching your numbers..." />

  return (
    <div ref={pageRef} className="relative -m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-6rem)] rounded-3xl">
      <PageAnimatedBackground containerRef={pageRef} />

      <div className="relative">
        <PageHeader title="Analytics" subtitle="Your investment insights" />

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Invested" value={`₹${totalInvested}`} icon={Wallet} tone="indigo" />
          <StatCard label="Avg per Transaction" value={`₹${avgPerTransaction}`} icon={Calculator} tone="violet" delay={0.05} />
          <StatCard label="Total Transactions" value={transactions.length} icon={Receipt} tone="mint" delay={0.1} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <Card className="p-6">
            <h3 className="font-bold text-ink-50 mb-4">Investment by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  stroke="rgba(7,8,15,0.8)"
                  strokeWidth={2}
                  label={({ name, value }) => `${name}: ₹${value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<GlassTooltip formatter={(v) => [`₹${v}`, 'Invested']} />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Bar Chart */}
          <Card className="p-6">
            <h3 className="font-bold text-ink-50 mb-4">Weekly Investment</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid.stroke} vertical={false} />
                <XAxis dataKey="day" tick={chartAxisTick} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip content={<GlassTooltip formatter={(v) => [`₹${v}`, 'Invested']} />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="invested" fill="url(#barFill)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="p-6">
          <h3 className="font-bold text-ink-50 mb-4">Category Breakdown</h3>
          <div className="flex flex-col gap-3">
            {categoryData.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-ink-300 capitalize flex-1 text-sm">{cat.name}</span>
                <span className="font-semibold text-ink-50 num text-sm">₹{cat.value}</span>
                <div className="w-32 bg-white/[0.06] rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.value / totalInvested) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Analytics