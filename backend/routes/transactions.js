import express from 'express'
import Transaction from '../models/Transaction.js'
import User from '../models/User.js'

const router = express.Router()

// Get all transactions for a user
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      userId: req.params.userId 
    }).sort({ date: -1 })
    res.json(transactions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add single transaction
router.post('/', async (req, res) => {
  try {
    const { userId, description, amount, category } = req.body

    // Get user's round up level
    const user = await User.findById(userId)
    const roundUpLevel = user.roundUpLevel || 10

    // Calculate round up
    const remainder = amount % roundUpLevel
    const roundUpAmount = remainder === 0 ? 0 : roundUpLevel - remainder
    const investedAmount = roundUpAmount

    // Save transaction
    const transaction = new Transaction({
      userId,
      description,
      amount,
      roundUpAmount,
      investedAmount,
      category,
    })
    await transaction.save()

    // Update user total invested
    await User.findByIdAndUpdate(userId, {
      $inc: { totalInvested: investedAmount }
    })

    res.status(201).json(transaction)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Generate mock bank transactions
router.post('/mock/generate', async (req, res) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId)
    const roundUpLevel = user.roundUpLevel || 10

    // Mock transactions list
    const mockTransactions = [
      { description: 'Swiggy Food Order', amount: 187, category: 'food' },
      { description: 'Petrol Bunk', amount: 543, category: 'transport' },
      { description: 'Big Bazaar Groceries', amount: 324, category: 'shopping' },
      { description: 'Movie Ticket - PVR', amount: 349, category: 'entertainment' },
      { description: 'Zomato Order', amount: 156, category: 'food' },
      { description: 'Uber Ride', amount: 89, category: 'transport' },
      { description: 'Amazon Purchase', amount: 1299, category: 'shopping' },
      { description: 'Electricity Bill', amount: 876, category: 'bills' },
      { description: 'Coffee - CCD', amount: 245, category: 'food' },
      { description: 'Metro Recharge', amount: 200, category: 'transport' },
    ]

    let totalInvested = 0
    const savedTransactions = []

    for (const t of mockTransactions) {
      const remainder = t.amount % roundUpLevel
      const roundUpAmount = remainder === 0 ? 0 : roundUpLevel - remainder
      const investedAmount = roundUpAmount

      const transaction = new Transaction({
        userId,
        description: t.description,
        amount: t.amount,
        roundUpAmount,
        investedAmount,
        category: t.category,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      })

      await transaction.save()
      savedTransactions.push(transaction)
      totalInvested += investedAmount
    }

    // Update user total invested
    await User.findByIdAndUpdate(userId, {
      $inc: { totalInvested }
    })

    res.status(201).json({
      message: `Generated ${savedTransactions.length} mock transactions!`,
      totalInvested,
      transactions: savedTransactions
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router