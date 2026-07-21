import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  Sparkles,
  UserCircle2,
} from 'lucide-react'

function Sidebar({ onLogout }) {
  const location = useLocation()

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

  return (
    <div className="hidden md:flex w-64 shrink-0 min-h-screen sticky top-0 flex-col p-5">
      <div className="flex flex-col h-full glass-panel rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-8 px-1">
          <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-indigo">
            <Coins size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink-50 tracking-tight leading-none">MicroInvest</h2>
            <p className="text-[11px] text-ink-500 mt-0.5">Spare change, invested</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link key={item.path} to={item.path} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-brand-gradient shadow-glow-indigo"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <div
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-ink-400 hover:text-ink-50 hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon size={17} strokeWidth={2} />
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        <button
          onClick={onLogout}
          className="mt-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 bg-rose-400/[0.08] border border-rose-400/[0.15] hover:bg-rose-400/[0.15] transition-colors duration-200"
        >
          <LogOut size={16} strokeWidth={2} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
