import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Sparkles, ChevronDown, User, Settings, LogOut } from 'lucide-react'

function TopNav({ onLogout }) {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('user')))
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate('/investments')
  }

  return (
    <div className="hidden md:flex sticky top-0 z-30 items-center gap-3 px-4 py-3 mb-6 glass-panel rounded-2xl backdrop-blur-xl">
      <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions, goals, insights..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-600 outline-none transition-all duration-200 focus:border-indigo-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/10"
        />
      </form>

      <div className="flex-1" />

      <Link
        to="/ai-advisor"
        className="flex items-center gap-1.5 px-3.5 h-10 rounded-xl bg-brand-gradient text-white text-sm font-semibold shadow-glow-indigo hover:brightness-110 transition-all"
      >
        <Sparkles size={16} />
        <span className="hidden lg:inline">AI Advisor</span>
      </Link>

      <Link
        to="/notifications"
        className="relative w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] transition-colors flex items-center justify-center text-ink-300"
      >
        <Bell size={17} />
        <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]" />
      </Link>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 pl-1.5 pr-2.5 h-10 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center text-[11px] font-bold text-white">
            {initials}
          </div>
          <ChevronDown size={14} className={`text-ink-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-52 glass-panel rounded-xl p-1.5 shadow-glass z-40"
            >
              <p className="px-3 py-2 text-xs text-ink-500 truncate">{user?.email || 'Signed in'}</p>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-200 hover:text-ink-50 hover:bg-white/[0.06] transition-colors"
              >
                <User size={15} /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-200 hover:text-ink-50 hover:bg-white/[0.06] transition-colors"
              >
                <Settings size={15} /> Settings
              </Link>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-400/[0.1] transition-colors"
              >
                <LogOut size={15} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TopNav
