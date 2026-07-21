import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  SlidersHorizontal,
  Wallet,
  PiggyBank,
  Bell,
  BarChart3,
  ShieldCheck,
  LogOut,
  Coins,
  Menu,
  X,
  Sparkles,
  UserCircle2,
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Round-Up Settings', path: '/settings', icon: SlidersHorizontal },
  { label: 'Investments', path: '/investments', icon: Wallet },
  { label: 'Buckets', path: '/buckets', icon: PiggyBank },
  { label: 'AI Advisor', path: '/ai-advisor', icon: Sparkles },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Profile', path: '/profile', icon: UserCircle2 },
  { label: 'Admin', path: '/admin', icon: ShieldCheck },
]

function MobileNav({ onLogout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3.5 glass-panel rounded-2xl m-3 mb-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
            <Coins size={16} className="text-white" />
          </div>
          <span className="font-bold text-ink-50 text-sm">MicroInvest</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-ink-200 p-1">
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 h-full w-72 glass-panel z-50 p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-ink-50">Menu</span>
                <button onClick={() => setOpen(false)} className="text-ink-400">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-gradient text-white'
                          : 'text-ink-400 hover:text-ink-50 hover:bg-white/[0.05]'
                      }`}
                    >
                      <Icon size={17} />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
              <button
                onClick={onLogout}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 bg-rose-400/[0.08] border border-rose-400/[0.15]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileNav
