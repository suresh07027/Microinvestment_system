import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Users, Wallet, Receipt } from 'lucide-react'
import Card from '../../components/ui/Card'
import { PageHeader, StatCard, Table, Badge, Loader } from '../../components/ui/misc'
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

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const pageRef = useRef(null)

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(err => console.log(err))
  }, [])

  const totalInvested = users.reduce((sum, u) => sum + u.totalInvested, 0)
  const totalTransactions = users.length * 30

  if (loading) return <Loader label="Loading admin dashboard..." />

  return (
    <div ref={pageRef} className="relative -m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-6rem)] rounded-3xl">
      <PageAnimatedBackground containerRef={pageRef} />

      <div className="relative">
        <PageHeader title="Admin Dashboard" subtitle="Platform-wide overview" />

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Users" value={users.length} icon={Users} tone="indigo" />
          <StatCard label="Total Investment" value={`₹${totalInvested}`} icon={Wallet} tone="violet" delay={0.05} />
          <StatCard label="Transactions" value={totalTransactions} icon={Receipt} tone="mint" delay={0.1} />
        </div>

        {/* Users Table */}
        <Card className="p-6">
          <h3 className="font-bold text-ink-50 mb-4">Users</h3>
          <Table columns={['Name', 'Email', 'Invested', 'Round-Up Level', 'Status']}>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03] transition-colors">
                <td className="py-3 px-2 text-ink-50">{user.name}</td>
                <td className="py-3 px-2 text-ink-400">{user.email}</td>
                <td className="py-3 px-2 text-ink-200 num">₹{user.totalInvested}</td>
                <td className="py-3 px-2 text-ink-200 num">₹{user.roundUpLevel}</td>
                <td className="py-3 px-2">
                  <Badge tone={user.status === 'active' ? 'mint' : 'rose'}>{user.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard