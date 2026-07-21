import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { User, Mail, ShieldCheck, Save, Wallet, Receipt } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { PageHeader, StatCard, Alert, Loader } from '../../components/ui/misc'
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

function Profile() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const pageRef = useRef(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)
    setName(userData?.name || '')
    setEmail(userData?.email || '')

    fetch(`http://localhost:5000/api/transactions/${userData._id}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!user?._id) return
    setSaving(true)
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      if (res.ok) {
        const updated = await res.json()
        const merged = { ...user, name: updated.name, email: updated.email }
        localStorage.setItem('user', JSON.stringify(merged))
        setUser(merged)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.log(err)
    }
    setSaving(false)
  }

  const totalInvested = transactions.reduce((s, t) => s + (t.investedAmount || 0), 0)

  if (loading) return <Loader label="Loading your profile..." />

  const initials = (name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div ref={pageRef} className="relative -m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-6rem)] rounded-3xl">
      <PageAnimatedBackground containerRef={pageRef} />

      <div className="relative max-w-3xl">
        <PageHeader title="Profile" subtitle="Manage your account details" />

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <StatCard label="Total Invested" value={`₹${totalInvested}`} icon={Wallet} tone="indigo" />
          <StatCard label="Transactions" value={transactions.length} icon={Receipt} tone="violet" delay={0.05} />
        </div>

        <Card className="p-6 mb-6" hover={false}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center text-xl font-bold text-white shadow-glow-indigo">
              {initials}
            </div>
            <div>
              <p className="text-lg font-bold text-ink-50">{user?.name}</p>
              <p className="text-sm text-ink-400">{user?.email}</p>
            </div>
          </div>

          {success && <Alert tone="mint">✅ Profile updated successfully!</Alert>}

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Card>

        <Card className="p-6" hover={false}>
          <div className="flex items-center gap-2 text-ink-50 font-bold mb-4">
            <ShieldCheck size={17} className="text-mint-400" /> Account Security
          </div>
          <p className="text-sm text-ink-400 mb-4">
            Need to change your password? Use the secure reset flow from the login screen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <div className="flex items-center gap-2 text-ink-300 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 flex-1">
              <User size={14} className="text-ink-500" /> Account ID: {user?._id?.slice(-8) || '—'}
            </div>
            <div className="flex items-center gap-2 text-ink-300 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 flex-1">
              <Mail size={14} className="text-ink-500" /> Verified Email
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Profile