import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { PageHeader, Alert } from '../../components/ui/misc'
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

function Buckets() {
  const [user, setUser] = useState(null)
  const [buckets, setBuckets] = useState({
    gold: 25,
    etf: 25,
    indexFund: 25,
    debtFund: 25,
  })
  const [bucketAmounts, setBucketAmounts] = useState({
    gold: 0,
    etf: 0,
    indexFund: 0,
    debtFund: 0,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [totalInvested, setTotalInvested] = useState(0)

  const pageRef = useRef(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)

    fetch(`http://localhost:5000/api/users/${userData._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.buckets) setBuckets(data.buckets)
        if (data.bucketAmounts) setBucketAmounts(data.bucketAmounts)
        setTotalInvested(data.totalInvested || 0)
      })
  }, [])

  const totalPercentage = Object.values(buckets).reduce((sum, v) => sum + v, 0)

  const bucketInfo = [
    {
      key: 'gold',
      label: 'Gold',
      icon: '🥇',
      color: '#FBBF24',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-400/25',
      lightBg: 'bg-amber-400/[0.08]',
      description: 'Safe haven asset, good for stability',
      risk: 'Low Risk'
    },
    {
      key: 'etf',
      label: 'ETFs',
      icon: '📊',
      color: '#60A5FA',
      textColor: 'text-azure-400',
      borderColor: 'border-azure-400/25',
      lightBg: 'bg-azure-400/[0.08]',
      description: 'Exchange traded funds, diversified',
      risk: 'Medium Risk'
    },
    {
      key: 'indexFund',
      label: 'Index Fund',
      icon: '📈',
      color: '#34D399',
      textColor: 'text-mint-400',
      borderColor: 'border-mint-400/25',
      lightBg: 'bg-mint-400/[0.08]',
      description: 'Tracks market index like Nifty 50',
      risk: 'Medium Risk'
    },
    {
      key: 'debtFund',
      label: 'Debt Fund',
      icon: '🏦',
      color: '#A78BFA',
      textColor: 'text-violet-400',
      borderColor: 'border-violet-400/25',
      lightBg: 'bg-violet-400/[0.08]',
      description: 'Fixed income, stable returns',
      risk: 'Low Risk'
    },
  ]

  const handleSliderChange = (key, value) => {
    const newBuckets = { ...buckets, [key]: Number(value) }
    setBuckets(newBuckets)
  }

  const handleSave = async () => {
    if (totalPercentage !== 100) return
    setLoading(true)

    // Calculate bucket amounts based on percentages
    const newBucketAmounts = {
      gold: Math.round((buckets.gold / 100) * totalInvested),
      etf: Math.round((buckets.etf / 100) * totalInvested),
      indexFund: Math.round((buckets.indexFund / 100) * totalInvested),
      debtFund: Math.round((buckets.debtFund / 100) * totalInvested),
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buckets,
          bucketAmounts: newBucketAmounts,
        })
      })

      if (res.ok) {
        setBucketAmounts(newBucketAmounts)
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
      <PageAnimatedBackground containerRef={pageRef} />

      <div className="relative max-w-3xl">
        <PageHeader
          title="Investment Buckets"
          subtitle={`Allocate your ₹${totalInvested} spare change across different instruments`}
        />

        {success && (
          <Alert tone="mint">
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} /> Bucket allocation saved successfully!</span>
          </Alert>
        )}

        {totalPercentage !== 100 && (
          <Alert tone="rose">
            <span className="inline-flex items-center gap-2">
              <AlertTriangle size={16} /> Total allocation must be 100%. Currently: {totalPercentage}%
            </span>
          </Alert>
        )}

        {/* Bucket Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {bucketInfo.map((bucket, i) => (
            <Card key={bucket.key} className={`p-6 border ${bucket.borderColor}`} hover={false}>
              <motion.div initial="hidden" animate="visible" transition={{ delay: i * 0.05 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{bucket.icon}</span>
                    <div>
                      <h3 className="font-bold text-ink-50">{bucket.label}</h3>
                      <p className="text-xs text-ink-500">{bucket.risk}</p>
                    </div>
                  </div>
                  <span className={`text-2xl font-bold num ${bucket.textColor}`}>
                    {buckets[bucket.key]}%
                  </span>
                </div>

                <p className="text-sm text-ink-400 mb-4">{bucket.description}</p>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={buckets[bucket.key]}
                  onChange={(e) => handleSliderChange(bucket.key, e.target.value)}
                  className="w-full"
                  style={{ accentColor: bucket.color }}
                />

                <div className={`mt-4 ${bucket.lightBg} rounded-xl p-3 border border-white/[0.06]`}>
                  <p className="text-xs text-ink-500">Allocated Amount</p>
                  <p className={`text-lg font-bold num ${bucket.textColor}`}>
                    ₹{Math.round((buckets[bucket.key] / 100) * totalInvested)}
                  </p>
                </div>
              </motion.div>
            </Card>
          ))}
        </div>

        {/* Allocation Summary */}
        <Card className="p-6 mb-6">
          <h3 className="font-bold text-ink-50 mb-4">Allocation Summary</h3>
          <div className="flex h-4 rounded-full overflow-hidden mb-5 bg-white/[0.06]">
            {bucketInfo.map((bucket) => (
              <motion.div
                key={bucket.key}
                className="h-full"
                style={{ backgroundColor: bucket.color }}
                animate={{ width: `${buckets[bucket.key]}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {bucketInfo.map((bucket) => (
              <div key={bucket.key} className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{ backgroundColor: bucket.color }} />
                <p className="text-xs text-ink-500">{bucket.label}</p>
                <p className="text-sm font-bold text-ink-50 num">{buckets[bucket.key]}%</p>
                <p className="text-xs text-ink-500 num">
                  ₹{Math.round((buckets[bucket.key] / 100) * totalInvested)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={loading || totalPercentage !== 100} size="lg">
          {loading ? 'Saving...' : 'Save Allocation'}
        </Button>
      </div>
    </div>
  )
}

export default Buckets