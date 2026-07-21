import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import {
  Sparkles, ShieldCheck, TrendingUp, Lightbulb, Gauge, FileText, Flame, Target, Wallet,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import { PageHeader, Badge, Loader } from '../../components/ui/misc'
import { GlassTooltip, chartGrid, chartAxisTick } from '../../components/ui/chartTheme.jsx'
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

function AIAdvisor() {
  const [transactions, setTransactions] = useState([])
  const [buckets, setBuckets] = useState(null)
  const [loading, setLoading] = useState(true)

  const pageRef = useRef(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))

    Promise.all([
      fetch(`http://localhost:5000/api/transactions/${userData._id}`).then((r) => r.json()).catch(() => []),
      fetch(`http://localhost:5000/api/users/${userData._id}`).then((r) => r.json()).catch(() => ({})),
    ]).then(([txns, userDoc]) => {
      setTransactions(Array.isArray(txns) ? txns : [])
      if (userDoc?.buckets) setBuckets(userDoc.buckets)
      setLoading(false)
    })
  }, [])

  const insights = useMemo(() => {
    const totalInvested = transactions.reduce((s, t) => s + (t.investedAmount || 0), 0)
    const totalSpent = transactions.reduce((s, t) => s + (t.amount || 0), 0)
    const count = transactions.length
    const avgRoundUp = count ? totalInvested / count : 0
    const savingsRate = totalSpent ? Math.min(100, (totalInvested / totalSpent) * 100) : 0

    // Health score heuristic: blends consistency, savings rate and activity
    const healthScore = Math.max(
      8,
      Math.min(98, Math.round(savingsRate * 0.5 + Math.min(count, 30) * 1.2 + (avgRoundUp > 0 ? 10 : 0)))
    )

    const b = buckets || { gold: 25, etf: 25, indexFund: 25, debtFund: 25 }
    const riskData = [
      { name: 'Gold', risk: 'Low', value: b.gold ?? 0, fill: '#FBBF24' },
      { name: 'Debt Fund', risk: 'Low', value: b.debtFund ?? 0, fill: '#4ADE80' },
      { name: 'Index Fund', risk: 'Medium', value: b.indexFund ?? 0, fill: '#60A5FA' },
      { name: 'ETFs', risk: 'Medium-High', value: b.etf ?? 0, fill: '#A78BFA' },
    ]
    const weightedRisk = (b.etf ?? 0) * 0.9 + (b.indexFund ?? 0) * 0.6 + (b.gold ?? 0) * 0.2 + (b.debtFund ?? 0) * 0.15
    const riskLabel = weightedRisk > 65 ? 'Aggressive' : weightedRisk > 40 ? 'Balanced' : 'Conservative'

    return { totalInvested, totalSpent, count, avgRoundUp, savingsRate, healthScore, riskData, riskLabel }
  }, [transactions, buckets])

  if (loading) return <Loader label="AI Advisor is analyzing your portfolio..." />

  const gaugeData = [{ name: 'score', value: insights.healthScore, fill: 'url(#healthGrad)' }]

  const recTone = {
    indigo: 'text-indigo-400',
    amber: 'text-amber-400',
    mint: 'text-mint-400',
  }

  const recommendations = [
    {
      icon: Target,
      tone: 'indigo',
      title: 'Raise your round-up ceiling',
      body: `You're rounding up an average of ₹${insights.avgRoundUp.toFixed(1)} per purchase. Nudging your max round-up slightly could meaningfully grow your investment pace without changing your spending habits.`,
    },
    {
      icon: Flame,
      tone: 'amber',
      title: 'Keep the streak alive',
      body: `You've logged ${insights.count} round-up transactions. Consistency compounds — a steady weekly cadence tends to outperform occasional large top-ups over the long run.`,
    },
    {
      icon: Wallet,
      tone: 'mint',
      title: 'Diversify spare change further',
      body: 'Consider spreading new contributions slightly more toward index funds for long-term stability alongside your existing allocation.',
    },
  ]

  const tips = [
    'Automate a small weekly top-up so investing never depends on remembering to do it.',
    'Review your bucket allocation every quarter as your goals shift.',
    'Small, frequent contributions usually beat rare, large ones thanks to rupee-cost averaging.',
    'Keep at least one low-risk bucket (gold or debt fund) as a stability anchor.',
  ]

  return (
    <div ref={pageRef} className="relative -m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-6rem)] rounded-3xl">
      <PageAnimatedBackground containerRef={pageRef} />

      <div className="relative">
        <PageHeader
          title="AI Advisor"
          subtitle="Personalized insights generated from your investing activity"
          action={<Badge tone="violet">✨ Beta</Badge>}
        />

        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {/* Portfolio Health Score */}
          <Card className="p-6 lg:col-span-1 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-ink-400 text-xs font-medium uppercase tracking-wide mb-1">
              <Gauge size={14} /> Portfolio Health Score
            </div>
            <div className="relative w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="72%"
                  outerRadius="100%"
                  data={gaugeData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <defs>
                    <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background={{ fill: 'rgba(255,255,255,0.06)' }} dataKey="value" cornerRadius={12} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold num text-ink-50">{insights.healthScore}</span>
                <span className="text-ink-500 text-xs">out of 100</span>
              </div>
            </div>
            <p className="text-sm text-ink-400 mt-2">
              {insights.healthScore >= 70
                ? 'Excellent momentum — keep it up!'
                : insights.healthScore >= 40
                ? 'Solid foundation, room to grow.'
                : 'Just getting started — small steps count.'}
            </p>
          </Card>

          {/* AI Investment Insights */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 text-ink-50 font-bold mb-4">
              <Sparkles size={17} className="text-violet-400" /> AI Investment Insights
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                <p className="text-ink-400 text-xs uppercase tracking-wide mb-1">Savings Rate</p>
                <p className="text-2xl font-bold num text-mint-400">{insights.savingsRate.toFixed(0)}%</p>
                <p className="text-ink-500 text-xs mt-1">of spending redirected to investing</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                <p className="text-ink-400 text-xs uppercase tracking-wide mb-1">Risk Profile</p>
                <p className="text-2xl font-bold text-indigo-300">{insights.riskLabel}</p>
                <p className="text-ink-500 text-xs mt-1">based on current bucket allocation</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                <p className="text-ink-400 text-xs uppercase tracking-wide mb-1">Avg Round-Up</p>
                <p className="text-2xl font-bold num text-ink-50">₹{insights.avgRoundUp.toFixed(1)}</p>
                <p className="text-ink-500 text-xs mt-1">per transaction</p>
              </div>
            </div>
            <p className="text-sm text-ink-400 mt-4 leading-relaxed">
              Based on <span className="text-ink-200 font-medium">{insights.count} transactions</span>, your spare-change
              investing has grown to <span className="text-ink-200 font-medium">₹{insights.totalInvested.toFixed(0)}</span>.
              Your habits point to a <span className="text-ink-200 font-medium">{insights.riskLabel.toLowerCase()}</span>{' '}
              approach — well matched for steady, long-term compounding.
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          {/* Risk Analysis */}
          <Card className="p-6">
            <div className="flex items-center gap-2 text-ink-50 font-bold mb-4">
              <ShieldCheck size={17} className="text-azure-400" /> Risk Analysis
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={insights.riskData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid.stroke} horizontal={false} />
                <XAxis type="number" tick={chartAxisTick} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="name" tick={chartAxisTick} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<GlassTooltip formatter={(v, n) => [`${v}%`, n]} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Smart Savings Recommendations */}
          <Card className="p-6">
            <div className="flex items-center gap-2 text-ink-50 font-bold mb-4">
              <TrendingUp size={17} className="text-mint-400" /> Smart Savings Recommendations
            </div>
            <div className="flex flex-col gap-3">
              {recommendations.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="flex gap-3 rounded-xl bg-white/[0.04] border border-white/10 p-3.5"
                >
                  <div className={`p-2 h-fit rounded-lg bg-white/[0.06] border border-white/10 ${recTone[r.tone]}`}>
                    <r.icon size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-50">{r.title}</p>
                    <p className="text-xs text-ink-400 mt-1 leading-relaxed">{r.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Financial Tips */}
          <Card className="p-6">
            <div className="flex items-center gap-2 text-ink-50 font-bold mb-4">
              <Lightbulb size={17} className="text-amber-400" /> Financial Tips
            </div>
            <ul className="flex flex-col gap-2.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-ink-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gradient shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          {/* Monthly AI Report */}
          <Card className="p-6">
            <div className="flex items-center gap-2 text-ink-50 font-bold mb-4">
              <FileText size={17} className="text-violet-400" /> Monthly AI Report
            </div>
            <p className="text-sm text-ink-300 leading-relaxed">
              This month you recorded <span className="text-ink-50 font-semibold">{insights.count}</span> transactions
              totaling <span className="text-ink-50 font-semibold">₹{insights.totalSpent.toFixed(0)}</span> in spending,
              with <span className="text-mint-400 font-semibold">₹{insights.totalInvested.toFixed(0)}</span> automatically
              invested through round-ups. Your portfolio health score sits at{' '}
              <span className="text-ink-50 font-semibold">{insights.healthScore}/100</span>, reflecting a{' '}
              <span className="text-ink-50 font-semibold">{insights.riskLabel.toLowerCase()}</span> approach to your
              bucket allocation.
            </p>
            <p className="text-sm text-ink-400 mt-3">
              Keep going — consistent small contributions compound meaningfully over time.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AIAdvisor