import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/layout/Sidebar'
import MobileNav from './components/layout/MobileNav'
import TopNav from './components/layout/TopNav'
import Background from './components/ui/Background'
import Dashboard from './pages/user/Dashboard'
import RoundUpSettings from './pages/user/RoundUpSettings'
import AdminDashboard from './pages/admin/AdminDashboard'
import Notifications from './pages/user/Notifications'
import Analytics from './pages/user/Analytics'
import Investments from './pages/user/Investments'
import Buckets from './pages/user/Buckets'
import AIAdvisor from './pages/user/AIAdvisor'
import Profile from './pages/user/Profile'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AuthenticatedApp({ onLogout }) {
  const location = useLocation()

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav onLogout={onLogout} />
        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          <TopNav onLogout={onLogout} />
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<RoundUpSettings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/buckets" element={<Buckets />} />
                <Route path="/ai-advisor" element={<AIAdvisor />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleLogout = () => {
    localStorage.clear()
    setToken(null)
  }

  return (
    <>
      <Background />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/*"
          element={token ? <AuthenticatedApp onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  )
}

export default App