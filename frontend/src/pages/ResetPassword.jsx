import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins, AlertCircle, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Loader } from '../components/ui/misc'

const MIN_PASSWORD_LENGTH = 8

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [checkingToken, setCheckingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/reset-password/${token}/valid`)
      .then((res) => res.json())
      .then((data) => {
        setTokenValid(!!data.valid)
        setCheckingToken(false)
      })
      .catch(() => {
        setTokenValid(false)
        setCheckingToken(false)
      })
  }, [token])

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => navigate('/login'), 3000)
    return () => clearTimeout(timer)
  }, [success, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Could not reset your password. Please try again.')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Could not reach the server. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 w-full max-w-md" hover={false}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
            <Coins size={16} className="text-white" />
          </div>
          <span className="font-bold text-ink-50">MicroInvest</span>
        </div>

        {checkingToken ? (
          <Loader label="Verifying your link..." />
        ) : !tokenValid ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-400/15 border border-rose-400/25 flex items-center justify-center mb-4">
              <ShieldAlert size={22} className="text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-ink-50 mb-1.5">Link expired or invalid</h2>
            <p className="text-ink-400 text-sm mb-6">
              This password reset link is no longer valid. Reset links expire after 30 minutes for your security —
              please request a new one.
            </p>
            <Link to="/forgot-password">
              <Button className="w-full">Request a new link</Button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-xl font-bold text-ink-50 mb-1.5 mt-4">Set a new password</h2>
                <p className="text-ink-400 mb-6 text-sm">
                  Choose a strong password with at least {MIN_PASSWORD_LENGTH} characters.
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 bg-rose-400/10 border border-rose-400/25 text-rose-400 px-4 py-3 rounded-xl mb-4 text-sm overflow-hidden"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoFocus
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />

                  <Button type="submit" disabled={loading} size="lg" className="w-full mt-1">
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <div className="w-12 h-12 rounded-2xl bg-mint-500/15 border border-mint-400/25 flex items-center justify-center mb-4">
                  <CheckCircle2 size={22} className="text-mint-400" />
                </div>
                <h2 className="text-xl font-bold text-ink-50 mb-1.5">Password reset!</h2>
                <p className="text-ink-400 text-sm mb-6">
                  Your password has been updated successfully. Redirecting you to login...
                </p>
                <Link to="/login">
                  <Button className="w-full">Go to login now</Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {!checkingToken && tokenValid && (
          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-ink-400 hover:text-ink-50 mt-6 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        )}
      </Card>
    </div>
  )
}

export default ResetPassword
