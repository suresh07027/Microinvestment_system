import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Wallet, TrendingDown, Receipt, Sparkles } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input, { Select } from '../../components/ui/Input'
import { PageHeader, StatCard, Alert, Table, Badge, Loader } from '../../components/ui/misc'
import investmentsBg from '../../assets/roundup-bg.png'

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
        className="absolute -inset-2"
        style={{
          x: bgX,
          y: bgY,
          rotateX: bgRotateX,
          rotateY: bgRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.img
          src={investmentsBg}
          alt=""
          className="w-full h-full object-cover scale-100"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* light wash, just enough for text/icon contrast */}
      <div className="absolute inset-0 bg-base-950/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-base-950/20 via-base-950/10 to-base-950/30" />
    </div>
  )
}

function Investments() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [adding, setAdding] = useState(false)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState(null)

  const pageRef = useRef(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)
    fetchTransactions(userData._id)
  }, [])

  const fetchTransactions = (userId) => {
    fetch(`http://localhost:5000/api/transactions/${userId}`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data)
        setLoading(false)
      })
  }

  const handleAddTransaction = async () => {
    if (!description || !amount) return
    setAdding(true)

    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          description,
          amount: Number(amount),
          category,
        })
      })

      if (res.ok) {
        setSuccess(true)
        setDescription('')
        setAmount('')
        fetchTransactions(user._id)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.log(err)
    }
    setAdding(false)
  }

  const totalInvested = transactions.reduce((sum, t) => sum + t.investedAmount, 0)
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)

  if (loading) return <Loader label="Loading your investments..." />

  return (
    <div ref={pageRef} className="relative -m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-6rem)] rounded-3xl">
      {/* background confined to this page's content area only — sidebar and top nav stay unaffected */}
      <PageAnimatedBackground containerRef={pageRef} />

      <div className="relative">
        <PageHeader title="Investments" subtitle="Track spending and spare-change investing" />

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Invested" value={`₹${totalInvested}`} icon={Wallet} tone="indigo" />
          <StatCard label="Total Spent" value={`₹${totalSpent}`} icon={TrendingDown} tone="rose" delay={0.05} />
          <StatCard label="Transactions" value={transactions.length} icon={Receipt} tone="violet" delay={0.1} />
        </div>

        {/* Add Transaction */}
        <Card className="p-6 mb-6">
          <h3 className="font-bold text-ink-50 mb-4">Add New Transaction</h3>

          {success && <Alert tone="mint">✅ Transaction added and spare change invested!</Alert>}

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <Input
              label="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Swiggy Order"
            />
            <Input
              label="Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 187"
            />
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="shopping">Shopping</option>
              <option value="bills">Bills</option>
              <option value="entertainment">Entertainment</option>
              <option value="general">General</option>
            </Select>
          </div>

          {/* Round up preview */}
          <AnimatePresence>
            {amount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-xl px-4 py-3 mb-4 text-sm text-indigo-300">
                  <Sparkles size={16} className="shrink-0" />
                  ₹{amount} will be rounded up to ₹{Math.ceil(amount / 10) * 10} — investing ₹{Math.ceil(amount / 10) * 10 - amount} spare change!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button onClick={handleAddTransaction} disabled={adding}>
            {adding ? 'Adding...' : '+ Add Transaction'}
          </Button>
        </Card>

        {/* Transactions List */}
        <Card className="p-6">
          <h3 className="font-bold text-ink-50 mb-4">All Transactions</h3>
          <Table columns={['Description', 'Amount', 'Invested', 'Category', 'Date']}>
            {transactions.map((t) => (
              <tr key={t._id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03] transition-colors">
                <td className="py-3 px-2 text-ink-50">{t.description}</td>
                <td className="py-3 px-2 text-ink-200 num">₹{t.amount}</td>
                <td className="py-3 px-2 text-mint-400 font-semibold num">+₹{t.investedAmount}</td>
                <td className="py-3 px-2"><Badge tone="indigo">{t.category}</Badge></td>
                <td className="py-3 px-2 text-ink-500 text-sm whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  )
}

export default Investments