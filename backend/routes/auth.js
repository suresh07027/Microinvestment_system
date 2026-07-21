import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { sendPasswordResetEmail } from '../utils/mailer.js'

const router = express.Router()

const RESET_TOKEN_EXPIRY_MINUTES = 30
const RESET_REQUEST_COOLDOWN_SECONDS = 60
const MIN_PASSWORD_LENGTH = 8

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Request a password reset link. Always responds with a generic success
// message (whether or not the email exists) to avoid leaking which emails
// are registered.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' })
    }

    const genericResponse = {
      message: 'If an account exists for that email, a password reset link has been sent.',
    }

    const user = await User.findOne({ email }).select(
      '+resetPasswordTokenHash +resetPasswordExpires +resetPasswordLastRequestedAt'
    )

    if (!user) {
      // Don't reveal whether the account exists.
      return res.json(genericResponse)
    }

    // Basic rate limiting: prevent spamming reset requests for one account.
    if (
      user.resetPasswordLastRequestedAt &&
      Date.now() - user.resetPasswordLastRequestedAt.getTime() < RESET_REQUEST_COOLDOWN_SECONDS * 1000
    ) {
      return res.json(genericResponse)
    }

    const rawToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordTokenHash = hashToken(rawToken)
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000)
    user.resetPasswordLastRequestedAt = new Date()
    await user.save()

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const resetUrl = `${clientUrl}/reset-password/${rawToken}`

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
      expiresInMinutes: RESET_TOKEN_EXPIRY_MINUTES,
    })

    res.json(genericResponse)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Verify that a reset token is still valid (used by the Reset Password page
// on load, so the user gets immediate feedback instead of after submitting).
router.get('/reset-password/:token/valid', async (req, res) => {
  try {
    const tokenHash = hashToken(req.params.token)
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordTokenHash +resetPasswordExpires')

    res.json({ valid: !!user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Complete the reset: verify token + expiry, then set the new hashed password.
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password, confirmPassword } = req.body

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' })
    }

    const tokenHash = hashToken(req.params.token)
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordTokenHash +resetPasswordExpires')

    if (!user) {
      return res.status(400).json({
        message: 'This password reset link is invalid or has expired. Please request a new one.',
      })
    }

    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordTokenHash = null
    user.resetPasswordExpires = null
    await user.save()

    res.json({ message: 'Your password has been reset successfully. You can now log in.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router