import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body)
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update user settings
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password')
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router